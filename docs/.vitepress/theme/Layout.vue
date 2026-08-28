<script setup>
import DefaultTheme from 'vitepress/theme'
import CustomHome from './components/CustomHome.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <template #home-hero-before>
      <CustomHome />
    </template>
  </DefaultTheme.Layout>
</template>
