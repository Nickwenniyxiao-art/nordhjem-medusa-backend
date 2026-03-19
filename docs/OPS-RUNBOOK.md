# OPS-RUNBOOK.md — NordHjem 故障处理手册

> 版本: v1.0 (RFC-001 落地)
> 更新日期: 2026-03-18
> 关联 RFC: RFC-001-operations-infrastructure.md

---

## ⚠️ 执行前必读

所有写操作必须遵守 **CLAUDE.md 铁律**：

1. 开 GitHub Issue（`ai-decision` label）
2. Owner 在对话中明确授权
3. 通过 GitHub Actions 执行（禁止直接 SSH 写操作）
4. 结果记录在 Issue

**只读诊断命令（AI 可直接执行，无需授权）：**
```bash
ssh -i ~/.ssh/deploy_key root@66.94.127.117 "df -h && docker ps && tail -20 /var/log/nordhjem/*.log 2>/dev/null"
```

---

## 1. 快速诊断命令

### 1.1 服务器状态

```bash
# 磁盘使用
ssh root@66.94.127.117 "df -h /"

# 内存/CPU
ssh root@66.94.127.117 "free -h && uptime"

# Docker 容器状态
ssh root@66.94.127.117 "docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"

# Docker 日志（最近 50 行）
ssh root@66.94.127.117 "docker logs nordhjem-medusa-1 --tail 50"

# Ops 脚本日志
ssh root@66.94.127.117 "ls -la /var/log/nordhjem/ && tail -30 /var/log/nordhjem/disk-alert.log 2>/dev/null"
```

### 1.2 服务健康检查

```bash
# 生产 Health 端点
curl -s http://66.94.127.117:9000/health

# Staging Health 端点
curl -s http://66.94.127.117:9001/health

# Store API
curl -s "http://66.94.127.117:9000/store/products?limit=1"
```

### 1.3 数据库状态

```bash
# PostgreSQL 连接测试
ssh root@66.94.127.117 "docker exec nordhjem-postgres-1 pg_isready -U medusa"

# 数据库大小
ssh root@66.94.127.117 "docker exec nordhjem-postgres-1 psql -U medusa -c '\l+'"

# 备份文件检查
ssh root@66.94.127.117 "ls -lah /var/backups/nordhjem/ 2>/dev/null || echo 'No backups yet'"
```

---

## 2. 常见故障处理

### P1 — 生产服务不可用

**症状**: `/health` 返回非 200 或超时

**诊断步骤**：

```bash
# Step 1: 检查容器是否运行
ssh root@66.94.127.117 "docker ps | grep medusa"

# Step 2: 查看最近日志
ssh root@66.94.127.117 "docker logs nordhjem-medusa-1 --tail 100 --since 10m"

# Step 3: 检查资源
ssh root@66.94.127.117 "df -h / && free -h"
```

**恢复方案（需 Owner 授权）**：

| 方案 | 适用场景 | 执行方式 |
|------|---------|---------|
| 重启容器 | 容器 crash | 通过 GitHub Actions workflow_dispatch |
| 回滚镜像 | 新版本有 bug | 修改 docker-compose 镜像 tag，触发 cd workflow |
| 磁盘清理 | 磁盘满 | 触发 docker-cleanup.sh workflow |

**紧急授权流程**：
```
1. AI 描述问题 + 拟执行操作
2. Owner 回复"可以"
3. 执行（通过 GitHub Actions 或 workflow_dispatch）
4. 立即在 Issue 中记录结果
```

---

### P2 — 磁盘空间告警

**症状**: Telegram 收到磁盘告警（75% 警告 / 90% 严重）

**诊断**：
```bash
# 磁盘使用详情
ssh root@66.94.127.117 "df -h && du -sh /var/lib/docker/* 2>/dev/null | sort -rh | head -10"

# Docker 占用分析
ssh root@66.94.127.117 "docker system df"

# 日志大小
ssh root@66.94.127.117 "du -sh /var/log/nordhjem/ /var/backups/nordhjem/ 2>/dev/null"
```

**清理方案（需 Owner 授权）**：

1. Docker 清理 → 触发 `deploy-ops-scripts.yml` 中的 docker-cleanup.sh
2. 清理旧备份 → `find /var/backups/nordhjem/ -mtime +7 -delete`
3. 清理系统日志 → `journalctl --vacuum-size=500M`

**目标**: 磁盘使用率 < 70%

---

### P2 — 数据库连接失败

**症状**: Medusa 日志出现 `ECONNREFUSED` / PostgreSQL 相关错误

