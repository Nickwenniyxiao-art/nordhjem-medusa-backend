# AI-CONTEXT — NordHjem 后端项目上下文包

> 这是任意 AI Agent 启动时应首先读取的项目上下文文件。
> 读取后可快速理解项目背景、规范和约束，避免错误决策。
> 最后更新：2026-03-18

---

## 项目简介

**NordHjem** 是一个北欧家居电商平台后端，基于 Medusa v2 构建。

- **定位**：高端北欧风格家居产品在线商店
- **后端角色**：提供商品、购物车、结算、支付、订单管理的 REST API
- **部署平台**：Railway（PostgreSQL + Redis 托管服务）
- **当前开发阶段**：Phase 1 — 核心商业功能开发（进行中）

---

## 技术栈

| 组件 | 技术 | 版本/说明 |
|------|------|---------|
| 框架 | Medusa v2 | 模块化电商框架 |
| 运行时 | Node.js | 20.x LTS |
| 语言 | TypeScript | 严格模式 |
| 数据库 | PostgreSQL | 16.x，Railway 托管 |
| 缓存/队列 | Redis | Railway 托管 |
| 测试 | Jest + ts-jest | 单元测试 |
| API 测试 | Supertest | 集成测试 |
| E2E 测试 | Playwright | 端到端测试（计划中） |
| 容器化 | Docker | 生产部署镜像 |
| CI/CD | GitHub Actions | 完整流水线 |
| 错误监控 | Sentry | 错误率 + 性能追踪 |
| 可用性监控 | Uptime Kuma | 服务心跳检测 |
| 告警 | Telegram Bot | 关键事件推送 |

### 核心 Medusa 模块（自定义）

- `brand` — 品牌管理
- `restock` — 补货通知
- `ticket` — 客服工单
- `resend-notification` — Resend 邮件通知

---

## 分支策略

```
feature/* ──┐
fix/*    ──┤──→ develop ──→ staging ──→ main
hotfix/* ──┘              (自动部署)   (手动 promote)
```

- `develop`：所有功能 PR 合并到此分支，触发 staging 自动部署
- `staging`：预生产分支，CI/CD 完整验证
- `main`：生产分支，仅通过 promote PR 更新，需 Owner 批准

**禁止直接 push main**，分支保护已启用。

---

## 当前开发阶段

- **Phase 0**（已完成）：基础设施整改、ESLint/CI/CD 配置、pg_dump 备份
- **Phase 1**（进行中）：核心商业功能（商品浏览、购物车、结算、支付、订单）
- **Phase 2**（待开始）：SEO、多语言、监控完善
- **Phase 3**（规划中）：增强能力（推荐、评论、收藏）

详见 `docs/ROADMAP.md`。

---

## 关键文档路径

| 文档 | 路径 | 用途 |
|------|------|------|
| 路线图 | `docs/ROADMAP.md` | 开发计划和阶段目标 |
| 功能清单 | `docs/FEATURE-LIST.md` | 所有功能定义 |
| 任务注册表 | `docs/TASK-REGISTRY.json` | 任务状态追踪 |
| 测试注册表 | `docs/TEST-REGISTRY.json` | 测试覆盖记录 |
| 文档注册表 | `DOC-REGISTRY.json` | 文档门禁管理 |
| 架构文档 | `docs/ARCHITECTURE.md` | 系统架构 |
| 数据库 Schema | `docs/DATABASE-SCHEMA.md` | 数据模型 |
| API 参考 | `docs/API-REFERENCE.md` | 端点文档 |
| SLO/SLA | `docs/operations/SLO-SLA.md` | 可用性目标 |
| Error Budget | `docs/ERROR-BUDGET.md` | 错误预算规则 |
| Runbook | `docs/RUNBOOK.md` | 运维手册 |
| 模块文档 | `docs/modules/` | 各 Medusa 模块设计 |
| ADR | `docs/ADR/` | 架构决策记录 |
| RFC | `docs/RFC/` | 重大变更提案 |
| 事故复盘 | `docs/POSTMORTEM/` | 线上事故记录 |

---

## CI/CD 规则摘要

### Pull Request 必须满足

1. **Issue 关联**：PR body 必须包含 `Closes #xxx`，且关联 Issue 必须有 `approved` 标签
2. **分支命名**：`feature/`, `fix/`, `hotfix/`, `chore/`, `docs/` 开头
3. **Commit 规范**：符合 Conventional Commits（commitlint 检查）
4. **范围校验**：变更模块必须在 `FEATURE-LIST.md` 中存在
5. **文档门禁**：`DOC_GATE_MODE: blocking`，缺少门禁文档会阻断 CI

### CI 检查项（全部必须通过）

- ESLint + TypeScript 类型检查
- Jest 单元测试（覆盖率 >= 30%）
- npm audit 安全扫描
- Semgrep + Trivy 安全扫描
- Docker 镜像构建
- 文档门禁检查

### CD 流程

- staging：PR 合并到 develop → 自动触发 Railway staging 部署
- production：手动 promote PR（develop → main），需 Owner approve

---

## 禁止事项（AI Agent 必须遵守）

1. **不能绕过文档门禁**：不得在缺少必要文档的情况下提交代码 PR
2. **不能直接 push main**：所有 main 变更必须通过 PR + Owner 审批
3. **不能自行修改 ROADMAP**：路线图变更需 Owner 明确批准
4. **不能跳过 Issue 创建**：功能开发必须先有已 approved 的 Issue
5. **不能使用 `--no-verify`**：禁止绕过 Git hooks
6. **不能在没有 RFC 的情况下变更架构**：涉及数据库 Schema、API 契约、模块边界的变更需先走 RFC 流程
7. **Error Budget 耗尽时不能提交功能 PR**：只接受 reliability 相关 PR
8. **不能删除或覆盖 .bak 文件**：这些是历史备份，不得删除

---

## 开发流程（AI Agent 标准操作）

1. **接收任务** → 确认 Issue 已有 `approved` 标签
2. **创建分支** → `git checkout -b feature/xxx develop`
3. **开发** → 代码 + 测试 + 文档（三者缺一不可）
4. **提交** → 符合 Conventional Commits 规范
5. **PR** → body 包含 `Closes #xxx` + 完整描述
6. **等待 CI** → 所有检查通过后通知 Owner Review
7. **合并** → Owner approve 后合并到 develop

---

## 环境变量（关键配置）

环境变量详见 `docs/ENVIRONMENT.md` 和 `ENV.md`（不得在代码中硬编码）。

关键变量：
- `DATABASE_URL` — PostgreSQL 连接字符串
- `REDIS_URL` — Redis 连接字符串
- `STRIPE_SECRET_KEY` — Stripe 支付密钥
- `RESEND_API_KEY` — Resend 邮件服务
- `SENTRY_DSN` — Sentry 错误监控
