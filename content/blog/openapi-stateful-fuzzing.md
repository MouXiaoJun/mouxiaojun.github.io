# 为什么 API Fuzzing 必须理解请求之间的状态

很多 API Fuzzer 的工作方式是：

```text
读取 OpenAPI
↓
找到 POST /orders
↓
随机生成 body
↓
发请求
```

这可以找到很多输入校验问题，但真实业务 Bug 往往不是一个请求产生的，而是一串请求共同制造的状态。

## 一个单请求 Fuzz 很难发现的 Bug

```text
1. POST /orders       -> 201
2. DELETE /orders/42  -> 204
3. DELETE /orders/42  -> 500
```

第三步的输入本身完全合法：

```text
DELETE /orders/{id}
```

真正重要的信息是：

> **这个 id 已经被前一个请求删除过。**

同样的状态 Bug 还有：

```text
Create -> Cancel -> Pay
Create -> Delete -> Update
Create A -> Create B -> 用 A 的 token 操作 B
Login -> Refresh -> Logout -> Refresh
Reserve -> Expire -> Confirm
```

## OpenAPI 已经藏着一部分依赖关系

比如：

```text
POST /users
response.id
```

另一个请求：

```text
POST /orders
request.user_id
```

可以推测 producer-consumer：

```text
POST /users.response.id
        ↓
POST /orders.request.user_id
```

再比如：

```text
POST /orders.response.id
        ↓
GET /orders/{id}
        ↓
DELETE /orders/{id}
```

于是测试单元不再是 Request，而是 Sequence。

## Dependency Inference 不应该假装 100% 正确

字段可能叫：

```text
id
user_id
userId
uid
owner
```

所以依赖推断最好携带 confidence：

```go
type Dependency struct {
    Producer   ValueRef
    Consumer   ValueRef
    Confidence float64
    Reason     string
}
```

信号可以包括：

- exact field name；
- normalized name；
- schema ref；
- path resource；
- OpenAPI Link；
- type compatibility；
- 用户显式 hint。

弱推断可以展示出来，不一定直接高权重执行。

## Stateful Explorer 要变异“序列”

普通 fuzzer 只变异值：

```text
quantity: 1 -> 0 -> -1 -> MaxInt
```

Stateful Fuzzer 还要变异顺序：

```text
删除一步
重复一步
交换两个可交换步骤
重复使用旧 resource id
使用已经删除的 resource
跨 resource 复用 token
```

例如：

```text
Create
Get
Delete
```

变成：

```text
Create
Delete
Delete
```

或者：

```text
Create A
Create B
Delete B with A.id
```

## Oracle：怎么知道它发现的是 Bug

第一批通用 Oracle 很明确：

```text
5xx
undocumented status code
response schema violation
invalid content type
connection reset / protocol error
```

但最有价值的还是业务 invariant，例如：

```text
balance never negative
confirmed order cannot become pending again
resource owned by tenant A cannot be fetched by tenant B
```

这就需要用户提供少量领域知识。

## 找到 Bug 后必须 Shrink

如果 Fuzzer 告诉你：

```text
经过 71 个请求以后出现 500
```

开发者很难调试。

更好的结果：

```text
71 steps
   ↓ shrink
4 steps

POST /users
POST /orders
DELETE /orders/42
DELETE /orders/42 -> 500
```

Shrinking 需要同时处理：

- sequence length；
- request body；
- string / number；
- array；
- optional field；
- dependency binding。

## Replay 是工程工具和玩具 Fuzzer 的分界线

一次随机失败如果不能复现，CI 基本没法用。

所以每次 failure 应保存：

```yaml
seed: 839127
steps:
  - operation: createUser
  - operation: createOrder
    bindings:
      user_id: "$steps[0].response.id"
  - operation: deleteOrder
    bindings:
      id: "$steps[1].response.id"
```

然后：

```bash
specriot replay failure.yaml
```

## 为什么我想做 SpecRiot

我希望它最终不是一个“随机打接口”的工具，而是：

```text
OpenAPI
  ↓
Constraint Model
  ↓
Dependency Graph
  ↓
Stateful Exploration
  ↓
Oracle
  ↓
Shrink
  ↓
Replay
```

真正有意思的部分不是生成一个非法 email，而是**让机器理解 API 操作之间最基本的因果关系，然后主动探索状态空间**。
