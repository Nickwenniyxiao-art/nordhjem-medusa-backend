> 项目名称: NordHjem  
> 创建日期: 2026-03-16  
> 状态: Active  
> 负责人: CTO (AI)

# INTEGRATION-SPEC

## 集成范围
NordHjem 当前核心集成包括：
- Stripe 支付
- Railway 部署
- GitHub Actions CI/CD
- Upptime 可用性监控
- Docker Registry 镜像分发

## 外部系统说明
| 系统名称 | 用途 | 协议 | 认证方式 | SLA |
| --- | --- | --- | --- | --- |
| Stripe | 支付处理、退款、Webhook 回调 | HTTPS REST API | API Key + Webhook Secret | 99.9% |
| Railway | 应用部署与环境变量托管 | HTTPS API / CLI | Token/OAuth | 99.9% |
| GitHub (Actions) | CI/CD、代码托管、自动化检查 | REST + GraphQL API | PAT / GitHub App Token | 99.9% |
| Upptime | 可用性探测、状态页 | HTTPS | GitHub Token（写入仓库） | 99.5% |
| Docker Registry | 容器镜像存储与分发 | HTTPS OCI API | Username/Password 或 Access Token | 99.9% |

## 协议与数据格式
- 对外通信统一要求 HTTPS。
- 业务数据交换统一使用 JSON。
- Stripe Webhook 必须执行签名验证（`Stripe-Signature` + `STRIPE_WEBHOOK_SECRET`）。
- GitHub Actions 按 Event Payload 驱动（push/pull_request/workflow_dispatch）。

## 错误处理与重试
- Stripe API 调用：指数退避重试（最多 3 次），并记录 request id 便于排障。
- Webhook 处理：必须幂等（event id 去重），避免重复入账或重复状态迁移。
- CI 任务：对 flaky 测试允许自动重跑；若重复失败则阻断合并并生成报告。
