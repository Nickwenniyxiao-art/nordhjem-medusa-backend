# INFRASTRUCTURE.md — NordHjem 基础设施文档

> 版本: v2.0 (RFC-001 落地后)
> 更新日期: 2026-03-18
> 负责人: CTO (AI) — 经 Owner 授权

---

## 1. 服务器总览

| 服务器 | IP | 配置 | 存储 | 角色 |
|--------|----|------|------|------|
| VPS1 | `66.94.127.117` | 4 vCPU / 8GB RAM | 242G NVMe SSD | 生产主力服务器 |
| VPS2 | `94.72.125.79` | 4 vCPU / 8GB RAM | 484G SSD | 监控与备份中心 |

- **提供商**: Contabo
- **操作系统**: Ubuntu 22.04 LTS
- **访问方式**: SSH root 登录（GitHub Actions deploy key）

---

## 2. 生产拓扑（VPS1）

```
用户浏览器
    ↓ HTTPS
Nginx（反向代理）
    ↓ :9000
Medusa.js v2 Backend（Docker）
    ├── PostgreSQL（Docker）— :5432
    ├── Redis（Docker）— :6379
    └── Uptime Kuma（Docker）— :3001 监控面板
```

### 2.1 Docker Compose 服务

| 服务 | 镜像 | 端口 | 数据卷 |
|------|------|------|--------|
| `medusa` | `ghcr.io/nickwenniyxiao-art/nordhjem-medusa-backend:latest` | 9000 | - |
| `postgres` | `postgres:15` | 5432 | `postgres_data` |
| `redis` | `redis:7` | 6379 | `redis_data` |
| `uptime-kuma` | `louislam/uptime-kuma:1` | 3001 | `uptime-kuma` |

### 2.2 关键路径

| 路径 | 用途 |
|------|------|
| `/opt/nordhjem/` | 项目主目录 |
| `/opt/nordhjem/scripts/` | Ops 运维脚本（通过 deploy-ops-scripts.yml 部署） |
| `/var/log/nordhjem/` | 运维脚本日志 |
| `/var/backups/nordhjem/` | PostgreSQL 本地备份（pg-backup.sh） |

---

## 3. 监控中心（VPS2）

```
VPS2 (94.72.125.79)
    └── Beszel Hub（Docker）— :8090
            ↑ WebSocket
        VPS1 Beszel Agent（Docker）
```

### 3.1 Beszel 配置

| 组件 | 部署位置 | 端口 | 用途 |
|------|---------|------|------|
| Beszel Hub | VPS2 | 8090 | 监控仪表板 |
| Beszel Agent | VPS1 | 45876 | 数据采集（CPU/内存/磁盘/网络） |

- **访问地址**: `http://94.72.125.79:8090`
- **监控指标**: CPU、内存、磁盘 I/O、网络流量、Docker 容器状态

---

## 4. CI/CD 管道

```
GitHub Push/PR
    ↓
GitHub Actions
    ├── CI 门禁 (lint/typecheck/build/security)
    ├── 构建 Docker 镜像 → GHCR
    └── CD 部署
        ├── develop → test 环境 (VPS1:9000 非 main branch 暂无)
        ├── staging → staging 环境 (VPS1:9001)
        └── main → production (VPS1:9000, 需 Owner approve)
```

### 4.1 关键 GitHub Actions Workflows

| Workflow | 触发条件 | 作用 |
|---------|---------|------|
| `ci.yml` | PR to develop/staging/main | Lint + typecheck + build + security |
| `cd-production.yml` | merge to main | 部署到生产环境 |
| `deploy-ops-scripts.yml` | push ops/scripts/** to main | 部署运维脚本到 VPS1（需 Owner approve） |
| `slo-check.yml` | 每周一 00:00 UTC | SLO 健康检查，创建 Issue 报告 |
| `check-ai-execution.yml` | PR to develop/staging/main | AI 治理门禁，检查 ai-decision Issue |
| `pr-compliance-fix.yml` | PR to develop | PR 格式合规自动修复 |

---

## 5. 外部依赖

| 服务 | 用途 | 配置方式 |
|------|------|---------|
| Stripe | 支付处理与 Webhook | `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET` |
| Resend | 邮件通知 | `RESEND_API_KEY` |
| Telegram Bot | 运维告警通知 | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` |
| GitHub Container Registry | Docker 镜像存储 | `GITHUB_TOKEN` (自动) |
| Uptime Kuma | HTTP 可用性监控 | VPS1:3001（已部署） |

---

## 6. 安全配置

### 6.1 GitHub Secrets

| Secret | 用途 |
|--------|------|
| `DEPLOY_HOST` | VPS1 IP（66.94.127.117） |
| `DEPLOY_SSH_KEY` | 部署专用 SSH 私钥 |
| `BOT_PAT` | nickwenniyxiao-bot GitHub 账号 PAT |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot 推送密钥 |
| `TELEGRAM_CHAT_ID` | 接收告警的 Chat ID |
| `PRODUCTION_PUBLISHABLE_KEY` | Medusa Store API 公开密钥 |

### 6.2 GitHub Environments

| Environment | 保护规则 |
|------------|---------|
| `production` | 需要 Owner 在 GitHub 手动 Approve |

---

## 7. 网络配置

| 端口 | 服务 | 访问范围 |
|------|------|---------|
| 22 | SSH | GitHub Actions IP + 管理员 |
| 80/443 | Nginx (HTTP/HTTPS) | 公网 |
| 9000 | Medusa 生产 API | 内部（经 Nginx 代理） |
| 9001 | Medusa Staging API | 内部 |
| 3001 | Uptime Kuma | VPN/管理员 |
| 5432 | PostgreSQL | Docker 内网 only |
| 6379 | Redis | Docker 内网 only |

---

## 8. 磁盘容量规划

| 服务器 | 总量 | 用途分配 |
|--------|------|---------|
| VPS1 (242G NVMe) | 约 20% 已用（2026-03-18 清理后） | OS + Docker images + PostgreSQL data + logs + 备份（7天） |
| VPS2 (484G SSD) | 待规划 | Beszel Hub + pg 备份长期存储 + 扩容备用 |

### 磁盘告警阈值（RFC-001）

- **75%**: Telegram 警告通知（disk-alert.sh 每小时检查）
- **90%**: Telegram 严重告警 + 优先处理

---

## 9. 变更管理

所有基础设施变更必须遵守 CLAUDE.md 铁律：

1. 开 GitHub Issue（`ai-decision` label）
2. Owner 在对话中明确授权
3. 通过 GitHub Actions workflow 执行（禁止直接 SSH 写操作）
4. 结果记录在 Issue 中

**唯一合法的 VPS 部署通道**：
- 代码部署 → `cd-production.yml`
- Ops 脚本 → `deploy-ops-scripts.yml`（需 `environment: production` approve）

---

> 关联文档：
> - `docs/RFC/RFC-001-operations-infrastructure.md` — 运维体系 RFC 原文
> - `docs/OPS-RUNBOOK.md` — 故障处理操作手册
> - `docs/BACKUP-POLICY.md` — 备份策略
> - `CLAUDE.md` — AI 行为准则与执行铁律
