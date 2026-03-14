# NordHjem 开发路线图

> ⚠️ 本文档经 Owner 确认后锁定。CTO 不得自行修改。变更必须走流程：提出理由 → Owner 审批 → 更新并记录原因。

## 状态图例
- ✅ 已完成
- 🔄 进行中
- ⏳ 待开始
- ⏸️ 延后

---

## Phase 0: 基础设施整改 ✅

### P0 紧急修复
| 任务 | 状态 | 完成日期 | 说明 |
|------|------|---------|------|
| extract-diff bug 修复 | ✅ | 2026-03-13 | AI Review 提取差异修复 |
| pg_dump 备份集成到 CD | ✅ | 2026-03-13 | staging/production 部署前自动备份 |
| staging 数据库同步 | ✅ | 2026-03-13 | sync-staging-db.yml workflow |

### P1 代码质量基础
| 任务 | 状态 | 完成日期 | 说明 |
|------|------|---------|------|
| 后端 ESLint + Prettier | ✅ | 2026-03-13 | PR#78 |
| 后端 CI lint + type-check | ✅ | 2026-03-13 | PR#80 |
| Branch Protection reviewer=1 | ✅ | 2026-03-13 | 前后端都已配置 |
| Husky + lint-staged + commitlint | ✅ | 2026-03-13 | PR#82 |
| AGENTS.md | ✅ | 2026-03-13 | 项目说明文档 |
| 前端 CI frozen lockfile | ✅ | 2026-03-13 | yarn --frozen-lockfile |
| Auto-merge CD_PAT | ✅ | 2026-03-13 | 使用 CD_PAT 替代 GITHUB_TOKEN |
| Production admin bypass disabled | ✅ | 2026-03-13 | 禁止管理员绕过 |
| Dockerfile lockfile fix | ✅ | 2026-03-13 | npm ci --legacy-peer-deps |
| codex-autofix npm install fix | ✅ | 2026-03-13 | npm install --legacy-peer-deps |
| TypeScript strict mode | ⏸️ | — | 延后，历史代码 any 类型太多（ADR-006） |

---

## Phase 1: 质量与安全加固 🔄

> 目标：补齐测试、安全扫描、AI Review 完整能力

| 任务 | 优先级 | 状态 | 依赖 | 说明 |
|------|--------|------|------|------|
| 单元测试框架搭建（Jest/Vitest） | P1 | ⏳ | — | 后端 Jest + 前端 Vitest |
| CI 加 npm audit 安全扫描 | P1 | ⏳ | — | audit-level=high |
| E2E 加 WebKit 浏览器 | P2 | ⏳ | — | Playwright 多浏览器 |
| AI Reviewer 2 (Claude) 启用 | P2 | ⏳ | ANTHROPIC_API_KEY | 需配置密钥 |
| AI Reviewer 3 (架构审查) 启用 | P3 | ⏳ | Reviewer 2 完成 | 渐进式启用 |
| Docker 语义版本 tag | P2 | ⏳ | — | v{major}.{minor}.{patch} |
| 数据库同步 + 脱敏机制 | P2 | ⏳ | — | staging 定期从 production 同步 |
| Production smoke test | P2 | ⏳ | — | 核心业务流程验证 |

---

## Phase 1.5: Phase 1 遗留收尾 🔄

> Phase 1（功能开发）中未达 100% 的模块收尾

| 模块 | 名称 | 当前进度 | 目标 | 说明 |
|------|------|---------|------|------|
| M3 | 结账流程 | ~95% | 100% | 需等 Stripe Live Mode |
| M4 | 订单管理 | 92% | 100% | 边缘场景处理 |
| M5 | 退款系统 | ~95% | 100% | 需等 Stripe Live Mode |
| M6 | 用户账户 | 92% | 100% | 邮箱变更验证 |
| M9 | 支付系统 | ~95% | 100% | 需等 Stripe Live Mode |
| M10 | 数据分析 BI | 88% | 95% | Metabase 数据绑定 |
| M11 | 财务管理 | 90% | 95% | 税务报表前端展示 |
| M13a | 库存管理 | 90% | 95% | Admin 面板数据绑定 |
| M14 | 管理后台 UI | 60% | 85% | 订单统计/库存报表绑定 |
| M16a | SEO 基础 | 85% | 95% | Sitemap + 结构化数据 |
| M18a | 安全合规基础 | 85% | 95% | Cookie Consent + GDPR |

---

## Phase 2: 监控与运维完善 ⏳

> 目标：建立完整的可观测性和告警体系

| 任务 | 优先级 | 状态 | 说明 |
|------|--------|------|------|
| Uptime Kuma 部署 | P1 | ⏳ | 服务可用性监控 |
| Telegram 告警通知 | P1 | ⏳ | Bot 推送关键事件 |
| Playwright 巡检频率调整 | P2 | ⏳ | 2小时→15分钟 |
| Sentry 性能监控完善 | P2 | ⏳ | 前端已集成，需补充性能指标 |
| 事故响应体系建立 | P2 | ⏳ | Postmortem 流程制度化 |
| 日志集中化 | P3 | ⏳ | 可选：Loki/ELK |
| SLO/SLA 定义 | P3 | ⏳ | 可用性目标 99.9% |

---

## Phase 3: 功能开发 ⏳

> 目标：完善电商核心功能，扩展品牌和运营能力

| 模块 | 名称 | 当前进度 | 优先级 | 依赖 | 说明 |
|------|------|---------|--------|------|------|
| M15 | 多品牌扩展 | 40% | P1 | — | 前端品牌切换 + 数据隔离 |
| M14 | Admin Panel UI | 60% | P1 | — | 运营团队核心工具 |
| M13b | 自动库存管理 | 0% | P2 | M13a 完成 | 低库存告警、自动补货建议 |
| M12 | 人机任务系统 | 0% | P2 | — | AI 与人工协作工单流程 |
| M16b | 高级 SEO | 0% | P2 | M16a 完成 | 进阶 SEO 优化 |
| M17 | 国际化 i18n | 0% | P2 | — | 多语言支持 |
| M19 | 营销系统 | 0% | P3 | — | 促销、折扣码、邮件营销 |
| M20 | CMS 内容管理 | 0% | P3 | — | 博客、Landing Page |

---

## Phase 4: 优化与扩展 ⏳

> 目标：高级功能、外部集成、AI 驱动运营

| 模块 | 名称 | 当前进度 | 优先级 | 说明 |
|------|------|---------|--------|------|
| M18b | 高级安全合规 | 0% | P2 | GDPR 深度合规、数据加密、访问审计 |
| M21 | 社媒集成 | 0% | P2 | Instagram/Pinterest 产品同步 |
| M22 | 采购供应链 | 0% | P3 | 供应商管理、成本追踪 |
| M23 | AI 自主运营 | 0% | P3 | 智能推荐、自动定价、需求预测 |
| — | 性能优化 | — | P2 | Core Web Vitals、CDN |
| — | Feature Flags | — | P3 | 渐进式发布机制 |

---

## 变更日志

| 日期 | 变更内容 | 原因 | Owner 审批 |
|------|---------|------|-----------|
| 2026-03-13 | 初始版本创建 | 建立开发管理体系 | ✅ 已锁定 |
