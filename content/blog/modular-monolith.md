# 先把单体边界画清楚，再讨论微服务

很多团队的架构演进是这样的：

```text
代码越来越乱
    ↓
大家觉得“单体不行了”
    ↓
拆微服务
    ↓
原来的耦合变成 HTTP / MQ 耦合
```

问题并没有消失，只是从函数调用变成了网络调用。

我更认可另一条路径：

> **先证明自己能在一个进程里维持模块边界，再决定哪些边界值得付出分布式系统成本。**

## 目录不是模块边界

这样的目录看起来很漂亮：

```text
internal/
├── user/
├── order/
├── payment/
└── notification/
```

但如果：

```go
order -> user/repository
payment -> order/internal/model
user -> payment/service
```

它仍然是一个强耦合大泥球。

模块真正需要回答：

1. 我的公开 API 是什么？
2. 哪些实现细节只能模块内部使用？
3. 我允许依赖哪些模块？
4. 谁依赖我？
5. 有没有循环依赖？

## Go 天然有一个好工具：`internal`

Go compiler 已经提供了 package visibility 机制。

可以约定模块结构：

```text
internal/order/
├── api/
│   ├── service.go
│   └── event.go
├── application/
├── domain/
└── internal/
```

其他模块只允许：

```go
import "example.com/app/internal/order/api"
```

而不应该直接：

```go
import "example.com/app/internal/order/domain"
```

这里的关键不是目录名，而是**团队真的执行这个约束**。

## 直接调用并不是坏事

模块化单体里：

```go
orderService.Create(ctx, cmd)
```

往往比为了“解耦”强行：

```text
publish message -> broker -> consume
```

更简单、更可靠、更容易调试。

如果 Order 明确需要 User 的一个同步查询，定义一个小接口直接调用完全合理。

真正需要 event 的情况通常是：

```text
OrderCreated
  ├─ Analytics
  ├─ Notification
  └─ Search Index
```

这些消费者不是创建订单事务成功的必要条件。

## 循环依赖是一个架构报警器

```text
user -> order
order -> payment
payment -> user
```

循环出现时，不要第一反应“怎么通过 interface 绕开编译器”。

应该问：

- 是否有一个概念其实属于第三个模块？
- 依赖方向是不是反了？
- 这段协作是否应该用 event？
- 模块是不是切得太细？

Interface 能打破 package import cycle，但不一定打破业务耦合。

## Architecture Test 比 Wiki 更可靠

架构图最容易出现的结局：

```text
2026-01 architecture.png
```

半年以后没人知道它还准不准。

真正的依赖关系已经在源码 import graph 里，所以可以让 CI 自动检查：

```text
order -> user/api       OK
order -> user/internal  VIOLATION
payment -> order/api    OK
user -> payment         CYCLE
```

这也是我做 `gomodulith` 这个项目时最关心的方向：**architecture as executable constraints**。

## 什么时候该拆微服务

不是“代码超过 10 万行”。

更可靠的信号包括：

- 两个模块需要独立扩缩容；
- 发布节奏长期冲突；
- 数据所有权已经非常明确；
- 团队组织边界稳定；
- 故障隔离价值大于网络复杂度；
- 一个模块需要完全不同的运行环境。

拆出去以后，你会付出：

```text
RPC timeout
retry
idempotency
service discovery
observability
schema compatibility
distributed transaction
network partition
```

如果这些成本还没有业务收益支撑，就别急着拆。

## 我理解的模块化单体

它不是“微服务前的过渡垃圾桶”，而是一种长期有效的架构：

```text
一个部署单元
多个明确业务模块
显式公开 API
可验证依赖规则
模块内高内聚
模块间低耦合
```

能把这个结构维持好，未来真正需要拆服务时，切割线也会清楚得多。
