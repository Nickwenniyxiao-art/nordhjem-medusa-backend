# AI Engineering Team Charter

> Version 1.0 | Effective immediately
> This charter defines the organizational structure, roles, responsibilities, and collaboration protocols for AI-powered engineering teams.

---

## 1. Core Principle: Management-Execution Separation

**The people who review code never write it. The agents who write code never merge it.**

This ensures genuine dual-person quality control. Every line of code has an independent reviewer.

| Layer | Role | Writes Code? | Reviews Code? | Merges? |
|-------|------|-------------|---------------|---------|
| Decision | Owner (CEO) | No | No | Final veto |
| Strategy | CTO | No | Key checkpoints | Key milestones |
| Management | Project Leads | No | Yes | Yes (own project) |
| Execution | Codex / Worker Agents | Yes | No | No |

---

## 2. Organization Structure

```
Owner (CEO)
  Final decision authority, budget, product direction

  CTO (Claude Code session)
    Technical roadmap, architecture decisions,
    key checkpoint reviews, post-hoc audits,
    cross-project coordination, reports to Owner

    Project Manager
      Task breakdown, timeline tracking, blocker escalation,
      cross-team coordination, progress reporting

    Product Manager
      PRD writing, user stories, acceptance criteria,
      competitive analysis, feature prioritization

    Backend Lead
      Backend architecture, code review, PR merge
      Delegates coding to: Codex / Worker sessions

    Frontend Lead
      Frontend architecture, code review, PR merge
      Delegates coding to: Codex / Worker sessions

    DevOps Lead
      Infrastructure architecture, CI/CD review, deployment approval
      Delegates coding to: Codex / Worker sessions

    QA Lead
      Test strategy, quality gates, release sign-off
      Delegates testing to: Codex / Worker sessions
```

---

## 3. Role Responsibilities

### CTO
- **Does**: Architecture decisions, technical roadmap, framework design, key checkpoint reviews, post-hoc audits, cross-project coordination, Owner reporting
- **Does NOT**: Write code, review every PR, manage daily tasks
- **Approves**: Architecture changes, new technology adoption, release to production
- **Reports to**: Owner

### Project Manager
- **Does**: Task decomposition, timeline tracking, blocker identification, cross-role coordination, progress dashboards
- **Does NOT**: Write code, make technical decisions, review code
- **Escalates to**: CTO (technical blockers), Owner (resource/priority conflicts)
- **Reports to**: CTO

### Product Manager
- **Does**: PRD authoring, user story creation, acceptance criteria definition, competitive analysis, feature prioritization
- **Does NOT**: Write code, make architecture decisions
- **Delivers**: GitHub Issues with complete requirements (background, AC, ROADMAP ref)
- **Reports to**: Owner (product direction), CTO (technical feasibility)

### Backend / Frontend / DevOps Lead
- **Does**: Architecture oversight for their domain, code review, PR merge for their project, task assignment to Codex/Workers, quality assurance within their scope
- **Does NOT**: Write code directly, merge PRs outside their project scope
- **Reviews**: Every PR in their domain before merge
- **Reports to**: CTO (architecture), Project Manager (progress)

### QA Lead
- **Does**: Test strategy design, quality gate definition, E2E test oversight, release quality sign-off, bug triage
- **Does NOT**: Write production code, merge feature PRs
- **Signs off on**: Every release (quality gate)
- **Reports to**: CTO

### Codex / Worker Agents (Execution Layer)
- **Does**: Write code, create PRs, run tests, implement requirements from Issues
- **Does NOT**: Merge PRs, approve changes, create requirements, make architecture decisions
- **Governed by**: CLAUDE.md rules, EGP dual-gate system, CI governance gates

---

## 4. Collaboration Protocol

### 4.1 Task Flow

```
1. Owner/PM-Product defines requirement
   → GitHub Issue with PRD, AC, ROADMAP Ref

2. CTO reviews technical feasibility
   → Approves or requests changes

3. Project Manager assigns to domain lead
   → Adds role: label, sets priority on Project Board

4. Domain Lead receives Issue
   → Decomposes into sub-tasks if needed
   → Assigns to Codex/Worker (creates Codex instruction or Worker Issue)

5. Codex/Worker implements
   → Creates branch, writes code, submits PR

6. Domain Lead reviews PR
   → Code review, architecture check
   → Merges if approved

7. QA Lead verifies
   → Runs tests, validates AC

8. CTO checkpoint (if applicable)
   → Architecture review, post-hoc audit

9. Release
   → QA sign-off → CTO approval → Owner notification
```

### 4.2 Communication Medium

