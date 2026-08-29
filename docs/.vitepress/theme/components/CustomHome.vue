<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const root = ref(null)
let observer

onMounted(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const els = root.value?.querySelectorAll('[data-reveal]')
  if (!els?.length) return

  if (reduceMotion) {
    els.forEach((el) => el.classList.add('is-in'))
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        observer?.unobserve(entry.target)
      }
    },
    { threshold: 0.12 }
  )

  els.forEach((el) => observer.observe(el))
})

onBeforeUnmount(() => observer?.disconnect())

const projects = [
  {
    name: 'distsync',
    eyebrow: 'Distributed systems',
    status: 'ACTIVE',
    description: 'A sync-style distributed synchronization toolkit for Go, backed by Redis and Valkey.',
    detail: 'Mutex · RWMutex · Semaphore · RateLimiter · Leader Election · Fencing',
    href: 'https://github.com/MouXiaoJun/distsync',
  },
  {
    name: 'gomodulith',
    eyebrow: 'Architecture tooling',
    status: 'BUILDING',
    description: 'Make modular monolith architecture explicit, testable and enforceable in Go.',
    detail: 'Module Discovery · Boundary Verification · Cycle Detection · Architecture Graph',
    href: 'https://github.com/MouXiaoJun/gomodulith',
  },
  {
    name: 'specriot',
    eyebrow: 'API correctness',
    status: 'BUILDING',
    description: 'Dependency-aware stateful API fuzzing driven by OpenAPI specifications.',
    detail: 'Dependency Graph · Stateful Fuzzing · Shrinking · Deterministic Replay',
    href: 'https://github.com/MouXiaoJun/specriot',
  },
]

const capabilities = [
  {
    index: '01',
    title: 'Go Backend',
    description: '从业务服务到基础组件，关注并发控制、数据一致性、缓存、消息与可维护性。',
    tags: ['Go', 'MySQL', 'Redis', 'MQTT'],
  },
  {
    index: '02',
    title: 'AI Platform',
    description: '把 LLM、Agent、语音链路和第三方能力接入真正可运行的产品，而不是停留在 Demo。',
    tags: ['LangGraph', 'Dify', 'Voice', 'Agents'],
  },
  {
    index: '03',
    title: 'Developer Tools',
    description: '喜欢把工程中的重复问题抽象成可复用工具：分布式同步、架构约束、API 正确性。',
    tags: ['Tooling', 'Testing', 'DX', 'Open Source'],
  },
]

const writings = [
  {
    eyebrow: 'FOUNDATIONS',
    title: 'Go 设计模式 23 讲',
    description: '23 个 GoF 模式在 Go 中的落地，用可编译代码理解模式背后的工程取舍。',
    href: '/design-patterns/',
  },
  {
    eyebrow: 'NOTES',
    title: '工程随笔',
    description: '记录后端架构、并发一致性、状态机、基础设施与 AI 工程实践。',
    href: '/blog/',
  },
  {
    eyebrow: 'PROFILE',
    title: '关于我',
    description: '技术方向、经历、正在研究的问题，以及联系我的方式。',
    href: '/about/',
  },
]
</script>

