/**
 * 價量齊升 / 連升量增 / 價量齊跌 · 本地日 K（需含成交量 v）
 */

function barClose(b) {
  return b.c ?? b.close;
}

function barVol(b) {
  return b.v ?? b.volume ?? 0;
}

function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function lastBarStats(raw) {
  if (!raw?.length || raw.length < 22) return null;

  const bars = raw.filter((b) => barClose(b) != null && barVol(b) > 0);
  if (bars.length < 22) return null;

  const last = bars.at(-1);
  const prev = bars.at(-2);
  const c0 = barClose(last);
  const c1 = barClose(prev);
  const v0 = barVol(last);
  const v1 = barVol(prev);

  const vols = bars.slice(-21, -1).map(barVol);
  const volMa20 = avg(vols);
  if (!volMa20 || !c1) return null;

  const chgPct = ((c0 / c1 - 1) * 100);
  const volRatio = v0 / volMa20;
  const volSpike = v0 / v1;

  return {
    c0,
    c1,
    v0,
    v1,
    chgPct,
    volRatio,
    volSpike,
    priceUp: c0 > c1,
    priceDown: c0 < c1,
    volUp: v0 > v1,
  };
}

/**
 * @param {object[]} raw
 * @returns {{label:string,type:string,detail:string,chgPct:number,volRatio:number,volSpike:number}|null}
 */
export function calcPvRise(raw) {
  const s = lastBarStats(raw);
  if (!s || !s.priceUp || !s.volUp) return null;

  const strongVol = s.volRatio >= 1.05 || s.volSpike >= 1.2;

  if (strongVol) {
    return {
      label: '價量齊升',
      type: 'pv-rise',
      chgPct: s.chgPct,
      volRatio: s.volRatio,
      volSpike: s.volSpike,
      detail: `收 +${s.chgPct.toFixed(1)}% · 量 ${s.volRatio.toFixed(1)}×均 · 昨量×${s.volSpike.toFixed(2)}`,
    };
  }

  return {
    label: '量價同升',
    type: 'pv-mild',
    chgPct: s.chgPct,
    volRatio: s.volRatio,
    volSpike: s.volSpike,
    detail: `價升量增 · 量 ${s.volRatio.toFixed(1)}×均`,
  };
}

/**
 * 價量齊跌：當日價跌 + 量增（放量下跌）
 */
export function calcPvFall(raw) {
  const s = lastBarStats(raw);
  if (!s || !s.priceDown || !s.volUp) return null;

  const strongVol = s.volRatio >= 1.05 || s.volSpike >= 1.2;

  if (strongVol) {
    return {
      label: '價量齊跌',
      type: 'pv-fall',
      chgPct: s.chgPct,
      volRatio: s.volRatio,
      volSpike: s.volSpike,
      detail: `收 ${s.chgPct.toFixed(1)}% · 量 ${s.volRatio.toFixed(1)}×均 · 昨量×${s.volSpike.toFixed(2)}`,
    };
  }

  return {
    label: '跌量增',
    type: 'pv-fall-mild',
    chgPct: s.chgPct,
    volRatio: s.volRatio,
    volSpike: s.volSpike,
    detail: `價跌量增 · 量 ${s.volRatio.toFixed(1)}×均`,
  };
}

/**
 * 連升量增：連續 N 日收陽（N≥2），且連升期間每日成交量 > 前一日
 */
export function calcPvStreak(raw) {
  if (!raw?.length || raw.length < 22) return null;

  const bars = raw.filter((b) => barClose(b) != null && barVol(b) > 0);
  if (bars.length < 22) return null;

  let streak = 0;
  for (let i = bars.length - 1; i >= 1; i--) {
    if (barClose(bars[i]) > barClose(bars[i - 1])) streak++;
    else break;
  }
  if (streak < 2) return null;

  const streakStart = bars.length - streak;
  for (let i = streakStart; i < bars.length; i++) {
    if (barVol(bars[i]) <= barVol(bars[i - 1])) return null;
  }

  const last = bars.at(-1);
  const base = bars.at(streakStart - 1);
  const baseClose = base ? barClose(base) : barClose(bars[streakStart]);
  const totalChg = baseClose ? ((barClose(last) / baseClose - 1) * 100) : 0;
  const s = lastBarStats(raw);

  const label = streak >= 3 ? '3連升量增' : '連升量增';
  const type = streak >= 3 ? 'pv-streak-3' : 'pv-streak';

  return {
    label,
    type,
    streak,
    chgPct: s?.chgPct ?? 0,
    volRatio: s?.volRatio ?? 1,
    volSpike: s?.volSpike ?? 1,
    detail: `${streak}連陽 · 量逐步放大 · 累計 +${totalChg.toFixed(1)}%`,
  };
}

/** 單一標的：連升量增 > 當日齊升 > 齊跌 */
export function calcPvSignal(raw) {
  return calcPvStreak(raw) || calcPvRise(raw) || calcPvFall(raw);
}

/** @param {{ tickers: Record<string, object[]> }} store */
export function scanPriceVolume(store) {
  const out = {};
  if (!store?.tickers) return out;
  for (const [ticker, bars] of Object.entries(store.tickers)) {
    out[ticker] = calcPvSignal(bars);
  }
  return out;
}

export function listPvStreak(pvMap) {
  return Object.entries(pvMap || {})
    .filter(([, s]) => s?.type === 'pv-streak' || s?.type === 'pv-streak-3')
    .sort((a, b) => (b[1].streak || 0) - (a[1].streak || 0));
}

export function listPvRise(pvMap) {
  return Object.entries(pvMap || {})
    .filter(([, s]) => s?.type === 'pv-rise')
    .sort((a, b) => (b[1].volRatio || 0) - (a[1].volRatio || 0));
}

/** 走佢橫條：連升量增 + 當日價量齊升 */
export function listPvGo(pvMap) {
  return [...listPvStreak(pvMap), ...listPvRise(pvMap)];
}

export function listPvFall(pvMap) {
  return Object.entries(pvMap || {})
    .filter(([, s]) => s?.type === 'pv-fall')
    .sort((a, b) => (a[1].chgPct || 0) - (b[1].chgPct || 0));
}
