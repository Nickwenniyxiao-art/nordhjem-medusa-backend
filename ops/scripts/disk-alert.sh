#!/bin/bash
# NordHjem Disk Space Alert
# Deployed to: /opt/nordhjem/scripts/disk-alert.sh on VPS1 (66.94.127.117)
# Crontab: 7 * * * * (every hour at :07)
#
# Thresholds (RFC-001 Phase 1):
#   >= 75% → Telegram ⚠️ warning
#   >= 90% → Telegram 🚨 critical

BOT_TOKEN="${TELEGRAM_BOT_TOKEN}"
CHAT_ID="${TELEGRAM_CHAT_ID}"
HOSTNAME=$(hostname)
LOG="/var/log/nordhjem/disk-alert.log"

send_telegram() {
  local msg="$1"
  curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
    -d chat_id="${CHAT_ID}" \
    -d text="${msg}" \
    -d parse_mode="HTML" \
    > /dev/null 2>&1
}

USAGE=$(df / | awk 'NR==2 {print $5}' | tr -d '%')
AVAIL=$(df -h / | awk 'NR==2 {print $4}')
TOTAL=$(df -h / | awk 'NR==2 {print $2}')
TIMESTAMP=$(date '+%Y-%m-%d %H:%M UTC')

echo "${TIMESTAMP} Disk: ${USAGE}% used (${AVAIL} free / ${TOTAL})" >> "$LOG"

if [ "$USAGE" -ge 90 ]; then
  send_telegram "🚨 <b>CRITICAL: Disk Full</b>
Server: <code>${HOSTNAME}</code>
Disk: <b>${USAGE}%</b> used (${AVAIL} free / ${TOTAL})
Action required: SSH in and run docker image prune -a -f
Time: ${TIMESTAMP}"
  echo "${TIMESTAMP} CRITICAL alert sent" >> "$LOG"

elif [ "$USAGE" -ge 75 ]; then
  send_telegram "⚠️ <b>WARNING: Disk Space Low</b>
Server: <code>${HOSTNAME}</code>
Disk: <b>${USAGE}%</b> used (${AVAIL} free / ${TOTAL})
Run: docker image prune -f to free space
Time: ${TIMESTAMP}"
  echo "${TIMESTAMP} WARNING alert sent" >> "$LOG"
fi
