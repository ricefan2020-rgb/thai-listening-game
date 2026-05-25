#!/bin/bash
# 啟動本機 OpenD（需已執行 install-opend.sh 並填好帳密）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/opend-path.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "請先執行: ./scripts/install-opend.sh"
  exit 1
fi
# shellcheck source=/dev/null
source "$ENV_FILE"

if [ -z "${OPEND_BIN:-}" ] || [ ! -x "$OPEND_BIN" ]; then
  echo "找不到 OpenD 執行檔，請重新執行 install-opend.sh"
  exit 1
fi

if nc -z 127.0.0.1 "${OPEND_PORT:-11111}" 2>/dev/null; then
  echo "OpenD 已在運行 (${OPEND_PORT:-11111})"
  exit 0
fi

ARGS=(-lang=zh_CN)
if [ -n "${OPEND_CFG:-}" ] && [ -f "$OPEND_CFG" ]; then
  ARGS+=("-cfg_file=$OPEND_CFG")
fi

echo "啟動 OpenD…"
echo "  $OPEND_BIN ${ARGS[*]}"
nohup "$OPEND_BIN" "${ARGS[@]}" >> "$ROOT/vendor/opend.log" 2>&1 &
echo $! > "$ROOT/vendor/opend.pid"
sleep 3

if nc -z 127.0.0.1 "${OPEND_PORT:-11111}" 2>/dev/null; then
  echo "✅ OpenD 已啟動 · 埠 ${OPEND_PORT:-11111} · 日誌 vendor/opend.log"
else
  echo "⚠ 埠尚未開啟，請檢查 vendor/opend.log 與設定檔帳密"
  tail -20 "$ROOT/vendor/opend.log" 2>/dev/null || true
  exit 1
fi
