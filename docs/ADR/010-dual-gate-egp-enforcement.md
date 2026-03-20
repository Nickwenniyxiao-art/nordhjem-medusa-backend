# ADR-010: 双层门禁 EGP 执行强制体系

## 状态

已采纳

## 日期

2026-03-19

## 背景

随着 EGP（Execution Guarantee Protocol）逐步落地，NordHjem 已经能够在 PR 层面追踪 ROADMAP、Issue、Action 与 CI 门禁。但在 GitHub 实际操作层面，仍然存在一个空档：

1. **本地写操作缺少前置拦截**：AI Agent 可以在本地直接执行 `gh issue create`、`gh pr create`、`gh issue edit` 等写命令，若仅依赖后续 CI 检查，违规操作已经发生，只是最终无法合并。
2. **AI 决策链条不完整**：即使 PR 最终被 Branch Protection 拦截，也无法保证每一次 GitHub 写操作在发生前都绑定了明确的 AI 决策 Issue。
3. **审计证据分散**：Issue、PR、CI Check 各自保留了部分证据，但缺少一个“写操作发生前”与“代码进入分支前”的双重约束闭环。
4. **纯服务端门禁不足以约束过程**：`pr-compliance-fix` 与 `check-pr-metadata` 能阻止不合规 PR merge，但不能阻止 AI 在本地发起不带决策依据的 GitHub 写操作。

因此，需要一个同时覆盖**本地执行前**和 **GitHub 服务端 merge 前**的双层门禁体系，把 AI 决策追踪从“事后检查”升级为“事前拦截 + 事后强制”。

## 方案对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| 方案 A: 仅本地 Hook | 违规命令能在执行前被拦截，反馈快 | 只能约束安装了 Hook 的环境，无法作为最终 merge 保证 |
| 方案 B: 仅 GitHub Branch Protection | 服务端强制，规则集中管理 | 违规操作已经发生，无法保证每次 GitHub 写操作都先创建 AI 决策记录 |
| 方案 C: 双层门禁（本地 Hook + GitHub 服务端） | 同时覆盖“写操作前”和“合并前”，形成完整审计闭环 | 使用成本更高，所有 GitHub 写操作前都必须先准备 Issue |

## 决策

选择 **方案 C：双层门禁**。

具体设计如下：

### Layer 1 — Claude Code PreToolUse 本地前置门禁

在 `~/.claude/hooks/gh-issue-gate.py` 中拦截所有 `gh` 写操作：

- 允许只读命令继续执行
- 对 `gh issue create`、`gh issue edit`、`gh pr create`、`gh pr edit`、`gh pr merge` 等写命令进行检查
- 若命令中没有 `# AI-Decision: #NNN` 注释，则直接阻断执行
- 要求操作者先创建并引用一个 `ai-decision` Issue，作为本次 GitHub 写操作的授权与审计依据

这一层解决的是“**操作发生前**”的问题：没有决策记录，就不能执行写命令。

### Layer 2 — GitHub Branch Protection 服务端物理门禁

在 `develop` 分支启用 required status checks：

- `pr-compliance-fix`
- `check-pr-metadata`

这一层解决的是“**代码进入受保护分支前**”的问题：

- PR 标题、Body、Issue 关联、ROADMAP Ref、Assignee 等元数据必须满足要求
- 即使本地环境绕过了 Hook，服务端仍会阻止不合规 PR merge
- merge gate 成为最终的、不可绕过的物理收口点

### 为什么必须两层同时存在

双层门禁分别约束不同风险面：

1. **本地 Hook** 负责保证每一个 GitHub 写动作都有前置决策依据
2. **Branch Protection** 负责保证最终进入 `develop` 的 PR 元数据与治理要求完全合规
3. 两层配合后，审计链条变成：

```
AI Decision Issue → 本地 gh 写操作 → PR 元数据校验 → Branch Protection merge gate
```

这使 EGP 不再只约束“代码变更”，而是开始约束“GitHub 治理动作”本身。

## 后果

### 正面影响

- 所有 GitHub 写操作都能追溯到一个明确的 AI 决策 Issue
- 审计链从“PR 是否合规”扩展到“操作为什么发生、由谁授权、何时执行”
- 本地 Hook 提供即时反馈，减少把错误元数据推送到远端后再返工
- Branch Protection 继续充当最终物理门禁，避免单点失效
- ADR-009 的 CI Gate 与 ADR-011 的 EGP 在执行层面被真正串成闭环

### 负面影响 / 需关注的风险

- 所有 GitHub 写操作前都必须先创建/引用一个 Issue，流程成本上升
- Hook 需要在每个 AI 执行环境中正确安装；若环境缺失，只能依赖服务端兜底
- 开发者需要学习 `# AI-Decision: #NNN` 的使用习惯，否则会频繁触发本地阻断
- 若 Hook 规则与 GitHub 服务端规则漂移，需要定期校准，避免“本地放行、服务端拒绝”或反之

## 替代方案

### 替代方案 1：仅保留单层门禁

- **仅本地 Hook**：可以做到前置拦截，但无法保证所有环境都安装，也无法替代 GitHub 的最终 merge gate。
- **仅 Branch Protection**：可以阻止不合规 PR 合并，但无法阻止无决策依据的 GitHub 写操作已经发生。

结论：单层门禁只能覆盖风险的一部分，不能形成完整闭环。

### 替代方案 2：仅靠人工纪律

要求 AI 或开发者手动遵守“先开 Issue、再写 GitHub”的约定，理论上成本最低。

但这一方案存在明显问题：

- 缺乏自动化校验，容易在高压或批量操作时失误
- 审计依赖人工自觉，无法形成稳定、可验证的执行标准
- 与 EGP “可追溯、可校验、可审计”的核心目标冲突

因此不采纳。

## 关联 ADR

- **ADR-009**: CI Gate v2 — Bot 账号自动审批方案
- **ADR-011**: 原子化执行保障体系（EGP）
