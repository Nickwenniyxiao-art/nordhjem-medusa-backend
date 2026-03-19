# BACKUP-POLICY.md — NordHjem 备份策略

> 版本: v1.0 (RFC-001 落地)
> 更新日期: 2026-03-18
> 关联 RFC: RFC-001-operations-infrastructure.md

---

## 1. 备份范围

| 数据类型 | 备份方式 | 优先级 |
|---------|---------|-------|
| PostgreSQL 数据库 | pg_dump 每日全量 | P0 — 核心业务数据 |
| Docker Compose 配置 | Git 版本控制 | P1 — 通过 GitHub 仓库管理 |
| Ops 脚本 | Git 版本控制（ops/scripts/） | P1 — 通过 GitHub 仓库管理 |
| Nginx 配置 | 手动备份（待自动化） | P2 |
| Redis | 无持久化（缓存可丢失） | 不备份 |

---

## 2. PostgreSQL 备份策略

### 2.1 备份规格

| 项目 | 配置 |
|------|------|
| 备份工具 | `pg_dump` (PostgreSQL 原生) |
| 备份类型 | 全量备份（plain SQL format） |
| 执行频率 | 每日 UTC 02:00（北京时间 10:00） |
| 本地保留 | **7 天**（7个文件自动轮转） |
| 远程备份 | **Phase 2**: rsync 到 VPS2（94.72.125.79） |
| 压缩格式 | `.sql.gz`（gzip 压缩） |

### 2.2 本地存储路径

```
/var/backups/nordhjem/
├── db_backup_20260318_020000.sql.gz    # 今天
├── db_backup_20260317_020000.sql.gz    # 昨天
├── ...（最多保留 7 个文件）
└── db_backup_20260311_020000.sql.gz    # 7天前（下次自动删除）
```

### 2.3 脚本位置

- 脚本路径（Git）: `ops/scripts/pg-backup.sh`
- VPS 部署路径: `/opt/nordhjem/scripts/pg-backup.sh`
- 执行用户: `root`（Docker exec 进入容器执行）
- 触发方式: `crontab`（通过 `deploy-ops-scripts.yml` 配置）

### 2.4 Crontab 配置

```cron
# NordHjem Ops — PostgreSQL daily backup (RFC-001)
0 2 * * * /opt/nordhjem/scripts/pg-backup.sh
```

### 2.5 通知机制

| 事件 | Telegram 通知 |
|------|-------------|
| 备份成功 | ✅ pg-backup done — 文件名 + 大小 |
| 备份失败 | ❌ pg-backup FAILED — 时间戳 |
| 磁盘空间检查 | 备份前检查可用空间，< 5G 则发出警告 |

---

## 3. 恢复流程

### 3.1 数据库恢复（需 Owner 授权）

**执行前必须**：
1. 开 GitHub Issue（`ai-decision` label），说明恢复原因
2. Owner 明确授权（在对话中说"可以"）
3. 记录执行结果

**恢复步骤**：

```bash
# Step 1: 确认备份文件存在
ssh root@66.94.127.117 "ls -lah /var/backups/nordhjem/"

# Step 2: 选择要恢复的备份文件（由 Owner 确认目标时间点）
BACKUP_FILE="/var/backups/nordhjem/db_backup_YYYYMMDD_HHMMSS.sql.gz"

# Step 3: 停止 Medusa 服务（避免数据写入）
# → 通过 GitHub Actions workflow_dispatch 执行，不直接 SSH

# Step 4: 恢复数据库
ssh root@66.94.127.117 "
  gunzip -c ${BACKUP_FILE} | \
  docker exec -i nordhjem-postgres-1 psql -U medusa medusadb
"

# Step 5: 重启 Medusa 服务
# → 通过 GitHub Actions workflow_dispatch 执行

# Step 6: 验证恢复
curl -s http://66.94.127.117:9000/health
```

### 3.2 恢复时间目标

| 指标 | 目标值 |
|------|-------|
| RPO（恢复点目标） | ≤ 24 小时（每日备份） |
| RTO（恢复时间目标） | ≤ 2 小时 |

---

## 4. Phase 2 — 异地备份（计划中）

**目标**: pg_dump 文件每日 rsync 到 VPS2

```bash
# 计划在 pg-backup.sh 中增加（Phase 2 实现）：
rsync -avz --delete \
  /var/backups/nordhjem/ \
  root@94.72.125.79:/opt/nordhjem-backup/
```

**前提条件**：
- VPS1 → VPS2 SSH 互信（部署专用密钥）
- VPS2 上目标目录存在
- Beszel Hub 部署完成（VPS2 已初始化）

**开 Issue 时实施**。

---

## 5. 备份监控

### 5.1 每日检查（自动）

`pg-backup.sh` 执行后通过 Telegram 通知 Owner，每日 UTC 02:00 可查看通知确认备份状态。

### 5.2 每周 SLO 报告

`slo-check.yml` 每周一生成 GitHub Issue，可在报告中增加备份健康度检查（Phase 2 增强）。

### 5.3 手动检查

```bash
# 检查最新备份文件时间
ssh root@66.94.127.117 "ls -lah /var/backups/nordhjem/ | tail -3"

# 验证备份文件完整性
ssh root@66.94.127.117 "
  LATEST=\$(ls -t /var/backups/nordhjem/*.sql.gz | head -1)
  gunzip -t \"\$LATEST\" && echo '✅ 备份文件完整' || echo '❌ 备份文件损坏'
"
```

---

## 6. 合规与审计

- 所有备份操作由 `pg-backup.sh` 执行，结果通过 Telegram 推送
- 每次恢复操作必须创建 `ai-decision` GitHub Issue，记录操作详情
- 备份策略变更需通过 PR 流程（修改 `ops/scripts/pg-backup.sh` + 更新本文档）

---

> 关联文档：
> - `docs/INFRASTRUCTURE.md` — 基础设施架构
> - `docs/OPS-RUNBOOK.md` — 故障处理手册
> - `docs/RFC/RFC-001-operations-infrastructure.md` — 运维体系 RFC
> - `ops/scripts/pg-backup.sh` — 备份脚本源码
