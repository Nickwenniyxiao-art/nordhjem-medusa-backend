# NordHjem Engineering Playbook

> 版本：v1.0 · 生效日期：2026-03-13 · 维护人：CTO（AI）

本文档是 NordHjem 项目的工程规范手册（前半部分，第 0～4 章）。所有工程师（含 AI Agent）必须遵守。Owner 仅需阅读第 0 章。

---

## 目录

- [第 0 章：角色与权限矩阵](#第-0-章角色与权限矩阵)
- [第 1 章：项目立项](#第-1-章项目立项)
- [第 2 章：代码规范](#第-2-章代码规范)
- [第 3 章：源码管理](#第-3-章源码管理)
- [第 4 章：CI/CD 流水线](#第-4-章cicd-流水线)

---

## 第 0 章：角色与权限矩阵

### 0.1 角色定义

本项目只有两个角色：**Owner（项目负责人）** 和 **CTO（AI）**。

---

#### 0.1.1 Owner（项目负责人）

Owner 只做 **2 件事**：

| # | 职责 |
|---|------|
| 1 | 确认 ROADMAP（审阅并批准开发路线） |
| 2 | 点 Approve 部署 production（GitHub Environment 审批） |

**Owner 不做的事（严格禁止，以防体系退化）：**

- ❌ 不参与技术决策
- ❌ 不审代码（不在 PR 上留 Review 意见）
- ❌ 不处理 bug（不指派、不追踪、不验证）
- ❌ 不维护任何文档
- ❌ 不管理 GitHub Projects（看板、Issue 状态）
- ❌ 不参与设计评审
- ❌ 不写 Sprint 回顾
- ❌ 不做事故复盘
- ❌ 不自行推送代码到任何分支

> **为什么这么严格？** 体系的核心价值是"Owner 零介入运转"。一旦 Owner 开始参与维护工作，CTO 就会产生依赖，体系就会退化成需要人工驱动的传统项目管理模式。

---

#### 0.1.2 CTO（AI）

CTO 全权负责以下所有事项：

| 职责域 | 具体工作 |
|--------|----------|
| 文档与流程 | 维护整套体系所有文档（Playbook、ADR、runbook），确保永远是最新版本 |
| 技术决策 | 技术选型、架构调整、依赖升级、性能优化方案 |
| 代码质量 | Code Review（通过 AI Review Gate）、CI/CD 配置、规范执行 |
| 项目管理 | 维护 GitHub Projects 看板、管理 Issue 生命周期、追踪 Sprint 进度 |
| 沟通记录 | 将所有 Owner 发来的资料转化为 GitHub 记录，撰写 Sprint 回顾、事故复盘、设计评审、ADR |
| 人员管理 | 管理 Codex 任务分配、交接文档、上下文传递 |

**CTO 不做的事：**

- ❌ 不自行修改 ROADMAP（必须提交变更申请，由 Owner 确认）
- ❌ 不直接写业务代码（所有代码通过 Codex 生成 → PR → CI/CD）
- ❌ 不跳过 CI/CD 直接部署
- ❌ 不在没有 PR 的情况下合并代码

---

### 0.2 体系自运转铁律

> **核心原则：** 整套体系的所有维护工作（文档更新、Sprint 回顾、事故复盘、设计评审、GitHub Projects 维护等）全部由 CTO 自主完成。Owner 不参与任何体系维护工作。
>
> Owner 唯一的触点是：**确认 ROADMAP + 点 Approve 部署**。
>
> 如果体系运转需要 Owner 做技术判断或频繁介入，就是**体系设计失败**。

---

### 0.3 CTO 自主决策范围

以下事项 CTO **无需询问 Owner**，直接决策执行：

- 技术选型、架构调整、bug 修复方案
- CI/CD 配置变更、代码规范调整
- 依赖升级、性能优化方案
- 事故响应与修复（P0～P3 全部级别）
- 设计评审决策
- 所有文档和流程的更新
- GitHub Projects 看板调整
- Sprint 内任务优先级调整

---

### 0.4 必须上报 Owner 的情况

**仅以下 4 种情况需要上报：**

| # | 情况 | 上报方式 |
|---|------|----------|
| 1 | 修改开发路线（ROADMAP 变更申请） | 提交 GitHub Issue，标签 `roadmap-change`，等待 Owner 书面确认 |
| 2 | 增加费用的决策（新增付费服务/基础设施） | 提交 GitHub Issue，标签 `cost-approval`，附费用估算 |
| 3 | 数据泄露或重大安全事件 | 立即通过 Owner 指定渠道通知，同步开具事故复盘草稿 |
| 4 | 项目延期超过 1 个 Sprint | 提交 GitHub Issue，标签 `delay-notice`，附延期原因和新时间线 |

---

### 0.5 全部铁律汇总（8 条）

| # | 铁律 | 违反后果 |
|---|------|----------|
| 1 | **CTO 不写代码** — 所有代码通过 Codex → PR → CI/CD | 直接关闭 PR，要求重新走流程 |
| 2 | **所有变更走 CI/CD** — 无例外，包括配置文件变更 | 回滚变更，补充 PR 和 CI 记录 |
| 3 | **只有 Owner 合 main** — Production 部署必须 Owner Approve | GitHub Branch Protection 强制执行 |
| 4 | **ROADMAP 锁定** — Owner 确认后 CTO 不能自行修改 | 提交变更申请，走上报流程 |
| 5 | **信息转化** — 每次沟通后关键信息必须转化成 GitHub 记录 | 24 小时内补充对应 Issue/Comment |
| 6 | **体系自运转** — 所有维护工作 CTO 自主完成，Owner 零介入 | 体系设计失败，需重新审视分工 |
| 7 | **活文档** — 每完成一项任务必须更新对应文档 | PR 不得合并，直到文档更新提交 |
| 8 | **文档归档** — 任何项目相关文档必须归档到 `docs/`，不允许仓库外文档 | 仓库外文档不具备法律效力，必须迁移 |

---

### 0.6 第 0 章检查项

| 编号 | 检查项 | 验证方法 |
|------|--------|----------|
| C-001 | Owner 没有直接 push 到任何分支的权限 | GitHub → Settings → Branches，确认 Owner 账号被 Branch Protection 规则覆盖 |
| C-002 | main 分支 Require 1 个 reviewer（Owner 账号）且为 required reviewer | GitHub → Settings → Environments → production，确认 Required reviewers 包含 Owner |
| C-003 | ROADMAP.md 存在于仓库根目录，最后一次修改有 Owner 的书面确认记录（Issue 或 PR 评论） | `git log --oneline ROADMAP.md` 查看提交历史 |
| C-004 | GitHub Projects 看板最近一次更新时间不超过 1 个工作日 | GitHub Projects → 查看 Last updated |
| C-005 | docs/ 目录下无过时文档（最后更新超过 2 个 Sprint 且未标记为 archived） | `git log --since="4 weeks ago" docs/` 确认有定期更新 |

---

## 第 1 章：项目立项

### 1.1 需求收集模板

每个需求必须在 GitHub Issue 中填写以下模板（路径：`.github/ISSUE_TEMPLATE/feature_request.yml`）：

```yaml
name: 需求收集
description: 新功能或产品需求
title: "[FEAT] "
labels: ["needs-triage"]
body:
  - type: markdown
    attributes:
      value: |
        填写前请先确认 ROADMAP.md 中已有对应史诗（Epic），否则先提 roadmap-change。

  - type: textarea
    id: problem
    attributes:
      label: 问题/机会描述
      description: 描述当前痛点或市场机会，不要直接写解决方案
      placeholder: "当用户尝试完成 X 时，会遇到 Y 问题，导致 Z 后果..."
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: 期望的解决方案
      description: 描述预期行为
    validations:
      required: true

  - type: dropdown
    id: priority
    attributes:
      label: 优先级
      options:
        - P0 - 阻塞发布
        - P1 - 本 Sprint 必须完成
        - P2 - 本 Sprint 尽力完成
        - P3 - 下个 Sprint 排期
    validations:
      required: true

  - type: input
    id: epic
    attributes:
      label: 关联 Epic
      placeholder: "Epic #123"
    validations:
      required: true

  - type: textarea
    id: acceptance
    attributes:
      label: 验收标准（Acceptance Criteria）
      description: 以 Given/When/Then 格式编写
      placeholder: |
        - Given 用户已登录
        - When 用户点击「加入购物车」
        - Then 商品数量显示 +1，购物车图标更新
    validations:
      required: true
```

---

### 1.2 技术选型流程

**原则：** 所有架构级技术选型必须写 ADR（Architecture Decision Record），存储在 `docs/adr/` 目录。

#### 1.2.1 技术评估矩阵

使用以下 6 个维度对候选方案评分（1-5 分），加权求和：

| 维度 | 权重 | 说明 |
|------|------|------|
| 成熟度 | 20% | GitHub Stars、发布频率、社区活跃度 |
| 与现有栈的兼容性 | 25% | 是否与 Next.js 15 / Medusa v2 / PostgreSQL 生态兼容 |
| 性能 | 20% | Benchmark 数据，满足当前 + 未来 2 年预期负载 |
| 维护成本 | 20% | 学习曲线、文档质量、长期维护风险 |
| 迁移成本 | 10% | 若未来需要替换，迁移难度 |
| 安全性 | 5% | 已知 CVE 数量、安全补丁响应速度 |

**决策阈值：** 加权总分 ≥ 3.5 分才可选用；若最高分方案 < 3.5 分，需重新调研或上报 Owner 讨论。

#### 1.2.2 ADR 模板（`docs/adr/ADR-XXX-title.md`）

```markdown
# ADR-XXX: [决策标题]

**日期：** YYYY-MM-DD
**状态：** Proposed | Accepted | Deprecated | Superseded by ADR-YYY
**决策者：** CTO（AI）

## 背景

[描述面临的问题和约束条件]

## 决策

[明确的决策结论，一句话总结]

## 评估选项

| 选项 | 成熟度 | 兼容性 | 性能 | 维护 | 迁移 | 安全 | 加权总分 |
|------|--------|--------|------|------|------|------|----------|
| 选项 A | 4 | 5 | 4 | 3 | 3 | 4 | **3.85** |
| 选项 B | 3 | 3 | 5 | 4 | 2 | 4 | **3.45** |

## 选择理由

[为什么选择该方案，需点明评估矩阵中的关键差异]

## 影响

- **正面：** [列出收益]
- **负面：** [列出已知代价和风险]
- **后续行动：** [需要配套完成的工作]
```

---

### 1.3 NordHjem 技术栈

| 层次 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 前端 | Next.js | 15.x | SSR/SSG 电商前端 |
| 后端 | Medusa.js | v2 | 电商引擎 API |
| 数据库 | PostgreSQL | 15.x | 主数据存储 |
| 缓存 | Redis | 7.x | Session、队列、缓存 |
| 容器化 | Docker + Docker Compose | 27.x | 全环境容器化 |
| 部署 | VPS（Ubuntu） | — | 自托管，IP: 66.94.127.117 |
| 前端仓库 | nextjs-starter-medusa | — | GitHub |
| 后端仓库 | nordhjem-medusa-backend | — | GitHub |

---

### 1.4 环境搭建 SOP

#### 1.4.1 VPS 初始化（仅执行一次）

```bash
# 1. 更新系统
sudo apt-get update && sudo apt-get upgrade -y

# 2. 安装 Docker Engine（官方脚本）
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# 3. 验证 Docker
docker --version   # Docker version 27.x.x
docker compose version  # Docker Compose version v2.x.x

# 4. 创建项目目录结构
sudo mkdir -p /opt/nordhjem/{production,staging,test}
sudo chown -R $USER:$USER /opt/nordhjem

# 5. 配置防火墙（ufw）
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP（Nginx 反代）
sudo ufw allow 443/tcp   # HTTPS（Nginx 反代）
# 内部端口仅允许本机访问，不对外暴露
sudo ufw enable
```

#### 1.4.2 PostgreSQL 初始化（Docker 方式）

```bash
# 创建持久化数据卷
docker volume create pg_data_production
docker volume create pg_data_staging
docker volume create pg_data_test

# 启动 PostgreSQL（生产环境示例）
docker run -d \
  --name pg-production \
  --restart unless-stopped \
  -e POSTGRES_DB=nordhjem_production \
  -e POSTGRES_USER=nordhjem \
  -e POSTGRES_PASSWORD="${DB_PASSWORD}" \
  -v pg_data_production:/var/lib/postgresql/data \
  -p 127.0.0.1:5432:5432 \
  postgres:15-alpine

# 验证连接
docker exec -it pg-production psql -U nordhjem -d nordhjem_production -c "SELECT version();"
```

#### 1.4.3 Redis 初始化

```bash
docker volume create redis_data_production

docker run -d \
  --name redis-production \
  --restart unless-stopped \
  -v redis_data_production:/data \
  -p 127.0.0.1:6379:6379 \
  redis:7-alpine redis-server --requirepass "${REDIS_PASSWORD}" --appendonly yes

# 验证
docker exec -it redis-production redis-cli -a "${REDIS_PASSWORD}" ping
# 期望输出：PONG
```

#### 1.4.4 Docker Compose 多环境配置

以后端为例，`docker-compose.yml`（基础）+ `docker-compose.production.yml`（覆盖）：

```yaml
# docker-compose.yml（基础配置）
version: "3.9"
services:
  backend:
    image: ghcr.io/nordhjem/nordhjem-medusa-backend:${IMAGE_TAG:-latest}
    restart: unless-stopped
    environment:
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      NODE_ENV: ${NODE_ENV}
      JWT_SECRET: ${JWT_SECRET}
      COOKIE_SECRET: ${COOKIE_SECRET}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
```

```yaml
# docker-compose.production.yml（生产覆盖）
version: "3.9"
services:
  backend:
    ports:
      - "127.0.0.1:9000:9000"
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "5"
```

部署命令：

```bash
docker compose -f docker-compose.yml -f docker-compose.production.yml up -d --pull always
```

---

### 1.5 仓库初始化清单

新仓库创建后，以下文件**必须**在第一个 PR 中存在：

```
仓库根目录/
├── README.md                    # 项目简介、本地启动指南、环境变量说明
├── .env.example                 # 所有环境变量（无真实值），含注释说明
├── .gitignore                   # 必须包含 .env, node_modules, dist, .medusa
├── .eslintrc.js                 # ESLint 配置（见第 2 章）
├── .prettierrc                  # Prettier 配置（见第 2 章）
├── commitlint.config.js         # Commitlint 配置（见第 2 章）
├── .husky/
│   ├── pre-commit               # lint-staged
│   └── commit-msg               # commitlint
├── tsconfig.json                # TypeScript 配置，strictNullChecks: true
├── package.json                 # 含 lint/build/test scripts
├── CHANGELOG.md                 # 初始版本记录（可为空）
├── docs/
│   ├── adr/                     # ADR 文件存放目录
│   │   └── ADR-001-tech-stack.md
│   └── runbook/                 # 运维手册
│       └── deployment.md
└── .github/
    ├── ISSUE_TEMPLATE/
    │   ├── feature_request.yml
    │   └── bug_report.yml
    ├── PULL_REQUEST_TEMPLATE.md
    └── workflows/
        ├── ci.yml
        ├── cd-test.yml
        ├── cd-staging.yml
        ├── cd-production.yml
        ├── ai-review.yml
        ├── auto-merge.yml
        └── codex-autofix.yml
```

**PR Template（`.github/PULL_REQUEST_TEMPLATE.md`）：**

```markdown
## 变更描述

<!-- 简要说明这个 PR 做了什么 -->

## 关联 Issue

Closes #

## 变更类型

- [ ] feat: 新功能
- [ ] fix: Bug 修复
- [ ] refactor: 重构
- [ ] chore: 构建/依赖/配置
- [ ] docs: 文档更新
- [ ] ci: CI/CD 配置
- [ ] test: 测试

## 自检清单

- [ ] 代码通过本地 `npm run lint`
- [ ] 代码通过本地 `npx tsc --noEmit`
- [ ] 已更新相关文档（如有）
- [ ] 提交信息符合 Conventional Commits 格式
```

---

### 1.6 第 1 章检查项

| 编号 | 检查项 | 验证方法 |
|------|--------|----------|
| C-006 | `.env.example` 存在于仓库根目录，且所有环境变量均有注释 | `cat .env.example` 确认无空注释行 |
| C-007 | `.gitignore` 包含 `.env`、`node_modules/`、`dist/`、`.medusa/` | `grep -E "^\.env$" .gitignore` |
| C-008 | `docs/adr/` 目录存在且有 ADR-001 | `ls docs/adr/ADR-001-*.md` |
| C-009 | 所有 `.github/workflows/*.yml` 文件存在 | `ls .github/workflows/` 核对清单 |
| C-010 | `README.md` 包含本地启动命令（至少 `npm install` + `npm run dev`） | `grep "npm run dev" README.md` |
| C-011 | Docker 服务全部健康（生产环境） | `docker ps --filter "health=healthy"` 无 unhealthy 行 |
| C-012 | `.github/PULL_REQUEST_TEMPLATE.md` 存在且包含「关联 Issue」字段 | `grep "Closes #" .github/PULL_REQUEST_TEMPLATE.md` |
| C-013 | VPS 防火墙仅开放 22/80/443，内部服务端口不对外暴露 | `sudo ufw status` 确认只有上述三个端口 |

---

## 第 2 章：代码规范

### 2.1 规范体系概览

NordHjem 使用以下工具链强制执行代码规范：

```
代码提交
  │
  ├─ [pre-commit] lint-staged
  │     ├─ ESLint --fix（.ts/.tsx/.js）
  │     └─ Prettier --write（.ts/.tsx/.js/.json/.md）
  │
  ├─ [commit-msg] commitlint
  │     └─ 校验 Conventional Commits 格式
  │
  └─ [CI] lint-and-typecheck job
        ├─ npm run lint（ESLint，不允许 warning 变 error）
        └─ npx tsc --noEmit（TypeScript 类型检查）
```

---

### 2.2 ESLint 配置

文件路径：`.eslintrc.js`

```js
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: 2022, sourceType: "module" },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  env: { node: true, es2022: true },
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-require-imports": "off",
    "no-useless-escape": "warn",
    "no-constant-condition": "warn",
  },
  ignorePatterns: ["node_modules/", "dist/", ".medusa/", "coverage/"],
};
```

**规则说明：**

| 规则 | 设置 | 原因 |
|------|------|------|
| `no-explicit-any` | off | Medusa v2 内部大量使用 `any`，强制禁止会产生大量误报 |
| `no-unused-vars` | warn（`^_` 除外） | 下划线前缀变量为有意忽略，如 `_req` |
| `no-require-imports` | off | CommonJS 模块（如 `commitlint.config.js`）需要 `require` |

---

### 2.3 Prettier 配置

文件路径：`.prettierrc`

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

**约定说明：**

- 使用双引号（`singleQuote: false`），与 JSON 和 HTML 属性风格保持一致
- `trailingComma: "all"` — 函数参数末尾也加逗号，减少 diff 行数
- `printWidth: 100` — 比默认 80 宽，适合现代大屏开发

---

### 2.4 TypeScript 配置

文件路径：`tsconfig.json`（关键字段）

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": false,           // 完整 strict 模式延后启用（见 ADR-006）
    "strictNullChecks": true,  // 已启用：防止 null/undefined 相关运行时错误
    "noImplicitAny": false,    // 暂时关闭，配合 no-explicit-any: off
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", ".medusa", "coverage"]
}
```

> **ADR-006 摘要：** 完整 `strict: true` 会触发 Medusa v2 内部类型推断冲突（约 200+ 类型错误），需等待 Medusa v2 稳定版修复后逐步开启。当前阶段启用 `strictNullChecks: true` 作为最高优先级的安全保障，其余 strict 子选项在后续 Sprint 逐步开启。

---

### 2.5 Commit 规范（Conventional Commits）

#### 2.5.1 Commitlint 配置

文件路径：`commitlint.config.js`

```js
module.exports = { extends: ['@commitlint/config-conventional'] };
```

#### 2.5.2 Commit 格式

```
<type>(<scope>): <subject>

[可选 body]

[可选 footer]
```

**允许的 type 列表：**

| type | 用途 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(cart): add quantity selector` |
| `fix` | Bug 修复 | `fix(auth): resolve JWT expiry issue` |
| `refactor` | 重构（不改变行为） | `refactor(product): extract price utils` |
| `chore` | 构建、依赖、配置 | `chore: upgrade medusa to 2.3.1` |
| `docs` | 文档变更 | `docs: update env setup in README` |
| `ci` | CI/CD 配置 | `ci: add ai-review workflow` |
| `test` | 测试相关 | `test(order): add integration test` |
| `perf` | 性能优化 | `perf(query): add index on orders.created_at` |
| `style` | 代码格式（不影响逻辑） | `style: apply prettier to src/` |

**Breaking Change 标记：**

```
feat(api)!: rename /products to /store/products

BREAKING CHANGE: All clients must update API path prefix.
```

---

### 2.6 Husky Git Hooks

#### 安装命令

```bash
npm install --save-dev husky lint-staged
npx husky init
```

#### `.husky/pre-commit`

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

#### `.husky/commit-msg`

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

#### `package.json` 中的 `lint-staged` 配置

```jsonc
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yaml,yml}": [
      "prettier --write"
    ]
  }
}
```

---

### 2.7 代码审查规范

AI Review Gate（`ai-review.yml`）是 CI 必须通过的 Status Check。人工审查仅在以下情况触发：

- AI Review 标记 `needs-human-review` 标签
- 涉及数据库 schema 变更（migration 文件）
- 涉及支付或安全相关逻辑

---

### 2.8 第 2 章检查项

| 编号 | 检查项 | 验证方法 |
|------|--------|----------|
| C-014 | `.eslintrc.js` 存在且 `root: true` | `node -e "console.log(require('./.eslintrc.js').root)"` 输出 `true` |
| C-015 | `.prettierrc` 存在且 `singleQuote: false` | `cat .prettierrc` 确认 |
| C-016 | `commitlint.config.js` 存在 | `ls commitlint.config.js` |
| C-017 | `.husky/pre-commit` 包含 `lint-staged` | `cat .husky/pre-commit` |
| C-018 | `.husky/commit-msg` 包含 `commitlint` | `cat .husky/commit-msg` |
| C-019 | `tsconfig.json` 中 `strictNullChecks: true` | `grep "strictNullChecks" tsconfig.json` |
| C-020 | `npm run lint` 在干净的代码库上零报错 | 本地运行 `npm run lint` |
| C-021 | `npx tsc --noEmit` 零错误 | 本地运行 `npx tsc --noEmit` |
| C-022 | `lint-staged` 配置在 `package.json` 中存在 | `cat package.json \| grep lint-staged` |
| C-023 | 提交一个错误格式的 commit 消息（如 `wip: test`）被 commitlint 拒绝 | 本地测试：`echo "wip: test" \| npx commitlint` 返回非 0 |

---

## 第 3 章：源码管理

### 3.1 分支策略

```
feature/*
    │
    └──→ develop ──→ staging ──→ main
              │           │          │
           [Test]     [Staging]  [Production]
           端口 9002   端口 9001   端口 9000
```

| 分支 | 用途 | 创建来源 | 合并目标 | 保护级别 |
|------|------|----------|----------|----------|
| `main` | 生产代码，永远可部署 | `staging` | — | 最高：Owner Approve |
| `staging` | 预发布验证 | `develop` | `main` | 高：CI + AI Review |
| `develop` | 集成分支 | `main`（初始） | `staging` | 中：CI + 1 Reviewer |
| `feature/*` | 功能开发 | `develop` | `develop` | 无 |
| `codex/*` | Codex 自动生成 | `develop` | `develop` | 无（Auto-merge） |
| `fix/*` | 热修复 | `main` | `main` + `develop` | 无 |

#### 3.1.1 分支命名规范

```
feature/<issue-number>-<short-description>
# 示例: feature/42-add-product-search

codex/<timestamp>-<short-description>
# 示例: codex/20260313-fix-cart-type-error

fix/<issue-number>-<short-description>
# 示例: fix/87-hotfix-payment-timeout
```

---

### 3.2 Branch Protection 配置

#### 后端（`nordhjem-medusa-backend`）develop 分支

通过 GitHub API 或 UI 配置，以下为等效的 API Payload：

```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["build", "ai-review-gate"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 1
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
```

#### main 分支（两个仓库）

```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["build", "ai-review-gate"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "required_approving_review_count": 1
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
```

**额外配置（GitHub Environments）：**

```
Settings → Environments → production
  └─ Required reviewers: [Owner 账号]
  └─ Wait timer: 0 minutes
  └─ Deployment branches: main only
```

---

### 3.3 PR 规范

#### 3.3.1 PR 创建规则

- PR 标题**必须**遵循 Conventional Commits 格式（CI 会通过 commitlint 校验标题）
- PR **必须**关联至少一个 Issue（在描述中写 `Closes #xxx`）
- PR 不得修改 `ROADMAP.md`（除非附有 Owner 书面确认截图）
- 每个 PR 最多包含 **500 行有效代码变更**（不含 lock file、自动生成文件）；超出需拆分

#### 3.3.2 Codex PR 规范

Codex 创建的 PR 特殊规则：

```
分支前缀：codex/*
标签：codex-generated, auto-merge-pending
审查：AI Review Gate 通过后自动合并（无需人工 Approve）
允许修改目录：src/, e2e/, __tests__/, integration-tests/
禁止修改：.github/workflows/, docs/adr/, ROADMAP.md, package-lock.json（使用 npm install --legacy-peer-deps 避免 lockfile 冲突）
```

#### 3.3.3 自动合并条件（Auto-merge）

```
条件 1: CI 通过（build + lint-and-typecheck）
条件 2: AI Review Gate 通过（ai-review-gate status check = success）
操作: 使用 CD_PAT（具有 merge 权限的 PAT）自动执行 squash merge
```

---

### 3.4 Secrets 管理

#### 3.4.1 原则

- **绝对禁止**在代码中硬编码任何密钥、密码、Token
- **绝对禁止**将 `.env` 文件提交到 Git（必须在 `.gitignore` 中）
- `.env.example` 必须存在，包含所有变量名称和类型注释，但**不含真实值**

#### 3.4.2 GitHub Secrets 分类

| Secret 名称 | 用途 | 存储级别 |
|------------|------|----------|
| `VPS_SSH_KEY` | SSH 私钥（部署用） | Repository |
| `VPS_HOST` | VPS IP 地址 | Repository |
| `VPS_USER` | SSH 用户名 | Repository |
| `GHCR_TOKEN` | GitHub Container Registry 写入权限 | Repository |
| `CD_PAT` | Auto-merge 用 PAT（需 repo 权限） | Repository |
| `OPENAI_API_KEY` | AI Review（GPT-4o-mini） | Repository |
| `ANTHROPIC_API_KEY` | AI Review（Claude） | Repository |
| `DATABASE_URL_PRODUCTION` | 生产数据库连接串 | Environment: production |
| `DATABASE_URL_STAGING` | Staging 数据库连接串 | Environment: staging |
| `DATABASE_URL_TEST` | Test 数据库连接串 | Environment: test |

#### 3.4.3 `.env.example` 规范

```bash
# === 数据库配置 ===
# 格式: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL=postgresql://nordhjem:CHANGE_ME@localhost:5432/nordhjem_production

# === Redis 配置 ===
REDIS_URL=redis://:CHANGE_ME@localhost:6379

# === Medusa 安全配置 ===
# 生成方式: openssl rand -base64 32
JWT_SECRET=CHANGE_ME_32_BYTES_RANDOM
COOKIE_SECRET=CHANGE_ME_32_BYTES_RANDOM

# === 部署环境 ===
NODE_ENV=production   # production | staging | test

# === 外部服务（可选）===
# STRIPE_SECRET_KEY=sk_live_...
# SENDGRID_API_KEY=SG....
```

---

### 3.5 Git 操作规范

#### 常用命令示例

```bash
# 从 develop 创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/42-add-product-search

# 提交（commitlint 会在 commit-msg hook 校验）
git add -p   # 逐块暂存，避免提交不相关代码
git commit -m "feat(search): add full-text product search"

# 推送并创建 PR
git push origin feature/42-add-product-search
gh pr create --title "feat(search): add full-text product search" --body "Closes #42" --base develop

# 合并后清理
git checkout develop
git pull origin develop
git branch -d feature/42-add-product-search
```

#### 禁止操作

```bash
# ❌ 禁止 force push 到保护分支
git push --force origin develop

# ❌ 禁止直接提交到 main/develop/staging
git checkout main && git commit -m "..." && git push

# ❌ 禁止 rebase 公共分支的历史
git rebase -i origin/develop  # 在已推送的分支上
```

---

### 3.6 第 3 章检查项

| 编号 | 检查项 | 验证方法 |
|------|--------|----------|
| C-024 | develop 分支 Branch Protection 已启用，require PR before merging | GitHub → Settings → Branches |
| C-025 | develop 分支 required status checks 包含 `build` 和 `ai-review-gate` | GitHub → Settings → Branches → develop |
| C-026 | main 分支 Environment protection 已启用，Required reviewer 为 Owner | GitHub → Settings → Environments → production |
| C-027 | `.gitignore` 包含 `.env` 且本地 `.env` 文件不存在于 Git 历史中 | `git log --all --full-history -- .env` 无输出 |
| C-028 | `.env.example` 存在且所有变量有注释 | `cat .env.example` 人工确认 |
| C-029 | 所有 Secrets 已在 GitHub Repository/Environment Secrets 中配置 | GitHub → Settings → Secrets 核对清单 |
| C-030 | `feature/*` 分支命名包含 Issue 编号 | `git branch -r \| grep feature/ \| grep -vE "feature/[0-9]+"` 应无输出 |
| C-031 | `codex/*` 分支的 PR 有 `codex-generated` 标签 | GitHub → Pull Requests → 筛选标签 |
| C-032 | PR 描述中包含 `Closes #` 字样（关联 Issue） | GitHub → Pull Requests → 人工抽检 3 条 |
| C-033 | 不存在直接 push 到 main 的提交记录（最近 30 天） | `git log --oneline origin/main --since="30 days ago"` 对比 PR merge 记录 |

---

## 第 4 章：CI/CD 流水线

### 4.1 流水线总览

```
Push / PR
  │
  ├─→ ci.yml
  │    ├─ lint-and-typecheck
  │    └─ build（Docker → ghcr.io）
  │
  ├─→ ai-review.yml
  │    ├─ extract-diff
  │    ├─ reviewer-1-quality（GPT-4o-mini）
  │    └─ ai-review-gate（Status Check）
  │
  ├─→ auto-merge.yml（CI 通过 + AI Review 通过）
  │
  ├─→ codex-autofix.yml（CI 失败时触发，最多重试 3 次）
  │
  └─→ CD（由分支触发）
       ├─ cd-test.yml（push develop → 端口 9002）
       ├─ cd-staging.yml（push staging → 端口 9001，含 pg_dump）
       └─ cd-production.yml（push main → 端口 9000，含 pg_dump + Owner Approve）
```

---

### 4.2 CI 流水线（`ci.yml`）

完整配置（后端仓库 `nordhjem-medusa-backend`）：

```yaml
name: CI

on:
  push:
    branches: [develop, staging, main, "feature/**", "codex/**", "fix/**"]
  pull_request:
    branches: [develop, staging, main]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  lint-and-typecheck:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci --legacy-peer-deps

      - name: Run ESLint
        run: npm run lint

      - name: TypeScript type check
        run: npx tsc --noEmit

  build:
    name: Build & Push Docker Image
    runs-on: ubuntu-latest
    needs: lint-and-typecheck
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract Docker metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=sha,prefix=sha-
            type=raw,value=latest,enable=${{ github.ref == 'refs/heads/main' }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

**关键设计决策：**

- `npm ci --legacy-peer-deps`：Medusa v2 依赖树存在 peer dep 冲突，`--legacy-peer-deps` 是官方推荐绕过方式
- `concurrency + cancel-in-progress`：同分支多次 push 时自动取消旧的 CI，节省资源
- Docker 镜像推送到 `ghcr.io`（GitHub Container Registry），不推 PR 触发的构建（`push: github.event_name != 'pull_request'`）

---

### 4.3 CD 流水线

#### 4.3.1 Test 环境（`cd-test.yml`）

```yaml
name: CD - Test

on:
  push:
    branches: [develop]

jobs:
  deploy-test:
    name: Deploy to Test (port 9002)
    runs-on: ubuntu-latest
    needs: []  # 等待 ci.yml 完成（通过 workflow_run 或 Status Check）
    environment: test

    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/nordhjem/test
            docker compose pull
            docker compose up -d --remove-orphans
            docker compose ps
            # 健康检查：等待最多 60 秒
            timeout 60 bash -c 'until curl -sf http://localhost:9002/health; do sleep 3; done'
            echo "Test deployment successful"
```

#### 4.3.2 Staging 环境（`cd-staging.yml`）

```yaml
name: CD - Staging

on:
  push:
    branches: [staging]

jobs:
  deploy-staging:
    name: Deploy to Staging (port 9001)
    runs-on: ubuntu-latest
    environment: staging

    steps:
      - name: Backup database before deploy
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            BACKUP_FILE="/opt/nordhjem/backups/staging_$(date +%Y%m%d_%H%M%S).sql"
            mkdir -p /opt/nordhjem/backups
            docker exec pg-staging pg_dump -U nordhjem nordhjem_staging > "$BACKUP_FILE"
            gzip "$BACKUP_FILE"
            echo "Backup saved: ${BACKUP_FILE}.gz"
            # 保留最近 10 个备份
            ls -t /opt/nordhjem/backups/staging_*.sql.gz | tail -n +11 | xargs -r rm

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/nordhjem/staging
            docker compose pull
            docker compose up -d --remove-orphans
            timeout 60 bash -c 'until curl -sf http://localhost:9001/health; do sleep 3; done'
            echo "Staging deployment successful"
```

#### 4.3.3 Production 环境（`cd-production.yml`）

```yaml
name: CD - Production

on:
  push:
    branches: [main]

jobs:
  deploy-production:
    name: Deploy to Production (port 9000)
    runs-on: ubuntu-latest
    environment: production   # 此处触发 GitHub Environment Approval（Owner 审批）

    steps:
      - name: Backup database before deploy
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            BACKUP_FILE="/opt/nordhjem/backups/production_$(date +%Y%m%d_%H%M%S).sql"
            mkdir -p /opt/nordhjem/backups
            docker exec pg-production pg_dump -U nordhjem nordhjem_production > "$BACKUP_FILE"
            gzip "$BACKUP_FILE"
            # 保留最近 20 个备份
            ls -t /opt/nordhjem/backups/production_*.sql.gz | tail -n +21 | xargs -r rm
            echo "Production backup: ${BACKUP_FILE}.gz"

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/nordhjem/production
            IMAGE_TAG="${{ github.sha }}"
            docker compose pull
            IMAGE_TAG=$IMAGE_TAG docker compose up -d --remove-orphans
            timeout 90 bash -c 'until curl -sf http://localhost:9000/health; do sleep 5; done'
            echo "Production deployment successful: $IMAGE_TAG"

      - name: Record deployment
        uses: actions/github-script@v7
        with:
          script: |
            await github.rest.repos.createDeployment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              ref: context.sha,
              environment: 'production',
              description: 'Deployed via CD pipeline',
              auto_merge: false,
              required_contexts: []
            });
```

---

### 4.4 AI Review（`ai-review.yml`）

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  extract-diff:
    name: Extract PR Diff
    runs-on: ubuntu-latest
    outputs:
      diff: ${{ steps.get-diff.outputs.diff }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - id: get-diff
        run: |
          DIFF=$(git diff origin/${{ github.base_ref }}...HEAD -- '*.ts' '*.tsx' '*.js' | head -c 8000)
          echo "diff<<EOF" >> $GITHUB_OUTPUT
          echo "$DIFF" >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT

  reviewer-1-quality:
    name: Quality Review (GPT-4o-mini)
    runs-on: ubuntu-latest
    needs: extract-diff
    outputs:
      approved: ${{ steps.review.outputs.approved }}
      feedback: ${{ steps.review.outputs.feedback }}
    steps:
      - id: review
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          DIFF: ${{ needs.extract-diff.outputs.diff }}
        run: |
          RESPONSE=$(curl -s https://api.openai.com/v1/chat/completions \
            -H "Authorization: Bearer $OPENAI_API_KEY" \
            -H "Content-Type: application/json" \
            -d "{
              \"model\": \"gpt-4o-mini\",
              \"messages\": [{
                \"role\": \"system\",
                \"content\": \"You are a senior code reviewer. Review the diff and respond with JSON: {\\\"approved\\\": true/false, \\\"feedback\\\": \\\"...\\\"}. Approve if: no obvious bugs, no security issues, follows conventions. Be lenient on style.\"
              }, {
                \"role\": \"user\",
                \"content\": \"Review this diff:\\n$DIFF\"
              }],
              \"response_format\": {\"type\": \"json_object\"}
            }")
          APPROVED=$(echo $RESPONSE | jq -r '.choices[0].message.content | fromjson | .approved')
          FEEDBACK=$(echo $RESPONSE | jq -r '.choices[0].message.content | fromjson | .feedback')
          echo "approved=$APPROVED" >> $GITHUB_OUTPUT
          echo "feedback=$FEEDBACK" >> $GITHUB_OUTPUT

  # reviewer-2（Claude）和 reviewer-3（架构审查）模板已就绪，待 Sprint 4 启用
  # reviewer-2-security:  # Claude Sonnet
  # reviewer-3-architecture:  # 架构合规性检查

  ai-review-gate:
    name: AI Review Gate
    runs-on: ubuntu-latest
    needs: reviewer-1-quality
    steps:
      - name: Check review result
        env:
          APPROVED: ${{ needs.reviewer-1-quality.outputs.approved }}
          FEEDBACK: ${{ needs.reviewer-1-quality.outputs.feedback }}
        run: |
          echo "AI Review Feedback: $FEEDBACK"
          if [ "$APPROVED" != "true" ]; then
            echo "::error::AI Review rejected this PR. Feedback: $FEEDBACK"
            exit 1
          fi
          echo "AI Review approved."
```

---

### 4.5 Auto-merge（`auto-merge.yml`）

```yaml
name: Auto Merge

on:
  workflow_run:
    workflows: ["CI", "AI Code Review"]
    types: [completed]

jobs:
  auto-merge:
    runs-on: ubuntu-latest
    if: >
      github.event.workflow_run.conclusion == 'success' &&
      startsWith(github.event.workflow_run.head_branch, 'codex/')
    steps:
      - name: Enable auto-merge for Codex PRs
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.CD_PAT }}
          script: |
            const prs = await github.rest.pulls.list({
              owner: context.repo.owner,
              repo: context.repo.repo,
              head: `${context.repo.owner}:${context.payload.workflow_run.head_branch}`,
              state: 'open'
            });
            for (const pr of prs.data) {
              await github.rest.pulls.merge({
                owner: context.repo.owner,
                repo: context.repo.repo,
                pull_number: pr.number,
                merge_method: 'squash'
              });
              console.log(`Auto-merged PR #${pr.number}`);
            }
```

---

### 4.6 Codex Auto-fix（`codex-autofix.yml`）

```yaml
name: Codex Auto-fix

on:
  workflow_run:
    workflows: ["CI"]
    types: [completed]
    branches: ["codex/**", "feature/**"]

jobs:
  autofix:
    runs-on: ubuntu-latest
    if: github.event.workflow_run.conclusion == 'failure'
    env:
      MAX_RETRIES: 3

    steps:
      - name: Check retry count
        id: retry-check
        uses: actions/github-script@v7
        with:
          script: |
            const branch = context.payload.workflow_run.head_branch;
            const runs = await github.rest.actions.listWorkflowRunsForRepo({
              owner: context.repo.owner,
              repo: context.repo.repo,
              workflow_id: 'codex-autofix.yml',
              branch: branch,
              status: 'completed'
            });
            const retries = runs.data.workflow_runs.length;
            console.log(`Retry count: ${retries}`);
            core.setOutput('retries', retries);
            if (retries >= 3) {
              core.setFailed('Max retries (3) exceeded. Manual intervention required.');
            }

      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.workflow_run.head_branch }}
          token: ${{ secrets.CD_PAT }}

      - name: Extract CI failure logs
        id: get-logs
        uses: actions/github-script@v7
        with:
          script: |
            const runId = context.payload.workflow_run.id;
            const jobs = await github.rest.actions.listJobsForWorkflowRun({
              owner: context.repo.owner,
              repo: context.repo.repo,
              run_id: runId
            });
            const failedJob = jobs.data.jobs.find(j => j.conclusion === 'failure');
            if (!failedJob) { core.setFailed('No failed job found'); return; }
            const logs = await github.rest.actions.downloadJobLogsForWorkflowRun({
              owner: context.repo.owner,
              repo: context.repo.repo,
              job_id: failedJob.id
            });
            // 截取最后 200 行错误日志
            const logText = logs.data.toString().split('\n').slice(-200).join('\n');
            core.setOutput('logs', logText.substring(0, 4000));

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm install --legacy-peer-deps  # 使用 install 而非 ci，避免 lockfile 死循环

      - name: Run Codex fix
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          CI_LOGS: ${{ steps.get-logs.outputs.logs }}
        run: |
          # 使用 OpenAI Codex API 分析错误并生成修复
          # 只允许修改以下目录
          ALLOWED_DIRS="src/ e2e/ __tests__/ integration-tests/"
          echo "Codex analyzing CI failure..."
          # [Codex 调用逻辑由具体 SDK 实现]

      - name: Commit and push fix
        run: |
          git config user.name "Codex Auto-fix"
          git config user.email "codex@nordhjem.ai"
          git add src/ e2e/ __tests__/ integration-tests/  # 只暂存允许的目录
          git diff --cached --quiet || git commit -m "fix(autofix): Codex auto-fix CI failure [skip codex-autofix]"
          git push origin HEAD
