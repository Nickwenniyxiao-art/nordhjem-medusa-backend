# NordHjem Medusa Backend

[![CI](https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend/actions/workflows/ci.yml)
[![CD — Staging](https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend/actions/workflows/cd-staging.yml/badge.svg)](https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend/actions/workflows/cd-staging.yml)
[![CD — Production](https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend/actions/workflows/cd-production.yml/badge.svg)](https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend/actions/workflows/cd-production.yml)
[![Release](https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend/actions/workflows/release.yml/badge.svg)](https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend/actions/workflows/release.yml)
[![Gitleaks](https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend/actions/workflows/gitleaks.yml/badge.svg)](https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend/actions/workflows/gitleaks.yml)
[![DORA Metrics](https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend/actions/workflows/dora-metrics.yml/badge.svg)](https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend/actions/workflows/dora-metrics.yml)
[![Database Backup](https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend/actions/workflows/db-backup.yml/badge.svg)](https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend/actions/workflows/db-backup.yml)

NordHjem 电商平台后端服务，基于 [Medusa.js v2](https://medusajs.com/) 构建。

## 技术栈

| 组件 | 技术 |
|------|------|
| 框架 | Medusa.js v2 |
| 运行时 | Node.js 20 |
| 数据库 | PostgreSQL 15 |
| 缓存 | Redis 7 |
| 容器化 | Docker + Docker Compose |
| CI | GitHub Actions (Docker build + push) |
| 镜像仓库 | GitHub Container Registry (ghcr.io) |

## 目录结构

```
nordhjem-medusa-backend/
├── src/
│   ├── api/            # 自定义 API 路由
│   ├── modules/        # 业务模块
│   ├── subscribers/    # 事件订阅器
│   ├── workflows/      # 工作流
│   └── links/          # 模块关联
├── .github/workflows/  # CI 配置
├── Dockerfile          # 生产镜像定义
├── docker-compose.yml  # 本地开发环境
├── medusa-config.ts    # Medusa 配置
├── .env.example        # 环境变量模板
└── README.md
```

## 快速开始

### 前置条件

- Node.js >= 20
- Docker & Docker Compose
- PostgreSQL 15 / Redis 7（或使用 Docker Compose 提供）

### 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend.git
cd nordhjem-medusa-backend

# 2. 复制环境变量
cp .env.example .env
# 编辑 .env 填入实际值

# 3. 启动依赖服务
docker compose up -d postgres redis

# 4. 安装依赖
npm install

# 5. 执行数据库迁移
npx medusa db:migrate

# 6. 启动开发服务器
npx medusa develop
```

### Docker 部署（生产）

```bash
# 使用项目根目录的 docker-compose.yml
cd /opt/nordhjem
docker compose build medusa
docker compose up -d medusa

# 或使用部署脚本
./deploy_backend.sh [commit_hash]
```

## 环境变量

详见 `.env.example`，主要配置项：

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | PostgreSQL 连接串 |
| `REDIS_URL` | Redis 连接串 |
| `JWT_SECRET` | JWT 签名密钥 |
| `COOKIE_SECRET` | Cookie 签名密钥 |
| `STORE_CORS` | 前端跨域白名单 |
| `ADMIN_CORS` | 后台跨域白名单 |
| `STRIPE_API_KEY` | Stripe 支付密钥 |

## CI/CD

- **CI**: GitHub Actions — 每次 PR / push 到 `main` 自动构建 Docker 镜像
- **CD**: 通过 `deploy_backend.sh` 脚本执行（拉代码 → 构建镜像 → db:migrate → 重启 → 健康检查）
- **回滚**: 脚本内置回滚逻辑，健康检查失败自动回退到上一个 commit

## API 文档

- 管理后台: `http://<host>:9000/app`
- Store API: `http://<host>:9000/store/*`
- Admin API: `http://<host>:9000/admin/*`
- 健康检查: `http://<host>:9000/health`

## 相关仓库

- 前端 Storefront: [nextjs-starter-medusa](https://github.com/Nickwenniyxiao-art/nextjs-starter-medusa)
