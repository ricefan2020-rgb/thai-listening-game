# 重要數據日子

> 更新見 [calendar.json](./calendar.json) · 觀察板側欄 **「數據日」** 分頁 · **非投資建議**

## 包含什麼

| 類型 | 說明 |
|------|------|
| **holiday** | NYSE 全日休市 |
| **early** | 提早收市（通常 13:00 ET） |
| **macro** | CPI、NFP、FOMC、PCE、PPI 等 |
| **earnings** | 觀察名單相關財報（日期多為估計窗口） |

## 怎麼更新

1. 編輯 `calendar.json` 的 `items`（新增/改日期）  
2. 財報確定後把 `kind: earnings` 的 `date` 改成 IR 公布日  
3. 執行嵌入（可選）：

```bash
cd research/ten-bagger
node scripts/embed-data.mjs
```

或手動重新整理觀察板（會 fetch `./calendar.json`）。

## 解讀提示

- **宏觀日**：CRCL / IREN / 高估值成長股波動常放大  
- **FOMC 兩日**：決議日 + 記者會日分開標記  
- **財報**：以公司 IR 為準；`earningsFocus` 為覆核重點欄位  

## 官方參考

- [NYSE 休市日曆](https://www.nyse.com/markets/hours-calendars)  
- [BLS 經濟數據日曆](https://www.bls.gov/schedule/)  
- [Fed FOMC 日程](https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm)  
