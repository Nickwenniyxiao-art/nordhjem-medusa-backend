---
项目名称: NordHjem Medusa Backend
创建日期: 2026-03-16
状态: 已发布
负责人: CTO
---

## 概述

DORA（DevOps Research and Assessment）工程效能度量由 Google Cloud 的 DevOps 研究团队提出，用于衡量软件交付流程的速度与稳定性。

通过持续追踪 DORA 四项核心指标，团队可以识别交付瓶颈、评估研发改进效果，并在“交付速度”与“系统可靠性”之间保持平衡。

## 四个核心指标

### 部署频率 (Deployment Frequency)

- **含义**：单位时间内成功部署到生产（或主分支代表生产发布）的次数。
- **计算方式**：统计最近 7 天和最近 30 天内 `main` 分支新增 commit 数，近似作为部署次数；并计算 30 天日均部署频率。
- **数据来源**：GitHub API `repos.listCommits`（`sha: main`，按 `since` 过滤）。

### 变更前置时间 (Lead Time for Changes)

- **含义**：代码从创建变更（PR 创建）到可交付（PR 合并）的平均耗时。
- **计算方式**：筛选最近 30 天内已合并 PR，按 `merged_at - created_at` 计算每个 PR 耗时（小时），再取平均值。
- **数据来源**：GitHub API `pulls.list`（`state: closed`），再筛选 `merged_at` 在统计窗口内的数据。

### 变更失败率 (Change Failure Rate)

- **含义**：上线变更导致故障、回滚或热修复的比例。
- **计算方式**：最近 30 天 `type: hotfix` 标签的 Issue/PR 数量 ÷ 最近 30 天合并 PR 数量 × 100%。
- **数据来源**：GitHub API `issues.listForRepo`（`labels: type: hotfix`）+ `pulls.list` 合并结果。

### 服务恢复时间 (Time to Restore Service / MTTR)

- **含义**：服务出现故障后恢复到正常状态的平均时间。
- **计算方式**：统计最近 30 天内已关闭且带 `type: incident` 标签的 Issue，按 `closed_at - created_at` 计算每个事件恢复时长（小时），再取平均值。
- **数据来源**：GitHub API `issues.listForRepo`（`labels: type: incident`，`state: closed`）。

## 行业基准

以下为常见 DORA 分层参考（用于趋势对比，非绝对门槛）：

| 指标 | Elite | High | Medium | Low |
|---|---|---|---|---|
| 部署频率 | 按需/每天多次 | 每天到每周 | 每周到每月 | 少于每月一次 |
| 变更前置时间 | < 1 天 | 1 天到 1 周 | 1 周到 1 个月 | > 1 个月 |
| 变更失败率 | 0% - 5% | 6% - 15% | 16% - 30% | > 30% |
| 服务恢复时间（MTTR） | < 1 小时 | 1 小时到 1 天 | 1 天到 1 周 | > 1 周 |

## 本项目数据来源

`DORA Metrics` 工作流通过 `actions/github-script@v7` 调用 GitHub REST API，收集如下数据：

- `repos.listCommits`：主分支近 7/30 天提交数量（部署频率）。
- `pulls.list`：近 30 天合并 PR 的创建与合并时间（变更前置时间）。
- `issues.listForRepo` + `labels: type: hotfix`：热修复数量（变更失败率）。
- `issues.listForRepo` + `labels: type: incident`：故障恢复耗时（MTTR）。

最终结果以 Markdown 表格写入 `GITHUB_STEP_SUMMARY`，便于在 Actions 运行页直接查看。

## 使用方法

1. 进入 GitHub 仓库的 **Actions** 页面。
2. 选择 `DORA Metrics` 工作流。
3. 可通过两种方式触发：

   - 自动触发：每周一 UTC 09:00（cron `0 9 * * 1`）。
   - 手动触发：点击 **Run workflow**（`workflow_dispatch`）。

4. 打开任一运行记录，进入 `collect-metrics` job。
5. 在页面底部 **Summary** 区域查看 DORA 四项指标与等级评估结果。