<template>
  <main ref="root" class="home">
    <section class="hero">
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="hero-glow hero-glow-a" aria-hidden="true"></div>
      <div class="hero-glow hero-glow-b" aria-hidden="true"></div>

      <div class="hero-copy" data-reveal>
        <div class="eyebrow-row">
          <span class="eyebrow-dot"></span>
          <span>GO BACKEND · AI PLATFORM · OPEN SOURCE</span>
        </div>

        <h1 class="hero-title">
          <span class="hero-name">邓晖</span>
          <span class="hero-statement">Building reliable systems<br />and useful developer tools.</span>
        </h1>

        <p class="hero-description">
          Golang 后端工程师。关注分布式系统、工程架构与 AI 平台，喜欢把真实业务里反复出现的问题做成清晰、可靠、可复用的工具。
        </p>

        <div class="hero-actions">
          <a class="button button-primary" href="#projects">查看开源项目 <span>↘</span></a>
          <a class="button button-secondary" href="https://github.com/MouXiaoJun" target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
        </div>

        <div class="hero-meta">
          <span>Go</span>
          <span>Distributed Systems</span>
          <span>AI Agents</span>
          <span>Developer Tooling</span>
        </div>
      </div>

      <aside class="console" data-reveal style="transition-delay: 0.08s" aria-label="Developer profile terminal">
        <div class="console-bar">
          <div class="console-dots" aria-hidden="true"><i></i><i></i><i></i></div>
          <span>~/mouxiaojun</span>
          <span class="console-state">online</span>
        </div>
        <div class="console-body">
          <p><span class="prompt">$</span> whoami</p>
          <p class="output">go backend engineer / builder</p>

          <p><span class="prompt">$</span> cat focus.txt</p>
          <p class="output output-stack">
            <span>distributed correctness</span>
            <span>architecture boundaries</span>
            <span>AI-native engineering</span>
          </p>

          <p><span class="prompt">$</span> ls ./open-source</p>
          <div class="repo-lines">
            <span><b>01</b> distsync <em>distributed primitives</em></span>
            <span><b>02</b> gomodulith <em>architecture verification</em></span>
            <span><b>03</b> specriot <em>stateful API fuzzing</em></span>
          </div>

          <p class="console-last"><span class="prompt">$</span> <span class="cursor"></span></p>
        </div>
      </aside>
    </section>

    <section id="projects" class="section projects-section">
      <div class="section-head" data-reveal>
        <div>
          <p class="section-kicker">01 / OPEN SOURCE</p>
          <h2>正在构建的东西</h2>
        </div>
        <p class="section-intro">不是为了堆仓库数量，而是把工程中值得被解决的问题做成长期维护的基础工具。</p>
      </div>

      <div class="project-grid">
        <a
          v-for="(project, index) in projects"
          :key="project.name"
          class="project-card"
          :href="project.href"
          target="_blank"
          rel="noreferrer"
          data-reveal
          :style="`transition-delay: ${index * 0.06}s`"
        >
          <div class="project-top">
            <span class="project-index">0{{ index + 1 }}</span>
            <span class="project-status"><i></i>{{ project.status }}</span>
          </div>
          <p class="project-eyebrow">{{ project.eyebrow }}</p>
          <h3>{{ project.name }}</h3>
          <p class="project-description">{{ project.description }}</p>
          <p class="project-detail">{{ project.detail }}</p>
          <div class="project-footer">
            <span>github.com/MouXiaoJun/{{ project.name }}</span>
            <strong>↗</strong>
          </div>
        </a>
      </div>
    </section>

    <section class="section capability-section">
      <div class="section-head" data-reveal>
        <div>
          <p class="section-kicker">02 / WHAT I BUILD</p>
          <h2>把复杂系统做得更清楚</h2>
        </div>
        <p class="section-intro">我的兴趣点集中在“正确性、边界、抽象”三个词：系统在复杂以后仍然应该可理解、可验证、可演进。</p>
      </div>

      <div class="capability-list">
        <article v-for="item in capabilities" :key="item.index" class="capability-item" data-reveal>
          <span class="capability-index">{{ item.index }}</span>
          <div class="capability-main">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
          <div class="capability-tags">
            <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
          </div>
        </article>
      </div>
    </section>

    <section class="section writing-section">
      <div class="section-head" data-reveal>
        <div>
          <p class="section-kicker">03 / WRITING</p>
          <h2>代码之外的沉淀</h2>
        </div>
        <p class="section-intro">把学到的、踩过的、重新想明白的东西写下来，形成下一次做决策时可以复用的上下文。</p>
      </div>

      <div class="writing-grid">
        <a v-for="item in writings" :key="item.title" class="writing-card" :href="item.href" data-reveal>
          <span class="writing-eyebrow">{{ item.eyebrow }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <span class="writing-link">Read more <b>→</b></span>
        </a>
      </div>
    </section>

    <section class="closing" data-reveal>
      <div>
        <p class="section-kicker">CURRENTLY</p>
        <h2>持续构建，持续把问题想清楚。</h2>
      </div>
      <div class="closing-actions">
        <a href="https://github.com/MouXiaoJun" target="_blank" rel="noreferrer">Follow on GitHub ↗</a>
        <a href="/about/">More about me →</a>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home {
  --card-bg: rgba(15, 20, 28, 0.72);
  --card-hover: rgba(18, 26, 36, 0.92);
  --line: rgba(148, 163, 184, 0.14);
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 28px 88px;
}

.hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(380px, 0.92fr);
  gap: 72px;
  align-items: center;
  min-height: calc(100vh - 64px);
  padding: 84px 0 92px;
  isolation: isolate;
}

