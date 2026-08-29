---
title: 关于我
description: 我做 Go 服务端与 AI 平台工程，关心系统正确性、边界、可观测性和长期演进，也把反复遇到的工程问题做成开源工具。
---

# 关于我

<div class="about-page">
  <section class="about-profile">
    <div class="about-profile-copy">
      <p class="about-kicker">PROFILE / BACKEND × AI</p>
      <h2>我更关心系统为什么可靠，<br />而不只是它能不能跑。</h2>
      <p class="about-lead">我是邓晖，一名以 Go 为主的服务端工程师，也长期在做 AI 平台与开发者工具。面对真实业务，我习惯继续追问：状态边界在哪里、失败会怎么发生、约束能不能被验证、重复问题能不能沉淀成长期可复用的能力。</p>
      <p class="about-lead about-lead-muted">比起堆叠技术名词，我更希望交付的是结构清楚、行为可解释、出问题时能定位、随着业务变化仍然能够继续演进的系统。</p>
      <div class="about-profile-actions">
        <a class="about-button about-button-primary" href="/projects/">查看开源项目 <span>↗</span></a>
        <a class="about-button" href="https://github.com/MouXiaoJun" target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
      </div>
    </div>
    <aside class="about-identity-card">
      <div class="about-avatar-wrap">
        <img src="https://github.com/MouXiaoJun.png" alt="邓晖" class="about-avatar" />
        <span class="about-status" aria-label="持续构建中"></span>
      </div>
      <div class="about-identity-meta">
        <div>
          <span class="about-meta-label">NAME</span>
          <strong>邓晖 / MouXiaoJun</strong>
        </div>
        <div>
          <span class="about-meta-label">FOCUS</span>
          <strong>Go Backend · AI Platform</strong>
        </div>
        <div>
          <span class="about-meta-label">MODE</span>
          <strong>Build · Verify · Iterate</strong>
        </div>
      </div>
    </aside>
  </section>

  <section class="about-signal-grid" aria-label="技术方向概览">
    <div class="about-signal"><span>01</span><strong>Go Backend</strong><small>并发 · 数据 · 消息 · 工程化</small></div>
    <div class="about-signal"><span>02</span><strong>Distributed Systems</strong><small>正确性 · 协调 · 故障语义</small></div>
    <div class="about-signal"><span>03</span><strong>Architecture Tooling</strong><small>边界 · 约束 · 验证 · 演进</small></div>
    <div class="about-signal"><span>04</span><strong>AI Platform</strong><small>Agent · LLM · Voice · Integration</small></div>
  </section>

  <section class="about-section">
    <header class="about-section-head">
      <div><span>01 / HOW I WORK</span><h2>做工程时，我长期坚持的三件事</h2></div>
      <p>它们不依赖某个框架或某家公司，而是我判断方案质量时最常用的三个尺度。</p>
    </header>
    <div class="about-principles">
      <article class="about-principle">
        <span class="about-card-index">01</span>
        <h3>正确性优先</h3>
        <p>先把并发、状态、超时、重试、事务与失败路径讲清楚，再讨论性能和抽象。系统“通常能跑”不等于它在边界条件下仍然正确。</p>
      </article>
      <article class="about-principle">
        <span class="about-card-index">02</span>
        <h3>边界必须清楚</h3>
        <p>模块、数据和责任应该有明确归属。好的架构不是层数更多，而是变化发生时影响范围可预测，依赖关系能够被约束。</p>
      </article>
      <article class="about-principle">
        <span class="about-card-index">03</span>
        <h3>把经验变成工具</h3>
        <p>反复踩过的坑，不应该只停留在文档和记忆里。能自动验证的规则就做成测试，能复用的机制就沉淀成组件或开源工具。</p>
      </article>
    </div>
  </section>

  <section class="about-section">
    <header class="about-section-head">
      <div><span>02 / FOCUS</span><h2>我持续投入的工程方向</h2></div>
      <p>这些方向彼此不是孤立的：后端正确性决定平台底座，架构约束决定可维护性，AI 能力最终仍然需要进入真实系统运行。</p>
    </header>
    <div class="about-focus-grid">
      <article class="about-focus-card">
        <div class="about-focus-top"><span>GO / 01</span><b>Backend</b></div>
        <h3>服务端工程</h3>
        <p>并发控制、Context 生命周期、数据库与缓存、消息链路、状态机以及长期可维护的服务端结构。</p>
        <div class="about-tags"><span>Goroutine</span><span>MySQL</span><span>Redis</span><span>MQTT</span></div>
      </article>
      <article class="about-focus-card">
        <div class="about-focus-top"><span>DIST / 02</span><b>Correctness</b></div>
        <h3>分布式系统</h3>
        <p>锁、租约、Fencing Token、Leader Election、限流与故障恢复，重点关注语义是否成立而不是 API 是否漂亮。</p>
        <div class="about-tags"><span>Lease</span><span>Fencing</span><span>Election</span><span>Observability</span></div>
      </article>
      <article class="about-focus-card">
        <div class="about-focus-top"><span>ARCH / 03</span><b>Tooling</b></div>
        <h3>架构治理</h3>
        <p>模块边界、依赖规则、架构验证与可视化，让“不要这样依赖”从口头约定变成能在 CI 中持续执行的规则。</p>
        <div class="about-tags"><span>Modulith</span><span>Dependency</span><span>CI</span><span>Graph</span></div>
      </article>
      <article class="about-focus-card">
        <div class="about-focus-top"><span>AI / 04</span><b>Platform</b></div>
        <h3>AI 工程</h3>
        <p>Agent 状态编排、LLM 应用、语音链路、知识与第三方能力接入，关注成本、状态、可观测性和失败恢复。</p>
        <div class="about-tags"><span>Agent</span><span>LLM</span><span>Voice</span><span>Integration</span></div>
      </article>
    </div>
  </section>

  <section class="about-section">
    <header class="about-section-head">
      <div><span>03 / OPEN SOURCE</span><h2>把真实工程问题做成可复用项目</h2></div>
      <p>这些项目不是为了展示技术栈，而是来自我真正关心的问题：分布式同步、模块边界和 API 状态正确性。</p>
    </header>
    <div class="about-projects">
      <a class="about-project" href="https://github.com/MouXiaoJun/distsync" target="_blank" rel="noreferrer">
        <div class="about-project-head"><span>01 / GO</span><span>↗</span></div>
        <h3>distsync</h3>
        <p>Redis / Valkey backed distributed synchronization primitives for Go。尝试提供接近标准库 <code>sync</code> 的分布式同步体验。</p>
        <div class="about-project-foot">Mutex · RWMutex · Semaphore · Lease · Fencing</div>
      </a>
      <a class="about-project" href="https://github.com/MouXiaoJun/gomodulith" target="_blank" rel="noreferrer">
        <div class="about-project-head"><span>02 / ARCH</span><span>↗</span></div>
        <h3>gomodulith</h3>
        <p>Architecture verification and modular monolith toolkit for Go。把模块边界从约定变成可以发现、验证和测试的规则。</p>
        <div class="about-project-foot">Modules · Rules · Verification · Graph</div>
      </a>
      <a class="about-project" href="https://github.com/MouXiaoJun/specriot" target="_blank" rel="noreferrer">
        <div class="about-project-head"><span>03 / API</span><span>↗</span></div>
        <h3>specriot</h3>
        <p>Dependency-aware stateful API fuzzing from OpenAPI specs。探索多请求状态序列，并缩小成可以确定性重放的失败用例。</p>
        <div class="about-project-foot">OpenAPI · Stateful · Fuzzing · Replay</div>
      </a>
    </div>
  </section>

  <section class="about-now">
    <div class="about-now-copy">
      <span>04 / NOW</span>
      <h2>现在仍然在做同一件事：<br />把复杂问题拆清楚，再做成长期能力。</h2>
    </div>
    <div class="about-now-list">
      <div><span>01</span><p>继续深入 Go 服务端、并发与运行时机制。</p></div>
      <div><span>02</span><p>把分布式正确性和架构约束做成更可靠的开发者工具。</p></div>
      <div><span>03</span><p>探索 Agent、语音和知识能力如何稳定进入生产系统。</p></div>
      <div><span>04</span><p>持续写工程文章，把真实问题、错误路径和取舍公开沉淀下来。</p></div>
    </div>
  </section>

  <section class="about-contact">
    <div>
      <span>CONTACT</span>
      <h2>想聊工程、开源或 AI 产品？</h2>
      <p>可以直接从 GitHub 找到我，也可以发邮件。</p>
    </div>
    <div class="about-contact-actions">
      <a href="https://github.com/MouXiaoJun" target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
      <a href="mailto:1016848185@qq.com">1016848185@qq.com <span>↗</span></a>
    </div>
  </section>
</div>
