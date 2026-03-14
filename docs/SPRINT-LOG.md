# NordHjem Sprint 日志

---

## Sprint 模板

> 每个 Sprint 开始时复制此模板，填入具体内容。

### Sprint #N: [名称] (YYYY-MM-DD ~ YYYY-MM-DD)

#### 目标
- （从 ROADMAP 取出的任务）

#### 计划
| 任务 | Issue | 负责人 | 状态 |
|------|-------|--------|------|

#### 执行记录
| 日期 | 完成事项 | PR |
|------|---------|-----|

#### Sprint 回顾
- **完成了什么：**
- **没完成什么（原因）：**
- **做得好的（保持）：**
- **做得不好的（改进）：**
- **下个 Sprint 改进措施：**

---

## Sprint #1: Phase 0 基础设施整改 (2026-03-13 ~ 2026-03-13)

### 目标
- 完成 P0 紧急修复
- 完成 P1 代码质量基础

### 计划
| 任务 | Issue | 负责人 | 状态 |
|------|-------|--------|------|
| 后端 ESLint + Prettier | #77 | CTO + Codex | ✅ 完成 |
| 后端 CI lint + type-check | #79 | CTO + Codex | ✅ 完成 |
| Branch Protection reviewer=1 | — | CTO | ✅ 完成 |
| Husky + commitlint | #81 | CTO + Codex | ✅ 完成 |
| Auto-merge CD_PAT 修复 | — | CTO | ✅ 完成 |
| Dockerfile lockfile fix | — | CTO | ✅ 完成 |
| codex-autofix npm install fix | — | Owner（网页操作）+ CTO | ✅ 完成 |

### 执行记录
| 日期 | 完成事项 | PR |
|------|---------|-----|
| 2026-03-13 | 后端 ESLint + Prettier 配置 | PR#78 |
| 2026-03-13 | ESLint 规则放宽（ADR-006） | 直接推送 |
| 2026-03-13 | 后端 CI 加 lint + type-check | PR#80 |
| 2026-03-13 | Husky + commitlint 配置 | PR#82 |
| 2026-03-13 | codex-autofix 改用 npm install | Owner 网页编辑 |

### Sprint 回顾
- **完成了什么：** Phase 0 + P1 核心任务全部完成，11 个检查项清零
- **没完成什么：** TypeScript strict mode 延后（历史代码 any 太多，ADR-006）
- **做得好的：** CI/CD 全流程自动化验证，每个变更都经过完整流水线
- **做得不好的：** lockfile 同步问题反复出现，花了额外时间排查
- **改进措施：** 已修改 codex-autofix.yml 使用 npm install --legacy-peer-deps，避免死循环

---

## Sprint #2: 开发管理体系建设 (2026-03-13 ~ 2026-03-14)

### 目标
- 建立 Engineering Playbook 完整体系
- 创建所有配套文档

### 计划
| 任务 | Issue | 负责人 | 状态 |
|------|-------|--------|------|
| ENGINEERING-PLAYBOOK.md | — | CTO | ✅ 完成 |
| ROADMAP.md | — | CTO | ✅ 完成 |
| CURRENT-STATUS.md | — | CTO | ✅ 完成 |
| 其他配套文档（8个） | — | CTO | ✅ 完成 |
| ADR 8 条补写 | — | CTO | ✅ 完成 |
| POSTMORTEM 1 条补写 | — | CTO | ✅ 完成 |

### 执行记录
| 日期 | 完成事项 | PR |
|------|---------|-----|
| 2026-03-13~14 | 21 个文档文件 (7,565 行) | PR#84 |

### Sprint 回顾
- **完成了什么：** 完整的 Engineering Playbook 体系，包括 ROADMAP、ADR、POSTMORTEM 等
- **做得好的：** 一次性推送 21 个文件，全部通过 CI/CD
- **改进措施：** 后续文档更新应通过 PR 流程，不再直接推送

---

## Sprint #3: CI 门禁体系 v2 (2026-03-14 ~ 2026-03-14)

### 目标
- 建立完整的 CI 门禁体系 v2（13 checks）
- 实现 Bot 自动审批解决 Code Review 死锁
- 完整验证自动化流水线

### 计划
| 任务 | Issue | 负责人 | 状态 |
|------|-------|--------|------|
| CI Gate v2 核心实施 | #83 | CTO + Codex | ✅ 完成 |
| Bot Auto-Approve | #88 | CTO | ✅ 完成 |
| 完整流水线验证 | #90 | CTO | ✅ 完成 |
| 整改 + 新增 CI Gate | #92 | CTO | 🔄 进行中 |

### 执行记录
| 日期 | 完成事项 | PR |
|------|---------|-----|
| 2026-03-14 | CI Gate v2 — 5 workflows + 4 templates + CODEOWNERS | PR#85 |
| 2026-03-14 | Bot auto-approval + Classic PAT 修复 | PR#89 |
| 2026-03-14 | Gating workflow synchronize 修复 | PR#89 |
| 2026-03-14 | 完整流水线验证通过 | PR#91 |
| 2026-03-14 | 整改：关闭过期 Issue、补标签、ADR-009、新 CI gates | 进行中 |

### Sprint 回顾
- **完成了什么：** CI Gate v2 全部上线，13 checks 运行正常，Bot 自动审批解决死锁
- **没完成什么：** 前端仓库 CI Gate 部署（Phase 2 任务）
- **做得好的：** 实施中遇到问题及时记录到 Issues Log，找到了 5 个方案外的问题并修复
- **做得不好的：** Fine-grained PAT 选型错误（应直接用 Classic PAT）；Gating workflow 漏了 synchronize 触发；整改前未给 Issue 补标签
- **改进措施：**
  1. ADR-009 记录了 PAT 选型决策，避免再犯
  2. 新增 Issue label 和 PR assignee CI gate，强制规范执行
  3. 所有 required check workflow 必须包含 synchronize 触发类型
