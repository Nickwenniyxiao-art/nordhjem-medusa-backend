# ADR-011: 原子化执行保障体系（EGP）

## 状态

已采纳

## 日期

2026-03-16

## 背景

NordHjem 项目从 Phase 0 到 Phase 4 共有 59 个 ROADMAP Task，涉及两个仓库、多种文件类型。此前的管理方式存在以下问题：

1. **追踪断层**：ROADMAP.md 记录了高层目标，但无法追踪到具体 PR 和 Action 粒度
2. **状态不透明**：Owner 需要逐个检查 PR 才能了解某个 Task 的执行进度
3. **执行无约束**：AI Agent（Codex/Claude Code）可以提交与 ROADMAP 无关的变更，无 CI 门禁拦截
4. **Hotfix 失控**：紧急修复跳过流程后，缺乏补录追踪机制

需要一个自动化的执行保障体系，确保每行代码都可追溯到 ROADMAP 目标。

## 方案对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| 方案 A: 纯 ROADMAP.md 手动管理 | 零成本，无需工具链 | 无法原子化追踪，状态更新易遗漏 |
| 方案 B: 第三方项目管理工具（Linear/Jira） | 功能丰富，可视化强 | 引入外部依赖，无法与 CI 集成 |
| 方案 C: TASK-REGISTRY.json + CI 门禁（EGP） | 原生 GitHub 集成，CI 自动校验，JSON 可程序化处理 | 初期搭建成本（约 14.5h），需维护 JSON 文件 |

## 决策

选择 **方案 C — EGP（Execution Guarantee Protocol）**。

核心理由：
1. **GitHub 原生**：不引入第三方工具，所有数据在仓库内，通过 CI 自动校验
2. **原子化追踪**：ROADMAP Task → Action → PR，三级可追溯
3. **CI 门禁强制**：每个 PR 必须关联 EGP Action，防止无关变更
4. **Owner 友好**：通过 Projects v2 Sub-issues 提供可视化进度，不需要看 JSON

### EGP 架构

```
docs/TASK-REGISTRY.json (Source of Truth)
    ↕ CI 校验
.github/workflows/check-execution-protocol.yml (PR 合规检查)
.github/workflows/check-registry-integrity.yml (注册表完整性审计)
    ↕ 可视化同步
GitHub Sub-issues + Projects v2 (Owner 看板)
```

### 文件清单

| 文件 | 用途 |
|------|------|
| `docs/TASK-REGISTRY.json` | 唯一的任务执行 source of truth |
| `docs/schemas/task-registry.schema.json` | JSON Schema 校验规范 |
| `.github/workflows/check-execution-protocol.yml` | PR EGP 合规检查 |
| `.github/workflows/check-registry-integrity.yml` | 注册表完整性审计 + PR 审计报告 |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR 模板（含 EGP Action 字段） |
| `.github/workflows/sync-registry-to-issues.yml` | Sub-issues 同步（A8） |

## 后果

### 正面影响

- 每行代码都可追溯到 ROADMAP 目标
- Owner 无需逐个检查 PR，通过 Projects Board 进度条直接看到完成百分比
- Hotfix bypass 自动生成补录 Issue，不会遗忘
- skipped Action 在审计报告中高亮，Owner 可定期审查

### 负面影响 / 需关注的风险

- 每个 PR 需要额外填写 EGP Action 字段（通过 PR 模板降低负担）
- TASK-REGISTRY.json 在大量并发 PR 时可能产生 merge conflict（通过 JSON 格式和 Action 粒度缓解）
- 初始搭建期（A1-A8）使用 `egp-bootstrap` label 豁免自身检查，存在短暂的"自检真空期"
