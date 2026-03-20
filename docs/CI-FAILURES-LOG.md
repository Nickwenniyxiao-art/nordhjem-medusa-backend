# CI Failures Log

> 项目: NordHjem (Backend + Frontend)
> 创建日期: 2026-03-19
> 维护人: CTO / AI Engineer
> 关联文档: [CI-HEALTH.md](./CI-HEALTH.md), [ENGINEERING-PLAYBOOK.md](./ENGINEERING-PLAYBOOK.md)

---

## 目的

记录所有 GitHub Actions CI/CD 失败事件的根本原因、修复方案和经验教训，供团队回顾学习。
**原则：每次红叉都必须有原因记录；修复后标注 ✅ 已修复。**

---

## 格式说明

| 字段 | 说明 |
|------|------|
| **ID** | CI-YYYY-MM-DD-NNN 格式 |
| **Repo** | backend / frontend |
| **Workflow** | 工作流文件名 |
| **触发场景** | 在哪个 PR / branch / 什么操作下失败 |
| **根本原因** | 技术根因 |
| **修复方案** | 做了什么 |
| **状态** | ✅ 已修复 / ⏳ 进行中 / ❌ 关闭（不修复） |
| **经验教训** | 避免下次再犯 |

---

## 2026-03 故障记录

---

### CI-2026-03-19-001

| 字段 | 内容 |
|------|------|
| **ID** | CI-2026-03-19-001 |
| **Repo** | Backend |
| **Workflow** | `security-audit.yml` |
| **触发场景** | PR #617, #618, #621, #624 — npm ci 步骤超时 |
| **状态** | ✅ 已修复 |

**根本原因**
`timeout-minutes: 10`（默认）不足以在冷 runner 上完成 `npm ci`（约 2000+ 依赖包）。冷 runner 无缓存，网络慢时安装耗时超过 15 分钟导致 job 被 GitHub 强制中断。

**修复方案**
1. 将 `timeout-minutes` 从 10 改为 20。
2. 追加 `npm ci --legacy-peer-deps --maxsockets=2 --network-timeout=120000` 限制并发 socket 数，避免因并发过高被限速。

```yaml
# .github/workflows/security-audit.yml
timeout-minutes: 20
run: npm ci --legacy-peer-deps --maxsockets=2 --network-timeout=120000
```

**经验教训**
- 大型 Node.js 项目的 `npm ci` 默认超时 10 分钟太短，初始化项目时就应设置 ≥20min。
- `--maxsockets=2` 在 GitHub hosted runner 上能有效降低网络抖动引起的超时。
- 若后续引入 caching（`actions/cache`），可将超时缩回 10min。

---

### CI-2026-03-19-002

| 字段 | 内容 |
|------|------|
| **ID** | CI-2026-03-19-002 |
| **Repo** | Backend |
| **Workflow** | `trivy.yml` (container scan) |
| **触发场景** | PR #618 (`feat/sentry-sbom-devcontainer`) — Trivy 扫描报 13 个 HIGH/CRITICAL CVE |
| **状态** | ✅ 已修复 |

**根本原因**
PR #618 新增 Dockerfile 构建容器镜像，首次触发 Trivy 容器扫描。发现三类 CVE：
1. **应用层**：`fast-xml-parser@5.4.1` → CVE-2026-33036（HIGH，ReDoS）
2. **OS层**：Alpine `zlib@1.3.1-r2` → CVE-2026-22184（HIGH）
3. **npm CLI 内置模块**（`/usr/local/lib/node_modules/npm/**`）：`cross-spawn`, `glob`, `minimatch`, `tar` 多个 CVE — 这些是 npm 自带的工具包，**不在应用攻击面内**

**修复方案**

1. `package.json` 添加 overrides 强制升级 `fast-xml-parser`：
```json
"overrides": {
  "fast-xml-parser": ">=5.5.6"
}
```

2. `Dockerfile` 添加 OS 层升级修复 zlib：
```dockerfile
RUN apk add --no-cache python3 make g++ curl && \
    apk upgrade --no-cache zlib
```