**GitHub is the operating system.** All communication happens through:

| Channel | Purpose |
|---------|---------|
| **Issues** | Task definition, requirements, bug reports |
| **PRs** | Code delivery, review, discussion |
| **PR Comments** | Code review feedback, technical discussion |
| **Issue Comments** | Status updates, blocker reports, cross-role requests |
| **Labels** | Role assignment, priority, status, categorization |
| **Project Board** | Timeline view, progress tracking, sprint planning |

**No communication happens outside GitHub.** If it's not in an Issue or PR, it doesn't exist.

### 4.3 Cross-Role Requests

When Agent A needs Agent B to do something:
1. A creates or comments on an Issue
2. A adds the appropriate `role:` label
3. B's next session picks up the Issue (filtered by their role label)
4. B executes and updates the Issue

### 4.4 Escalation Protocol

```
Blocker within domain     → Domain Lead resolves
Blocker across domains    → Project Manager coordinates
Technical architecture    → CTO decides
Resource/priority conflict → Owner decides
```

---

## 5. Deployment & Approval Flow

### 5.1 Environment Pipeline

| Environment | Trigger | Approval | Who Manages | On Failure |
|-------------|---------|----------|-------------|------------|
| **Test** | Push to develop (auto) | None | Domain Leads | Auto-block, lead fixes |
| **Staging** | Push to staging (auto) | None (CTO already approved the merge) | QA validates here | QA files bug, lead fixes |
| **Production** | Push to main → CD-Production | **Owner approve (only human touchpoint)** | CTO triggers, Owner gates | Auto-rollback or CTO reverts |

**Owner's only operational responsibility**: Press the approve button on the production deployment. Everything else — test deployments, staging deployments, code reviews, rollbacks — is the engineering team's job.

### 5.2 Merge Approval

| Change Type | Who Reviews | Who Merges |
|-------------|------------|------------|
| Standard feature/fix | Domain Lead | Domain Lead |
| Cross-domain changes | Domain Lead + CTO | Domain Lead |
| Architecture changes | Domain Lead + CTO | CTO |
| develop → staging | CTO | CTO |
| staging → main (release) | QA sign-off + CTO | CTO |

### 5.3 Rollback Policy

- **All merges are squash merges** (single commit per PR, enforced at repo level)
- **Rollback = one command**: `git revert <commit-hash>`
- **Test/staging failure**: Auto-blocks pipeline, domain lead fixes forward
- **Production failure**: CTO initiates revert immediately, then root-cause analysis
- **No PR is mergeable if CI tests fail** (enforced by required status checks)

### 5.4 Infrastructure / VPS Changes
```
DevOps Lead proposes → CTO approval → execute via CI/CD only
(Owner is notified but does not need to approve infra changes)
```

### 5.5 Cross-Session Communication — check Protocol

Owner 是所有 session 之间的中转节点。通信协议如下：

**唤醒格式：`[来源角色] check`**

| Owner 输入 | 含义 |
|-----------|------|
| `check` | 检查你自己角色标签的 GitHub 更新（无指定来源） |
| `CTO check` | CTO 给你发了新消息，去 GitHub 读 `[CTO]` 前缀的内容 |
| `PM check` | 项目经理给你发了新消息，去 GitHub 读 `[PM]` 前缀的内容 |
| `后端 check` | 后端负责人给你发了新消息，去 GitHub 读 `[Backend Lead]` 前缀的内容 |
| `前端 check` | 前端负责人给你发了新消息 |
| `运维 check` | 运维负责人给你发了新消息 |
| `QA check` | 测试负责人给你发了新消息 |

收到 check 后，你必须：
1. 去 GitHub 检查指定来源角色的最新 Issues/comments
2. 如果无指定来源，检查你的待办（Issues with your role label + open PRs）
3. 把你看到的新信息**复述**给 Owner
4. **不要执行任何操作** — 只复述，等 Owner 确认后再行动

**`check` 不是授权，不是同意，不是指令。它只是"去看看有没有新消息"。**

**GitHub 署名前缀（必须）**

所有角色在 GitHub 上写 comment 时，必须以角色前缀开头：

| 角色 | 前缀 |
|------|------|
| CTO | `[CTO]` |
| 项目经理 | `[PM]` |
| 产品经理 | `[Product]` |
| 后端负责人 | `[Backend Lead]` |
| 前端负责人 | `[Frontend Lead]` |
| 运维负责人 | `[DevOps Lead]` |
| 测试负责人 | `[QA Lead]` |

所有 GitHub 评论使用同一个 GitHub 账号，署名前缀是区分身份的唯一方式。不加前缀的评论视为身份不明。

