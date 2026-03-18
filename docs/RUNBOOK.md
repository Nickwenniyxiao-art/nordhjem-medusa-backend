# 运维应急手册

> 适用范围：NordHjem Medusa Backend（Test/Staging/Production）

## 通用应急流程

1. **先止血**：优先恢复可用性，避免影响扩大。
2. **再定位**：收集日志、监控、错误码，确认根因。
3. **后修复**：按场景执行修复步骤并复测。
4. **再升级**：按升级路径通知对应负责人并同步进展。

---

## 场景 1：后端 Health Check 失败

### 症状
- `/health` 返回非 `200`。
- 监控告警显示服务不可用。

### 诊断
1. 检查后端容器状态：
   ```bash
   docker ps -a --filter "name=nordhjem_medusa"
   ```
2. 检查容器日志：
   ```bash
   docker logs nordhjem_medusa --tail 200
   ```
3. 检查数据库连接是否正常（见场景 2）。
4. 检查 Redis 连接是否正常（见场景 3）。

### 修复
1. 重启后端容器：
   ```bash
   docker restart nordhjem_medusa
   ```
2. 检查环境变量是否正确（特别是数据库与 Redis 连接配置）。
3. 再次验证：
   ```bash
   curl -i http://localhost:9000/health
   ```

### 升级路径
- 10 分钟内无法恢复：**通知 CTO → Owner**。

---

## 场景 2：数据库连接失败

### 症状
- 日志出现 `ECONNREFUSED` 或连接超时。
- API 出现批量 `500`。

### 诊断
1. 检查 `DATABASE_URL` 是否配置正确。
2. 检查 PostgreSQL 可用性：
   ```bash
   pg_isready -d "$DATABASE_URL"
   ```
3. 若为容器化部署，检查数据库容器状态与日志：
   ```bash
   docker ps -a --filter "name=postgres"
   docker logs nordhjem_postgres --tail 200
   ```

### 修复
1. 重启数据库服务/容器。
2. 检查后端与数据库网络连通性（Docker network / 安全组 / 防火墙）。
3. 修正错误的 `DATABASE_URL` 并重启后端。

### 升级路径
- 无法恢复或疑似数据风险：**通知 DBA → Owner**。

---

## 场景 3：Redis 连接失败

### 症状
- 缓存失效、会话异常或频繁登录失效。
- 日志出现 Redis 连接错误。

### 诊断
1. Redis 连通性检测：
   ```bash
   redis-cli -h <redis-host> -p <redis-port> ping
   ```
2. 若容器部署，检查 Redis 容器状态与日志：
   ```bash
   docker ps -a --filter "name=redis"
   docker logs nordhjem_redis --tail 200
   ```
3. 检查 Redis 内存使用情况。

### 修复
1. 重启 Redis：
   ```bash
   docker restart nordhjem_redis
   ```
2. 检查并释放内存压力（必要时调整 Redis 内存策略）。
3. 重启后端并复测关键功能（登录、购物车、会话）。

### 升级路径
- 持续异常或影响范围扩大：**通知运维**。

---

## 场景 4：部署后用户报错

### 症状
- 部署后前端报 `500`。
- 新功能异常或核心流程不可用。

### 诊断
1. 在 Sentry/日志平台确认错误类型与爆发时间。
2. 核对最近一次部署版本与变更内容。
3. 快速验证是否仅影响特定接口/功能。

### 修复
1. 若为新版本引入问题，立即回滚到上一版本。
2. 验证回滚后核心路径（登录、下单、支付）恢复。
3. 记录异常版本、触发条件和影响范围。

### 升级路径
- 影响核心交易链路：**通知开发团队**（后端 + 前端 + QA）。

---

## 场景 5：密钥泄露

### 症状
- Gitleaks 告警。
- 外部安全报告或 Secret Scanning 告警。

### 诊断
1. 确认泄露密钥类型、暴露位置、暴露时间。
2. 确认是否已被使用（审计日志、调用记录）。
3. 评估影响范围（生产/测试、内部/外部）。

### 修复
1. **立即轮换密钥**（先新建再替换）。
2. **撤销旧密钥**并确认失效。
3. 更新 CI/CD 与运行环境中的密钥配置。
4. 清理仓库中的泄露内容并补充防泄露规则。

### 升级路径
- 涉及生产凭据或外部滥用风险：**安全团队 → Owner**。

---

## 场景 6：后端回滚

### 症状
- 新版本存在严重 bug，影响可用性或数据一致性。

### 诊断
1. 确认可回滚目标版本（最近稳定镜像 Tag）。
2. 确认是否涉及不可逆数据库变更。
3. 评估回滚窗口与用户影响。

### 修复
1. 使用稳定版本镜像重新打标并部署：
   ```bash
   docker pull <registry>/nordhjem-medusa-backend:<stable-tag>
   docker tag <registry>/nordhjem-medusa-backend:<stable-tag> nordhjem-medusa-backend:rollback
   # 按既有部署流程重新部署 rollback 标签
   ```
2. 重启服务并验证 `/health` 与核心接口。
3. 观察 15~30 分钟监控指标，确认错误率恢复。

### 升级路径
- 回滚执行后：**通知全团队**并发起事故复盘。
