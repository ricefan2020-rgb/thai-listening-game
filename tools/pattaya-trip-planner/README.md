# 芭提雅旅遊計劃設計程式

依天數、人數、預算與興趣自動產生芭提雅行程；以**部落格筆記**形式閱讀，支援**小紅書式發布**、**雲端廣場**與**複製他人行程**。

## 啟動

```bash
npm run pattaya:dev
```

瀏覽器開啟：`http://localhost:5173/tools/pattaya-trip-planner/`

## 雲端廣場（Supabase）— 推薦

設定後可：

- 發布到**全站廣場**（首頁「廣場」分頁）
- 取得**短連結** `?post=<uuid>`（不再依賴超長 `?share=…`）
- 訪客可**按讚**（匿名登入，無需註冊信箱）

### 設定步驟

1. 至 [supabase.com/dashboard](https://supabase.com/dashboard) 建立專案  
2. **SQL Editor** 執行 [`supabase/schema.sql`](./supabase/schema.sql)  
3. **Authentication → Providers → Anonymous** → 開啟  
4. **Project Settings → API** 複製 URL 與 `anon` key  
5. 在專案**根目錄**建立 `.env.local`（參考 [`.env.example`](./.env.example)）：

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

6. 重新執行 `npm run pattaya:dev`

未設定時仍可使用本機長連結分享（`?share=…`）。

## 建置

```bash
npm run build
```

產出：`dist/tools/pattaya-trip-planner/index.html`

## 功能

- 自動排程、預算試算（含機票）、住宿推介、交通與地圖
- 本機儲存行程、Markdown 匯出
- **發布筆記**：心得、標籤、分享連結
- **雲端廣場**：瀏覽所有人最新筆記（需 Supabase）
- **複製成我的行程**：公開頁一鍵 Fork
- 本機「收藏」：貼上 `?share=` 或 `?post=` 連結

### 分享連結

| 模式 | 格式 |
|------|------|
| 雲端 | `.../pattaya-trip-planner/?post=<uuid>` |
| 本機 | `.../pattaya-trip-planner/?share=<gzip-base64>` |

## 之後可擴充

- Email 登入綁定帳號、封面圖上傳（Storage）
- 留言、追蹤、標籤搜尋
