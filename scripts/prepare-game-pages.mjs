#!/usr/bin/env node
/**
 * 建置泰文聽力小遊戲 → docs/game（GitHub Pages）
 * 用法：node scripts/prepare-game-pages.mjs
 * 網址：https://ricefan2020-rgb.github.io/thai-listening-game/game/
 */
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(repoRoot, 'docs/game')
const base = process.env.PAGES_BASE || '/thai-listening-game/game/'

console.log(`Building with base: ${base}`)
execSync('npm run build', {
  cwd: repoRoot,
  stdio: 'inherit',
  env: { ...process.env, PAGES_BASE: base },
})

const dist = join(repoRoot, 'dist')
if (!existsSync(dist)) {
  console.error('dist/ not found after build')
  process.exit(1)
}

if (existsSync(outDir)) rmSync(outDir, { recursive: true })
mkdirSync(outDir, { recursive: true })
cpSync(dist, outDir, { recursive: true })

writeFileSync(join(repoRoot, 'docs/.nojekyll'), '')
console.log('Done → docs/game/')
console.log(`Open: https://ricefan2020-rgb.github.io${base}`)