3. 创建 `.trivyignore` 屏蔽 npm CLI 内置模块 CVE，并附注释说明原因：
```
# CVEs in npm's internally bundled modules (usr/local/lib/node_modules/npm/**)
# These are npm's own tool dependencies, not part of the application runtime.
# They are not reachable from the app's attack surface.
CVE-2024-21538  # cross-spawn in npm internals
CVE-2025-64756  # glob in npm internals
CVE-2026-26996  # minimatch in npm internals
CVE-2026-27903
CVE-2026-27904
CVE-2026-23745  # tar in npm internals
CVE-2026-23950
CVE-2026-24842
CVE-2026-26960
CVE-2026-29786
```

**经验教训**
- 新增 Dockerfile 时，Trivy 扫描会同时检查 OS 层和应用层 — 确保 Dockerfile 有 `apk upgrade` 步骤。
- npm CLI 内置模块的 CVE 无法通过 `overrides` 修复（属于 npm 工具本身，不是项目依赖），需通过 `.trivyignore` 标注接受风险。
- `.trivyignore` 中每条 CVE 必须写注释说明原因，方便安全审计时核实。
- 每次 Node.js 基础镜像升级后，需重新评估 `.trivyignore` 中的 CVE 是否已在新版本中修复（可移除）。

---

### CI-2026-03-19-003

| 字段 | 内容 |
|------|------|
| **ID** | CI-2026-03-19-003 |
| **Repo** | Backend |
| **Workflow** | `deploy-ops-scripts.yml` |
| **触发场景** | PR #617, #618 — feature branch 推送触发 deploy，尝试访问 production 环境 secret |
| **状态** | ✅ 已修复 |

**根本原因**
工作流 `on: push: branches: [main]` 的 `branches` 过滤器限制的是触发来源分支，但当工作流文件**首次出现在某个 branch 上**（即该文件在该 branch 是新增的）时，GitHub 会对该 branch 上的所有后续 push 都触发该工作流，无视 `branches` 过滤器。
PR #617 和 #618 的 branch 上首次新增了该文件，导致每次 push 都触发 deploy job，而 feature branch 没有 production secret access 权限，导致失败。

**修复方案**
在 `deploy` job 级别加 `if` guard，双重保险：

```yaml
jobs:
  deploy:
    name: 🚀 Deploy ops scripts → VPS1
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
```

**经验教训**
- `on: push: branches: [main]` **只是事件过滤器**，不能完全阻止 feature branch 触发（新增文件场景）。
- 任何涉及 production 部署、secret 访问的 job，**必须同时加 `if: github.ref == 'refs/heads/main'` job guard**，形成双重保险。
- 这是 GitHub Actions 的已知行为，所有 deploy 类 workflow 从创建起就应该加此 guard。

---

### CI-2026-03-19-004

| 字段 | 内容 |
|------|------|
| **ID** | CI-2026-03-19-004 |
| **Repo** | Backend |
| **Workflow** | `pr-automation.yml` (main 分支) |
| **触发场景** | main 分支上反复失败，`Auto-merge PRs` job 报错 `gh pr merge ""` |
| **状态** | ✅ 已修复 |

**根本原因**
`pr-automation.yml` 在 main 分支上配置了 `check_suite` 触发器。每当任何 check suite 完成都会触发该 workflow，但此时 `github.event.pull_request.number` 为空（`check_suite` 事件没有 PR 上下文），导致执行 `gh pr merge ""` 命令失败。

**修复方案**
重写 `pr-automation.yml`，**移除 `check_suite` 触发器**，只保留 `pull_request` 事件；同时将 auto-merge 和 compliance-fix 拆分为独立 job，各自用 `if` 控制触发时机：

```yaml
on:
  pull_request:
    types: [opened, synchronize, review_requested]
    branches: [develop]

jobs:
  auto-merge:
    if: github.event.action == 'review_requested'
    ...
  pr-compliance-fix:
    if: github.event.action == 'opened' || github.event.action == 'synchronize'
    ...
```

