---
title: 关于我
description: 关于邓晖：从业务开发走向 Go 服务端、系统正确性、架构治理与 AI 平台工程的成长路径，以及长期坚持的工程判断。
---

# 关于我

<div class="about-editorial">
  <section class="about-intro">
    <div class="about-intro-topline">
      <span>ABOUT / 邓晖</span>
      <span>ENGINEERING NOTES · 2026</span>
    </div>

    <h1>我不是一开始就知道自己<br />想成为什么样的工程师。</h1>

    <div class="about-intro-body">
      <div class="about-intro-copy">
        <p class="about-intro-lead">最开始，我关心的是“功能怎么做出来”。后来开始关心“它为什么会出问题”，再后来，我更在意：有没有办法让同一类问题以后不再反复发生。</p>
        <p>这让我逐渐把注意力从单个需求，移到状态、边界、失败语义、可观测性和长期演进上。现在我主要做 Go 服务端与 AI 平台工程，也会把真实项目里反复出现的问题继续抽象成工具、文章和开源项目。</p>
        <p>我不太追求技术栈看起来有多复杂。比起“用了什么”，我更在意系统的行为能不能解释、约束能不能验证、出了问题能不能定位，以及业务继续变化时是不是还改得动。</p>
      </div>

      <aside class="about-facts" aria-label="个人信息">
        <div><span>ROLE</span><strong>Backend Engineer</strong></div>
        <div><span>PRIMARY</span><strong>Go</strong></div>
        <div><span>WORKING ON</span><strong>AI Platform · Developer Tools</strong></div>
        <div><span>GITHUB</span><a href="https://github.com/MouXiaoJun" target="_blank" rel="noreferrer">MouXiaoJun ↗</a></div>
      </aside>
    </div>
  </section>

  <section class="about-block about-path">
    <header class="about-block-head">
      <span>01 / MY PATH</span>
      <h2>比起职位变化，我更在意自己<br />开始关注了哪些更难的问题。</h2>
    </header>

    <div class="about-timeline">
      <article class="about-timeline-row">
        <div class="about-timeline-index">01</div>
        <div class="about-timeline-stage">业务开发</div>
        <div class="about-timeline-copy">
          <h3>先学会把东西做出来</h3>
          <p>早期更多关注接口、数据库、业务流程和交付速度。这个阶段让我建立了最基础的工程直觉：代码最终要进入真实业务，而不是只在 Demo 里成立。</p>
        </div>
      </article>

      <article class="about-timeline-row">
        <div class="about-timeline-index">02</div>
        <div class="about-timeline-stage">Java → Go</div>
        <div class="about-timeline-copy">
          <h3>开始理解语言背后的运行方式</h3>
          <p>从 Java 转向 Go 后，我开始更主动地理解 goroutine、Context、channel、内存、调度与生命周期。语言不再只是语法，而是系统行为的一部分。</p>
        </div>
      </article>

      <article class="about-timeline-row">
        <div class="about-timeline-index">03</div>
        <div class="about-timeline-stage">系统工程</div>
        <div class="about-timeline-copy">
          <h3>从“能跑”走向“为什么可靠”</h3>
          <p>随着系统里出现缓存、消息、多厂商集成、并发与更多状态，我开始持续关注数据一致性、超时、重试、幂等、故障语义和可观测性。</p>
        </div>
      </article>

      <article class="about-timeline-row">
        <div class="about-timeline-index">04</div>
        <div class="about-timeline-stage">AI Platform</div>
        <div class="about-timeline-copy">
          <h3>把 AI 当成系统，而不是一个模型调用</h3>
          <p>Agent、语音、知识和第三方能力真正进入产品后，问题仍然回到工程本身：状态怎么管理、失败怎么恢复、成本怎么控制、链路怎么观测、能力怎么长期演进。</p>
        </div>
      </article>

      <article class="about-timeline-row">
        <div class="about-timeline-index">NOW</div>
        <div class="about-timeline-stage">Open Source</div>
        <div class="about-timeline-copy">
          <h3>把反复遇到的问题变成长期能力</h3>
          <p>现在我越来越愿意把经验从“我知道”变成“系统能验证”：能写成测试的约束就不要只写文档，能抽象成工具的机制就不要只靠记忆。</p>
        </div>
      </article>
    </div>
  </section>

  <section class="about-block about-thinking">
    <header class="about-block-head about-block-head-split">
      <div>
        <span>02 / HOW I THINK</span>
        <h2>我判断一个工程方案时，<br />最常问的四个问题。</h2>
      </div>
      <p>它们不是方法论口号，而是我在设计、Review 和排障时会反复检查的东西。</p>
    </header>

    <div class="about-thinking-list">
      <article>
        <span>01</span>
        <h3>它在边界条件下还正确吗？</h3>
        <p>正常路径往往最容易实现。我更想先知道并发、超时、取消、重试、重复请求和部分失败发生时，系统还剩下什么保证。</p>
      </article>
      <article>
        <span>02</span>
        <h3>谁真正拥有这个状态？</h3>
        <p>模块、数据和责任应该有明确归属。边界清楚之后，依赖、事务、缓存和事件才有机会变得可解释。</p>
      </article>
      <article>
        <span>03</span>
        <h3>失败之后，我看得见发生了什么吗？</h3>
        <p>日志不是最后再补的东西。Trace、指标、错误语义和关键状态应该帮助人快速回答：哪里慢了、哪里错了、影响了谁。</p>
      </article>
      <article>
        <span>04</span>
        <h3>这次解决的是需求，还是一类问题？</h3>
        <p>不是所有东西都值得抽象，但反复发生的问题值得。好的抽象应该减少未来的决策成本，而不是增加新的理解负担。</p>
      </article>
    </div>
  </section>

  <section class="about-block about-lessons">
    <header class="about-block-head">
      <span>03 / WHAT I LEARNED</span>
      <h2>这些年最大的变化，不是会的框架更多了。</h2>
    </header>

    <div class="about-lessons-grid">
      <div class="about-lesson-main">
        <p>以前我会把“做完功能”当成主要结果。</p>
        <p>现在更希望自己能说清楚：<strong>这个系统为什么这样设计，它承诺什么、不承诺什么，失败时会发生什么，以及下一次变化从哪里进入。</strong></p>
      </div>
      <div class="about-lesson-notes">
        <div><span>01</span><p>从写业务代码，到开始理解运行时和系统行为。</p></div>
        <div><span>02</span><p>从遇到故障再修，到提前设计失败路径和可观测性。</p></div>
        <div><span>03</span><p>从口头约束，到把架构规则做成可以自动验证的机制。</p></div>
        <div><span>04</span><p>从“使用 AI”，到真正构建承载 AI 能力的平台基础设施。</p></div>
      </div>
    </div>
  </section>

  <section class="about-block about-now-editorial">
    <header class="about-block-head about-block-head-split">
      <div>
        <span>04 / NOW</span>
        <h2>现在，我还在继续补基础。</h2>
      </div>
      <p>我更希望这些方向最后能够连接起来，而不是形成一堆互不相关的知识点。</p>
    </header>

    <div class="about-now-lines">
      <div><span>01</span><strong>Go Runtime</strong><p>调度、内存、并发原语与生命周期。</p></div>
      <div><span>02</span><strong>Distributed Correctness</strong><p>锁、租约、fencing、限流与故障恢复。</p></div>
      <div><span>03</span><strong>AI Infrastructure</strong><p>Agent、Voice、Memory、Tools 与生产化运行。</p></div>
      <div><span>04</span><strong>Developer Tools</strong><p>把重复的工程判断变成自动化能力。</p></div>
    </div>
  </section>

  <section class="about-block about-beyond">
    <div class="about-beyond-title">
      <span>05 / BEYOND CODE</span>
      <h2>为什么还要写文章、做开源？</h2>
    </div>
    <div class="about-beyond-copy">
      <p>因为很多理解只有在尝试把它讲清楚、做成别人也能使用的东西之后，才会暴露出真正模糊的地方。</p>
      <p>写作迫使我整理因果关系，开源迫使我面对 API、兼容性、文档、测试和长期维护。它们对我来说不是额外包装，而是学习工程的一部分。</p>
      <div class="about-beyond-links">
        <a href="/blog/">工程文章 <span>↗</span></a>
        <a href="/projects/">开源项目 <span>↗</span></a>
        <a href="/design-patterns/">Go 设计模式 <span>↗</span></a>
      </div>
    </div>
  </section>

  <footer class="about-contact-editorial">
    <div>
      <span>CONTACT</span>
      <h2>如果你也在做类似的问题，欢迎交流。</h2>
    </div>
    <div class="about-contact-links">
      <a href="https://github.com/MouXiaoJun" target="_blank" rel="noreferrer">GitHub / MouXiaoJun ↗</a>
      <a href="mailto:1016848185@qq.com">1016848185@qq.com ↗</a>
    </div>
  </footer>
</div>
