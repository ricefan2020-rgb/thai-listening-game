# 10 倍股情形收集（美股為主）

用來系統化記錄「**有機會在合理持有期內達到約 10 倍回報**」的公司，以及支撐／否定該論點的各種情形（bull / base / bear）。

**目標市場：美股**（NYSE / NASDAQ；少數 ADR 可收錄但需單獨標註）。港股、A 股等僅在特別說明時納入。

> 本資料夾僅供個人研究筆記，不構成投資建議。所有標的需自行查證並承擔風險。

美股專用欄位、催化劑類型與資料來源見 **[us-market-guide.md](./us-market-guide.md)**。

**當前主題：AI** — 一屏總覽請開 **[index.html](./index.html)**（含 **最新現價**，見 [prices.json](./prices.json)）。更新報價：`node research/ten-bagger/scripts/update-prices.mjs`

### 📱 手機使用（電腦關機也能看）

**雲端版（推薦）**：[DEPLOY.md](./DEPLOY.md)

```
https://ricefan2020-rgb.github.io/thai-listening-game/ten-bagger/index.html
```

推送 `docs/` 後由 GitHub Pages 托管 · 手機「加入主畫面」即可。

**同 Wi‑Fi 本機版**（Mac 需開機）：
```bash
node scripts/serve-mobile.mjs
```

**$5,000 單一標的**：[5k-entry-checklist.md](./5k-entry-checklist.md)（GOOGL 回調進場 · 分批 / 否決條件）

**最新新聞**：[news.md](./news.md) · [news.json](./news.json)（精選 · 手動維護）

**綜合報導（外部+翻譯）**：[news-digest.md](./news-digest.md) · [news-digest.json](./news-digest.json)（Google News RSS → 繁中翻譯 → 各股/市場摘要 · `node scripts/update-news-feed.mjs` · 見 [.env.example](./.env.example)）

**自動翻譯**：觀察板側欄勾選「自動翻譯」即時英→繁中；Reddit 預翻譯：`node scripts/translate-sentiment.mjs`（或 `update-sentiment.mjs` 內建）

**Reddit 討論**：[sentiment.md](./sentiment.md) · [sentiment.json](./sentiment.json)（r/stocks · r/wallstreetbets · r/investing · 觀察板「討論」分頁 + 頂部 Reddit 訊號列 · `node scripts/update-sentiment.mjs`，約 1 分鐘）

**USDC / USDT 流通量**：[stablecoins.md](./stablecoins.md) · [stablecoins.json](./stablecoins.json)（Circle + DeFiLlama · 側欄「穩定幣」· CRCL 卡片份額 · `node scripts/update-stablecoins.mjs`）

**國債收益率**：[yields.md](./yields.md) · [yields.json](./yields.json)（FRED：2Y/5Y/10Y/30Y、SOFR、10Y−2Y 利差 · 側欄「國債」· `node scripts/update-yields.mjs`）

**重要數據日**：[calendar.md](./calendar.md) · [calendar.json](./calendar.json)（休市、CPI/FOMC、觀察名單財報 · 側欄「數據日」· `node scripts/embed-data.mjs` 嵌入）

**K 線 + KDJ**：觀察板下方圖表區（需本地伺服器打開 `index.html`）· 邏輯見 [scripts/chart-kdj.js](./scripts/chart-kdj.js) · 日線數據 [ohlc.json](./ohlc.json)（`node scripts/update-ohlc.mjs` 更新近一年走勢含成交量，避免瀏覽器 CORS）

**量價信號**：**連升量增**（≥2 連陽且量逐步放大）· **價量齊升**（當日）· **價量齊跌**（當日放量下跌）· [scripts/price-volume.js](./scripts/price-volume.js)

**高位回調**：60/20/1年高點回撤% · 卡片與側欄「偏弱」自動更新 · [scripts/pullback.js](./scripts/pullback.js)

**數字分析**：側欄「數字」分頁 · 數據 [metrics.json](./metrics.json) · 渲染 [scripts/numbers-analysis.js](./scripts/numbers-analysis.js)

## 什麼算「10 倍情形」

一檔股票要從現價到 **~10x**，通常來自以下一種或數種疊加（寫清楚是哪一條主線）：

| 驅動類型 | 簡述 | 常見觀察指標 |
|----------|------|----------------|
| `tam` | 市場空間打開（滲透率、出海、新品類） | TAM/SAM、市占、行業增速 |
| `volume` | 量增（產能、渠道、訂單） | 營收增速、產能利用率、在手訂單 |
| `margin` | 利潤率改善（規模、結構、降本） | 毛利率、費用率、單位經濟 |
| `multiple` | 估值重估（從價值到成長、稀缺性） | PE/PS/EV 與同業、歷史分位 |
| `capital` | 資本配置（回購、併購、分紅再投入） | ROIC、每股指標、併購整合 |
| `turnaround` | 困境反轉（裁員、剝離、新 CEO） | 現金流、負債、一次性項目 |
| `platform` | 平台／網路效應（生態、數據飛輪） | 留存、ARPU、生態 GMV |

**10x 的算術直覺**（持有期 5–7 年為例）：

- 僅靠盈利：營收 ×2 且淨利率 ×2 → 利潤約 ×4，若估值再 ×2.5 → 股價可接近 ×10  
- 僅靠估值：利潤不變、PE 從 10→100（較少見且風險大）  
- 實務上多為 **量 + 利 + 估值** 的組合，需在每家公司檔案中寫明假設

## 目錄結構

```
research/ten-bagger/
├── README.md                 ← 本說明
├── us-market-guide.md        ← 美股研究備忘（市值區間、SEC、催化劑）
├── index.md                  ← 總表：所有標的、狀態、主驅動
├── schema.json               ← JSON 結構（可接工具／腳本）
├── templates/
│   └── company-scenario.md   ← 複製後填寫（美股欄位）
└── companies/
    └── _example.md           ← 填寫範例（虛構代碼 ZZZX，勿當真）
```

## 工作流程

1. 複製 `templates/company-scenario.md` → `companies/{TICKER}.md`（大寫代碼，如 `CRWD.md`）
2. 填完 **一句話論點** 與 **三情形**（bull / base / bear）
3. 在 `index.md` 加一行摘要（代碼、市場、狀態、主驅動、下次覆核日）
4. 每次財報／重大事件後更新「催化劑」與「否決條件」

## 狀態定義

| 狀態 | 含義 |
|------|------|
| `watch` | 列入觀察，尚未深度研究 |
| `research` | 正在蒐集資料、建模 |
| `ready` | 論點與估值框架清楚，等待價格／催化 |
| `hold` | 已持倉，追蹤 thesis |
| `pass` | 暫不投或 thesis 失效 |

## 與「機會成本」的關係

同一筆資金若押在 A，就放棄 B 的潛在 10x。建議在 `index.md` 為每檔標註：

- **預期持有期**（年）
- **信心**（1–5）
- **與組合內其他標的的相關性**（高／中／低）

方便比較「哪一檔 10x 情形更硬、更快驗證」。
