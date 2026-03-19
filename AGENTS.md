# AGENTS.md — NordHjem Backend

## Project Overview

NordHjem is a Scandinavian furniture e-commerce platform.
This is the backend, powered by **Medusa.js v2** (2.13.x) + **PostgreSQL** + **Docker**.

## Tech Stack

- Runtime: Node.js 20+
- Framework: Medusa.js v2 (not v1 — API and module patterns are different)
- ORM: MikroORM (via @mikro-orm/postgresql)
- Language: TypeScript 5.6+ (strictNullChecks enabled)
- Containerization: Docker (single Dockerfile, docker-compose for local dev)
- Process Manager: Docker (production), Node directly (development)

## Project Structure

```
src/
├── api/          # Custom API routes (REST endpoints)
├── jobs/         # Background scheduled jobs
├── links/        # Module link definitions
├── modules/      # Custom Medusa modules
├── scripts/      # One-off scripts (seed, migrations)
├── subscribers/  # Event subscribers
└── workflows/    # Medusa workflows
```

## Key Conventions

- All source code in `src/` uses TypeScript
- API routes follow Medusa v2 conventions: `src/api/store/...` for storefront, `src/api/admin/...` for admin
- Use Medusa's built-in dependency injection — do NOT use raw `new` for services
- Database migrations are handled by `npx medusa db:migrate`
- Environment variables are defined in `.env` (see `.env.example`)

## Branch Strategy

- `develop` → `staging` → `main`
- All changes via feature branches → PR to `develop`
- Branch naming: `codex/*` for AI-generated, `feature/*` for manual
- PR titles must use Conventional Commits (feat/fix/refactor/chore)

## CI/CD

- CI: Docker build + lint + type-check on PR/push to develop/staging/main
- CD: develop auto-deploys to test → staging auto-deploys → main needs approval for production
- Required checks: `build` + `ai-review-gate`
- Bot auto-approval: @nickwenniyxiao-bot submits PR review when AI review passes

## Environments

| Env        | Port | Container               | Database            |
| ---------- | ---- | ----------------------- | ------------------- |
| Test       | 9001 | nordhjem_medusa_test    | nordhjem_test       |
| Staging    | 9002 | nordhjem_medusa_staging | nordhjem_staging    |
| Production | 9000 | nordhjem_medusa         | nordhjem_production |

## Do NOT

- Hardcode environment-specific values (use env vars)
- Modify `.github/workflows/` without explicit instruction
- Change database schema without a migration
- Use `npm install` in CI (use `npm ci`)
- Commit `.env` files

## GitHub 操作双层门禁（入职必读）

所有对 GitHub 的写操作实施**双层强制门禁**，任何 AI 员工必须遵守：

### Layer 1 — EGP Gate（本地 Hook）

每个 `gh` 写操作命令必须带 Issue 引用注释，否则被拦截：

```bash
gh pr merge 617 --squash           # AI-Decision: #620
gh run delete 12345678             # AI-Decision: #625
gh workflow disable smoke-test     # AI-Decision: #626
```

写操作范围：`gh pr create/merge/edit/close`、`gh issue edit/close`、`gh run delete/cancel`、`gh workflow disable/enable`、`gh api POST/PATCH/PUT/DELETE` 等。

豁免：`gh issue create` 无需注释（它本身就是在建立审计记录）。

### Layer 2 — GitHub Branch Protection（服务端）

`develop` 分支 Required Status Checks（PR 必须通过才能 merge）：
- `pr-compliance-fix`
- `check-pr-metadata / check-pr-metadata`

### 操作流程

```
① 先建 Issue → ② 执行操作时引用 Issue → ③ Issue 成为审计档案
```

所有 AI 决策可在此查询：
`https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend/issues?q=label%3Aai-decision`

---

## CI 门禁规范（必须遵守）

### PR 必须关联 Issue

- PR 描述的**第一行**必须包含 `Closes #<issue_number>`
- 示例：`Closes #123`
- 没有关联 Issue 的 PR 会被 CI 自动拒绝

### 分支命名规范

- 必须使用以下前缀：`codex/`、`feat/`、`fix/`、`hotfix/`、`docs/`、`chore/`、`refactor/`、`test/`、`ci/`
- Codex 创建的分支格式：`codex/<issue-number>-<brief-description>`
- 示例：`codex/123-add-order-validation`
- 不符合命名的分支会被 CI 拒绝

### Commit Message 规范

- 必须使用 Conventional Commits 格式
- 格式：`type(scope): description`
- 允许的 type：feat, fix, hotfix, docs, chore, refactor, test, ci
- 示例：`feat(orders): add bulk status update endpoint`
- 不符合格式的 commit 会被 CI 拒绝

