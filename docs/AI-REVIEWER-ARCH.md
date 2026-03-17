# AI Reviewer 3 架构审查配置

> 状态: stub | 最后更新: 2026-03-17

## 概述

AI Code Review 工作流的第三审查器，专注于架构一致性检查。

## 审查维度

- Medusa v2 模式规范
- 目录结构与命名约定
- 模块依赖方向
- API 设计一致性
- 配置管理合理性

## 配置

- 工作流: `.github/workflows/ai-review.yml`
- API: Perplexity Sonar
- Secret: `PERPLEXITY_API_KEY`
