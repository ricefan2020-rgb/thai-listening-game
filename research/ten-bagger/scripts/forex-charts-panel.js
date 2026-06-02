/**
 * 匯率 / 金銀 BTC 走勢圖 · forex-charts.json + lightweight-charts
 */

const CHART_COLORS = {
  gold: '#e8c547',
  silver: '#b8c8d8',
  btc: '#f7931a',
  dxy: '#9ee0f0',
  usdjpy: '#c8a0e8',
  usdcny: '#e8a090',
  usdhkd: '#90c8b0',
};

let chartsStore = null;
const chartInstances = new Map();

export async function loadForexCharts() {
  const el = document.getElementById('forex-charts-data');
  if (el?.textContent?.trim() && el.textContent.trim() !== '{}') {
    try {
      const data = JSON.parse(el.textContent);
      if (data?.series) return data;
    } catch {
      /* fall through */
    }
  }
  const res = await fetch('./forex-charts.json');
  if (!res.ok) throw new Error('forex-charts.json 載入失敗');
  const data = await res.json();
  if (el) el.textContent = JSON.stringify(data);
  return data;
}

function toLwData(points) {
  return (points || []).map((p) => ({
    time: p.t,
    value: p.c,
  }));
}

function fmtChg(pct) {
  if (pct == null || Number.isNaN(pct)) return '—';
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct}%`;
}

function chgClass(pct) {
  if (pct == null) return '';
  if (pct > 0) return 'up';
  if (pct < 0) return 'down';
  return '';
}

function destroyCharts() {
  for (const c of chartInstances.values()) {
    try {
      c.remove();
    } catch {
      /* ignore */
    }
  }
  chartInstances.clear();
}

function makeMiniChart(container, points, color) {
  if (!container || !window.LightweightCharts || !points?.length) return null;
  container.innerHTML = '';
  const chart = window.LightweightCharts.createChart(container, {
    width: container.clientWidth || 280,
    height: container.clientHeight || 72,
    layout: {
      background: { color: 'transparent' },
      textColor: '#6a7a80',
      fontSize: 9,
    },
    grid: {
      vertLines: { visible: false },
      horzLines: { color: '#1a2228' },
    },
    rightPriceScale: { borderVisible: false },
    timeScale: { borderVisible: false, fixLeftEdge: true, fixRightEdge: true },
    crosshair: { vertLine: { visible: false }, horzLine: { visible: false } },
    handleScroll: false,
    handleScale: false,
  });
  const series = chart.addAreaSeries({
    lineColor: color,
    topColor: `${color}44`,
    bottomColor: `${color}08`,
    lineWidth: 2,
    priceLineVisible: false,
    lastValueVisible: false,
  });
  series.setData(toLwData(points));
  chart.timeScale().fitContent();
  chartInstances.set(container.id, chart);
  return chart;
}

function renderAllocChart(host, allocation) {
  const keys = [
    { k: 'RMB', c: '#e8a090' },
    { k: 'USD', c: '#9ee0f0' },
    { k: 'HKD', c: '#90c8b0' },
    { k: 'JPY', c: '#c8a0e8' },
  ];
  const profiles = ['conservative', 'balanced', 'aggressive'];
  const rows = profiles
    .map((p) => {
      const prof = allocation?.[p];
      if (!prof) return '';
      const segs = keys
        .map(({ k, c }) => {
          const v = prof[k] ?? 0;
          return `<span class="fx-alloc-seg" style="width:${v}%;background:${c}" title="${k} ${v}%"></span>`;
        })
        .join('');
      return `<div class="fx-alloc-row"><span class="fx-alloc-label">${prof.label || p}</span><div class="fx-alloc-bar">${segs}</div></div>`;
    })
    .join('');
  host.innerHTML = rows;
}

function renderCorrBars(host, corrData) {
  const pairs = corrData?.topAbs?.slice(0, 8) || [];
  if (!pairs.length) {
    host.innerHTML = '<p class="fx-chart-empty">無相關數據 · 跑 analyze-correlations.mjs</p>';
    return;
  }
  host.innerHTML = pairs
    .map((p) => {
      const w = Math.round(Math.abs(p.r) * 100);
      const cls = p.r >= 0 ? 'pos' : 'neg';
      return `<div class="fx-corr-row">
        <span class="fx-corr-label">${p.a}/${p.b}</span>
        <div class="fx-corr-track"><div class="fx-corr-fill ${cls}" style="width:${w}%"></div></div>
        <span class="fx-corr-val ${cls}">${p.r >= 0 ? '+' : ''}${p.r.toFixed(2)}</span>
      </div>`;
    })
    .join('');
}

export function renderForexChartsPanel(chartsData, forexData, corrData) {
  destroyCharts();

  const commHost = document.getElementById('fx-chart-commodities');
  const fxHost = document.getElementById('fx-chart-fx');
  const allocHost = document.getElementById('fx-chart-alloc');
  const corrHost = document.getElementById('fx-chart-corr');

  if (!chartsData?.series) return;

  const s = chartsData.series;
  if (commHost) {
    const items = ['gold', 'silver', 'btc']
      .filter((k) => s[k])
      .map((k) => {
        const x = s[k];
        return `<div class="fx-mini-chart-wrap">
          <div class="fx-mini-head">
            <b>${x.nameZh}</b>
            <span>${x.spot?.toLocaleString?.() ?? x.spot}</span>
            <em class="${chgClass(x.changePct)}">${fmtChg(x.changePct)} ${chartsData.range || ''}</em>
          </div>
          <div class="fx-mini-chart" id="fx-chart-${k}" aria-label="${x.nameZh} 走勢"></div>
        </div>`;
      })
      .join('');
    commHost.innerHTML = items;
    for (const k of ['gold', 'silver', 'btc']) {
      if (!s[k]) continue;
      const el = document.getElementById(`fx-chart-${k}`);
      makeMiniChart(el, s[k].points, CHART_COLORS[k]);
    }
  }

  if (fxHost) {
    const items = ['dxy', 'usdjpy', 'usdcny', 'usdhkd']
      .filter((k) => s[k])
      .map((k) => {
        const x = s[k];
        return `<div class="fx-mini-chart-wrap fx-mini-chart-wrap--fx">
          <div class="fx-mini-head">
            <b>${x.nameZh}</b>
            <span>${x.spot}</span>
            <em class="${chgClass(x.changePct)}">${fmtChg(x.changePct)}</em>
          </div>
          <div class="fx-mini-chart" id="fx-chart-${k}" aria-label="${x.nameZh} 走勢"></div>
        </div>`;
      })
      .join('');
    fxHost.innerHTML = items;
    for (const k of ['dxy', 'usdjpy', 'usdcny', 'usdhkd']) {
      if (!s[k]) continue;
      const el = document.getElementById(`fx-chart-${k}`);
      makeMiniChart(el, s[k].points, CHART_COLORS[k]);
    }
  }

  if (allocHost && forexData?.allocation) renderAllocChart(allocHost, forexData.allocation);
  if (corrHost && corrData) renderCorrBars(corrHost, corrData);
}

export function resizeForexCharts() {
  for (const [id, chart] of chartInstances) {
    const el = document.getElementById(id);
    if (!el) continue;
    chart.applyOptions({ width: el.clientWidth || 280 });
  }
}
