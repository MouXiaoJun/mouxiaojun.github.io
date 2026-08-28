<script setup>
import { onMounted, ref } from 'vue'

const root = ref(null)

// 滚动渐显：进入视口再显示，尊重 prefers-reduced-motion
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const els = root.value?.querySelectorAll('[data-reveal]')
  if (!els?.length) return
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        }
      }
    },
    { threshold: 0.1 }
  )
  els.forEach((el) => io.observe(el))
})

const groups = [
  {
    name: '创建型',
    items: ['单例模式', '工厂模式', '建造者模式', '原型模式', '抽象工厂模式'],
  },
  {
    name: '结构型',
    items: ['适配器模式', '桥接模式', '组合模式', '装饰器模式', '外观模式', '享元模式', '代理模式'],
  },
  {
    name: '行为型',
    items: ['职责链模式', '命令模式', '解释器模式', '迭代器模式', '中介者模式', '备忘录模式', '观察者模式', '状态模式', '策略模式', '模板方法模式', '访问者模式'],
  },
]
</script>

<template>
  <div ref="root" class="ch">
    <section class="ch-hero">
      <div class="ch-copy" data-reveal>
        <p class="ch-eyebrow">Golang 后端工程师 · 3 年经验</p>
        <h1 class="ch-title">邓晖</h1>
        <p class="ch-sub">专注高并发与数据一致性、中台组件抽象、多厂商集成与 AI 辅助研发。</p>
        <div class="ch-ctas">
          <a class="ch-cta ch-cta-primary" href="/about/">关于我</a>
          <a class="ch-cta" href="/design-patterns/">设计模式 23 讲</a>
        </div>
      </div>

      <aside class="ch-panel" data-reveal style="transition-delay: 0.12s">
        <div class="ch-panel-head">
          <span>go-design-pattern</span>
          <span class="ch-panel-count">23 模式</span>
        </div>
        <div class="ch-panel-grid">
          <div v-for="g in groups" :key="g.name" class="ch-panel-col">
            <p class="ch-panel-group">{{ g.name }}</p>
            <a
              v-for="item in g.items"
              :key="item"
              class="ch-panel-link"
              :href="'/design-patterns/' + encodeURIComponent(item)"
            >{{ item }}</a>
          </div>
        </div>
      </aside>
    </section>

    <section class="ch-work">
      <a class="ch-item" href="/design-patterns/" data-reveal>
        <div class="ch-item-text">
          <h3 class="ch-item-h">Go 设计模式 23 讲</h3>
          <p class="ch-item-p">23 个 GoF 模式在 Go 中的落地：创建型 5、结构型 7、行为型 11，每个都有可编译代码与笔记，测试全绿。</p>
        </div>
        <span class="ch-item-arrow">→</span>
      </a>
      <a class="ch-item" href="/blog/" data-reveal>
        <div class="ch-item-text">
          <h3 class="ch-item-h">工程随笔</h3>
          <p class="ch-item-p">高并发一致性、状态机、引擎抽象等主题的实战总结，持续更新。</p>
        </div>
        <span class="ch-item-arrow">→</span>
      </a>
      <a class="ch-item" href="/about/" data-reveal>
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
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 28px;
}

.ch-hero {
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 64px;
  align-items: center;
  padding: 96px 0 88px;
}

.ch-eyebrow {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  letter-spacing: 0.08em;
  color: var(--vp-c-brand-1);
  margin: 0 0 22px;
}

.ch-title {
  font-size: clamp(3rem, 8vw, 5.5rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1.0;
  color: var(--vp-c-text-1);
  margin: 0 0 26px;
}

.ch-sub {
  font-size: 18px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
  max-width: 40ch;
  margin: 0 0 38px;
}

.ch-ctas {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.ch-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 46px;
  padding: 0 24px;
  border-radius: var(--vp-border-radius);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
}
.ch-cta:active {
  transform: scale(0.98);
}
.ch-cta-primary {
  background: var(--vp-c-brand-1);
  color: #061820;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
}
.ch-cta-primary:hover {
  background: var(--vp-c-brand-2);
}
.ch-cta:not(.ch-cta-primary) {
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
  background: rgba(255, 255, 255, 0.02);
}
.ch-cta:not(.ch-cta-primary):hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

/* 模式索引面板：真实链接的真实预览 */
.ch-panel {
  border: 1px solid var(--vp-c-border);
  border-radius: var(--vp-border-radius);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01)), var(--vp-c-bg-soft);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 24px 60px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}
.ch-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--vp-c-border);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-3);
}
.ch-panel-count {
  color: var(--vp-c-brand-1);
}
.ch-panel-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 20px 22px 22px;
}
.ch-panel-group {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3);
  margin: 0 0 12px;
}
.ch-panel-link {
  display: block;
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  line-height: 2.05;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.12s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ch-panel-link:hover {
  color: var(--vp-c-brand-1);
}

.ch-work {
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
}

.ch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 8px;
  border-top: 1px solid var(--vp-c-divider);
  text-decoration: none;
  transition: background-color 0.18s ease, padding-left 0.18s ease;
}
.ch-item:first-child {
  border-top: none;
}
.ch-item:hover {
  background-color: rgba(255, 255, 255, 0.015);
  padding-left: 16px;
}
.ch-item-h {
  font-size: 20px;
  font-weight: 650;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
  margin: 0 0 7px;
}
.ch-item-p {
  font-size: 15px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin: 0;
  max-width: 60ch;
}
.ch-item-arrow {
  flex-shrink: 0;
  font-size: 22px;
  color: var(--vp-c-text-3);
  transition: color 0.15s ease, transform 0.15s ease;
}
.ch-item:hover .ch-item-arrow {
  color: var(--vp-c-brand-1);
  transform: translateX(6px);
}

/* 滚动渐显 */
[data-reveal] {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}
[data-reveal].is-in {
  opacity: 1;
  transform: none;
}

@media (max-width: 900px) {
  .ch-hero {
    grid-template-columns: 1fr;
    gap: 44px;
    padding: 64px 0 72px;
  }
  .ch-panel-grid {
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }
  .ch-title {
    font-size: clamp(2.6rem, 12vw, 3.6rem);
  }
}
@media (max-width: 560px) {
  .ch-panel-grid {
    grid-template-columns: 1fr;
  }
}
</style>
