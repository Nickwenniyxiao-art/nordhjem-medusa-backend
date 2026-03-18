#!/usr/bin/env bash
# Upptime 监控仓库初始化脚本
# 使用方法: bash scripts/setup-upptime.sh <github-org> <repo-name>
#
# 步骤：
# 1. 使用 gh CLI 创建仓库
# 2. 复制 .upptimerc.yml 模板
# 3. 启用 GitHub Pages
# 4. 配置 Secrets（UPPTIME_DISCORD_WEBHOOK 等）
# 5. 触发首次检查

set -euo pipefail

ORG="${1:?Usage: $0 <github-org> <repo-name>}"
REPO="${2:-nordhjem-upptime}"
TARGET_REPO="$ORG/$REPO"
TEMPLATE_FILE="docs/upptime-config/.upptimerc.yml"
ROOT_DIR="$(pwd)"
WORKDIR="$(mktemp -d)"

cleanup() {
  rm -rf "$WORKDIR"
}
trap cleanup EXIT

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "❌ Missing required command: $1"
    exit 1
  fi
}

require_cmd gh
require_cmd sed
require_cmd mktemp

if [[ ! -f "$TEMPLATE_FILE" ]]; then
  echo "❌ Template not found: $TEMPLATE_FILE"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "❌ gh CLI is not authenticated. Run: gh auth login"
  exit 1
fi

echo "📦 Creating Upptime repo: $TARGET_REPO"
if gh repo view "$TARGET_REPO" >/dev/null 2>&1; then
  echo "ℹ️ Repo already exists, skipping creation"
else
  gh repo create "$TARGET_REPO" --public --description "NordHjem uptime monitoring and status page" --clone=false
fi

echo "🗂️ Cloning $TARGET_REPO"
gh repo clone "$TARGET_REPO" "$WORKDIR/$REPO"
cd "$WORKDIR/$REPO"

echo "📥 Bootstrapping from upptime/upptime template"
if [[ -z "$(ls -A .)" ]]; then
  gh repo clone upptime/upptime "$WORKDIR/upptime-template"
  cp -R "$WORKDIR/upptime-template"/. .
  rm -rf .git
  git init
  git remote add origin "https://github.com/$TARGET_REPO.git"
fi

echo "🧩 Applying NordHjem .upptimerc.yml template"
cp "$ROOT_DIR/$TEMPLATE_FILE" .upptimerc.yml
sed -i "s/^owner: .*/owner: $ORG/" .upptimerc.yml
sed -i "s/^repo: .*/repo: $REPO/" .upptimerc.yml

echo "🔐 Configuring optional secrets"
set_secret_if_present() {
  local key="$1"
  local value="${!key:-}"
  if [[ -n "$value" ]]; then
    gh secret set "$key" --body "$value" --repo "$TARGET_REPO"
    echo "  ✅ $key set"
  else
    echo "  ⚠️ $key not provided in env, skipped"
  fi
}

set_secret_if_present UPPTIME_DISCORD_WEBHOOK
set_secret_if_present SLACK_WEBHOOK_URL
set_secret_if_present TELEGRAM_BOT_TOKEN
set_secret_if_present TELEGRAM_CHAT_ID

echo "🚀 Committing initialization"
git add .
if ! git diff --cached --quiet; then
  git commit -m "chore(upptime): bootstrap monitoring repository"
  git branch -M main
  git push -u origin main
else
  echo "ℹ️ No changes to commit"
fi

echo "🌐 Enabling GitHub Pages"
gh api --method POST -H "Accept: application/vnd.github+json" \
  "/repos/$TARGET_REPO/pages" \
  -f source[branch]='main' -f source[path]='/' >/dev/null 2>&1 || \
  echo "⚠️ Pages may already be enabled or requires manual setup"

echo "▶️ Triggering first Upptime workflow run"
gh workflow run uptime.yml --repo "$TARGET_REPO" >/dev/null 2>&1 || \
  echo "⚠️ Could not trigger uptime.yml automatically; run it from GitHub Actions UI"

echo "✅ Upptime setup complete for $TARGET_REPO"
echo "Next: verify Actions runs, Issues are generated on failure, and Pages is reachable."
