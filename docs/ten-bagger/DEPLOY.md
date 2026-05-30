# 雲端部署 · 電腦關機也能看

觀察板透過 **GitHub Pages** 提供 HTTPS 靜態站，手機加主畫面後可隨時開啟。

## 公開網址（部署成功後）

```
https://ricefan2020-rgb.github.io/thai-listening-game/ten-bagger/index.html
```

（若 repo 改名，路徑中的 `thai-listening-game` 會跟著變）

## 第一次部署

1. **打包**（Mac 上，可選；CI 也會跑）：
   ```bash
   cd research/ten-bagger
   node scripts/prepare-pages.mjs
   ```

2. **推送到 GitHub**：
   ```bash
   cd ../..   # repo 根目錄
   git add docs/ research/ten-bagger/ .github/workflows/ten-bagger-pages.yml
   git commit -m "Deploy ten-bagger to GitHub Pages"
   git push origin main
   ```

3. **開啟 Pages**（只需一次）  
   GitHub → 倉庫 **Settings** → **Pages** → Source 選 **GitHub Actions**

4. 等 Actions 跑完（約 1–2 分鐘），用手機開上面的網址。

## 更新資料後上線

在 Mac 跑更新腳本，再打包並 push：

```bash
cd research/ten-bagger
node scripts/update-prices.mjs
node scripts/update-ohlc.mjs
node scripts/update-sentiment.mjs   # Reddit
node scripts/update-stocktwits.mjs # Stocktwits（需 STOCKTWITS_ACCESS_TOKEN）
node scripts/update-options.mjs    # 期權（預設本機 OpenD · 見 options.md）
node scripts/update-news-feed.mjs # 可選
node scripts/update-commodities.mjs # 金銀 BTC（需網路）
node scripts/embed-data.mjs
node scripts/prepare-pages.mjs

cd ../..
git add docs/ research/ten-bagger/
git commit -m "Update board data"
git push
```

## 手機安裝

1. Safari / Chrome 開公開網址  
2. **加入主畫面**（同 [README](./README.md) 手機章節）  
3. 之後像 App 一樣開，**不需 Mac 開機**

## 限制

| 功能 | 雲端版 |
|------|--------|
| 看報價、K 線、已嵌入資料 | ✅ |
| Reddit / 新聞翻譯（瀏覽器即時） | ✅（需網路） |
| 在 Mac 跑腳本抓最新資料 | ❌ 要在電腦跑完再 push |
| Stocktwits 無 token | 觀察板點 **載入 ST**（瀏覽器 JSONP） |
| 公司檔 `.md` | ✅ 可點開閱讀 |

**Stocktwits token（自動更新）**：GitHub → Settings → Secrets → `STOCKTWITS_ACCESS_TOKEN`（[開發者後台](https://stocktwits.com/developers) 申請）。
