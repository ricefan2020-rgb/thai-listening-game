/**
 * 透過本機 OpenD（Python futu-api）抓取期權鏈
 */
import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { futuCode } from './futu-codes.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const PY_SCRIPT = join(__dir, '..', 'update-options-opend.py');

export function opendConfigured() {
  return process.env.OPTIONS_SOURCE !== 'yahoo';
}

export function fetchOpenDChains(tickers, opts = {}) {
  const host = process.env.OPEND_HOST || '127.0.0.1';
  const port = process.env.OPEND_PORT || '11111';
  const timeoutMs = Number(process.env.OPEND_TIMEOUT_MS || 120000);
  const python = process.env.OPEND_PYTHON || 'python3';

  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      OPEND_HOST: host,
      OPEND_PORT: String(port),
      OPEND_TICKERS: tickers.join(','),
    };
    const proc = spawn(python, [PY_SCRIPT], {
      env,
      cwd: join(__dir, '..', '..'),
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      proc.kill('SIGTERM');
      reject(new Error(`OpenD 抓取逾時 (${timeoutMs}ms)`));
    }, timeoutMs);

    proc.stdout.on('data', (d) => {
      stdout += d;
    });
    proc.stderr.on('data', (d) => {
      stderr += d;
    });

    proc.on('close', (code) => {
      clearTimeout(timer);
      try {
        const data = parseOpenDJson(stdout);
        if (!data.ok) {
          reject(new Error(data.error || stderr || `OpenD exit ${code}`));
          return;
        }
        resolve(data);
      } catch (e) {
        reject(
          new Error(
            `OpenD 輸出解析失敗: ${e.message}${stderr ? ` · ${stderr.slice(0, 200)}` : ''}`,
          ),
        );
      }
    });
  });
}

/** futu-api 會把連線日誌打到 stdout，只取 JSON 本體 */
function parseOpenDJson(stdout) {
  const trimmed = stdout.trim();
  if (!trimmed) throw new Error('empty stdout');

  try {
    return JSON.parse(trimmed);
  } catch {
    /* mixed log + json */
  }

  const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].startsWith('{')) {
      try {
        return JSON.parse(lines[i]);
      } catch {
        /* continue */
      }
    }
  }

  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start >= 0 && end > start) {
    return JSON.parse(trimmed.slice(start, end + 1));
  }

  throw new Error('no JSON object in stdout');
}

export function chainForTicker(opendPayload, ticker) {
  const raw = opendPayload?.chains?.[ticker];
  if (!raw?.options?.length && !raw?.quote?.regularMarketPrice) {
    return null;
  }
  return {
    quote: raw.quote,
    options: raw.options.map((o) => ({
      expirationDate:
        o.expirationDate ??
        Math.floor(new Date(`${o.expirationDateStr}T21:00:00Z`).getTime() / 1000),
      calls: o.calls,
      puts: o.puts,
    })),
  };
}

export { futuCode };
