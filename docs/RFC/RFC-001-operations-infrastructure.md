# RFC-001: NordHjem 运维基础设施体系

| 字段 | 内容 |
|------|------|
| **状态** | Draft |
| **作者** | AI (待 Owner 审批) |
| **日期** | 2026-03-19 |
| **关联 Issue** | 待创建 |
| **影响范围** | 基础设施、生产服务器、卓越框架文档体系 |

---

## 1. 背景与动机

### 1.1 今天发生了什么

2026-03-19，生产服务器（66.94.127.117）磁盘使用率达到 **100%**，导致：
- CD 部署失败（`no space left on device`）
- 问题完全依赖人工发现，无任何自动告警
- 根因：CI/CD 每次构建产生新 Docker 镜像，无清理机制，126 个废旧镜像累积约 200GB

### 1.2 当前运维体系的空白

```
现有框架覆盖：
  需求 → 设计 → 开发 → CI 门禁 → 部署

完全空白的阶段：
  部署之后 → 监控 → 告警 → 事故响应 → 容量规划 → 维护
```

| 能力 | 现状 |
|------|------|
| 服务器磁盘/CPU/内存监控 | ❌ 无 |
| Docker 容器历史指标 | ❌ 无 |
| 磁盘超阈值告警 | ❌ 无 |
| 应用层错误追踪 | ❌ 无 |
| Docker 镜像自动清理 | ❌ 无 |
| 故障处理操作手册 | ❌ 无 |
| 基础设施文档 | ❌ 无 |

### 1.3 为什么现在要做

- 生产环境已经在跑，但处于"黑盒"状态
- 下次磁盘满、容器崩溃、API 大量报错，仍然只能靠用户反馈或人工巡检发现
- 随着功能迭代，问题频率只会增加，不会减少

---

## 2. 目标

### 2.1 核心目标

1. **可观测**：所有服务器指标、容器状态、应用报错都有监控面板
2. **可告警**：关键阈值超限（磁盘 > 80%、容器崩溃、API 错误率突增）自动通知 Telegram
3. **可维护**：磁盘、镜像等资源有自动清理，不再靠人工处理
4. **可操作**：任何故障场景有文档化的处理 SOP，AI 或人都能按手册执行

### 2.2 非目标（现阶段不做）

- Kubernetes / 容器编排
- Grafana + Prometheus（资源重，现阶段过度设计）
- ELK 日志系统
- 替换现有 docker-compose 部署方式

---

## 3. 方案设计

### 3.1 整体架构

```
┌─────────────────────────────────────────────────────┐
│                   VPS (66.94.127.117)                │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐│
│  │  Beszel  │  │  Uptime  │  │  业务容器           ││
│  │  Agent   │  │  Kuma    │  │  medusa / nginx /   ││
│  │  <26MB   │  │ (已有)   │  │  postgres / n8n ... ││
│  └────┬─────┘  └────┬─────┘  └────────────────────┘│
│       │              │                               │
│  ┌────┴──────────────┴────┐                         │
│  │   crontab 定时任务      │                         │
│  │  - Docker 自动清理      │                         │
│  │  - 磁盘心跳探针         │                         │
│  └────────────────────────┘                         │
└──────────────────┬──────────────────────────────────┘
                   │ 告警通知
                   ▼
         ┌─────────────────┐
         │  Telegram Bot   │ ← 统一告警出口
         └─────────────────┘
                   │
         ┌─────────┴────────┐
         │                  │
    ┌────▼──────┐    ┌──────▼──────┐
    │  Beszel   │    │   Sentry    │
    │   Hub     │    │  (云服务)   │
    │(VPS2 或外) │    │  错误追踪   │
    └───────────┘    └─────────────┘
```

### 3.2 四层运维体系

#### 第一层：服务器 + 容器监控 — Beszel

**选型理由：**
- Agent 内存占用 < 26MB（vs Prometheus Node Exporter ~50MB + Grafana ~300MB）
- 原生 Docker 监控：自动追踪每个容器的 CPU、内存、网络历史
- 内置告警：磁盘、CPU、内存、带宽均可配置阈值
- 部署极简：Hub 一个 Docker 容器，Agent 一条命令

**部署方案：**
```yaml
# Beszel Hub 部署在 VPS2（94.72.125.79）- 空闲服务器，专用于监控
# Beszel Agent 部署在 VPS1（生产服务器）
```

**告警配置：**
| 指标 | 告警阈值 | 通知方式 |
|------|---------|---------|
| 磁盘使用率 | > 80% Warning / > 90% Critical | Telegram |
| 内存使用率 | > 85% | Telegram |
| CPU 使用率 | > 90% 持续 5 分钟 | Telegram |
| 容器状态 | 任意容器 unhealthy / stopped | Telegram |

#### 第二层：URL + 服务存活监控 — Uptime Kuma（扩展）

**现有：** API 端点 HTTP 检测

**新增配置：**
1. **Docker Container Monitor**：挂载 `docker.sock`，直接监控容器是否在运行
2. **Push Monitor（磁盘探针）**：crontab 脚本每 5 分钟推送心跳，磁盘 > 85% 停止推送 → Kuma 告警
3. 所有告警统一发送到已有 Telegram Bot

#### 第三层：应用错误追踪 — Sentry（云服务）

**选型理由：**
- 免费版 5,000 events/月，完全够用
- 零部署、零运维（Sentry 自部署极重，本末倒置）
- 代码层报错、未捕获异常、API 500 错误实时追踪
- 可直接关联 GitHub PR（错误出现在哪个 commit 引入）

**接入范围：**
```
后端（nordhjem-medusa-backend）：@sentry/node
前端（nextjs-starter-medusa）：  @sentry/nextjs
```

#### 第四层：自动化维护 — crontab 脚本

