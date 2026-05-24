# 最新新聞 · 觀察名單

> 更新：**2026-05-24** · 機器可讀：[news.json](./news.json) · **非投資建議**

一屏總覽見 [index.html](./index.html) 右側「最新新聞」。

---

## CRCL（Circle · 代碼非 CIRLC）

| 日期 | 摘要 | 解讀 |
|------|------|------|
| **2026-05-11** | **Q1**：收入+儲備 **$694M**（+20%）；USDC **$77B**；鏈上 **$21.5T**（+263%）；Adj. EBITDA **$151M** | 量強、淨利 -15%；環比流通持平 |
| 2026-05-11 | **Arc 預售 $222M**（740M ARC @ $0.30，FDV **$3B**）；BlackRock、Apollo、a16z、ICE 等 | 從「穩定幣」走向 L1+代幣經濟 |
| 2026-05-11 | 股價單日曾 **+16%**；收入略 **低** 部分共識（~$722M）、EPS 小勝 | 催化在 Arc，非純財報 beat |
| 2026-05-11 | **H.C. Wainwright → Buy**，目標 **$150**（現價曾 ~$114 區間） | 看 Arc mainnet、CLARITY 立法 |
| 2026-05-11 | **Circle Agent Stack**（AI 代理支付） | 與 AI 板主題呼應 |

[新聞稿](https://www.circle.com/pressroom/circle-reports-first-quarter-2026-results) · [CNBC Arc](https://www.cnbc.com/2026/05/11/circle-closes-222-million-from-blackrock-apollo-for-arc-blockchain.html) · [公司檔](./companies/CRCL.md)

---

## GOOGL

| 日期 | 摘要 | 解讀 |
|------|------|------|
| **2026-05-20** | **Google I/O 2026**：Search 大改版（**Gemini 3.5 Flash**）、Information Agents | 強化 AI 搜尋護城河敘事 |
| 2026-05-20 | AI Mode 月活約 **10 億**；Gemini 月活約 **9 億** | 採用率故事 |
| 2026-05-20 | **高盛 Buy / PT $450** | 與股價 ~$383 回調並存 |
| 2026-05-20 | **密蘇里 $150 億** 基建（含數據中心） | 呼應 Capex/AI 基建 |
| 2026-05-13~22 | 股價自約 **$403** 高點回調 **~-5%** | 消化 Capex；非基本面崩 |

[I/O 總覽](https://blog.google/innovation-and-ai/technology/ai/google-io-2026-all-our-announcements/) · [公司檔](./companies/GOOGL.md)

---

## NVDA

| 日期 | 摘要 | 解讀 |
|------|------|------|
| **2026-05-20** | **Q1 FY27** 營收 **$81.6B**（+85% YoY）；DC **$75.2B**（+92%） | 業績極強 |
| 2026-05-20 | 新增 **$80B** 回購授權；季息 **$0.01→$0.25** | 資本回饋大增 |
| 2026-05-20 | **Q2 指引 $91B**；**不計** 中國 DC 算力收入 | Bear 需盯中國/毛利 |
| 2026-05-20 | 財報後股價 **偏弱**（預期已打滿） | 解釋「財報好仍回撤」 |

[IR 新聞稿](https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-First-Quarter-Fiscal-2027/default.aspx) · [公司檔](./companies/NVDA.md)

---

## 其他（簡訊）

| Ticker | 日期 | 備註 |
|--------|------|------|
| SIVE | 2026-05 | FY2025 年報（含 PCAOB 調整說明）· 光電分部 Q4 EBITDA 轉正敘事 |
| IREN | — | 下一季覆核 ARR / GPU 上線（待補新聞條） |

---

## 宏觀（與加息筆記連動）

| 主題 | 對組合 |
|------|--------|
| **SOFR / Fed** | **CRCL** 儲備利息；成長股估值分母 |
| **穩定幣立法**（GENIUS / CLARITY） | **CRCL** 催化 |
| **Hyperscaler Capex** | **GOOGL、NVDA** 鏈上受益標的 |

見 [us-market-guide.md](./us-market-guide.md#利率--加息宏觀分母)

---

## 更新方式

### 精選（手動）
1. 編輯 [news.json](./news.json)（側欄與腳本可讀）  
2. 同步本頁表格（可選）  
3. 相關 [companies/*.md](./companies/) 內「最新新聞」小節

### 外部 + 翻譯 + 綜合報導（自動）
```bash
cd research/ten-bagger && node scripts/update-news-feed.mjs
```
→ [news-feed.json](./news-feed.json) · [news-digest.json](./news-digest.json) · 觀察板「新聞」分頁頂部綜述

可選：`OPENAI_API_KEY` 提升翻譯品質 · 見 [.env.example](./.env.example)
