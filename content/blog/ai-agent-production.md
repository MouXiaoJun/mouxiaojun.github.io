# 把 AI Agent 从 Demo 做成生产系统，需要补哪些工程能力

Agent Demo 很容易做：

```text
User
 ↓
LLM
 ↓
Tool Call
 ↓
Response
```

真正上线以后，问题很快从“Prompt 怎么写”变成：

```text
Tool 执行两次怎么办？
用户中途取消怎么办？
模型选错工具怎么办？
第三方超时怎么办？
对话跑了 80 轮怎么办？
怎么知道新 Prompt 没把旧能力改坏？
```

一个可靠 Agent 更像后端系统，而不只是一个模型调用。

## Tool Contract 要像 API 一样设计

坏的工具：

```go
type ToolInput struct {
    Data map[string]any
}
```

模型可以往里面塞任何东西，服务端只能运行时猜。

更好的工具：

```go
type CreateTaskInput struct {
    Title       string   `json:"title"`
    AssigneeIDs []string `json:"assignee_ids"`
    DueAt       *string  `json:"due_at,omitempty"`
}
```

并且服务器再次校验：

```go
func (t CreateTaskTool) Execute(ctx context.Context, in CreateTaskInput) (CreateTaskOutput, error)
```

LLM 输出不是可信输入。

## 写操作必须考虑幂等

Agent 特别容易重复 Tool Call：

```text
模型超时
↓
上层 retry
↓
create_order 再执行一次
```

写工具最好接受：

```go
type CreateOrderInput struct {
    IdempotencyKey string
    // ...
}
```

数据库侧继续用：

```text
unique constraint
request hash
state machine
```

而不是相信“模型应该不会重复调用”。

## Context 和取消传播同样重要

用户按下 Stop：

```text
Chat UI cancel
    ↓
Agent Run context cancel
    ↓
LLM stream stop
    ↓
Tool HTTP / DB cancel
```

如果 Tool 内部偷偷换成 `context.Background()`，用户虽然看到“已停止”，后端任务仍可能继续扣费或写数据。

## 不要把所有状态都塞进对话文本

对话历史：

```text
user: ...
assistant: ...
tool: ...
```

适合语言上下文，不适合成为唯一业务状态。

真正重要的数据应该结构化：

```go
type RunState struct {
    UserID       string
    CurrentTask  string
    CompletedIDs []string
    Budget       TokenBudget
}
```

Agent 可以把语言历史压缩，但业务状态不能靠摘要“差不多记住”。

## Memory 不是无限 append

长期会话需要分层：

```text
Raw Messages
   ↓
Short-term Conversation State
   ↓
Summary / Compact
   ↓
Long-term Profile / Knowledge
```

每层的写入条件应该明确。

最危险的是把模型每句推测都写进长期用户画像，最后错误会不断自我强化。

## Tool 失败必须分类

不要统一：

```go
return errors.New("tool failed")
```

至少区分：

```text
validation error
business rejection
permission denied
retryable upstream error
timeout
internal error
```

这样 Agent 才知道：

```text
参数错 -> 修参数
权限错 -> 告知用户
超时 -> 有限重试
业务拒绝 -> 不要重试
```

## Agent Loop 必须有预算

一个循环：

```text
Think -> Tool -> Observe -> Think -> Tool...
```

理论上可以永远跑。

需要硬限制：

```go
type Budget struct {
    MaxSteps     int
    MaxToolCalls int
    Deadline     time.Time
    MaxCost      int64
}
```

达到预算以后明确终止，而不是希望模型“自己知道什么时候停”。

## 可观测性要看到 Agent 级别

普通 HTTP metrics 不够。

建议至少记录：

```text
run_id
conversation_id
model
token usage
step count
tool name
tool latency
tool result class
retry count
cancel cause
final outcome
```

Trace 可以长成：

```text
agent.run
├─ llm.chat
├─ tool.search
│  └─ http.request
├─ llm.chat
├─ tool.create_task
│  └─ db.transaction
└─ llm.chat
```

出了问题才能知道时间和钱花在哪一步。

## 没有 Evaluation，就不敢改 Prompt

传统代码：

```text
改代码 -> unit test
```

Agent：

```text
改 prompt / model / tool description
        ↓
行为可能整体漂移
```

所以要保存一组代表性任务：

```text
正常任务
边界任务
拒绝任务
工具失败任务
长对话任务
多轮纠错任务
```

每次变更跑 regression evaluation：

```text
成功率
tool selection accuracy
平均 steps
token cost
latency
policy violations
```

## 从 Demo 到生产的结构

我更倾向把 Agent 看成：

```text
              ┌──────── Model ────────┐
Request -> Runtime -> State -> Planner │
              │        │              │
              │        └-> Memory     │
              └-> Tool Router -> Tools│
                         │             │
                    Observability      │
                         │             │
                    Evaluation <───────┘
```

Prompt 只是其中一层。

真正决定它能不能长期在线的是我们熟悉的那些后端问题：

> **状态、幂等、超时、重试、权限、可观测性、测试和失败恢复。**
