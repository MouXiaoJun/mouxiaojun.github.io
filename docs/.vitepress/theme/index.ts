import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import '@fontsource-variable/geist'
import '@fontsource-variable/jetbrains-mono'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
}
