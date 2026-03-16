# DORA Metrics Dashboard

> 最后更新: 2026-03-16

## 概述

本文档追踪 NordHjem 项目的四大 DORA 工程效能指标。

## 指标定义

### 1. 部署频率 (Deployment Frequency)
- **定义**: 代码成功部署到生产环境的频率
- **当前值**: 待采集
- **数据源**: `release.yml` 工作流成功运行次数
- **目标**: 每周 ≥ 1 次

### 2. 变更前置时间 (Lead Time for Changes)
- **定义**: 从代码提交到生产部署的时间
- **当前值**: 待采集
- **数据源**: PR 创建到 merge 时间 + CD pipeline 运行时间
- **目标**: < 24 小时

### 3. 变更失败率 (Change Failure Rate)
- **定义**: 导致生产故障的变更占总变更的比例
- **当前值**: 待采集
- **数据源**: 标记为 `bug` 且关联 production 的 Issue 数 / 总 Release 数
- **目标**: < 15%

### 4. 故障恢复时间 (Mean Time to Recovery)
- **定义**: 生产故障从发现到恢复的平均时间
- **当前值**: 待采集
- **数据源**: `bug` Issue 的创建到关闭时间差
- **目标**: < 4 小时

## 数据采集方法

可通过以下命令/API 采集原始数据：

| 指标 | 采集方式 |
|------|---------|
| 部署频率 | `gh run list --workflow=release.yml --status=success` |
| 前置时间 | `gh pr list --state=merged --json mergedAt,createdAt` |
| 失败率 | `gh issue list --label=bug` vs `gh release list` |
| 恢复时间 | `gh issue list --label=bug --state=closed --json createdAt,closedAt` |

## Sprint 指标历史

| Sprint | 部署频率 | 前置时间 | 失败率 | 恢复时间 |
|--------|---------|---------|--------|---------|
| Sprint #1 (03-03 ~ 03-09) | - | - | - | - |
| Sprint #2 (03-10 ~ 03-16) | 待采集 | 待采集 | 待采集 | 待采集 |
