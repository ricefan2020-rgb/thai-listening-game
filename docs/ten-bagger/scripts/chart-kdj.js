/**
 * K 線 + KDJ（9,3,3）· 本地 ohlc.json（避免瀏覽器 CORS）
 */

const YAHOO_SYMBOL = { SIVE: 'SIVEF' };

let ohlcStore = null;

export function yahooSymbol(ticker) {
  return YAHOO_SYMBOL[ticker] || ticker;
}

function expandBar(bar) {
  const out = {
    time: bar.t ?? bar.time,
    open: bar.o ?? bar.open,
    high: bar.h ?? bar.high,
    low: bar.l ?? bar.low,
    close: bar.c ?? bar.close,
  };
  const vol = bar.v ?? bar.volume;
  if (vol != null) out.volume = vol;
  return out;
}

/** 載入本地 K 線（內嵌或 ohlc.json） */
export async function initOhlcStore() {
  if (ohlcStore?.tickers) return ohlcStore;

  const el = document.getElementById('ohlc-data');
  if (el?.textContent) {
    try {
      ohlcStore = JSON.parse(el.textContent);
      if (ohlcStore?.tickers) return ohlcStore;
    } catch {
      /* fall through */
    }
  }

  const res = await fetch('./ohlc.json');
  if (res.ok) {
    ohlcStore = await res.json();
    if (el && ohlcStore?.tickers) {
      el.textContent = JSON.stringify(ohlcStore);
    }
    return ohlcStore;
  }

  throw new Error('無 K 線數據 · 請執行 node scripts/update-ohlc.mjs');
}

/** @param {{time:string,open:number,high:number,low:number,close:number}[]} candles */
export function calcKDJ(candles, n = 9) {
  const k = [];
  const d = [];
  const j = [];
  let prevK = 50;
  let prevD = 50;

  for (let i = 0; i < candles.length; i++) {
    if (i < n - 1) {
      k.push(null);
      d.push(null);
      j.push(null);
      continue;
    }
    const slice = candles.slice(i - n + 1, i + 1);
    const low = Math.min(...slice.map((c) => c.low));
    const high = Math.max(...slice.map((c) => c.high));
    const close = candles[i].close;
    const rsv = high === low ? 50 : ((close - low) / (high - low)) * 100;
    const K = (2 / 3) * prevK + (1 / 3) * rsv;
    const D = (2 / 3) * prevD + (1 / 3) * K;
    const J = 3 * K - 2 * D;
    k.push(K);
    d.push(D);
    j.push(J);
    prevK = K;
    prevD = D;
  }
  return { k, d, j };
}

/** 最新 KDJ 信號（研究用，非交易建議） */
export function kdjSignal(k, d, j) {
  const i = k.length - 1;
  if (i < 1 || k[i] == null) return { label: '—', type: 'neutral', detail: '' };

  const Ki = k[i];
  const Di = d[i];
  const Ji = j[i];
  const Kp = k[i - 1];
  const Dp = d[i - 1];

  const golden = Kp <= Dp && Ki > Di;
  const death = Kp >= Dp && Ki < Di;
  const oversold = Ki < 20 && Di < 20;
  const overbought = Ki > 80 && Di > 80;

  let label = '中性';
  let type = 'neutral';
  let detail = `K ${Ki.toFixed(1)} · D ${Di.toFixed(1)} · J ${Ji.toFixed(1)}`;

  if (golden && oversold) {
    label = '金叉+超賣';
    type = 'bull';
    detail = 'K 上穿 D，區域超賣';
  } else if (golden) {
    label = '金叉';
    type = 'bull';
    detail = 'K 上穿 D';
  } else if (death && overbought) {
    label = '死叉+超買';
    type = 'bear';
    detail = 'K 下穿 D，區域超買';
  } else if (death) {
    label = '死叉';
    type = 'bear';
    detail = 'K 下穿 D';
  } else if (oversold) {
    label = '超賣';
    type = 'bull';
  } else if (overbought) {
    label = '超買';
    type = 'bear';
  } else if (Ji > 100) {
    label = 'J 過熱';
    type = 'bear';
  } else if (Ji < 0) {
    label = 'J 過冷';
    type = 'bull';
  }

  return { label, type, detail, k: Ki, d: Di, j: Ji };
}

export async function fetchCandles(ticker) {
  const store = await initOhlcStore();
  const raw = store.tickers?.[ticker];
  if (!raw?.length) {
    throw new Error(`${ticker} 無本地 K 線`);
  }
  return raw.map(expandBar);
}