直接在生产服务器上配置，零依赖：

```bash
# /etc/cron.d/nordhjem-ops

# 每周日凌晨3点：清理废旧 Docker 镜像（保留7天内使用的）
0 3 * * 0  root  docker image prune -a -f --filter "until=168h" >> /var/log/docker-cleanup.log 2>&1

# 每天凌晨2点：清理停止的容器和无用网络
0 2 * * *  root  docker container prune -f && docker network prune -f >> /var/log/docker-cleanup.log 2>&1

# 每5分钟：磁盘心跳探针（>85% 停止推送，触发 Uptime Kuma 告警）
*/5 * * * *  root  /opt/scripts/disk-heartbeat.sh

# 每天凌晨1点：PostgreSQL 备份到本地（配合 Contabo 快照双重保险）
0 1 * * *  root  /opt/scripts/pg-backup.sh >> /var/log/pg-backup.log 2>&1
```

---

## 4. 框架体系补充

### 4.1 新增文档（纳入 DOC-REGISTRY.json 门禁）

| 文档 | 路径 | 说明 |
|------|------|------|
| 基础设施文档 | `docs/INFRASTRUCTURE.md` | 服务器配置、服务清单、端口映射、域名路由 |
| 操作手册 | `docs/OPS-RUNBOOK.md` | 各故障场景 SOP：磁盘满、容器崩溃、DB 连接满、回滚流程 |
| 备份策略 | `docs/BACKUP-POLICY.md` | 备份频率、保留周期、恢复验证流程 |

### 4.2 新增 CI Workflow

| Workflow | 触发 | 说明 |
|----------|------|------|
| `infra-health-check.yml` | 每小时 / 手动 | 从 GitHub Actions 探测生产 API、数据库连通性 |
| `sentry-release.yml` | 部署成功后 | 自动创建 Sentry release，关联 commit，清晰追踪每次部署引入的错误 |

### 4.3 DOC-REGISTRY.json 新增 Operations 阶段门禁

```json
{
  "phase": "operations",
  "required_docs": [
    "docs/INFRASTRUCTURE.md",
    "docs/OPS-RUNBOOK.md",
    "docs/BACKUP-POLICY.md"
  ],
  "gate": "blocking"
}
```

---

## 5. 实施计划

### Phase 1：止血（1天）
- [ ] VPS 上配置磁盘告警 crontab
- [ ] VPS 上配置 Docker 自动清理 crontab
- [ ] Uptime Kuma 增加 Docker Container Monitor
- [ ] 注册 Sentry 账号，接入后端

### Phase 2：体系化（3天）
- [ ] VPS2 上部署 Beszel Hub
- [ ] VPS1 上安装 Beszel Agent，配置所有告警阈值
- [ ] 接入前端 Sentry
- [ ] 编写 `docs/INFRASTRUCTURE.md`
- [ ] 编写 `docs/OPS-RUNBOOK.md`（覆盖至少5个故障场景）
- [ ] 编写 `docs/BACKUP-POLICY.md`
- [ ] 配置 pg-backup 定时脚本
- [ ] DOC-REGISTRY.json 加入 Operations 阶段

### Phase 3：优化（持续）
- [ ] `infra-health-check.yml` workflow
- [ ] `sentry-release.yml` workflow
- [ ] Beszel 告警调优（根据实际运行数据校准阈值）

---

## 6. 成本估算

| 工具 | 费用 | 备注 |
|------|------|------|
| Beszel | 免费开源 | 自部署在现有 VPS2 |
| Uptime Kuma | 免费开源 | 已在运行 |
| Sentry | 免费（5k events/月） | 超量才付费 |
| crontab 脚本 | 免费 | 无额外资源消耗 |
| VPS2 用于 Beszel Hub | 已有（$26/月已付） | 不新增费用 |
| **合计新增费用** | **$0** | |

---

## 7. 风险评估

| 风险 | 概率 | 影响 | 缓解方案 |
|------|------|------|---------|
| Docker 清理误删运行中镜像 | 低 | 高 | `prune` 命令不会删除被容器使用的镜像，天然安全 |
| Beszel Agent 消耗过多资源 | 极低 | 低 | Agent < 26MB 内存，远低于现有服务 |
| Sentry 免费额度超限 | 中 | 低 | 超限后降级采样率，不影响服务运行 |
| VPS2 部署 Beszel Hub 挂了 | 低 | 低 | 监控挂了不影响业务，只是看不到指标 |
| crontab 清理脚本执行失败 | 低 | 中 | 日志记录到文件，Uptime Kuma Push Monitor 可检测 |

---

## 8. 待 Owner 决策的问题

在实施前，需要 Owner 确认以下几点：

1. **Beszel Hub 部署位置**：建议放 VPS2（空闲，481G 可用），你确认吗？
2. **Sentry 账号**：用现有 GitHub 账号（Nickwenniyxiao-art）注册 Sentry 吗？
3. **告警阈值**：磁盘 > 80% 告警是否合适？还是想改成其他值？
4. **pg-backup 保留策略**：本地保留几天的备份？（建议7天）
5. **VPS2 长期规划**：VPS2 除了跑 Beszel Hub，是否还计划部署其他东西？（如果没有，后续可以考虑是否继续订阅）

---

## 9. 参考资料

- [Beszel GitHub](https://github.com/henrygd/beszel)
- [Uptime Kuma Docker Monitor](https://github.com/louislam/uptime-kuma/wiki)
- [Sentry Next.js SDK](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Node.js SDK](https://docs.sentry.io/platforms/node/)

---

> **RFC 状态：Draft — 等待 Owner Review 和批准**
>
> 批准后进入 Phase 1 实施。Owner 可直接在此文档下方注明 "Approved" 或提出修改意见。
