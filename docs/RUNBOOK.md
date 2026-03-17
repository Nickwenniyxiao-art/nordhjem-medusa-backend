# NordHjem 运维应急手册 (Runbook)

> 写给"半夜被叫醒的人" — 每个步骤都要能照着做
> 最后更新：2026-03-17

---

## 紧急联系方式

| 角色 | 联系方式 | 负责什么 |
|------|----------|----------|
| Owner (Nick) | GitHub @Nickwenniyxiao-art | 最终决策、生产审批 |
| CTO (AI) | AI 会话 | 技术诊断、方案制定 |

---

## 场景 1：后端 Health Check 失败

### 症状
- 监控告警：`/health` 返回非 200
- 用户反馈：页面加载超时、API 无响应
- CI 告警 Issue 自动创建

### 诊断步骤
1. SSH 到服务器，检查容器状态：
   ```bash
   docker ps -a --filter "name=nordhjem_medusa"
   ```
2. 检查 Health endpoint：
   ```bash
   # 生产 (9000)
   curl -sf http://localhost:9000/health
   # 预发布 (9002)
   curl -sf http://localhost:9002/health
   # 测试 (9001)
   curl -sf http://localhost:9001/health
   ```
3. 看容器日志（最近 100 行）：
   ```bash
   docker logs nordhjem_medusa --tail 100
   ```
4. 检查内存和磁盘：
   ```bash
   free -h
   df -h /
   ```

### 修复步骤
- **如果容器已停止**：
  ```bash
  docker start nordhjem_medusa
  # 等 30 秒后重新检查 health
  sleep 30 && curl -sf http://localhost:9000/health
  ```
- **如果容器在运行但 health 失败**：
  ```bash
  docker restart nordhjem_medusa
  sleep 30 && curl -sf http://localhost:9000/health
  ```
- **如果重启无效** → 执行回滚（见场景 6）

### 升级路径
如果 5 分钟内无法恢复 → 立即通知 Owner → 执行回滚

---

## 场景 2：数据库连接失败

### 症状
- 后端日志出现 `ECONNREFUSED` 或 `connection refused` 指向 PostgreSQL
- API 返回 500 错误

### 诊断步骤
1. 检查 PostgreSQL 容器：
   ```bash
   docker ps -a --filter "name=postgres"
   docker logs nordhjem_postgres --tail 50
   ```
2. 检查连接数：
   ```bash
   docker exec nordhjem_postgres psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"
   ```
3. 检查磁盘空间（数据库常因磁盘满而崩溃）：
   ```bash
   df -h /
   docker exec nordhjem_postgres du -sh /var/lib/postgresql/data/
   ```
4. 检查 Docker 网络：
   ```bash
   docker network inspect nordhjem_backend
   ```

### 修复步骤
- **如果 PostgreSQL 容器已停止**：
  ```bash
  docker start nordhjem_postgres
  sleep 10
  docker exec nordhjem_postgres pg_isready
  # 然后重启后端容器
  docker restart nordhjem_medusa
  ```
- **如果磁盘满了**：
  ```bash
  # 清理旧备份
  ls -la /opt/nordhjem/backups/production/
  # 删除最旧的备份（保留最近 3 个）
  cd /opt/nordhjem/backups/production && ls -t *.dump | tail -n +4 | xargs rm -f
  # 清理 Docker
  docker system prune -f
  ```
- **如果连接数过高**：
  ```bash
  docker exec nordhjem_postgres psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle' AND query_start < now() - interval '10 minutes';"
  ```

### 升级路径
如果数据库无法启动且数据可能损坏 → 立即通知 Owner → 从最近的备份恢复

---

## 场景 3：Redis 连接失败

### 症状
- 后端日志出现 Redis 连接错误
- 会话功能异常、缓存失效

### 诊断步骤
1. 使用 GitHub Actions 一键诊断：
   → 打开 `ops-redis-fix.yml` → 选择 `diagnose-only` → 运行
2. 或者手动 SSH：
   ```bash
   docker ps -a --filter "name=redis"
   docker logs nordhjem_redis --tail 50
   free -h  # Redis 是内存数据库，检查内存
   ```

### 修复步骤
- **一键修复**：
  → 打开 `ops-redis-fix.yml` → 选择 `diagnose-and-fix` → 运行
- **手动修复**：
  ```bash
  docker restart nordhjem_redis
  sleep 5
  docker exec nordhjem_redis redis-cli ping
  # 应返回 PONG
  ```
- **如果内存不足**：
  ```bash
  docker exec nordhjem_redis redis-cli CONFIG SET maxmemory-policy allkeys-lru
  ```

### 升级路径
Redis 数据可以丢失（缓存和会话会重建），最坏情况重建容器即可

---

