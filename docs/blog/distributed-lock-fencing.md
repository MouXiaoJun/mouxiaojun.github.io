# Redis 分布式锁为什么还需要 Fencing Token

很多分布式锁教程到这里就结束了：

```text
SET lock token NX PX 10000
```

释放时用 Lua：只有 value 还是我的 token 才能 DEL。

这已经比 `SETNX + DEL` 安全很多，但它仍然没有解决一个更隐蔽的问题：

> **锁过期以后，旧持有者可能恢复执行。**

## 经典 lease-expiry race

```text
A 获取锁，TTL 10s
      ↓
A 发生长时间 GC / 网络暂停 / VM freeze
      ↓
10s 到期
      ↓
B 获取同一把锁
      ↓
B 开始写数据库
      ↓
A 恢复执行，也继续写数据库
```

现在 A 和 B 都认为自己正在执行临界区代码。

Token-safe unlock 只能保证：

```text
A 不会把 B 的新锁 DEL 掉
```

却不能阻止：

```text
A 对真正业务资源继续写入
```

## 自动续租也不能把问题变成零

Watchdog 可以每隔 TTL/3 续租：

```text
10s lease
↓
3.3s renew
↓
3.3s renew
```

它能显著降低正常任务锁过期概率，但如果：

- stop-the-world pause 很长；
- 网络隔离；
- Redis 暂时不可达；
- 进程被挂起；

lease 仍可能失效。

分布式系统里最危险的假设之一就是：

> “我的进程一定能在 TTL 到期前执行某段代码。”

## Fencing Token 的思路

每次成功获取锁，都生成一个**严格递增的序号**：

```text
A acquire -> fencing 41
B acquire -> fencing 42
C acquire -> fencing 43
```

写业务资源时把 fencing token 一起带过去。

例如订单表：

```sql
UPDATE orders
SET status = 'paid',
    fencing_token = 42
WHERE id = 1001
  AND fencing_token < 42;
```

假设 B 已经用 token=42 写成功。

A 恢复以后带 token=41：

```sql
... WHERE fencing_token < 41
```

条件不成立，旧持有者的写入被资源本身拒绝。

```text
Lock Service
     ↓
给出“我现在是第 42 代持有者”
     ↓
Resource
     ↓
只接受比自己当前 generation 更新的写入
```

这才真正把 stale holder 挡在最终副作用之外。

## 为什么随机 UUID 不够

随机 owner token：

```text
550e8400-e29b...
```

适合确认“这把 Redis 锁是不是我的”。

但它没有大小关系，资源无法判断：

```text
A token 和 B token 谁更新？
```

Fencing token 必须有单调顺序。

所以两种 token 解决不同问题：

| Token | 用途 |
|---|---|
| random owner token | 防止旧 holder Unlock 新 holder 的锁 |
| increasing fencing token | 防止旧 holder 对业务资源产生副作用 |

## 所有资源都支持 Fencing 吗？

并不是。

数据库可以：

```sql
WHERE fencing_token < ?
```

对象存储/第三方 API 未必提供类似条件写。

如果最终资源不认识 fencing token，就只能用其他业务手段：

- version / CAS；
- idempotency key；
- 唯一约束；
- 单写者架构；
- 资源自己的 conditional write。

## 有时候根本不需要分布式锁

比如“订单号只能创建一次”：

```sql
UNIQUE(order_no)
```

通常比：

```text
Redis Lock -> SELECT -> INSERT
```

更可靠。

选择顺序可以先想：

```text
数据库唯一约束 / CAS 能解决？
    ↓ no
单机 mutex 能解决？
    ↓ no
数据库 advisory lock 能解决？
    ↓ no
才考虑独立分布式锁
```

## 我在 distsync 里坚持的语义

做 `distsync` 时，我更希望把分布式锁描述为：

> **一个有 lease 的协调原语，而不是“拿到以后绝对互斥”的魔法。**

因此真正值得文档写清楚的是：

- lease expiry；
- owner token；
- renewal failure；
- `Lost()` / cancellation；
- fencing token；
- Redis Cluster key slot；
- 两个 holder 短暂重叠的边界。

分布式锁最重要的不是 API 长得像 `sync.Mutex`，而是调用方知道**它不能保证什么**。
