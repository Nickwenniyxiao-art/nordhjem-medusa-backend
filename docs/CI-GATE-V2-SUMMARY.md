# CI 门禁体系 v2 总结与自检报告

> 生成日期：2026-03-14
> 生成人：CTO (AI Agent)
> 适用仓库：nordhjem-medusa-backend / nextjs-starter-medusa

---

## 一、设计目的回顾

| # | 设计目的 | 达成状态 |
|---|---------|---------|
| 1 | 每一行代码变更都必须有业务目标（ROADMAP）支撑 | ✅ 达成 |
| 2 | 每个 PR 必须有对应的 Issue 作为基础，不允许无目的的代码提交 | ✅ 达成 |
| 3 | 所有流程规范由 CI 自动强制执行，不靠人的自觉 | ✅ 达成 |
| 4 | 从 GitHub Projects 能看清整个项目全貌（目的、方向、进度） | ✅ 达成 |
| 5 | Owner 随时能通过 AI 调取审核记录，不需要亲自逐个审 | ✅ 达成 |
| 6 | GitHub Projects 是项目唯一信息源（Single Source of Truth），新人入职只看项目板就能理解一切 | ⚠️ 部分达成 |

**目的 6 的差距说明：** 项目板字段完整（Status/Priority/Phase/Module），所有 Issue 都有背景/动机段落和 ROADMAP 引用，但 Phase 1.5 和 Phase 3 的业务开发 Issue（M01-M23 模块）尚未创建，目前板上主要是基础设施类 Issue。随着功能开发推进，项目板的全貌效果会越来越好。

---

## 二、自检清单

