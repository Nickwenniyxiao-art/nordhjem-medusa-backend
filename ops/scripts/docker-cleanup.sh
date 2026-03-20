#!/bin/bash
# NordHjem Docker Auto Cleanup
# Deployed to: /opt/nordhjem/scripts/docker-cleanup.sh on VPS1 (66.94.127.117)
# Crontab: 0 3 * * 0 (every Sunday UTC 03:00)
#
# Removes images unused for 72+ hours.
# Running container images are NEVER removed by docker prune.

BOT_TOKEN="${TELEGRAM_BOT_TOKEN}"
CHAT_ID="${TELEGRAM_CHAT_ID}"
LOG="/var/log/nordhjem/docker-cleanup.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M UTC')

echo "" >> "$LOG"
echo "=== ${TIMESTAMP} Docker cleanup started ===" >> "$LOG"

BEFORE=$(df / | awk 'NR==2 {print $5}' | tr -d '%')
BEFORE_AVAIL=$(df -h / | awk 'NR==2 {print $4}')

# Prune: images unused for 72h, stopped containers, unused networks
# Running container images are safe — docker never removes them
OUTPUT=$(docker system prune -af --filter "until=72h" 2>&1)
echo "$OUTPUT" >> "$LOG"

AFTER=$(df / | awk 'NR==2 {print $5}' | tr -d '%')
AFTER_AVAIL=$(df -h / | awk 'NR==2 {print $4}')
FREED=$((BEFORE - AFTER))

echo "Disk: ${BEFORE}% → ${AFTER}% (freed ~${FREED}%)" >> "$LOG"
echo "=== Cleanup done ===" >> "$LOG"

curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
  -d chat_id="${CHAT_ID}" \
  -d parse_mode="HTML" \
  -d text="🧹 <b>Weekly Docker Cleanup</b>
Disk: <b>${BEFORE}% → ${AFTER}%</b>
Freed: ~${FREED}% | Available: ${AFTER_AVAIL}
Time: ${TIMESTAMP}" > /dev/null 2>&1
