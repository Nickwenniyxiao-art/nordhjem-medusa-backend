# OPS-MONITORING — NordHjem Backend 运维监控指南

> 适用环境：Test (9001) / Staging (9002) / Production (9000)
>
> ROADMAP Ref: INFRA

## 1. 监控架构概览

当前后端运维监控采用“平台可观测 + 应用健康检查 + 人工巡检”的组合方案：

- **平台层（Railway / Docker Runtime）**
  - 服务在线状态、重启事件、部署记录、资源用量（CPU / Memory）
  - 容器生命周期事件与平台日志
- **应用层（Medusa Backend）**
  - `/health` 健康检查端点用于可用性探测
  - API 响应时间、错误率（5xx/4xx 异常升高）
  - 关键业务流程异常（订单、支付、库存同步）
- **数据层（PostgreSQL）**
  - 数据库连接数、慢查询、锁等待
  - 备份任务状态与最近成功时间
- **告警与响应层**
  - 按 P0/P1/P2 分级触发通知
  - 通知渠道：值班群 + 负责人定向通知

覆盖目标：

- **可用性**：服务故障 5 分钟内发现
- **稳定性**：异常错误率有告警阈值
- **性能**：响应时间偏离基线可识别
- **可恢复性**：备份状态可见且可验证

---

## 2. 健康检查

### 2.1 `/health` 端点说明

- 路径：`GET /health`
- 目的：用于负载均衡、外部探针、运维巡检判断服务是否存活
- 期望结果：
  - HTTP `200`：服务可响应
  - 非 200 或超时：进入故障排查流程

### 2.2 检查频率建议

- **自动探针**：每 1 分钟一次，超时阈值 5 秒
- **告警触发**：连续 3 次失败触发 P1；连续 10 分钟失败升级 P0
- **人工巡检**：每日早晚各一次手动确认（Test / Staging / Production）

### 2.3 建议检查命令

```bash
curl -fsS https://<env-domain>/health
```

---

## 3. 日志管理

### 3.1 Railway 日志查看

- 在 Railway Project 中进入对应环境服务（test/staging/production）
- 打开 **Deployments / Logs** 查看实时日志与历史部署日志
- 建议结合时间窗口（故障发生前后 15 分钟）定位异常

### 3.2 关键错误模式（重点关注）

- **数据库连接问题**：`ECONNREFUSED`、`Connection terminated unexpectedly`
- **资源耗尽**：`JavaScript heap out of memory`、进程重启频繁
- **上游依赖异常**：支付/物流 API 超时、5xx
- **Medusa 运行时异常**：`UnhandledPromiseRejection`、workflow 执行失败
- **认证与权限问题**：`401/403` 异常突增

### 3.3 日志排查建议

1. 先看“错误出现时间点附近”是否有部署/重启事件。
2. 识别是单接口问题还是全局故障（看错误分布）。
3. 对比数据库状态（连接数/慢查询）确认是否为下游瓶颈。

---

## 4. 性能监控

### 4.1 响应时间基线（建议）

- Store / Admin 常见读请求：P95 < 500ms
- 写请求（创建订单、库存更新等）：P95 < 1200ms
- `/health`：P95 < 200ms

> 说明：基线可按业务增长每月复核一次，不同环境允许有轻微差异。

### 4.2 性能异常信号

- P95 连续 10 分钟高于基线 2 倍
- API 超时率 > 2%
- 错误率（5xx）超过 1%

### 4.3 DB 查询监控重点

- 慢查询数量突增（建议阈值：> 20/min）
- 长事务与锁等待
- 活跃连接接近上限（> 80%）

必要时在 PostgreSQL 执行：

```sql
-- 活跃连接概览
SELECT state, count(*)
FROM pg_stat_activity
GROUP BY state;

-- 运行中慢查询（示例）
SELECT pid, now() - query_start AS duration, query
FROM pg_stat_activity
WHERE state <> 'idle'
ORDER BY duration DESC
LIMIT 10;
```

---

## 5. 告警规则

### 5.1 P0（严重故障）

触发条件（任一满足）：

- Production `/health` 连续 10 分钟不可用
- 核心下单链路不可用（大面积 5xx）
- 数据库不可连接或疑似数据损坏

通知渠道：

- 值班群 + 电话/紧急 IM @CTO/Owner
- 立即创建 Incident 记录并启动应急流程

### 5.2 P1（高优先级）

触发条件（任一满足）：

- `/health` 连续 3 次失败
- 5xx 错误率 > 3% 且持续 5 分钟
- API P95 超过基线 2 倍并持续 10 分钟

通知渠道：

- 值班群 + 相关模块负责人
- 要求 30 分钟内给出初步结论

### 5.3 P2（一般告警）

触发条件（任一满足）：

- 单个非核心接口异常率升高
- 慢查询持续增长但未影响可用性
- 备份任务偶发失败（可重试恢复）

通知渠道：

- 值班群消息 / 任务系统待办
- 下一个工作窗口内处理并复盘

---

## 6. 备份监控

### 6.1 检查目标

- 最近一次备份是否成功
- 备份时间是否符合策略（例如每日）
- 备份是否可恢复（至少每月一次抽检恢复）

### 6.2 建议频率

- **每日**：检查最近备份状态与时间戳
- **每周**：核对备份大小变化是否异常
- **每月**：执行一次恢复演练（到隔离环境）

### 6.3 异常处理

- 连续 2 次备份失败：升级为 P1
- 发现无法恢复：直接升级 P0 并暂停高风险变更

---

## 7. 常用运维命令

> 以下命令按本仓库常见环境给出，执行前请确认目标环境与权限。

### 7.1 服务与容器

```bash
# 本地开发启动
npm run dev

# Docker Compose 启动/停止
docker compose up -d
docker compose down

# 查看容器状态
docker ps

# 重启后端容器（示例）
docker restart nordhjem_medusa
```

### 7.2 日志查看

```bash
# 跟随容器日志
docker logs -f nordhjem_medusa

# 最近 200 行日志
docker logs --tail 200 nordhjem_medusa
```

### 7.3 数据库检查

```bash
# 进入 Postgres 容器
docker exec -it <postgres-container> psql -U <user> -d <database>

# Medusa 迁移（按需）
npx medusa db:migrate
```

### 7.4 健康检查

```bash
curl -i http://localhost:9000/health
curl -i http://localhost:9001/health
curl -i http://localhost:9002/health
```

---

## 8. 定期巡检清单

### 8.1 每日

- [ ] Production /health 可用
- [ ] 昨日错误率与响应时间无异常峰值
- [ ] 数据库连接与慢查询在安全区间
- [ ] 最近一次备份成功

### 8.2 每周

- [ ] 复核告警噪音（误报/漏报）并调整阈值
- [ ] 检查过去一周 P1/P2 事件是否完成复盘
- [ ] 核对资源用量趋势（CPU/Memory/Storage）

### 8.3 每月

- [ ] 执行备份恢复演练并记录结果
- [ ] 更新性能基线（P95/P99）
- [ ] 审核监控覆盖盲区（新接口/新模块/新依赖）
- [ ] 更新本文件与 RUNBOOK 的一致性

---

## 附录：故障升级流程（简版）

1. 发现告警 → 5 分钟内确认影响范围。
2. 判定级别（P0/P1/P2）并在值班群同步。
3. 指定主协调人（Incident Commander）与执行人。
4. 先恢复可用性，再定位根因。
5. 故障结束后 24 小时内完成 Postmortem 与行动项。