.hero-grid {
  position: absolute;
  z-index: -3;
  inset: 0 calc(50% - 50vw);
  opacity: 0.17;
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.18) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.18) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: linear-gradient(to bottom, transparent 0%, #000 18%, #000 68%, transparent 100%);
}

.hero-glow {
  position: absolute;
  z-index: -2;
  border-radius: 999px;
  filter: blur(2px);
  pointer-events: none;
}
.hero-glow-a {
  width: 620px;
  height: 620px;
  left: -260px;
  top: 40px;
  background: radial-gradient(circle, rgba(64, 200, 232, 0.16), transparent 67%);
}
.hero-glow-b {
  width: 460px;
  height: 460px;
  right: -180px;
  top: 80px;
  background: radial-gradient(circle, rgba(64, 200, 232, 0.09), transparent 66%);
}

.eyebrow-row,
.section-kicker,
.project-eyebrow,
.writing-eyebrow {
  font-family: var(--vp-font-family-mono);
  text-transform: uppercase;
  letter-spacing: 0.09em;
}

.eyebrow-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  margin-bottom: 30px;
}
.eyebrow-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 18px rgba(64, 200, 232, 0.75);
}

.hero-title {
  margin: 0;
  letter-spacing: -0.045em;
}
.hero-name {
  display: block;
  margin-bottom: 18px;
  color: var(--vp-c-text-1);
  font-size: clamp(4.2rem, 9vw, 7.6rem);
  font-weight: 780;
  line-height: 0.88;
}
.hero-statement {
  display: block;
  max-width: 820px;
  color: #c4ced8;
  font-size: clamp(1.55rem, 3.2vw, 2.7rem);
  font-weight: 520;
  line-height: 1.14;
  letter-spacing: -0.035em;
}

.hero-description {
  max-width: 660px;
  margin: 30px 0 0;
  color: var(--vp-c-text-2);
  font-size: 17px;
  line-height: 1.85;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 34px;
}
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 46px;
  padding: 0 20px;
  border: 1px solid var(--line);
  border-radius: 9px;
  font-size: 14px;
  font-weight: 650;
  text-decoration: none;
  transition: transform 0.16s ease, border-color 0.16s ease, background-color 0.16s ease, color 0.16s ease;
}
.button:hover {
  transform: translateY(-2px);
}
.button-primary {
  border-color: transparent;
  background: var(--vp-c-brand-1);
  color: #06151b;
}
.button-primary:hover {
  background: #62d7ef;
  color: #06151b;
}
.button-secondary {
  background: rgba(13, 18, 25, 0.7);
  color: var(--vp-c-text-1);
}
.button-secondary:hover {
  border-color: rgba(64, 200, 232, 0.48);
  color: var(--vp-c-brand-1);
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 26px;
}
.hero-meta span,
.capability-tags span {
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
}
.hero-meta span {
  padding: 6px 10px;
}

