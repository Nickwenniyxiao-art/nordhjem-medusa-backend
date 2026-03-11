# NordHjem Backend 架构说明

## 技术架构

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Nginx     │────▶│  Medusa.js   │────▶│ PostgreSQL   │
│  (反向代理)  │     │  (Node.js)   │     │   (主数据库)  │
└─────────────┘     └──────┬───────┘     └──────────────┘
                           │
                    ┌──────▼───────┐
                    │    Redis     │
                    │   (缓存)     │
                    └──────────────┘
```

## 服务端口

| 服务 | 端口 | 说明 |
|------|------|------|
| Medusa API | 9000 | Store API + Admin API |
| PostgreSQL | 5432 | 内部网络 |
| Redis | 6379 | 内部网络 |

## Docker 架构

所有服务通过 Docker Compose 编排，共享 `backend` 网络。

- `nordhjem_medusa`: Medusa.js 应用服务器
- `nordhjem_postgres`: PostgreSQL 15 数据库
- `nordhjem_redis`: Redis 7 缓存

## API 路由

- `GET /health` - 健康检查
- `GET /store/*` - 前台 Store API
- `GET /admin/*` - 后台 Admin API

## 部署

详见根目录 `deploy_backend.sh` 脚本。

## 环境变量

详见 `.env.example`。