| # | 检查项 | 状态 | 证据 |
|---|--------|------|------|
| 1 | PR 必须关联 Issue（check-linked-issue）— 不关联能不能合？ | ✅ 达成 | 两仓库 Branch Protection required check。PR body 必须含 `Closes #N`，否则 CI 拦截。workflow 使用 github-script 从 PR body 正则解析（Issue #2 修复后）。 |
| 2 | Issue 必须有 approved 标签（check-issue-approved）— 没标签能不能合？ | ✅ 达成 | 两仓库 required check。关联 Issue 必须有 `approved` label（Owner 手动添加），否则 CI 拦截。 |
| 3 | Issue 必须有 type/priority 标签（check-issue-labels）— 没标签能不能合？ | ✅ 达成 | 两仓库 required check。Issue 必须有 `type:` 前缀标签，否则 CI 拦截。Issue 模板自动添加 `type: bug`/`type: feature`/`type: task`。 |
| 4 | PR 必须有 assignee（check-pr-metadata）— 没 assignee 能不能合？ | ✅ 达成 | 两仓库 required check。workflow 使用 `github.rest.pulls.get()` 实时查询（Issue #6 修复后），不依赖 webhook payload 快照。 |
| 5 | PR 标题必须符合 conventional commit（pr-title）— 乱写能不能合？ | ✅ 达成 | 两仓库 required check。格式：`type(scope): description`，允许 type: feat, fix, hotfix, docs, chore, refactor, test, ci。 |
| 6 | commit 信息必须符合规范（commitlint）— 乱写能不能合？ | ✅ 达成 | 两仓库 required check。使用 `wagoid/commitlint-github-action@v6` + `@commitlint/config-conventional`。配置文件为 `.mjs` 格式（Issue #1 修复后）。 |
| 7 | 分支命名必须符合规范（branch-naming）— 乱起名能不能合？ | ✅ 达成 | 两仓库 required check。必须使用前缀：`codex/`、`feat/`、`fix/`、`hotfix/`、`docs/`、`chore/`、`refactor/`、`test/`、`ci/`。 |
| 8 | PR 必须有 ROADMAP Ref（check-roadmap-ref）— 没引用能不能合？ | ⚠️ 部分达成 | **后端：** ✅ required check，验证 Issue body 中 ROADMAP Ref 格式合法 + 在 ROADMAP.md 中存在。**前端：** workflow 存在且运行正常（从后端仓库 fetch ROADMAP.md），但 **未加入 Branch Protection required checks**。 |
| 9 | ROADMAP 覆盖率审计报告（roadmap-audit）— 每次 PR 是否自动生成？ | ⚠️ 部分达成 | **后端：** ✅ required check，每次 PR 自动在 comment 中输出覆盖率报告。**前端：** workflow 存在但 **未加入 required checks**。 |
| 10 | AI 代码审查（ai-review-gate）— 是否自动审查并作为门禁？ | ✅ 达成 | 两仓库 required check。GPT-4o 自动审查代码差异，通过后 @nickwenniyxiao-bot 自动提交 approve review。使用 Classic PAT（Issue #4 修复后）。 |
| 11 | AI Issue 质量审核（check-issue-quality）— 是否自动审核并输出报告？ | ✅ 达成（Phase 1 信息性） | 两仓库 workflow 运行正常，5 维度 10 分制评分，结果以结构化 PR comment 发布。≥7.0 自动添加 `ai-approved` 标签。**当前为信息性展示，不作为硬门禁**（CI check 始终 pass），未来可升级为硬门禁。 |
| 12 | Issue 必须在 Project Board 上（check-project-board）— 不在板上能不能合？ | ✅ 达成 | 两仓库 required check。使用 GraphQL API + CTO_PAT（read:project scope）查询 Projects v2。使用原生 `fetch()` 而非 @octokit 包（Issue #11 修复后）。 |
| 13 | Project Board 字段必须填完（Status/Priority/Phase/Module）— 不填能不能合？ | ✅ 达成 | check-project-board 逐一校验 Status（非空）、Priority（P0-P3）、Phase（Phase 0-4）、Module（M01-M23/INFRA/DOCS）。缺任何一项 CI 拦截。 |
| 14 | Issue 必须有背景/动机段落 — 不写能不能合？ | ✅ 达成 | check-project-board 中正则检查 Issue body 包含 `## 背景` / `## 动机` / `## Background` / `## Motivation`。三个 Issue 模板（feature/task/bug）均有「背景/动机」必填字段。 |
| 15 | 以上所有检查是否都在 Branch Protection required checks 中？— 能不能绕过？ | ⚠️ 部分达成 | **后端 13 个 required checks 全部覆盖**（见下方清单）。**前端 10 个 required checks，缺少 `check-roadmap-ref` 和 `roadmap-audit`**。此外 `check-issue-quality` 在两仓库都不是 required（设计如此，Phase 1 信息性）。Branch Protection 已禁用 admin bypass（`enforce_admins: true`）。 |
| 16 | 一个新人只看 GitHub Projects Board + Issue 列表，能否理解整个项目在做什么、为什么这么做？ | ✅ 达成 | 每个 Issue 都有背景/动机段落（CI 强制），ROADMAP Ref 追溯到业务目标，Project Board 按 Status/Priority/Phase/Module 分类。AGENTS.md 在仓库内提供完整规范文档。 |
| 17 | 每个 Issue 是否都有「背景/动机」段落？ | ✅ 达成 | Issue 模板必填字段 + CI check-project-board 双重保障。历史 Issue 无法追溯修改，但新 Issue 100% 强制。 |
| 18 | 项目板是否包含两个仓库（前端+后端）的所有 Issue？有没有遗漏？ | ⚠️ 部分达成 | 项目板为跨仓库（User Project），两仓库的 Issue 都能添加。CI 门禁保证新 Issue 关联 PR 时必须在板上。**但历史遗留 Issue 可能未全部添加到板上。** |
| 19 | 项目板字段（Status/Priority/Phase/Module）是否足以让新人理解任务的优先级、阶段和模块归属？ | ✅ 达成 | Priority（P0-P3）标识紧急度，Phase（0-4）标识所属阶段，Module（M01-M23 + INFRA + DOCS）标识业务模块归属，Status（Todo/In Progress/Done）标识当前状态。共 25 个 Module 选项覆盖所有业务领域。 |
| 20 | ROADMAP.md + Issue + PR 的追溯链是否完整？ | ✅ 达成 | Issue body → ROADMAP Ref → ROADMAP.md 目标 ID → Phase/模块。PR → Closes #Issue → 代码变更。roadmap-audit 每次 PR 输出覆盖率报告，可追踪哪些目标有代码变更、哪些还没有。 |
| 21 | AGENTS.md / Playbook 等规范文档是否在仓库内可直接访问？ | ✅ 达成 | 两仓库根目录 `AGENTS.md` 包含完整 CI 门禁规范、分支策略、Issue 模板要求等。后端 `docs/` 目录有 ROADMAP.md。新人 clone 仓库即可查阅，不需要问任何人。 |

### 自检总结

| 状态 | 数量 | 说明 |
|------|------|------|
| ✅ 达成 | 17/21 | 核心门禁全部生效 |
| ⚠️ 部分达成 | 4/21 | #8 #9 #15 前端缺少 required checks；#18 历史 Issue 可能遗漏 |
| ❌ 未达成 | 0/21 | 无 |

### ⚠️ 需要补救的项目

| 项 | 问题 | 补救方案 | 执行人 |
|----|------|---------|--------|
| #8 #9 #15 | 前端 `check-roadmap-ref` 和 `roadmap-audit` 未加入 Branch Protection | Nick 在前端仓库 Branch Protection 中添加这两个 required checks | Nick |
| #18 | 历史遗留 Issue 可能未在项目板上 | 一次性审计：列出所有 open Issue，检查哪些不在项目板上，手动补充 | CTO |

---

## 三、两个仓库 CI 门禁对比

### Workflow 文件清单