### PR 标题规范

- 与 commit message 格式相同
- 示例：`feat(M4): add order status validation`
- 不符合格式的 PR 标题会被 CI 拒绝

### Issue 审批要求

- 关联的 Issue 必须有 `approved` label（Owner 添加）
- 如果 Issue 没有 approved label，PR 不能合并
- 不要为没有 approved label 的 Issue 创建 PR

### Issue 标签要求

- 关联的 Issue 必须有 `type:` 前缀的标签（如 `type: feature`、`type: bug`、`type: task`）
- 缺少类型标签的 Issue 会导致 PR CI 检查失败
- 创建 Issue 时务必选择正确的 Issue 模板（会自动添加类型标签）

### PR 元数据要求

- 每个 PR 必须有至少一个 Assignee
- 没有 Assignee 的 PR 会被 CI 拒绝
- Codex 创建的 PR 应指定 Assignee 为发起任务的 CTO 或 Owner

### ROADMAP 追溯要求

- 每个 Issue 必须在 body 中包含 `ROADMAP Ref` 字段，引用 `docs/ROADMAP.md` 中的目标 ID
- ID 格式：`R-Px-xx`（如 `R-P1-01`、`R-P3-05`）
- 创建 Issue 时使用 Issue 模板，ROADMAP Ref 为必填字段
- CI Gate `check-roadmap-ref` 会验证：Ref 格式合法 + Ref 在 ROADMAP.md 中真实存在
- 豁免值：紧急 bug 填 `HOTFIX`，基础设施维护填 `INFRA`（CI 通过但审计会标记）
- 每个 PR 都会运行 `roadmap-audit`，在 PR comment 中输出 ROADMAP 覆盖率报告

### Project Board 门禁要求

- 每个 PR 关联的 Issue 必须被添加到 **NordHjem Engineering Roadmap** GitHub Project
- Issue 在 Project Board 上必须填写以下字段：
  - **Status**：不能为空（Todo / In Progress / Done）
  - **Priority**：必须是 P0、P1、P2、P3 之一
  - **Phase**：必须是 Phase 0、Phase 1、Phase 2、Phase 3、Phase 4 之一
  - **Module**：M01-M23、INFRA 或 DOCS（字段存在时强制校验，未创建时 warning 跳过）
- 豁免：PR 有 `hotfix` 或 `no-issue` label 时跳过所有 Project Board 检查
- CI Gate `check-project-board` 使用 GraphQL API 查询 Projects v2，需要 `CTO_PAT`（read:project scope）
- Issue body 必须包含 `## 背景` 或 `## 动机` 或 `## Background` 或 `## Motivation` 段落

### AI Issue 质量审查（Phase 1: 信息性）

- 每个 PR 创建/更新时，`check-issue-quality` workflow 自动审查关联 Issue 的质量
- 使用 GPT-4o-mini 从 5 个维度打分（每项 0-2 分，满分 10）：
  1. **ROADMAP 关联性** — Issue 和 PR 是否正确引用 ROADMAP ID
  2. **描述完整性** — Issue 是否有清晰的背景、目标、实现方向
  3. **AC 质量** — 验收标准是否明确且可验证
  4. **PR-Issue 一致性** — PR 变更是否与 Issue 范围一致
  5. **粒度合理性** — Issue 粒度是否适中（单 PR 可完成）
- 评分 >= 7.0 且无 ❌ 维度 → 自动添加 `ai-approved` 标签
- **Phase 1 说明**：当前仅信息性展示，不作为硬门禁（CI check 始终 pass）
- 审查结果以结构化表格形式发布为 PR comment，格式固定，可查询
- `ai-approved` 标签与 Owner 的 `approved` 标签是独立的两套机制
- CI Gate `check-issue-quality` 使用 OpenAI API，需要 `OPENAI_API_KEY`

---

> CI Gate v2 full pipeline verified: 2026-03-14T09:25:00Z
> CI Gate v2 remediation + new gates: 2026-03-14T09:40:00Z
> ROADMAP traceability: 2026-03-14
> Project Board gate + AI Issue quality review: 2026-03-14

## EGP — 执行保障协议（Execution Guarantee Protocol）

### 概述

EGP 是 NordHjem 的原子化任务追踪体系。所有代码变更必须关联到 `docs/TASK-REGISTRY.json` 中的具体 Action，确保每行代码都可追溯到 ROADMAP 目标。

**核心文件**：
- `docs/TASK-REGISTRY.json` — 唯一的任务执行 source of truth
- `docs/schemas/task-registry.schema.json` — JSON Schema 校验规范

### TASK-REGISTRY 结构

```
Project (Phase) → Task (R-Px-xx) → Action (R-Px-xx-Ay)
```