同时在 `gh pr merge` 命令后加 `|| echo "⚠️ skipping"` 避免非零退出码导致 job 失败。

**经验教训**
- `check_suite` 是全局事件，不携带 PR 上下文，**不应用于需要 PR number 的 workflow**。
- Auto-merge 逻辑应绑定到 `pull_request: review_requested` 事件，而不是 check suite 完成事件。
- `gh pr merge` 在 auto-merge 不可用时会返回非零退出码，务必加 `|| true` 或 `|| echo "skipping"` 处理。

---

### CI-2026-03-19-005

| 字段 | 内容 |
|------|------|
| **ID** | CI-2026-03-19-005 |
| **Repo** | Backend |
| **Workflow** | `pr-compliance-fix.yml` / `pr-automation.yml` |
| **触发场景** | PR #624 — `TypeError: github.getOctokit is not a function` |
| **状态** | ✅ 已修复 |

**根本原因**
代码中使用了 `github.getOctokit(botPat)`，但在 `actions/github-script` 中，`github` 对象是 REST API 客户端（`@octokit/rest` 实例），**不是** `@actions/github` 模块本身，没有 `getOctokit` 方法。

**修复方案**
正确写法：通过 `require` 引入 `@actions/github` 模块再调用 `getOctokit`：

```javascript
// ❌ 错误写法
const botGithub = github.getOctokit(botPat);

// ✅ 正确写法
const { getOctokit } = require('@actions/github');
const botGithub = getOctokit(botPat);
```

**经验教训**
- 在 `github-script` 中，`github` = REST client，`context` = 事件上下文，`core` = `@actions/core`。
- 需要用不同 token（如 bot PAT）创建新客户端时，必须 `require('@actions/github').getOctokit(token)`。
- 这是一个高频错误，所有需要 bot PAT 的 workflow 都要注意。

---

### CI-2026-03-19-006

| 字段 | 内容 |
|------|------|
| **ID** | CI-2026-03-19-006 |
| **Repo** | Backend |
| **Workflow** | `check-pr-metadata.yml` |
| **触发场景** | PR #624 — `actions/github-script@v8` API 不兼容 |
| **状态** | ✅ 已修复 |

**根本原因**
`check-pr-metadata.yml` 引用了 `actions/github-script@v8`。v8 移除了部分 API（包括 `getOctokit` 的导出方式有变化），与项目其他 workflow 使用的 v7 不一致，导致脚本执行失败。

**修复方案**
统一降回 `actions/github-script@v7`：

```yaml
uses: actions/github-script@v7  # 从 @v8 改回 @v7
```

**经验教训**
- 项目内所有 `github-script` 引用应保持**同一版本**，避免不同 job 行为不一致。
- 升级 `github-script` 版本时需全局搜索替换并在沙箱 PR 中验证。

---

### CI-2026-03-19-007

| 字段 | 内容 |
|------|------|
| **ID** | CI-2026-03-19-007 |
| **Repo** | Frontend |
| **Workflow** | `playwright-monitor.yml` (main 分支) |
| **触发场景** | Cron `0 */2 * * *` 每两小时自动触发，持续失败并发 Telegram 告警 |
| **状态** | ✅ 已关闭（workflow disabled） |

**根本原因**
两个问题叠加：
1. **Playwright strict mode 违反**：`page.getByTestId('product-title')` 匹配到 9 个元素（严格模式要求精确匹配 1 个），抛出 `strict mode violation` 错误。
2. **`add-product-button` 点击超时**：selector 存在但按钮状态或加载时序不对，10 秒超时内未响应。
此 workflow 在 main 分支配置了 cron，develop 分支已改为 `workflow_dispatch` 仅手动触发。

**修复方案**
1. **立即措施**：`gh workflow disable "Playwright Site Monitor"` 停止 main 分支的定时运行。
2. **代码修复**（develop 分支 `e2e-monitor/tests/03-product-detail.spec.ts`）：所有多元素 selector 后加 `.first()`：
```typescript
// ❌ 修复前
return productContainer.getByTestId('product-title')
// ✅ 修复后
return productContainer.getByTestId('product-title').first()
```

