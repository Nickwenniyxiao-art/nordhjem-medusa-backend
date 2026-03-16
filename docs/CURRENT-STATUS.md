# NordHjem 当前状态快照

> 最后更新：2026-03-14 by CTO

## 项目概览

| 项目 | 值 |
|------|---|
| 项目名称 | NordHjem — 北欧极简主义家居电商 |
| 域名 | nordhjem.store / api.nordhjem.store |
| 技术栈 | Next.js 15 + Medusa.js v2 + PostgreSQL + Redis |
| VPS | 66.94.127.117 (Ubuntu 24.04) |
| GitHub 组织 | Nickwenniyxiao-art |
| 前端仓库 | nextjs-starter-medusa |
| 后端仓库 | nordhjem-medusa-backend |

## 各阶段进度

| 阶段 | 状态 | 完成率 |
|------|------|--------|
| Phase 0: 基础设施整改 | ✅ 已完成 | 100% |
| Phase 1: 质量与安全加固 | 🔄 进行中 | 35% |
| Phase 1.5: 功能模块收尾 | ⏳ 待开始 | 0% |
| Phase 2: 监控与运维完善 | ⏳ 待开始 | 0% |
| Phase 3: 功能开发 | ⏳ 待开始 | 0% |
| Phase 4: 优化与扩展 | ⏳ 待开始 | 0% |

## 模块进度总览

### Phase 1 模块（功能开发，整体 ~91%）
| 模块 | 名称 | 进度 | 状态 |
|------|------|------|------|
| M1 | 产品目录 | 100% | ✅ |
| M2 | 购物车 | 100% | ✅ |
| M3 | 结账流程 | 95% | ⏸️ 等 Stripe Live |
| M4 | 订单管理 | 92% | 需边缘场景测试 |
| M5 | 退款系统 | 95% | ⏸️ 等 Stripe Live |
| M6 | 用户账户 | 92% | 需邮箱验证测试 |
| M7 | 客户服务 | 100% | ✅ |
| M8 | 物流跟踪 | 100% | ✅ |
| M9 | 支付系统 | 95% | ⏸️ 等 Stripe Live |
| M10 | 数据分析 BI | 88% | 需 Metabase 绑定 |
| M11 | 财务管理 | 90% | 需前端展示 |
| M13a | 库存管理 | 90% | 需 Admin 绑定 |
| M14 | 管理后台 UI | 60% | 主要 gap |
| M15 | 多品牌扩展 | 40% | Phase 3 |
| M16a | SEO 基础 | 85% | 需 Sitemap |
| M18a | 安全合规基础 | 85% | 需 Cookie Consent |

## CI/CD 状态

| 组件 | 状态 | 说明 |
|------|------|------|
| CI (lint + type-check + build) | ✅ 运行中 | ci.yml |
| CD — Test | ✅ 运行中 | cd-test.yml |
| CD — Staging | ✅ 运行中 | cd-staging.yml |
| CD — Production | ✅ 运行中 | cd-production.yml (需 Owner 审批) |
| AI Review (GPT-4o-mini) | ✅ 运行中 | reviewer-1 启用 |
| AI Review (Claude) | ❌ 未启用 | 待配 ANTHROPIC_API_KEY |
| Auto-merge | ✅ 运行中 | 使用 CD_PAT |
| Bot Auto-Approve | ✅ 运行中 | @nickwenniyxiao-bot via BOT_PAT |
| CI Gate v2 (11 checks) | ✅ 运行中 | 8 required + CODEOWNERS |
| Codex Auto-fix | ✅ 运行中 | 3 次重试上限 |

## 已知技术债

| # | 技术债 | 影响 | 计划 |
|---|--------|------|------|
| 1 | TypeScript strict mode 未启用 | 类型安全降低 | 延后至所有模块稳定后 |
| 2 | ESLint no-explicit-any 关闭 | ~477 个 any 类型 | 逐步收紧 |
| 3 | 单元测试覆盖率 0% | 无回归保障 | Phase 1 任务 |
| 4 | npm audit 未集成 CI | 依赖安全盲区 | Phase 1 任务 |
| 5 | E2E 只有 Chromium | Safari 兼容性未测 | Phase 1 任务 |
| 6 | AI Reviewer 2/3 未启用 | 审查深度不足 | Phase 1 任务 |
| 7 | 无 Uptime 监控 | 宕机无法及时发现 | Phase 2 任务 |
| 8 | 无告警通知 | 事故响应延迟 | Phase 2 任务 |
| 9 | Docker tag 未语义化 | 版本追溯困难 | Phase 1 任务 |
| 10 | mikro-orm peer dep 冲突 | 需 --legacy-peer-deps | 待 mikro-orm 更新 |

## 待办优先级

### 当前 Sprint 任务
（参见 SPRINT-LOG.md）

### 接下来要做
1. Phase 1 质量与安全加固
2. Phase 1.5 功能模块收尾
3. Phase 2 监控与运维
4. Phase 3 功能开发

