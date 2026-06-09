# 四幣匯率 · RMB / USD / JPY / HKD

> 更新：**2026-05-27** · [forex.json](./forex.json) · 研究筆記 · 政策與市場綜述（2026-05）

**非投資建議** · 非即時報價

## 升跌變化（3–12 個月（相對美元））

| 幣種 | 短線 | 中期方向 | 關鍵驅動 |
|------|------|----------|----------|
| **美元** | 偏強 → 震盪偏強 | 高利率更久 + 避險需求支撐 | Core PCE 仍高於 2% 目標；中東地緣推升油價與通脹預期 |
| **人民幣** | 區間波動 · 穩中略弱/雙向 | 有管理浮動 · 防超調 | PBOC 適度寬鬆 + 穩匯率；每日中間價引導 |
| **日元** | 弱勢震盪 | BOJ 正常化下或有修復 | 6 月 BOJ 加息預期約 70–78%；能源進口國受油價衝擊 |
| **港元** | 聯匯區間內橫行 | 跟隨美元體系 · 匯率非主變量 | 聯繫匯率 7.75–7.85；HIBOR 與美元利率差 |

## 金 · 銀 · 比特幣（腳本更新）

> 抓取：**2026-06-09T11:05:43**（UTC）· 金銀 COMEX 期貨延遲（Yahoo）；BTC 為 Yahoo BTC-USD

| 品項 | 牌價 | 代號 | 來源 |
|------|------|------|------|
| **金** | $4,359/oz | GC=F | Yahoo · Gold Aug 26 |
| **銀** | $68.55/oz | SI=F | Yahoo · Silver Jul 26 |
| **比特幣** | $62,550 | BTC-USD | Yahoo · Bitcoin USD |

`node scripts/update-commodities.mjs` · 再 `update-forex.mjs` / `prepare-pages.mjs`

## 資產配置（方案 D）

| 類型 | RMB | USD | HKD | JPY |
|------|-----|-----|-----|-----|
| 保守 | 45% | 35% | 15% | 5% |
| 平衡 | 30% | 45% | 15% | 10% |
| 進取 | 20% | 55% | 10% | 15% |

## 觀察板

側欄 **「匯率」** · [index.html](./index.html)

## 更新

```bash
cd research/ten-bagger
# 編輯 forex.json 後：
node scripts/update-commodities.mjs   # 金銀 BTC 牌價 → forex.json（需網路）
node scripts/update-forex.mjs
node scripts/embed-data.mjs
node scripts/prepare-pages.mjs
```