## 场景 4：部署后用户报错

### 症状
- 部署刚完成，用户报告页面异常
- 新功能不工作或旧功能出错

### 诊断步骤
1. 检查是哪个环境的问题（staging 还是 production）
2. 查看最近的部署记录：
   ```bash
   # 查看最近的 PR
   gh pr list --repo Nickwenniyxiao-art/nordhjem-medusa-backend --state merged --limit 5
   ```
3. 查看后端日志：
   ```bash
   docker logs nordhjem_medusa --tail 200 --since 30m
   ```
4. 检查前端控制台错误（如果是前端问题）：
   ```bash
   pm2 logs storefront --lines 100
   ```

### 修复步骤
- **如果是后端问题 → 回滚**（见场景 6）
- **如果是前端问题**：
  ```bash
  cd /opt/nordhjem/storefront
  git log --oneline -5  # 确认当前版本
  git reset --hard HEAD~1  # 回退一个版本
  yarn build && pm2 restart storefront
  ```
- **如果是配置问题**（环境变量等）：
  ```bash
  docker inspect nordhjem_medusa --format '{{range .Config.Env}}{{println .}}{{end}}' | grep -v PASSWORD
  ```

### 升级路径
如果回滚后问题仍存在 → 可能是数据库迁移问题 → 通知 Owner + CTO 协同排查

---

## 场景 5：密钥泄露

### 症状
- Gitleaks 扫描发现密钥泄露
- 收到 GitHub Secret Scanning 告警
- 安全扫描 Issue 被自动创建

### 应急步骤（按顺序执行，不要跳步）
1. **立即轮换泄露的密钥**：
   - 如果是 GitHub PAT → GitHub Settings → Developer settings → 删除旧 PAT → 创建新 PAT
   - 如果是数据库密码 → 修改 PostgreSQL 密码 + 更新所有容器环境变量
   - 如果是 SSH Key → 生成新密钥对 → 更新服务器 authorized_keys
2. **更新仓库 Secrets**：
   仓库 Settings → Secrets and variables → Actions → 更新对应的 Secret
3. **检查 Gitleaks 报告**：
   查看泄露的范围（哪些 commit、哪些文件）
4. **检查是否被滥用**：
   - GitHub Audit Log → 检查异常 API 调用
   - 服务器 → 检查异常登录（`last -20`、`journalctl -u sshd --since "1 hour ago"`）
5. **创建事后分析 Issue**（必须）

### 升级路径
立即通知 Owner，密钥泄露是 SEV1 级别事件

---

## 场景 6：后端回滚

### 操作步骤
1. **使用 GitHub Actions 一键回滚**：
   → 打开 `ops-emergency-fix.yml` → 选择 `rollback-test` → 运行
   （这会将 test 环境回滚到 staging 同版本镜像）

2. **手动回滚 production**：
   ```bash
   # 查看当前运行的镜像
   docker inspect nordhjem_medusa --format '{{.Config.Image}}'

   # 查看可用的历史镜像
   docker images | grep nordhjem

   # 用上一个版本的镜像重建容器
   PREV_IMAGE="<上一个版本的镜像ID>"
   docker stop nordhjem_medusa
   docker rm nordhjem_medusa
   docker create --name nordhjem_medusa \
     --publish 9000:9000 \
     --restart unless-stopped \
     --env-file /opt/nordhjem/production.env \
     --network nordhjem_backend \
     $PREV_IMAGE
   docker start nordhjem_medusa

   # 验证
   sleep 30 && curl -sf http://localhost:9000/health
   ```

### 注意
- 回滚后必须通知 Owner
- 回滚后创建 Issue 记录原因和影响
- 修复后重新走 CI/CD 流程部署

---

## 快速参考卡片

| 问题 | 第一件事 | 工具 |
|------|----------|------|
| Health Check 失败 | `docker logs nordhjem_medusa --tail 100` | SSH |
| 数据库挂了 | `docker ps -a \| grep postgres` | SSH |
| Redis 挂了 | 运行 `ops-redis-fix.yml` | GitHub Actions |
| 部署后出错 | 回滚（场景 6） | GitHub Actions / SSH |
| 密钥泄露 | 立即轮换密钥 | GitHub Settings |
| 磁盘满了 | `df -h / && docker system prune -f` | SSH |

---

## 服务端口速查

| 服务 | 端口 | 环境 |
|------|------|------|
| 后端 Production | 9000 | nordhjem_medusa |
| 后端 Test | 9001 | nordhjem_medusa_test |
| 后端 Staging | 9002 | nordhjem_medusa_staging |
| 前端 Production | 8000 | PM2: storefront |
| PostgreSQL | 5432 | nordhjem_postgres |
| Redis | 6379 | nordhjem_redis |
