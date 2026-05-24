#!/usr/bin/env node
/**
 * 手機同 Wi‑Fi 存取觀察板（綁定 0.0.0.0）
 * 用法：node scripts/serve-mobile.mjs
 * 環境：PORT=8765
 */
import { networkInterfaces } from 'os';
import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 8765);

function lanAddresses() {
  const out = [];
  for (const list of Object.values(networkInterfaces())) {
    for (const i of list || []) {
      if (i.family === 'IPv4' && !i.internal) out.push(i.address);
    }
  }
  return out.length ? out : ['127.0.0.1'];
}

const ips = lanAddresses();
const mainUrl = `http://${ips[0]}:${port}/index.html`;
const installUrl = `http://${ips[0]}:${port}/phone.html`;

console.log('');
console.log('══════════════════════════════════════════');
console.log('  10x 觀察板 · 手機連線');
console.log('══════════════════════════════════════════');
console.log('');
console.log('  ① 手機與 Mac 連同一個 Wi‑Fi');
console.log('  ② 手機瀏覽器開：');
console.log('');
ips.forEach((ip) => {
  console.log(`     http://${ip}:${port}/index.html`);
});
console.log('');
console.log('  ③ 安裝到主畫面（可選）：');
console.log(`     ${installUrl}`);
console.log('');
console.log('  QR 碼頁面含掃描連結 · Ctrl+C 停止伺服器');
console.log('══════════════════════════════════════════');
console.log('');

const child = spawn('python3', ['-m', 'http.server', String(port), '--bind', '0.0.0.0'], {
  cwd: root,
  stdio: 'inherit',
});

child.on('exit', (code) => process.exit(code ?? 0));
