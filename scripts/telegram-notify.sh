#!/bin/bash
# Telegram Notification Script
# Usage: ./scripts/telegram-notify.sh "message" [emoji]

set -euo pipefail

MESSAGE="${1:-No message provided}"
EMOJI="${2:-ℹ️}"
BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
CHAT_ID="${TELEGRAM_CHAT_ID:-}"

if [ -z "$BOT_TOKEN" ] || [ -z "$CHAT_ID" ]; then
  echo "⚠️ TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set, skipping notification"
  exit 0
fi

FORMATTED="$EMOJI *NordHjem Alert*\n\n$MESSAGE\n\n_$(date -u '+%Y-%m-%d %H:%M UTC')_"

curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d "{
    \"chat_id\": \"$CHAT_ID\",
    \"text\": \"$FORMATTED\",
    \"parse_mode\": \"Markdown\",
    \"disable_web_page_preview\": true
  }" > /dev/null

echo "✅ Telegram notification sent"
