import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '邓晖 · Golang 后端工程师',
  description: '个人主页与技术博客：Go 设计模式 23 讲 · 高并发一致性 · 工程随笔',

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '关于我', link: '/about/' },
      { text: '设计模式', link: '/design-patterns/' },
      { text: '博客', link: '/blog/' },
    ],
    sidebar: {
      '/design-patterns/': [
        {
          text: '创建型',
          collapsed: false,
          items: [
            { text: '单例模式', link: '/design-patterns/单例模式' },
            { text: '工厂模式', link: '/design-patterns/工厂模式' },
            { text: '建造者模式', link: '/design-patterns/建造者模式' },
            { text: '原型模式', link: '/design-patterns/原型模式' },
            { text: '抽象工厂模式', link: '/design-patterns/抽象工厂模式' },
          ],
        },
        {
          text: '结构型',
          collapsed: false,
          items: [
            { text: '适配器模式', link: '/design-patterns/适配器模式' },
            { text: '桥接模式', link: '/design-patterns/桥接模式' },
            { text: '组合模式', link: '/design-patterns/组合模式' },
            { text: '装饰器模式', link: '/design-patterns/装饰器模式' },
            { text: '外观模式', link: '/design-patterns/外观模式' },
            { text: '享元模式', link: '/design-patterns/享元模式' },
            { text: '代理模式', link: '/design-patterns/代理模式' },
          ],
        },
        {
          text: '行为型',
          collapsed: false,
          items: [
            { text: '职责链模式', link: '/design-patterns/职责链模式' },
            { text: '命令模式', link: '/design-patterns/命令模式' },
            { text: '解释器模式', link: '/design-patterns/解释器模式' },
            { text: '迭代器模式', link: '/design-patterns/迭代器模式' },
            { text: '中介者模式', link: '/design-patterns/中介者模式' },
            { text: '备忘录模式', link: '/design-patterns/备忘录模式' },
            { text: '观察者模式', link: '/design-patterns/观察者模式' },
            { text: '状态模式', link: '/design-patterns/状态模式' },
            { text: '策略模式', link: '/design-patterns/策略模式' },
            { text: '模板方法模式', link: '/design-patterns/模板方法模式' },
            { text: '访问者模式', link: '/design-patterns/访问者模式' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/MouXiaoJun' }],
    footer: {
      message: 'Golang 后端工程师 · 高并发一致性 · 中台组件抽象 · AI 辅助研发',
    },
  },
})
