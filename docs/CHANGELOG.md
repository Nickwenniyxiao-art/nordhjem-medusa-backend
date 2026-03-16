# NordHjem 变更历史

> 记录每次部署到 Production 的变更内容。按日期倒序排列。

---

## [2026-03-13] — Husky + commitlint 上线

### 变更内容

- chore: add husky, lint-staged, and commitlint setup (PR #82)
  - .husky/pre-commit: npx lint-staged
  - .husky/commit-msg: commitlint 校验
  - commitlint.config.js: @commitlint/config-conventional
  - package.json: 新增 prepare script

### 部署信息

- CD — Production #8
- Commit: b56aeab
- 触发方式: PR #82 自动合并 → develop → staging → main → Owner Approve

---

## [2026-03-13] — codex-autofix lockfile 修复

### 变更内容

- ci: use npm install --legacy-peer-deps in codex-autofix to prevent lockfile dead loops
  - codex-autofix.yml 第 159 行: npm ci || npm install → npm install --legacy-peer-deps

### 部署信息

- CD — Production #7
- Commit: 3712c40
- 触发方式: Owner 直接在 GitHub 网页编辑 → main

---

## [2026-03-13] — 后端 CI lint + type-check

### 变更内容

- ci: add lint and type-check to CI pipeline (PR #80)
  - ci.yml: 新增 lint-and-typecheck job
  - build job 依赖 lint-and-typecheck
- ci: relax ESLint rules for legacy code
  - .eslintrc.js: no-explicit-any: off, no-useless-escape: warn, no-constant-condition: warn

### 部署信息

- CD — Production #6
- 触发方式: PR #80 自动合并

---

## [2026-03-13] — 后端 ESLint + Prettier

### 变更内容

- chore: add ESLint and Prettier configuration (PR #78)
  - .eslintrc.js: TypeScript ESLint 配置
  - .prettierrc: 统一代码格式
  - package.json: 新增 lint/format scripts + devDependencies

### 部署信息

- CD — Production #5
- 触发方式: PR #78 自动合并

### 关联 ADR

- ADR-006: ESLint 规则放宽

---

## [2026-03-13] — ajv 依赖修复

### 变更内容

- fix: add ajv@^8.13.0 to devDependencies to resolve MODULE_NOT_FOUND
  - package.json: devDependencies 新增 ajv
  - package-lock.json: 更新依赖树

### 部署信息

- CD — Production #4
- 触发方式: 手动推送修复

---

## [2026-03-13 之前] — Phase 1 功能开发

> Phase 1 期间的 142+ PR 合并记录。详细记录见上任 CTO 交接的全景仪表盘。

### 里程碑

- 15 个模块，平均进度 91%
- 前端 91+ PR，后端 57+ PR
- 4 个模块达到 100%（M1 产品目录、M2 购物车、M7 客户服务、M8 物流跟踪）
