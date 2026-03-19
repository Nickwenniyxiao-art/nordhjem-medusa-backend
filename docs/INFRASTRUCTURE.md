---
项目名称: NordHjem
创建日期: 2026-03-18
状态: Active
负责人: CTO (AI)
---

# INFRASTRUCTURE.md — NordHjem 基础设施文档

> 版本: v2.0 (RFC-001 落地后)
> 更新日期: 2026-03-18

---

## 基础设施拓扑

NordHjem 采用双 VPS 架构：VPS1 负责生产服务，VPS2 负责监控与备份。

```
用户浏览器
    ↓ HTTPS
Nginx（反向代理）
    ↓ :9000
Medusa.js v2 Backend（Docker）
    ├── PostgreSQL（Docker）— :5432
    ├── Redis（Docker）— :6379
    └── Uptime Kuma（Docker）— :3001

VPS2 (94.72.125.79)
    └── Beszel Hub — :8090（监控仪表板）
            ↑ WebSocket
        VPS1 Beszel Agent — :45876
```

| 服务器 | IP | 配置 | 存储 | 角色 |
|--------|----|------|------|------|
| VPS1 | `66.94.127.117` | 4 vCPU / 8GB RAM | 242G NVMe SSD | 生产主力服务器 |
| VPS2 | `94.72.125.79` | 4 vCPU / 8GB RAM | 484G SSD | 监控与备份中心 |

- **提供商**: Contabo
- **操作系统**: Ubuntu 22.04 LTS
- **访问方式**: SSH root 登录（GitHub Actions deploy key）

### Docker Compose 服务（VPS1）

| 服务 | 镜像 | 端口 | 数据卷 |
|------|------|------|--------|
| `medusa` | `ghcr.io/nickwenniyxiao-art/nordhjem-medusa-backend:latest` | 9000 | - |
| `postgres` | `postgres:15` | 5432 | `postgres_data` |
| `redis` | `redis:7` | 6379 | `redis_data` |
| `uptime-kuma` | `louislam/uptime-kuma:1` | 3001 | `uptime-kuma` |

---

## 资源配置

### CI/CD 管道

```
GitHub Push/PR → GitHub Actions → CI 门禁 → 构建 Docker 镜像 → GHCR
                                                    ↓
                                            CD 部署（SSH → VPS1）
                                    develop → test | staging → staging | main → production
```

### 关键 GitHub Actions Workflows

| Workflow | 触发条件 | 作用 |
|---------|---------|------|
| `ci.yml` | PR to develop/staging/main | Lint + typecheck + build + security |
| `cd-production.yml` | merge to main | 部署到生产环境 |
| `deploy-ops-scripts.yml` | push ops/scripts/** to main | 部署运维脚本到 VPS1（需 Owner approve） |
| `slo-check.yml` | 每周一 00:00 UTC | SLO 健康检查，创建 Issue 报告 |
| `check-ai-execution.yml` | PR to develop/staging/main | AI 治理门禁 |
| `sbom.yml` | push to main/staging | SBOM 生成（SPDX + CycloneDX） |

### 外部依赖

| 服务 | 用途 | Secret |
|------|------|--------|
| Stripe | 支付处理与 Webhook | `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET` |
| Resend | 邮件通知 | `RESEND_API_KEY` |
| Telegram Bot | 运维告警通知 | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` |
| GitHub Container Registry | Docker 镜像存储 | `GITHUB_TOKEN` (自动) |
| Sentry | 应用错误追踪 | `SENTRY_DSN` |
| Uptime Kuma | HTTP 可用性监控 | VPS1:3001（已部署） |
| Beszel | 服务器资源监控 | VPS2:8090（待部署） |

---

## 网络与安全

### 端口配置

| 端口 | 服务 | 访问范围 |
|------|------|---------|
| 22 | SSH | GitHub Actions IP + 管理员 |
| 80/443 | Nginx (HTTP/HTTPS) | 公网 |
| 9000 | Medusa 生产 API | 内部（经 Nginx 代理） |
| 9001 | Medusa Staging API | 内部 |
| 3001 | Uptime Kuma | VPN/管理员 |
| 5432 | PostgreSQL | Docker 内网 only |
| 6379 | Redis | Docker 内网 only |

### 安全扫描体系

| 工具 | 类型 | 触发 |
|------|------|------|
| Gitleaks | 密钥泄露检测 | 每次 PR |
| Semgrep | SAST 静态分析 | 每次 PR |
| Trivy | Docker 镜像漏洞扫描 | 构建后 |
| npm audit | 依赖漏洞审计 | 定期 + PR |
| Syft SBOM | 软件物料清单生成 | push to main |

### GitHub Environments

| Environment | 保护规则 |
|------------|---------|
| `production` | 需要 Owner 在 GitHub 手动 Approve |

---

## 运维职责

### 责任矩阵

| 职责 | 负责人 |
|------|-------|
| 基础设施架构决策 | CTO (AI) |
| 生产部署审批 | Owner |
| 运维脚本维护 | CTO (AI)，经 Owner 授权 |
| 安全事件响应 | CTO (AI) 诊断 + Owner 决策 |
| 成本控制 | Owner |
| 备份恢复执行 | CTO (AI)，经 Owner 授权 |

### AI 执行铁律

所有基础设施变更必须遵守 `CLAUDE.md` 规则：

1. 开 GitHub Issue（`ai-decision` label）
2. Owner 在对话中明确授权
3. 通过 GitHub Actions workflow 执行（禁止直接 SSH 写操作）
4. 结果记录在 Issue 中

**唯一合法的 VPS 部署通道**：
- 代码部署 → `cd-production.yml`
- Ops 脚本 → `deploy-ops-scripts.yml`（需 `environment: production` approve）

### 磁盘容量规划

| 服务器 | 总量 | 使用率（2026-03-18） | 磁盘告警阈值 |
|--------|------|-------------------|------------|
| VPS1 (242G NVMe) | 242G | ~20% | 75%⚠️ / 90%🚨 |
| VPS2 (484G SSD) | 484G | 待规划 | 75%⚠️ / 90%🚨 |

---

> 关联文档：
> - `docs/RFC/RFC-001-operations-infrastructure.md` — 运维体系 RFC
> - `docs/OPS-RUNBOOK.md` — 故障处理操作手册
> - `docs/BACKUP-POLICY.md` — 备份策略
> - `CLAUDE.md` — AI 行为准则
