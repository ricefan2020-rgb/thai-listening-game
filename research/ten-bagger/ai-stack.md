# 美股 AI 產業鏈 — 10 倍股觀察地圖

本頁對應 `companies/*.md` 分層，方便按「卡脖子環節」補標的，避免組合全是同一段 beta。

```
                    ┌─────────────────────────────────────┐
                    │  應用 / Agent / 企業工作流           │
                    │  PLTR, (待補: CRM, NOW, PATH…)      │
                    └─────────────────┬───────────────────┘
                                      │
                    ┌─────────────────▼───────────────────┐
                    │  數據 / 模型編排 / MLOps             │
                    │  SNOW, (待補: DDOG, MDB, ESTC…)     │
                    └─────────────────┬───────────────────┘
                                      │
        ┌─────────────────────────────▼─────────────────────────────┐
        │  雲端 / 超大規模 API（通常 10x 難，可作基準）                  │
        │  GOOGL ✓ · MSFT, META, AMZN — 雲 Capex 錨                    │
        └─────────────────────────────┬─────────────────────────────┘
                                      │
    ┌───────────────┬─────────────────┼─────────────────┬───────────────┐
    │  網路         │  機櫃/電力/冷卻  │  伺服器組裝      │  連接/光模組   │
    │  ANET  VRT    │  IREN·SMCI      │  SIVE  COHR?    │  (光模組)     │
    └───────┬───────┴────────┬────────┴────────┬────────┴───────┬───────┘
            │                │                 │                │
            └────────────────┼─────────────────┼────────────────┘
                             ▼
                    ┌─────────────────┐
                    │  算力 / IP       │
                    │  NVDA, AMD, ARM │
                    │  (待補: AVGO,   │
                    │   MRVL, ALAB…)  │
                    └─────────────────┘
```

## 已建檔（2026-05-24）

| Ticker | 層級 | 10x 現實度（主觀） | 檔案 |
|--------|------|-------------------|------|
| NVDA | GPU 寡占 | 低（large） | [NVDA.md](./companies/NVDA.md) |
| AMD | GPU/CPU #2 | 中 | [AMD.md](./companies/AMD.md) |
| ARM | 晶片 IP | 中 | [ARM.md](./companies/ARM.md) |
| ANET | DC 網路 | 中 | [ANET.md](./companies/ANET.md) |
| VRT | 電力/冷卻 | 中–高 | [VRT.md](./companies/VRT.md) |
| SMCI | AI 伺服器 | 高波動 | [SMCI.md](./companies/SMCI.md) |
| PLTR | 企業 AI OS | 中–高 | [PLTR.md](./companies/PLTR.md) |
| SNOW | 數據雲 | 中（需 NDR 修復） | [SNOW.md](./companies/SNOW.md) |
| SIVE | InP 激光（非美股 SLIVER） | 中高（小盤） | [SIVE.md](./companies/SIVE.md) |
| GOOGL | 雲+全棧 AI | 低（mega，錨2-3x） | [GOOGL.md](./companies/GOOGL.md) |
| IREN | AI Cloud+電力 | 中高（轉型） | [IREN.md](./companies/IREN.md) |

## 建議下一批補充（未建檔）

按層級挑 1–2 個即可，避免重複 beta：

| 層級 | 候選 Ticker | 備註 |
|------|-------------|------|
| 定制矽 / 網路晶片 | AVGO, MRVL | 與 AI 集群連接、ASIC |
| 光模組 | COHR, LITE, CIEN | 800G 升級週期 |
| 小型 GPU/加速 | ALAB, CRDO | 高波動、高 10x 敘事、高風險 |
| 雲端（基準） | MSFT, GOOGL | 多為 2–3x 非 10x |
| 安全 + AI | CRWD, PANW | 平台型 |
| 能源（DC 電力） | VST, CEG | 與 AI 電力需求相關 |
| 模型純玩 | 無純美股 OpenAI；留意 APP、AI（C3）高風險 |

## 組合建構提示

1. **不要 8 檔全是 NVDA beta** — 至少拆成算力 / 基建 / 軟體三桶。  
2. **10x 槽位** 優先 small–mid + 可驗證催化（財報、訂單、NDR）。  
3. **large cap** 放 `watch` 作錨，Bull 倍數寫 2–4x 以免自我欺騙。  
4. 每季用 hyperscaler **Capex 指引** 統一覆核 ANET、VRT、SMCI、NVDA。  

## 宏觀開關（全板塊）

| 開關 | 利多 | 利空 |
|------|------|------|
| 利率 / 實質利率 | 下降 → 成長估值擴張 | 上升 → 殺 long duration |
| Capex 週期 | 上修 | 砍支 |
| 出口管制 | 本土鏈受益 | 收入天花板 |
| 電力/電網 | 利好 VRT、公用事業 | 項目延遲 |
