# ADR-008: 引入 Husky + commitlint

## 状态
已采纳

## 日期
2026-03-13

## 背景
NordHjem 项目中 Codex AI 是主要的代码提交者，生成的 commit message 格式多样，存在以下问题：

- 部分 commit message 不符合 [Conventional Commits](https://www.conventionalcommits.org/) 规范（如缺少 `type:`、大写开头、无意义描述）
- 不规范的 commit 导致自动生成 CHANGELOG 失败，语义化版本（semver）无法自动推断
- CI 中虽然可以校验 commit message，但失败后需要 force-push 重写历史，流程复杂
- 本地没有 pre-commit 检查，低质量代码（格式问题）需要等 CI 反馈，周期长

引入本地 Git Hook 工具可以将校验前移到"提交时"，在代码进入远端仓库前就拦截问题。

## 方案对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| 方案 A：只靠 CI 校验（commit-msg 在 GitHub Actions 中检查） | 无需本地配置；不影响开发者工具链 | 校验滞后（push 后才发现）；Codex 提交后需要 force-push 修复历史；CI 资源浪费 |
| 方案 B：Husky 本地 Hook + CI 双重校验 | 本地即时拦截，快速反馈；CI 作为兜底保障；Codex 可在提交前自动修正 | 需要在本地和 CI 环境都安装 Husky；`npx husky install` 需要在 `npm install` 后执行 |

## 决策
采用**方案 B：引入 Husky + lint-staged + commitlint**：

### 工具组合
| 工具 | 版本 | 职责 |
|------|------|------|
| `husky` | ^9.x | Git Hook 管理，替代手动 `.git/hooks` 配置 |
| `lint-staged` | ^15.x | pre-commit 时只对暂存区文件运行 Lint，避免全量扫描 |
| `@commitlint/cli` + `@commitlint/config-conventional` | ^19.x | commit-msg 时校验 Conventional Commits 格式 |

### Git Hook 配置

**pre-commit**（`.husky/pre-commit`）：
```bash
npx lint-staged
```

lint-staged 配置（`package.json`）：
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

**commit-msg**（`.husky/commit-msg`）：
```bash
npx --no -- commitlint --edit $1
```

commitlint 配置（`commitlint.config.js`）：
```js
module.exports = { extends: ['@commitlint/config-conventional'] };
```

### Conventional Commits 格式要求
```
<type>(<scope>): <subject>

type: feat | fix | docs | style | refactor | test | chore | ci | perf
```

例：`feat(cart): add quantity update API`、`fix(ci): resolve peer dependency conflict`

### CI 中的配置
在 `.github/workflows/ci.yml` 中保留 commit message 校验作为兜底，但 PR 合并前 Husky 已确保 commit 格式合规。

## 后果

### 正面影响
- 所有 commit（包括 Codex 生成的）在本地提交时即被校验，格式不合规直接拒绝
- lint-staged 只检查暂存文件，pre-commit Hook 执行速度快（通常 < 5 秒），不影响开发体验
- 规范的 commit 历史使 `conventional-changelog` 可自动生成 CHANGELOG
- 为后续引入语义化版本自动发布（`semantic-release`）打下基础

### 负面影响 / 需关注的风险
- Husky 需要在每个新克隆的仓库执行 `npm install` 后自动触发 `husky install`（通过 `prepare` script），新开发者需要注意
- Codex 在 CI 环境中运行时，若 Git Hook 被跳过（`--no-verify`），仍需 CI 兜底校验
- 使用 `git commit --no-verify` 可以绕过 Hook，需要在团队规范中明确禁止（紧急情况除外）
- lint-staged 自动修改文件（ESLint --fix / Prettier）后，开发者需要重新 `git add` 再提交，初次使用可能有困惑
