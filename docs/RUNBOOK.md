# NordHjem 运维操作手册（RUNBOOK）

> 本手册用于紧急情况下的快速操作。照着做，不要即兴发挥。
> 最后更新：2026-03-13

---

## 目录

1. [紧急联系和访问信息](#1-紧急联系和访问信息)
2. [服务健康检查](#2-服务健康检查)
3. [服务重启](#3-服务重启)
4. [部署回滚](#4-部署回滚)
5. [数据库备份（手动）](#5-数据库备份手动)
6. [磁盘空间清理](#6-磁盘空间清理)
7. [SSL 证书续期](#7-ssl-证书续期)
8. [Docker 镜像更新](#8-docker-镜像更新)
9. [环境端口映射参考](#9-环境端口映射参考)
10. [常见故障排查](#10-常见故障排查)

---

## 1. 紧急联系和访问信息

### 服务器访问

| 项目 | 值 |
|------|----|
| VPS IP | `66.94.127.117` |
| SSH 用户 | `root` |
| SSH 端口 | `22`（默认） |

```bash
# 登录服务器
ssh root@66.94.127.117
```

> SSH 私钥由 CTO 持有，存储在本地 `~/.ssh/` 目录及密码管理器中。
> 如需紧急访问且无私钥，联系 Owner 通过 VPS 控制面板重置访问。

### 服务部署路径

| 环境 | 路径 |
|------|------|
| Production 后端 | `/opt/nordhjem/production/` |
| Staging 后端 | `/opt/nordhjem/staging/` |
| 数据库备份 | `/opt/nordhjem/backups/production/` |
| Nginx 配置 | `/etc/nginx/sites-available/` |

### GitHub Actions Secrets（不在此记录实际值）

所有 Secret 存储在 GitHub 仓库的 Settings → Secrets and variables → Actions 中。如需查看或更新，需要仓库 Admin 权限。

---

## 2. 服务健康检查

在处理任何故障前，先执行全面健康检查，确认问题范围。

### 2.1 后端 API 健康检查

```bash
# 检查后端是否正常响应（期望返回 {"status":"ok"}）
curl -s https://api.nordhjem.store/health

# 检查响应时间（期望 < 2s）
curl -s -o /dev/null -w "响应时间: %{time_total}s\n状态码: %{http_code}\n" https://api.nordhjem.store/health
```

### 2.2 前端健康检查

```bash
# 检查前端是否正常响应（期望返回 200）
curl -s -o /dev/null -w "%{http_code}" https://nordhjem.store

# 检查完整响应头
curl -I https://nordhjem.store
```

### 2.3 PostgreSQL 健康检查

```bash
# 检查 PostgreSQL 是否就绪
docker exec nordhjem-postgres pg_isready -U postgres

# 检查数据库连接数
docker exec nordhjem-postgres psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

# 检查 Production 数据库是否存在
docker exec nordhjem-postgres psql -U postgres -l | grep medusa_production
```

### 2.4 Redis 健康检查

```bash
# 检查 Redis 是否响应
docker exec nordhjem-redis redis-cli ping
# 期望返回: PONG

# 检查 Redis 内存使用
docker exec nordhjem-redis redis-cli info memory | grep used_memory_human
```

### 2.5 Docker 容器状态总览

```bash
# 查看所有容器状态（在服务器上执行）
docker ps -a

# 查看 Production 环境容器
cd /opt/nordhjem/production && docker compose ps

# 查看容器日志（最近 100 行）
docker compose logs --tail=100 backend
docker compose logs --tail=100 postgres
docker compose logs --tail=100 redis
```

### 2.6 PM2 前端进程状态

```bash
# 查看 PM2 进程列表
pm2 list

# 查看前端日志（最近 100 行）
pm2 logs nordhjem-frontend-prod --lines 100

# 查看前端进程详情
pm2 describe nordhjem-frontend-prod
```

### 2.7 Nginx 状态

```bash
# 检查 Nginx 是否运行
sudo systemctl status nginx

# 检查 Nginx 配置是否正确
sudo nginx -t

# 查看 Nginx 访问日志（最近 50 行）
sudo tail -50 /var/log/nginx/access.log

# 查看 Nginx 错误日志（最近 50 行）
sudo tail -50 /var/log/nginx/error.log
```

---

## 3. 服务重启

> **原则**：先诊断，再重启。盲目重启可能掩盖真实问题。重启前先查看日志。

### 3.1 重启后端（Production）

```bash
# 登录服务器
ssh root@66.94.127.117

# 进入 Production 目录
cd /opt/nordhjem/production

# 查看当前状态
docker compose ps

# 重启后端服务（不重启数据库和 Redis）
docker compose restart backend

# 如果需要完全重启（包括重新拉取配置）
docker compose down && docker compose up -d

# 确认重启成功
docker compose ps
curl -s https://api.nordhjem.store/health
```

### 3.2 重启前端（Production）

```bash
# 重启前端 PM2 进程
pm2 restart nordhjem-frontend-prod

# 查看重启后状态
pm2 status

# 查看启动日志
pm2 logs nordhjem-frontend-prod --lines 50

# 确认前端正常
curl -s -o /dev/null -w "%{http_code}" https://nordhjem.store
```

### 3.3 重启 Nginx

```bash
# 先测试配置
sudo nginx -t

# 配置无误后重启
sudo systemctl restart nginx

# 或者 reload（不中断连接，推荐）
sudo systemctl reload nginx

# 确认状态
sudo systemctl status nginx
```

### 3.4 重启 PostgreSQL

```bash
# 仅在必要时重启数据库（会中断所有连接）
cd /opt/nordhjem/production
docker compose restart postgres

# 等待就绪
until docker exec nordhjem-postgres pg_isready -U postgres; do
  echo "等待 PostgreSQL 就绪..."
  sleep 2
done
echo "PostgreSQL 已就绪"
```

### 3.5 重启 Redis

```bash
cd /opt/nordhjem/production
docker compose restart redis

# 确认
docker exec nordhjem-redis redis-cli ping
```

---

## 4. 部署回滚

> **回滚前必须**：确认回滚版本号，通知 Owner，记录操作到 SPRINT-LOG.md。

### 4.1 后端回滚（通过 GitHub Actions）

1. 打开 GitHub 仓库：`Nickwenniyxiao-art/nordhjem-medusa-backend`
2. 进入 Actions → `deploy-production.yml`
3. 点击 **Run workflow**
4. 在输入框中填入要回滚的 image tag（如 `sha-abc1234`）
5. 输入确认字符串 `YES`
6. 等待 workflow 完成，验证健康检查

```bash
# 回滚后验证
curl -s https://api.nordhjem.store/health
```

### 4.2 前端回滚（PM2 deploy）

```bash
# 回滚到上一个版本
pm2 deploy production revert 1

# 回滚到指定版本（查看历史）
pm2 deploy production list
# 然后指定版本号回滚

# 验证
curl -s -o /dev/null -w "%{http_code}" https://nordhjem.store
```

### 4.3 数据库回滚

> **警告**：数据库回滚会丢失回滚时间点之后的所有数据。执行前必须再次确认。

```bash
# 第 1 步：停止后端（防止继续写入）
cd /opt/nordhjem/production
docker compose stop backend

# 第 2 步：找到目标备份
ls -lt /opt/nordhjem/backups/production/ | head -10

# 第 3 步：确认备份文件（替换 XXXXXXXX 为实际时间戳）
ls -lh /opt/nordhjem/backups/production/backup_XXXXXXXX.sql.gz

# 第 4 步：备份当前数据库（防止误操作后无法恢复）
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
docker exec nordhjem-postgres pg_dump -U postgres medusa_production | \
  gzip > /opt/nordhjem/backups/production/pre_rollback_${TIMESTAMP}.sql.gz

# 第 5 步：删除现有数据库并重建
docker exec nordhjem-postgres psql -U postgres -c "DROP DATABASE IF EXISTS medusa_production;"
docker exec nordhjem-postgres psql -U postgres -c "CREATE DATABASE medusa_production;"

# 第 6 步：恢复备份
gunzip -c /opt/nordhjem/backups/production/backup_XXXXXXXX.sql.gz | \
  docker exec -i nordhjem-postgres psql -U postgres medusa_production

# 第 7 步：重启后端
docker compose start backend

# 第 8 步：验证
curl -s https://api.nordhjem.store/health
```

---

## 5. 数据库备份（手动）

> 自动备份由 cron job 执行。手动备份用于：部署前、数据库操作前、紧急备份。

```bash
# 登录服务器
ssh root@66.94.127.117

# 执行备份
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
docker exec nordhjem-postgres pg_dump -U postgres medusa_production | \
  gzip > /opt/nordhjem/backups/production/backup_${TIMESTAMP}.sql.gz

# 确认备份已生成
ls -lh /opt/nordhjem/backups/production/backup_${TIMESTAMP}.sql.gz

# 验证备份可读（不实际恢复，只检查文件完整性）
gunzip -c /opt/nordhjem/backups/production/backup_${TIMESTAMP}.sql.gz | head -5
```

---

## 6. 磁盘空间清理

> 当磁盘使用率超过 80% 时执行。

### 6.1 检查磁盘使用情况

```bash
# 总体磁盘使用
df -h

# 找出占用最多的目录
du -sh /opt/nordhjem/* | sort -rh | head -10

# 检查 Docker 占用
docker system df
```

### 6.2 清理 Docker 无用资源

```bash
# 查看可清理的资源（dry run）
docker system df

# 清理停止的容器、未使用的镜像、未使用的网络、build cache
# 注意：--volumes 会删除未使用的 volume，确认无数据丢失后再加
docker system prune -af

# 如果需要同时清理 volume（谨慎！）
docker system prune -af --volumes
```

### 6.3 清理旧备份

```bash
# 查看当前备份文件
ls -lt /opt/nordhjem/backups/production/

# 保留最近 10 个备份，删除其余
cd /opt/nordhjem/backups/production && ls -t | tail -n +11 | xargs -r rm -f

# 确认清理结果
ls -lt /opt/nordhjem/backups/production/ | head -5
```

### 6.4 清理旧日志

```bash
# 清理 7 天前的 systemd 日志
journalctl --vacuum-time=7d

# 清理 PM2 日志
pm2 flush

# 查看 Nginx 日志大小
ls -lh /var/log/nginx/

# 如有需要，手动截断 Nginx 日志
sudo truncate -s 0 /var/log/nginx/access.log
sudo truncate -s 0 /var/log/nginx/error.log
```

---

## 7. SSL 证书续期

> NordHjem 使用 Let's Encrypt 证书（通过 Certbot 管理），每 90 天自动续期。以下为手动续期步骤。

### 7.1 检查证书状态

```bash
# 查看所有证书到期时间
sudo certbot certificates

# 检查具体域名
sudo certbot certificates --domain nordhjem.store
sudo certbot certificates --domain api.nordhjem.store
```

### 7.2 手动续期

```bash
# 测试续期（不实际执行）
sudo certbot renew --dry-run

# 执行续期
sudo certbot renew

# 续期后 reload Nginx（让新证书生效）
sudo systemctl reload nginx
```

### 7.3 验证证书

```bash
# 检查证书有效期
echo | openssl s_client -connect nordhjem.store:443 -servername nordhjem.store 2>/dev/null | \
  openssl x509 -noout -dates

echo | openssl s_client -connect api.nordhjem.store:443 -servername api.nordhjem.store 2>/dev/null | \
  openssl x509 -noout -dates
```

---

## 8. Docker 镜像更新

> 通常通过 GitHub Actions 自动完成。以下为手动更新步骤（用于紧急修复或 CI/CD 故障时）。

```bash
# 登录 GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# 拉取最新后端镜像
docker pull ghcr.io/nickwenniyxiao-art/nordhjem-medusa-backend:latest

# 查看镜像详情（确认版本）
docker inspect ghcr.io/nickwenniyxiao-art/nordhjem-medusa-backend:latest | \
  grep -A 5 '"Labels"'

# 备份数据库（更新前必做）
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
docker exec nordhjem-postgres pg_dump -U postgres medusa_production | \
  gzip > /opt/nordhjem/backups/production/pre_update_${TIMESTAMP}.sql.gz

# 重启服务（使用新镜像）
cd /opt/nordhjem/production
docker compose down
docker compose up -d

# 等待后端就绪（最多 60 秒）
for i in $(seq 1 30); do
  if curl -sf https://api.nordhjem.store/health > /dev/null; then
    echo "后端已就绪"
    break
  fi
  echo "等待后端就绪... ($i/30)"
  sleep 2
done

# 最终确认
curl -s https://api.nordhjem.store/health
docker compose ps
```

---

## 9. 环境端口映射参考

| 环境 | 前端端口 | 后端端口 | 数据库 | 说明 |
|------|---------|---------|--------|------|
| Production | 8000 | 9000 | 5432 (medusa_production) | 对外服务 |
| Staging | 8001 | 9001 | 5432 (medusa_staging) | 测试验证 |
| Test | 8002 | 9002 | 5432 (medusa_test) | CI 测试 |

> Nginx 将外部 443 端口反向代理到对应内部端口。
> 数据库均在同一 PostgreSQL 实例中，通过不同 database name 隔离。

---

## 10. 常见故障排查

### 10.1 502 Bad Gateway

**现象**：浏览器或 curl 返回 502 错误。

**排查步骤**：

```bash
# 1. 检查 Nginx 是否运行
sudo systemctl status nginx

# 2. 检查后端容器是否运行
docker ps | grep backend

# 3. 检查后端容器日志
cd /opt/nordhjem/production
docker compose logs --tail=50 backend

# 4. 检查后端是否在监听端口
curl -s http://localhost:9000/health

# 5. 如果后端未运行，重启
docker compose up -d backend
```

### 10.2 数据库连接失败

**现象**：后端日志出现 `connection refused` 或 `ECONNREFUSED 5432`。

```bash
# 1. 检查 PostgreSQL 容器状态
docker ps | grep postgres
docker exec nordhjem-postgres pg_isready -U postgres

# 2. 查看 PostgreSQL 日志
docker compose logs --tail=50 postgres

# 3. 如果容器未运行，重启
docker compose up -d postgres

# 4. 等待就绪后重启后端
until docker exec nordhjem-postgres pg_isready -U postgres; do sleep 1; done
docker compose restart backend
```

### 10.3 内存不足（OOM）

**现象**：服务器响应缓慢，容器被 OOM killer 终止。

```bash
# 1. 检查内存使用
free -h

# 2. 找出占用内存最多的进程
ps aux --sort=-%mem | head -10

# 3. 检查 Docker 容器内存使用
docker stats --no-stream

# 4. 重启占用内存大的容器
docker compose restart backend

# 5. 如果内存持续不足，考虑重启 PM2 前端
pm2 restart nordhjem-frontend-prod

# 6. 检查是否有内存泄漏，查看后端日志
docker compose logs --tail=200 backend | grep -i "memory\|heap\|leak"
```

### 10.4 前端 500 错误

**现象**：前端页面返回 500。

```bash
# 1. 查看 PM2 日志
pm2 logs nordhjem-frontend-prod --lines 100

# 2. 检查环境变量是否正确
pm2 describe nordhjem-frontend-prod | grep env

# 3. 检查后端是否可以从前端服务器访问
curl -s http://localhost:9000/health

# 4. 重启前端
pm2 restart nordhjem-frontend-prod
```

### 10.5 CI/CD 部署失败

**现象**：GitHub Actions workflow 失败，新代码未部署。

1. 打开 GitHub Actions，查看失败的 workflow 日志
2. 确认 SSH 连接是否成功（查看 `Deploy` 步骤日志）
3. 确认 Docker pull 是否成功（镜像权限问题？）
4. 手动执行 [第 8 节](#8-docker-镜像更新) 的手动更新步骤
5. 修复 CI/CD 问题后，重新触发 workflow

---

*有任何操作不在本手册范围内，先停下，联系其他工程师，不要盲目操作生产环境。*

---

## 11. 事故响应流程（P0-P3）

### 11.1 事故分级定义与响应时效（SLA）

| 等级 | 定义 | 响应时效 | 示例 |
|------|------|---------|------|
| P0 | 系统完全不可用 | 15 分钟内响应 | 生产环境宕机、数据丢失 |
| P1 | 核心功能受损 | 30 分钟内响应 | 支付功能异常、无法下单 |
| P2 | 非核心功能异常 | 4 小时内响应 | 后台报表延迟、搜索异常 |
| P3 | 轻微问题 | 24 小时内响应 | UI 显示异常、非关键文案错误 |

### 11.2 P0 事故处理流程

1. **发现与报告**：立即创建 P0 Issue（使用 incident 模板），并在标题中标记 `[P0]`。
2. **成立应急小组**：通知所有相关人员（Owner、后端、前端、运维/平台），明确 Incident Commander。
3. **初步诊断**：优先检查日志、监控告警、最近一次部署与配置变更，确认影响范围。
4. **紧急修复/回滚**：优先回滚到上一稳定版本；若无法回滚，执行最小化修复以恢复服务。
5. **验证修复**：通过健康检查与关键链路验证（登录、下单、支付）确认服务恢复。
6. **事后复盘**：72 小时内完成 Postmortem（根因、影响面、修复动作、预防措施）。

### 11.3 P1 事故处理流程

> 处理步骤与 P0 基本一致，但响应时效放宽到 **30 分钟内响应**。

1. **发现与报告**：创建 P1 Issue（incident 模板，标题标记 `[P1]`）。
2. **组建处理小组**：通知值班与相关模块负责人，指定负责人推进。
3. **初步诊断**：检查日志、监控、最近部署与功能开关状态。
4. **修复或回滚**：优先选择风险最低且恢复最快的方案。
5. **验证恢复**：验证核心功能可用，确认无新增连锁故障。
6. **复盘与改进**：在例会或专项会议中补充复盘记录与改进计划。

### 11.4 P2-P3 处理流程

- 创建 Issue 跟踪并补充复现步骤、影响范围与优先级。
- 按正常开发流程修复（评估、开发、测试、发布）。
- **P2**：要求在下一个迭代内修复并上线。
- **P3**：按业务优先级排期处理，保留 Issue 跟踪状态。

### 11.5 通用排查手册

#### PostgreSQL 连接排查步骤

```bash
# 1) 检查数据库容器是否运行
cd /opt/nordhjem/production
docker compose ps postgres

# 2) 检查 PostgreSQL 就绪状态
docker exec nordhjem-postgres pg_isready -U postgres

# 3) 查看数据库日志（最近 200 行）
docker compose logs --tail=200 postgres

# 4) 从容器内测试连接
docker exec nordhjem-postgres psql -U postgres -d medusa_production -c "SELECT now();"
```

#### Redis 连接排查步骤

```bash
# 1) 检查 Redis 容器状态
cd /opt/nordhjem/production
docker compose ps redis

# 2) 检查 Redis 是否可用
docker exec nordhjem-redis redis-cli ping

# 3) 查看 Redis 日志
docker compose logs --tail=200 redis

# 4) 检查 Redis 关键指标
docker exec nordhjem-redis redis-cli info stats | grep -E "rejected_connections|evicted_keys"
```

#### Docker 容器重启步骤

```bash
# 1) 查看容器状态
cd /opt/nordhjem/production
docker compose ps

# 2) 重启单个服务（示例：backend）
docker compose restart backend

# 3) 若需整体重启
docker compose down
docker compose up -d

# 4) 重启后检查
docker compose ps
curl -s https://api.nordhjem.store/health
```

#### 日志查看命令（Railway）

```bash
# 使用 Railway CLI 登录（首次或会话过期时）
railway login

# 进入目标项目并选择环境（production/staging/test）
railway link

# 实时查看日志
railway logs

# 查看最近日志（按需使用环境参数）
railway logs --environment production
```

#### 回滚部署操作步骤

```bash
# 1) 进入生产目录
ssh root@66.94.127.117
cd /opt/nordhjem/production

# 2) 拉取上一稳定版本镜像（按实际 tag 替换）
docker pull ghcr.io/<org>/<repo>/backend:<stable-tag>

# 3) 更新 compose 引用 tag（或恢复到上一个已知稳定配置）
# 4) 重建并启动服务
docker compose up -d backend

# 5) 验证回滚结果
curl -s https://api.nordhjem.store/health
docker compose logs --tail=100 backend
```

### 11.6 升级矩阵

- **P0 / P1**：直接通知 Owner，并同步相关负责人立即响应。
- **P2**：在日常同步中汇报进展与风险，必要时升级为 P1。
- **P3**：Issue 跟踪即可，按迭代节奏处理。