```

**关键约束：**

- `npm install --legacy-peer-deps`（不使用 `npm ci`，避免 lockfile 与远程不一致导致死循环）
- `[skip codex-autofix]` 标签防止 autofix 触发自身死循环
- 最多重试 3 次，超出后人工介入
- 只允许修改 `src/`、`e2e/`、`__tests__/`、`integration-tests/`

---

### 4.7 手动回滚（`deploy-production.yml`）

```yaml
name: Manual Production Rollback

on:
  workflow_dispatch:
    inputs:
      confirm:
        description: '输入 YES 确认回滚'
        required: true
        type: string
      target_sha:
        description: '回滚目标 Git SHA（留空则回滚到上一个版本）'
        required: false
        type: string

jobs:
  rollback:
    name: Production Rollback
    runs-on: ubuntu-latest
    environment: production   # 仍需 Owner Approve

    steps:
      - name: Validate confirmation
        run: |
          if [ "${{ inputs.confirm }}" != "YES" ]; then
            echo "::error::必须输入 YES 才能执行回滚"
            exit 1
          fi

      - uses: actions/checkout@v4

      - name: Rollback via SSH
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            TARGET_TAG="${{ inputs.target_sha }}"
            if [ -z "$TARGET_TAG" ]; then
              # 获取上一个部署的 SHA
              TARGET_TAG=$(docker inspect nordhjem-backend-production \
                --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' 2>/dev/null || echo "")
            fi
            cd /opt/nordhjem/production
            IMAGE_TAG=$TARGET_TAG docker compose up -d --remove-orphans
            timeout 90 bash -c 'until curl -sf http://localhost:9000/health; do sleep 5; done'
            echo "Rollback to $TARGET_TAG successful"
```

---

### 4.8 环境端口映射汇总

| 环境 | 前端端口 | 后端端口 | 数据库 | 触发分支 |
|------|---------|---------|--------|----------|
| Production | 8000 | 9000 | `nordhjem_production` | `main` |
| Staging | 8001 | 9001 | `nordhjem_staging` | `staging` |
| Test | 8002 | 9002 | `nordhjem_test` | `develop` |

---

### 4.9 第 4 章检查项

| 编号 | 检查项 | 验证方法 |
|------|--------|----------|
| C-034 | `ci.yml` 存在且包含 `lint-and-typecheck` 和 `build` 两个 job | `cat .github/workflows/ci.yml \| grep "name:"` |
| C-035 | CI 使用 `npm ci --legacy-peer-deps`（不是 `npm install`） | `grep "legacy-peer-deps" .github/workflows/ci.yml` |
| C-036 | Docker 镜像推送到 `ghcr.io`（REGISTRY 变量正确设置） | `grep "ghcr.io" .github/workflows/ci.yml` |
| C-037 | `cd-test.yml` 触发分支为 `develop`，部署端口为 9002 | `cat .github/workflows/cd-test.yml` 核对 |
| C-038 | `cd-staging.yml` 包含 `pg_dump` 备份步骤 | `grep "pg_dump" .github/workflows/cd-staging.yml` |
| C-039 | `cd-production.yml` 使用 `environment: production`（触发 Owner 审批） | `grep "environment: production" .github/workflows/cd-production.yml` |
| C-040 | `cd-production.yml` 包含 `pg_dump` 备份步骤 | `grep "pg_dump" .github/workflows/cd-production.yml` |
| C-041 | `ai-review.yml` 包含 `ai-review-gate` job | `grep "ai-review-gate" .github/workflows/ai-review.yml` |
| C-042 | `ai-review-gate` 是 develop 分支的 required status check | GitHub → Settings → Branches → develop |
| C-043 | `auto-merge.yml` 使用 `CD_PAT` 执行合并（不是 `GITHUB_TOKEN`） | `grep "CD_PAT" .github/workflows/auto-merge.yml` |
| C-044 | `codex-autofix.yml` 使用 `npm install --legacy-peer-deps`（非 `npm ci`） | `grep "npm install" .github/workflows/codex-autofix.yml` |
| C-045 | `codex-autofix.yml` 重试上限为 3 次 | `grep "MAX_RETRIES\|3" .github/workflows/codex-autofix.yml` |
| C-046 | `codex-autofix.yml` 只允许修改 `src/`、`e2e/`、`__tests__/`、`integration-tests/` | `grep "git add" .github/workflows/codex-autofix.yml` |
| C-047 | `deploy-production.yml`（回滚）workflow_dispatch 需输入 `YES` 确认 | `grep "YES" .github/workflows/deploy-production.yml` |
| C-048 | 实际执行一次 push 到 develop，验证 CI + CD-Test 全链路正常（绿色） | GitHub Actions → 查看最近一次 develop push 的 workflow runs |

---

## 附录：检查项索引

| 章节 | 检查项范围 | 数量 |
|------|-----------|------|
| 第 0 章：角色与权限矩阵 | C-001 ~ C-005 | 5 |
| 第 1 章：项目立项 | C-006 ~ C-013 | 8 |
| 第 2 章：代码规范 | C-014 ~ C-023 | 10 |
| 第 3 章：源码管理 | C-024 ~ C-033 | 10 |
| 第 4 章：CI/CD 流水线 | C-034 ~ C-048 | 15 |
| **合计** | **C-001 ~ C-048** | **48** |

---

*本文档由 CTO（AI）维护。最后更新：2026-03-13。如需修改，请提交 PR 并关联对应 Issue。*

---

# NordHjem Engineering Playbook — 第 5～8 章

> **版本** v1.0 · 最后更新 2026-03-13  
> **作者** CTO（Nickwenniyxiao-art 组织）  
> **适用范围** NordHjem 全栈工程团队  
> **技术栈** Next.js 15 · Medusa.js v2 · PostgreSQL · Redis · Docker · VPS 66.94.127.117

---

## 目录

- [第 5 章 需求开发流程](#第-5-章-需求开发流程)
  - [5.1 完整 SOP](#51-完整-sop)
  - [5.2 GitHub Projects 设置规范](#52-github-projects-设置规范)
  - [5.3 设计评审流程](#53-设计评审流程)
  - [5.x 检查项 C-049 ~ C-060](#5x-检查项-c-049--c-060)
- [第 6 章 质量保障](#第-6-章-质量保障)
  - [6.1 测试金字塔](#61-测试金字塔)
  - [6.2 测试框架配置](#62-测试框架配置)
  - [6.3 代码覆盖率](#63-代码覆盖率)
  - [6.4 安全扫描](#64-安全扫描)
  - [6.5 CI 质量门禁](#65-ci-质量门禁)
  - [6.x 检查项 C-061 ~ C-068](#6x-检查项-c-061--c-068)
- [第 7 章 运维与监控](#第-7-章-运维与监控)
  - [7.1 VPS 管理](#71-vps-管理)
  - [7.2 Docker 部署](#72-docker-部署)
  - [7.3 数据库备份](#73-数据库备份)
  - [7.4 监控](#74-监控)
  - [7.5 告警通知](#75-告警通知)
  - [7.6 事故等级定义](#76-事故等级定义)
  - [7.x 检查项 C-069 ~ C-080](#7x-检查项-c-069--c-080)
- [第 8 章 事故响应与复盘](#第-8-章-事故响应与复盘)
  - [8.1 事故响应流程](#81-事故响应流程)
  - [8.2 回滚操作](#82-回滚操作)
  - [8.3 Postmortem 规范](#83-postmortem-规范)
  - [8.4 Runbook 使用规范](#84-runbook-使用规范)
  - [8.x 检查项 C-081 ~ C-088](#8x-检查项-c-081--c-088)

---

# 第 5 章 需求开发流程

本章描述从原始需求到生产部署的完整研发闭环，确保每个功能变更都有迹可循、可回溯、可审计。

---

## 5.1 完整 SOP

### 流程总览

```
需求提出
   │
   ▼
【Step 1】创建 GitHub Issue
   │  · 填写 Issue 模板（功能需求 / Bug 报告）
   │  · 打标签：priority/Px, type/*, module/M*, phase/*
   │  · 加入 Project Board
   │
   ▼
【Step 2】设计评审（CTO 完成）
   │  · 写 ADR（Architecture Decision Record）
   │  · ADR 存于 docs/ADR/NNNN-title.md
   │  · 在 Issue 中关联 ADR 文档
   │
   ▼
【Step 3】CTO 下发 Codex 任务
   │  · 在 Issue 中留评论，附带完整 Codex prompt
   │  · 指明目标仓库、分支命名规范、DoD（完成定义）
   │
   ▼
【Step 4】Codex 创建 PR
   │  · 分支：feat/issue-{N}-{slug} 或 fix/issue-{N}-{slug}
   │  · PR 描述包含 "Closes #{N}"
   │  · 填写 PR 模板（变更内容、测试方法、截图）
   │
   ▼
【Step 5】AI Review 自动审核
   │  · GitHub Actions 触发 ai-review.yml
   │  · 检查：类型安全、命名规范、安全漏洞、潜在 bug
   │  · Review 结果以 PR 评论形式展示
   │
   ▼
【Step 6】CI 流水线通过
   │  · lint / type-check / build / test（详见第 6 章）
   │  · 所有 check 绿灯才可 merge
   │
   ▼
【Step 7】Auto-merge → 自动部署 Test 环境
   │  · merge 到 develop 分支触发 deploy-test.yml
   │  · CD 步骤：备份 → 拉取代码 → 构建 → 重启服务
   │
   ▼
【Step 8】Test 环境 E2E 测试
   │  · 触发 e2e-test.yml（Playwright Chromium + WebKit）
   │  · 测试通过后自动推送到 staging 分支
   │
   ▼
【Step 9】Staging 环境 E2E 测试
   │  · 同上，测试套件相同，数据集不同
   │  · 全部通过后推送 main 分支（PR 形式）
   │
   ▼
【Step 10】Owner Approve
   │  · Owner 审核 staging → main 的 PR
   │  · 只需确认业务功能，技术细节已在前几步验证
   │
   ▼
【Step 11】部署 Production
      · merge 到 main 触发 deploy-production.yml
      · 需要 workflow_dispatch 手动确认 YES
      · 蓝绿部署 / 滚动更新（Phase 2 引入）
```

### 各步骤操作细节

#### Step 1 · 创建 GitHub Issue

```bash
# 使用 GitHub CLI（本地已安装 gh）
gh issue create \
  --repo Nickwenniyxiao-art/nextjs-starter-medusa \
  --title "[feat] 商品列表分页功能" \
  --body-file .github/ISSUE_TEMPLATE/feature_request.md \
  --label "priority/P1,type/feature,module/M05,phase/1"
```

Issue 创建后立即执行：

1. 在 Project Board 中将 Issue 拖入 **Backlog** 列
2. 设置自定义字段 Priority、Phase、Module、Sprint
3. 在 Issue 正文底部补充验收标准（Acceptance Criteria，格式见 5.2）

#### Step 2 · 设计评审 & ADR

CTO 在开始编码前，为每个非平凡功能（预计工时 > 2h 或影响架构）撰写 ADR：

```bash
# ADR 编号自增，文件命名示例
touch docs/ADR/0012-product-list-pagination-strategy.md
```

ADR 文件写好后，在 Issue 评论中粘贴链接：

```
## 设计评审完成

ADR 文档：docs/ADR/0012-product-list-pagination-strategy.md
决策：采用 cursor-based pagination（offset 性能差，产品侧无跳页需求）
预计工时：4h
```

#### Step 3 · 下发 Codex 任务

在 Issue 评论区留如下格式的 Codex prompt，便于追溯：

```
## Codex Task

**仓库**：nextjs-starter-medusa
**分支**：feat/issue-42-product-list-pagination
**任务描述**：
  实现商品列表 cursor-based 分页。
  - 修改 src/modules/products/components/ProductGrid.tsx
  - 新增 usePaginatedProducts hook
  - 单元测试覆盖 hook 逻辑
  - Storybook story（如有）

**DoD（完成定义）**：
  - [ ] 页面正常渲染，翻页功能可用
  - [ ] 无 TypeScript 编译错误
  - [ ] Jest 覆盖率 ≥ 80%（新增代码）
  - [ ] CI 全绿
```

#### Step 4 · Codex 创建 PR

Codex 完成编码后，PR 必须包含：

- 标题格式：`feat(products): add cursor-based pagination (#42)`
- 描述中含 `Closes #42`
- 截图或录屏（UI 变更必填）
- 自测清单已勾选

#### Step 5 · AI Review

`.github/workflows/ai-review.yml` 示例：

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
      contents: read
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Get diff
        id: diff
        run: |
          git diff origin/${{ github.base_ref }}...HEAD > /tmp/pr.diff
          echo "diff_file=/tmp/pr.diff" >> $GITHUB_OUTPUT

      - name: Run AI Review
        uses: codex-ai/review-action@v1   # 占位，替换为实际 action
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          diff-file: ${{ steps.diff.outputs.diff_file }}
          review-instructions: |
            检查以下维度并用中文评论：
            1. TypeScript 类型安全
            2. 命名规范（变量/函数/组件）
            3. 潜在安全漏洞（XSS, SQL Injection）
            4. 性能问题（N+1, 大循环, 内存泄漏）
            5. 逻辑错误
            6. 缺少错误处理
```

#### Step 6 · CI 通过

详见第 6 章 6.5 节。

#### Step 7 · Auto-merge & Deploy Test

```yaml
# .github/workflows/auto-merge.yml（简化版）
name: Auto Merge

on:
  pull_request:
    types: [labeled]

jobs:
  auto-merge:
    if: contains(github.event.label.name, 'auto-merge')
    runs-on: ubuntu-latest
    steps:
      - name: Enable auto-merge
        run: gh pr merge --auto --squash "${{ github.event.pull_request.number }}"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 5.2 GitHub Projects 设置规范

### 创建 Project

```bash
# 1. 在浏览器中操作：
#    GitHub → 组织 Nickwenniyxiao-art → Projects → New project

# 2. 选择模板：Board（看板）
# 3. 项目名称：NordHjem Sprint Board
# 4. 创建后，依次添加视图：
```

| 视图名称 | 类型 | 用途 |
|----------|------|------|
| Board | Board | 日常看板，列：Backlog / Todo / In Progress / In Review / Done |
| Table | Table | 批量编辑 Issue 字段、导出数据 |
| Roadmap | Roadmap | 按 Phase/Sprint 展示时间线进度 |

**Roadmap 视图配置**：

- Date field：自定义字段 `Sprint End Date`
- Group by：`Phase`
- Zoom level：Month

### Issue 标签体系

```bash
# 批量创建标签脚本（在仓库根目录执行）
#!/usr/bin/env bash
REPO_FRONTEND="Nickwenniyxiao-art/nextjs-starter-medusa"
REPO_BACKEND="Nickwenniyxiao-art/nordhjem-medusa-backend"

create_label() {
  local REPO=$1 NAME=$2 COLOR=$3 DESC=$4
  gh label create "$NAME" --color "$COLOR" --description "$DESC" \
    --repo "$REPO" --force
}

for REPO in "$REPO_FRONTEND" "$REPO_BACKEND"; do
  # Priority
  create_label $REPO "priority/P0" "B60205" "致命：生产宕机"
  create_label $REPO "priority/P1" "D93F0B" "高：核心功能"
  create_label $REPO "priority/P2" "E4E669" "中：一般功能"
  create_label $REPO "priority/P3" "0075CA" "低：优化/体验"

  # Type
  create_label $REPO "type/bug"      "EE0701" "缺陷修复"
  create_label $REPO "type/feature"  "84B6EB" "新功能"
  create_label $REPO "type/chore"    "CCCCCC" "工程任务"
  create_label $REPO "type/refactor" "FEF2C0" "重构"

  # Phase
  create_label $REPO "phase/0" "F9D0C4" "Phase 0：基础设施"
  create_label $REPO "phase/1" "FEF2C0" "Phase 1：核心电商"
  create_label $REPO "phase/2" "C2E0C6" "Phase 2：增强功能"
  create_label $REPO "phase/3" "BFD4F2" "Phase 3：国际化"
  create_label $REPO "phase/4" "D4C5F9" "Phase 4：扩展"

  # Module（M1~M23，示例，按需补充）
  create_label $REPO "module/M01" "EDEDED" "基础设施 & CI/CD"
  create_label $REPO "module/M02" "EDEDED" "认证 & 用户"
  create_label $REPO "module/M03" "EDEDED" "商品目录"
  create_label $REPO "module/M04" "EDEDED" "购物车"
  create_label $REPO "module/M05" "EDEDED" "结账 & 支付"
  create_label $REPO "module/M06" "EDEDED" "订单管理"
  # ... 依此类推至 M23
done
```

### Issue 模板

**功能需求模板** — `.github/ISSUE_TEMPLATE/feature_request.md`

```markdown
---
name: 功能需求
about: 提出新功能或功能增强
title: "[feat] "
labels: "type/feature"
assignees: ""
---

## 需求背景
<!-- 为什么需要这个功能？解决什么问题？ -->

## 功能描述
<!-- 具体要实现什么？ -->

## 验收标准
- [ ] AC-1：
- [ ] AC-2：
- [ ] AC-3：

## 技术方案（可选）
<!-- 初步技术思路，CTO 填写 -->

## 相关文档
- ADR：（待关联）
- 设计稿：（如有）

## 预估工时
<!-- 小时 -->
```

**Bug 报告模板** — `.github/ISSUE_TEMPLATE/bug_report.md`

```markdown
---
name: Bug 报告
about: 报告功能异常
title: "[bug] "
labels: "type/bug"
assignees: ""
---

## 问题描述
<!-- 一句话描述 bug -->

## 复现步骤
1.
2.
3.

## 期望行为

## 实际行为

## 环境信息
- 环境：[ ] Production  [ ] Staging  [ ] Test
- 浏览器 / 客户端：
- 相关截图 / 日志：

## 优先级评估
- 影响范围：
- 是否阻塞核心流程：[ ] 是  [ ] 否
```

**Codex 任务模板** — `.github/ISSUE_TEMPLATE/codex_task.md`

```markdown
---
name: Codex 任务
about: CTO 下发给 Codex AI 的编码任务
title: "[codex] "
labels: "type/chore"
assignees: ""
---

## 关联需求 Issue
Refs #

## 目标仓库
- [ ] nextjs-starter-medusa（前端，yarn）
- [ ] nordhjem-medusa-backend（后端，npm）

## 任务描述
<!-- 清晰描述要修改 / 新增的代码 -->

## 影响文件
- `src/...`

## 完成定义（DoD）
- [ ] TypeScript 无编译错误
- [ ] ESLint 无错误
- [ ] 单元测试通过（如适用）
- [ ] CI 全绿
- [ ] PR 描述包含 Closes #N

## Codex Prompt
\```
（在此粘贴完整 Codex prompt）
\```
```

### PR 关联 Issue

PR 描述必须包含以下任一关键字，使 Issue 在 merge 后自动关闭：

```
Closes #42
Fixes #42
Resolves #42
```

### 自定义字段配置

在 Project Settings → Fields 中添加：

| 字段名 | 类型 | 选项/说明 |
|--------|------|-----------|
| Status | Single select | Backlog / Todo / In Progress / In Review / Done / Blocked |
| Priority | Single select | P0 / P1 / P2 / P3 |
| Phase | Single select | Phase 0 / Phase 1 / Phase 2 / Phase 3 / Phase 4 |
| Module | Single select | M01 ~ M23 |
| Sprint | Iteration | 两周一个 Sprint，格式 Sprint N（YYYY-MM-DD）|
| Sprint End Date | Date | Roadmap 视图使用 |
| Estimate (h) | Number | 预估工时（小时）|

---

## 5.3 设计评审流程

### 原则

- **CTO 自主完成**，无需 Owner 参与，不阻塞开发节奏
- 对于简单 Bug 修复（< 1h）或配置变更，可跳过 ADR，直接在 Issue 评论中简述方案
- 对于以下场景**必须**写 ADR：
  - 引入新的第三方依赖
  - 改动数据库 schema
  - 改动 API 接口契约
  - 影响性能的架构决策
  - 安全相关变更

### ADR 触发条件

```
预计工时 > 2h
  OR 影响 DB schema
  OR 引入新依赖
  OR 改动 API 契约
  OR 安全/性能相关
       ↓ Yes
   必须写 ADR
       ↓ No
   Issue 评论简述方案即可
```

### ADR 文档格式

存放位置：`docs/ADR/NNNN-kebab-case-title.md`（NNNN 四位数字自增）

```markdown
# ADR-NNNN: 标题

**日期**：YYYY-MM-DD  
**状态**：[草稿 | 已接受 | 已废弃 | 已取代]  
**关联 Issue**：#N  

---

## 背景

<!-- 为什么需要做这个决策？当前的问题是什么？ -->

## 决策驱动因素

- 约束 1（例如：无法停机迁移）
- 约束 2（例如：性能要求 < 200ms）

## 方案对比

### 方案 A：{名称}

**描述**：…  
**优点**：…  
**缺点**：…  

### 方案 B：{名称}

**描述**：…  
**优点**：…  
**缺点**：…  

## 决策

**采用方案 X**，理由：…

## 影响

- 正面影响：…
- 负面影响 / 风险：…
- 后续行动：…
```

### 操作步骤

```bash
# 1. 确认 ADR 编号
ls docs/ADR/ | tail -1   # 查看最新编号，+1

# 2. 创建 ADR 文件
export ADR_NUM="0013"
export ADR_SLUG="medusa-plugin-selection"
cp docs/ADR/TEMPLATE.md docs/ADR/${ADR_NUM}-${ADR_SLUG}.md

# 3. 填写 ADR 内容（在编辑器中完成）

# 4. 提交到仓库
git add docs/ADR/${ADR_NUM}-${ADR_SLUG}.md
git commit -m "docs(adr): add ADR-${ADR_NUM} ${ADR_SLUG}"
git push origin main   # ADR 直接推 main，不需要 PR

# 5. 在 Issue 中评论关联
gh issue comment $ISSUE_NUMBER \
  --repo Nickwenniyxiao-art/nextjs-starter-medusa \
  --body "设计评审完成，见 docs/ADR/${ADR_NUM}-${ADR_SLUG}.md"
```

---

## 5.x 检查项 C-049 ~ C-060

| 编号 | 检查项 | 负责人 | 状态 |
|------|--------|--------|------|
| C-049 | GitHub Issues 启用，两个仓库均已配置 Issue 模板（feature/bug/codex）| CTO | ⬜ |
| C-050 | GitHub Project "NordHjem Sprint Board" 已创建，含 Board + Table + Roadmap 三视图 | CTO | ⬜ |
| C-051 | 自定义字段 Status / Priority / Phase / Module / Sprint 已配置 | CTO | ⬜ |
| C-052 | 标签体系（priority/P0~P3, type, phase, module）已在两仓库创建 | CTO | ⬜ |
| C-053 | `docs/ADR/` 目录已建立，含 TEMPLATE.md | CTO | ⬜ |
| C-054 | PR 模板 `.github/pull_request_template.md` 已配置，含 Closes #N 提示 | CTO | ⬜ |
| C-055 | `ai-review.yml` workflow 已创建并可正常触发 | CTO | ⬜ |
| C-056 | `auto-merge.yml` workflow 已创建 | CTO | ⬜ |
| C-057 | Test 环境 CD workflow `deploy-test.yml` 已配置，develop 分支 push 触发 | CTO | ⬜ |
| C-058 | Staging 环境 CD workflow `deploy-staging.yml` 已配置 | CTO | ⬜ |
| C-059 | Production 环境 CD workflow `deploy-production.yml` 已配置，含手动确认 YES | CTO | ⬜ |
| C-060 | 所有开发人员（含 Codex）创建 PR 时均使用规范分支命名 feat/fix/chore/docs/refactor | CTO | ⬜ |

---

# 第 6 章 质量保障

本章定义 NordHjem 的测试策略、代码质量标准和 CI 质量门禁，确保每次变更不引入回退。

---

## 6.1 测试金字塔

```
        /\
       /E2E\        ~5%  · Playwright（Chromium + WebKit）
      /──────\             · 关键用户旅程
     /  集成  \      ~15% · API 级别端到端测试
    /──────────\           · Medusa API + 数据库
   /  单元测试  \    ~80% · Jest（后端）/ Vitest（前端）
  /──────────────\         · 纯函数、hooks、service 逻辑
```

**覆盖率目标**

| 层级 | 目标覆盖率 | 工具 | 状态 |
|------|-----------|------|------|
| 单元测试 | ≥ 80%（核心模块）| Jest / Vitest | 待搭建（Phase 1）|
| 集成测试 | ≥ 60%（API 路由）| Supertest + Jest | 待搭建（Phase 1）|
| E2E 测试 | 覆盖 10 条关键路径 | Playwright | 部分完成 |

---

## 6.2 测试框架配置

### 后端：Jest + ts-jest

**安装**：

```bash
cd nordhjem-medusa-backend

npm install --save-dev \
  jest \
  ts-jest \
  @types/jest \
  supertest \
  @types/supertest
```

**配置文件** — `jest.config.ts`：

```typescript
import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/migrations/**',
    '!src/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'lcov', 'json-summary'],
  setupFilesAfterFramework: ['<rootDir>/src/test/setup.ts'],
}

export default config
```

**测试 Setup 文件** — `src/test/setup.ts`：

```typescript
// 全局测试环境配置
import { config } from 'dotenv'
config({ path: '.env.test' })

// 全局 mock（如 Redis、外部 API）
jest.mock('../lib/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  },
}))
```

**单元测试示例** — `src/modules/cart/cart.service.test.ts`：

```typescript
import { CartService } from './cart.service'

describe('CartService', () => {
  let service: CartService

  beforeEach(() => {
    service = new CartService()
  })

  describe('calculateTotal', () => {
    it('should calculate total with discount', () => {
      const items = [
        { price: 100_00, quantity: 2 },  // 单位：分
        { price: 50_00, quantity: 1 },
      ]
      const discount = 10_00  // 10 元优惠

      expect(service.calculateTotal(items, discount)).toBe(240_00)
    })

    it('should not allow negative total', () => {
      const items = [{ price: 5_00, quantity: 1 }]
      const discount = 100_00

      expect(service.calculateTotal(items, discount)).toBe(0)
    })
  })
})
```

**npm scripts** — `package.json`：

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --runInBand"
  }
}
```

---

### 前端：Vitest

**安装**：

```bash
cd nextjs-starter-medusa

yarn add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**配置文件** — `vitest.config.ts`：

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.stories.{ts,tsx}',
        'src/test/**',
        'src/app/**/page.tsx',    // 页面级组件由 E2E 覆盖
        'src/app/**/layout.tsx',
      ],
      thresholds: {
        branches: 70,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**测试 Setup** — `src/test/setup.ts`：

```typescript
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))
```

**Hook 测试示例** — `src/hooks/useCart.test.ts`：

```typescript
import { renderHook, act } from '@testing-library/react'
import { useCart } from './useCart'

describe('useCart', () => {
  it('should add item to cart', async () => {
    const { result } = renderHook(() => useCart())

    await act(async () => {
      await result.current.addItem({ variantId: 'var_01', quantity: 2 })
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
  })
})
```

**yarn scripts** — `package.json`：

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ci": "vitest run --coverage --reporter=verbose"
  }
}
```

---

### E2E：Playwright

**当前状态**：`e2e-monitor/` 目录已存在，仅 Chromium。

**补充 WebKit 支持**：

```bash
cd e2e-monitor
npx playwright install webkit   # 安装 WebKit 浏览器
```

**更新 `playwright.config.ts`**：

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://nordhjem.store',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // 移动端（Phase 2 加入）
    // { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
})
```

