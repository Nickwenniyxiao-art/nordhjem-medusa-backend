# ADR-003: CI/CD 架构设计

## 状态

已采纳

## 日期

2026-03-13

## 背景

NordHjem 项目由 AI（Codex）辅助开发，代码频繁提交，传统的纯人工 Review + 手动部署模式已无法适应节奏。需要设计一套覆盖"代码提交 → 质量验证 → 多环境部署"的完整自动化流水线，满足以下目标：

1. **质量自动保障**：Lint、Test、类型检查自动运行，不通过不合并
2. **AI Review 门禁**：引入 AI 代码审查，弥补人工 Review 的精力瓶颈
3. **多环境自动部署**：develop/staging/main 三个环境各自独立部署，互不干扰
4. **失败自愈能力**：CI 失败后可触发 Codex Auto-fix 自动修复（见 ADR-004）

当时的现状：没有 CD 流水线，部署靠手动 SSH 上服务器执行脚本，风险高、效率低。

## 方案对比

### CD 流水线数量

| 方案 | 优点 | 缺点 |
|------|------|------|
| 单条 CD（通过环境变量区分） | 配置集中、维护简单 | 环境间逻辑耦合，一条流水线失败影响所有环境；权限控制粒度粗 |
| 三条独立 CD（cd-test / cd-staging / cd-production） | 职责单一、环境完全隔离、独立触发和回滚 | 配置文件数量多，有一定重复 |

### 代码审查方式

| 方案 | 优点 | 缺点 |
|------|------|------|
| 纯人工 Review | 审查深度高、上下文理解好 | 在 AI 高频提交场景下无法及时响应，形成瓶颈 |
| 纯 AI Review | 7×24 可用、响应快、覆盖率高 | 可能遗漏业务逻辑层面的问题；依赖 API 可用性 |
| AI Review 作为必要门禁 + 人工按需介入 | 兼顾效率和质量；AI 拦截明显问题，人工聚焦关键决策 | 需要治理 AI Review 的误报率 |

## 决策

采用**三条独立 CD 流水线 + AI Review 必要门禁**的架构：

### CI 流水线（共用）

触发条件：所有 PR 和 push
步骤：
1. 安装依赖（`npm ci --legacy-peer-deps`）
2. Lint 检查（ESLint）
3. 类型检查（TypeScript）
4. 单元/集成测试（Jest）
5. AI Review（GPT-4o-mini，PR 创建/更新时触发，结果作为 Check）

### CD 流水线

| 流水线 | 触发分支 | 部署目标 | 部署方式 |
|--------|----------|----------|----------|
| `cd-test` | `develop` | 开发服务器 | SSH + Docker Compose pull & up |
| `cd-staging` | `staging` | 预发服务器 | SSH + Docker Compose pull & up |
| `cd-production` | `main` | 生产服务器（66.94.127.117） | SSH + Docker Compose pull & up + PM2 restart |

### 合并保护规则

- feature → develop：CI 全通过 + AI Review 通过（Required Check）
- develop → staging：CI 全通过
- staging → main：CI 全通过 + 人工审批（Branch Protection）

## 后果

### 正面影响

- 部署流程完全自动化，消除手动 SSH 部署的风险
- AI Review 7×24 全时段覆盖，高频 PR 不再积压
- 三条独立流水线互相隔离，一个环境的部署失败不影响其他环境
- 流水线配置即代码（GitHub Actions YAML），变更可追溯

### 负面影响 / 需关注的风险

- AI Review 依赖 OpenAI API 可用性，API 故障会导致 PR 无法合并（需配置 bypass 机制）
- 三条 CD 配置有一定重复，后续应抽取为可复用的 Composite Action 或 Reusable Workflow
- 生产部署无蓝绿/金丝雀能力，依赖单 VPS（见 ADR-005），存在部署窗口期中断服务的风险