export function createChartController(opts) {
  const {
    candleEl,
    kdjEl,
    onSignal,
    onLoading,
    onError,
  } = opts;

  if (!window.LightweightCharts) {
    onError?.('圖表庫未載入');
    return null;
  }

  const chartOpts = {
    layout: {
      background: { color: '#141414' },
      textColor: '#8a8a8a',
    },
    grid: {
      vertLines: { color: '#1e1e1e' },
      horzLines: { color: '#1e1e1e' },
    },
    rightPriceScale: { borderColor: '#2e2e2e' },
    timeScale: { borderColor: '#2e2e2e', timeVisible: true },
    crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
  };

  const candleChart = LightweightCharts.createChart(candleEl, {
    ...chartOpts,
    height: candleEl.clientHeight || 160,
  });
  const kdjChart = LightweightCharts.createChart(kdjEl, {
    ...chartOpts,
    height: kdjEl.clientHeight || 88,
    rightPriceScale: {
      borderColor: '#2e2e2e',
      scaleMargins: { top: 0.1, bottom: 0.1 },
    },
  });

  const candleSeries = candleChart.addCandlestickSeries({
    upColor: '#3ecf8e',
    downColor: '#f07178',
    borderUpColor: '#3ecf8e',
    borderDownColor: '#f07178',
    wickUpColor: '#3ecf8e',
    wickDownColor: '#f07178',
  });

  const kLine = kdjChart.addLineSeries({ color: '#d4af37', lineWidth: 1, title: 'K' });
  const dLine = kdjChart.addLineSeries({ color: '#6eb5ff', lineWidth: 1, title: 'D' });
  const jLine = kdjChart.addLineSeries({ color: '#e8a838', lineWidth: 1, lineStyle: 2, title: 'J' });

  // 超買超賣參考線
  [80, 50, 20].forEach((val) => {
    kLine.createPriceLine({
      price: val,
      color: '#333',
      lineWidth: 1,
      lineStyle: LightweightCharts.LineStyle.Dotted,
      axisLabelVisible: val === 80 || val === 20,
    });
  });

  function resizeCharts() {
    const cw = candleEl.clientWidth;
    const ch = candleEl.clientHeight;
    const kw = kdjEl.clientWidth;
    const kh = kdjEl.clientHeight;
    if (cw > 0 && ch > 0) candleChart.applyOptions({ width: cw, height: ch });
    if (kw > 0 && kh > 0) kdjChart.applyOptions({ width: kw, height: kh });
  }

  let resizeObs;
  const resizeTarget = candleEl.closest('.chart-section') || candleEl.parentElement;
  if (typeof ResizeObserver !== 'undefined' && resizeTarget) {
    resizeObs = new ResizeObserver(() => resizeCharts());
    resizeObs.observe(resizeTarget);
  }
  const onOrientation = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resizeCharts);
    });
  };
  window.addEventListener('orientationchange', onOrientation);

  const cache = new Map();

  async function load(ticker) {
    onLoading?.(true);
    try {
      let candles = cache.get(ticker);
      if (!candles) {
        candles = await fetchCandles(ticker);
        cache.set(ticker, candles);
      }

      const ohlc = candles.map((c) => ({
        time: c.time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }));
      candleSeries.setData(ohlc);

      const { k, d, j } = calcKDJ(candles);
      const toLine = (arr) =>
        candles
          .map((c, i) => (arr[i] != null ? { time: c.time, value: arr[i] } : null))
          .filter(Boolean);

      kLine.setData(toLine(k));
      dLine.setData(toLine(d));
      jLine.setData(toLine(j));

      candleChart.timeScale().fitContent();
      kdjChart.timeScale().fitContent();
      requestAnimationFrame(resizeCharts);
      candleChart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
        if (range) kdjChart.timeScale().setVisibleLogicalRange(range);
      });

      const sig = kdjSignal(k, d, j);
      const asOf = ohlcStore?.asOf || '';
      onSignal?.(ticker, sig, { bars: candles.length, asOf });
      onLoading?.(false);
      return sig;
    } catch (err) {
      onError?.(err.message || String(err));
      onLoading?.(false);
      throw err;
    }
  }

  function destroy() {
    resizeObs?.disconnect();
    window.removeEventListener('orientationchange', onOrientation);
    candleChart.remove();
    kdjChart.remove();
  }

  return { load, destroy, prefetch: (t) => fetchCandles(t).then((c) => cache.set(t, c)) };
}

/** 卡片用小標籤用 */
export async function quickKdjLabel(ticker) {
  try {
    const candles = await fetchCandles(ticker);
    const { k, d, j } = calcKDJ(candles);
    return kdjSignal(k, d, j);
  } catch {
    return { label: '—', type: 'neutral' };
  }
}
