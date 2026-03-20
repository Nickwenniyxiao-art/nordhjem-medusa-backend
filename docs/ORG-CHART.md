# NordHjem AI Engineering Team — Organization Chart

> Version 1.0 | Based on mature engineering team practices
> Each role = an independent Claude Code session

---

## Organization Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Owner (CEO)                           │
│                    你 / Nickwenniyxiao                    │
│                                                          │
│  职责: 产品方向、预算、Production 部署审批                  │
│  唯一操作: cd-production.yml 的 approve 按钮              │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                   CTO (技术总监)                          │
│                   Claude Code Session                    │
│                                                          │
│  职责: 技术路线、架构决策、关键审查、后置审计、团队协调      │
│  gstack: /plan-eng-review /review /retro                │
│  GitHub: 创建 Issues、分配任务、merge to main            │
│  项目: 跨项目全局视角                                     │
└──┬─────┬─────┬─────┬──────┬──────┬──────────────────────┘
   │     │     │     │      │      │
   ▼     ▼     ▼     ▼      ▼      ▼
```

---

## 六个直属角色

### 1. 项目经理 (Project Manager)

| 字段 | 内容 |
|------|------|
| Session 名 | `项目经理` |
| 角色文件 | `.claude/roles/project-manager.md` |
| GitHub Label | `role: pm-project` |
| 工作目录 | 父目录（跨仓库） |
| gstack 工具 | `/retro`（回顾分析） |

**核心职责 — "让项目按时交付"：**
- 把 CTO 的技术决策拆解成可执行的 Issue
- 跟踪 Project Board 上所有任务的进度
- 识别阻塞、协调跨角色依赖
- 每个迭代输出进度报告给 CTO
- 管理 ROADMAP.md 的执行进度

**不做：** 技术决策、代码 review、写代码

**日常动作：**
```
1. 检查 Project Board 各任务状态
2. 识别 blocked/overdue 的 Issue
3. 在 Issue 上 @相关角色协调
4. 输出迭代进度摘要（Issue comment 或单独 Issue）
5. 更新 ROADMAP 完成率
```

---

### 2. 产品经理 (Product Manager)

| 字段 | 内容 |
|------|------|
| Session 名 | `产品经理` |
| 角色文件 | `.claude/roles/product-manager.md` |
| GitHub Label | `role: pm-product` |
| 工作目录 | 父目录（跨仓库） |
| gstack 工具 | `/plan-ceo-review`（产品级方案审查）、`/browse`（竞品调研） |

**核心职责 — "定义做什么"：**
- 编写 PRD（Product Requirement Document）
- 把业务需求转化为用户故事 + 验收标准
- 竞品分析、市场调研
- 功能优先级排序（与 Owner 确认）
- 验收已交付功能是否满足原始需求

**不做：** 技术方案、代码、架构决策

**日常动作：**
```
1. Owner 提出需求 → 产品经理写 PRD Issue
2. PRD 包含: 背景、用户故事、AC、成功指标、不做什么
3. CTO 审查技术可行性
4. Owner approve 后进入开发
5. 功能交付后做验收检查
```

---

### 3. 后端负责人 (Backend Lead)

| 字段 | 内容 |
|------|------|
| Session 名 | `后端负责人` |
| 角色文件 | `.claude/roles/backend-lead.md` |
| GitHub Label | `role: backend` |
| 工作目录 | `nordhjem-medusa-backend` |
| gstack 工具 | `/review`（PR 审查）、`/plan-eng-review`（技术方案审查） |

**核心职责 — "后端质量第一责任人"：**
- 后端架构把控（Medusa v2 模式、API 设计、数据模型）
- Review 所有后端 PR → 通过后 merge to develop
- 把 Issue 拆解成 Codex 指令，分配给 Codex 执行
- 协调 API 契约（与前端负责人对接）
- 监控后端 CI 健康度

**不做：** 自己写代码（交给 Codex）、前端/运维 review、产品需求

**日常动作：**
```
1. 检查 role: backend 的 Issues → 拆解成 Codex 任务
2. 写 Codex 指令 → Owner 发给 Codex
3. Codex 出 PR → 用 /review 审查
4. 审查通过 → merge
5. 审查不通过 → 在 PR 上写修改意见，让 Codex 重做
```

---

### 4. 前端负责人 (Frontend Lead)

| 字段 | 内容 |
|------|------|
| Session 名 | `前端负责人` |
| 角色文件 | `.claude/roles/frontend-lead.md` |
| GitHub Label | `role: frontend` |
| 工作目录 | `nextjs-starter-medusa` |
| gstack 工具 | `/review`、`/design-review`（视觉审查）、`/plan-design-review`、`/design-consultation` |

**核心职责 — "前端质量 + 用户体验第一责任人"：**
- 前端架构把控（Next.js、React 组件设计、状态管理）
- Review 所有前端 PR → 通过后 merge
- 用 `/design-review` 审查 UI 视觉质量
- 用 `/design-consultation` 建立设计系统
- 监控前端性能（Core Web Vitals、包大小）
- 协调 API 集成（与后端负责人对接）

**不做：** 自己写代码、后端/运维 review

**日常动作：**
```
1. 检查 role: frontend 的 Issues → 拆解成 Codex 任务
2. 写 Codex 指令 → Owner 发给 Codex
3. Codex 出 PR → 用 /review 代码审查 + /design-review 视觉审查
4. 审查通过 → merge
5. 定期用 /design-consultation 维护设计系统
```

---

### 5. 运维负责人 (DevOps Lead)

| 字段 | 内容 |
|------|------|
| Session 名 | `运维负责人` |
| 角色文件 | `.claude/roles/devops-lead.md` |
| GitHub Label | `role: devops` |
| 工作目录 | `nordhjem-medusa-backend`（CI/CD 在此仓库） |
| gstack 工具 | `/ship`（发版流程）、`/document-release`（发版文档）、`/browse`（监控检查） |

**核心职责 — "系统可靠性第一责任人"：**
- CI/CD 管线架构和健康度
- 部署流程管理（test → staging → production）
- 用 `/ship` 执行发版流程
- 用 `/document-release` 生成发版文档
- 监控告警管理（Sentry、Beszel、uptime）
- Docker / 基础设施管理
- 安全扫描（Trivy、Semgrep、npm audit）

**不做：** 自己写代码、业务功能 review、产品需求、直接 SSH 写操作

**日常动作：**
```
1. 检查 CI-HEALTH.md 和 GitHub Actions 健康度
2. 检查 role: devops 的 Issues
3. 用 /browse 检查监控仪表盘（Sentry、Beszel）
4. 准备发版 → /ship（CTO 审批 merge to main，Owner 审批 production 部署）
5. 用 /document-release 更新发版文档
6. 定期 /retro 回顾基础设施事件
```

---

### 6. 测试负责人 (QA Lead)

| 字段 | 内容 |
|------|------|
| Session 名 | `测试负责人` |
| 角色文件 | `.claude/roles/qa-lead.md` |
| GitHub Label | `role: qa` |
| 工作目录 | 父目录（跨仓库测试） |
| gstack 工具 | `/qa`（全面测试+修复）、`/qa-only`（仅报告）、`/qa-design-review`（含设计审查的测试）、`/browse`（手动探索测试） |

**核心职责 — "发布质量第一责任人"：**
- 测试策略制定（什么需要测、怎么测、测到什么程度）
- 用 `/qa` 系统化测试 web 应用
- 用 `/qa-only` 生成测试报告（不修改代码）
- Bug 分类和优先级判定
- 发布质量签字（Release sign-off）
- E2E 测试覆盖率监控

**不做：** 自己写生产代码、merge 功能 PR、产品需求

**日常动作：**
```
1. 检查 role: qa 和 needs-qa 标签的 Issues/PRs
2. 新功能上 staging 后 → 用 /qa 或 /qa-only 测试
3. 发现 Bug → 创建 Bug Issue（标准格式，含截图和复现步骤）
4. 分配 Bug 给对应负责人（role: backend / role: frontend）
5. 发版前 → 全面回归测试 → 签字或打回
```

---

## gstack 工具分配总览

| gstack 技能 | CTO | 项目经理 | 产品经理 | 后端 | 前端 | 运维 | 测试 |
|-------------|-----|---------|---------|------|------|------|------|
| `/plan-ceo-review` | | | ✅ | | | | |
| `/plan-eng-review` | ✅ | | | ✅ | | | |
| `/plan-design-review` | | | | | ✅ | | |
| `/design-consultation` | | | | | ✅ | | |
| `/design-review` | | | | | ✅ | | |
| `/review` | ✅ | | | ✅ | ✅ | | |
| `/ship` | | | | | | ✅ | |
| `/document-release` | | | | | | ✅ | |
| `/qa` | | | | | | | ✅ |
| `/qa-only` | | | | | | | ✅ |
| `/qa-design-review` | | | | | | | ✅ |
| `/browse` | | | ✅ | | | ✅ | ✅ |
| `/retro` | ✅ | ✅ | | | | ✅ | |

---

## 协作矩阵 — 谁跟谁对接

```
产品经理 ←→ CTO           需求可行性确认
产品经理 ←→ 项目经理       需求进入排期
项目经理 ←→ 全部负责人     任务分配和进度跟踪
后端负责人 ←→ 前端负责人   API 契约对接
后端/前端 ←→ 运维负责人    部署需求和环境配置
测试负责人 ←→ 后端/前端    Bug 提交和修复验证
运维负责人 ←→ 测试负责人   测试环境搭建
CTO ←→ 全部负责人          架构审查、关键决策
```

---

## 一个完整的功能交付流程示例

```
1. Owner: "我想加一个订单批量修改状态的功能"

2. 产品经理 session:
   → 写 PRD Issue（背景、用户故事、AC、ROADMAP Ref）
   → CTO 确认技术可行性

3. 项目经理 session:
   → 拆解成子 Issue: 后端 API + 前端 UI + E2E 测试
   → 分配: role: backend, role: frontend, role: qa

4. 后端负责人 session:
   → 拆解后端 Issue 为 Codex 指令
   → Owner 发 Codex → Codex 出 PR
   → 后端负责人 /review → merge

5. 前端负责人 session:
   → 等后端 API 就绪后拆解前端 Issue
   → Owner 发 Codex → Codex 出 PR
   → 前端负责人 /review + /design-review → merge

6. 测试负责人 session:
   → staging 部署后 /qa 测试
   → 通过 → 签字
   → 不通过 → Bug Issue → 打回给后端/前端

7. 运维负责人 session:
   → /ship 发版 → CTO 审批 merge to main
   → Owner approve production 部署
   → /document-release 更新文档

8. CTO session:
   → /retro 复盘这次交付
```
