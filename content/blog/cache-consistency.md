# 缓存一致性没有银弹：从 Cache-Aside 到击穿、穿透与回源控制

“Redis 缓存怎么和 MySQL 保持一致？”看起来像一个固定答案的问题，实际上要先问：

> **你的业务允许多旧的数据？错误缓存和缓存 miss 哪个代价更大？**

缓存设计的核心不是追求理论上的“永远一致”，而是明确一致性边界和失败策略。

## 先确定真相源

典型业务系统：

```text
MySQL = Source of Truth
Redis = 派生数据 / 加速层
```

这意味着：

- Redis 丢了可以重建；
- DB 成功、缓存失败不能让主业务回滚成“不存在”；
- 缓存数据必须有重建路径。

如果你把 Redis 和 DB 都当真相源，系统会越来越难回答“冲突听谁的”。

## Cache-Aside 的读路径

```go
func (s *UserService) Get(ctx context.Context, id int64) (User, error) {
    key := fmt.Sprintf("user:%d", id)

    if raw, err := s.redis.Get(ctx, key).Bytes(); err == nil {
        var user User
        if err := json.Unmarshal(raw, &user); err == nil {
            return user, nil
        }
    }

    user, err := s.repo.Find(ctx, id)
    if err != nil {
        return User{}, err
    }

    raw, _ := json.Marshal(user)
    _ = s.redis.Set(ctx, key, raw, jitter(10*time.Minute)).Err()
    return user, nil
}
```

基本逻辑：

```text
Cache Hit -> 返回
Cache Miss -> DB -> 回填 Cache
```

## 写路径为什么通常是“先 DB，再删缓存”

```go
if err := repo.Update(ctx, user); err != nil {
    return err
}

if err := redis.Del(ctx, key).Err(); err != nil {
    // 记录并重试，而不是把已经提交的 DB 假装回滚。
}
```

为什么不是“先更新缓存再更新 DB”？

因为第二步 DB 失败时，缓存已经出现了数据库里不存在的新值。

为什么很多时候选择删，而不是直接 Set 新值？

因为“如何构造缓存”可能不是单表映射，而且 delete 能让下一次读统一走重建逻辑。

## 即使先 DB 再删缓存，也不是绝对没有 race

极端时序：

```text
A: cache miss
A: 查询 DB 得到 old
B: 更新 DB 为 new
B: 删除 cache
A: 把 old 回填 cache
```

最终还是可能出现旧缓存。

解决手段要按业务成本选择：

- 短 TTL，让错误窗口有上限；
- 延迟二次删除；
- 版本号写缓存，只允许新版本覆盖旧版本；
- CDC/binlog 驱动失效；
- 对强一致热点直接绕过缓存；
- 写操作后短时间读主库。

没有一个方案适合所有系统。

## 缓存击穿：一个热点 key 同时过期

```text
10,000 requests
      ↓
cache miss
      ↓
10,000 DB queries
```

进程内可以先 `singleflight`：

```go
value, err, _ := group.Do(key, func() (any, error) {
    return repo.Find(ctx, id)
})
```

多实例场景还可以：

- 分布式锁；
- stale-while-revalidate；
- 逻辑过期 + 后台刷新。

但分布式锁不要把所有回源请求排成一个超长队列，最好设置等待上限和降级策略。

## 缓存穿透：数据库里根本没有

攻击/错误请求不停查：

```text
user:-1
user:999999999999
```

Redis 永远 miss，DB 永远查不到。

可以 negative cache：

```go
const notFound = "__nil__"

redis.Set(ctx, key, notFound, 30*time.Second)
```

TTL 要比正常对象短，避免“对象刚创建却还被负缓存挡住”。

也可以在入口校验非法 ID、使用 Bloom Filter，但不要一上来就堆所有手段。

## 雪崩：不要让大量 key 同时过期

```go
func jitter(ttl time.Duration) time.Duration {
    extra := time.Duration(rand.Int63n(int64(ttl / 5)))
    return ttl + extra
}
```

例如基础 TTL 10 分钟，再随机 0～2 分钟，让过期时间摊开。

但如果整个 Redis 集群挂了，TTL jitter 没意义。还要考虑：

- DB 限流；
- 熔断；
- 本地 L1；
- 降级数据；
- 恢复时预热。

## 缓存 key 要有版本意识

如果缓存结构升级：

```text
user:42
```

旧程序和新程序可能写不同 JSON。

简单办法：

```text
user:v2:42
```

部署期间新旧版本互不污染，旧 key 自然过期。

## 什么时候不要缓存

缓存不是默认答案。

如果：

- DB 查询本来就很快；
- 数据更新频繁且强一致要求高；
- 缓存 miss 逻辑非常复杂；
- QPS 很低；

加入 Redis 只会多一个失败点。

## 我的缓存设计顺序

通常先按这个顺序想：

```text
1. 谁是真相源？
2. 最多允许旧多久？
3. miss 的代价是什么？
4. 热点 key 会不会击穿？
5. 不存在的数据会不会穿透？
6. Redis 整体故障时 DB 能扛多少？
7. 写后缓存失效失败怎么修复？
8. 能不能观测 hit/miss/load latency？
```

把这 8 个问题回答清楚，比背“缓存三大问题”更接近生产系统。