.console {
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 14px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 24%),
    rgba(9, 13, 18, 0.88);
  box-shadow: 0 36px 90px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.035);
}
.console-bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: 44px;
  padding: 0 14px;
  border-bottom: 1px solid var(--line);
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
}
.console-dots {
  display: flex;
  gap: 6px;
}
.console-dots i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #334155;
}
.console-dots i:nth-child(2) { opacity: 0.7; }
.console-dots i:nth-child(3) { opacity: 0.45; }
.console-state {
  justify-self: end;
  color: #6ee7b7;
}
.console-state::before {
  content: '';
  display: inline-block;
  width: 5px;
  height: 5px;
  margin-right: 7px;
  border-radius: 50%;
  background: #6ee7b7;
  box-shadow: 0 0 10px rgba(110, 231, 183, 0.8);
}
.console-body {
  min-height: 390px;
  padding: 24px 26px 28px;
  color: #cbd5e1;
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  line-height: 1.8;
}
.console-body p {
  margin: 0 0 6px;
}
.console-body p:not(:first-child) {
  margin-top: 22px;
}
.prompt {
  margin-right: 9px;
  color: var(--vp-c-brand-1);
}
.output {
  padding-left: 19px;
  color: #728096;
}
.output-stack span {
  display: block;
}
.repo-lines {
  display: grid;
  gap: 7px;
  margin-top: 9px;
  padding-left: 18px;
}
.repo-lines span {
  display: grid;
  grid-template-columns: 24px minmax(86px, 0.62fr) 1fr;
  gap: 10px;
  color: #b9c5d3;
}
.repo-lines b {
  color: var(--vp-c-brand-1);
  font-weight: 500;
}
.repo-lines em {
  color: #566478;
  font-style: normal;
}
.console-last {
  display: flex;
  align-items: center;
}
.cursor {
  display: inline-block;
  width: 7px;
  height: 15px;
  background: var(--vp-c-brand-1);
  animation: blink 1.05s steps(1) infinite;
}

.section {
  scroll-margin-top: 92px;
  padding: 94px 0;
  border-top: 1px solid var(--line);
}
.section-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.65fr);
  gap: 64px;
  align-items: end;
  margin-bottom: 38px;
}
.section-kicker {
  margin: 0 0 13px;
  color: var(--vp-c-brand-1);
  font-size: 11px;
}
.section-head h2,
.closing h2 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: clamp(2rem, 5vw, 3.7rem);
  font-weight: 670;
  line-height: 1.02;
  letter-spacing: -0.04em;
}
.section-intro {
  max-width: 52ch;
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.8;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--line);
  border-left: 1px solid var(--line);
}
.project-card {
  position: relative;
  display: flex;
  min-height: 410px;
  flex-direction: column;
  padding: 26px;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: var(--card-bg);
  color: inherit;
  text-decoration: none;
  transition: background-color 0.2s ease, transform 0.2s ease;
}
.project-card:hover {
  z-index: 1;
  background: var(--card-hover);
  transform: translateY(-4px);
}
.project-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 54px;
}
.project-index {
  color: #536175;
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
}
.project-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #728096;
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  letter-spacing: 0.05em;
}
.project-status i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #6ee7b7;
}
.project-eyebrow {
  margin: 0 0 8px;
  color: var(--vp-c-brand-1);
  font-size: 10px;
}
.project-card h3 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  font-size: 28px;
  font-weight: 650;
  letter-spacing: -0.04em;
}
.project-description {
  margin: 20px 0 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.72;
}
.project-detail {
  margin: 18px 0 28px;
  color: #64748b;
  font-family: var(--vp-font-family-mono);
  font-size: 10.5px;
  line-height: 1.75;
}
.project-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: auto;
  padding-top: 18px;
  border-top: 1px solid var(--line);
  color: #59677a;
  font-family: var(--vp-font-family-mono);
  font-size: 9.5px;
}
.project-footer strong {
  color: var(--vp-c-brand-1);
  font-size: 18px;
  font-weight: 400;
  transition: transform 0.16s ease;
}
.project-card:hover .project-footer strong {
  transform: translate(3px, -3px);
}

