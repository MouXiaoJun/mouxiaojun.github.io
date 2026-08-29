import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '邓晖 · Go Backend & AI Platform',
  description: 'Go 后端、AI 平台与开源工程：分布式系统、架构工具、API 正确性与工程实践。',
  appearance: 'dark',
  cleanUrls: true,
  sitemap: { hostname: 'https://mouxiaojun.github.io' },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'canonical', href: 'https://mouxiaojun.github.io/' }],
    ['meta', { name: 'theme-color', content: '#0C0C0C' }],
    ['meta', { property: 'og:site_name', content: '邓晖 · Go Backend & AI Platform' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: 'https://mouxiaojun.github.io/og-card.svg' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '开源项目', link: '/projects/' },
      { text: '设计模式', link: '/design-patterns/' },
      { text: '工程文章', link: '/blog/' },
      { text: '关于我', link: '/about/' },
    ],
    sidebar: {
      '/projects/': [
        {
          text: '开源项目',
          collapsed: false,
          items: [
            { text: '项目总览', link: '/projects/' },
            { text: 'distsync · 分布式同步', link: '/projects/distsync/' },
            { text: 'gomodulith · 架构治理', link: '/projects/gomodulith/' },
            { text: 'specriot · API Fuzzing', link: '/projects/specriot/' },
          ],
        },
      ],
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
      '/blog/': [
        {
          text: 'Go / Backend',
          collapsed: false,
          items: [
            { text: 'Context 与取消传播', link: '/blog/go-context-cancellation' },
            { text: '缓存一致性', link: '/blog/cache-consistency' },
            { text: '模块化单体', link: '/blog/modular-monolith' },
          ],
        },
        {
          text: 'Distributed Systems / Tooling',
          collapsed: false,
          items: [
            { text: '分布式锁与 Fencing Token', link: '/blog/distributed-lock-fencing' },
            { text: 'OpenAPI Stateful Fuzzing', link: '/blog/openapi-stateful-fuzzing' },
          ],
        },
        {
          text: 'AI Engineering',
          collapsed: false,
          items: [
            { text: 'Agent 从 Demo 到生产', link: '/blog/ai-agent-production' },
          ],
        },
      ],
    },
    search: {
      provider: 'local',
    },
    outline: {
      level: [2, 3],
      label: '本页内容',
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    sidebarMenuLabel: '目录',
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换为浅色主题',
    darkModeSwitchTitle: '切换为深色主题',
    skipToContentLabel: '跳转到正文',
    socialLinks: [{ icon: 'github', link: 'https://github.com/MouXiaoJun' }],
    footer: {
      message: 'Go Backend · Distributed Systems · AI Platform · Open Source',
      copyright: 'Copyright © 2026 邓晖',
    },
  },
})