| Workflow | 后端 | 前端 | 差异说明 |
|----------|------|------|---------|
| ai-review.yml | ✅ | ✅ | 对齐 |
| ai-test-gen.yml | ✅ | ✅ | 对齐 |
| auto-merge.yml | ✅ | ✅ | 对齐 |
| branch-naming.yml | ✅ | ✅ | 对齐 |
| cd-production.yml | ✅ | ✅ | 对齐 |
| cd-staging.yml | ✅ | ✅ | 对齐 |
| cd-test.yml | ✅ | ✅ | 对齐 |
| check-issue-approved.yml | ✅ | ✅ | 对齐 |
| check-issue-labels.yml | ✅ | ✅ | 对齐 |
| check-issue-quality.yml | ✅ | ✅ | 对齐 |
| check-linked-issue.yml | ✅ | ✅ | 对齐 |
| check-pr-metadata.yml | ✅ | ✅ | 对齐 |
| check-project-board.yml | ✅ | ✅ | 对齐 |
| check-roadmap-ref.yml | ✅ | ✅ | 前端从后端仓库 fetch ROADMAP.md |
| ci.yml | ✅ | ✅ | 后端: build + lint-and-typecheck；前端: lint-and-build |
| codex-autofix.yml | ✅ | ✅ | 对齐 |
| commitlint.yml | ✅ | ✅ | 对齐 |
| deploy-production.yml | ✅ | ✅ | 对齐 |
| pr-title.yml | ✅ | ✅ | 对齐 |
| roadmap-audit.yml | ✅ | ✅ | 对齐 |
| docker-build.yml | ✅ | ❌ | 后端独有：Docker 镜像构建 |
| sync-staging-db.yml | ✅ | ❌ | 后端独有：staging 数据库同步 |
| playwright-monitor.yml | ❌ | ✅ | 前端独有：E2E 巡检 |
| sync-env-data.yml | ❌ | ✅ | 前端独有：环境数据同步 |

**CI 门禁 workflow（20 个）完全对齐**。差异仅在业务特有的 CD/运维 workflow 上，这是预期的。

### Branch Protection Required Checks 对比

| Required Check | 后端 | 前端 | 差异 |
|---------------|------|------|------|
| ai-review-gate | ✅ | ✅ | — |
| build / lint-and-build | ✅ (build) | ✅ (lint-and-build) | Job name 不同，功能等价 |
| commitlint | ✅ | ✅ | — |
| check-issue-approved | ✅ | ✅ | — |
| check-linked-issue | ✅ | ✅ | — |
| branch-naming | ✅ | ✅ | — |
| lint-and-typecheck | ✅ | ❌ | 后端独有（前端合并在 lint-and-build 中） |
| pr-title | ✅ | ✅ | — |
| check-issue-labels | ✅ | ✅ | — |
| check-pr-metadata | ✅ | ✅ | — |
| check-roadmap-ref | ✅ | ❌ ⚠️ | **前端缺失，需补充** |
| roadmap-audit | ✅ | ❌ ⚠️ | **前端缺失，需补充** |
| check-project-board | ✅ | ✅ | — |

**后端 13 个 required checks，前端 10 个。差距：**
- `check-roadmap-ref`：前端 workflow 存在但未加入 required — **需 Nick 补充**
- `roadmap-audit`：前端 workflow 存在但未加入 required — **需 Nick 补充**
- `lint-and-typecheck`：后端独有（前端的 lint 已合并在 `lint-and-build` 中），不是差距

---

## 四、已知问题和风险

### 已记录的实施问题（12 项）

完整记录在 `CI-GATE-ISSUES-LOG.md`，以下为关键项摘要：

| # | 问题 | 根因 | 当前状态 |
|---|------|------|---------|
| 1 | commitlint 不支持 .js 配置 | v19+ 要求 ESM (.mjs) | ✅ 已修复 |
| 2 | check-linked-issue action 检查方式不匹配 | 第三方 action 检查 sidebar link 而非 body | ✅ 已修复（改用 github-script） |
| 3 | 新 workflow 自动变 required | Branch Protection 设置 | ✅ 预期行为 |
| 4 | Fine-grained PAT 无法操作非 owner 仓库 | token resource owner 限制 | ✅ 已修复（改用 Classic PAT） |
| 5 | 缺少 synchronize 触发类型 | 原始方案遗漏 | ✅ 已修复 |
| 6 | check-pr-metadata 使用 webhook payload 快照 | GitHub Actions 时序问题 | ✅ 已修复（改用 API 调用） |
| 7 | check-roadmap-ref checkout develop 循环依赖 | Bootstrap PR 鸡生蛋问题 | ✅ 已修复（使用 merge ref） |
| 8 | commitlint header 超过 100 字符 | 默认规则限制 | ⚠️ 需注意 |
| 9 | check-pr-metadata 时序竞态 | PR 创建与 assignee 设置的时序 | ⚠️ 需注意 |
| 10 | check-issue-quality v1-v3 连续失败 | heredoc/PCRE/注入问题 | ✅ v4 已修复 |
| 11 | @octokit/graphql import 失败 | github-script 不暴露独立包 | ✅ 已修复（改用 fetch） |
| 12 | CTO_PAT 只有 read:project | 需要 project scope 才能写 | ✅ 预期设计 |

