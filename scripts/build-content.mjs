import { readdir, readFile, writeFile, mkdir, cp } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import anchor from 'markdown-it-anchor'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CONTENT = path.join(ROOT, 'content')
const DIST = path.join(ROOT, 'site-dist')
const SITE = 'https://mouxiaojun.github.io'

const SECTION_DEFAULTS = {
  'design-patterns': { label: 'Go 设计模式', code: '设计模式', home: '设计模式', desc: '不背定义，从真实 Go 后端场景理解模式、标准库替代方案和不应该使用它的时机。' },
  'blog': { label: '工程文章', code: '工程写作', home: '工程文章', desc: '记录真实工程中的失败路径、设计约束和最终取舍。' },
  'projects': { label: '开源项目', code: '开源工程', home: '开源项目', desc: '从问题、约束和正确性边界出发，说明这个项目为什么存在、现在做到哪里，以及下一步如何演进。' },
  'about': { label: '个人档案', code: '关于我', home: '关于我', desc: '技术方向、工作经历、开源项目与持续关注的问题。' },
}

hljs.configure({ ignoreUnescapedHTML: true, languages: ['go', 'bash', 'sql', 'text', 'plaintext', 'yaml', 'json', 'xml', 'diff'] })

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,
  highlight(code, lang) {
    const language = (lang || '').toLowerCase().trim()
    if (language && language !== 'text' && hljs.getLanguage(language)) {
      try {
        const value = hljs.highlight(code, { language, ignoreIllegals: true }).value
        return `<pre class="hljs"><code class="language-${language}">${value}</code></pre>\n`
      } catch (e) { /* fall through */ }
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>\n`
  },
})

md.use(anchor, {
  slugify: (s) => {
    const base = String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    if (base) return base
    // CJK-only heading: deterministic short id so anchors are stable/unique.
    let hash = 5381
    for (const ch of String(s)) hash = ((hash * 33) ^ ch.codePointAt(0)) >>> 0
    return 'h-' + hash.toString(36)
  },
  level: [2, 3, 4],
})

// CommonMark's delimiter-flanking rules don't close ** after a punctuation run
// when a CJK/alnum char follows immediately (e.g. "**核心思想：**确保"). Insert a
// space so emphasis renders instead of leaking literal asterisks.
function normalizeCjkEmphasis(src) {
  return src.replace(/(\*\*[^*\n]+?\*\*)(?=[\p{L}\p{N}])/gu, '$1 ')
}

// ---------- helpers ----------
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
function stripHtml(s) {
  return String(s).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim()
}
function posix(p) { return p.split(path.sep).join('/') }

// Extract grouped content cards from an index page's raw markdown.
function parseIndexCards(raw, section) {
  const events = []
  let m
  const kickerRe = /<div class="content-kicker">([\s\S]*?)<\/div>/g
  const cardRe = /<a class="content-card"[\s\S]*?href="([^"]+)"[\s\S]*?<h3>([\s\S]*?)<\/h3>[\s\S]*?<\/a>/g
  while ((m = kickerRe.exec(raw))) events.push({ idx: m.index, type: 'kicker', text: stripHtml(m[1]) })
  while ((m = cardRe.exec(raw))) events.push({ idx: m.index, type: 'card', href: m[1], title: stripHtml(m[2]) })
  events.sort((a, b) => a.idx - b.idx)

  const groups = []
  let current = null
  for (const e of events) {
    if (e.type === 'kicker') {
      const clean = e.text.replace(/^\d+\s*\/\s*/, '').trim()
      current = { text: clean, items: [] }
      groups.push(current)
    } else if (e.type === 'card') {
      if (!current) { current = { text: '', items: [] }; groups.push(current) }
      current.items.push({ title: e.title, link: resolveLink(e.href, section) })
    }
  }
  return groups
}

function resolveLink(href, section) {
  if (href.startsWith('http') || href.startsWith('/') || href.startsWith('https:')) return href
  if (href.startsWith('./')) {
    const rest = href.slice(2).replace(/\/+$/, '')
    return rest ? `/${section}/${rest}/` : `/${section}/`
  }
  if (href.startsWith('#')) return href
  return href
}

// Map a page URL to a content file path.
function findContentFile(rel) {
  const [d1, d2] = rel.split('/')
  const base = (section, name) => (name ? path.join(CONTENT, section, name) : path.join(CONTENT, section))
  // rel like 'design-patterns/单例模式' or 'projects/distsync'
  const fileDirect = path.join(CONTENT, `${d1}${d2 ? path.sep + d2 : ''}.md`)
  if (existsSync(fileDirect)) return fileDirect
  const fileIndex = path.join(CONTENT, d1, d2 || 'index', 'index.md')
  if (existsSync(fileIndex)) return fileIndex
  const fileTopIndex = path.join(CONTENT, d1, 'index.md')
  if (existsSync(fileTopIndex)) return fileTopIndex
  return fileDirect
}

async function readSection(section) {
  const dir = path.join(CONTENT, section)
  const files = (await readdir(dir, { withFileTypes: true })).filter((f) => f.isFile() && f.name.endsWith('.md'))
  return { dir, files }
}

// Read a file's text, returning '' if it does not exist.
function readTextFile(p) {
  try { return readFileSync(p, 'utf8') } catch (e) { return '' }
}

// Pick the ordered article list for a section and the sidebar groups.
function buildSectionMeta(section) {
  const meta = SECTION_DEFAULTS[section]
  if (section === 'design-patterns' || section === 'blog') {
    const groups = parseIndexCards(readTextFile(path.join(CONTENT, section, 'index.md')), section)
    const cards = groups.flatMap((g) => g.items)
    const list = [{ title: meta.home, link: `/${section}/`, isIndex: true }].concat(cards)
    return { meta, groups, list }
  }
  if (section === 'projects') {
    const list = [
      { title: '项目总览', link: '/projects/', isIndex: true },
      { title: 'distsync · 分布式同步', link: '/projects/distsync/' },
      { title: 'gomodulith · 架构治理', link: '/projects/gomodulith/' },
      { title: 'specriot · API Fuzzing', link: '/projects/specriot/' },
    ]
    const groups = [{ text: '开源项目', items: list.filter((i) => !i.isIndex) }]
    return { meta, groups, list }
  }
  // about
  const list = [{ title: '关于我', link: '/about/', isIndex: true }]
  const groups = [{ text: '关于', items: [] }]
  return { meta, groups, list }
}

// ---------- rendering ----------
function renderMarkdown(src) {
  return md.render(normalizeCjkEmphasis(src))
}

function renderOutline(html) {
  const links = []
  const re = /<h([23]) id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g
  let m
  while ((m = re.exec(html))) {
    links.push({ level: Number(m[1]), id: m[2], text: stripHtml(m[3]) })
  }
  return links
}

function firstH1(src) {
  const m = src.match(/^#\s+(.+?)\s*$/m)
  return m ? m[1].trim() : ''
}

function pageTitleFromSrc(src, fmTitle) {
  return fmTitle || firstH1(src) || ''
}

function outputPathFor(relNoExt) {
  // 'design-patterns/index' -> 'design-patterns/index.html'
  // 'design-patterns/单例模式' -> 'design-patterns/单例模式/index.html'
  // 'projects/distsync/index' -> 'projects/distsync/index.html'
  if (/\/index$/.test(relNoExt)) {
    return relNoExt.replace(/\/index$/, '') + '/index.html'
  }
  return relNoExt + '/index.html'
}

function pageUrlFor(relNoExt) {
  if (/\/index$/.test(relNoExt)) {
    return '/' + relNoExt.replace(/\/index$/, '') + '/'
  }
  return '/' + relNoExt + '/'
}

function githubSvg() {
  return '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.9.5.5 5.9.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 .1.8.6.8.6 1-.7 2.6-.5 3.2-.4.1-.6.4-1.1.7-1.4-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-3 0 0 .9-.3 3 1.1a10.4 10.4 0 0 1 5.5 0c2.1-1.4 3-1.1 3-1.1.6 1.6.2 2.7.1 3 .7.8 1.1 1.8 1.1 3 0 4.3-2.6 5.2-5.1 5.5.4.3.8.9.8 1.9v2.8c0 .3.2.6.8.5a11.5 11.5 0 0 0 7.9-10.9C23.5 5.9 18.1.5 12 .5z"/></svg>'
}

function buildShell({ section, pageUrl, title, description, hero, bodyHtml, sidebarGroups, outlineLinks, prev, next }) {
  const meta = SECTION_DEFAULTS[section]
  const active = (href) => {
    if (href === '/') return pageUrl === '/'
    return pageUrl === href || pageUrl.startsWith(href)
  }

  const navLinks = [
    { text: '首页', href: '/' },
    { text: '开源项目', href: '/projects/' },
    { text: '设计模式', href: '/design-patterns/' },
    { text: '工程文章', href: '/blog/' },
    { text: '关于我', href: '/about/' },
  ]
  const navHtml = navLinks.map((l) => `<a class="site-nav-link${active(l.href) ? ' is-active' : ''}" href="${l.href}">${l.text}</a>`).join('')

  const sidebar = sidebarGroups.map((g) => {
    const items = g.items.map((i) => `<a class="site-sidebar-link${active(i.link) ? ' is-active' : ''}" href="${i.link}">${i.title}</a>`).join('')
    return g.items.length ? `<div class="site-sidebar-group"><p class="site-sidebar-title">${g.text}</p>${items}</div>` : ''
  }).join('')

  const outline = outlineLinks.length
    ? `<aside class="site-outline"><p class="outline-title">本页内容</p><nav class="outline-list">${outlineLinks.map((l) => `</a><a class="outline-link is-h${l.level}" href="#${l.id}">${l.text}</a>`).join('')}</nav></aside>`
    : ''

  const prevHtml = prev ? `<a class="doc-footer-link" href="${prev.link}"><span class="doc-footer-label">上一篇</span><span class="doc-footer-title">${prev.title}</span></a>` : '<span></span>'
  const nextHtml = next ? `<a class="doc-footer-link is-next" href="${next.link}"><span class="doc-footer-label">下一篇</span><span class="doc-footer-title">${next.title}</span></a>` : '<span></span>'

  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)} · 邓晖</title>
<meta name="description" content="${escapeHtml(description)}" />
<link rel="canonical" href="${SITE}${pageUrl}" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="stylesheet" href="/content.css" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="邓晖 · Go Backend & AI Platform" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:url" content="${SITE}${pageUrl}" />
<meta property="og:image" content="${SITE}/og-card.svg" />
<meta name="twitter:card" content="summary_large_image" />
</head>
<body>
<nav class="site-nav"><div class="site-nav-inner"><div class="site-nav-menu">${navHtml}</div><div class="site-nav-actions"><a class="site-nav-icon" href="https://github.com/MouXiaoJun" target="_blank" rel="noreferrer" aria-label="GitHub">${githubSvg()}</a></div></div></nav>
<div class="site-layout${outline ? ' has-outline' : ''}">
<aside class="site-sidebar">${sidebar}</aside>
<main class="site-main">
${hero}
${bodyHtml}
${(prev || next) ? `<div class="doc-footer"><div class="doc-footer-links">${prevHtml}${nextHtml}</div></div>` : ''}
</main>
${outline}
</div>
<footer class="site-footer"><span>© 2026 邓晖</span><span>Go Backend · Distributed Systems · AI Platform</span></footer>
</body>
</html>\n`
}

function buildHero({ section, frontmatter, title, description, pageUrl, status, repo }) {
  const meta = SECTION_DEFAULTS[section]
  const route = pageUrl.replace(/^\//, '').replace(/\/$/, '')
  const statusHtml = status ? `<span class="doc-hero-status">${escapeHtml(status)}</span>` : ''
  const repoHtml = repo ? `<div class="doc-hero-actions"><a class="doc-hero-source" href="${escapeHtml(repo)}" target="_blank" rel="noreferrer">查看源码 <span>↗</span></a></div>` : ''
  return `<header class="doc-hero"><div class="doc-hero-grid" aria-hidden="true"></div>
<div class="doc-hero-topline"><a class="doc-hero-home" href="/">首页</a><span>/</span><span>${meta.label}</span><span class="doc-hero-route">${escapeHtml(route)}</span></div>
<div class="doc-hero-kicker"><span>MOUXIAOJUN / ${meta.code}</span>${statusHtml}</div>
<h1>${escapeHtml(title)}</h1>${description ? `<p class="doc-hero-description">${escapeHtml(description)}</p>` : ''}${repoHtml}
</header>`
}

// ---------- main ----------
async function main() {
  for (const section of Object.keys(SECTION_DEFAULTS)) {
    const { meta, groups, list } = buildSectionMeta(section)

    // Generate the index page.
    const indexRel = `${section}/index`
    const indexPath = outputPathFor(indexRel)
    await generatePage({ section, relNoExt: indexRel, filePath: path.join(CONTENT, section, 'index.md'), list, meta })

    // Generate each article page (skipping the index), using the ordered list.
    for (const item of list) {
      if (item.isIndex) continue
      const relNoExt = item.link.replace(/^\//, '').replace(/\/$/, '')
      const filePath = findContentFile(relNoExt)
      if (!existsSync(filePath)) {
        console.warn(`  ! missing content file for ${item.link}`)
        continue
      }
      await generatePage({ section, relNoExt, filePath, list, meta })
    }
  }

  await copyAssets()
  await writeSitemap()
  console.log('Content pages built into site-dist.')
}

async function generatePage({ section, relNoExt, filePath, list, meta }) {
  const src = await readFile(filePath, 'utf8')
  const { data: fm, content } = matter(src)
  const title = pageTitleFromSrc(content, fm.title)
  const description = fm.description || meta.desc
  const status = fm.status || ''
  const repo = fm.repo || ''

  const body = renderMarkdown(content)
  // strip the leading h1 (hero already shows the title)
  let bodyHtml = body.replace(/<h1[^>]*>[\s\S]*?<\/h1>/, '')
  // rewrite relative card links to clean absolute URLs
  bodyHtml = bodyHtml.replace(/href="\.\/([^"]+?)"/g, (m, p) => {
    const clean = p.replace(/\/+$/, '')
    return clean ? `href="/${section}/${clean}/"` : `href="/${section}/"`
  })

  const outlineLinks = renderOutline(bodyHtml)
  const pageUrl = pageUrlFor(relNoExt)
  const hero = buildHero({ section, frontmatter: fm, title, description, pageUrl, status, repo })

  // prev/next within the ordered list
  const idx = list.findIndex((i) => i.link === pageUrl)
  const prev = idx > 0 ? list[idx - 1] : null
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null

  const html = buildShell({ section, pageUrl, title, description, hero, bodyHtml, sidebarGroups: groupsOf(section), outlineLinks, prev, next })

  const out = path.join(DIST, outputPathFor(relNoExt))
  await mkdir(path.dirname(out), { recursive: true })
  await writeFile(out, html, 'utf8')
  console.log('  ' + relNoExt)
}