## 2026-03-14 Engineering Playbook 上线

- **21 个文档文件**（7,565 行）已推送到 develop 并通过完整 CI/CD 流水线部署到生产环境
- ROADMAP.md 已经 Owner 确认锁定
- GitHub Projects 看板「NordHjem Engineering Roadmap」已创建
- 整条流水线运行正常：CI ✅ → Test ✅ → Staging ✅ → Production ✅

## 2026-03-14 CI Gate v2 完成

### CI 门禁体系 v2 上线

- **13 个 CI checks** 全部运行（10 个 required）
- **Bot 自动审批**：`@nickwenniyxiao-bot` 在 AI Review 通过后自动提交 APPROVE review
- **完整流水线验证**：Issue → Codex PR → CI → AI Review → Bot Approve → Auto-merge → CD
- **PR #85**: CI Gate v2 核心实施（5 workflows + 4 issue templates + CODEOWNERS）
- **PR #89**: Bot auto-approval 实施
- **PR #91**: 完整验证测试通过

### Secrets 变更

| Secret | 用途 | 新增/变更 |
|--------|------|-----------|
| `BOT_PAT` | Bot 账号 Classic PAT，用于 PR auto-approve | 新增 |
| `OPENAI_API_KEY` | AI Code Review (GPT-4o-mini) | 已有 |
| `CD_PAT` | CD pipeline + Auto-merge | 已有 |

## S1-0: Codex Auto-Fix 已禁用 (2026-03-16)

- **状态**: 已禁用（改为 workflow_dispatch 手动触发）
- **原因**: 累计运行525次，22分钟内触发7次，浪费Actions额度并阻塞其他工作流
- **恢复条件**: 阶段一（S1-1 ~ S1-6）全部完成、所有核心工作流稳定变绿后重新启用
- **恢复时需要做的修改**:
  1. 将触发条件改回 `workflow_run`
  2. 添加频率限制：24小时内同一分支最多触发1次
  3. 添加触发范围限制：只监听 CI 工作流，不监听 AI Code Review

## S1-2: Database Backup 工作流修复 (2026-03-16)

- **问题**: 25次运行全部失败，YAML 文件有语法错误，且基础设施可能未完全就绪
- **修复**: 重写 db-backup.yml，添加基础设施验证，改善容错处理
- **验证**: 需要手动触发一次确认是否能成功连接服务器并执行备份
- **注意**: 如果 SSH secrets (DEPLOY_HOST, DEPLOY_USER, DEPLOY_SSH_KEY) 未配置或无效，工作流仍会失败，需 Owner 在 GitHub Settings > Secrets 中检查

## S1-3: CD-Staging 修复 + CD-Production 排查 (2026-03-16)

### CD-Staging
- **问题**: "No env file" — staging 容器不存在时无法获取环境变量
- **修复**: 添加回退机制，从 production 容器导出环境变量作为模板，自动替换数据库名为 staging

### CD-Production
- **状态**: #60 处于 Waiting 状态
- **分析**: cd-production.yml 使用 `environment: production`，这是 GitHub Environments 的审批机制
- **结论**: 这是**正常设计行为**，符合 R3 规则（production 需 Owner 审批）
- **后续**: 当 Owner 在 GitHub 中批准 deployment 后，CD-Production 将继续执行
- **注意**: 如果 CD-Staging 持续失败，promote-to-production 步骤无法创建 PR 到 main，CD-Production 也不会有新的部署触发。修复 CD-Staging 是前置条件。

## S1-1: Release 工作流修复 (2026-03-16)

- **问题**: semantic-release 尝试创建已存在的 v1.0.0 tag，导致 exit code 128
- **修复**: 在 release.yml 中添加 `git fetch --tags --force` 确保 semantic-release 能识别所有已有 tag 并自动递增版本号
- **原则**: 不删除已有 tag（保护 release 记录），让 semantic-release 自动判断下一版本

## S1-5: actionlint 工作流检查已添加 (2026-03-16)

- **新增**: `.github/workflows/actionlint.yml`
- **触发条件**: 当 PR 或 push 修改了 `.github/workflows/` 目录下的文件时自动运行
- **作用**: 检查所有 GitHub Actions 工作流文件的语法正确性，防止 YAML 语法错误导致 CI 失败

## S3-1b: 文档格式系统性修复 (2026-03-16)

- **问题**: 约50个模板文档不满足 markdownlint 规则（MD041/MD022/MD032/MD036）
- **修复**: 批量修正所有文档首行为 H1 标题，补齐标题和列表的空行
- **影响范围**: docs/ 目录下约50个模板文档

## S3-4: DORA Metrics Dashboard 已创建 (2026-03-16)

- **新增**: `docs/DORA-METRICS-DASHBOARD.md`
- **包含**: 四大 DORA 指标定义、数据采集方法、Sprint 指标历史表
- **后续**: 每周 Sprint 结束时更新实际数据
