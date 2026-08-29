<script setup>
import DefaultTheme from 'vitepress/theme'
import DocHero from './components/DocHero.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-before>
      <DocHero />
    </template>
  </DefaultTheme.Layout>
</template>
