#!/bin/bash
# Post-Deploy Smoke Test
# Verifies core endpoints after deployment
# Usage: ./smoke-test.sh [base_url]
# Exit code 0 = all passed, 1 = failures (for CI/alerting integration)

set -euo pipefail

BASE_URL="${1:-https://api.nordhjem.store}"
FAILED=0
TOTAL=0
FAILURES=""

check_endpoint() {
  local name="$1"
  local url="$2"
  local expected_status="${3:-200}"
  TOTAL=$((TOTAL + 1))

  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 15 --retry 2 --retry-delay 3 "$url" 2>/dev/null || echo "000")

  if [ "$HTTP_STATUS" = "$expected_status" ]; then
    echo "[PASS] $name — HTTP $HTTP_STATUS"
  else
    echo "[FAIL] $name — Expected $expected_status, got $HTTP_STATUS ($url)"
    FAILED=$((FAILED + 1))
    FAILURES="${FAILURES}\n  - $name: expected $expected_status, got $HTTP_STATUS"
  fi
}

check_endpoint_multi() {
  local name="$1"
  local url="$2"
  shift 2
  local acceptable=("$@")
  TOTAL=$((TOTAL + 1))

  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 --retry 2 --retry-delay 3 "$url" 2>/dev/null || echo "000")

  for code in "${acceptable[@]}"; do
    if [ "$HTTP_STATUS" = "$code" ]; then
      echo "[PASS] $name — HTTP $HTTP_STATUS"
      return
    fi
  done

  echo "[FAIL] $name — Expected one of [${acceptable[*]}], got $HTTP_STATUS ($url)"
  FAILED=$((FAILED + 1))
  FAILURES="${FAILURES}\n  - $name: expected [${acceptable[*]}], got $HTTP_STATUS"
}

echo "=== Smoke Test: $BASE_URL ==="
echo "Time: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "============================================"

# Core API health
check_endpoint "Health Check" "$BASE_URL/health" "200"

# Store API (400 = server alive, requires x-publishable-api-key; 200 = key provided)
check_endpoint_multi "Store Products" "$BASE_URL/store/products" "200" "400"
check_endpoint_multi "Store Regions" "$BASE_URL/store/regions" "200" "400"

# Admin panel (302/301 redirect to login = working, 200 = served, 404 = not built)
check_endpoint_multi "Admin Panel" "$BASE_URL/app" "200" "302" "301"

# Admin API (401 = auth gate working)
check_endpoint "Admin Auth Gate" "$BASE_URL/admin/products" "401"

echo "============================================"
echo "Results: $((TOTAL - FAILED))/$TOTAL passed"

if [ "$FAILED" -gt 0 ]; then
  echo ""
  echo "[ALERT] $FAILED smoke test(s) failed against $BASE_URL"
  echo -e "Failures:$FAILURES"
  exit 1
fi

echo "[OK] All smoke tests passed."
