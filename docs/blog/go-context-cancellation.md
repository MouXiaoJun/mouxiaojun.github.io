# Context 不是参数搬运工：取消传播、超时预算与 goroutine 生命周期

Go 后端项目里经常看到这样的代码：

```go
func (s *Service) Do(ctx context.Context, req Request) error
```

所有层都带 `ctx`，但真正出了问题才发现：客户端已经断开，SQL 还在跑；Handler 返回了，后台 goroutine 还活着；第三方 HTTP 请求卡了几十秒。

`context.Context` 的核心价值不是“传 traceID”，而是：

> **把一次工作的生命周期传播到所有会阻塞、等待或产生子任务的地方。**

## 一次 HTTP 请求的生命周期

标准库会给每个请求一个 Context：

```go
func handler(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()
}
```

客户端断开、服务器取消请求时，这个 Context 会 Done。

正确的调用链应该继续传下去：

```text
HTTP Request Context
        ↓
Handler
        ↓
Service
        ↓
Repository ──> QueryContext
        ↓
HTTP Client ─> NewRequestWithContext
```

不要在中途重新换成：

```go
context.Background()
```

否则生命周期链被切断。

## 一个常见错误

```go
func (s *Service) Sync(ctx context.Context, id int64) error {
    user, err := s.repo.Find(context.Background(), id)
    if err != nil {
        return err
    }
    return s.remote.Push(context.Background(), user)
}
```

Handler 的请求即使已经取消，数据库和 remote call 仍然认为工作有效。

应该是：

```go
func (s *Service) Sync(ctx context.Context, id int64) error {
    user, err := s.repo.Find(ctx, id)
    if err != nil {
        return err
    }
    return s.remote.Push(ctx, user)
}
```

## 超时不是每层都随便写一个 5 秒

假设入口总预算是 3 秒：

```go
ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
defer cancel()
```

Service 内部再写：

```go
context.WithTimeout(ctx, 10*time.Second)
```

并不会真的给它 10 秒，因为 child context 不会超过 parent deadline。

更值得做的是给关键依赖一个**更小的局部预算**：

```go
dbCtx, cancel := context.WithTimeout(ctx, 500*time.Millisecond)
defer cancel()

user, err := repo.Find(dbCtx, id)
```

这样数据库最多消耗总预算的一部分，剩余时间还能完成后续逻辑。

## goroutine 泄漏往往来自“只启动，不负责结束”

反例：

```go
func process(ctx context.Context) {
    go func() {
        result := slowWork()
        results <- result
    }()
}
```

如果调用方已经不再读 `results`，这个 goroutine 可能永久卡在 send。

至少要让阻塞点能响应 cancel：

```go
func process(ctx context.Context) {
    go func() {
        result := slowWork()

        select {
        case results <- result:
        case <-ctx.Done():
            return
        }
    }()
}
```

但更重要的问题是：`slowWork()` 自己能不能取消？

如果它内部是：

```go
time.Sleep(30 * time.Second)
```

Context 仍然救不了你。

可取消的等待应该写成：

```go
select {
case <-timer.C:
case <-ctx.Done():
    return ctx.Err()
}
```

## 数据库和 HTTP 都要使用带 Context 的 API

数据库：

```go
row := db.QueryRowContext(ctx, query, id)
```

不要：

```go
row := db.QueryRow(query, id)
```

HTTP：

```go
req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, body)
```

这样上游取消才能真正传到底层网络调用。

## 什么时候可以脱离请求 Context

有些任务确实应该在用户关闭页面以后继续，比如：

```text
订单已提交成功 -> 异步生成账单
```

但更稳的方案通常不是：

```go
go generateInvoice(context.Background())
```

而是：

```text
业务事务
   ↓
outbox / queue
   ↓
worker 拥有自己的 context + retry + timeout
```

如果只是很短的 best-effort 清理，可以明确脱离取消，同时保留 values：

```go
ctx := context.WithoutCancel(requestCtx)
ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
defer cancel()
```

注意：脱离请求生命周期必须是**显式设计决定**。

## Context Value 只放 request-scoped metadata

适合：

```text
trace id
request id
authenticated actor
```

不适合：

```text
DB connection
service container
optional function parameters
business DTO
```

Context 不是依赖注入容器。

## 用 `context.WithCancelCause` 保留取消原因

复杂并发任务里只有 `context.Canceled` 不够定位原因：

```go
ctx, cancel := context.WithCancelCause(parent)

cancel(fmt.Errorf("worker lost leadership"))
```

下游：

```go
if err := context.Cause(ctx); err != nil {
    slog.Error("task canceled", "cause", err)
}
```

这对 leader election、并行 fan-out、worker supervisor 很有价值。

## 一个简单检查表

看到带 `context.Context` 的函数时，可以检查：

1. Context 是否从入口一路向下传递？
2. DB / HTTP / MQ SDK 是否真的使用了 ctx？
3. 所有可能阻塞的 goroutine 是否能退出？
4. 是否有人中途偷偷换成 Background？
5. 超时预算是否合理，而不是每层复制一个固定值？
6. 请求结束后仍继续的工作，是否真的应该交给 durable worker？

Context 写在签名里很容易，真正难的是让**资源生命周期和业务生命周期一致**。
