/**
 * 從 Reddit 股市版 hot / top·day 帖文標題萃取加權熱詞
 */
import { WATCH_TICKERS } from './tickers.mjs';

const KNOWN_TICKERS = new Set([
  ...WATCH_TICKERS,
  'SPY', 'QQQ', 'IWM', 'DIA', 'TSLA', 'AAPL', 'MSFT', 'META', 'AMZN', 'NFLX',
  'COIN', 'HOOD', 'SOFI', 'RKLB', 'NBIS', 'SMH', 'MU', 'TSM', 'AVGO', 'MRVL',
  'ORCL', 'CRM', 'UBER', 'BABA', 'GME', 'AMC', 'RIVN', 'LCID', 'INTC', 'QCOM',
]);

/** 標題常見大寫詞，非代號 */
const NOT_TICKERS = new Set(['AI', 'IPO', 'IT', 'US', 'UK', 'EU', 'CEO', 'CFO', 'ETF', 'GDP', 'SEC', 'IRS', 'FED', 'ATH', 'YTD', 'EPS', 'PE', 'IV', 'OTM', 'ITM', 'ATM', 'DD', 'TA', 'PM', 'AM', 'EST', 'PST']);

export const FINANCE_SUBREDDITS = [
  { sub: 'wallstreetbets', weight: 1.15 },
  { sub: 'stocks', weight: 1 },
  { sub: 'investing', weight: 0.95 },
  { sub: 'StockMarket', weight: 0.85 },
  { sub: 'options', weight: 0.75 },
];

const STOP = new Set(
  `a an the and or but if so to of in on at by for with from as is are was were be been being
  it its this that these those i me my we you your they them their he she his her what when where
  why how all any some no not just only also very really too can could would should will shall
  do does did done have has had having get got getting go going went gone make made making
  say says said see saw think know want need like about into out up down over under after before
  than then now today yesterday week month year ago still even though while because since until
  here there who whom which much many more most less least own same other another such each every
  both few lot lots im ive id hes shes youre theyre dont doesnt didnt isnt arent wasnt werent
  cant wont shit fuck damn lol lmao imo tbh btw eta yolo fd rn op edit update thanks thank
  please help question discussion thread daily weekly megathread removed deleted removed deleted
  reddit post comments upvotes downvotes karma crosspost crossposted
  may app years advice general disclaimer rules megathread`.split(/\s+/),
);

/** 常見股市片語（先於分詞比對） */
export const MARKET_PHRASES = [
  'buy the dip',
  'sell the rip',
  'rate cut',
  'rate hike',
  'interest rate',
  'federal reserve',
  'earnings report',
  'earnings call',
  'guidance cut',
  'stock market',
  'market crash',
  'bull market',
  'bear market',
  'all time high',
  'all time low',
  'short squeeze',
  'gamma squeeze',
  'death cross',
  'golden cross',
  'artificial intelligence',
  'data center',
  'hyperscaler capex',
  'tariff',
  'trade war',
  'insider buying',
  'share buyback',
  'stock split',
  'ipo',
];

const THEME_MIN = 3;

export function postWeight(score, comments, subWeight = 1) {
  return subWeight * Math.log10((score || 0) + (comments || 0) * 1.5 + 2);
}

function normalizeTerm(s) {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

/** @param {string} text */
export function extractFromText(text) {
  const tickers = new Set();
  const phrases = [];
  const themes = [];

  let work = ` ${text} `;
  for (const m of text.matchAll(/\$([A-Z]{1,5})\b/g)) {
    if (!NOT_TICKERS.has(m[1])) tickers.add(m[1]);
  }
  for (const m of text.matchAll(/\b([A-Z]{2,5})\b/g)) {
    if (KNOWN_TICKERS.has(m[1]) && !NOT_TICKERS.has(m[1])) tickers.add(m[1]);
  }

  const lower = work.toLowerCase();
  for (const phrase of MARKET_PHRASES) {
    if (lower.includes(phrase)) {
      phrases.push(phrase);
      work = work.replace(new RegExp(phrase.replace(/\s+/g, '\\s+'), 'gi'), ' ');
    }
  }

  const words = work
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= THEME_MIN && !STOP.has(w) && !/^\d+$/.test(w));

  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i];
    const b = words[i + 1];
    if (a.length >= 3 && b.length >= 3 && !STOP.has(a) && !STOP.has(b)) {
      phrases.push(`${a} ${b}`);
    }
  }
  themes.push(...words);

  return { tickers: [...tickers], phrases, themes };
}

