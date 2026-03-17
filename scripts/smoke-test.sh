#!/bin/bash
# Production Smoke Test
# Verifies core API endpoints after deployment

set -euo pipefail

BASE_URL="${1:-http://localhost:9000}"
FAILED=0
TOTAL=0

check_endpoint() {
  local name="$1"
  local url="$2"
  local expected_status="${3:-200}"
  TOTAL=$((TOTAL + 1))

  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")

  if [ "$HTTP_STATUS" = "$expected_status" ]; then
    echo "✅ $name — HTTP $HTTP_STATUS"
  else
    echo "❌ $name — Expected $expected_status, got $HTTP_STATUS"
    FAILED=$((FAILED + 1))
  fi
}

echo "🔍 Running smoke tests against: $BASE_URL"
echo "============================================"

# Core API health
check_endpoint "Health Check" "$BASE_URL/health" "200"

# Store API
check_endpoint "Store Products" "$BASE_URL/store/products" "200"
check_endpoint "Store Collections" "$BASE_URL/store/collections" "200"
check_endpoint "Store Regions" "$BASE_URL/store/regions" "200"

# Admin API (should return 401 without auth)
check_endpoint "Admin Auth Gate" "$BASE_URL/admin/products" "401"

echo "============================================"
echo "Results: $((TOTAL - FAILED))/$TOTAL passed"

if [ "$FAILED" -gt 0 ]; then
  echo "❌ $FAILED smoke test(s) failed!"
  exit 1
fi

echo "✅ All smoke tests passed!"
