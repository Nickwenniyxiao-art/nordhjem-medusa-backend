# ADR-002: 分支策略

## 状态

已采纳

## 日期

2026-03-01

## 背景

随着项目进入 CI/CD 整改阶段，原有的简单分支模型（仅 main + feature）已无法满足以下需求：

- 需要区分**开发环境**（频繁变更）、**测试/预发环境**（质量门禁）、**生产环境**（稳定）
- Codex AI 自动生成代码并提交 PR，需要在合并到生产前经过多层验证
- 需要支持**自动化部署**：每个分支对应一个环境，合并即触发部署
- 需要**质量门禁**：CI 不通过不允许合并，AI Review 作为必要检查项

当时的痛点：直接向 main 提 PR，测试和生产没有隔离，出问题影响线上。

## 方案对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| GitFlow（main + develop + release + hotfix + feature） | 标准成熟、Release 流程清晰 | 分支过多、流程繁琐；release 分支在 AI 开发模式下价值不大 |
| Trunk-based（单主干 + 短生命周期 feature） | 简单、CI 集成友好、减少合并冲突 | 缺少预发环境隔离；对 feature flag 体系要求高；当前团队规模不适合 |
| 自定义四层（feature→develop→staging→main） | 环境隔离清晰、每层对应一个部署环境、质量门禁逐层收紧 | CD 配置复杂（需三条流水线）；分支合并链路较长 |

## 决策

采用**自定义四层分支策略**：

```
feature/* → develop → staging → main
```

各层职责：

| 分支 | 对应环境 | 部署触发 | 质量门禁 |
|------|----------|----------|----------|
| `feature/*` | 本地 / Preview | PR 创建时触发 CI | Lint + Test + AI Review |
| `develop` | 开发环境 | 合并后自动部署 | CI 全通过才可合并 |
| `staging` | 预发布环境 | 合并后自动部署 | CI 全通过 + 人工/AI 确认 |
| `main` | 生产环境 | 合并后自动部署 | staging 验证通过 |

合并规则：

- feature → develop：需 CI 通过 + AI Review 通过
- develop → staging：需 CI 通过，可配置定期自动晋级
- staging → main：需手动触发（或审批），保护生产稳定

## 后果

### 正面影响

- 环境隔离清晰，生产环境受到多层保护
- 每个环境对应一条独立 CD 流水线，部署逻辑职责单一
- AI Review 强制门禁有效拦截低质量代码进入生产
- 支持 Codex 全自动开发流程（feature PR → CI → merge → 逐层晋级）

### 负面影响 / 需关注的风险

- 需要维护三条独立 CD 流水线（cd-test、cd-staging、cd-production），配置复杂度上升
- feature 到生产的路径变长（需经过两次合并），紧急修复需要额外的 hotfix 流程
- staging → main 若依赖人工审批，在 AI 自动化开发场景下可能成为瓶颈
