# PROJECT.md — NordHjem 项目立项文档

## 1. 项目概述

- **项目名称**：NordHjem
- **一句话描述**：北欧风格家具电商平台
- **目标用户**：追求北欧极简风格的消费者
- **商业模式**：B2C 电商
- **市场定位**：欧洲市场（EUR + GBP 双货币）

## 2. 技术栈总览

| 层级 | 技术 | 版本 |
|------|------|------|
| 后端框架 | Medusa.js | v2 |
| 数据库 | PostgreSQL | 15+ |
| 前端框架 | Next.js | 15 |
| UI 样式 | Tailwind CSS | 3 |
| 前端 SDK | Medusa JS SDK | latest |
| 支付 | Stripe | API v2024 |
| 容器化 | Docker + Docker Compose | latest |
| CI/CD | GitHub Actions | — |
| 部署 | VPS (Docker) | — |

## 3. 团队结构

| 角色 | 负责人 | 职责 |
|------|--------|------|
| Owner (Nick) | 人类 | 产品决策、发布审批、商业运营 |
| CTO Agent | AI | 技术方案、代码审核、架构维护、任务分派 |
| Codex Agent | AI | 代码编写、PR 提交 |
| CI/CD | 自动化 | 代码质量、安全检查、自动部署 |

这是一个 AI 驱动的开发团队。CTO 负责技术决策但不直接写代码，所有代码由 Codex Agent 通过 PR 提交，经过 CI/CD 自动检查后合并。

## 4. 项目里程碑

| 阶段 | 内容 | 状态 |
|------|------|------|
| Phase 0 | 基础搭建（仓库、Docker、基本配置） | ✅ 已完成 |
| Phase 1 | 核心功能（商品、购物车、支付、EUR/GBP） | ✅ 已完成 |
| Phase 2 | 工程治理（CI/CD、安全、文档、自动化） | 🔄 进行中 |
| Phase 3 | 质量提升（测试覆盖、性能优化、监控） | 📋 计划中 |
| Phase 4 | 运营成熟（GDPR、效能度量、交接文档） | 📋 计划中 |

## 5. 仓库结构

| 仓库 | 说明 | 地址 |
|------|------|------|
| nordhjem-medusa-backend | 后端 API + 管理面板 | GitHub |
| nextjs-starter-medusa | 前端商城 | GitHub |

### 后端仓库（`nordhjem-medusa-backend`）高层级结构

- `src/api/`：自定义后端 API（store/admin）
- `src/modules/`：业务模块
- `src/workflows/`：Medusa 工作流
- `src/subscribers/`：事件订阅
- `src/jobs/`：定时任务
- `docs/`：架构、流程、决策文档（ADR、指南等）

### 前端仓库（`nextjs-starter-medusa`）高层级结构

- `src/app/`：Next.js App Router 页面与布局
- `src/modules/`：页面级业务模块与组件聚合
- `src/lib/`：SDK、配置与通用工具
- `src/styles/`：全局样式与 Tailwind 扩展
- `public/`：静态资源

## 6. 开发流程

```text
Issue 创建 → Codex 编码 → PR 提交 → CI 自动检查 → CTO 审核 → 合并到 develop → 自动部署 staging → Owner 审批 → 部署 production
```

## 7. 关键决策记录

- 详见 `docs/ADR/` 目录
- ADR-001: 技术栈选型

## 8. 快速开始

- 阅读协作规范：`AGENTS.md`
- 阅读本地开发指南：`docs/LOCAL-DEV-GUIDE.md`
