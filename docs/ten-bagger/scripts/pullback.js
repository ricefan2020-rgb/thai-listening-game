/**
 * 高位回調比例 · 自 N 日高點回撤
 */

function barClose(b) {
  return b.c ?? b.close;
}

function barHigh(b) {
  return b.h ?? b.high;
}

function periodHigh(bars, days) {
  const slice = bars.slice(-days);
  if (!slice.length) return null;
  return Math.max(...slice.map((b) => barHigh(b) ?? barClose(b)));
}

/** @param {object[]} raw ohlc bars */
export function calcPullback(raw) {
  if (!raw?.length) return null;

  const bars = raw.filter((b) => barClose(b) != null);
  if (bars.length < 5) return null;

  const last = barClose(bars.at(-1));
  const high20 = periodHigh(bars, 20);
  const high60 = periodHigh(bars, Math.min(60, bars.length));
  const highAll = Math.max(...bars.map((b) => barHigh(b) ?? barClose(b)));

  const fromHigh20 = high20 ? ((last / high20 - 1) * 100) : null;
  const fromHigh60 = high60 ? ((last / high60 - 1) * 100) : null;
  const fromHigh1y = highAll ? ((last / highAll - 1) * 100) : null;

  const primary = fromHigh60 ?? fromHigh20 ?? fromHigh1y;
  if (primary == null) return null;

  let severity = 'mild';
  if (primary <= -15) severity = 'deep';
  else if (primary <= -8) severity = 'mid';

  return {
    last,
    high20,
    high60,
    high1y: highAll,
    fromHigh20,
    fromHigh60,
    fromHigh1y,
    primary,
    severity,
    label: fmtPullbackLabel(fromHigh60 ?? fromHigh20),
    detail: `60日高 $${high60?.toFixed(0) ?? '—'} · 20日 ${fromHigh20?.toFixed(1) ?? '—'}% · 年高 ${fromHigh1y?.toFixed(1) ?? '—'}%`,
  };
}

export function fmtPullbackLabel(pct) {
  if (pct == null || Number.isNaN(pct)) return '—';
  if (pct >= -0.05) return '近高';
  return `高${pct.toFixed(0)}%`;
}

/** @param {{ tickers: Record<string, object[]> }} store */
export function scanPullback(store) {
  const out = {};
  if (!store?.tickers) return out;
  for (const [ticker, bars] of Object.entries(store.tickers)) {
    out[ticker] = calcPullback(bars);
  }
  return out;
}

/** 偏弱列表：60日回撤 ≤ -8% */
export function listPullbackWeak(pbMap, threshold = -8) {
  return Object.entries(pbMap || {})
    .filter(([, p]) => p?.fromHigh60 != null && p.fromHigh60 <= threshold)
    .sort((a, b) => (a[1].fromHigh60 || 0) - (b[1].fromHigh60 || 0));
}