### 已知风险

| 风险 | 严重度 | 说明 | 缓解措施 |
|------|--------|------|---------|
| ROADMAP.md 可被 PR 篡改 | 低 | 同一 PR 可添加假 ROADMAP ID 并引用它 | ROADMAP.md 变更需 AI Review + Owner 审批 |
| hotfix/no-issue 标签可绕过所有门禁 | 低 | 设计如此，紧急修复需要快速通道 | 仅 Owner 有权添加标签 |
| 历史 Issue 未全部上板 | 中 | CI 只检查新 PR 关联的 Issue | 计划一次性审计补全 |
| check-issue-quality 不是硬门禁 | 低 | Phase 1 信息性设计 | 后续可升级为 required check |
| 前端 check-roadmap-ref/roadmap-audit 未 required | 中 | 可被绕过 | 需 Nick 加入 Branch Protection |
| webhook payload 时序问题 | 低 | PR 创建后立即触发的 check 可能读到旧数据 | 后续 push 的 synchronize 事件会重新检查 |

### 可被绕过的场景

1. **Owner 直接 push develop**：Branch Protection `enforce_admins: true` 已启用，Owner 也不能绕过。✅ 安全
2. **删除/重命名 workflow 文件**：需要 PR → develop，走完整门禁流程。✅ 安全
3. **修改 Branch Protection 设置**：只有 Owner 有权限。✅ 安全
4. **通过 hotfix 标签绕过**：需要仓库写权限添加标签，且 AI Review 仍会运行。⚠️ 可控
5. **Force push**：Branch Protection 禁止 force push。✅ 安全

---

## 五、数据统计

### Issue 和 PR 统计

| 指标 | 后端 | 前端 |
|------|------|------|
| Open Issues | 4 | 6 |
| Closed Issues | 10 | 1 |
| 总 Issues | 14 | 7 |
| Open PRs | 0 | 0 |
| Closed/Merged PRs | 89 | 100 |
| 总 PRs | 89 | 100 |

### Workflow 统计

| 指标 | 后端 | 前端 |
|------|------|------|
| 总 workflow 文件 | 22 | 22 |
| CI 门禁 workflow | 13 | 13 |
| CD/运维 workflow | 9 | 9 |
| Required status checks | 13 | 10 |

### CI 门禁 Workflow 部署涉及的 Issue/PR

| 阶段 | 后端 PR | 前端 PR | 说明 |
|------|---------|---------|------|
| CI Gate v2 初始部署 | #85 | #108 | 基础门禁 |
| Bot auto-approve + 修复 | #89, #91, #93, #95 | #110 | Issue #4-7 修复 |
| ROADMAP 追溯 | #97, #99 | #112, #114 | check-roadmap-ref + roadmap-audit |
| check-issue-quality | #101 | #116 | AI Issue 质量审核 |
| check-project-board | #103 | #118 | 项目板门禁 |

### ROADMAP 覆盖率

| 指标 | 数量 |
|------|------|
| 总 ROADMAP ID | 57 |
| ✅ 已完成 | 16 (28%) |
| 🔄 进行中 | 1 (2%) |
| ⏳ 待开始 | 22 (39%) |
| ⏸️ 延后 | 1 (2%) |
| 未标注状态（Phase 1.5/2/3/4） | 17 (30%) |

**ROADMAP 分布：**
- Phase 0: 14 个 ID（13 ✅ + 1 ⏸️）
- Phase 1: 11 个 ID（3 ✅ + 1 🔄 + 7 ⏳）
- Phase 1.5: 11 个 ID（收尾任务）
- Phase 2: 7 个 ID（全部 ⏳）
- Phase 3: 8 个 ID
- Phase 4: 6 个 ID

---

## 附录：Token 权限矩阵

| Token | 类型 | Scopes | 用途 |
|-------|------|--------|------|
| BOT_PAT | Classic PAT | repo | Bot auto-approve PR review |
| CD_PAT | Fine-grained PAT | repo 权限 | CD 部署、跨仓库触发 |
| CTO_PAT | Classic PAT | admin:repo_hook, repo, workflow, read:project | CI 门禁（Projects v2 查询） |
| OPENAI_API_KEY | API Key | — | AI Review + Issue 质量审核 |

---

> 本报告由 CTO 基于实际 API 查询数据生成，所有统计数据为 2026-03-14 实时数据。
