#!/usr/bin/env node
/**
 * 將 calendar.json 等嵌入 index.html
 * 用法：node research/ten-bagger/scripts/embed-data.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = join(root, 'index.html');
let html = readFileSync(htmlPath, 'utf8');

function embed(markerStart, markerEnd, id, jsonPath) {
  const payload = readFileSync(join(root, jsonPath), 'utf8').trim();
  const compact = JSON.stringify(JSON.parse(payload));
  const re = new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`);
  if (!re.test(html)) {
    console.warn('Markers not found:', markerStart);
    return;
  }
  html = html.replace(
    re,
    `${markerStart}\n  <script type="application/json" id="${id}">${compact}</script>\n  ${markerEnd}`,
  );
  console.log('Embedded', jsonPath);
}

embed('<!-- CALENDAR_START -->', '<!-- CALENDAR_END -->', 'calendar-data', 'calendar.json');

try {
  embed('<!-- METRICS_START -->', '<!-- METRICS_END -->', 'metrics-data', 'metrics.json');
} catch {
  console.warn('Skip metrics.json');
}

try {
  embed('<!-- SENTIMENT_START -->', '<!-- SENTIMENT_END -->', 'sentiment-data', 'sentiment.json');
} catch {
  console.warn('Skip sentiment.json (run update-sentiment.mjs first)');
}

try {
  embed('<!-- OPTIONS_START -->', '<!-- OPTIONS_END -->', 'options-data', 'options.json');
} catch {
  console.warn('Skip options.json (run update-options.mjs first)');
}

try {
  embed(
    '<!-- REDDIT_KW_START -->',
    '<!-- REDDIT_KW_END -->',
    'reddit-keywords-data',
    'reddit-keywords.json',
  );
} catch {
  console.warn('Skip reddit-keywords.json (run update-reddit-keywords.mjs first)');
}

try {
  embed('<!-- STOCKTWITS_START -->', '<!-- STOCKTWITS_END -->', 'stocktwits-data', 'stocktwits.json');
} catch {
  console.warn('Skip stocktwits.json (run update-stocktwits.mjs first)');
}

try {
  embed(
    '<!-- STABLECOINS_START -->',
    '<!-- STABLECOINS_END -->',
    'stablecoins-data',
    'stablecoins.json',
  );
} catch {
  console.warn('Skip stablecoins.json (run update-stablecoins.mjs first)');
}

try {
  embed('<!-- YIELDS_START -->', '<!-- YIELDS_END -->', 'yields-data', 'yields.json');
} catch {
  console.warn('Skip yields.json (run update-yields.mjs first)');
}

try {
  embed('<!-- FOREX_START -->', '<!-- FOREX_END -->', 'forex-data', 'forex.json');
} catch {
  console.warn('Skip forex.json');
}

try {
  embed(
    '<!-- NEWS_DIGEST_START -->',
    '<!-- NEWS_DIGEST_END -->',
    'news-digest-data',
    'news-digest.json',
  );
} catch {
  console.warn('Skip news-digest.json (run update-news-feed.mjs first)');
}

writeFileSync(htmlPath, html);