**关键 E2E 测试用例**（`tests/critical-paths.spec.ts`）：

```typescript
import { test, expect } from '@playwright/test'

test.describe('关键用户旅程', () => {
  test('C1: 首页正常加载', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/NordHjem/)
    await expect(page.locator('nav')).toBeVisible()
  })

  test('C2: 商品列表页可访问', async ({ page }) => {
    await page.goto('/store')
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible()
  })

  test('C3: 商品详情页', async ({ page }) => {
    await page.goto('/store')
    await page.locator('[data-testid="product-card"]').first().click()
    await expect(page.locator('[data-testid="add-to-cart"]')).toBeVisible()
  })

  test('C4: 加入购物车', async ({ page }) => {
    await page.goto('/store')
    await page.locator('[data-testid="product-card"]').first().click()
    await page.locator('[data-testid="add-to-cart"]').click()
    await expect(page.locator('[data-testid="cart-count"]')).toContainText('1')
  })

  test('C5: 购物车页面', async ({ page }) => {
    // 前置：加入一个商品
    await page.goto('/cart')
    await expect(page.locator('[data-testid="cart-container"]')).toBeVisible()
  })
})
```

---

## 6.3 代码覆盖率

### CI 中的覆盖率检查

```yaml
# .github/workflows/ci-frontend.yml（覆盖率步骤）
- name: Run tests with coverage
  run: yarn test:ci

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
    files: coverage/lcov.info
    flags: frontend
    fail_ci_if_error: false   # Phase 1：不强制，Phase 2 改为 true

- name: Check coverage thresholds
  run: |
    LINES=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
    if (( $(echo "$LINES < 80" | bc -l) )); then
      echo "❌ 覆盖率 ${LINES}% 低于 80% 阈值"
      exit 1
    fi
    echo "✅ 覆盖率 ${LINES}% 达标"
```

