import { cp, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const docsDist = resolve('docs/.vitepress/dist')
const siteDist = resolve('site-dist')

for (const entry of await readdir(docsDist, { withFileTypes: true })) {
  if (entry.name === 'index.html') continue

  await cp(
    resolve(docsDist, entry.name),
    resolve(siteDist, entry.name),
    { recursive: true, force: true },
  )
}

console.log('Merged VitePress content into site-dist (React index preserved).')