**诊断**：
```bash
# 检查 postgres 容器
ssh root@66.94.127.117 "docker ps | grep postgres && docker logs nordhjem-postgres-1 --tail 50"

# 数据库连接测试
ssh root@66.94.127.117 "docker exec nordhjem-postgres-1 pg_isready -U medusa -d medusadb"
```

**处理**（需 Owner 授权）：
1. 重启 postgres 容器
2. 检查数据目录 `/var/lib/docker/volumes/nordhjem_postgres_data/`
3. 如需从备份恢复，参考 [BACKUP-POLICY.md](./BACKUP-POLICY.md) 恢复流程

---

### P3 — CI 构建失败

**症状**: GitHub Actions 检查失败，PR 无法 merge

**诊断**：
```bash
# 查看 CI 状态
gh pr checks <PR_NUMBER> --repo Nickwenniyxiao-art/nordhjem-medusa-backend

# 查看失败详情
gh run view <RUN_ID> --log-failed --repo Nickwenniyxiao-art/nordhjem-medusa-backend
```

**常见原因及修复**：

| 错误 | 原因 | 修复 |
|------|------|------|
| `npm error ERESOLVE` | peer dependency 冲突 | 检查 package.json 版本约束 |
| `getOctokit is not a function` | github-script 版本错误 | 确认使用 `actions/github-script@v7` |
| `Mermaid render error` | flowchart 节点使用 `\n` | 改用 `<br/>` |
| `ai-decision` check fail | ops/ 变更缺少 ai-decision label | 在 PR 或 Issue 上添加 label |

---

### P3 — Ops 脚本未执行

**症状**: 未收到预期的 Telegram 告警，或 crontab 未触发

**诊断**：
```bash
# 检查 crontab
ssh root@66.94.127.117 "crontab -l"

# 检查脚本是否存在且可执行
ssh root@66.94.127.117 "ls -la /opt/nordhjem/scripts/"

# 检查日志
ssh root@66.94.127.117 "tail -50 /var/log/nordhjem/disk-alert.log 2>/dev/null"
```

**修复**（需 Owner 授权）：
1. 触发 `deploy-ops-scripts.yml` workflow_dispatch 重新部署脚本
2. 确认 GitHub Secrets：`TELEGRAM_BOT_TOKEN`、`TELEGRAM_CHAT_ID` 已配置

---

## 3. 回滚操作

**生产服务回滚**（需 Owner 授权）：

```bash
# 查看可用镜像版本
ssh root@66.94.127.117 "docker images | grep nordhjem-medusa-backend"

# 回滚步骤（通过 GitHub Actions，不直接 SSH 操作）：
# 1. 在 GitHub 找到上一个稳定 workflow run
# 2. 通过 workflow_dispatch 触发 cd-production.yml，指定目标 SHA
# 3. 或修改 docker-compose.yml image tag 提交 PR 走正常流程
```

---

## 4. Telegram 告警说明

| 告警内容 | 含义 | 处理优先级 |
|---------|------|-----------|
| `⚠️ 磁盘告警 75%` | 磁盘使用超 75%，需关注 | P2 — 24小时内处理 |
| `🚨 磁盘严重 90%` | 磁盘使用超 90%，服务风险 | P1 — 立即处理 |
| `✅ Ops Scripts Deployed` | deploy-ops-scripts.yml 执行成功 | 信息通知 |
| `✅ pg-backup done` | 数据库备份成功 | 信息通知 |
| `❌ pg-backup FAILED` | 数据库备份失败 | P1 — 立即检查 |

---

## 5. 监控访问

| 系统 | 地址 | 用途 |
|------|------|------|
| Uptime Kuma | `http://66.94.127.117:3001` | HTTP 可用性监控 |
| Beszel Hub | `http://94.72.125.79:8090` | 服务器资源监控 |
| GitHub Actions | GitHub repo → Actions 标签页 | CI/CD 状态 |
| SLO 报告 | GitHub Issues（`Weekly SLO Report`） | 每周自动生成 |

---

## 6. 联系方式

| 角色 | 联系方式 |
|------|---------|
| Owner | Telegram Chat ID: `7975572947` |
| Telegram Bot | Token: 见 GitHub Secret `TELEGRAM_BOT_TOKEN` |

---

> 关联文档：
> - `docs/INFRASTRUCTURE.md` — 基础设施架构
> - `docs/BACKUP-POLICY.md` — 备份策略与恢复流程
> - `docs/RFC/RFC-001-operations-infrastructure.md` — 运维体系 RFC
> - `CLAUDE.md` — AI 行为准则
