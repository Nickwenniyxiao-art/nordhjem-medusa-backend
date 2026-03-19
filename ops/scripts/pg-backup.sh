#!/bin/bash
# pg-backup.sh — NordHjem PostgreSQL Daily Backup
# RFC-001: Phase 1 — Local 7-day retention
# Cron: 0 2 * * * /opt/nordhjem/scripts/pg-backup.sh
#
# DEPLOY: via deploy-ops-scripts.yml (GitHub Actions)
# DO NOT deploy manually via SSH — violates AI governance framework

set -euo pipefail

BACKUP_DIR="/var/backups/nordhjem"
LOG_FILE="/var/log/nordhjem/pg-backup.log"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
BACKUP_FILE="${BACKUP_DIR}/db_backup_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=7

TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-}"

# --- Helpers ---

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

send_telegram() {
  local msg="$1"
  if [[ -n "$TELEGRAM_BOT_TOKEN" && -n "$TELEGRAM_CHAT_ID" ]]; then
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      -d chat_id="${TELEGRAM_CHAT_ID}" \
      -d parse_mode="HTML" \
      -d text="$msg" > /dev/null 2>&1 || true
  fi
}

# --- Pre-flight checks ---

mkdir -p "$BACKUP_DIR"
mkdir -p "$(dirname "$LOG_FILE")"

log "=== pg-backup.sh started ==="

# Check available disk space (warn if < 5G)
AVAIL_KB=$(df -k "$BACKUP_DIR" | awk 'NR==2 {print $4}')
AVAIL_GB=$((AVAIL_KB / 1048576))
if [[ "$AVAIL_GB" -lt 5 ]]; then
  log "⚠️  WARNING: Only ${AVAIL_GB}GB available in ${BACKUP_DIR}"
  send_telegram "⚠️ <b>NordHjem pg-backup WARNING</b>
Disk space low: only ${AVAIL_GB}GB available in backup directory.
Backup will still attempt to run."
fi

# --- PostgreSQL Backup ---

log "Starting pg_dump → ${BACKUP_FILE}"

if docker exec nordhjem-postgres-1 pg_dump -U medusa medusadb | gzip > "$BACKUP_FILE"; then
  BACKUP_SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
  log "✅ Backup successful: ${BACKUP_FILE} (${BACKUP_SIZE})"
  send_telegram "✅ <b>NordHjem pg-backup done</b>
File: <code>db_backup_${TIMESTAMP}.sql.gz</code>
Size: ${BACKUP_SIZE}
Retention: ${RETENTION_DAYS} days"
else
  log "❌ pg_dump failed"
  send_telegram "❌ <b>NordHjem pg-backup FAILED</b>
Timestamp: ${TIMESTAMP}
Check log: /var/log/nordhjem/pg-backup.log"
  exit 1
fi

# --- Retention Cleanup ---

log "Cleaning up backups older than ${RETENTION_DAYS} days..."
DELETED_COUNT=0
while IFS= read -r old_file; do
  rm -f "$old_file"
  log "  Deleted: ${old_file}"
  DELETED_COUNT=$((DELETED_COUNT + 1))
done < <(find "$BACKUP_DIR" -name "db_backup_*.sql.gz" -mtime "+${RETENTION_DAYS}")

if [[ "$DELETED_COUNT" -gt 0 ]]; then
  log "Deleted ${DELETED_COUNT} old backup(s)"
fi

# --- Summary ---

BACKUP_COUNT=$(find "$BACKUP_DIR" -name "db_backup_*.sql.gz" | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
log "Current backups: ${BACKUP_COUNT} file(s), total ${TOTAL_SIZE}"
log "=== pg-backup.sh done ==="
