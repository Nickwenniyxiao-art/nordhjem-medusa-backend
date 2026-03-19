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

## 5. Approval Flow

### Standard Changes (features, fixes, refactors)
```
Codex/Worker PR → Domain Lead review → Domain Lead merge
```

### Cross-Domain Changes (affects multiple systems)
```
Codex/Worker PR → Domain Lead review → CTO review → Domain Lead merge
```

### Architecture Changes (new patterns, technology, breaking changes)
```
Codex/Worker PR → Domain Lead review → CTO approval required → merge
```

### Releases (develop → main)
```
QA sign-off → CTO approval → Owner notification → merge
```

### Infrastructure / VPS Changes
```
DevOps Lead proposes → CTO approval → Owner approval → execute via CI/CD only
```

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
