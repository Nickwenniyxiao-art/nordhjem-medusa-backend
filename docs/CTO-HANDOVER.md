---
项目名称: NordHjem Medusa Backend
创建日期: 2026-03-16
状态: 已发布
负责人: CTO
---

# CTO 交接手册

> 目标：让新任 CTO 在 1 小时内建立全局认知、在 1 天内接管日常节奏、在 1 周内可独立推进跨仓库治理。

## 项目概述

NordHjem 是北欧风格家具电商平台，采用 Headless 架构：Next.js storefront 负责用户体验，Medusa v2 后端负责商品、订单、支付与运营能力。技术主栈为 Medusa.js v2 + Node.js + TypeScript + PostgreSQL + Redis，部署平台为 Railway（test/staging/production 三环境）。详细架构与数据流见 `docs/ARCHITECTURE.md`，技术栈选型背景见 `docs/ADR/001-tech-stack.md`。  
- 架构入口：`docs/ARCHITECTURE.md`  
- 技术栈决策：`docs/ADR/001-tech-stack.md`

## 交接范围

本次交接覆盖以下范围（按优先级）：

1. **治理与节奏**：Issue → PR → CI Gate → 合并 → 多环境发布全链路。  
2. **双仓协同**：`nordhjem-medusa-backend`（后端能力）与 `nextjs-starter-medusa`（前端体验）边界与接口协作。  
3. **质量与门禁**：分支、Commit、PR 元数据、Issue 审批、Project Board、ROADMAP 追溯与 EGP 执行保障。  
4. **运维与应急**：监控、告警、事故分级、回滚流程、联系人机制。  
5. **文档治理**：ADR、ROADMAP、RUNBOOK、TASK-REGISTRY、DOC-REGISTRY 的更新责任。

> 不在本手册重复底层实现细节；实现层请直接查阅 `docs/ARCHITECTURE.md`、`docs/RUNBOOK.md`、`docs/ROADMAP.md`、`AGENTS.md`。

## 核心资产清单

### 1) 仓库与职责

- **后端仓库：`nordhjem-medusa-backend`**  
  负责 Medusa API、模块、工作流、订阅器、任务与治理文档（本仓库）。
- **前端仓库：`nextjs-starter-medusa`**  
  负责 Storefront 页面、前端模块、SDK 调用与品牌化体验。

后端关键目录（建议新 CTO 第一天先浏览）：
- `src/api`：Store/Admin API 扩展
- `src/modules`：业务模块（brand/restock/ticket/notification provider）
- `src/workflows`：跨模块流程编排
- `src/subscribers`、`src/jobs`：事件与异步执行
- `docs/`：治理、架构、ADR、运行手册

### 2) CI/CD 与发布路径

- 主分支流：`develop → staging → main`。  
- 环境发布：develop 自动到 test，staging 自动到 staging，main 需审批后到 production。  
- CI 关键门禁：至少包含 `build` 与 `ai-review-gate`，并有 Issue/ROADMAP/Project Board/EGP 等治理检查。  
- EGP（Execution Guarantee Protocol）要求 PR 关联 Action，并更新 `docs/TASK-REGISTRY.json` 状态；若带 `egp-bootstrap` 可豁免。

### 3) 角色与权限

- **Owner（Nickwenniyxiao-art）**：产品与发布最终审批者，Issue `approved` label 授予者。  
- **CTO（AI Agent）**：技术方案、任务拆解、质量门禁落地、风险兜底。  
- **Bot（nickwenniyxiao-bot）**：自动化合并/流程触发与部分 CI 自动操作。

权限与 Secret 关注点：
- `CTO_PAT`：Project Board（Projects v2）校验读取。  
- `BOT_PAT`：自动发布触发、项目板自动状态更新等自动化动作。  
- `CD_PAT`：发布/合并链路中替代默认 token 的关键凭据。

### 4) 文档与决策资产

- **路线图**：`docs/ROADMAP.md`（含 R-Px-xx 追溯 ID）  
- **执行登记**：`docs/TASK-REGISTRY.json`（EGP Source of Truth）  
- **架构总览**：`docs/ARCHITECTURE.md`  
- **运维手册**：`docs/RUNBOOK.md`、`docs/OPS-MONITORING.md`  
- **决策记录**：`docs/ADR/`（如技术栈、部署策略、EGP）

