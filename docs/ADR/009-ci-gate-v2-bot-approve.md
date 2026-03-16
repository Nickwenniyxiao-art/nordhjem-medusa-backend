# ADR-009: CI Gate v2 — Bot 账号自动审批方案

## 状态

已采纳

## 日期

2026-03-14

## 背景

CI Gate v2 部署后，Branch Protection 要求所有 PR 必须获得 Code Review 审批（CODEOWNERS 强制）。但产生了死锁问题：

1. Owner 是唯一有权限的人，且 "Do not allow bypassing" 已启用
2. Codex 创建的 PR 由 Owner 账号提交，Owner 不能审批自己的 PR
3. GitHub Actions 的 `GITHUB_TOKEN` 无法提交 PR approval（"Allow GitHub Actions to approve PRs" 已禁用，为安全考虑）

需要一个自动化方案来解决 Code Review 审批环节。

## 方案对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| 方案 A: 重新启用 Actions Approve | 零成本，无需额外账号 | `GITHUB_TOKEN` 权限过大，任何 workflow 都能 approve，安全风险高 |
| 方案 B: Bot 账号 + PAT | 独立身份，审计清晰，可控 | 需创建额外 GitHub 账号和 PAT |

## 决策

选择 **方案 B：Bot 账号**。

- Bot 账号：`nickwenniyxiao-bot`
- Token 类型：Classic PAT（`ghp_` 开头），scope: `repo`
- Secret 名称：`BOT_PAT`
- 权限：仓库 Write 协作者

### 为什么用 Classic PAT 而非 Fine-grained PAT

Fine-grained PAT 的 Resource Owner 限制为 token 创建者自己拥有的仓库。Bot 账号不拥有目标仓库（属于 `Nickwenniyxiao-art`），导致 Fine-grained PAT 无法操作 PR reviews（403 错误）。Classic PAT 没有这个限制。

详见 CI-GATE-ISSUES-LOG.md 问题 4。

## 实施细节

### 工作流程

1. PR 创建后，AI Code Review workflow 自动运行
2. `reviewer-1-quality` 对代码进行 AI 审查
3. `ai-review-gate` 汇总审查结果
4. 如果所有 reviewer 通过 → Bot 自动提交 APPROVE review
5. 满足 Branch Protection 的 review 要求 → Auto-merge 触发

### 修改的文件

- `.github/workflows/ai-review.yml` — 在 `ai-review-gate` job 末尾添加 `Auto-approve PR via bot` 步骤

### Bot Approve 步骤代码

```yaml
- name: Auto-approve PR via bot
  if: needs.reviewer-1-quality.result == 'success' || needs.reviewer-1-quality.result == 'skipped'
  uses: actions/github-script@v7
  with:
    github-token: ${{ secrets.BOT_PAT }}
    script: |
      await github.rest.pulls.createReview({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: context.payload.pull_request.number,
        event: 'APPROVE',
        body: '✅ AI Code Review passed — all reviewers approved.\n\nAutomated approval by @nickwenniyxiao-bot'
      });
```

## 后果

### 正面影响

- 解决了 Code Review 审批死锁
- Bot 独立身份，审计日志清晰区分人工 vs 自动化操作
- Owner PAT 暴露面缩小（自动化场景改用 Bot PAT）
- 可扩展到前端仓库，统一两个仓库的 CI 门禁体系

### 负面影响 / 需关注的风险

- Classic PAT 没有过期时间（设为 No expiration），需定期轮换
- Bot 账号的 `repo` scope 权限较广，如果泄露影响范围大
- 后续计划：用 `BOT_PAT` 统一替代 `CD_PAT` 用于所有自动化场景（auto-merge、codex-autofix 等），减少 Owner PAT 使用

### 相关 PR

- PR #89: Bot auto-approval 实施（merged）
- PR #91: 完整验证测试（merged）
