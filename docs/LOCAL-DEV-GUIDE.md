# NordHjem 本地开发环境搭建指南

> 最后更新：2026-03-13
> 预计完成时间：30 分钟（首次搭建）

---

## 系统要求

在开始前，确认本地环境满足以下要求：

| 工具 | 版本要求 | 检查命令 | 用途 |
|------|---------|---------|------|
| Node.js | 20+ | `node --version` | 前端 + 后端运行时 |
| Docker | 最新稳定版 | `docker --version` | 后端依赖服务（PostgreSQL、Redis） |
| Docker Compose | v2+ | `docker compose version` | 容器编排 |
| Git | 2.x+ | `git --version` | 代码版本管理 |
| yarn | 1.22+ | `yarn --version` | 前端包管理器 |
| npm | 10+ | `npm --version` | 后端包管理器（随 Node.js 安装） |

> **推荐**：使用 [nvm](https://github.com/nvm-sh/nvm) 管理 Node.js 版本，避免版本冲突。

---

## 一、后端本地开发

### 1.1 克隆仓库

```bash
git clone https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend.git
cd nordhjem-medusa-backend
```

### 1.2 配置环境变量

```bash
# 复制示例配置
cp .env.example .env
```

打开 `.env`，按以下说明填写：

```dotenv
# 数据库连接（本地 Docker PostgreSQL）
DATABASE_URL=postgres://postgres:password@localhost:5432/medusa_local

# Redis 连接（本地 Docker Redis）
REDIS_URL=redis://localhost:6379

# JWT 密钥（本地开发随机生成即可）
JWT_SECRET=your_local_jwt_secret_change_me

# Cookie 密钥
COOKIE_SECRET=your_local_cookie_secret_change_me

# 后端运行端口
PORT=9000

# 前端域名（CORS 配置，允许前端访问后端）
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:9000,http://localhost:8000

# 环境标识
NODE_ENV=development
```

> **注意**：`.env` 文件已在 `.gitignore` 中，不会被提交到 Git。

### 1.3 启动依赖服务

```bash
# 启动 PostgreSQL 和 Redis 容器（后台运行）
docker-compose up -d postgres redis

# 查看容器状态
docker-compose ps
```

### 1.4 等待 PostgreSQL 就绪

```bash
# 等待 PostgreSQL 完全就绪（通常 10-20 秒）
until docker exec nordhjem-postgres pg_isready -U postgres; do
  echo "等待 PostgreSQL 就绪..."
  sleep 1
done
echo "PostgreSQL 已就绪"
```

### 1.5 安装依赖

```bash
# 使用 --legacy-peer-deps 避免 peer dependency 冲突
npm install --legacy-peer-deps
```

### 1.6 数据库迁移

```bash
# 运行所有数据库迁移
npx medusa db:migrate
```

> 迁移成功后会看到 `Migrations are up to date` 或执行迁移记录。

### 1.7 种子数据（可选）

```bash
# 填充示例数据（商品、分类等），方便本地开发和测试
npx medusa seed
```

### 1.8 启动开发服务器

```bash
npx medusa develop
```

启动成功后：

| 服务 | 地址 |
|------|------|
| 后端 API | http://localhost:9000 |
| Admin 管理面板 | http://localhost:9000/app |

**首次使用 Admin**：访问 http://localhost:9000/app，按提示创建管理员账号。

---

## 二、前端本地开发

> 前端依赖后端 API，请先完成后端启动。

### 2.1 克隆仓库

```bash
git clone https://github.com/Nickwenniyxiao-art/nextjs-starter-medusa.git
cd nextjs-starter-medusa
```

### 2.2 配置环境变量

```bash
cp .env.example .env.local
```

打开 `.env.local`，填写以下配置：

```dotenv
# 后端 API 地址（本地开发指向本地后端）
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# Publishable API Key（从 Admin 面板获取，见下方说明）
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxxxxxxxxxxxxxxxxxxxxx

# 可选：Stripe 公钥（支付功能）
# NEXT_PUBLIC_STRIPE_KEY=pk_test_xxxxxxx
```

**如何获取 Publishable Key**：

1. 登录 Admin 面板：http://localhost:9000/app
2. 进入 Settings → API keys
3. 创建新的 Publishable Key
4. 复制并填入 `.env.local`

### 2.3 安装依赖

```bash
yarn install
```

### 2.4 启动开发服务器

```bash
yarn dev
```

启动成功后，前端运行在 http://localhost:8000。

---

## 三、常见问题

### Q: `npm install` 报 peer dependency 错误

**原因**：Medusa.js 的某些依赖版本有冲突。

**解决**：

```bash
npm install --legacy-peer-deps
```

### Q: `npx medusa develop` 启动失败

**排查步骤**：

1. 检查 PostgreSQL 是否就绪：`docker exec nordhjem-postgres pg_isready -U postgres`
2. 检查 `.env` 中的 `DATABASE_URL` 是否正确
3. 检查端口 5432 是否被占用：`lsof -i :5432`
4. 查看详细错误信息：`npx medusa develop --verbose`

### Q: 前端连不上后端（CORS 错误）

**排查步骤**：

1. 确认后端已启动：`curl -s http://localhost:9000/health`
2. 检查后端 `.env` 中的 `STORE_CORS` 是否包含前端地址（`http://localhost:8000`）
3. 重启后端使配置生效：`Ctrl+C` 后重新 `npx medusa develop`

### Q: `yarn dev` 报端口占用

```bash
# 检查 8000 端口占用
lsof -i :8000

# 杀掉占用进程（替换 PID）
kill -9 <PID>

# 或者指定其他端口启动
PORT=3000 yarn dev
```

### Q: 数据库迁移失败

```bash
# 检查数据库是否可访问
docker exec nordhjem-postgres psql -U postgres -c "\l"

# 如果数据库不存在，手动创建
docker exec nordhjem-postgres psql -U postgres -c "CREATE DATABASE medusa_local;"

# 再次执行迁移
npx medusa db:migrate
```

---

## 四、Codex 开发流程

NordHjem 使用 GitHub Copilot Workspace / Codex 执行 AI 辅助开发任务。

### 4.1 任务接收方式

Codex 通过 **GitHub Issues** 接收任务。CTO 在 Issue 中起草详细指令，Codex 执行后提交 PR。

### 4.2 Issue 指令格式

CTO 起草任务时，必须包含以下结构：

```markdown
## 背景
[说明为什么需要这个改动，提供必要上下文]

## 需求
[具体、可验证的需求描述，每条一行]

## 文件范围
[列出预期修改的文件路径，帮助 Codex 定位]

## 验收标准
- [ ] [可测试的验收条件 1]
- [ ] [可测试的验收条件 2]

## 技术说明
[可选：技术实现建议、注意事项、依赖关系]
```

### 4.3 分支规范

Codex 创建的分支使用 `codex/` 前缀：

```
codex/issue-42-add-product-filter
codex/issue-55-fix-cart-calculation
```

### 4.4 验收流程

1. Codex 提交 PR 后，CI 自动运行测试
2. CTO 进行 Code Review
3. 测试通过 + Review 通过后合并到 `develop`
4. Staging 环境自动部署，手动验证
5. 确认无误后，创建 PR 合并到 `main`，触发 Production 部署

---

*搭建遇到问题？查看 [RUNBOOK.md](RUNBOOK.md) 或在 GitHub Issues 中提问。*
