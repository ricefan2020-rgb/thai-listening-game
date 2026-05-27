/**
 * Fill each lesson category to 150 items using LESSON_BANKS_150.
 * Run: node scripts/generate-lessons-to-150.mjs
 */
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'src/data/lessons-ext5.ts')
const TARGET = 150

const CATEGORIES = [
  'greeting', 'travel', 'food', 'fruit', 'feeling', 'emotion',
  'time', 'holiday', 'color', 'object', 'furniture', 'body', 'animal',
]

/** Category → id prefix after e5 */
const ID_PREFIX = {
  greeting: 'g',
  travel: 't',
  food: 'f',
  fruit: 'fr',
  feeling: 'fl',
  emotion: 'em',
  time: 'tm',
  holiday: 'hd',
  color: 'c',
  object: 'o',
  furniture: 'fu',
  body: 'b',
  animal: 'a',
}

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function loadExistingLessons() {
  const cmd =
    'npx tsx -e "import {LESSONS} from \'./src/data/lessons.ts\'; console.log(JSON.stringify(LESSONS.map(l=>({thai:l.thai,category:l.category,id:l.id}))))"'
  const json = execSync(cmd, { cwd: ROOT, encoding: 'utf8' }).trim()
  return JSON.parse(json)
}

function formatId(prefix, n) {
  return `e5${prefix}${String(n).padStart(3, '0')}`
}

const { LESSON_BANKS_150 } = await import('./lesson-banks-150.mjs')
const existing = loadExistingLessons()

const globalThai = new Set(existing.map((l) => l.thai))
const byCategory = Object.fromEntries(CATEGORIES.map((c) => [c, []]))
for (const l of existing) {
  if (byCategory[l.category]) byCategory[l.category].push(l)
}

const added = []
const stats = {}

for (const category of CATEGORIES) {
  const current = byCategory[category] || []
  const catThai = new Set(current.map((l) => l.thai))
  const need = Math.max(0, TARGET - current.length)
  const prefix = ID_PREFIX[category]
  let nextNum = 1
  const usedIds = new Set(existing.map((l) => l.id).concat(added.map((l) => l.id)))
  while (usedIds.has(formatId(prefix, nextNum))) nextNum++

  let picked = 0
  const bank = LESSON_BANKS_150[category] || []

  for (const item of bank) {
    if (picked >= need) break
    if (catThai.has(item.thai)) continue
    if (globalThai.has(item.thai)) continue

    let id
    do {
      id = formatId(prefix, nextNum++)
    } while (usedIds.has(id))
    usedIds.add(id)

    const row = {
      id,
      thai: item.thai,
      meaning: item.meaning,
      category,
    }
    added.push(row)
    catThai.add(item.thai)
    globalThai.add(item.thai)
    picked++
  }

  const finalCount = current.length + picked
  stats[category] = {
    before: current.length,
    added: picked,
    after: finalCount,
    target: TARGET,
    shortfall: Math.max(0, TARGET - finalCount),
  }
}

const lines = [
  "import type { LessonItem } from '../types'",
  '',
  '/** Auto-generated: fill categories to 150 (scripts/generate-lessons-to-150.mjs) */',
  'export const LESSONS_EXT5 = [',
]

for (const item of added) {
  lines.push(
    `  { id: '${esc(item.id)}', thai: '${esc(item.thai)}', meaning: '${esc(item.meaning)}', category: '${item.category}' },`,
  )
}

lines.push('] as unknown as LessonItem[]', '')

writeFileSync(OUT, lines.join('\n') + '\n', 'utf8')

console.log(`Wrote ${added.length} new lessons → ${OUT}\n`)
console.log('Per category:')
for (const cat of CATEGORIES) {
  const s = stats[cat]
  console.log(
    `  ${cat.padEnd(10)} before=${s.before} +${s.added} → ${s.after}/${s.target}` +
      (s.shortfall ? ` (SHORT ${s.shortfall})` : ''),
  )
}
console.log(`\nTotal new items: ${added.length}`)