**经验教训**
- Playwright 严格模式下，所有 locator 必须确保唯一匹配或显式使用 `.first()` / `.nth(n)`。
- 定期运行的 E2E 监控脚本**必须有 Telegram 静音机制**（如告警频率限制），避免 cron 失败刷屏。
- Main 分支上的 workflow 修改需要特别谨慎，应优先在 develop 验证后通过 PR 合入。

---

### CI-2026-03-19-008

| 字段 | 内容 |
|------|------|
| **ID** | CI-2026-03-19-008 |
| **Repo** | Frontend |
| **Workflow** | `cd-test.yml` |
| **触发场景** | PR #211, #214 — deploy-test job 因 VPS 测试环境未完全配置而失败 |
| **状态** | ✅ 已处理（设为 non-blocking） |

**根本原因**
`deploy-test` 和 `e2e-test` job 连接 VPS 测试环境，但测试环境尚未完成完整配置（pending），导致部署步骤失败，阻塞 PR 合并。

**修复方案**
对相关 job 添加 `continue-on-error: true`，标注原因注释，设为非阻塞：

```yaml
deploy-test:
  continue-on-error: true  # VPS test env pending full setup — non-blocking
e2e-test:
  continue-on-error: true  # VPS test env pending full setup — non-blocking
```

**经验教训**
- 基础设施未就绪时，不应让 CI job 阻塞代码合并，应使用 `continue-on-error: true` + 注释说明。
- 测试环境就绪后应立即移除 `continue-on-error: true`，恢复为阻塞态。
- **后续行动**：VPS 测试环境配置完成后，移除此 flag（Backlog item）。

---

### CI-2026-03-19-009

| 字段 | 内容 |
|------|------|
| **ID** | CI-2026-03-19-009 |
| **Repo** | Frontend |
| **Workflow** | Dependabot PR — `vite@8.0.0` |
| **触发场景** | Dependabot 自动创建 PR #146，将 vite 5→8（major 升级），所有 CI 红 |
| **状态** | ✅ 已关闭（PR closed，不接受此升级） |

**根本原因**
Vite 5→8 是 major 版本升级，存在 breaking changes。esbuild peer dependency 版本不兼容：lock 文件中 `esbuild@0.21.5`，vite@8 需要 `@0.27.4`，导致安装失败、所有构建/测试 CI 崩溃。

**修复方案**
关闭 PR #146，注释说明原因。Major 版本升级需手动评估，按正常 RFC/Sprint 流程处理。

**经验教训**
- Dependabot 的 major 版本 PR **不应自动合并**，必须手动审查。
- 应在 `dependabot.yml` 中配置 `ignore` 规则，阻止 Dependabot 自动为 major 版本升级创建 PR：
```yaml
ignore:
  - dependency-name: "vite"
    update-types: ["version-update:semver-major"]
```
- **后续行动**：将 vite 5→8 升级计入 Backlog，单独一个 Sprint task 处理。

---

### CI-2026-03-19-010

| 字段 | 内容 |
|------|------|
| **ID** | CI-2026-03-19-010 |
| **Repo** | Backend |
| **Workflow** | `auto-merge.yml` (DEPRECATED) |
| **触发场景** | 每个 PR 到 develop 都会触发，功能与 `pr-automation.yml` 重复 |
| **状态** | ✅ 已删除 |

**根本原因**
`auto-merge.yml` 是旧版独立 auto-merge workflow，已被整合进 `pr-automation.yml`（2026-03-17 标记为 DEPRECATED）。继续保留导致重复执行，产生多余的 workflow 运行记录。

**修复方案**
从 develop 分支删除 `.github/workflows/auto-merge.yml` 文件。

**经验教训**
- 标记 DEPRECATED 后应立即删除，不要留在 repo 中（即使不运行也会造成混乱）。
- Workflow 整合时，必须在同一个 commit 中删除旧文件，避免出现重复运行窗口期。

---

## 2026-03-20 故障记录

---

