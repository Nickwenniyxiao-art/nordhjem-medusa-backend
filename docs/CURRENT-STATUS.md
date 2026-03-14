# NordHjem 当前状态快照

> 最后更新：2026-03-13 by CTO

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
| Phase 1: 质量与安全加固 | 🔄 进行中 | 10% |
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