.capability-list {
  border-top: 1px solid var(--line);
}
.capability-item {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) minmax(260px, 0.7fr);
  gap: 28px;
  align-items: center;
  min-height: 150px;
  border-bottom: 1px solid var(--line);
}
.capability-index {
  color: #526074;
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
}
.capability-main h3 {
  margin: 0 0 10px;
  color: var(--vp-c-text-1);
  font-size: 24px;
  font-weight: 620;
  letter-spacing: -0.025em;
}
.capability-main p {
  max-width: 62ch;
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.78;
}
.capability-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 7px;
}
.capability-tags span {
  padding: 6px 9px;
}

.writing-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.writing-card {
  display: flex;
  min-height: 260px;
  flex-direction: column;
  padding: 26px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: rgba(13, 18, 25, 0.54);
  color: inherit;
  text-decoration: none;
  transition: transform 0.18s ease, border-color 0.18s ease, background-color 0.18s ease;
}
.writing-card:hover {
  transform: translateY(-4px);
  border-color: rgba(64, 200, 232, 0.34);
  background: rgba(16, 23, 32, 0.82);
}
.writing-eyebrow {
  color: var(--vp-c-brand-1);
  font-size: 10px;
}
.writing-card h3 {
  margin: 32px 0 13px;
  color: var(--vp-c-text-1);
  font-size: 22px;
  font-weight: 620;
  letter-spacing: -0.025em;
}
.writing-card p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13.5px;
  line-height: 1.75;
}
.writing-link {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 28px;
  color: #718096;
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
}
.writing-link b {
  color: var(--vp-c-brand-1);
  font-weight: 400;
  transition: transform 0.16s ease;
}
.writing-card:hover .writing-link b {
  transform: translateX(4px);
}

.closing {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 48px;
  align-items: end;
  margin-top: 24px;
  padding: 74px 0 12px;
  border-top: 1px solid var(--line);
}
.closing h2 {
  max-width: 780px;
  font-size: clamp(2rem, 5vw, 3.2rem);
}
.closing-actions {
  display: grid;
  justify-items: end;
  gap: 12px;
}
.closing-actions a {
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  text-decoration: none;
}
.closing-actions a:hover {
  color: var(--vp-c-brand-1);
}

[data-reveal] {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.58s ease, transform 0.58s ease;
}
[data-reveal].is-in {
  opacity: 1;
  transform: none;
}

@keyframes blink {
  0%, 48% { opacity: 1; }
  49%, 100% { opacity: 0; }
}

@media (max-width: 980px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 52px;
    min-height: auto;
    padding: 100px 0 78px;
  }
  .console {
    max-width: 680px;
  }
  .section-head {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .project-grid,
  .writing-grid {
    grid-template-columns: 1fr;
  }
  .project-card {
    min-height: 330px;
  }
  .capability-item {
    grid-template-columns: 54px minmax(0, 1fr);
    padding: 24px 0;
  }
  .capability-tags {
    grid-column: 2;
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .home {
    padding: 0 20px 64px;
  }
  .hero {
    padding-top: 76px;
  }
  .hero-name {
    font-size: clamp(3.8rem, 22vw, 5.6rem);
  }
  .hero-statement {
    font-size: 1.5rem;
  }
  .hero-description {
    font-size: 15px;
  }
  .console-body {
    min-height: 350px;
    padding: 21px 18px 24px;
    font-size: 11.5px;
  }
  .repo-lines span {
    grid-template-columns: 22px 1fr;
  }
  .repo-lines em {
    display: none;
  }
  .section {
    padding: 72px 0;
  }
  .section-head h2,
  .closing h2 {
    font-size: 2.35rem;
  }
  .project-card,
  .writing-card {
    padding: 22px;
  }
  .project-top {
    margin-bottom: 42px;
  }
  .capability-item {
    grid-template-columns: 38px minmax(0, 1fr);
    gap: 16px;
  }
  .closing {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .closing-actions {
    justify-items: start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cursor { animation: none; }
  .button,
  .project-card,
  .project-footer strong,
  .writing-card,
  .writing-link b {
    transition: none;
  }
}
</style>
