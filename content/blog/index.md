---
title: 工程随笔
description: 记录 Go 后端、分布式系统、架构工具与 AI 工程中必须把失败路径想清楚的问题。
---

# 工程随笔

<div class="content-intro">
这里不放八股答案，主要记录那些必须把失败路径、状态边界和工程取舍想清楚的问题。文章会优先回答“为什么这样设计”和“失败时会发生什么”。
</div>

<div class="content-strip">
  <span class="content-pill">Go Runtime</span>
  <span class="content-pill">Distributed Correctness</span>
  <span class="content-pill">MySQL / Redis</span>
  <span class="content-pill">Architecture</span>
  <span class="content-pill">Developer Tooling</span>
  <span class="content-pill">AI Engineering</span>
</div>

<div class="content-kicker">01 / Go 与后端工程</div>
<div class="content-grid">
  <a class="content-card" href="./go-context-cancellation"><span class="content-card-index">01 / GO BACKEND</span><span class="content-card-arrow">↗</span><h3>Context 不是参数搬运工</h3><p>取消传播、超时预算与 goroutine 生命周期：为什么客户端断开后任务还在跑。</p></a>
  <a class="content-card" href="./cache-consistency"><span class="content-card-index">02 / GO BACKEND</span><span class="content-card-arrow">↗</span><h3>缓存一致性没有银弹</h3><p>从 Cache-Aside 到击穿、穿透与回源控制，重新理解数据库和缓存的真相源关系。</p></a>
  <a class="content-card" href="./modular-monolith"><span class="content-card-index">03 / ARCHITECTURE</span><span class="content-card-arrow">↗</span><h3>先把单体边界画清楚</h3><p>模块化单体不是目录命名，而是可以被验证、被约束、被演进的依赖边界。</p></a>
</div>

<div class="content-kicker">02 / 分布式系统与工具</div>
<div class="content-grid">
  <a class="content-card" href="./distributed-lock-fencing"><span class="content-card-index">04 / DISTRIBUTED</span><span class="content-card-arrow">↗</span><h3>分布式锁为什么还需要 Fencing Token</h3><p>自动续租无法消灭 lease-expiry race，最终写入仍然必须识别 stale holder。</p></a>
  <a class="content-card" href="./openapi-stateful-fuzzing"><span class="content-card-index">05 / TESTING</span><span class="content-card-arrow">↗</span><h3>API Fuzzing 为什么必须理解状态</h3><p>单接口随机参数无法发现 Create → Delete → Delete 这类状态相关 Bug。</p></a>
</div>

<div class="content-kicker">03 / AI 工程</div>
<div class="content-grid">
  <a class="content-card" href="./ai-agent-production"><span class="content-card-index">06 / AI ENGINEERING</span><span class="content-card-arrow">↗</span><h3>把 AI Agent 从 Demo 做成生产系统</h3><p>Tool contract、幂等、取消、状态、评估与可观测性，比 Prompt 更决定系统能否长期运行。</p></a>
</div>

## 持续更新

后续会继续补充 Go runtime、分布式正确性、数据库与缓存、模块化架构、开发者工具、AI Agent 和生产故障复盘。
