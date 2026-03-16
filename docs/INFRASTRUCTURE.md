# INFRASTRUCTURE

> 项目名称: NordHjem  
> 创建日期: 2026-03-16  
> 状态: Active  
> 负责人: CTO (AI)

# INFRASTRUCTURE

## 基础设施拓扑

NordHjem 当前生产链路如下：

## 用户 → Vercel/CDN（前端）→ Railway（后端 API + Worker）→ PostgreSQL（Railway）→ Redis（Railway）

外部依赖：

- **Stripe API**：支付与回调。
- **GitHub Actions**：CI/CD 自动化。
- **Upptime**：可用性探测与公开状态页（如启用）。

## 资源配置

| 服务名称 | 提供商 | 规格 | 区域 | 成本 |
| --- | --- | --- | --- | --- |
| Store 前端（Next.js） | Vercel | Hobby/Pro（按流量） | 贴近主要用户区域 | 按套餐/流量计费 |
| 后端 API + Worker | Railway Pro | 1 vCPU, 1GB RAM | EU 优先（接近目标市场） | Pro 套餐 + 用量 |
| PostgreSQL | Railway | 1GB 存储（可扩展） | 同后端区域 | 按实例规格 |
| Redis | Railway | 256MB | 同后端区域 | 按实例规格 |

## 网络与安全

- 全站 **HTTPS** 强制。
- 配置 **CORS 白名单**（仅 NordHjem Store/Admin 域名）。
- API 层启用 **Rate Limiting**（防刷、防爆破）。
- Stripe Webhook 接入使用 **IP 白名单 + 签名验证**。
- 所有密钥采用 Railway/GitHub Secrets **加密存储**，禁止硬编码。

## 运维职责

- **CTO**：全权负责基础设施维护（部署、扩缩容、故障处理、成本优化）。
- **Owner**：仅负责 production 部署审批与关键变更确认。
