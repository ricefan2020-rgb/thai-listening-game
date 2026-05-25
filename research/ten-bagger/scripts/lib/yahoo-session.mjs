/** Yahoo Finance crumb + cookie（options / chart 等） */
let cache = null;
let cacheAt = 0;
const TTL_MS = 30 * 60 * 1000;
const FETCH_MS = Number(process.env.YAHOO_FETCH_MS || 25000);

function fetchTimeout(url, init = {}) {
  return fetch(url, { ...init, signal: AbortSignal.timeout(FETCH_MS) });
}

export async function getYahooSession() {
  if (cache && Date.now() - cacheAt < TTL_MS) return cache;
  const fc = await fetchTimeout('https://fc.yahoo.com', {
    redirect: 'manual',
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  const cookie = (fc.headers.getSetCookie?.() || [])
    .map((c) => c.split(';')[0])
    .join('; ');
  const crumbRes = await fetchTimeout('https://query1.finance.yahoo.com/v1/test/getcrumb', {
    headers: { 'User-Agent': 'Mozilla/5.0', Cookie: cookie },
  });
  const crumb = await crumbRes.text();
  if (!crumb || crumb.includes('Unauthorized')) {
    throw new Error('Yahoo crumb 取得失敗');
  }
  cache = { cookie, crumb };
  cacheAt = Date.now();
  return cache;
}

export async function yahooGetJson(url) {
  const { cookie, crumb } = await getYahooSession();
  const sep = url.includes('?') ? '&' : '?';
  const res = await fetchTimeout(`${url}${sep}crumb=${encodeURIComponent(crumb)}`, {
    headers: { 'User-Agent': 'Mozilla/5.0', Cookie: cookie },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
