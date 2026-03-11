# NordHjem 故障与回滚手册

> 适用范围：NordHjem 前端 (Storefront) + 后端 (Medusa) 生产环境
> 遵循 ENG-GOV-001 §3.4 回滚策略 + §9 文档管理

---

## 1. 紧急联系

| 角色 | 联系方式 | 职责 |
|------|----------|------|
| CTO (AI) | Enterprise Max 会话 | 技术决策、回滚审批 |
| Nick (人类) | 项目负责人 | 最终审批、信号中继 |
| Manus (部署) | Manus 会话 | 执行部署/回滚操作 |
| QA2 (后端) | QA2 会话 | 后端代码修复 |
| QA3 (前端) | QA3 会话 | 前端代码修复 |

---

## 2. 前端故障处理

### 2.1 页面无法访问 (HTTP 502/503)

**诊断：**
```bash
# 检查 PM2 进程
pm2 list
pm2 logs storefront --lines 50

# 检查端口
curl -I http://127.0.0.1:8000

# 检查 Nginx
docker logs nordhjem_nginx --tail 20
```

**修复：**
```bash
# 方法 1：重启 PM2
pm2 restart storefront

# 方法 2：回滚到上一个版本
cd /opt/nordhjem/storefront
git log --oneline -5          # 找到上一个稳定 commit
./deploy_frontend.sh <commit_hash>
```

### 2.2 页面白屏 / JS 错误

**诊断：**
```bash
# 检查构建是否成功
cd /opt/nordhjem/storefront
yarn build 2>&1 | tail -20

# 检查 .env 配置
cat .env
```

**修复：**
```bash
# 重新构建并重启
./deploy_frontend.sh
```

### 2.3 i18n 翻译缺失

**诊断：** 检查 `messages/` 目录下对应语言文件是否有缺失的 key。

**修复：** 通过 PR 补充翻译 key，合并后执行 `./deploy_frontend.sh`。

---

## 3. 后端故障处理

### 3.1 API 无法访问 (HTTP 502/503)

**诊断：**
```bash
# 检查容器状态
docker ps | grep nordhjem_medusa
docker logs nordhjem_medusa --tail 50

# 健康检查
curl http://127.0.0.1:9000/health
```

**修复：**
```bash
# 方法 1：重启容器
cd /opt/nordhjem
docker compose restart medusa

# 方法 2：回滚
cd /opt/nordhjem/medusa
git log --oneline -5
./deploy_backend.sh <commit_hash>
```

### 3.2 数据库连接失败

**诊断：**
```bash
# 检查 PostgreSQL 容器
docker ps | grep nordhjem_postgres
docker logs nordhjem_postgres --tail 20

# 测试连接
docker exec nordhjem_postgres pg_isready -U nordhjem -d nordhjem_db
```

**修复：**
```bash
# 重启 PostgreSQL
docker compose restart postgres
# 等待健康检查通过后重启 Medusa
docker compose restart medusa
```

### 3.3 Redis 连接失败

**诊断：**
```bash
docker ps | grep nordhjem_redis
docker exec nordhjem_redis redis-cli -a <password> ping
```

**修复：**
```bash
docker compose restart redis
docker compose restart medusa
```

### 3.4 数据库迁移失败

**诊断：**
```bash
docker compose run --rm medusa npx medusa db:migrate 2>&1
```

**修复：**
- 如果迁移脚本有 bug：回滚代码到迁移前版本，手动修复数据库
- 联系 CTO 评估是否需要编写回退 SQL

---

## 4. 通用回滚流程

### 4.1 前端回滚

```bash
# 1. 查看最近部署历史
cd /opt/nordhjem/storefront
git log --oneline -10

# 2. 使用部署脚本回滚到指定版本
./deploy_frontend.sh <stable_commit_hash>

# 3. 验证
curl -I http://127.0.0.1:8000
```

### 4.2 后端回滚

```bash
# 1. 查看最近部署历史
cd /opt/nordhjem/medusa
git log --oneline -10

# 2. 使用部署脚本回滚
cd /opt/nordhjem
./deploy_backend.sh <stable_commit_hash>

# 3. 验证
curl http://127.0.0.1:9000/health
```

### 4.3 数据库回滚

```bash
# 从备份恢复（备份在 /opt/nordhjem/backups/）
ls -la /opt/nordhjem/backups/
gunzip < /opt/nordhjem/backups/nordhjem_db_YYYYMMDD_HHMMSS.sql.gz | \
  docker exec -i nordhjem_postgres psql -U nordhjem -d nordhjem_db
```

---

## 5. 部署日志

所有部署操作的日志记录在：
- 前端：`/var/log/nordhjem/deploy_frontend.log`
- 后端：`/var/log/nordhjem/deploy_backend.log`
- 备份：`/var/log/nordhjem-backup.log`

---

## 6. 事故复盘模板

每次生产事故后，须填写以下模板并存入 `docs/postmortems/`：

```
## 事故复盘 — [事故标题]

- 日期：YYYY-MM-DD
- 影响时长：X 分钟
- 影响范围：[前端/后端/全站]
- 严重级别：[P0/P1/P2]

### 时间线
- HH:MM 发现问题
- HH:MM 开始诊断
- HH:MM 执行修复/回滚
- HH:MM 服务恢复

### 根因
[描述根本原因]

### 修复方案
[描述如何修复]

### 预防措施
[描述如何防止再次发生]

### 跟进项
- [ ] 任务 1
- [ ] 任务 2
```