- 每个 ROADMAP Task 对应 REGISTRY 中的一个 Task 条目
- 每个 Task 下有 1~N 个 Action（最小可交付单元）
- 每个 Action 对应一个 PR

### Action 状态流转

```
planned → in_progress → done
                     ↘ skipped (需 Owner 审批)
```

- `planned`: 已规划，未开始
- `in_progress`: 正在执行（有对应的 PR 在进行中）
- `done`: 已完成（PR 已合并）
- `skipped`: 经 Owner 审批后跳过（审计报告会高亮）

**禁止反向流转**：不能从 `done` 改回 `planned` 或 `in_progress`。

### PR 提交时的 EGP 要求

1. **PR body 必须包含 Action 引用**：
   ```
   EGP Action: R-P1-24-A2
   ```
   格式：`EGP Action: R-Px-xx-Ay`

2. **同一个 PR 中必须更新 TASK-REGISTRY.json**：
   - 将对应 Action 的 `status` 从 `planned`/`in_progress` 更新为 `done`
   - 填写 `pr` 字段为当前 PR 编号（如 `#218`）
   - 填写 `completed_at` 为当前时间（ISO 8601 格式）

3. **如果 PR 涉及新增 Action**（原计划没有的工作），需要：
   - 在 TASK-REGISTRY.json 中新增 Action 条目
   - Action ID 按顺序递增（如已有 A1-A3，新增 A4）

### 豁免机制

| Label | 效果 |
|-------|------|
| `egp-bootstrap` | 完全跳过所有 EGP CI 检查（用于 EGP 系统自身的初始搭建） |
| `hotfix` | 跳过 EGP 检查，但自动创建补录 Issue（24h 内补录 TASK-REGISTRY） |

### CI 门禁

- `check-execution-protocol` — 校验 PR 的 Action 引用和状态更新
- `check-registry-integrity` — 校验 TASK-REGISTRY.json 的 Schema 合法性和覆盖率

> ⚠️ 这两个 CI 检查在 A6（端到端验证）通过前，不会作为 required status checks。

## 调研闭环规范

- 所有调研任务必须遵循“输入清晰 → 过程可追溯 → 结论可执行 → 结果可归档”的闭环原则。
- 调研开始前必须明确：调研背景、目标问题、约束条件、预期产出；信息不足时先补齐上下文再执行。
- 调研过程中必须记录来源（官方文档/仓库/标准规范）与关键结论，避免仅给出主观判断。
- 调研结论必须包含：推荐方案、备选方案、取舍理由、风险与后续动作（Action Items）。
- 调研结果需沉淀到可检索文档（如 `docs/research/`），并在相关 Issue/PR 中引用，确保可审计与可复用。
- 若调研结论会影响实现方案，必须同步更新验收标准或实施计划，确保“调研→实现→验证”一致。

## 测试规范

- 所有代码或文档变更在提交前都必须进行最小可行验证，至少覆盖受影响范围。
- 后端默认检查命令：`npm run lint`、`npx tsc --noEmit`、`npm test`（若项目存在对应测试）。
- 若本次变更仅涉及文档，至少执行格式/拼写/链接等自检，并在 PR 中说明验证方式。
- 新增或修改功能时，优先补充自动化测试；无法补充时需在 PR 中写明原因与替代验证步骤。
- 所有测试结果必须在 PR 描述中透明披露：通过项、失败项、无法执行项及原因。
- 禁止跳过关键检查直接合并；若受环境限制无法执行，需标注阻塞项并给出后续执行计划。

## PR 提交规范

- PR 标题必须使用 Conventional Commits：`type(scope): description`。
- PR 描述第一行必须是 Issue 关闭语句：`Closes #<issue_number>`。
- PR 描述必须包含独立一行 `ROADMAP Ref: <ID>`（如 `ROADMAP Ref: INFRA` 或 `ROADMAP Ref: R-P2-01`）。
  - **必须是独立一行**，不能嵌在其他文字中（如 ❌ `...for monitoring; ROADMAP Ref: INFRA.`）
  - CI 正则：`/^ROADMAP Ref:\s*(R-P\d+-\d+|HOTFIX|INFRA)\s*$/im`，不匹配则 PR 被拒
- PR body 标准格式：
  ```
  Closes #<issue_number>

  ### Motivation
  <变更摘要>

  ROADMAP Ref: INFRA
  ```
- PR 必须指派至少 1 名 Assignee（Codex 任务默认指派发起任务的 CTO/Owner）。
- PR 描述建议包含：变更摘要、影响范围、测试结果、风险与回滚方案、待办事项。
- 提交前必须自检：分支命名合规、提交信息合规、CI 门禁要求齐全（Issue 标签/Project 字段/审批标签）。
