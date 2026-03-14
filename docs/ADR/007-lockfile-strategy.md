# ADR-007: Lockfile 同步策略

## 状态
已采纳

## 日期
2026-03-13

## 背景
在 CI/CD 整改过程中，遇到了依赖安装相关的两个连锁问题：

**问题一：Peer Dependency 冲突**
Medusa.js v2 后端依赖 `@mikro-orm/*` 系列包，其 peer dependency 声明与其他依赖包的版本范围存在冲突。`npm ci`（严格模式，依赖 lockfile）在某些场景下会因为 peer dependency 不满足而直接报错退出，导致 CI 安装步骤失败。

**问题二：Codex Auto-fix 死循环**
在 Codex Auto-fix 流程中，修复步骤需要先安装依赖（运行测试前）。由于使用 `npm ci`，安装步骤本身失败，Auto-fix 无法完成测试验证，触发下一次 Auto-fix 尝试，形成死循环。即使 Auto-fix 有 3 次重试上限（见 ADR-004），每次都卡在安装步骤，浪费了 3 次修复机会。

需要统一确定在不同场景下使用哪种 npm 安装命令。

## 方案对比

| 方案 | 命令 | 优点 | 缺点 |
|------|------|------|------|
| 严格模式 | `npm ci` | 完全基于 lockfile，安装结果 100% 可复现；CI 标准做法 | peer dependency 冲突直接失败；lockfile 与 package.json 不一致时失败 |
| 宽松模式 | `npm install` | 自动解析 peer dependency；容忍轻微版本偏差 | 可能悄悄升级依赖版本，破坏可复现性；lockfile 可能被修改 |
| 兼容模式 | `npm install --legacy-peer-deps` | 跳过 peer dependency 严格校验；兼容旧包；安装成功率高 | peer dependency 版本可能不完全满足，存在潜在运行时兼容风险 |

## 决策
根据场景分别选择安装命令，采用**最小必要宽松原则**：

| 场景 | 命令 | 理由 |
|------|------|------|
| **CI 流水线（正常 PR）** | `npm ci --legacy-peer-deps` | 基于 lockfile 保证可复现性，同时跳过 peer dependency 校验以避免 mikro-orm 冲突 |
| **Codex Auto-fix 流程** | `npm install --legacy-peer-deps` | 非 `npm ci`，避免 lockfile 不一致导致安装失败进而触发死循环；允许 lockfile 更新 |
| **Dockerfile（生产构建）** | `npm ci --legacy-peer-deps` | 生产镜像必须基于 lockfile，确保构建可复现 |
| **本地开发（初始化）** | `npm install --legacy-peer-deps` | 开发者本地环境容许灵活性 |

Lockfile 同步规则：
- Codex Auto-fix 在 `npm install` 后，若 lockfile 有变更，必须将更新后的 lockfile 包含在修复 commit 中
- PR 合并时若 lockfile 有变更，需在 PR 描述中说明原因

## 后果

### 正面影响
- CI 安装步骤不再因 peer dependency 冲突失败，流水线稳定性显著提升
- Codex Auto-fix 死循环问题彻底解决，3 次重试机会用于真正的代码修复
- 生产 Dockerfile 仍基于 lockfile，生产构建可复现性得到保障

### 负面影响 / 需关注的风险
- `--legacy-peer-deps` 意味着部分 peer dependency 版本约束被跳过，潜在运行时兼容问题需要靠测试覆盖来发现
- Auto-fix 场景使用 `npm install` 可能偶发 lockfile 变更，需关注 lockfile drift（锁文件漂移）
- 根本原因（mikro-orm peer dependency 冲突）未解决，待 mikro-orm 或相关依赖发版修复后，应重新评估是否可去掉 `--legacy-peer-deps`
