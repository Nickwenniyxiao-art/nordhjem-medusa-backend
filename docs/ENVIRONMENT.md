> 项目名称: NordHjem  
> 创建日期: 2026-03-16  
> 状态: Active  
> 负责人: CTO (AI)

# ENVIRONMENT

## 变量总览
按模块分类如下：
- 数据库
  - `DATABASE_URL`
  - `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
- Redis
  - `REDIS_URL`
- Stripe
  - `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`
- JWT / Session
  - `JWT_SECRET`, `COOKIE_SECRET`
- Medusa
  - `MEDUSA_ADMIN_ONBOARDING_TYPE`
  - `MEDUSA_ADMIN_BACKEND_URL`
  - `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`
- 部署
  - `PORT`, `NODE_ENV`

## 必填变量
| 变量名 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| DATABASE_URL | 是 | 无 | PostgreSQL 连接串 |
| REDIS_URL | 是 | 无 | Redis 连接串 |
| STRIPE_API_KEY | 是 | 无 | Stripe 服务端密钥 |
| STRIPE_WEBHOOK_SECRET | 是 | 无 | Stripe Webhook 验签密钥 |
| JWT_SECRET | 是 | 无 | JWT 签名密钥 |
| COOKIE_SECRET | 是 | 无 | Cookie 加密密钥 |
| STORE_CORS | 是 | 无 | Store 前端域名白名单 |
| ADMIN_CORS | 是 | 无 | Admin 前端域名白名单 |
| AUTH_CORS | 是 | 无 | Auth 回调域名白名单 |
| NODE_ENV | 否 | development | 运行环境 |
| PORT | 否 | 9000 | 服务监听端口 |

## 环境差异说明
- `development`
  - 使用本地或开发数据库 URL
  - Stripe 使用 test key
  - CORS 允许 `http://localhost:*`
- `staging`
  - 使用独立 staging 数据库与 Redis
  - Stripe 仍建议 test key（完整联调）
  - CORS 指向 staging 域名
- `production`
  - 使用生产数据库与高可用 Redis
  - Stripe 使用 live key
  - CORS 仅允许正式域名

## 安全管理要求
- 敏感变量禁止提交到 Git（包括 `.env`、日志、截图）。
- 统一通过 Railway Environment Variables 管理生产配置。
- `JWT_SECRET`、`COOKIE_SECRET`、`STRIPE_API_KEY` 需定期轮换。
- 生产环境最小权限原则：按环境隔离密钥，不跨环境复用。
