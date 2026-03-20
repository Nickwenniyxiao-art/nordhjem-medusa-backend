# Architecture Decision Records (ADR)

## 什么是 ADR？

ADR 记录项目中的重要技术决策，包括背景、选择和理由。帮助新成员理解“为什么这样做”。

## ADR 索引

| 编号    | 标题 | 状态 | 日期 |
| ------- | ---- | ---- | ---- |
| ADR-001 | 技术栈选型 | Accepted | 2025-01-01 |
| ADR-002 | 部署策略 | Accepted | 2026-03 |
| ADR-003 | CI/CD 管线 | Accepted | 2026-03 |
| ADR-004 | AI Workflow | Accepted | 2026-03 |
| ADR-005 | 部署架构 | Accepted | 2026-03 |
| ADR-006 | ESLint 放宽策略 | Accepted | 2026-03 |
| ADR-007 | Lockfile 策略 | Accepted | 2026-03 |
| ADR-008 | Husky + Commitlint | Accepted | 2026-03 |
| ADR-009 | CI Gate v2 — Bot 账号自动审批方案 | Accepted | 2026-03-14 |
| ADR-010 | 双层门禁 EGP 执行强制体系 | Accepted | 2026-03-19 |
| ADR-011 | 原子化执行保障体系（EGP） | Accepted | 2026-03-16 |

## 如何添加新 ADR

1. 复制模板创建新文件：`ADR-{NNN}-{简短标题}.md`
2. 编号递增（当前最大：011）
3. 填写所有必须章节
4. 更新本索引
5. 提交 PR

## ADR 模板

参见 `docs/ADR/000-template.md`。