### CI-2026-03-20-001

| 字段 | 内容 |
|------|------|
| **ID** | CI-2026-03-20-001 |
| **Repo** | Backend |
| **Workflow** | 多个治理 checks（check-egp, check-project-board, check-roadmap-ref, pr-compliance-fix, registry-check, check-issue-labels, check-issue-approved, check-execution-protocol, check-pr-metadata, scope-validation） |
| **触发场景** | 所有 PR to develop — 治理 checks 级联失败，累计 52+ failed runs |
| **状态** | ⏳ 进行中（根因 #659 待修复） |

**根本原因**
`pr-compliance-fix.yml` 中使用 `require('@actions/github')` 但该模块在 `actions/github-script@v7` 运行环境中未正确加载（缺失依赖或版本不匹配）。当 `pr-compliance-fix` 失败时，它无法自动补全 PR 的 `Closes #NNN`、`ROADMAP Ref`、assignee 等 metadata，导致依赖这些 metadata 的下游治理 checks（check-egp, check-project-board, check-roadmap-ref 等）也级联失败。

**影响范围**
- 所有 PR to develop 的治理 checks 失败
- 必须使用 `--admin` merge 绕过 branch protection
- 积累了 52+ 个失败 workflow runs

**修复方案**
Issue #659 已创建，等待修复 `pr-compliance-fix.yml` 的依赖问题。修复后治理 checks 将恢复正常。

**经验教训**
- `pr-compliance-fix` 是多个治理 check 的上游依赖 — 它的失败会级联影响 5+ 个 downstream checks
- 治理 workflow 的可靠性应与核心 CI（build/test）同等对待
- 新增治理 workflow 时应在沙箱 PR 中验证完整链路

---

### CI-2026-03-20-002