## 日常运维（CTO 值班节奏）

建议按以下固定节奏执行：

1. **每日 2 次 PR 队列巡检**  
   - 检查是否满足 Issue 关联、Roadmap Ref、Assignee、标签与 EGP Action。  
   - 对高风险改动提前要求回滚方案与验证日志。
2. **每日 1 次环境健康快照**  
   - 关注 API 健康、关键容器日志、备份任务最近状态。  
   - 发现 P0/P1 信号时直接进入 RUNBOOK 事故流程。
3. **每周治理回顾**  
   - ROADMAP 与 TASK-REGISTRY 对齐：是否存在“已做未登记”或“登记未落地”。  
   - 审核 CI 非必需检查（如 audit/semgrep）失败趋势，决定是否升级为 required。
4. **Codex 任务下发规范**  
   - 明确 Issue 编号、目标文件、验收标准、禁止改动范围。  
   - 要求 PR 描述透明披露测试结果、风险和回滚路径。

## 风险与待办

### 已知问题 / 技术债

1. **安全检查门禁分层仍在演进**  
   `npm audit`、Semgrep 已接入策略体系，但并非所有检查都在同一硬门禁级别，需要持续收敛策略。
2. **历史部署文档存在演进痕迹**  
   ADR/运行文档中存在 VPS 与 Railway 的阶段性信息，后续应统一为当前生产事实并补充“迁移时间线”。
3. **lockfile/依赖兼容性风险**  
   历史上存在与 lockfile/依赖安装参数相关的问题（如 legacy peer deps 场景），升级依赖时需先做灰度验证。
4. **监控成熟度仍在建设期**  
   Roadmap Phase 2 多项监控告警任务未完成（Uptime、告警推送、SLO/SLA），事故发现与定位仍依赖人工巡检。

### 紧急情况处理（事故响应与回滚）

- **分级响应**：按 P0/P1/P2 执行不同通知与时效策略；P0/P1 需直接通知 Owner。  
- **止血优先**：先恢复可用性，再定位根因；不得在生产进行未验证修复。  
- **标准回滚**：确认回滚版本 → 通知 Owner → 执行回滚 → 记录到日志/周报。  
- **事后闭环**：补 Postmortem、更新 RUNBOOK 与监控规则，避免同类事故复发。

## 决策记录（必读索引）

新任 CTO 上岗第一周至少完整阅读以下文档：

1. `docs/ADR/001-tech-stack.md`：为何选 Medusa v2 + Next.js + PostgreSQL + Redis。  
2. `docs/ADR/ADR-002-deployment-strategy.md`：发布策略与环境约束。  
3. `docs/ADR/011-execution-guarantee.md`：EGP 设计动机、CI 校验与治理收益。  
4. `docs/ROADMAP.md`：阶段目标、进行中项与 Owner 批准轨迹。

> 原则：任何跨模块或跨环境决策，先查 ADR；若无 ADR，先补 ADR 再落地。

## 90 天行动建议

### Day 0-30（接管期）
- 完成双仓资产盘点、权限与 Secret 盘点（CTO_PAT/BOT_PAT/CD_PAT 使用面）。
- 将当前 CI 检查分为：required / informational / advisory 三层，并输出差距清单。
- 对 RUNBOOK 进行一次演练：按“假设生产故障”走完诊断与回滚流程。

### Day 31-60（治理强化期）
- 推动 Phase 2 监控任务（R-P2-01 ~ R-P2-04）落地至少 1-2 项，降低人工盯盘依赖。
- 收敛文档事实源：统一部署现状描述，消除历史分叉叙述。
- 形成“每周 CTO Digest”机制：风险、吞吐、门禁失败 Top N、下周决策点。

### Day 61-90（优化与传承期）
- 针对高频失败门禁建立自动修复建议模板（面向 Codex 任务输入）。
- 对 EGP 与 Project Board 做一致性审计，确保 Task/Action 与实际 PR 完整映射。
- 完成一次“反向交接演练”：由新人按本文档独立完成一次完整发布与一次故障演练。

---

**维护约定**
- 本文档由 CTO 维护，发生以下任一事件必须更新：
  1) 流程门禁变更；2) 发布策略变更；3) 角色权限变更；4) P0/P1 事故复盘结论影响流程。
- 更新后需同步检查 `DOC-REGISTRY.json` 状态与关联说明，保持文档可审计性。
