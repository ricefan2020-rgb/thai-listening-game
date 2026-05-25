# 富途 OpenD 安裝（觀察板期權）

> 牛牛 App 登入 ≠ OpenD API。期權腳本需 **OpenD 在本機 11111 埠監聽**。

## 一鍵安裝（macOS）

```bash
cd research/ten-bagger
chmod +x scripts/install-opend.sh scripts/start-opend.sh
./scripts/install-opend.sh
pip install -r requirements-opend.txt
```

## 填寫帳密（必做）

安裝後會解壓到 `vendor/futu-opend/`，並產生 `opend-path.env`。

1. 用編輯器打開設定檔（路徑見安裝腳本輸出，通常為 `FutuOpenD.xml`）
2. 設定 **login_account**、**login_pwd**（與牛牛相同）
3. 確認 **api_port** 為 `11111`、**ip** 為 `127.0.0.1`

## 啟動

```bash
./scripts/start-opend.sh
nc -z 127.0.0.1 11111 && echo OK
```

## 更新期權

```bash
node scripts/update-options.mjs
```

成功時終端顯示 `OpenD: 已連線`，各檔標 **OpenD**。

## 官方文件

- [命令行 OpenD](https://openapi.futunn.com/futu-api-doc/opend/opend-cmd.html)
- [Futu Skills 安裝](https://www.futunn.com/skills/futu-install.md)

## 疑難排解

| 現象 | 處理 |
|------|------|
| `OpenD 未連線` | 先 `./scripts/start-opend.sh`，看 `vendor/opend.log` |
| macOS 找不到 xml | 安裝包內執行 `fixrun.sh`，或用 `-cfg_file=` 啟動 |
| 仍走 Yahoo | 11111 未開；或 `OPTIONS_SOURCE=yahoo` |
