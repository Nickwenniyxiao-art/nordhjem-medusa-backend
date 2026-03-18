#!/usr/bin/env bash
# 数据库同步脱敏脚本
# 从 production 数据库导出 → 脱敏敏感字段 → 导入 staging

set -euo pipefail

SCRIPT_NAME=$(basename "$0")
DRY_RUN="${DRY_RUN:-false}"

for arg in "$@"; do
  case "$arg" in
    --dry-run)
      DRY_RUN=true
      ;;
    --help|-h)
      cat <<USAGE
Usage: $SCRIPT_NAME [--dry-run]

Required env vars:
  PROD_DATABASE_URL     Production database URL
  STAGING_DATABASE_URL  Staging database URL

Options:
  --dry-run             Validate connections and print plan without modifying staging
USAGE
      exit 0
      ;;
    *)
      echo "❌ Unknown argument: $arg" >&2
      exit 1
      ;;
  esac
done

log() {
  echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] $*"
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "❌ Required command not found: $1" >&2
    exit 1
  fi
}

require_env() {
  local name="$1"
  if [ -z "${!name:-}" ]; then
    echo "❌ Missing required environment variable: $name" >&2
    exit 1
  fi
}

run_sql() {
  local db_url="$1"
  local sql="$2"
  psql "$db_url" -v ON_ERROR_STOP=1 -X -q -c "$sql"
}

require_cmd pg_dump
require_cmd pg_restore
require_cmd psql
require_env PROD_DATABASE_URL
require_env STAGING_DATABASE_URL

log "Starting database sync and sanitize job"
log "Dry run mode: $DRY_RUN"
log "Step 1/5: Validating database connectivity"
run_sql "$PROD_DATABASE_URL" 'SELECT 1;' >/dev/null
run_sql "$STAGING_DATABASE_URL" 'SELECT 1;' >/dev/null
log "✅ Connectivity checks passed"

if [ "$DRY_RUN" = "true" ]; then
  log "🧪 Dry run enabled. Planned actions:"
  log "  - Dump production database with pg_dump"
  log "  - Restore dump into staging database with pg_restore --clean"
  log "  - Run SQL sanitization for email/phone/password_hash/address fields"
  log "  - Validate that no raw email/phone remains"
  log "Dry run completed without modifying staging"
  exit 0
fi

TMP_DIR=$(mktemp -d)
DUMP_FILE="$TMP_DIR/prod.dump"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

log "Step 2/5: Dumping production database"
pg_dump "$PROD_DATABASE_URL" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file "$DUMP_FILE"
log "✅ Production dump created: $DUMP_FILE"

log "Step 3/5: Restoring dump into staging database"
pg_restore \
  --dbname="$STAGING_DATABASE_URL" \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  "$DUMP_FILE"
log "✅ Staging restore completed"

log "Step 4/5: Applying sanitization rules"
psql "$STAGING_DATABASE_URL" -v ON_ERROR_STOP=1 -X -q <<'SQL'
DO $$
DECLARE
  rec RECORD;
BEGIN
  -- email: user_<id>@sanitized.local
  FOR rec IN
    SELECT table_schema, table_name
    FROM information_schema.columns
    WHERE column_name = 'email'
      AND table_schema = 'public'
  LOOP
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns c2
      WHERE c2.table_schema = rec.table_schema
        AND c2.table_name = rec.table_name
        AND c2.column_name = 'id'
    ) THEN
      EXECUTE format(
        'UPDATE %I.%I SET email = ''user_'' || id::text || ''@sanitized.local'' WHERE email IS NOT NULL;',
        rec.table_schema,
        rec.table_name
      );
    ELSE
      EXECUTE format(
        'UPDATE %I.%I SET email = ''user_sanitized@sanitized.local'' WHERE email IS NOT NULL;',
        rec.table_schema,
        rec.table_name
      );
    END IF;
  END LOOP;

  -- phone: +0000000000
  FOR rec IN
    SELECT table_schema, table_name
    FROM information_schema.columns
    WHERE column_name = 'phone'
      AND table_schema = 'public'
  LOOP
    EXECUTE format(
      'UPDATE %I.%I SET phone = ''+0000000000'' WHERE phone IS NOT NULL;',
      rec.table_schema,
      rec.table_name
    );
  END LOOP;

  -- password_hash: fixed bcrypt hash
  FOR rec IN
    SELECT table_schema, table_name
    FROM information_schema.columns
    WHERE column_name = 'password_hash'
      AND table_schema = 'public'
  LOOP
    EXECUTE format(
      'UPDATE %I.%I SET password_hash = ''$2b$10$CwTycUXWue0Thq9StjUM0uJ8Hj9sB4n8Qj7xN4eQfQvM8QnVqM6kG'' WHERE password_hash IS NOT NULL;',
      rec.table_schema,
      rec.table_name
    );
  END LOOP;

  -- address fields: REDACTED
  FOR rec IN
    SELECT table_schema, table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND column_name IN ('first_name', 'last_name', 'address_1', 'address_2', 'city', 'postal_code')
  LOOP
    EXECUTE format(
      'UPDATE %I.%I SET %I = ''REDACTED'' WHERE %I IS NOT NULL;',
      rec.table_schema,
      rec.table_name,
      rec.column_name,
      rec.column_name
    );
  END LOOP;
END
$$;
SQL
log "✅ Sanitization SQL completed"

log "Step 5/5: Validating sanitized result"
psql "$STAGING_DATABASE_URL" -v ON_ERROR_STOP=1 -X -q <<'SQL'
DO $$
DECLARE
  rec RECORD;
  leftover_count BIGINT;
BEGIN
  FOR rec IN
    SELECT table_schema, table_name
    FROM information_schema.columns
    WHERE column_name = 'email'
      AND table_schema = 'public'
  LOOP
    EXECUTE format(
      'SELECT COUNT(*) FROM %I.%I WHERE email IS NOT NULL AND email !~ ''^[^@]+@sanitized\\.local$''',
      rec.table_schema,
      rec.table_name
    ) INTO leftover_count;

    IF leftover_count > 0 THEN
      RAISE EXCEPTION 'Unsanitized emails found in %.%: % rows', rec.table_schema, rec.table_name, leftover_count;
    END IF;
  END LOOP;

  FOR rec IN
    SELECT table_schema, table_name
    FROM information_schema.columns
    WHERE column_name = 'phone'
      AND table_schema = 'public'
  LOOP
    EXECUTE format(
      'SELECT COUNT(*) FROM %I.%I WHERE phone IS NOT NULL AND phone <> ''+0000000000''',
      rec.table_schema,
      rec.table_name
    ) INTO leftover_count;

    IF leftover_count > 0 THEN
      RAISE EXCEPTION 'Unsanitized phones found in %.%: % rows', rec.table_schema, rec.table_name, leftover_count;
    END IF;
  END LOOP;
END
$$;
SQL
log "✅ Validation passed: no unsanitized email/phone detected"
log "🎉 Database sync and sanitization completed successfully"
