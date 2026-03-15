# NordHjem 文档索引

> 最后更新：2026-03-15
> 本文件是所有项目文档的总目录。每新增文档必须更新此索引。

---

## 体系文档

| 文件 | 用途 | 路径 |
|------|------|------|
| Engineering Playbook | 开发管理体系纲领（13 章 + 2 附录） | docs/ENGINEERING-PLAYBOOK.md |
| 开发路线图 | 🔒 Owner 锁定的开发计划 | docs/ROADMAP.md |
| 当前状态快照 | 项目进度、技术债、待办 | docs/CURRENT-STATUS.md |
| Sprint 日志 | Sprint 计划 + 执行 + 回顾 | docs/SPRINT-LOG.md |
| 变更历史 | 每次 production 部署记录 | docs/CHANGELOG.md |
| 新 CTO 上手指南 | 5 分钟快速了解项目 | docs/ONBOARDING.md |
| 运维操作手册 | 紧急情况操作步骤 | docs/RUNBOOK.md |
| 本地开发指南 | 从零搭建开发环境 | docs/LOCAL-DEV-GUIDE.md |
| 文档索引（本文件） | 所有文档目录 | docs/INDEX.md |

---

## 架构决策记录 (ADR)

| 编号 | 决策 | 日期 | 路径 |
|------|------|------|------|
| 000 | ADR 模板 | — | docs/ADR/000-template.md |
| 001 | 技术栈选型 | 2025 | docs/ADR/001-tech-stack.md |
| 002 | 分支策略 | 2026-03 | docs/ADR/002-branch-strategy.md |
| 003 | CI/CD 架构设计 | 2026-03-13 | docs/ADR/003-ci-cd-design.md |
| 004 | AI 工作流设计 | 2026-03-13 | docs/ADR/004-ai-workflow.md |
| 005 | 部署架构 | 2025 | docs/ADR/005-deployment-arch.md |
| 006 | ESLint 规则放宽 | 2026-03-13 | docs/ADR/006-eslint-relaxation.md |
| 007 | Lockfile 同步策略 | 2026-03-13 | docs/ADR/007-lockfile-strategy.md |
| 008 | Husky + commitlint | 2026-03-13 | docs/ADR/008-husky-commitlint.md |

---

## 事故复盘

| 编号 | 事故 | 日期 | 路径 |
|------|------|------|------|
| 000 | Postmortem 模板 | — | docs/POSTMORTEM/000-template.md |
| 001 | Manus 误改环境变量 | 2026-03 | docs/POSTMORTEM/001-manus-env-incident.md |

---

## 调研文档

| 文件 | 日期 | 路径 |
|------|------|------|
| 工程实践对比（Microsoft/Google/AWS） | 2026-03-13 | docs/research/2026-03-13-engineering-practices-benchmark.md |
| 调研文档模板 | — | docs/research/TEMPLATE.md |

---

## 需求/设计文档

（待需求提出后归档）

---

## 沟通记录

（待沟通后归档）

---

## 索引维护规范

每次新增文档时，必须同步更新本文件：

1. 确定文档类型（体系文档 / ADR / 事故复盘 / 调研 / 需求设计 / 沟通记录）
2. 在对应表格末尾添加一行
3. 填写：文件名、用途描述、相对路径
4. 更新文件顶部的「最后更新」日期
5. 将 `INDEX.md` 的修改包含在同一个 PR 中提交
