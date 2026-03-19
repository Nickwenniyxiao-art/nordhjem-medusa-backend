# CI/CD 工作流健康度标准

> 项目名称: NordHjem Medusa Backend
> 创建日期: 2026-03-16
> 状态: Active
> 负责人: CTO
> 关联文档: ENGINEERING-PLAYBOOK.md 第14章

---

## 概述

本文档定义所有 GitHub Actions 工作流的分级、预期状态和监控标准。与 ENGINEERING-PLAYBOOK.md 第 14 章的 CI/CD 健康度管理制度配合使用。

## 工作流分级标准

| 级别 | 定义 | 失败影响 | SLA |
|------|------|---------|-----|
| **Critical** | CI/CD 核心流程 | 阻塞合并或部署 | 24h |
| **Standard** | 质量与安全检查 | 需记录但不阻塞 | 72h |
| **Advisory** | 建议性辅助检查 | 仅通知 | 下个Sprint |

## 后端工作流清单

### Critical（必须绿）

| 工作流文件 | 名称 | 触发条件 | 预期状态 | 当前状态 |
|-----------|------|---------|---------|---------|
| ci.yml | CI | push/PR | ✅ 必须绿 | 🟢 |
| cd-test.yml | CD — Test | push develop | ✅ 必须绿 | 🟡 待验证 |
| cd-staging.yml | CD — Staging | push staging | ✅ 必须绿 | ✅ ACTIVE |
| cd-production.yml | CD — Production | push main | ✅ 必须绿 | 🟡 Waiting(审批；Admin Panel 404 accepted (Medusa v2 expected)) |
| docker-build.yml | Docker Build | push/PR | ✅ 必须绿 | 🟢 |
| release.yml | Release | push main | ✅ 必须绿 | ✅ ACTIVE |
| db-backup.yml | Database Backup | cron daily 02:00 | ✅ 必须绿 | ✅ ACTIVE |
| smoke-test.yml | Smoke Test | called by CD | ✅ 必须绿 | 🟡 依赖CD |

### Standard（应该绿）

| 工作流文件 | 名称 | 触发条件 | 预期状态 | 当前状态 |
|-----------|------|---------|---------|---------|
| gitleaks.yml | Gitleaks | push/PR | ✅ 应该绿 | 🟢 |
| trivy.yml | Trivy | push/PR | ✅ 应该绿 | 🟢 |
| semgrep.yml | Semgrep | push/PR | ✅ 应该绿 | 🟢 |
| doc-format-check.yml | Doc Format Check | PR docs/** | ✅ 应该绿 | 🔴 调查中(S3-1a) |
| doc-registry-check.yml | Doc Registry Check | PR docs/** | ✅ 应该绿 | 🔴 调查中(S3-1a) |
| doc-gate-check.yml | Doc Gate Check | PR src/** + docs/** + DOC-REGISTRY.json | ✅ 应该绿 | 🟡 待触发验证(V3-6) |
| doc-completeness-audit.yml | Doc Completeness | cron weekly | ✅ 应该绿 | 🟢 |
| dora-metrics.yml | DORA Metrics | cron weekly Mon | ✅ 应该绿 | 🟢 |
| dependency-audit.yml | Dependency Audit | PR/schedule | ✅ 应该绿 | 🟡 待验证 |
| check-execution-protocol.yml | EGP Check | PR develop | ✅ 应该绿 | 🟢 |

### Advisory（绿则好，红可延后）

| 工作流文件 | 名称 | 触发条件 | 预期状态 | 当前状态 |
|-----------|------|---------|---------|---------|
| commitlint.yml | Commitlint | PR | ℹ️ 建议绿 | 🟢 |
| pr-title.yml | PR Title | PR | ℹ️ 建议绿 | 🟢 |
| branch-naming.yml | Branch Naming | PR | ℹ️ 建议绿 | 🟢 |
| stale-bot.yml | Stale Bot | cron | ℹ️ 建议绿 | 🟢 |
| codex-autofix.yml | Codex Auto-Fix | workflow_dispatch | ⏸️ 已禁用(S1-0) | ⏸️ 禁用 |
| check-issue-labels.yml | Issue Labels | issues | ℹ️ 建议绿 | 🟢 |
| check-issue-quality.yml | Issue Quality | issues | ℹ️ 建议绿 | 🟢 |
| check-linked-issue.yml | Linked Issue | PR | ℹ️ 建议绿 | 🟢 |
| check-pr-metadata.yml | PR Metadata | PR | ℹ️ 建议绿 | 🟢 |
| check-project-board.yml | Project Board | issues/PR | ℹ️ 建议绿 | 🟢 |
| check-roadmap-ref.yml | Roadmap Ref | PR | ℹ️ 建议绿 | 🟢 |
| find-duplicate-issue.yml | Duplicate Issue | issues | ℹ️ 建议绿 | 🟢 |
| issues-daily-check.yml | Issues Daily | cron daily | ℹ️ 建议绿 | 🟢 |
| ai-review.yml | AI Review | PR | ℹ️ 建议绿 | 🟢 |
| pr-compliance-fix.yml | PR Compliance | PR | ℹ️ 建议绿 | 🟢 |
| bug-archive.yml | Bug Archive | issues closed | ℹ️ 建议绿 | 🟢 |
| roadmap-audit.yml | Roadmap Audit | PR | ℹ️ 建议绿 | 🟢 |
| nightly.yml | Nightly | cron daily | ℹ️ 建议绿 | 🟢 |

## 健康度指标

| 指标 | 计算方式 | 目标 | 当前 |
|------|---------|------|------|
| Critical 绿率 | Critical 工作流中最近一次成功的比例 | ≥ 90% | 修复中 |
| Standard 绿率 | Standard 工作流中最近一次成功的比例 | ≥ 80% | 修复中 |
| 平均红叉持续时间 | Critical 工作流从失败到修复的平均时间 | < 24h | — |

## 更新记录

| 日期 | 变更 | 操作人 |
|------|------|--------|
| 2026-03-16 | 初始版本，基于 S3-2 任务创建 | CTO |
