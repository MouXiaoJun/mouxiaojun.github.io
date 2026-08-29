import { copyFile, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'site-dist')
const CSS_SOURCE = path.join(ROOT, 'styles', 'content-wide.css')
const CSS_TARGET = path.join(DIST, 'content-wide.css')

const CONTENT_SECTIONS = new Set(['design-patterns', 'blog', 'projects', 'about'])
const SIDEBAR_SECTIONS = new Set(['design-patterns', 'blog', 'projects'])

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await walk(full))
    else files.push(full)
  }

  return files
}

function setLayoutClasses(html, { hasSidebar, isIndex }) {
  return html.replace(/<div class="site-layout([^"]*)">/, (_, suffix) => {
    const classes = new Set(['site-layout', ...suffix.trim().split(/\s+/).filter(Boolean)])

    if (hasSidebar) classes.add('has-sidebar')
    else classes.delete('has-sidebar')

    if (isIndex) {
      classes.add('is-index')
      classes.delete('has-outline')
    } else {
      classes.delete('is-index')
    }

    return `<div class="${[...classes].join(' ')}">`
  })
}

function removeIndexOutline(html) {
  return html.replace(/\n?<aside class="site-outline">[\s\S]*?<\/aside>\n?/, '\n')
}

async function main() {
  const files = await walk(DIST)

  for (const file of files) {
    if (!file.endsWith('.html')) continue

    const relative = path.relative(DIST, file).split(path.sep).join('/')
    const section = relative.split('/')[0]
    if (!CONTENT_SECTIONS.has(section)) continue

    const isIndex = relative === `${section}/index.html`
    let html = await readFile(file, 'utf8')

    if (!html.includes('/content-wide.css')) {
      html = html.replace(
        '<link rel="stylesheet" href="/content.css" />',
        '<link rel="stylesheet" href="/content.css" />\n<link rel="stylesheet" href="/content-wide.css" />',
      )
    }

    if (isIndex) html = removeIndexOutline(html)

    html = setLayoutClasses(html, {
      hasSidebar: SIDEBAR_SECTIONS.has(section),
      isIndex,
    })

    await writeFile(file, html, 'utf8')
  }

  await copyFile(CSS_SOURCE, CSS_TARGET)
  console.log('Applied wide content layout overrides.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
