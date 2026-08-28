<template>
  <div class="ch">
    <section class="ch-hero">
      <p class="ch-eyebrow">Golang 后端工程师 · 3 年经验</p>
      <h1 class="ch-title">邓晖</h1>
      <p class="ch-sub">专注高并发与数据一致性、中台组件抽象、多厂商集成与 AI 辅助研发。</p>
      <div class="ch-ctas">
        <a class="ch-cta ch-cta-primary" href="/about/">关于我</a>
        <a class="ch-cta" href="/design-patterns/">设计模式 23 讲</a>
      </div>
    </section>

    <section class="ch-work">
      <h2 class="ch-work-title">内容</h2>
      <a class="ch-item" href="/design-patterns/">
        <div class="ch-item-text">
          <h3 class="ch-item-h">Go 设计模式 23 讲</h3>
          <p class="ch-item-p">23 个 GoF 模式在 Go 中的落地：创建型 5、结构型 7、行为型 11，代码加笔记。</p>
        </div>
        <span class="ch-item-arrow">→</span>
      </a>
      <a class="ch-item" href="/blog/">
        <div class="ch-item-text">
          <h3 class="ch-item-h">工程随笔</h3>
          <p class="ch-item-p">高并发一致性、状态机、引擎抽象等主题的实战总结，持续更新。</p>
        </div>
        <span class="ch-item-arrow">→</span>
      </a>
      <a class="ch-item" href="/about/">
        <div class="ch-item-text">
          <h3 class="ch-item-h">关于我</h3>
          <p class="ch-item-p">技术方向、求职意向与联系方式。</p>
        </div>
        <span class="ch-item-arrow">→</span>
      </a>
    </section>
  </div>
</template>

<style scoped>
.ch {
  max-width: 1040px;
  margin: 0 auto;
  padding: 0 28px;
  position: relative;
}

/* 首页细点纹理，压得很低，只做质感不做装饰 */
.ch::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(rgba(232, 238, 244, 0.035) 1px, transparent 1.5px);
  background-size: 26px 26px;
}

.ch-hero {
  position: relative;
  padding: 88px 0 96px;
  max-width: 720px;
}

.ch-eyebrow {
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  letter-spacing: 0.06em;
  color: var(--vp-c-brand-1);
  margin: 0 0 20px;
}

.ch-title {
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  font-weight: 750;
  letter-spacing: -0.035em;
  line-height: 1.02;
  color: var(--vp-c-text-1);
  margin: 0 0 22px;
}

.ch-sub {
  font-size: 17px;
  line-height: 1.75;
  color: var(--vp-c-text-2);
  max-width: 46ch;
  margin: 0 0 36px;
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
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}
.ch-cta:not(.ch-cta-primary):hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.ch-work {
  position: relative;
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
}

.ch-work-title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-3);
  margin: 0;
  padding: 20px 8px 0;
}

.ch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 26px 8px;
  border-top: 1px solid var(--vp-c-divider);
  text-decoration: none;
  transition: background-color 0.18s ease, padding-left 0.18s ease;
}
.ch-item:hover {
  background-color: rgba(255, 255, 255, 0.015);
  padding-left: 16px;
}
.ch-item-h {
  font-size: 19px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
  margin: 0 0 6px;
}
.ch-item-p {
  font-size: 14.5px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
  margin: 0;
  max-width: 56ch;
}
.ch-item-arrow {
  flex-shrink: 0;
  font-size: 20px;
  color: var(--vp-c-text-3);
  transition: color 0.15s ease, transform 0.15s ease;
}
.ch-item:hover .ch-item-arrow {
  color: var(--vp-c-brand-1);
  transform: translateX(5px);
}

@media (max-width: 768px) {
  .ch-hero {
    padding: 56px 0 72px;
  }
  .ch-item {
    padding: 22px 4px;
  }
}
</style>
