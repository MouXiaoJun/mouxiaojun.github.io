---
title: 分布式同步工具箱
description: distsync 是面向 Go 服务的 sync 风格分布式同步原语库，基于 Redis 与 Valkey，统一处理租约、Fencing Token、自动续期和可观测性。
repo: https://github.com/MouXiaoJun/distsync
status: 持续维护
---

# 分布式同步工具箱

`distsync` 不是另一个 Redis Client，而是把单进程里的 `sync.Mutex`、读写锁和计数信号量，扩展成跨进程可用的同步原语。

```go
client := distsync.New(rdb)

mu := client.Mutex("order:10001")
guard, err := mu.Lock(ctx)
if err != nil {
    return err
}
defer guard.Unlock(ctx)
```

## 它解决什么问题

一个 Go 服务扩容到多个实例之后，本地同步原语就失效了：

```text
service-a ─┐
service-b ─┼── 同时修改 order:10001
service-c ─┘
```

开发者通常会分别寻找分布式锁、信号量、限流器和主节点选举库，或者在项目里散落多段 Lua。`distsync` 希望提供统一的语义和生命周期管理。

## 已有原语

| 原语 | 典型场景 |
|---|---|
| `Mutex` | 跨实例串行修改同一资源 |
| `RWMutex` | 配置更新、缓存重建、共享资源读写 |
| `Semaphore` | 限制 AI 调用、转码任务或租户并发数 |
| `RateLimiter` | 集群级 Token Bucket、Fixed Window、Sliding Window、Leaky Bucket |
| `Leader` | Cron、对账、结算、数据同步只允许一个副本执行 |
| Distributed Single-flight | 跨实例合并同一批回源请求 |

## 为什么锁还需要 Fencing Token

自动续租不能消灭 lease-expiry race：

```text
A 获得锁
↓
A 因 GC / 网络暂停
↓
租约过期
↓
B 获得锁并写入
↓
A 恢复并继续写入
```

因此写入最终资源时，还需要拒绝旧持有者：

```sql
UPDATE orders
SET status = 'paid', fencing_token = ?
WHERE id = ?
  AND fencing_token < ?;
```

```go
fmt.Println(guard.FencingToken())
```

Fencing Token 对同一资源严格递增，旧持有者即使恢复，也无法覆盖新持有者已经完成的写入。

## 统一 Lease 模型

不同原语不应该各自实现一套所有权、TTL、续期和释放逻辑。项目内部将它们收敛到统一 Lease：

```text
Mutex ───────┐
RWMutex ─────┼──► Lease ──► 原子 Lua ──► Redis / Valkey
Leader ──────┘
Semaphore ───────► PermitSet
```

Lease 统一负责：

- Owner Token 与 compare-and-set 释放；
- TTL、过期时间和自动续期；
- 所有权丢失通知；
- Redis 临时故障与确定性失败；
- `context.Context` 取消；
- 后台心跳 goroutine 的同步退出。

## Redis Cluster 与可观测性

所有关联 Key 使用同一个 hash tag，保证多 Key Lua 始终落在同一 Slot，避免 `CROSSSLOT`。

项目同时提供：

- Prometheus Metrics Adapter；
- OpenTelemetry Tracer Adapter；
- 无配置时的零成本 No-op；
- Redis 与 Valkey 兼容；
- `*redis.Client`、`*redis.ClusterClient` 等 go-redis v9 `Cmdable` 支持。

## 安装

```bash
go get github.com/MouXiaoJun/distsync@latest
```

要求 Go 1.21+、Redis 6.0+ 或 Valkey。

## 下一步

项目会继续围绕语义稳定性、真实 Cluster 验证、故障注入、文档和生产诊断能力演进，而不是无限扩张成 Redis 数据结构集合。

- [查看 GitHub 仓库](https://github.com/MouXiaoJun/distsync)
- [查看 pkg.go.dev](https://pkg.go.dev/github.com/MouXiaoJun/distsync)