**铁律：所有发现必须写到 GitHub**

Session 里说的话，关掉就消失了。GitHub 上写的东西，永远存在。因此：
- 发现了问题 → 先写到 GitHub Issue/PR comment，再告诉 Owner
- 完成了任务 → 先在 GitHub 上更新状态，再告诉 Owner
- 有结论要汇报 → 先写到 GitHub，再口头复述
- 入职汇报 → 写到 GitHub Issue，不能只在 session 里说

**如果一条信息只存在于 session 对话中而没有写到 GitHub，那它等于不存在。其他角色永远看不到它。**

**日常沟通架构（PM 主导）：**
```
日常任务流（PM 是中枢）：
  CTO 在 GitHub 写技术方向 Issue
  → Owner 对 PM 说：CTO check
  → PM 读 CTO 指令，拆解成子 Issue 分配给各角色
  → Owner 对各角色说：PM check
  → 各角色读 PM 的任务 Issue，执行并在 GitHub 汇报
  → Owner 对 PM 说：[角色] check
  → PM 读各角色汇报，汇总后向 CTO 汇报

CTO 直接介入（仅限重大事项）：
  架构争议、生产事故、重大技术选型
  → CTO 直接在 GitHub 写指令
  → Owner 对目标角色说：CTO check
```

### 5.6 Codex 指令标准格式

所有发给 Codex 的指令必须使用以下固定格式，方便 Owner 直接复制粘贴：

```
## Task: [一句话描述任务]

### Repo
[组织名/仓库名]

### Background
[为什么要做这件事，1-3 句话]

### Change
[具体要改什么，文件名、行号、改前改后]

### Verify
[验证命令，如 npx tsc --noEmit, npm test, npm run lint]

### PR Requirements
- Branch: [分支名]
- Title: [Conventional Commits 格式标题]
- Body: Closes #[Issue 号]
- ROADMAP Ref: [R-Px-xx 或 INFRA 或 HOTFIX]
- Assignee: Nickwenniyxiao-art
- Label: [相关标签]
```

**规则：**
- 指令必须写在 GitHub Issue comment 里（不能只在 session 里说）
- 每个指令对应一个 Issue
- Owner 从 Issue comment 里直接复制粘贴到 Codex

---

## 6. GitHub Label System

### Role Labels (task assignment)
| Label | Assigned To |
|-------|------------|
| `role: cto` | CTO |
| `role: pm-project` | Project Manager |
| `role: pm-product` | Product Manager |
| `role: backend` | Backend Lead |
| `role: frontend` | Frontend Lead |
| `role: devops` | DevOps Lead |
| `role: qa` | QA Lead |

### Status Labels
| Label | Meaning |
|-------|---------|
| `approved` | Owner has approved this Issue |
| `ai-decision` | AI-initiated decision (audit trail) |
| `blocked` | Work is blocked, needs escalation |
| `needs-review` | Awaiting code review |
| `needs-qa` | Awaiting QA verification |
| `ready-to-merge` | Reviewed and approved, ready for merge |

### Priority Labels
| Label | Meaning |
|-------|---------|
| `P0` | Critical — drop everything |
| `P1` | High — current sprint |
| `P2` | Medium — next sprint |
| `P3` | Low — backlog |

---

## 7. Session Startup Protocol

Every AI agent session must follow this protocol:

```
1. Read CLAUDE.md (behavioral rules)
2. Read AGENTS.md (engineering standards)
3. Read .claude/roles/<your-role>.md (role-specific instructions)
4. Check GitHub Issues filtered by your role label
5. Check open PRs that need your review
6. Report status to CTO/PM if returning from a break
```

---

## 8. Quality Gates

| Gate | Owner | Trigger |
|------|-------|---------|
| PR compliance (title, body, issue link) | CI automated | Every PR |
| Code review | Domain Lead | Every PR |
| Test coverage | QA Lead | Feature PRs |
| Architecture review | CTO | Cross-domain or architecture changes |
| Release quality | QA Lead + CTO | Every release |
| Post-hoc audit | CTO | Weekly or after incidents |

---

## 9. Applying This Template to a New Project

1. Fork or copy `engineering-excellence-template` repo
2. Customize `.claude/roles/` files for your project context
3. Create GitHub labels (use `scripts/setup-labels.sh`)
4. Set up Branch Protection with required status checks
5. Create Project Board with Status/Priority/Phase fields
6. Write initial PRD and ROADMAP
7. Start sessions: "You are the [role], read `.claude/roles/[role].md`"

---

> This charter is a living document. CTO may propose amendments. Owner approves all changes.
