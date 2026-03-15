# ADR-003: CI/CD 管线设计

## 状态

Accepted

## 日期

2026-03

## 背景

NordHjem 采用 AI 驱动的开发模式（CTO Agent + Codex Agent），需要严格的自动化管线确保代码质量。人类 Owner 不懂技术，所有质量保障必须自动化。

## 决策

选择 **GitHub Actions 全自动化管线**，实现从 PR 到部署的完整自动化。

### PR 阶段检查（按顺序）

1. `check-pr-metadata` — PR 格式检查（标题、body、assignee）
2. `check-roadmap-ref` — ROADMAP 引用检查
3. `check-project-board` — Issue 必须在 Project Board 上
4. `lint-and-typecheck` — ESLint + TypeScript 编译检查
5. `gitleaks` — 密钥泄露扫描
6. `semgrep` — 静态安全分析
7. `dependency-audit` — 依赖漏洞检查
8. `ai-code-review` — AI 自动代码审查
9. `pr-compliance-fix` — 自动修复 PR 格式问题

### CD 阶段

- develop 合并 → 自动部署 staging
- main 合并 → 自动部署 production（需 Owner 审批）

### 自动化辅助

- `codex-autofix` — 监控 CI 失败，自动创建修复 PR
- `stale-bot` — 自动管理不活跃 Issue/PR
- `find-duplicate-issue` — 新 Issue 重复检测
- `dependabot` — 自动依赖更新

## 替代方案

| 方案           | 优点                   | 缺点           | 结论    |
| -------------- | ---------------------- | -------------- | ------- |
| Jenkins        | 灵活                   | 需要自建服务器 | 放弃    |
| GitLab CI      | 集成度高               | 需要迁移仓库   | 放弃    |
| GitHub Actions | 原生集成，免费额度充足 | YAML 学习曲线  | ✅ 选用 |

## 后果

- ✅ PR 质量有保障（10+ 自动检查）
- ✅ 安全检查自动化
- ✅ 部署全自动化
- ⚠️ CI 检查较多，PR 合并时间较长（可接受）
- ⚠️ YAML 维护成本（CTO Agent 负责）
