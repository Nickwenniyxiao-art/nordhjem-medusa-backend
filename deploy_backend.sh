#!/usr/bin/env bash
# ============================================================
# deploy_backend.sh — NordHjem Medusa 后端部署脚本
# 遵循 ENG-GOV-001 §3.3 部署流程要求
# 用法: ./deploy_backend.sh [commit_hash|tag]
# ============================================================
set -euo pipefail

# ── 配置 ──────────────────────────────────────────────────────
APP_DIR="/opt/nordhjem/medusa"
COMPOSE_DIR="/opt/nordhjem"
REPO_URL="https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend.git"
CONTAINER_NAME="nordhjem_medusa"
LOG_FILE="/var/log/nordhjem/deploy_backend.log"
HEALTH_URL="http://127.0.0.1:9000/health"
MAX_RETRIES=60
RETRY_INTERVAL=3

# ── 日志函数 ──────────────────────────────────────────────────
log() {
  local msg="[$(date '+%Y-%m-%d %H:%M:%S UTC')] [DEPLOY-BE] $1"
  echo "$msg"
  mkdir -p "$(dirname "$LOG_FILE")"
  echo "$msg" >> "$LOG_FILE"
}

# ── 参数解析 ──────────────────────────────────────────────────
TARGET_REF="${1:-main}"
DEPLOYER="${DEPLOYER:-$(whoami)}"

log "========================================="
log "开始后端部署"
log "操作者: $DEPLOYER"
log "目标版本: $TARGET_REF"
log "========================================="

# ── 1. 拉取最新代码 ──────────────────────────────────────────
cd "$APP_DIR"

PREV_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "none")
log "当前版本: $PREV_COMMIT"

# 保存当前 Docker 镜像 tag 用于回滚
PREV_IMAGE=$(docker inspect --format='{{.Image}}' "$CONTAINER_NAME" 2>/dev/null || echo "none")
log "当前镜像: $PREV_IMAGE"

log "拉取最新代码..."
git fetch origin --prune
git checkout "$TARGET_REF"
if [ "$TARGET_REF" = "main" ]; then
  git pull origin main
fi

NEW_COMMIT=$(git rev-parse HEAD)
log "新版本: $NEW_COMMIT"

# ── 2. 构建 Docker 镜像 ─────────────────────────────────────
cd "$COMPOSE_DIR"

log "构建 Docker 镜像..."
docker compose build medusa 2>&1 | tail -10

# ── 3. 数据库迁移 ────────────────────────────────────────────
log "执行数据库迁移..."
docker compose run --rm medusa npx medusa db:migrate 2>&1 | tail -5 || {
  log "WARNING: db:migrate 失败或无迁移需要执行"
}

# ── 4. 重启服务 ──────────────────────────────────────────────
log "重启 Medusa 容器..."
docker compose up -d medusa 2>&1 | tail -5

# ── 5. 健康检查 ──────────────────────────────────────────────
log "等待服务启动..."
sleep 10

log "执行健康检查: $HEALTH_URL"
for i in $(seq 1 $MAX_RETRIES); do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" 2>/dev/null || echo "000")
  if [ "$HTTP_CODE" = "200" ]; then
    log "健康检查通过 (HTTP $HTTP_CODE) — 第 ${i} 次尝试"
    break
  fi
  if [ "$i" = "$MAX_RETRIES" ]; then
    log "ERROR: 健康检查失败 (HTTP $HTTP_CODE)，开始回滚..."
    # ── 回滚逻辑 ──
    cd "$APP_DIR"
    git checkout "$PREV_COMMIT"
    cd "$COMPOSE_DIR"
    docker compose build medusa
    docker compose up -d medusa
    log "已回滚到: $PREV_COMMIT"
    exit 1
  fi
  sleep $RETRY_INTERVAL
done

# ── 6. 记录结果 ──────────────────────────────────────────────
log "========================================="
log "部署成功"
log "版本: $NEW_COMMIT"
log "操作者: $DEPLOYER"
log "========================================="