### 覆盖率豁免规则

在文件顶部添加注释可跳过覆盖率统计（需在 PR 中说明理由）：

```typescript
/* istanbul ignore file */   // Jest
// @vitest-exclude            // Vitest（整个文件）

// 单行跳过：
/* istanbul ignore next */
```

---

## 6.4 安全扫描

### npm audit

```bash
# 后端（nordhjem-medusa-backend）
npm audit --audit-level=high
# 退出码非 0 表示有 high/critical 漏洞

# 前端（nextjs-starter-medusa）
yarn npm audit --all --recursive
```

**CI 中集成**（`.github/workflows/ci-backend.yml`）：

```yaml
- name: Security audit
  run: |
    npm audit --audit-level=high --json > audit-report.json || true
    CRITICAL=$(cat audit-report.json | jq '.metadata.vulnerabilities.critical')
    HIGH=$(cat audit-report.json | jq '.metadata.vulnerabilities.high')
    echo "Critical: $CRITICAL, High: $HIGH"
    if [ "$CRITICAL" -gt 0 ] || [ "$HIGH" -gt 0 ]; then
      echo "❌ 发现 critical/high 安全漏洞，请执行 npm audit fix"
      cat audit-report.json | jq '.vulnerabilities'
      exit 1
    fi
    echo "✅ 无 critical/high 漏洞"
```

### 依赖更新策略

```bash
# 每月第一个工作日执行（可加入 cron workflow）
npm outdated          # 查看过期依赖
npm update            # 更新 minor/patch 版本
# major 版本升级需单独 PR + 测试

# 前端
yarn upgrade-interactive   # 交互式选择要升级的依赖
```

**月度依赖审查 Workflow**（`.github/workflows/monthly-deps-check.yml`）：

```yaml
name: Monthly Dependency Check

on:
  schedule:
    - cron: '0 9 1 * *'   # 每月 1 日 09:00 UTC
  workflow_dispatch:

jobs:
  check-deps:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Check outdated (backend)
        working-directory: ./nordhjem-medusa-backend
        run: |
          npm install
          npm outdated > outdated-report.txt || true
          cat outdated-report.txt

      - name: Create issue if outdated
        run: |
          if [ -s outdated-report.txt ]; then
            gh issue create \
              --title "[chore] 月度依赖更新检查 $(date +%Y-%m)" \
              --body "$(cat outdated-report.txt)" \
              --label "type/chore,priority/P3" \
              --repo ${{ github.repository }}
          fi
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 6.5 CI 质量门禁

### 前端 CI（`nextjs-starter-medusa`）

`.github/workflows/ci-frontend.yml`：

```yaml
name: Frontend CI

on:
  push:
    branches: [main, develop, staging]
    paths:
      - 'src/**'
      - 'public/**'
      - 'package.json'
      - 'yarn.lock'
      - '*.config.*'
  pull_request:
    branches: [main, develop, staging]

jobs:
  quality-gate:
    name: Quality Gate
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: .

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      # 门禁 1：Lint
      - name: Lint
        run: yarn lint
        # 失败 → 阻断 merge

      # 门禁 2：Type Check
      - name: Type Check
        run: yarn type-check
        # 失败 → 阻断 merge

      # 门禁 3：Build
      - name: Build
        run: yarn build
        env:
          NEXT_PUBLIC_MEDUSA_BACKEND_URL: ${{ secrets.NEXT_PUBLIC_MEDUSA_BACKEND_URL }}
          NEXT_PUBLIC_DEFAULT_REGION: no
        # 失败 → 阻断 merge

      # 门禁 4：Test（Phase 1 待加入）
      - name: Test
        run: yarn test:ci
        # 失败 → 阻断 merge

      # 门禁 5：Security Audit（Phase 1 待加入）
      - name: Security Audit
        run: |
          yarn npm audit --all --recursive --json > audit.json || true
          node -e "
            const r = require('./audit.json');
            const critical = r.metadata?.vulnerabilities?.critical ?? 0;
            const high = r.metadata?.vulnerabilities?.high ?? 0;
            if (critical > 0 || high > 0) {
              console.error('❌ critical:', critical, 'high:', high);
              process.exit(1);
            }
            console.log('✅ 安全检查通过');
          "
```

### 后端 CI（`nordhjem-medusa-backend`）

`.github/workflows/ci-backend.yml`：

```yaml
name: Backend CI

on:
  push:
    branches: [main, develop, staging]
    paths:
      - 'src/**'
      - 'package.json'
      - 'package-lock.json'
      - '*.config.*'
  pull_request:
    branches: [main, develop, staging]

jobs:
  quality-gate:
    name: Quality Gate
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: medusa_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      # 门禁 1：Lint
      - name: Lint
        run: npm run lint

      # 门禁 2：Type Check
      - name: Type Check
        run: npm run type-check

      # 门禁 3：Build
      - name: Build
        run: npm run build

      # 门禁 4：Test（Phase 1 待搭建）
      - name: Test
        run: npm run test:ci
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/medusa_test
          REDIS_URL: redis://localhost:6379

      # 门禁 5：Security Audit
      - name: Security Audit
        run: npm run audit:ci
```

### 质量门禁总结

| 门禁 | 前端 | 后端 | 当前状态 | Phase |
|------|------|------|---------|-------|
| ESLint | ✅ | ✅ | 已上线 | 0 |
| TypeScript type-check | ✅ | ✅ | 已上线 | 0 |
| Build | ✅ | ✅ | 已上线 | 0 |
| 单元测试 | ✅ | ✅ | 待加入 | 1 |
| 覆盖率 ≥ 80% | ✅ | ✅ | 待加入 | 1 |
| npm audit（no critical/high）| ✅ | ✅ | 待加入 | 1 |
| E2E Smoke Test | ✅ | — | 部分完成 | 1 |

---

## 6.x 检查项 C-061 ~ C-068

| 编号 | 检查项 | 负责人 | 状态 |
|------|--------|--------|------|
| C-061 | 后端 `jest.config.ts` 已创建，`npm run test:ci` 可执行 | CTO | ⬜ |
| C-062 | 前端 `vitest.config.ts` 已创建，`yarn test:ci` 可执行 | CTO | ⬜ |
| C-063 | Playwright config 已添加 WebKit project，`npx playwright install webkit` 已执行 | CTO | ⬜ |
| C-064 | 前端 CI workflow 包含 lint / type-check / build 三个门禁 | CTO | ✅ |
| C-065 | 后端 CI workflow 包含 lint / type-check / build 三个门禁 | CTO | ✅ |
| C-066 | CI 中集成 `npm audit --audit-level=high`，high/critical 阻断 merge | CTO | ⬜ |
| C-067 | 覆盖率检查步骤加入 CI，阈值 80% | CTO | ⬜ |
| C-068 | 月度依赖检查 cron workflow 已配置 | CTO | ⬜ |

---

# 第 7 章 运维与监控

本章描述 NordHjem 生产环境的基础设施管理、部署操作、监控告警体系。

---

## 7.1 VPS 管理

### 服务器规格

| 项目 | 详情 |
|------|------|
| IP 地址 | 66.94.127.117 |
| 操作系统 | Ubuntu 24.04 LTS |
| CPU | 2 vCPU |
| 内存 | 8 GB RAM |
| 磁盘 | 240 GB SSD |
| SSH 用户 | root |

### SSH 访问

```bash
# 标准连接
ssh root@66.94.127.117

# 推荐：配置 ~/.ssh/config（本地执行）
cat >> ~/.ssh/config << 'EOF'
Host nordhjem
  HostName 66.94.127.117
  User root
  IdentityFile ~/.ssh/id_ed25519_nordhjem
  ServerAliveInterval 60
  ServerAliveCountMax 3
EOF

# 之后可使用别名连接
ssh nordhjem
```

### 目录结构

```
/opt/nordhjem/
├── production/
│   ├── backend/          # Medusa 后端（Docker Compose）
│   │   ├── docker-compose.yml
│   │   ├── .env
│   │   └── medusa-config.js
│   └── frontend/         # Next.js 前端（PM2）
│       ├── .env.local
│       └── ecosystem.config.js
├── staging/
│   ├── backend/
│   └── frontend/
├── test/
│   ├── backend/
│   └── frontend/
├── backups/
│   ├── production/       # pg_dump 备份文件
│   ├── staging/
│   └── test/
└── logs/
    ├── nginx/
    ├── pm2/
    └── docker/
```

**初始化目录**（首次部署时执行）：

```bash
ssh root@66.94.127.117 << 'EOF'
mkdir -p /opt/nordhjem/{production,staging,test}/{backend,frontend}
mkdir -p /opt/nordhjem/backups/{production,staging,test}
mkdir -p /opt/nordhjem/logs/{nginx,pm2,docker}
chown -R root:root /opt/nordhjem
chmod -R 750 /opt/nordhjem
EOF
```

### 常用运维命令

```bash
# 查看系统资源
htop
df -h          # 磁盘使用
free -h        # 内存使用
docker stats   # 容器资源占用

# 查看所有服务状态
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
pm2 list

# 查看 Nginx 状态
systemctl status nginx
nginx -t          # 检查配置语法

# 实时日志
pm2 logs nordhjem-frontend --lines 100
docker logs -f nordhjem-medusa --tail 100
tail -f /var/log/nginx/nordhjem.error.log
```

---

## 7.2 Docker 部署

### 后端 docker-compose.yml

`/opt/nordhjem/production/backend/docker-compose.yml`：

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: nordhjem-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB:-medusa_production}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - /opt/nordhjem/backups/production:/backups
    ports:
      - "127.0.0.1:5432:5432"   # 仅监听本地，不对外暴露
    networks:
      - nordhjem-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: nordhjem-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "127.0.0.1:6379:6379"   # 仅监听本地
    networks:
      - nordhjem-net
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  medusa:
    image: node:20-alpine
    container_name: nordhjem-medusa
    restart: unless-stopped
    working_dir: /app
    command: sh -c "npm run migrations:run && npm start"
    env_file:
      - .env
    volumes:
      - /opt/nordhjem/production/backend/app:/app
      - /app/node_modules   # 匿名卷，防止覆盖
    ports:
      - "127.0.0.1:9000:9000"
    networks:
      - nordhjem-net
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:9000/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

volumes:
  postgres_data:
    name: nordhjem-postgres-production
  redis_data:
    name: nordhjem-redis-production

networks:
  nordhjem-net:
    name: nordhjem-production
    driver: bridge
```

### 前端 PM2 配置

`/opt/nordhjem/production/frontend/ecosystem.config.js`：

```javascript
module.exports = {
  apps: [
    {
      name: 'nordhjem-frontend',
      cwd: '/opt/nordhjem/production/frontend/app',
      script: 'node_modules/.bin/next',
      args: 'start',
      instances: 1,           // 2 vCPU 下建议 1 实例
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_file: '/opt/nordhjem/production/frontend/.env.local',
      max_memory_restart: '1G',
      log_file: '/opt/nordhjem/logs/pm2/nordhjem-frontend.log',
      out_file: '/opt/nordhjem/logs/pm2/nordhjem-frontend-out.log',
      error_file: '/opt/nordhjem/logs/pm2/nordhjem-frontend-err.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      watch: false,
      autorestart: true,
      restart_delay: 3000,
    },
  ],
}
```

### Nginx 配置

`/etc/nginx/sites-available/nordhjem`：

```nginx
# 前端：nordhjem.store
server {
    listen 80;
    server_name nordhjem.store www.nordhjem.store;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name nordhjem.store www.nordhjem.store;

    ssl_certificate /etc/letsencrypt/live/nordhjem.store/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nordhjem.store/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 安全响应头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

    # Next.js 静态资源缓存
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000/_next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# 后端：api.nordhjem.store
server {
    listen 80;
    server_name api.nordhjem.store;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.nordhjem.store;

    ssl_certificate /etc/letsencrypt/live/api.nordhjem.store/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.nordhjem.store/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    add_header X-Content-Type-Options "nosniff" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # 限流：防止 API 滥用
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;
    limit_req zone=api burst=60 nodelay;

    location / {
        proxy_pass http://127.0.0.1:9000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
        proxy_send_timeout 120s;

        # CORS（Medusa 自身处理，Nginx 不重复添加）
    }

    # 上传文件大小限制
    client_max_body_size 50M;
}
```

**部署 Nginx 配置**：

```bash
ln -s /etc/nginx/sites-available/nordhjem /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## 7.3 数据库备份

### 备份脚本

`/opt/nordhjem/scripts/backup-db.sh`：

```bash
#!/usr/bin/env bash
# NordHjem 数据库备份脚本
# 用法: ./backup-db.sh [production|staging|test]

set -euo pipefail

ENVIRONMENT="${1:-production}"
BACKUP_DIR="/opt/nordhjem/backups/${ENVIRONMENT}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql.gz"
KEEP_LAST=10   # 最多保留 10 个备份

# 容器名和数据库名按环境区分
case "$ENVIRONMENT" in
  production)
    CONTAINER="nordhjem-postgres"
    DB_NAME="medusa_production"
    ;;
  staging)
    CONTAINER="nordhjem-postgres-staging"
    DB_NAME="medusa_staging"
    ;;
  test)
    CONTAINER="nordhjem-postgres-test"
    DB_NAME="medusa_test"
    ;;
  *)
    echo "❌ 未知环境: $ENVIRONMENT"
    exit 1
    ;;
esac

echo "🔄 开始备份 ${ENVIRONMENT} 数据库..."

# 确保备份目录存在
mkdir -p "$BACKUP_DIR"

# 执行备份
docker exec "$CONTAINER" \
  pg_dump -U postgres "$DB_NAME" \
  | gzip > "$BACKUP_FILE"

BACKUP_SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
echo "✅ 备份完成：${BACKUP_FILE}（${BACKUP_SIZE}）"

# 清理旧备份，保留最近 KEEP_LAST 个
BACKUP_COUNT=$(ls -1 "${BACKUP_DIR}"/backup_*.sql.gz 2>/dev/null | wc -l)
if [ "$BACKUP_COUNT" -gt "$KEEP_LAST" ]; then
  DELETE_COUNT=$((BACKUP_COUNT - KEEP_LAST))
  ls -1t "${BACKUP_DIR}"/backup_*.sql.gz \
    | tail -n "$DELETE_COUNT" \
    | xargs rm -f
  echo "🗑️  已删除 ${DELETE_COUNT} 个旧备份"
