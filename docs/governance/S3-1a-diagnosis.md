# S3-1a 文档治理工作流根因诊断报告

日期：2026-03-16  
调查人：CTO

## 1. doc-format-check 失败根因

### 现象
约 20 次运行中大部分失败，历史报错集中在 `MD041` / `MD022` / `MD032` / `MD036`（文件首行不是 H1、标题/列表缺少空行、用强调代替标题）。

### 诊断过程与证据
- 尝试执行：`npx markdownlint 'docs/**/*.md' --config .markdownlint.yml`。
- 本地环境无法安装 `markdownlint`（npm 403），因此无法在本地复现实例化的 MD 规则计数；但可确认 CI 工作流中确实会执行 markdownlint，并且文档首行模板样式与 MD041 报错特征一致。
- 抽样检查：
  - `docs/FINTECH-AML.md` / `docs/FINTECH-KYC.md` / `docs/ML-TRAINING-PIPELINE.md` 的首行均为 `> 项目名称: [项目名称]`，而非 `#` 一级标题。
  - `docs/*.md` 中存在大量相同首行模板（本地统计 50 个文件命中）。

### 根因
大量文档由同一模板批量生成，模板默认以引用块元信息起始（`> 项目名称...`），未满足 markdownlint 常见规则（尤其 MD041）。这属于**模板级系统性问题**，不是单个文档偶发格式问题。

### 建议修复方案
- 方案A：修正所有文档模板格式（建议将首行改为 H1，并补齐标题/列表空行）；一次修复后可覆盖批量文档，最彻底。
- 方案B：调整 `.markdownlint.yml`，对模板文档放宽 `MD041`/`MD022`/`MD032`/`MD036`。
- 方案C：在 `doc-format-check.yml` 中排除模板/占位文档，仅对“已激活文档”执行严格 lint。

---

## 2. doc-registry-check 失败根因

### 现象
CI 报告 33 个一致性错误，包含“野文档（Unregistered doc）”和“Unknown type”。

### 诊断过程与证据
按工作流逻辑本地复现检查（`docs/` 全量扫描，`docs/standards/` 白名单排除）：

- Unregistered doc（野文档）：**30 个**
  - 主要集中在：`docs/ADR/`、`docs/modules/`、`docs/research/`、`docs/bugs/` 等目录。
- Unknown type：**3 个**
  - `POSTMORTEM` → `docs/POSTMORTEM/000-template.md`
  - `DORA-METRICS` → `docs/DORA-METRICS.md`
  - `LICENSE-DOC` → `docs/LICENSE-DOC.md`
- Missing files（注册但不存在）：**0 个**。

> 30（野文档）+ 3（Unknown type）= 33，与 CI 错误总量一致。

### 根因
- `DOC-REGISTRY.json` 对 docs 文件的登记范围与当前仓库 docs 实际规模不一致，存在一批“已存在但未登记”的文档。
- 同时 `DOC-REGISTRY.json` 中存在 3 个 `id` 未在 `docs/standards/DOC-LIBRARY.json` 定义，触发 Unknown type。

### 建议修复方案
- 方案A：将所有 `docs/` 下在管文件补充注册到 `DOC-REGISTRY.json`，并补齐 `DOC-LIBRARY.json` 类型定义。
- 方案B：将非项目必需或模板类文档迁移到白名单目录（如 `docs/standards/templates/`），避免被 registry-check 计入。
- 方案C：调整 `doc-registry-check.yml` 白名单策略（例如显式豁免 `docs/ADR/`、`docs/modules/`、`docs/research/`）。

---

## 3. doc-gate-check 状态

`doc-gate-check.yml` 触发条件为：

```yaml
on:
  pull_request:
    paths:
      - 'src/**'
```

结论：触发条件设计正确（仅在修改源代码时触发文档门禁）。最近 0 次触发说明近期 PR 未修改 `src/**`，属预期行为，不需要修复。

---

## 结论（供 S3-1b 执行）

1. `doc-format-check` 的核心问题是**模板格式系统性不兼容 markdownlint**，优先级建议：先修模板（A），必要时再做规则例外（B/C）。
2. `doc-registry-check` 的 33 错误可明确拆解为：**30 个未登记文件 + 3 个未知类型**。S3-1b 需在“扩充注册表”与“收敛扫描范围”之间做治理策略选择。
3. `doc-gate-check` 当前 0 触发为正常现象，无需改动。
