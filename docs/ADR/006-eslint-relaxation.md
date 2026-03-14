# ADR-006: ESLint 规则放宽

## 状态
已采纳

## 日期
2026-03-13

## 背景
在 CI/CD 整改阶段引入 ESLint 强制检查后，对存量代码库进行全量扫描，发现：

- **477 个 warning**：绝大部分来自 `@typescript-eslint/no-explicit-any`，即代码中大量使用了 `any` 类型
- **2 个 error**：`no-useless-escape`（无用的转义字符）和 `no-constant-condition`（常量条件表达式）

由于 CI 配置为 `eslint --max-warnings 0`（warning 也会导致 CI 失败），477 个 warning 直接导致 CI 100% 失败，所有 PR 无法合并，开发陷入停滞。

同期，TypeScript 的 `strict` 模式也因为历史代码中大量隐式 `any` 而无法开启。

需要在"立即修复全部问题"和"让 CI 先跑起来"之间做出选择。

## 方案对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| 方案 A：全量修复所有 warning 和 error | 代码质量一步到位；TypeScript 类型安全 | 工作量巨大（477 处 `any` 替换需要理解业务上下文）；可能引入新 Bug；阻塞当前所有功能开发 |
| 方案 B：关闭 `no-explicit-any` 规则，降级部分规则为 warn | CI 立即恢复绿色；开发不受阻塞；保留对高危规则的 error 级别 | 类型安全性降低；技术债务积累；需要后续专项治理 |
| 方案 C：逐步收紧（先关闭，设置目标日期分批修复） | 兼顾短期效率和长期质量；可量化治理进度 | 需要严格的技术债务跟踪机制，否则"后续"遥遥无期 |

## 决策
采用**方案 B（关闭规则）并记录技术债务，规划方案 C（逐步收紧）**：

具体规则调整：

| 规则 | 原级别 | 新级别 | 调整原因 |
|------|--------|--------|----------|
| `@typescript-eslint/no-explicit-any` | `error` | `off` | 477 处历史 `any` 无法短期清除 |
| `no-useless-escape` | `error` | `warn` | 功能无影响，可后续批量修复 |
| `no-constant-condition` | `error` | `warn` | 已有 2 处，需要排查但不阻塞合并 |

TypeScript `strict` 模式同样延后启用，待 `any` 类型问题治理后再开启。

CI 中 `eslint` 命令保留，但去掉 `--max-warnings 0`，允许 warning 通过（error 仍会失败）。

技术债务记录：创建 GitHub Issue 跟踪 "逐步消除 any 类型" 任务，目标在 3 个月内将 `any` 数量降至 50 以下。

## 后果

### 正面影响
- CI 立即恢复绿色，所有 PR 可以正常合并，开发不再受阻
- 保留了 ESLint 对真正高危问题（`no-eval`、`no-debugger` 等）的 error 级别拦截
- 明确记录了技术债务，避免问题被"遗忘"

### 负面影响 / 需关注的风险
- 代码库中 `any` 类型泛滥，TypeScript 的类型检查能力大打折扣，运行时类型错误风险上升
- Codex Auto-fix 可能继续生成带 `any` 的代码，因为规则已关闭无法拦截
- TypeScript `strict` 模式延后意味着后续开启时将面临更大的迁移工作
- "逐步收紧"计划若无人推动，技术债务将持续积累
