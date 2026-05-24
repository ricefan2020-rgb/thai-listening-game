#!/usr/bin/env node

/**
 * CLI for the Riemann zeta calculator.
 *
 * Usage:
 *   node tools/zeta-calculator/cli.mjs 2
 *   node tools/zeta-calculator/cli.mjs 0.5 14.134725
 *   node tools/zeta-calculator/cli.mjs --zeros 5
 */

import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)

if (args.length === 0) {
  console.log('Usage:')
  console.log('  node tools/zeta-calculator/cli.mjs <Re> [Im]')
  console.log('  node tools/zeta-calculator/cli.mjs --zeros <count>')
  console.log('  node tools/zeta-calculator/cli.mjs --special')
  process.exit(1)
}

const result = spawnSync(
  'npx',
  ['tsx', path.join(__dirname, 'src', 'cli.ts'), ...args],
  { stdio: 'inherit', encoding: 'utf8', shell: true },
)

process.exit(result.status ?? 1)