export function aggregateKeywords(posts) {
  const termMap = new Map();

  function bump(term, type, w, sub, postId) {
    const key = `${type}:${normalizeTerm(term)}`;
    let row = termMap.get(key);
    if (!row) {
      row = {
        term: type === 'ticker' ? term.toUpperCase() : normalizeTerm(term),
        type,
        score: 0,
        posts: new Set(),
        subs: new Set(),
      };
      termMap.set(key, row);
    }
    row.score += w;
    row.posts.add(postId);
    row.subs.add(sub);
  }

  for (const p of posts) {
    const w = postWeight(p.score, p.comments, p.subWeight);
    const { tickers, phrases, themes } = extractFromText(p.title);
    for (const t of tickers) bump(t, 'ticker', w * 1.4, p.subreddit, p.id);
    for (const ph of phrases) bump(ph, 'phrase', w * 1.2, p.subreddit, p.id);
    for (const th of themes) bump(th, 'theme', w, p.subreddit, p.id);
  }

  return [...termMap.values()]
    .map((r) => ({
      term: r.term,
      type: r.type,
      score: Math.round(r.score * 100) / 100,
      posts: r.posts.size,
      subs: [...r.subs].sort(),
    }))
    .filter((r) => r.score >= 0.5)
    .sort((a, b) => b.score - a.score);
}

export async function fetchRedditListing(subreddit, sort, limit, ua) {
  const t = sort === 'top' ? '&t=day' : '';
  const url = `https://www.reddit.com/r/${subreddit}/${sort}.json?limit=${limit}${t}`;
  const res = await fetch(url, { headers: { 'User-Agent': ua } });
  if (!res.ok) throw new Error(`r/${subreddit}/${sort}: HTTP ${res.status}`);
  const data = await res.json();
  return data?.data?.children || [];
}

export function childToPost(child, subreddit, subWeight) {
  const d = child.data;
  return {
    id: d.id,
    subreddit,
    subWeight,
    title: d.title || '',
    score: d.score ?? 0,
    comments: d.num_comments ?? 0,
    url: d.permalink ? `https://www.reddit.com${d.permalink}` : d.url,
    created: new Date((d.created_utc || 0) * 1000).toISOString().slice(0, 10),
  };
}

const JUNK_PHRASE_PARTS = new Set(
  `seen group groups your their this that what just like about into from with have
  been being would could should really very much many some`.split(/\s+/),
);

function isJunkPhrase(term) {
  const parts = normalizeTerm(term).split(/\s+/);
  if (parts.length === 2 && parts.some((p) => JUNK_PHRASE_PARTS.has(p))) return true;
  return false;
}

/** 常年霸榜，不標為「突然爆火」 */
const ALWAYS_HOT = new Set(
  `stock stocks market trading invest investing money wall street wallstreet reddit
  post news today week year hold buy sell shares share price prices portfolio
  earnings report options option calls puts call put bull bear crash rally
  question discussion thread daily weekly`.split(/\s+/),
);

function termKey(k) {
  return `${k.type}:${normalizeTerm(k.term)}`;
}

/**
 * 與上一輪快照比對，找出分數/帖數突然飆升的關鍵字
 * @param {Array} current - aggregateKeywords 輸出
 * @param {Record<string,{score:number,posts:number}>} baseline
 */
export function detectKeywordSurges(current, baseline = {}, opts = {}) {
  const minDelta = opts.minDelta ?? 4;
  const minRatio = opts.minRatio ?? 2.2;
  const minScore = opts.minScore ?? 6;
  const minPosts = opts.minPosts ?? 2;
  const limit = opts.limit ?? 12;

  const surges = [];
  for (const k of current) {
    const norm = normalizeTerm(k.term);
    if (ALWAYS_HOT.has(norm)) continue;
    if (k.type === 'theme' && norm.length < 4) continue;
    if (k.type === 'phrase' && isJunkPhrase(k.term)) continue;
    if (
      k.type === 'phrase' &&
      !MARKET_PHRASES.includes(norm) &&
      (k.posts < 3 || k.score < 8)
    ) {
      continue;
    }

    const key = termKey(k);
    const base = baseline[key] || { score: 0, posts: 0 };
    const delta = k.score - base.score;
    const ratio = k.score / Math.max(base.score, 0.35);

    let surgeReason = '';
    let surgeScore = 0;

    if (base.score < 0.5 && k.score >= minScore && k.posts >= minPosts) {
      surgeReason = '新冒出';
      surgeScore = k.score * 1.2;
    } else if (delta >= minDelta && k.posts >= minPosts && k.score >= 3) {
      surgeReason = `↑${Math.round(delta * 10) / 10}`;
      surgeScore = delta * Math.min(ratio, 4);
    } else if (ratio >= minRatio && k.score >= 4 && k.posts >= minPosts) {
      surgeReason = `×${Math.round(ratio * 10) / 10}`;
      surgeScore = delta + k.score * 0.4;
    } else {
      continue;
    }

    surges.push({
      term: k.term,
      type: k.type,
      score: k.score,
      posts: k.posts,
      subs: k.subs,
      prevScore: Math.round(base.score * 100) / 100,
      delta: Math.round(delta * 100) / 100,
      ratio: Math.round(ratio * 100) / 100,
      surgeReason,
      surgeScore: Math.round(surgeScore * 100) / 100,
    });
  }

  return surges.sort((a, b) => b.surgeScore - a.surgeScore).slice(0, limit);
}

export function baselineFromKeywords(keywords) {
  const map = {};
  for (const k of keywords || []) {
    map[termKey(k)] = { score: k.score, posts: k.posts };
  }
  return map;
}