fi

echo "📦 当前备份数量：$(ls -1 "${BACKUP_DIR}"/backup_*.sql.gz | wc -l)/${KEEP_LAST}"
```

```bash
chmod +x /opt/nordhjem/scripts/backup-db.sh

# 手动执行备份
/opt/nordhjem/scripts/backup-db.sh production

# 恢复备份
gunzip < /opt/nordhjem/backups/production/backup_20260313_210000.sql.gz \
  | docker exec -i nordhjem-postgres psql -U postgres medusa_production
```

### 在 CD 中自动备份

`.github/workflows/deploy-production.yml` 部署前备份步骤：

```yaml
- name: Backup database before deploy
  uses: appleboy/ssh-action@v1
  with:
    host: 66.94.127.117
    username: root
    key: ${{ secrets.VPS_SSH_KEY }}
    script: |
      /opt/nordhjem/scripts/backup-db.sh production
      echo "✅ 部署前备份完成"
```

---

## 7.4 监控

### Sentry（前端错误追踪）

前端已集成 Sentry，关键配置点：

```typescript
// next.config.js（已有）
const { withSentryConfig } = require('@sentry/nextjs')

// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_APP_ENV,   // production / staging / test
  tracesSampleRate: 0.1,    // 生产环境采样 10%
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,   // 出错时 100% 录制
})
```

**告警规则配置**（在 Sentry 控制台设置）：

| 条件 | 告警频道 |
|------|---------|
| 新错误出现 | Telegram（Phase 2）|
| 错误率 > 5%/min | Telegram |
| 性能 P95 > 3s | Telegram |

### Uptime Kuma（待部署，Phase 2）

```bash
# 在 VPS 上部署 Uptime Kuma
docker run -d \
  --name uptime-kuma \
  --restart unless-stopped \
  -p 127.0.0.1:3001:3001 \
  -v uptime-kuma-data:/app/data \
  louislam/uptime-kuma:1

# Nginx 反向代理 → status.nordhjem.store（Phase 2 配置）
```

**监控项配置**（Uptime Kuma 部署后配置）：

| 名称 | URL/地址 | 间隔 | 类型 |
|------|---------|------|------|
| 前端主站 | https://nordhjem.store | 2min | HTTP |
| 后端 API | https://api.nordhjem.store/health | 2min | HTTP |
| 商品列表 API | https://api.nordhjem.store/store/products | 5min | HTTP |
| PostgreSQL | 127.0.0.1:5432 | 1min | TCP |
| Redis | 127.0.0.1:6379 | 1min | TCP |
| 磁盘空间 | — | 5min | 脚本 |

### Playwright 定时巡检

当前：每 2 小时（GitHub Actions cron）。Phase 2 目标：调整为 **15 分钟**。

```yaml
# .github/workflows/monitor-cron.yml（当前）
on:
  schedule:
    - cron: '0 */2 * * *'   # 当前：每 2 小时

# Phase 2 调整为：
on:
  schedule:
    - cron: '*/15 * * * *'  # 每 15 分钟
```

---

## 7.5 告警通知

### Telegram Bot（Phase 2）

**创建 Bot**：

1. 在 Telegram 联系 `@BotFather`
2. 发送 `/newbot`，命名为 `NordHjem Ops Bot`
3. 获取 `BOT_TOKEN`
4. 创建一个 Telegram 群组，添加 Bot，获取 `CHAT_ID`
5. 将 `TELEGRAM_BOT_TOKEN` 和 `TELEGRAM_CHAT_ID` 加入 GitHub Secrets

**告警发送脚本**（`/opt/nordhjem/scripts/alert.sh`）：

```bash
#!/usr/bin/env bash
# 用法: ./alert.sh "告警内容" [critical|warning|info]

MESSAGE="$1"
LEVEL="${2:-info}"
BOT_TOKEN="${TELEGRAM_BOT_TOKEN}"
CHAT_ID="${TELEGRAM_CHAT_ID}"

ICON="ℹ️"
[ "$LEVEL" = "warning" ] && ICON="⚠️"
[ "$LEVEL" = "critical" ] && ICON="🚨"

FULL_MESSAGE="${ICON} [NordHjem] ${MESSAGE}
时间: $(date '+%Y-%m-%d %H:%M:%S %Z')
服务器: 66.94.127.117"

curl -s -X POST \
  "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
  -d "chat_id=${CHAT_ID}" \
  -d "text=${FULL_MESSAGE}" \
  -d "parse_mode=HTML" \
  > /dev/null
```

**GitHub Actions 告警集成**：

```yaml
- name: Notify on failure
  if: failure()
  run: |
    curl -s -X POST \
      "https://api.telegram.org/bot${{ secrets.TELEGRAM_BOT_TOKEN }}/sendMessage" \
      -d "chat_id=${{ secrets.TELEGRAM_CHAT_ID }}" \
      -d "text=🚨 [NordHjem] 部署失败%0A环境: Production%0A分支: ${{ github.ref_name }}%0A触发: ${{ github.actor }}%0AAction: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
```

### 告警场景

| 告警 | 触发条件 | 级别 | 响应 |
|------|---------|------|------|
| 服务宕机 | Uptime Kuma 连续 3 次检测失败 | critical | P0/P1 处理流程 |
| 部署失败 | GitHub Actions workflow 失败 | warning | 检查日志，回滚 |
| 磁盘使用 > 80% | 每日磁盘检查脚本 | warning | 清理日志/备份 |
| 数据库连接异常 | 后端健康检查失败 | critical | 检查 Docker，重启容器 |
| 证书即将到期 | certbot renew 检查（30 天前）| warning | 手动 certbot renew |
| E2E 巡检失败 | Playwright cron workflow 失败 | warning | 查看截图，排查原因 |

---

## 7.6 事故等级定义

| 等级 | 定义 | 响应时间 | 升级路径 |
|------|------|---------|---------|
| **P0** | 生产环境完全不可用（网站打不开、API 全面返回 5xx）| **5 分钟内**开始响应 | CTO 立即介入 + 通知 Owner（电话/微信）|
| **P1** | 核心功能受损（支付无法完成、下单失败、用户无法登录）| **15 分钟内**开始响应 | CTO 立即介入，Owner 知会（非紧急）|
| **P2** | 非核心功能异常（搜索报错、图片加载慢、局部页面样式错乱）| **4 小时内**排查 | CTO 排入当前 Sprint |
| **P3** | 优化项 / 体验问题（文案错别字、交互细节、性能轻微下降）| **下个 Sprint** | CTO 记录到 backlog |

**P0 快速止血清单**（< 5 分钟）：

```bash
# 1. 检查容器状态
docker ps --filter "name=nordhjem"

# 2. 检查 PM2
pm2 list

# 3. 检查 Nginx
systemctl status nginx

# 4. 查看最近错误日志（最后 50 行）
docker logs nordhjem-medusa --tail 50
pm2 logs nordhjem-frontend --lines 50 --nostream
tail -50 /var/log/nginx/nordhjem.error.log

# 5. 快速重启（先尝试）
docker restart nordhjem-medusa
pm2 restart nordhjem-frontend

# 6. 如仍不可用 → 执行回滚（见第 8 章 8.2）
```

---

## 7.x 检查项 C-069 ~ C-080

| 编号 | 检查项 | 负责人 | 状态 |
|------|--------|--------|------|
| C-069 | VPS 目录结构 `/opt/nordhjem/` 已按规范创建 | CTO | ⬜ |
| C-070 | SSH config 中 `nordhjem` 别名已配置，可无密码连接 | CTO | ⬜ |
| C-071 | 后端 `docker-compose.yml` 已部署，三个服务（postgres/redis/medusa）健康运行 | CTO | ⬜ |
| C-072 | 前端 PM2 ecosystem.config.js 已配置，`pm2 start` 正常 | CTO | ⬜ |
| C-073 | Nginx 反向代理配置正确，nordhjem.store 和 api.nordhjem.store 均可访问 | CTO | ⬜ |
| C-074 | SSL 证书已申请（Let's Encrypt），HTTPS 正常，自动续期 cron 已设置 | CTO | ⬜ |
| C-075 | 备份脚本 `/opt/nordhjem/scripts/backup-db.sh` 已创建并测试 | CTO | ⬜ |
| C-076 | CD workflow 部署前自动调用备份脚本 | CTO | ⬜ |
| C-077 | Sentry DSN 已配置到前端生产环境，测试错误可正常上报 | CTO | ⬜ |
| C-078 | Playwright cron 巡检 workflow 正常运行（当前每 2 小时）| CTO | ✅ |
| C-079 | Telegram Bot Token 和 Chat ID 已加入 GitHub Secrets（Phase 2）| CTO | ⬜ |
| C-080 | 告警脚本 `/opt/nordhjem/scripts/alert.sh` 已创建并测试（Phase 2）| CTO | ⬜ |

---

# 第 8 章 事故响应与复盘

本章定义 NordHjem 的事故响应 SOP、回滚操作手册和事后复盘规范，确保每次事故都有闭环。

---

## 8.1 事故响应流程

```
【Step 1】发现
   │  · 来源：Uptime Kuma 告警 / Sentry 告警 / Playwright 巡检失败 / 用户反馈
   │  · 确认是否真实事故（排除误报）
   │  · 记录发现时间
   │
   ▼
【Step 2】评估等级
   │  · 参考 7.6 节事故等级定义
   │  · 判断 P0/P1/P2/P3
   │  · P0/P1：立即启动响应，创建 GitHub Issue（type/bug, priority/P0|P1）
   │
   ▼
【Step 3】止血
   │  · 首选：回滚到上一个稳定版本（见 8.2）
   │  · 次选：临时关闭受影响功能（Feature Flag）
   │  · 目标：先恢复可用，再分析根因
   │  · 记录止血时间和操作
   │
   ▼
【Step 4】根因分析
   │  · 收集日志、监控数据、错误堆栈
   │  · 使用 5 Whys 方法追溯根本原因
   │  · 确认是代码 bug / 配置问题 / 基础设施故障 / 外部依赖
   │
   ▼
【Step 5】永久修复
   │  · 创建 fix/ 分支，走正常 PR 流程
   │  · 修复必须包含：
   │    - 修复代码
   │    - 复现该问题的测试用例（防止回退）
   │    - 更新 RUNBOOK.md（如果是新场景）
   │
   ▼
【Step 6】写 Postmortem
      · 事故发生后 48 小时内完成
      · 存放在 docs/POSTMORTEM/
      · 格式见 8.3 节
```

---

## 8.2 回滚操作

### 后端回滚

**方法一：通过 GitHub Actions 触发（推荐）**

```bash
# 在 GitHub 控制台操作：
# 1. 进入 Actions → deploy-production.yml
# 2. Run workflow
# 3. Branch：选择要回滚到的稳定 tag 或 commit
# 4. 输入 YES 确认
```

**方法二：SSH 直接回滚（紧急情况）**

```bash
ssh root@66.94.127.117

# 1. 进入后端目录
cd /opt/nordhjem/production/backend/app

# 2. 查看 Git 历史
git log --oneline -10

# 3. 回滚到指定 commit（不影响数据库）
git checkout <COMMIT_HASH>
npm install --production
npm run build

# 4. 重启 Medusa 容器
docker-compose -f /opt/nordhjem/production/backend/docker-compose.yml \
  up -d --force-recreate medusa

# 5. 验证健康状态
curl -f http://localhost:9000/health && echo "✅ 后端已恢复"
```

**数据库回滚**（仅在 schema 变更导致问题时需要）：

```bash
# ⚠️ 危险操作，需确认业务影响

# 1. 停止 Medusa 容器（避免继续写入）
docker stop nordhjem-medusa

# 2. 恢复最近备份
gunzip < /opt/nordhjem/backups/production/backup_20260313_XXXXXX.sql.gz \
  | docker exec -i nordhjem-postgres psql -U postgres medusa_production

# 3. 重启容器
docker start nordhjem-medusa

# 4. 验证
curl -f http://localhost:9000/health
```

### 前端回滚

**方法一：PM2 切换到上一个版本（推荐）**

```bash
ssh root@66.94.127.117

# 查看 PM2 进程状态
pm2 list

# 查看当前版本的 Next.js 构建
ls -lt /opt/nordhjem/production/frontend/app/.next/

# 回滚到上一个 Git 版本
cd /opt/nordhjem/production/frontend/app
git log --oneline -5
git checkout <PREVIOUS_COMMIT>

# 重新构建（如果 .next 构建不兼容）
yarn install --frozen-lockfile
yarn build

# 重启 PM2
pm2 restart nordhjem-frontend

# 验证
curl -f https://nordhjem.store && echo "✅ 前端已恢复"
```

**方法二：GitHub Actions 触发回滚**

```bash
# 触发 deploy-production.yml，选择指定 tag/commit
gh workflow run deploy-production.yml \
  --repo Nickwenniyxiao-art/nextjs-starter-medusa \
  --ref <STABLE_TAG_OR_COMMIT>
```

### 回滚验证清单

```bash
# 执行以下检查，确认回滚成功
echo "=== 后端健康检查 ==="
curl -sf https://api.nordhjem.store/health | jq .

echo "=== 前端可访问性 ==="
curl -sf -o /dev/null -w "HTTP %{http_code}\n" https://nordhjem.store

echo "=== 商品 API ==="
curl -sf "https://api.nordhjem.store/store/products?limit=1" | jq '.count'

echo "=== 容器状态 ==="
docker ps --filter "name=nordhjem" --format "{{.Names}}: {{.Status}}"

echo "=== PM2 状态 ==="
pm2 show nordhjem-frontend | grep -E "status|uptime|restarts"
```

---

## 8.3 Postmortem 规范

### 规则

- 事故发生后 **48 小时内**完成
- 存放路径：`docs/POSTMORTEM/YYYY-MM-DD-简要标题.md`
- **不指责个人**，聚焦系统和流程改进
- 行动项必须有负责人和截止日期

### 命名规范

```bash
# 示例
docs/POSTMORTEM/2026-03-13-payment-timeout-p1.md
docs/POSTMORTEM/2026-02-20-frontend-oom-crash-p0.md
```

### Postmortem 模板

`docs/POSTMORTEM/TEMPLATE.md`：

```markdown
# Postmortem：{事故一句话标题}

**日期**：YYYY-MM-DD  
**等级**：P0 / P1 / P2  
**状态**：[草稿 | 已完成 | 行动项追踪中]  
**作者**：CTO  

---

## 1. 事故概述

> 一句话描述：{时间} 发生了什么，影响了什么，持续了多久。

示例：2026-03-13 21:00 生产环境 Medusa 后端 OOM 崩溃，导致商品 API 不可用，持续 23 分钟。

---

## 2. 影响范围

| 维度 | 详情 |
|------|------|
| 受影响用户 | （估计人数 / 百分比）|
| 受影响功能 | （列出受影响的页面 / API）|
| 持续时间 | 发现时间 → 恢复时间（共 XX 分钟）|
| 数据损失 | 是 / 否（无数据损失）|

---

## 3. 事件时间线

| 时间 | 事件 |
|------|------|
| HH:MM | 监控告警触发 / 用户反馈 |
| HH:MM | CTO 开始响应 |
| HH:MM | 定位根因 |
| HH:MM | 开始止血操作 |
| HH:MM | 服务恢复 |
| HH:MM | 用户可正常访问 |

---

## 4. 根因分析（5 Whys）

**现象**：{描述用户看到的问题}

1. **Why 1**：为什么服务不可用？
   → {原因 1}

2. **Why 2**：为什么 {原因 1}？
   → {原因 2}

3. **Why 3**：为什么 {原因 2}？
   → {原因 3}

4. **Why 4**：为什么 {原因 3}？
   → {原因 4}

5. **Why 5**：为什么 {原因 4}？
   → **根本原因**：{根本原因描述}

---

## 5. 修复措施

### 临时止血
- {操作 1}（HH:MM 执行）
- {操作 2}

