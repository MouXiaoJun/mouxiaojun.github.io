# 工程随笔

这里不放“八股答案”，主要记录后端和 AI 工程中那些**必须把失败路径也想清楚**的问题。

## 最新文章

### Go / Backend

- [Context 不是参数搬运工：取消传播、超时预算与 goroutine 生命周期](go-context-cancellation)
  - 为什么客户端断开了，后端任务还在跑；什么时候能用 `context.Background()`。
- [缓存一致性没有银弹：从 Cache-Aside 到击穿、穿透与回源控制](cache-consistency)
  - 数据库和缓存到底谁是真相源，以及“更新 DB 后删缓存”仍然有哪些 race。
- [先把单体边界画清楚，再讨论微服务](modular-monolith)
  - 模块化单体不是目录命名，而是可验证的依赖边界。

### Distributed Systems / Tooling

- [Redis 分布式锁为什么还需要 Fencing Token](distributed-lock-fencing)
  - 自动续租不能消灭 lease-expiry race，真正的最终写入仍要防 stale holder。
- [为什么 API Fuzzing 必须理解请求之间的状态](openapi-stateful-fuzzing)
  - 单接口随机参数找不到 `Create → Delete → Delete` 这种状态 Bug。

### AI Engineering

- [把 AI Agent 从 Demo 做成生产系统，需要补哪些工程能力](ai-agent-production)
  - Tool contract、幂等、取消、状态、评估、可观测性，比 Prompt 更决定系统能不能长期运行。

## 我会长期写的主题

```text
Go runtime / concurrency
Distributed correctness
MySQL / Redis / MQ
Modular architecture
Developer tooling
AI agents / voice / orchestration
Production debugging
```

文章会优先写“为什么这样设计”和“失败时会发生什么”，而不只是贴一段能跑的代码。
