# NordHjem Backend 新人入职学习路径（5 天）

> 目标读者：新加入 NordHjem Backend 项目的工程师（后端/全栈/技术负责人）
>
> 学习周期：5 天（建议在入职第一周完成）
>
> 建议方式：每天按“阅读清单 → 动手操作 → 学习检查”完成闭环

---

## 学习前准备

- 已安装 Node.js 20+ 与 npm
- 已安装 Docker 与 Docker Compose
- 已具备仓库访问权限（代码仓库、Issue、PR、Actions）
- 已准备本地 `.env`（参考开发文档）

参考文档：

- [项目总览](./PROJECT.md)
- [本地开发指南](./LOCAL-DEV-GUIDE.md)
- [仓库根 README](../README.md)

---

## Day 1：项目概览（预估 2-3 小时）

### 学习目标

- 理解 NordHjem 的业务背景、项目目标与整体技术栈。
- 完成本地开发环境初始化并启动服务。

### 阅读清单

1. [PROJECT.md](./PROJECT.md) —— 了解项目背景、目标与边界。
2. [README.md](../README.md) —— 快速上手运行方式与基础命令。
3. [LOCAL-DEV-GUIDE.md](./LOCAL-DEV-GUIDE.md) —— 按步骤完成本地环境配置。

### 重点理解

- 技术栈：Medusa.js v2、Next.js、PostgreSQL、Redis、Docker。
- 仓库职责：本仓库是后端服务（Medusa.js v2）。
- 本地运行链路：依赖服务启动 → 环境变量加载 → 后端启动 → 健康检查。

### 学习检查（完成即打勾）

- [ ] 我可以说明项目解决的核心业务问题。
- [ ] 我可以列出后端关键技术栈及其作用。
- [ ] 我已在本地成功启动项目并通过健康检查。

---

## Day 2：开发工作流（预估 2-3 小时）

### 学习目标

- 掌握团队协作流程：分支策略、PR 规则、CI/CD 与 Code Review。
- 理解如何提交一个符合规范的首个 PR。

### 阅读清单

1. [ENGINEERING-PLAYBOOK.md](./ENGINEERING-PLAYBOOK.md) —— 团队工程规范与协作流程。
2. [ADR/002-branch-strategy.md](./ADR/002-branch-strategy.md) —— 分支策略与演进背景。
3. [CI-GATE-V2-SUMMARY.md](./CI-GATE-V2-SUMMARY.md) —— CI 门禁与自动化检查概览。

### 重点理解

- 分支流转：`develop → staging → main`。
- PR 要求：Conventional Commits、Issue 关联、Review 与门禁通过。
- CI/CD 基本路径：提交 PR → 自动检查 → 合并 → 环境部署。

### 学习检查（完成即打勾）

- [ ] 我理解如何创建合规分支并提交规范 commit。
- [ ] 我理解 PR 描述需要包含哪些关键信息。
- [ ] 我能描述“从开发到合并”的完整流程。

---

## Day 3：系统架构（预估 3-4 小时）

### 学习目标

- 建立后端系统架构全貌认知：模块边界、数据模型、API 组织方式。
- 能从请求入口讲清核心数据流。

### 阅读清单

1. [docs/modules/README.md](./modules/README.md) —— 当前模块划分与说明（架构入口）。
2. [ADR/001-tech-stack.md](./ADR/001-tech-stack.md) —— 技术选型与约束。
3. [ADR/005-deployment-arch.md](./ADR/005-deployment-arch.md) —— 部署架构与运行结构。
4. [README.md](../README.md) —— API 与运行命令补充说明。

> 说明：若后续新增独立 `ARCHITECTURE.md`，请优先阅读该文件并回看本日清单。

### 重点理解

- `src/modules/` 的模块职责与依赖关系。
- 数据库 Schema 的主要实体与关联关系（按业务域理解）。
- API 结构（store/admin）及其与工作流、模块的调用关系。

### 学习检查（完成即打勾）

- [ ] 我可以说明 3-5 个核心模块及其职责。
- [ ] 我可以画出“请求进入 API 到落库”的核心数据流。
- [ ] 我可以指出新增功能应落在哪个模块或目录。

---

## Day 4：质量与安全（预估 2-3 小时）

### 学习目标

- 理解项目质量保障手段与安全要求。
- 明确哪些检查会阻塞 PR，避免无效迭代。

### 阅读清单

1. [TESTING-STRATEGY.md](./TESTING-STRATEGY.md) —— 测试分层与验证策略。
2. [SECURITY-POLICY.md](./SECURITY-POLICY.md) —— 安全规范与风险控制。
3. [CI-GATE-V2-SUMMARY.md](./CI-GATE-V2-SUMMARY.md) —— 各类 CI Gate 的作用与结果解释。
4. [ENGINEERING-PLAYBOOK.md](./ENGINEERING-PLAYBOOK.md) —— 代码质量与提交规范章节。