### 永久修复
- {PR 链接，Fixes #N}
- {描述代码/配置修改内容}

---

## 6. 行动项

> 防止同类问题复发的具体任务。

| # | 行动项 | 负责人 | 截止日期 | Issue |
|---|--------|--------|---------|-------|
| 1 | {具体任务，例如：为 Medusa 容器设置内存限制 1.5G}| CTO | YYYY-MM-DD | #{N} |
| 2 | {例如：添加 OOM 监控告警} | CTO | YYYY-MM-DD | #{N} |
| 3 | {例如：补充 OOM 场景的 Runbook}| CTO | YYYY-MM-DD | #{N} |

---

## 7. 经验教训

**做得好的**：
- {例如：告警响应及时，5 分钟内开始处理}

**需要改进的**：
- {例如：缺少容器内存限制配置}
- {例如：缺少 OOM 场景的 Runbook}

**后续优化方向**：
- {例如：Phase 2 引入 Kubernetes，配置资源 limits/requests}
```

### Postmortem 创建流程

```bash
# 1. 复制模板
DATE=$(date +%Y-%m-%d)
SLUG="payment-timeout-p1"   # 替换为实际事故简述
cp docs/POSTMORTEM/TEMPLATE.md "docs/POSTMORTEM/${DATE}-${SLUG}.md"

# 2. 填写内容（在事故发生后 48 小时内完成）

# 3. 提交
git add "docs/POSTMORTEM/${DATE}-${SLUG}.md"
git commit -m "docs(postmortem): add ${DATE} ${SLUG}"
git push origin main

# 4. 将行动项转化为 GitHub Issues
gh issue create \
  --title "[chore] Postmortem 行动项：${SLUG}" \
  --body "来自 Postmortem：docs/POSTMORTEM/${DATE}-${SLUG}.md\n\n行动项：..." \
  --label "type/chore,priority/P1"
```

---

## 8.4 Runbook 使用规范

### 第一原则

> **紧急情况发生时，第一步是查 `docs/RUNBOOK.md`，不要凭记忆操作。**

Runbook 是经过验证的操作手册，包含每个场景的精确命令，避免紧急情况下手忙脚乱出错。

### Runbook 目录结构

```
docs/
├── RUNBOOK.md             # 主入口（按场景索引）
└── runbooks/
    ├── 01-deployment.md   # 部署相关操作
    ├── 02-rollback.md     # 回滚操作（重要！）
    ├── 03-database.md     # 数据库维护
    ├── 04-nginx.md        # Nginx 操作
    ├── 05-ssl.md          # SSL 证书
    ├── 06-pm2.md          # PM2 操作
    ├── 07-docker.md       # Docker 操作
    └── 08-monitoring.md   # 监控告警
```

### RUNBOOK.md 主入口格式

```markdown
# NordHjem Runbook

> 紧急情况下，先看这里，找到对应场景，按步骤操作。

## 快速索引

| 场景 | 文档 |
|------|------|
| 网站打不开（P0）| [→ runbooks/02-rollback.md#p0-site-down](runbooks/02-rollback.md) |
| 后端 API 全部 5xx | [→ runbooks/07-docker.md#restart-medusa](runbooks/07-docker.md) |
| 前端 502 Bad Gateway | [→ runbooks/06-pm2.md#502-fix](runbooks/06-pm2.md) |
| 数据库连接失败 | [→ runbooks/03-database.md#connection-failed](runbooks/03-database.md) |
| SSL 证书过期 | [→ runbooks/05-ssl.md#renew](runbooks/05-ssl.md) |
| 磁盘空间不足 | [→ runbooks/08-monitoring.md#disk-full](runbooks/08-monitoring.md) |
| 部署前手动备份 | [→ runbooks/03-database.md#manual-backup](runbooks/03-database.md) |
| 手动触发生产部署 | [→ runbooks/01-deployment.md#manual-deploy](runbooks/01-deployment.md) |
```

### 新场景补充规范

遇到 Runbook 未覆盖的新场景：

```bash
# 1. 处理事故时，先用便签或草稿记录操作步骤
# 2. 事故解决后，在 1 小时内补充到对应 Runbook 文件
# 3. 格式：

## {场景名称} {#anchor}

**触发条件**：{什么情况下会触发}

**症状**：{用户/监控看到什么异常}

**操作步骤**：
\`\`\`bash
# 步骤 1
命令...

# 步骤 2
命令...
\`\`\`

**验证成功**：
\`\`\`bash
# 执行后输出应为...
\`\`\`

**注意事项**：{坑点/注意事项}

**最后更新**：YYYY-MM-DD（事故日期）

# 4. 提交
git add docs/runbooks/XX-xxx.md
git commit -m "docs(runbook): add {场景名称} scenario"
git push origin main
```

### Runbook 定期演练

每个 Sprint 随机抽取一个 Runbook 场景，在 Test 环境演练：

```bash
# 演练记录示例（记录在 Issue 评论）
## Runbook 演练记录

**日期**：2026-03-13
**场景**：后端服务崩溃回滚
**文档**：docs/runbooks/02-rollback.md
**演练结果**：✅ 按步骤执行，服务在 3 分钟内恢复
**发现问题**：备份验证命令有误（已修正）
**更新文档**：是
```

---

## 8.x 检查项 C-081 ~ C-088

| 编号 | 检查项 | 负责人 | 状态 |
|------|--------|--------|------|
| C-081 | `docs/RUNBOOK.md` 主入口已创建，含快速索引表 | CTO | ⬜ |
| C-082 | `docs/runbooks/` 目录已建立，至少包含 deployment / rollback / database 三个文件 | CTO | ⬜ |
| C-083 | `docs/POSTMORTEM/TEMPLATE.md` 已创建，按规范格式 | CTO | ⬜ |
| C-084 | `docs/POSTMORTEM/` 目录已建立，首次使用前已 commit 到仓库 | CTO | ⬜ |
| C-085 | 后端回滚操作已在 Test 环境验证可行（记录演练结果）| CTO | ⬜ |
| C-086 | 前端回滚操作已在 Test 环境验证可行（记录演练结果）| CTO | ⬜ |
| C-087 | 数据库备份恢复操作已在 Test 环境演练（记录演练结果）| CTO | ⬜ |
| C-088 | 事故等级定义（P0~P3）已同步至 RUNBOOK.md 和 GitHub Project 说明 | CTO | ⬜ |

---

## 附录：检查项总览（C-049 ~ C-088）

| 编号范围 | 章节 | 完成条件 |
|---------|------|---------|
| C-049 ~ C-060 | 第 5 章 需求开发流程 | Issue 模板、Project、ADR 体系、CI/CD workflow 全部就位 |
| C-061 ~ C-068 | 第 6 章 质量保障 | 测试框架搭建、CI 门禁完整、安全扫描启用 |
| C-069 ~ C-080 | 第 7 章 运维与监控 | VPS 目录、Docker/PM2/Nginx 正常、备份/监控/告警配置 |
| C-081 ~ C-088 | 第 8 章 事故响应 | Runbook / Postmortem 文档体系建立，回滚已演练 |

> **完成标准**：所有 ✅ 状态的检查项均已验证，⬜ 项目按 Phase 计划推进。
> 每完成一项，在对应 GitHub Issue 中标注 `C-NNN completed`。

---

*本文档由 NordHjem CTO 维护 · 如发现错误或需更新，直接修改并推送 main 分支*

---

# NordHjem Engineering Playbook — 第 9~12 章 + 附录

> **技术栈**：Next.js 15 + Medusa.js v2 + PostgreSQL + Redis + Docker  
> **后端仓库**：`nordhjem-medusa-backend`  
> **前端仓库**：`nextjs-starter-medusa`  
> **VPS**：`66.94.127.117`  
> **文档版本**：v1.0 | 最后更新：2026-03-13

---

## 目录

- [第 9 章：文档体系与活文档维护](#第-9-章文档体系与活文档维护)
- [第 10 章：开发体验](#第-10-章开发体验)
- [第 11 章：人员交接](#第-11-章人员交接)
- [第 12 章：开发路线管理](#第-12-章开发路线管理)
- [附录 A：执行清单](#附录-a执行清单)
- [附录 B：当前状态速查](#附录-b当前状态速查)

---

# 第 9 章：文档体系与活文档维护

> **核心原则**：文档是代码，不是事后补充。活文档随项目演进，始终反映真实状态。

## 9.1 文档保管制度

所有文档按类别归档到 `docs/` 对应子目录：

```
docs/                   — 体系文档（Playbook、ROADMAP、ONBOARDING 等）
docs/ADR/               — 架构决策记录（Architecture Decision Records）
docs/POSTMORTEM/        — 事故复盘文档
docs/research/          — 调研文档（Owner 或 AI 产出的调研报告）
docs/specs/             — 需求/设计文档
docs/meetings/          — 重要沟通记录摘要
```

**铁律（不可违反）**：

1. 任何与项目相关的文档都必须归档到 GitHub 仓库的 `docs/` 目录下，**不允许有"仓库外文档"存在**。
2. Owner 发过来的任何资料、调研报告、需求说明，CTO 都必须在 24 小时内归档到对应目录。
3. 口头沟通、聊天记录中的决策，必须在沟通结束后立即转化为 GitHub 记录。
4. 文档归档不是可选项，是每项任务的完成标准之一。

**检查方式**：

```bash
# 查看 docs/ 目录结构
find docs/ -type f -name "*.md" | sort

# 验证所有文档都在 INDEX.md 中登记
grep -c "\.md" docs/INDEX.md
```

---

## 9.2 INDEX.md 维护规范

`docs/INDEX.md` 是文档目录索引，是所有人进入文档体系的唯一入口。

**格式规范**：

```markdown
# NordHjem 文档索引

> 最后更新：YYYY-MM-DD

## 体系文档

| 文档名称 | 路径 | 用途 | 最后更新 |
|---------|------|------|---------|
| Engineering Playbook | docs/ENGINEERING-PLAYBOOK.md | 工程规范全集 | 2026-03-13 |
| 当前状态 | docs/CURRENT-STATUS.md | 项目当前进展快照 | 2026-03-13 |
| 路线图 | docs/ROADMAP.md | 产品开发路线 | 2026-03-13 |
| Sprint 日志 | docs/SPRINT-LOG.md | Sprint 计划与回顾 | 2026-03-13 |
| 变更日志 | CHANGELOG.md | 生产部署记录 | 2026-03-13 |
| 新人上手 | docs/ONBOARDING.md | 快速入门指南 | 2026-03-13 |

## ADR（架构决策记录）

| 编号 | 标题 | 状态 | 日期 |
|-----|------|------|------|
| ADR-001 | 技术栈选型 | 已采纳 | 2026-01-01 |

## Postmortem（事故复盘）

| 编号 | 事件 | 日期 |
|-----|------|------|
| 001 | manus-env 环境事故 | 2026-03-01 |

## 调研文档

| 文件名 | 主题 | 日期 |
|-------|------|------|
| 2026-03-13-engineering-practices-benchmark.md | 工程实践基准调研 | 2026-03-13 |

## 需求/设计文档

| 文件名 | 功能 | 状态 |
|-------|------|------|
| 示例: 2026-03-20-checkout-flow.md | 结账流程设计 | 草稿 |
```

**更新铁律**：

- 每新增一个文档，必须立即更新 `INDEX.md`（新增文档与更新 INDEX.md 是同一个 commit）。
- INDEX.md 修改必须包含"最后更新"日期。
- 任何人打开 `INDEX.md` 能在 60 秒内找到任何文档。

---

## 9.3 文档命名规范

| 类型 | 命名格式 | 示例 |
|------|---------|------|
| 归档文档（调研/会议/需求） | `YYYY-MM-DD-主题.md` | `2026-03-13-engineering-practices-benchmark.md` |
| ADR | `NNN-标题.md` | `001-tech-stack.md` |
| Postmortem | `NNN-标题.md` | `001-manus-env-incident.md` |
| 设计文档（specs） | `YYYY-MM-DD-功能名.md` | `2026-03-20-checkout-flow.md` |
| 会议记录（meetings） | `YYYY-MM-DD-会议主题.md` | `2026-03-13-sprint-planning.md` |

**命名原则**：

- 全部小写，单词间用连字符 `-` 分隔
- 日期前缀使用 ISO 8601 格式（`YYYY-MM-DD`）
- 主题词简洁，不超过 5 个英文单词或对应的中文词汇
- ADR 和 Postmortem 的编号从 `001` 开始，三位数补零

---

## 9.4 CTO 持续维护职责（铁律）

每完成一项任务，CTO 必须执行以下步骤（缺一不可）：

### 任务完成后必做清单

```
[ ] 1. 更新 CURRENT-STATUS.md
        - 当前 Sprint 进展
        - 刚完成的任务描述
        - 遗留问题或阻塞项

[ ] 2. 更新 GitHub Projects 看板状态
        - 将相关 Issue 移入 Done 列
        - 关联 PR 编号

[ ] 3. 如果是部署到 production → 更新 CHANGELOG.md
        - 格式见 9.7 节
        - 包含 PR 编号和 ADR 引用

[ ] 4. 如果涉及重大决策 → 写 ADR
        - 格式见 9.6 节
        - 提 PR 并合并后更新 INDEX.md

[ ] 5. 如果涉及新文档 → 更新 INDEX.md
        - 在对应表格中添加新行
        - 更新"最后更新"日期
```

**什么算"重大决策"**（需要写 ADR）：

- 引入新的技术依赖（库、服务、工具）
- 改变数据库结构设计方向
- 变更 CI/CD 流程或分支策略
- 调整 API 契约（影响前后端或第三方集成）
- 性能优化方案的选择（如引入缓存层）
- 安全策略变更

---

## 9.5 信息转化职责

每次与 Owner 沟通后，CTO 必须在 **2 小时内** 完成信息转化：

### 转化流程

```
Owner 沟通（微信/邮件/语音）
        ↓
CTO 提取关键信息
  - 需求变更 → GitHub Issue + specs/ 文档
  - 路线调整 → ROADMAP.md 变更申请（见 12.2 节）
  - 重要决策 → ADR
  - 新调研材料 → research/ 目录归档
  - 会议纪要 → meetings/ 目录归档
        ↓
GitHub 记录（Issue / ADR / ROADMAP / specs/ / meetings/）
        ↓
聊天记录可以丢失，GitHub 记录不能丢
```

### 信息转化模板

**需求转 Issue**：

```markdown
## 背景
（Owner 的原始需求描述）

## 需求详情
（CTO 整理后的具体需求）

## 验收标准
- [ ] 验收条件 1
- [ ] 验收条件 2

## 来源
（沟通时间 + 形式，如：2026-03-13 微信沟通）
```

---

## 9.6 ADR 撰写规范

### 格式模板

```markdown
# ADR-NNN: 标题

## 状态
已采纳 | 已废弃 | 已替代（被 ADR-NNN 替代）

## 日期
YYYY-MM-DD

## 背景
（什么问题需要决策？当时的约束条件是什么？）

## 方案对比

| 方案 | 优点 | 缺点 | 放弃原因 |
|------|------|------|---------|
| 方案 A | ... | ... | — |
| 方案 B（已选） | ... | ... | — |

## 决策
（选了什么，为什么选这个方案，关键权衡点是什么）

## 后果

### 正面影响
- ...

### 负面影响/风险
- ...

### 需要跟进的事项
- [ ] 跟进事项 1
- [ ] 跟进事项 2
```

### ADR 生命周期

```
草稿（Draft）→ 提 PR 审核 → 已采纳（Accepted）→ 已废弃（Deprecated）
                                                  → 已替代（Superseded by ADR-NNN）
```

**ADR 不可删除**，只能标记为"已废弃"或"已替代"，历史决策永久保留。

---

## 9.7 CHANGELOG 格式

`CHANGELOG.md` 位于仓库根目录，记录所有生产部署的变更。

```markdown
## [YYYY-MM-DD] — 简短描述（如：发布 v1.2 / 修复结账 Bug）

### 变更内容
- feat: 新增用户收藏功能 (PR #42)
- fix: 修复移动端结账页面崩溃问题 (PR #43)
- chore: 升级 Medusa.js 至 v2.5.0 (PR #44)
- refactor: 重构购物车状态管理 (PR #45)

### 关联 ADR
- ADR-007: 购物车状态持久化方案

### 部署信息
- 部署时间：YYYY-MM-DD HH:MM (UTC+8)
- 部署人：CTO
- VPS：66.94.127.117
- 回滚命令：`docker-compose up -d --scale backend=1`（如需）
```

**提交类型前缀规范**：

| 前缀 | 含义 |
|------|------|
| `feat:` | 新功能 |
| `fix:` | Bug 修复 |
| `chore:` | 构建/工具链/依赖变更 |
| `refactor:` | 代码重构（不影响功能） |
| `perf:` | 性能优化 |
| `docs:` | 文档变更 |
| `test:` | 测试相关 |
| `ci:` | CI/CD 配置变更 |

---

## 9.8 文档质量标准

每份文档在归档前必须满足：

| 标准 | 说明 |
|------|------|
| 有明确的目的说明 | 文档开头说明"这份文档用来做什么" |
| 有最后更新日期 | `> 最后更新：YYYY-MM-DD` |
| 有负责人 | 标注谁负责维护这份文档 |
| 内容完整 | 不存在"待补充"、"TODO" 等未完成标记 |
| 已登记 INDEX.md | 合并前验证 INDEX.md 已更新 |

---

## 第 9 章检查项

| 编号 | 检查项 | 验证方式 |
|------|--------|---------|
| C-089 | `docs/` 目录结构已建立，包含所有子目录 | `ls docs/` 验证 |
| C-090 | `docs/INDEX.md` 已创建，列出所有现有文档 | 打开 INDEX.md 验证 |
| C-091 | 文档命名规范已落地（现有文档符合命名格式） | `ls docs/` 检查命名 |
| C-092 | ADR 目录已建立，至少有 ADR-001（技术栈决策） | `ls docs/ADR/` 验证 |
| C-093 | POSTMORTEM 目录已建立 | `ls docs/POSTMORTEM/` 验证 |
| C-094 | CHANGELOG.md 存在且格式符合规范 | 打开 CHANGELOG.md 验证 |
| C-095 | CURRENT-STATUS.md 存在且在最近 7 天内更新 | 检查 git log |
| C-096 | 每次部署后 CHANGELOG.md 已更新（流程已执行） | 检查 CHANGELOG.md 记录 |
| C-097 | 新文档归档时 INDEX.md 同步更新（验证最近 3 次归档） | 检查 git log |
| C-098 | Owner 沟通内容已转化为 GitHub 记录（验证最近一次） | 检查 Issues 和 ADR |

---

# 第 10 章：开发体验

> **核心原则**：新人第一天能跑起来，熟手每天不被工具拖累。

## 10.1 本地开发环境搭建

### 系统依赖

| 工具 | 最低版本 | 验证命令 |
|------|---------|---------|
| Node.js | 20 LTS | `node -v` |
| npm | 10.x | `npm -v` |
| Yarn | 1.22 | `yarn -v` |
| Docker | 24.x | `docker -v` |
| Docker Compose | 2.x | `docker compose version` |
| Git | 2.40 | `git --version` |

### 环境一键检查脚本

```bash
#!/bin/bash
# scripts/check-env.sh

echo "=== NordHjem 开发环境检查 ==="

check() {
  local name=$1
  local cmd=$2
  local version
  version=$(eval "$cmd" 2>/dev/null)
  if [ $? -eq 0 ]; then
    echo "✅ $name: $version"
  else
    echo "❌ $name: 未安装"
  fi
}

check "Node.js" "node -v"
check "npm" "npm -v"
check "Yarn" "yarn -v"
check "Docker" "docker -v"
check "Docker Compose" "docker compose version"
check "Git" "git --version"

echo ""
echo "=== 端口占用检查 ==="
for port in 5432 6379 9000 3000; do
  if lsof -i :$port > /dev/null 2>&1; then
    echo "⚠️  端口 $port 已被占用"
  else
    echo "✅ 端口 $port 可用"
  fi
done
```

详见 `docs/LOCAL-DEV-GUIDE.md`。

---

## 10.2 后端本地开发

### 首次设置

```bash
# 1. 克隆仓库
git clone https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend.git
cd nordhjem-medusa-backend

# 2. 配置环境变量
cp .env.example .env
# 必须填写以下变量：
# DATABASE_URL=postgres://postgres:password@localhost:5432/nordhjem
# REDIS_URL=redis://localhost:6379
# JWT_SECRET=（随机生成，最少 32 位）
# COOKIE_SECRET=（随机生成，最少 32 位）

# 3. 启动基础设施（PostgreSQL + Redis）
docker-compose up -d

# 等待数据库就绪
echo "等待 PostgreSQL 启动..."
until docker-compose exec postgres pg_isready -U postgres; do sleep 1; done

# 4. 安装依赖
npm install --legacy-peer-deps

# 5. 运行数据库迁移
npx medusa db:migrate

# 6. 启动开发服务器
npx medusa develop
```

**开发服务器端口**：

| 服务 | 端口 | URL |
|------|------|-----|
| Medusa 后端 API | 9000 | `http://localhost:9000` |
| Medusa Admin | 7001 | `http://localhost:7001` |
| PostgreSQL | 5432 | `postgres://localhost:5432` |
| Redis | 6379 | `redis://localhost:6379` |

### 日常开发命令

```bash
# 启动开发（含热重载）
npx medusa develop

# 运行数据库迁移
npx medusa db:migrate

# 回滚最近一次迁移
npx medusa db:rollback

# 生成新迁移文件
npx medusa db:generate migration-name

# 运行单元测试
npm test

# 类型检查
npx tsc --noEmit

# Lint 检查
npm run lint

# 格式化代码
npm run format
```

### 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|---------|---------|
| `ECONNREFUSED 5432` | PostgreSQL 未启动 | `docker-compose up -d postgres` |
| `ECONNREFUSED 6379` | Redis 未启动 | `docker-compose up -d redis` |
| `Migration failed` | 数据库版本不一致 | `npx medusa db:rollback` 后重试 |
| `Cannot find module` | 依赖未安装 | `npm install --legacy-peer-deps` |
| `JWT_SECRET is required` | .env 未配置 | 检查 `.env` 文件 |

---

## 10.3 前端本地开发

### 首次设置

```bash
# 1. 克隆仓库
git clone https://github.com/Nickwenniyxiao-art/nextjs-starter-medusa.git
cd nextjs-starter-medusa

# 2. 配置环境变量
cp .env.example .env.local
# 必须填写以下变量：
# NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
# NEXT_PUBLIC_BASE_URL=http://localhost:3000
# REVALIDATE_SECRET=（随机字符串）

# 3. 安装依赖（使用 Yarn，保持 lockfile 一致性）
yarn install

# 4. 启动开发服务器
yarn dev
```

**开发服务器端口**：

| 服务 | 端口 | URL |
|------|------|-----|
| Next.js 前端 | 3000 | `http://localhost:3000` |
| Next.js Admin | 3000/admin | `http://localhost:3000/admin` |

### 日常开发命令

```bash
# 启动开发（含热重载）
yarn dev

# 构建生产版本（本地验证）
yarn build

# 运行生产构建
yarn start

# Lint 检查
yarn lint

# 类型检查
yarn type-check

# 运行测试
yarn test

# 运行 E2E 测试
yarn test:e2e
```

### 环境变量说明

| 变量名 | 说明 | 示例值 |
|-------|------|-------|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | 后端 API 地址 | `http://localhost:9000` |
| `NEXT_PUBLIC_BASE_URL` | 前端基础 URL | `http://localhost:3000` |
| `REVALIDATE_SECRET` | ISR 重验证密钥 | 随机字符串 |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe 公钥（Phase 2） | `pk_test_xxx` |

---

## 10.4 Codex 工作环境

Codex 是项目的 AI 编码助手，通过 GitHub Issue 接收任务并通过 PR 交付。

### 工作流程

```
CTO 分析需求
    ↓
CTO 创建 GitHub Issue（含 Codex 详细指令）
    ↓
Codex 在 codex/* 分支完成实现
    ↓
Codex 提 PR
    ↓
CI 自动验证（lint + type-check + test）
    ↓
CTO Code Review
    ↓
合并到 main
```

### Codex 指令格式规范

CTO 必须在 Issue 中提供以下信息，确保 Codex 能独立完成任务：

```markdown
## 背景
（为什么要做这个功能，业务背景）

## 需求描述
（具体要实现什么）

## 文件范围
<!-- 明确告知 Codex 需要修改/创建哪些文件 -->
**需要修改的文件**：
- `src/modules/xxx/service.ts`
- `src/api/route.ts`

**需要新建的文件**：
- `src/modules/xxx/migration/YYYYMMDDHHMMSS_add_xxx.ts`

**禁止修改的文件**：
- `src/modules/yyy/` （影响其他功能）

## 技术要求
- 使用 TypeScript strict 模式
- 遵循现有代码风格（参考 xxx 模块）
- 必须添加 JSDoc 注释

## 验收标准
- [ ] `npm run lint` 通过
- [ ] `npx tsc --noEmit` 通过
- [ ] `npm test` 通过（如有相关测试）
- [ ] 功能手动验证：（具体步骤）

## 参考资料
- Medusa.js v2 文档：https://docs.medusajs.com/v2/
- 相关 ADR：ADR-NNN
```

### Codex 分支命名规范

```
codex/issue-{编号}-{简短描述}
# 示例：codex/issue-42-add-wishlist-feature
```

### CTO Code Review 检查点

```
[ ] 代码符合 TypeScript 类型安全要求
[ ] 没有引入 any 类型（除非有注释说明原因）
[ ] 没有 console.log 遗留
[ ] 数据库操作有事务保护（如需要）
[ ] API 端点有参数校验
[ ] 错误处理完整（不暴露内部错误信息）
[ ] 新功能有对应测试（或 Issue 中标注为 Phase N 补充）
```

---

## 第 10 章检查项

| 编号 | 检查项 | 验证方式 |
|------|--------|---------|
| C-099 | `docs/LOCAL-DEV-GUIDE.md` 已创建，包含完整环境搭建步骤 | 打开文档验证 |
| C-100 | 后端 `.env.example` 包含所有必要变量（无默认密钥） | 检查 `.env.example` |
| C-101 | 前端 `.env.example` 包含所有必要变量 | 检查 `.env.example` |
| C-102 | 本地 `docker-compose up -d` 能成功启动 PostgreSQL + Redis | 实际执行验证 |
| C-103 | `npx medusa develop` 能成功启动（后端 :9000 可访问） | 实际执行验证 |
| C-104 | Codex 指令格式规范已写入 AGENTS.md 或 Playbook | 检查 AGENTS.md |

---

# 第 11 章：人员交接

> **核心原则**：知识在文档中，不在人脑中。任何人离开不影响项目继续运转。

## 11.1 新 CTO 上手包

### 阅读路径（总计约 2 小时）

#### 第一阶段：5 分钟快速了解（这是什么项目）

```
docs/ONBOARDING.md          → 项目概览、核心目标、当前状态一句话总结
```

**ONBOARDING.md 必须包含**：

- 项目是什么（一句话）
- 目标用户是谁
- 核心技术栈
- 当前进展（指向 CURRENT-STATUS.md）
- 联系方式（Owner 微信/邮箱）

#### 第二阶段：30 分钟深入了解（项目在哪、做什么、怎么做）

```
docs/INDEX.md               → 所有文档在哪（导航图）
docs/CURRENT-STATUS.md      → 项目现在在哪（进展快照）
docs/ROADMAP.md             → 接下来做什么（未来规划）
docs/ENGINEERING-PLAYBOOK.md → 怎么做（规范全集）
docs/ADR/                   → 为什么这么做（历史决策）
docs/SPRINT-LOG.md          → 最近在做什么（Sprint 记录）
```

#### 第三阶段：1 小时实操（跑起来）

```bash
# 参考 docs/LOCAL-DEV-GUIDE.md
# 目标：本地后端和前端都能成功启动
```

### CURRENT-STATUS.md 格式规范

```markdown
# NordHjem 当前状态

> 最后更新：YYYY-MM-DD | 更新人：CTO

## 项目概况
- **当前阶段**：Phase X — 阶段名称
- **Sprint**：Sprint N（YYYY-MM-DD 至 YYYY-MM-DD）
- **整体健康度**：🟢 正常 / 🟡 有阻塞 / 🔴 紧急问题

## 最近完成
- [x] 功能/任务描述（PR #XX）
- [x] 功能/任务描述（PR #XX）

## 当前进行中
- [ ] 功能/任务描述（Issue #XX，预计完成：MM-DD）

## 阻塞项
- 问题描述（阻塞原因 + 解决方案 + 负责人）

## 已知技术债
- 债务描述（来源 + 计划解决时间）

## 下一步（本 Sprint 剩余）
1. 优先级 1：任务描述
2. 优先级 2：任务描述
```

---

## 11.2 交接流程（3 阶段）

### 第 1 天：读完上手包，了解项目全貌

**目标**：能向他人解释这个项目是什么、现在在哪、下一步做什么。

```
上午（2h）：读完第一阶段 + 第二阶段文档
下午（3h）：完成第三阶段实操（本地环境跑起来）
完成标志：能独立在本地启动前端 + 后端
```

**当天需要获取的权限**（见 11.4 节）：
- GitHub 仓库访问权限
- VPS SSH 访问权限
- GitHub Secrets 查看权限（只读）

### 第 1 周：接手当前 Sprint 任务，熟悉 CI/CD 流程

```
Day 2: 阅读当前 Sprint 的所有 Issue，理解任务背景
Day 3: 选一个小 Issue，走完完整开发流程（本地开发 → PR → CI → Review → Merge）
Day 4: 完成一次完整的 CI/CD 部署观察（不一定动手，观察现有流程）
Day 5: 接手一个中等复杂度的 Issue，独立完成
```

**里程碑**：提交并合并第一个 PR。

### 第 2 周：独立运作，处理第一个完整需求

```
接手一个包含前后端的完整功能需求（从 Issue 到部署）
独立处理，遇到问题查文档，无法解决再找前任 CTO
```

**里程碑**：完成从需求到生产部署的完整交付，包含：
- CHANGELOG.md 更新
- CURRENT-STATUS.md 更新
- GitHub Projects 看板更新

---

## 11.3 防断裂机制（Bus Factor）

**目标**：Bus Factor ≥ 2。即使 CTO 突然离开，项目能继续运转。

### 四大防断裂原则

| 原则 | 错误做法 | 正确做法 |
|------|---------|---------|
| 知识在文档中 | "这个我知道，你问我就行" | 写进 Playbook / ADR / ONBOARDING.md |
| 配置在代码中 | 服务器上手动改了配置不提交 | 所有配置在 `docker-compose.yml` / `.env.example` 中 |
| 密钥在 Secrets 中 | 密钥写在聊天记录里 | 所有密钥在 GitHub Secrets，操作手册在文档中 |
| 决策在 ADR 中 | "当初这么做是因为..." | 写 ADR，附方案对比和决策理由 |

### 知识清单自查

每月 CTO 自查：以下内容是否都有文档记录，新人不问我就能搞定？

```
[ ] VPS 上如何手动部署（不依赖 CI/CD 的应急方案）
[ ] 如何回滚一次部署
[ ] 数据库备份在哪里，如何恢复
[ ] 如何添加新的环境变量到生产环境
[ ] 第三方服务（Stripe、Sentry 等）的账号在哪里
[ ] 域名 DNS 配置在哪里管理
[ ] 如何扩容（当流量增加时）
```

---

## 11.4 权限移交清单

### 权限一览表

| 权限 | 位置 | 移交方式 | 说明 |
|------|------|---------|------|
| GitHub 仓库 Owner | GitHub Organization Settings | Owner 直接邀请 | 需要 Owner 操作 |
| GitHub 仓库 Admin | GitHub Repo Settings → Collaborators | 现任 CTO 或 Owner 操作 | 需要 Admin 权限 |
| VPS SSH 访问 | `~/.ssh/authorized_keys`（root 或 deploy 用户） | 添加新 CTO 的公钥 | 见下方操作步骤 |
| GitHub Secrets | Repo Settings → Secrets and Variables | 现任 CTO 或 Owner 操作 | 需要 Admin 权限 |
| 域名管理 | DNS provider（阿里云/Cloudflare 等） | Owner 在 DNS 控制台添加子账号 | 需要 Owner 操作 |
| Docker Registry | ghcr.io（GitHub Packages） | 随 GitHub 仓库权限自动获得 | — |
| Sentry | sentry.io Project Settings | 现任 CTO 邀请 | 需要 Admin 权限 |
| 监控系统 | Uptime Kuma（如已部署） | 提供管理员账号 | — |

### VPS SSH 公钥添加流程

```bash
# 新 CTO 本地：生成 SSH 密钥对（如没有）
ssh-keygen -t ed25519 -C "new-cto@nordhjem"

# 新 CTO 将公钥发给现任 CTO
cat ~/.ssh/id_ed25519.pub

# 现任 CTO 在 VPS 上添加公钥
ssh root@66.94.127.117
echo "ssh-ed25519 AAAA...（新 CTO 公钥）" >> ~/.ssh/authorized_keys

# 验证新 CTO 能登录
ssh root@66.94.127.117 "echo 'SSH 连接成功'"
```

### GitHub Secrets 清单

所有密钥必须文档化（名称和用途，不包含值）：

| Secret 名称 | 用途 | 在哪个仓库 |
|------------|------|-----------|
| `DEPLOY_SSH_KEY` | CI/CD 部署到 VPS | 两个仓库 |
| `OPENAI_API_KEY` | AI 功能调用 | 后端仓库 |
| `JWT_SECRET` | Medusa JWT 签名 | 后端仓库 |
| `COOKIE_SECRET` | Medusa Cookie 加密 | 后端仓库 |
| `DATABASE_URL` | 生产数据库连接字符串 | 后端仓库 |
| `REDIS_URL` | 生产 Redis 连接字符串 | 后端仓库 |
| `STRIPE_SECRET_KEY` | Stripe 支付（Phase 2） | 后端仓库 |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe 前端（Phase 2） | 前端仓库 |
| `SENTRY_DSN` | 错误监控（Phase 2） | 两个仓库 |
| `REVALIDATE_SECRET` | Next.js ISR 重验证 | 前端仓库 |

---

## 第 11 章检查项

| 编号 | 检查项 | 验证方式 |
|------|--------|---------|
| C-105 | `docs/ONBOARDING.md` 已创建，包含项目一句话介绍、技术栈、快速入门 | 打开文档验证 |
| C-106 | `docs/CURRENT-STATUS.md` 已创建，格式符合规范，在最近 7 天内更新 | 检查内容和日期 |
| C-107 | `docs/SPRINT-LOG.md` 已创建，包含当前 Sprint 记录 | 打开文档验证 |
| C-108 | VPS SSH 权限文档已记录（`docs/` 中有操作手册） | 检查文档 |
| C-109 | GitHub Secrets 清单已文档化（名称+用途，不含值） | 检查 Playbook 或专项文档 |
| C-110 | 本地一键启动能在 15 分钟内完成（新人视角验证） | 实际测试 |
| C-111 | Bus Factor 自查清单已完成（所有知识项都有文档覆盖） | 完成 11.3 节自查 |

---

# 第 12 章：开发路线管理

> **核心原则**：路线图是项目的北极星，CTO 执行，Owner 决策，不能混淆。

## 12.1 ROADMAP 锁定机制

### ROADMAP.md 格式规范

```markdown
# NordHjem 产品路线图

> 最后更新：YYYY-MM-DD | 状态：Owner 已确认

## 当前阶段：Phase X — 阶段名称

## Phase 1：核心电商（目标：YYYY-MM）

### 模块一览

| 模块 | 描述 | 优先级 | 依赖 | 预估工作量 | 状态 |
|------|------|--------|------|-----------|------|
| 产品目录 | 商品列表、详情页、分类 | P0 | — | 2 Sprint | ✅ 已完成 |
| 购物车 | 添加/删除、数量管理 | P0 | 产品目录 | 1 Sprint | 🚧 进行中 |
| 结账流程 | 地址、支付、订单确认 | P0 | 购物车 | 2 Sprint | 📅 待开始 |
| 用户账户 | 注册、登录、订单历史 | P1 | 结账流程 | 1 Sprint | 📅 待开始 |

### Phase 1 完成标准
- [ ] 用户能完成完整购买流程（浏览 → 加购 → 付款 → 确认）
- [ ] 管理员能在后台管理商品和订单

## Phase 2：运营增强（目标：YYYY-MM）
...

## 变更日志

| 日期 | 变更内容 | 申请人 | 状态 |
|------|---------|--------|------|
| 2026-03-13 | 将 X 功能从 Phase 1 移至 Phase 2，原因：... | CTO | ✅ Owner 已确认 |
```

### 锁定规则

1. ROADMAP.md 由 Owner 和 CTO 共同确认后锁定。
2. 锁定后，CTO 不能自行修改 ROADMAP 正文内容。
3. 任何变更都必须经过 12.2 节的变更流程。
4. 变更记录永久保留在 ROADMAP.md 底部的变更日志中。

**优先级定义**：

| 优先级 | 含义 |
|--------|------|
| P0 | 本 Phase 必须完成，不完成不上线 |
| P1 | 本 Phase 应该完成，可延期到下个 Phase |
| P2 | 有空就做，可以推迟 |
| P3 | 想法记录，暂无计划 |

---

## 12.2 变更流程

当 CTO 发现需要调整路线时，严格按照以下流程操作：

### 变更申请格式

在 `ROADMAP.md` 底部的变更日志表格中添加一行，并附上详细申请：

```markdown
## 变更申请：YYYY-MM-DD

### 申请变更内容
（具体要改什么，从哪改到哪）

### 变更原因
（技术原因 / 资源限制 / 需求变化）

### 影响分析
- **对时间线的影响**：（提前/推迟多少时间）
- **对其他模块的影响**：（依赖关系变化）
- **对用户的影响**：（上线时间变化）

### 建议方案
方案 A：（推荐）...
方案 B：...

### 需要 Owner 决策的问题
1. ...

---
*申请人：CTO | 申请日期：YYYY-MM-DD | 状态：待 Owner 确认*
```

### 变更执行步骤

```
1. CTO 在 ROADMAP.md 末尾写变更申请
2. 提 PR，标题：[ROADMAP 变更申请] 简短描述
3. 通知 Owner 审批（微信/邮件）
4. Owner 确认后，CTO 更新 ROADMAP 正文
5. 在变更日志表格中标记"✅ Owner 已确认"
6. 合并 PR
7. 如果变更影响当前 Sprint，更新 SPRINT-LOG.md
```

**禁止行为**：

- ❌ 未经 Owner 确认，直接修改 ROADMAP 正文
- ❌ 口头确认后才在 ROADMAP 中记录（应在确认前提 PR）
- ❌ 删除历史变更记录

---

## 12.3 Sprint 计划规范

每个 Sprint（2 周）开始前，CTO 必须完成以下工作：

### Sprint 启动流程

```
Sprint 开始前 1 天（周五）：
  1. CTO 从 ROADMAP 中取出当期任务
  2. 拆分成具体的 GitHub Issues（每个 Issue ≤ 3 天工作量）
  3. 为每个 Issue 添加标签和 Milestone
  4. 在 GitHub Projects 看板中创建 Sprint 视图
  5. 在 SPRINT-LOG.md 中记录本次 Sprint 计划
  6. 更新 CURRENT-STATUS.md

Sprint 第 1 天（周一）：
  与 Owner 同步 Sprint 目标（5分钟）
```

### Issue 拆分标准

一个好的 Issue 必须满足：

| 标准 | 说明 |
|------|------|
| 原子性 | 单个 Issue 的工作量 ≤ 3 天 |
| 可验证 | 有明确的验收标准（Acceptance Criteria） |
| 独立性 | 与其他 Issue 的依赖关系明确 |
| 可分配 | 可以分配给 Codex 独立完成（含足够的上下文） |

### SPRINT-LOG.md 格式

```markdown
# Sprint 日志

## Sprint N（YYYY-MM-DD 至 YYYY-MM-DD）

### Sprint 目标
（一句话描述这个 Sprint 要达成什么）

### 计划任务
| Issue | 标题 | 优先级 | 预估 | 状态 |
|-------|------|--------|------|------|
| #42 | 实现购物车 API | P0 | 3天 | ✅ 已完成 |
| #43 | 购物车前端组件 | P0 | 2天 | 🚧 进行中 |
| #44 | 单元测试补充 | P1 | 1天 | ❌ 未完成 |

### Sprint 回顾
（Sprint 结束后填写，见 12.4 节）
```

---

## 12.4 Sprint 回顾规范

每个 Sprint 结束后（周五），CTO 在 `SPRINT-LOG.md` 对应 Sprint 下补充回顾：

```markdown
### Sprint 回顾（YYYY-MM-DD）

#### 完成情况
- ✅ 完成的任务：Issue #42（PR #55）、Issue #43（PR #56）
- ❌ 未完成：Issue #44（原因：Medusa v2 API 文档有误，需要进一步调研）

#### 做得好的（保持）
1. Codex 指令写得足够详细，返工率低
2. CI 在 3 分钟内完成，反馈快

#### 做得不好的（改进）
1. Issue 拆分粒度太大，#43 实际花了 4 天
2. 没有及时更新 CURRENT-STATUS.md

#### 下个 Sprint 改进措施
1. 每个 Issue 拆分后估算再除以 1.5（保留缓冲）
2. 每天结束前 5 分钟更新 CURRENT-STATUS.md

#### Velocity 数据
- 计划 Story Points：15
- 完成 Story Points：12
- 完成率：80%
```

### Sprint 健康度指标

| 指标 | 健康阈值 | 预警阈值 |
|------|---------|---------|
| Sprint 完成率 | ≥ 80% | < 60% |
| 返工率（PR 被拒） | < 20% | > 40% |
| 阻塞时间 | < 2 天/Sprint | > 5 天/Sprint |
| CURRENT-STATUS.md 更新频率 | 每 3 天一次 | > 1 周未更新 |

---

## 第 12 章检查项

| 编号 | 检查项 | 验证方式 |
|------|--------|---------|
| C-112 | `docs/ROADMAP.md` 已创建，包含 Phase 划分和模块一览表 | 打开文档验证 |
| C-113 | ROADMAP.md 已有"Owner 已确认"标记 | 检查文档头部 |
| C-114 | ROADMAP.md 包含变更日志表格（即使为空） | 检查文档末尾 |
| C-115 | `docs/SPRINT-LOG.md` 已创建，包含当前 Sprint 计划 | 打开文档验证 |
| C-116 | 当前 Sprint 的 Issues 已创建并关联 Milestone | 检查 GitHub Issues |
| C-117 | GitHub Projects 看板已配置，有当前 Sprint 视图 | 打开 GitHub Projects |
| C-118 | Sprint 回顾已记录（最近一次 Sprint 完成后） | 检查 SPRINT-LOG.md |
| C-119 | ROADMAP 变更流程已至少走过一次（或首次启动时确认） | 检查变更日志 |

---

# 附录 A：执行清单

## A.1 Owner 视图（进度总览）

> 说明：Owner 可用此表快速了解项目工程规范落地情况，无需了解技术细节。

| 维度 | 检查项数 | 已完成 | 完成率 | 优先级 |
|------|---------|--------|--------|--------|
| 角色与权限 | 5 | — | —% | P0 |
| 项目立项 | 8 | — | —% | P0 |
| 代码规范 | 10 | — | —% | P0 |
| 源码管理 | 10 | — | —% | P0 |
| CI/CD 流水线 | 15 | — | —% | P0 |
| 需求开发流程 | 12 | — | —% | P1 |
| 质量保障 | 10 | — | —% | P1 |
| 运维与监控 | 12 | — | —% | P1 |
| 事故响应与复盘 | 8 | — | —% | P1 |
| 文档体系 | 10 | — | —% | P0 |
| 开发体验 | 6 | — | —% | P1 |
| 人员交接 | 7 | — | —% | P1 |
| 开发路线管理 | 8 | — | —% | P1 |
| **总计** | **121** | — | **—%** | — |

> **如何使用**：CTO 每周更新"已完成"列和"完成率"列，Owner 只需关注总完成率和 P0 维度。

---

## A.2 CTO 视图（详细执行清单）

> **说明**：所有检查项完整列表。CTO 负责维护状态列。
> **状态图例**：✅ 已完成 | 🚧 进行中 | ⏸️ 已延后 | ❌ 未开始 | 🚫 不适用

### 第 1 章：角色与权限（C-001~C-005）

| 编号 | 检查项 | 状态 | 完成日期 | 负责人 | 产出文件 |
|------|--------|------|---------|--------|---------|
| C-001 | GitHub 仓库已创建（后端 + 前端） | ✅ | — | CTO | — |
| C-002 | AGENTS.md 已创建（AI 助手行为准则） | ✅ | 2026-03-13 | CTO | AGENTS.md |
| C-003 | GitHub Secrets 已配置（DEPLOY_SSH_KEY 等） | ✅ | — | CTO | — |
| C-004 | Branch Protection 已开启（main 分支，reviewer=1） | ✅ | 2026-03-13 | CTO | — |
| C-005 | VPS SSH 访问权限已配置（deploy 用户） | ✅ | — | CTO | — |

### 第 2 章：项目立项（C-006~C-013）

| 编号 | 检查项 | 状态 | 完成日期 | 负责人 | 产出文件 |
|------|--------|------|---------|--------|---------|
| C-006 | docs/ROADMAP.md 已创建（Phase 划分完整） | ❌ | — | CTO | docs/ROADMAP.md |
| C-007 | docs/ONBOARDING.md 已创建 | ❌ | — | CTO | docs/ONBOARDING.md |
| C-008 | docs/INDEX.md 已创建 | ❌ | — | CTO | docs/INDEX.md |
| C-009 | GitHub Projects 看板已配置 | ❌ | — | CTO | — |
| C-010 | Milestone 已创建（对应 Phase） | ❌ | — | CTO | — |
| C-011 | Issue 模板已配置（Bug / Feature / Codex Task） | ❌ | — | CTO | .github/ISSUE_TEMPLATE/ |
| C-012 | PR 模板已配置 | ❌ | — | CTO | .github/PULL_REQUEST_TEMPLATE.md |
| C-013 | docs/ADR/001-tech-stack.md 已创建 | ❌ | — | CTO | docs/ADR/001-tech-stack.md |

### 第 3 章：代码规范（C-014~C-023）

| 编号 | 检查项 | 状态 | 完成日期 | 负责人 | 产出文件 |
|------|--------|------|---------|--------|---------|
| C-014 | 后端 ESLint 已配置并通过 | ✅ | 2026-03-13 | CTO | .eslintrc.js |
| C-015 | 后端 Prettier 已配置并通过 | ✅ | 2026-03-13 | CTO | .prettierrc |
| C-016 | 前端 ESLint 已配置并通过 | ✅ | — | CTO | .eslintrc.js |
| C-017 | 前端 Prettier 已配置并通过 | ✅ | — | CTO | .prettierrc |
| C-018 | TypeScript strict 模式已开启（后端） | ⏸️ | — | CTO | tsconfig.json |
| C-019 | TypeScript strict 模式已开启（前端） | ⏸️ | — | CTO | tsconfig.json |
| C-020 | Husky pre-commit hook 已配置 | ✅ | 2026-03-13 | CTO | .husky/ |
| C-021 | commitlint 已配置（Conventional Commits） | ✅ | 2026-03-13 | CTO | commitlint.config.js |
| C-022 | 后端 npm audit（无高危漏洞） | ❌ | — | CTO | — |
| C-023 | 前端 npm audit（无高危漏洞） | ❌ | — | CTO | — |

### 第 4 章：源码管理（C-024~C-033）

| 编号 | 检查项 | 状态 | 完成日期 | 负责人 | 产出文件 |
|------|--------|------|---------|--------|---------|
| C-024 | main 分支 Branch Protection 已开启 | ✅ | 2026-03-13 | CTO | — |
| C-025 | 需要 reviewer=1 批准才能合并 | ✅ | 2026-03-13 | CTO | — |
| C-026 | Production admin bypass 已禁用 | ✅ | 2026-03-13 | CTO | — |
| C-027 | 分支命名规范已记录（codex/*、feat/*、fix/*） | ✅ | 2026-03-13 | CTO | AGENTS.md |
| C-028 | .gitignore 已配置（忽略 .env、node_modules 等） | ✅ | — | CTO | .gitignore |
| C-029 | Dockerfile lockfile fix 已完成 | ✅ | 2026-03-13 | CTO | Dockerfile |
| C-030 | 前端 CI frozen lockfile 已配置 | ✅ | 2026-03-13 | CTO | .github/workflows/ |
| C-031 | Auto-merge CD_PAT 已配置 | ✅ | 2026-03-13 | CTO | — |
| C-032 | codex-autofix npm install fix 已完成 | ✅ | 2026-03-13 | CTO | — |
| C-033 | Squash merge 已设置为默认合并策略 | ❌ | — | CTO | — |

### 第 5 章：CI/CD 流水线（C-034~C-048）

| 编号 | 检查项 | 状态 | 完成日期 | 负责人 | 产出文件 |
|------|--------|------|---------|--------|---------|
| C-034 | CI lint 检查已配置（后端） | ✅ | 2026-03-13 | CTO | .github/workflows/ci.yml |
| C-035 | CI type-check 已配置（后端） | ✅ | 2026-03-13 | CTO | .github/workflows/ci.yml |
| C-036 | CI lint 检查已配置（前端） | ✅ | 2026-03-13 | CTO | .github/workflows/ci.yml |
| C-037 | CI type-check 已配置（前端） | ✅ | 2026-03-13 | CTO | .github/workflows/ci.yml |
| C-038 | CI 单元测试已配置（后端） | ❌ | — | CTO | — |
| C-039 | CI 单元测试已配置（前端） | ❌ | — | CTO | — |
| C-040 | CD 自动部署到 VPS 已配置（main 分支合并触发） | ✅ | — | CTO | .github/workflows/deploy.yml |
| C-041 | Docker 镜像构建流程已配置 | ✅ | — | CTO | Dockerfile |
| C-042 | 部署脚本已测试（能成功完成一次完整部署） | ✅ | — | CTO | scripts/deploy.sh |
| C-043 | 数据库迁移在部署流程中自动执行 | ✅ | — | CTO | .github/workflows/deploy.yml |
| C-044 | 部署失败时有告警通知（GitHub 通知或邮件） | ❌ | — | CTO | — |
| C-045 | 回滚流程已文档化并测试过 | ❌ | — | CTO | docs/ |
| C-046 | CI 运行时间 < 5 分钟（目标值） | ✅ | — | CTO | — |
| C-047 | AI Reviewer 2/3（PR 自动审查） | ❌ | — | CTO | — |
| C-048 | 生产环境 Secrets 与测试环境隔离 | ✅ | — | CTO | — |

### 第 6 章：需求开发流程（C-049~C-060）

| 编号 | 检查项 | 状态 | 完成日期 | 负责人 | 产出文件 |
|------|--------|------|---------|--------|---------|
| C-049 | GitHub Issue 模板（功能需求）已创建 | ❌ | — | CTO | .github/ISSUE_TEMPLATE/ |
| C-050 | GitHub Issue 模板（Bug 报告）已创建 | ❌ | — | CTO | .github/ISSUE_TEMPLATE/ |
| C-051 | GitHub Issue 模板（Codex Task）已创建 | ❌ | — | CTO | .github/ISSUE_TEMPLATE/ |
| C-052 | PR 模板已创建（含 Checklist） | ❌ | — | CTO | .github/PULL_REQUEST_TEMPLATE.md |
| C-053 | Codex 指令格式规范已写入 AGENTS.md | ✅ | 2026-03-13 | CTO | AGENTS.md |
| C-054 | Codex 分支命名规范已执行 | ✅ | 2026-03-13 | CTO | — |
| C-055 | 需求文档（specs/）命名规范已落地 | ❌ | — | CTO | docs/specs/ |
| C-056 | 每个 Issue 有明确验收标准（最近 3 个 Issue 验证） | ❌ | — | CTO | — |
| C-057 | Issue 与 PR 关联（通过 Closes #N） | ✅ | — | CTO | — |
| C-058 | PR 合并前 CI 必须通过（Branch Protection 强制） | ✅ | 2026-03-13 | CTO | — |
| C-059 | Code Review 流程有执行（非作者 Review） | ✅ | — | CTO | — |
| C-060 | Feature Flag 策略已文档化（如适用） | ❌ | — | CTO | docs/ |

### 第 7 章：质量保障（C-061~C-070）

| 编号 | 检查项 | 状态 | 完成日期 | 负责人 | 产出文件 |
|------|--------|------|---------|--------|---------|
| C-061 | 后端单元测试框架已配置（Jest） | ❌ | — | CTO | jest.config.js |
| C-062 | 前端单元测试框架已配置（Jest/Vitest） | ❌ | — | CTO | jest.config.js |
| C-063 | E2E 测试框架已配置（Playwright） | ❌ | — | CTO | playwright.config.ts |
| C-064 | E2E WebKit 浏览器测试已配置 | ❌ | — | CTO | — |
| C-065 | 核心购买流程有 E2E 覆盖（待 Phase 1） | ❌ | — | CTO | — |
| C-066 | 测试覆盖率目标已定义（如：核心模块 ≥ 70%） | ❌ | — | CTO | docs/ |
| C-067 | npm audit 已集成到 CI（后端） | ❌ | — | CTO | .github/workflows/ |
| C-068 | npm audit 已集成到 CI（前端） | ❌ | — | CTO | .github/workflows/ |
| C-069 | 依赖更新策略已文档化（Dependabot 或手动） | ❌ | — | CTO | docs/ |
| C-070 | 性能基准已建立（首页 LCP < 2.5s 目标） | ❌ | — | CTO | docs/ |

### 第 8 章：运维与监控（C-071~C-082）

| 编号 | 检查项 | 状态 | 完成日期 | 负责人 | 产出文件 |
|------|--------|------|---------|--------|---------|
| C-071 | VPS Docker 部署已成功运行 | ✅ | — | CTO | — |
| C-072 | docker-compose.yml 包含后端 + PostgreSQL + Redis | ✅ | — | CTO | docker-compose.yml |
| C-073 | 数据库备份策略已配置（每日自动备份） | ❌ | — | CTO | docs/ |
| C-074 | 备份恢复流程已测试（能从备份恢复） | ❌ | — | CTO | docs/ |
| C-075 | Uptime Kuma 已部署并监控（待 Phase 2） | ❌ | — | CTO | — |
| C-076 | 前端 + 后端健康检查端点已配置 | ❌ | — | CTO | — |
| C-077 | Telegram 告警已配置（服务宕机通知，待 Phase 2） | ❌ | — | CTO | — |
| C-078 | Sentry 错误监控已接入（待 Phase 2） | ❌ | — | CTO | — |
| C-079 | 日志收集已配置（Docker logs / 集中式） | ❌ | — | CTO | — |
| C-080 | VPS 磁盘/内存告警已配置 | ❌ | — | CTO | — |
| C-081 | SSL 证书已配置（Let's Encrypt）且自动续期 | ❌ | — | CTO | — |
| C-082 | 生产环境 .env 通过 GitHub Secrets 注入（非明文） | ✅ | — | CTO | — |

### 第 8 章续：事故响应与复盘（C-083~C-088）

| 编号 | 检查项 | 状态 | 完成日期 | 负责人 | 产出文件 |
|------|--------|------|---------|--------|---------|
| C-083 | 事故响应流程已文档化（P0/P1/P2 分级） | ❌ | — | CTO | docs/ |
| C-084 | On-call 联系方式已记录（CTO 手机 + 备用） | ❌ | — | CTO | docs/ |
| C-085 | 回滚命令已文档化并测试 | ❌ | — | CTO | docs/ |
| C-086 | docs/POSTMORTEM/001-*.md 已创建（首次事故复盘） | ❌ | — | CTO | docs/POSTMORTEM/ |
| C-087 | Postmortem 格式规范已落地 | ❌ | — | CTO | docs/POSTMORTEM/ |
| C-088 | 每次生产事故 72 小时内完成 Postmortem | ❌ | — | CTO | docs/POSTMORTEM/ |

### 第 9 章：文档体系（C-089~C-098）

| 编号 | 检查项 | 状态 | 完成日期 | 负责人 | 产出文件 |
|------|--------|------|---------|--------|---------|
| C-089 | `docs/` 目录结构已建立，包含所有子目录 | ❌ | — | CTO | docs/ |
| C-090 | `docs/INDEX.md` 已创建，列出所有现有文档 | ❌ | — | CTO | docs/INDEX.md |
| C-091 | 文档命名规范已落地（现有文档符合命名格式） | ❌ | — | CTO | — |
| C-092 | ADR 目录已建立，至少有 ADR-001 | ❌ | — | CTO | docs/ADR/001-tech-stack.md |
| C-093 | POSTMORTEM 目录已建立 | ❌ | — | CTO | docs/POSTMORTEM/ |
| C-094 | CHANGELOG.md 存在且格式符合规范 | ❌ | — | CTO | CHANGELOG.md |
| C-095 | CURRENT-STATUS.md 存在且在最近 7 天内更新 | ❌ | — | CTO | docs/CURRENT-STATUS.md |
| C-096 | 每次部署后 CHANGELOG.md 已更新 | ❌ | — | CTO | CHANGELOG.md |
| C-097 | 新文档归档时 INDEX.md 同步更新 | ❌ | — | CTO | docs/INDEX.md |
| C-098 | Owner 沟通内容已转化为 GitHub 记录 | ❌ | — | CTO | Issues / ADR |

### 第 10 章：开发体验（C-099~C-104）

| 编号 | 检查项 | 状态 | 完成日期 | 负责人 | 产出文件 |
|------|--------|------|---------|--------|---------|
| C-099 | `docs/LOCAL-DEV-GUIDE.md` 已创建，包含完整搭建步骤 | ❌ | — | CTO | docs/LOCAL-DEV-GUIDE.md |
| C-100 | 后端 `.env.example` 包含所有必要变量（无默认密钥） | ✅ | — | CTO | .env.example |
| C-101 | 前端 `.env.example` 包含所有必要变量 | ✅ | — | CTO | .env.example |
| C-102 | 本地 `docker-compose up -d` 能成功启动 PostgreSQL + Redis | ✅ | — | CTO | docker-compose.yml |
| C-103 | `npx medusa develop` 能成功启动（后端 :9000 可访问） | ✅ | — | CTO | — |
| C-104 | Codex 指令格式规范已写入 AGENTS.md 或 Playbook | ✅ | 2026-03-13 | CTO | AGENTS.md |

### 第 11 章：人员交接（C-105~C-111）

| 编号 | 检查项 | 状态 | 完成日期 | 负责人 | 产出文件 |
|------|--------|------|---------|--------|---------|
| C-105 | `docs/ONBOARDING.md` 已创建，包含项目介绍、技术栈、快速入门 | ❌ | — | CTO | docs/ONBOARDING.md |
| C-106 | `docs/CURRENT-STATUS.md` 已创建，格式符合规范，最近 7 天内更新 | ❌ | — | CTO | docs/CURRENT-STATUS.md |
| C-107 | `docs/SPRINT-LOG.md` 已创建，包含当前 Sprint 记录 | ❌ | — | CTO | docs/SPRINT-LOG.md |
| C-108 | VPS SSH 权限文档已记录（操作手册在 docs/ 中） | ❌ | — | CTO | docs/ |
| C-109 | GitHub Secrets 清单已文档化（名称+用途） | ✅ | 2026-03-13 | CTO | ENGINEERING-PLAYBOOK.md |
| C-110 | 本地一键启动能在 15 分钟内完成（新人验证） | ✅ | — | CTO | — |
| C-111 | Bus Factor 自查清单已完成（所有知识项有文档覆盖） | ❌ | — | CTO | — |

### 第 12 章：开发路线管理（C-112~C-119）

| 编号 | 检查项 | 状态 | 完成日期 | 负责人 | 产出文件 |
|------|--------|------|---------|--------|---------|
| C-112 | `docs/ROADMAP.md` 已创建，包含 Phase 划分和模块一览表 | ❌ | — | CTO | docs/ROADMAP.md |
| C-113 | ROADMAP.md 已有"Owner 已确认"标记 | ❌ | — | CTO | docs/ROADMAP.md |
| C-114 | ROADMAP.md 包含变更日志表格 | ❌ | — | CTO | docs/ROADMAP.md |
| C-115 | `docs/SPRINT-LOG.md` 已创建，包含当前 Sprint 计划 | ❌ | — | CTO | docs/SPRINT-LOG.md |
| C-116 | 当前 Sprint 的 Issues 已创建并关联 Milestone | ❌ | — | CTO | GitHub Issues |
| C-117 | GitHub Projects 看板已配置，有当前 Sprint 视图 | ❌ | — | CTO | GitHub Projects |
| C-118 | Sprint 回顾已记录（最近一次 Sprint） | ❌ | — | CTO | docs/SPRINT-LOG.md |
| C-119 | ROADMAP 变更流程已至少走过一次 | ❌ | — | CTO | docs/ROADMAP.md |

---

## A.3 已知完成项汇总（快速参考）

基于当前 NordHjem 项目实际状态，以下检查项已确认完成：

| 检查项 | 编号 | 完成情况 |
|-------|------|---------|
| 后端 ESLint + Prettier | C-014, C-015 | ✅ 已完成 |
| CI lint + type-check | C-034~C-037 | ✅ 已完成 |
| Branch Protection reviewer=1 | C-025 | ✅ 已完成 |
| Husky + commitlint | C-020, C-021 | ✅ 已完成 |
| AGENTS.md | C-002 | ✅ 已完成（2026-03-13） |
| 前端 CI frozen lockfile | C-030 | ✅ 已完成 |
| Auto-merge CD_PAT | C-031 | ✅ 已完成 |
| Production admin bypass disabled | C-026 | ✅ 已完成 |
| Dockerfile lockfile fix | C-029 | ✅ 已完成 |
| codex-autofix npm install fix | C-032 | ✅ 已完成 |
| TypeScript strict | C-018, C-019 | ⏸️ 已延后 |
| 单元测试 | C-038, C-039, C-061~C-066 | ❌ 待 Phase 1 |
| npm audit | C-022, C-023, C-067, C-068 | ❌ 待 Phase 1 |
| E2E WebKit | C-064 | ❌ 待 Phase 1 |
| AI Reviewer | C-047 | ❌ 待 Phase 1 |
| Uptime Kuma | C-075 | ❌ 待 Phase 2 |
| Telegram 告警 | C-077 | ❌ 待 Phase 2 |

---

# 附录 B：当前状态速查

> 最后更新：2026-03-13 | 作者：CTO

## B.1 各维度完成率估算

基于已知的 NordHjem 项目状态：

| 维度 | 检查项数 | 估算已完成 | 估算完成率 | 备注 |
|------|---------|-----------|-----------|------|
| 角色与权限 | 5 | 5 | **100%** | 全部完成 |
| 项目立项 | 8 | 2 | **25%** | 仓库已建，文档类待补 |
| 代码规范 | 10 | 6 | **60%** | strict 延后，audit 待补 |
| 源码管理 | 10 | 9 | **90%** | Squash merge 策略待设 |
| CI/CD 流水线 | 15 | 9 | **60%** | 测试/告警/回滚待补 |
| 需求开发流程 | 12 | 6 | **50%** | 模板类文档待创建 |
| 质量保障 | 10 | 0 | **0%** | 全部待 Phase 1 |
| 运维与监控 | 12 | 4 | **33%** | 监控/备份待 Phase 2 |
| 事故响应与复盘 | 8 | 0 | **0%** | 待首次事故触发 |
| 文档体系 | 10 | 0 | **0%** | 本 Playbook 写完后可启动 |
| 开发体验 | 6 | 5 | **83%** | LOCAL-DEV-GUIDE 待创建 |
| 人员交接 | 7 | 2 | **29%** | 核心文档待创建 |
| 开发路线管理 | 8 | 0 | **0%** | ROADMAP 等文档待创建 |
| **总计** | **121** | **48** | **~40%** | — |

> **注意**：完成率基于已知信息估算，实际数字以 CTO 执行 A.2 完整清单后为准。

---

## B.2 已知技术债列表

| 编号 | 技术债描述 | 影响程度 | 来源 | 计划解决时间 |
|------|-----------|---------|------|------------|
| TD-001 | TypeScript strict 模式未开启 | 中（潜在类型安全问题） | 主动延后 | Phase 1 末期 |
| TD-002 | 无单元测试覆盖 | 高（重构风险大） | Phase 0 跳过 | Phase 1 中期 |
| TD-003 | npm audit 漏洞未检查 | 高（安全风险） | Phase 0 跳过 | Phase 1 初期 |
| TD-004 | 无 E2E 测试 | 中（回归风险） | Phase 0 跳过 | Phase 1 末期 |
| TD-005 | 无数据库备份机制 | 高（数据丢失风险） | 未实施 | Phase 2 初期 |
| TD-006 | 无生产监控（Uptime/告警） | 高（无法及时发现宕机） | Phase 0 跳过 | Phase 2 初期 |
| TD-007 | 无错误监控（Sentry） | 中（Bug 发现滞后） | Phase 0 跳过 | Phase 2 初期 |
| TD-008 | 核心文档缺失（ROADMAP/ONBOARDING 等） | 中（新人上手慢） | 本次 Playbook 补 | 立即（P0） |
| TD-009 | Issue/PR 模板缺失 | 低（效率问题） | 未创建 | Phase 1 初期 |
| TD-010 | Squash merge 未设为默认 | 低（git history 问题） | 未配置 | 立即 |

---

## B.3 待办优先级排序

### P0：立即执行（本周内）

> 这些项目阻塞其他工作或风险极高，必须优先完成。

1. **TD-008** 创建核心文档：
   - `docs/ONBOARDING.md`
   - `docs/INDEX.md`
   - `docs/ROADMAP.md`（与 Owner 确认后锁定）
   - `docs/CURRENT-STATUS.md`
   - `docs/SPRINT-LOG.md`
   - `docs/ADR/001-tech-stack.md`
   - `docs/LOCAL-DEV-GUIDE.md`
   - `CHANGELOG.md`

2. **TD-010** 在 GitHub 仓库 Settings 中设置 Squash merge 为默认合并策略（5 分钟）

3. 配置 GitHub Projects 看板，创建 Sprint 视图

4. 与 Owner 确认并锁定 ROADMAP（需要 Owner 确认）

### P1：本 Sprint 内完成（Phase 1 初期）

5. **TD-003** 集成 npm audit 到 CI（后端 + 前端）

6. **TD-002** 配置单元测试框架（Jest），补充核心模块测试

7. 创建 Issue 模板和 PR 模板

8. 文档化回滚流程并测试

9. 配置部署失败告警通知

### P2：Phase 1 末期

10. **TD-001** 逐步开启 TypeScript strict 模式（从后端开始，按模块推进）

11. **TD-004** 配置 Playwright E2E 测试，覆盖核心购买流程

12. AI Reviewer 集成（PR 自动审查）

### P3：Phase 2 初期

13. **TD-005** 配置数据库每日自动备份，并测试恢复流程

14. **TD-006** 部署 Uptime Kuma + Telegram 告警

15. **TD-007** 接入 Sentry 错误监控

16. 配置 SSL 证书自动续期

---

## B.4 快速参考：关键命令

### 后端（VPS：66.94.127.117）

```bash
# SSH 登录
ssh root@66.94.127.117

# 查看服务状态
docker-compose ps

# 查看后端日志
docker-compose logs -f backend

# 重启服务
docker-compose restart backend

# 紧急回滚（回到上一个镜像）
docker-compose stop backend
docker tag nordhjem-backend:latest nordhjem-backend:rollback-$(date +%Y%m%d)
docker tag nordhjem-backend:previous nordhjem-backend:latest
docker-compose up -d backend

# 数据库操作
docker-compose exec postgres psql -U postgres -d nordhjem

# 查看迁移状态
docker-compose exec backend npx medusa db:status
```

### GitHub Actions

```bash
# 手动触发部署（在 GitHub Actions 页面选择 workflow）
# 或通过 gh CLI：
gh workflow run deploy.yml --ref main
```

### 本地开发快捷命令

```bash
# 后端：一键启动（基础设施 + 服务）
cd nordhjem-medusa-backend && docker-compose up -d && npx medusa develop

# 前端：一键启动
cd nextjs-starter-medusa && yarn dev

# 同时启动（使用 tmux 或多终端）
# Terminal 1: 后端
# Terminal 2: 前端
```

---

## B.5 项目关键链接

| 资源 | 链接 |
|------|------|
| 后端仓库 | https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend |
| 前端仓库 | https://github.com/Nickwenniyxiao-art/nextjs-starter-medusa |
| VPS 管理 | ssh root@66.94.127.117 |
| Medusa.js v2 文档 | https://docs.medusajs.com/v2/ |
| Next.js 15 文档 | https://nextjs.org/docs |
| GitHub Projects | （待配置后更新） |
| 生产环境 URL | （待域名配置后更新） |
| Sentry Dashboard | （待 Phase 2 配置后更新） |
| Uptime Kuma | （待 Phase 2 部署后更新） |

---

*文档版本：v1.0 | 最后更新：2026-03-13 | 作者：CTO*  
*本文档是 NordHjem Engineering Playbook 的第 9~12 章及附录部分。*  
*前半部分（第 1~8 章）详见 `docs/ENGINEERING-PLAYBOOK.md`。*