| 字段 | 内容 |
|------|------|
| **ID** | CI-2026-03-20-002 |
| **Repo** | Backend |
| **Workflow** | `deploy-ops-scripts.yml` |
| **触发场景** | Feature branches（codex/*, docs/*, chore/*）push 时误触发，16 failed runs |
| **状态** | ✅ 已知问题（CI-2026-03-19-003 根因同源） |

**根本原因**
与 CI-2026-03-19-003 同源。新分支首次包含该 workflow 文件时，GitHub 忽略 `branches: [main]` 过滤器。虽然 job 级 `if: github.ref == 'refs/heads/main'` guard 已添加，但 workflow 仍会被触发（只是 job 被跳过或因无 secret 失败），产生 failed run 记录。

**修复方案**
已有 guard（CI-2026-03-19-003 修复），这些失败 runs 是历史残留，可安全删除。

---

### CI-2026-03-20-003

| 字段 | 内容 |
|------|------|
| **ID** | CI-2026-03-20-003 |
| **Repo** | Backend |
| **Workflow** | `PR Automation` |
| **触发场景** | main 分支 check_suite 事件持续触发，14 failed runs |
| **状态** | ✅ 已知问题（CI-2026-03-19-004 根因同源） |

**根本原因**
与 CI-2026-03-19-004 同源。`check_suite` 触发器在 main 分支上持续触发 PR Automation，但无 PR 上下文导致失败。虽然 PR #661 已修复 develop 分支的 workflow，但 main 分支尚未同步该修复。

**修复方案**
需要通过 staging → main 的正常 promote 流程将修复同步到 main。这些失败 runs 是历史残留，可安全删除。

---

## 2026-03-20 批量清理记录

| 分类 | 分支 | PR 状态 | 失败 runs | 根因 | 处置 |
|------|------|---------|-----------|------|------|
| A — 已合并分支 | chore/remove-unrelated-templates | #674 MERGED | 12 | CI-2026-03-20-001 治理 checks | 删除 |
| A — 已合并分支 | docs/update-claude-md-approval-rules | #677 MERGED | 7 | CI-2026-03-20-001 治理 checks | 删除 |
| A — 已合并分支 | docs/user-personas-competitive-analysis | #675 MERGED | 18 | CI-2026-03-20-001 治理 checks + deploy-ops-scripts | 删除 |
| A — 已合并分支 | codex/fix-pr-compliance-fix-workflow | #661 MERGED | 6 | CI-2026-03-20-001 治理 checks | 删除 |
| B — 已关闭 PR | codex/cherry-pick-pr-#667-to-pr-#621 | #669 CLOSED | 15 | Codex 自动修复失败 | 删除 |
| B — 已关闭 PR | codex/fix-pr-#621-review-issues | #667 CLOSED | 15 | Codex 自动修复失败 | 删除 |
| C — 活跃 PR | codex/rebase-pr-#621-onto-latest-develop | #672 OPEN | 9 | CI 构建失败 + 治理 checks | 保留 |
| D — main | main | — | 9 | CI-2026-03-20-002/003 | 删除 |
| D — develop | develop | — | 8 | CI-2026-03-20-001/003 | 删除 |

---

## 待解决问题（Open Items）

| ID | 描述 | 优先级 | 负责人 |
|----|------|--------|--------|
| OI-001 | VPS 测试环境配置完成后，移除 `cd-test.yml` 中的 `continue-on-error: true` | Medium | DevOps |
| OI-002 | Vite 5→8 major 升级评估（单独 Sprint task） | Low | Frontend |
| OI-003 | `dependabot.yml` 中配置 major 版本 ignore 规则 | Medium | 任意工程师 |
| OI-004 | 引入 `actions/cache` 缓存 npm ci，将 Security Audit 超时从 20min 缩回 10min | Low | 任意工程师 |
| OI-005 | 定期审查 `.trivyignore` — 每次 Node.js 基础镜像升级后检查是否可移除条目 | Medium | 安全负责人 |
| OI-006 | 修复 `pr-compliance-fix.yml` 依赖问题（#659），解除治理 checks 级联失败 | **P0** | DevOps |
| OI-007 | 将 `pr-automation.yml` 修复同步到 main（通过 staging → main promote） | Medium | DevOps |

---

## 经验总结（快速参考）

| # | 原则 | 背景 |
|---|------|------|
| 1 | **部署 job 必须加 `if: github.ref == 'refs/heads/main'` guard** | CI-2026-03-19-003 |
| 2 | **`timeout-minutes` 大型 npm 项目从初始就设 ≥20** | CI-2026-03-19-001 |
| 3 | **Bot PAT 要用 `require('@actions/github').getOctokit(token)`** | CI-2026-03-19-005 |
| 4 | **项目内 `github-script` 版本要统一（当前锁定 @v7）** | CI-2026-03-19-006 |
| 5 | **`check_suite` 触发器不携带 PR 上下文，不可用于 auto-merge** | CI-2026-03-19-004 |
| 6 | **Playwright locator 严格模式：多元素场景必须加 `.first()` 或 `.nth()`** | CI-2026-03-19-007 |
| 7 | **Dependabot major 版本 PR 不可自动合并** | CI-2026-03-19-009 |
| 8 | **`.trivyignore` 每条 CVE 必须写注释说明接受原因** | CI-2026-03-19-002 |
| 9 | **基础设施未就绪的 job 用 `continue-on-error: true` + 注释，而非删除** | CI-2026-03-19-008 |
| 10 | **DEPRECATED workflow 立即删除，不要留在 repo** | CI-2026-03-19-010 |
| 11 | **`pr-compliance-fix` 是治理 checks 上游依赖，其失败会级联 5+ downstream** | CI-2026-03-20-001 |
| 12 | **CI 失败清理前必须记录根因到本文件** | CTO 指令 2026-03-20 |

---

## 更新记录

| 日期 | 版本 | 变更 | 操作人 |
|------|------|------|--------|
| 2026-03-19 | v1.0 | 初始版本，记录 10 个 CI 故障事件（Backend + Frontend） | AI Engineer |
| 2026-03-20 | v1.1 | 新增 3 个故障记录（治理 checks 级联、deploy-ops-scripts 残留、PR Automation 残留），批量清理 91 个 failed runs | DevOps Lead |
