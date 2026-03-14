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
| Env | Port | Container | Database |
|-----|------|-----------|----------|
| Test | 9001 | nordhjem_medusa_test | nordhjem_test |
| Staging | 9002 | nordhjem_medusa_staging | nordhjem_staging |
| Production | 9000 | nordhjem_medusa | nordhjem_production |

## Do NOT
- Hardcode environment-specific values (use env vars)
- Modify `.github/workflows/` without explicit instruction
- Change database schema without a migration
- Use `npm install` in CI (use `npm ci`)
- Commit `.env` files

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

### AI Issue 质量审查
- 每个 PR 关联的 Issue 会由 AI 进行质量评分（1-10 分）
- 评分结果以结构化 PR comment 形式保存
- 评分 ≥ 7 分自动添加 `ai-approved` label
- `ai-approved` 是 AI 审查标签，区别于 Owner 手动添加的 `approved` 标签
- CI Gate `check-issue-quality` 使用 OpenAI API，需要 `OPENAI_API_KEY`

---

> CI Gate v2 full pipeline verified: 2026-03-14T09:25:00Z
> CI Gate v2 remediation + new gates: 2026-03-14T09:40:00Z
> ROADMAP traceability: 2026-03-14
> Project Board gate + AI Issue quality review: 2026-03-14
