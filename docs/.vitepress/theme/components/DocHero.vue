<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

const { page, frontmatter } = useData()
const route = useRoute()

const section = computed(() => {
  if (route.path.startsWith('/projects/')) return '开源项目'
  if (route.path.startsWith('/design-patterns/')) return 'Go 设计模式'
  if (route.path.startsWith('/blog/')) return '工程文章'
  if (route.path.startsWith('/about/')) return '个人档案'
  return '技术笔记'
})

const sectionCode = computed(() => {
  if (route.path.startsWith('/projects/')) return '开源工程'
  if (route.path.startsWith('/design-patterns/')) return '设计模式'
  if (route.path.startsWith('/blog/')) return '工程写作'
  if (route.path.startsWith('/about/')) return '关于我'
  return '技术笔记'
})

const description = computed(() => {
  if (typeof frontmatter.value.description === 'string') return frontmatter.value.description

  if (route.path.startsWith('/projects/')) return '从问题、约束和正确性边界出发，说明这个项目为什么存在、现在做到哪里，以及下一步如何演进。'
  if (route.path.startsWith('/design-patterns/')) return '不背定义，从真实 Go 后端场景理解模式、标准库替代方案和不应该使用它的时机。'
  if (route.path.startsWith('/blog/')) return '记录真实工程中的失败路径、设计约束和最终取舍。'
  if (route.path.startsWith('/about/')) return '技术方向、工作经历、开源项目与持续关注的问题。'
  return ''
})

const routeLabel = computed(() => route.path.replace(/^\//, '').replace(/\/$/, '') || 'home')
const repo = computed(() => typeof frontmatter.value.repo === 'string' ? frontmatter.value.repo : '')
const status = computed(() => typeof frontmatter.value.status === 'string' ? frontmatter.value.status : '')
</script>

<template>
  <header class="doc-hero">
    <div class="doc-hero-grid" aria-hidden="true"></div>

    <div class="doc-hero-topline">
      <a class="doc-hero-home" href="/">首页</a>
      <span>/</span>
      <span>{{ section }}</span>
      <span class="doc-hero-route">{{ routeLabel }}</span>
    </div>

    <div class="doc-hero-kicker">
      <span>MOUXIAOJUN / {{ sectionCode }}</span>
      <span v-if="status" class="doc-hero-status">{{ status }}</span>
    </div>

    <h1>{{ page.title }}</h1>
    <p v-if="description" class="doc-hero-description">{{ description }}</p>

    <div v-if="repo" class="doc-hero-actions">
      <a :href="repo" target="_blank" rel="noreferrer" class="doc-hero-source">查看源码 <span>↗</span></a>
    </div>
  </header>
</template>
