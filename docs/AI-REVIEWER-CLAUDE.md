# AI Reviewer 2 (Claude) 配置

> 状态: stub | 最后更新: 2026-03-17

## 概述

AI Code Review 工作流的第二审查器，使用 Claude Sonnet 模型专注于安全与边界情况审查。

## 审查维度

- 安全漏洞（SQL注入、XSS、SSRF）
- 边界情况（空值、越界、竞态）
- 错误处理
- 输入验证
- 依赖安全

## 配置

- 工作流: `.github/workflows/ai-review.yml`
- 模型: claude-sonnet-4-20250514
- Secret: `ANTHROPIC_API_KEY`