### 重点理解

- 后端变更默认验证：lint、type-check、test（按受影响范围执行）。
- 常见阻塞项：commit/PR 命名不合规、Issue 元数据缺失、必需检查未通过。
- 安全底线：环境变量管理、最小权限、敏感信息保护与响应流程。

### 学习检查（完成即打勾）

- [ ] 我知道提交前至少要执行哪些验证。
- [ ] 我能列出会阻塞 PR 的关键 CI 检查。
- [ ] 我理解安全问题上报与处理的基本流程。

---

## Day 5：运维与进阶（预估 2-3 小时）

### 学习目标

- 理解服务上线、运行监控与事故响应机制。
- 掌握生产问题的定位与处理路径。

### 阅读清单

1. [RUNBOOK.md](./RUNBOOK.md) —— 运维手册、常见操作与故障排查。
2. [SPRINT-LOG.md](./SPRINT-LOG.md) —— 最近迭代背景与关键变更记录。
3. [CURRENT-STATUS.md](./CURRENT-STATUS.md) —— 当前系统状态、风险与待办。
4. [ROADMAP.md](./ROADMAP.md) —— 中长期目标与优先级。
5. [CI-GATE-V2-SUMMARY.md](./CI-GATE-V2-SUMMARY.md) —— 发布前后门禁与质量保障补充。

> 说明：若后续新增独立 `RELEASE-CHECKLIST.md`，请将其加入本日必读并按清单执行发布演练。

### 重点理解

- 发布流程：变更准备 → 检查通过 → 合并/部署 → 验证/回滚。
- 监控与告警：如何识别高优先级异常并升级处理。
- 事故响应：按 P0-P3 分级执行沟通、止血、复盘。

### 学习检查（完成即打勾）

- [ ] 我能描述一次标准发布流程。
- [ ] 我知道生产事故分级与首要响应动作。
- [ ] 我知道故障后需要补充哪些记录（日志/复盘/行动项）。

---

## 附录 A：新人常见问题（FAQ）

1. **Q：第一天最重要的产出是什么？**  
   A：能够在本地成功运行后端并理解项目基础结构，这是后续开发与排障的前提。

2. **Q：我应该先读代码还是先读文档？**  
   A：先按本清单读文档建立全局认知，再从 `src/modules/` 进入代码，可显著降低理解成本。

3. **Q：提 PR 前最容易漏掉什么？**  
   A：Issue 关联、PR 首行 `Closes #<id>`、commit/PR 标题格式，以及必需 CI 检查项。

4. **Q：如果 CI 失败应该怎么处理？**  
   A：先定位失败的 gate 类型（格式、测试、门禁元数据），修复后重新推送；必要时在 PR 中记录原因与处理方式。

5. **Q：遇到线上故障但信息不全怎么办？**  
   A：先按 RUNBOOK 做止血和影响面评估，再同步负责人并补齐证据（日志、时间线、变更记录），最后进入复盘闭环。

6. **Q：什么时候需要更新文档？**  
   A：任何影响架构、流程、规范、运维方式的改动都应在同一 PR 或紧随其后更新对应文档。

---

## 附录 B：必读文档清单（相对路径）

- [../README.md](../README.md)
- [./PROJECT.md](./PROJECT.md)
- [./LOCAL-DEV-GUIDE.md](./LOCAL-DEV-GUIDE.md)
- [./ENGINEERING-PLAYBOOK.md](./ENGINEERING-PLAYBOOK.md)
- [./modules/README.md](./modules/README.md)
- [./TESTING-STRATEGY.md](./TESTING-STRATEGY.md)
- [./SECURITY-POLICY.md](./SECURITY-POLICY.md)
- [./RUNBOOK.md](./RUNBOOK.md)
- [./CURRENT-STATUS.md](./CURRENT-STATUS.md)
- [./ROADMAP.md](./ROADMAP.md)
- [./CI-GATE-V2-SUMMARY.md](./CI-GATE-V2-SUMMARY.md)

---

## 附录 C：可选进阶阅读

- [./ADR/README.md](./ADR/README.md)（架构决策索引）
- [./ADR/003-ci-cd-design.md](./ADR/003-ci-cd-design.md)（CI/CD 设计细节）
- [./ADR/004-ai-workflow.md](./ADR/004-ai-workflow.md)（AI 协作流程）
- [./research/2026-03-13-engineering-practices-benchmark.md](./research/2026-03-13-engineering-practices-benchmark.md)（工程实践调研）
- [./CHANGELOG.md](./CHANGELOG.md)（历史变更追踪）

---

## 完成标准（自检）

- [ ] 5 天学习内容全部完成并完成每日日检。
- [ ] 能独立完成本地运行、分支开发、提交流程。
- [ ] 能说明核心架构与主要数据流。
- [ ] 能识别 PR 阻塞项并快速修复。
- [ ] 能在事故场景下按流程进行初步响应。
