<template>
  <div class="ch">
    <section class="ch-hero">
      <div class="ch-copy">
        <p class="ch-eyebrow">Golang 后端工程师</p>
        <h1 class="ch-title">邓晖<span class="ch-cursor">_</span></h1>
        <p class="ch-sub">3 年经验，专注高并发与数据一致性、中台组件抽象、多厂商集成与 AI 辅助研发。</p>
        <div class="ch-ctas">
          <a class="ch-cta ch-cta-primary" href="/about/">关于我</a>
          <a class="ch-cta" href="/design-patterns/">设计模式 23 讲</a>
        </div>
      </div>

      <div class="ch-term" aria-hidden="true">
        <div class="ch-term-head">
          <span class="ch-term-name">go-design-pattern</span>
        </div>
        <pre class="ch-term-body"><code><span class="c-cmt">// 23 个 GoF 模式，全部编译通过</span>
$ go test ./...
创建型 5  <span class="c-ok">ok</span>
结构型 7  <span class="c-ok">ok</span>
行为型 11 <span class="c-ok">ok</span>
<span class="c-dim">build complete · go1.27</span></code></pre>
      </div>
    </section>

    <section class="ch-rows">
      <a class="ch-row" href="/design-patterns/">
        <span class="ch-row-title">Go 设计模式 23 讲</span>
        <span class="ch-row-desc">23 个 GoF 模式在 Go 中的落地，代码加笔记</span>
        <span class="ch-row-arrow">→</span>
      </a>
      <a class="ch-row" href="/blog/">
        <span class="ch-row-title">工程随笔</span>
        <span class="ch-row-desc">高并发一致性、状态机、引擎抽象等主题总结</span>
        <span class="ch-row-arrow">→</span>
      </a>
      <a class="ch-row" href="/about/">
        <span class="ch-row-title">关于我</span>
        <span class="ch-row-desc">技术方向、求职意向、联系方式</span>
        <span class="ch-row-arrow">→</span>
      </a>
    </section>
  </div>
</template>

<style scoped>
.ch {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px;
}

.ch-hero {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 56px;
  align-items: center;
  min-height: calc(100dvh - var(--vp-nav-height) - 96px);
  padding: 56px 0 72px;
}

.ch-eyebrow {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  letter-spacing: 0.05em;
  color: var(--vp-c-brand-1);
  margin: 0 0 18px;
}

.ch-title {
  font-size: clamp(2.6rem, 6vw, 4.4rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--vp-c-text-1);
  margin: 0 0 20px;
}

.ch-cursor {
  color: var(--vp-c-brand-1);
  animation: ch-blink 1.1s steps(2, start) infinite;
}
@keyframes ch-blink {
  to { visibility: hidden; }
}

.ch-sub {
  font-size: 17px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  max-width: 46ch;
  margin: 0 0 34px;
}

.ch-ctas {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.ch-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 22px;
  border-radius: var(--vp-border-radius);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.1s ease;
}
.ch-cta:active {
  transform: scale(0.98);
}
.ch-cta-primary {
  background: var(--vp-c-brand-1);
  color: #071820;
}
.ch-cta-primary:hover {
  background: var(--vp-c-brand-2);
}
.ch-cta:not(.ch-cta-primary) {
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
}
.ch-cta:not(.ch-cta-primary):hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.ch-term {
  border-radius: var(--vp-border-radius);
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  font-family: var(--vp-font-family-mono);
}
.ch-term-head {
  padding: 12px 18px;
  border-bottom: 1px solid var(--vp-c-border);
}
.ch-term-name {
  font-size: 12.5px;
  color: var(--vp-c-text-3);
}
.ch-term-body {
  margin: 0;
  padding: 20px 22px;
  font-size: 13.5px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
  overflow-x: auto;
}
.c-cmt { color: var(--vp-c-text-3); }
.c-ok { color: var(--vp-c-brand-1); }
.c-dim { color: var(--vp-c-text-3); }

.ch-rows {
  border-top: 1px solid var(--vp-c-divider);
}

.ch-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 6px 24px;
  padding: 24px 8px;
  border-bottom: 1px solid var(--vp-c-divider);
  text-decoration: none;
  transition: padding-left 0.15s ease;
}
.ch-row:hover {
  padding-left: 16px;
}
.ch-row-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.ch-row-desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.ch-row-arrow {
  grid-column: 2;
  grid-row: 1 / span 2;
  align-self: center;
  font-size: 20px;
  color: var(--vp-c-text-3);
  transition: color 0.15s ease, transform 0.15s ease;
}
.ch-row:hover .ch-row-arrow {
  color: var(--vp-c-brand-1);
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .ch-hero {
    grid-template-columns: 1fr;
    gap: 36px;
    min-height: 0;
    padding: 36px 0 52px;
  }
  .ch-title {
    font-size: 2.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ch-cursor {
    animation: none;
  }
}
</style>
