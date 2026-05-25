#!/bin/bash
# 下載並解壓富途 OpenD（macOS）· 供 update-options.mjs 使用
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENDOR="$ROOT/vendor/futu-opend"
URL="${OPEND_DOWNLOAD_URL:-https://www.futunn.com/download/fetch-lasted-link?name=opend-macos}"
ARCHIVE="$ROOT/vendor/Futu_OpenD_Mac.tar.gz"

echo "==> 解析下載連結…"
REAL_URL="$(curl -fsSL -o /dev/null -w '%{url_effective}' "$URL")"
echo "    $REAL_URL"

mkdir -p "$ROOT/vendor"
echo "==> 下載（約數百 MB，請稍候）…"
curl -fL --progress-bar "$REAL_URL" -o "$ARCHIVE"

echo "==> 解壓到 $VENDOR …"
rm -rf "$VENDOR"
mkdir -p "$VENDOR"
tar -xzf "$ARCHIVE" -C "$VENDOR"

# 尋找含 FutuOpenD.xml 的目錄（巢狀解壓常見兩層）
OPEND_DIR=""
while IFS= read -r cfg; do
  OPEND_DIR="$(dirname "$cfg")"
done < <(find "$VENDOR" -name 'FutuOpenD.xml' -o -name 'OpenD.xml' 2>/dev/null | head -1)

if [ -z "$OPEND_DIR" ]; then
  echo "❌ 解壓後找不到 FutuOpenD.xml"
  exit 1
fi
echo "    設定目錄: $OPEND_DIR"

if [ -f "$OPEND_DIR/fixrun.sh" ]; then
  echo "==> 執行 fixrun.sh（macOS 路徑修復）…"
  chmod +x "$OPEND_DIR/fixrun.sh"
  (cd "$OPEND_DIR" && ./fixrun.sh) || true
fi

BIN=""
if [ -x "$OPEND_DIR/FutuOpenD.app/Contents/MacOS/FutuOpenD" ]; then
  BIN="$OPEND_DIR/FutuOpenD.app/Contents/MacOS/FutuOpenD"
elif [ -x "$OPEND_DIR/OpenD.app/Contents/MacOS/OpenD" ]; then
  BIN="$OPEND_DIR/OpenD.app/Contents/MacOS/OpenD"
fi

CFG=""
if [ -f "$OPEND_DIR/FutuOpenD.xml" ]; then
  CFG="$OPEND_DIR/FutuOpenD.xml"
elif [ -f "$OPEND_DIR/OpenD.xml" ]; then
  CFG="$OPEND_DIR/OpenD.xml"
fi

# 寫入路徑供後續啟動
cat > "$ROOT/opend-path.env" <<EOF
# 由 scripts/install-opend.sh 產生 · source 此檔後啟動 OpenD
export OPEND_DIR='$OPEND_DIR'
export OPEND_BIN='$BIN'
export OPEND_CFG='$CFG'
export OPEND_HOST=127.0.0.1
export OPEND_PORT=11111
EOF

echo ""
echo "✅ OpenD 已解壓"
echo "   目錄: $OPEND_DIR"
echo ""
echo "下一步（需你本機操作，帳密勿交給腳本）："
echo "  1. 編輯設定檔填入牛牛帳號密碼："
echo "       open \"$CFG\""
echo "     修改 <login_account> 與 <login_pwd>（或 login_pwd_md5）"
echo "  2. 啟動 OpenD："
echo "       cd research/ten-bagger && ./scripts/start-opend.sh"
echo "  3. 確認連線： nc -z 127.0.0.1 11111"
echo "  4. pip install -r requirements-opend.txt"
echo "  5. node scripts/update-options.mjs"
echo ""
echo "詳見 opend-install.md"