function groupsOf(section) {
  return buildSectionMeta(section).groups
}

async function copyAssets() {
  await mkdir(path.join(DIST, 'assets', 'fonts'), { recursive: true })
  await cp(path.join(ROOT, 'styles', 'content.css'), path.join(DIST, 'content.css'))
  const fonts = [
    ['node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2', 'geist-latin-wght-normal.woff2'],
    ['node_modules/@fontsource-variable/geist/files/geist-latin-wght-italic.woff2', 'geist-latin-wght-italic.woff2'],
    ['node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2', 'jetbrains-mono-latin-wght-normal.woff2'],
    ['node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-italic.woff2', 'jetbrains-mono-latin-wght-italic.woff2'],
  ]
  for (const [from, to] of fonts) {
    const src = path.join(ROOT, from)
    if (existsSync(src)) await cp(src, path.join(DIST, 'assets', 'fonts', to))
    else console.warn(`  ! font missing: ${from}`)
  }
  // public assets
  const pubDir = path.join(ROOT, 'public')
  if (existsSync(pubDir)) {
    for (const name of ['favicon.svg', 'og-card.svg', 'robots.txt']) {
      const p = path.join(pubDir, name)
      if (existsSync(p)) await cp(p, path.join(DIST, name))
    }
  }
}

async function writeSitemap() {
  const urls = []
  for (const section of Object.keys(SECTION_DEFAULTS)) {
    const relList = buildSectionMeta(section).list
    urls.push(`/${section}/`)
    for (const item of relList) if (!item.isIndex) urls.push(item.link)
  }
  const urlsXml = urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>\n`
  await writeFile(path.join(DIST, 'sitemap.xml'), xml, 'utf8')
}

main().catch((e) => { console.error(e); process.exit(1) })
