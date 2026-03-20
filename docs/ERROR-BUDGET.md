# Error Budget — NordHjem 后端

> 参考：`docs/operations/SLO-SLA.md`
> 创建日期：2026-03-18
> 负责人：CTO (AI)

---

## SLO 目标

来源：`docs/operations/SLO-SLA.md`

| 服务 | 可用性 SLO | 错误率目标 | API P95 延迟 |
|------|-----------|-----------|------------|
| 后端 API | 99.9% | < 0.1% | < 500ms |
| 数据库 | 99.95% | N/A | < 50ms (query) |
| 支付服务 | 99.99% | < 0.01% | < 1000ms |

---

## Error Budget 计算方式

### 可用性 Error Budget

Error Budget = 1 - SLO 目标

| 服务 | SLO | Error Budget | 每月允许停机时间 |
|------|-----|-------------|----------------|
| 后端 API | 99.9% | 0.1% | ~43 分钟/月 |
| 数据库 | 99.95% | 0.05% | ~22 分钟/月 |
| 支付服务 | 99.99% | 0.01% | ~4 分钟/月 |

**计算公式**：

```
允许停机分钟数 = 30 天 × 24 小时 × 60 分钟 × Error Budget 百分比
后端 API: 43,200 分钟 × 0.001 = 43.2 分钟/月
```

### 错误率 Error Budget

```
API 错误率 Error Budget = 0.1% (< 1 个错误响应/1000 请求)
当 Error Rate > 1% 持续 24 小时 → 触发开发暂停规则
```

---

## Error Budget 耗尽规则

### 触发条件（满足任意一条）

1. **可用性不足**：后端 API 当月停机累计 > 43 分钟
2. **错误率超标**：API 错误率 > 1% 持续 24 小时（Sentry 监控）
3. **P95 超标**：API P95 延迟 > 1000ms 持续 2 小时（严重告警）
4. **数据库可用性**：数据库停机累计 > 22 分钟/月

### 触发后的开发暂停规则

**当 Error Budget 耗尽时（任意触发条件）：**

- 暂停所有功能性 PR 合并（仅接受 `type: reliability` 或 `type: bug` 标签的 PR）
- AI Agent 不得提交新功能代码，只处理 reliability 相关任务
- Owner 必须收到通知（Telegram 告警）
- 需完成 Postmortem（`docs/POSTMORTEM/`）后才能解除暂停
- 解除暂停需要 Owner 明确批准

**在 Error Budget 消耗 50% 时（预警）：**

- 在当月 Sprint Review 中汇报当前 Error Budget 状态
- 评估是否需要暂缓当前迭代中风险较高的功能

---

## 监控指标来源

| 指标 | 来源 | 查看方式 |
|------|------|---------|
| API 错误率 | Sentry | Sentry Issues Dashboard → Error Rate |
| API P95 延迟 | Sentry APM | Sentry Performance → P95 Latency |
| 服务可用性 | Uptime Kuma | Uptime Kuma Dashboard → Uptime % |
| 数据库可用性 | Railway Metrics | Railway Dashboard → PostgreSQL Status |
| CI/CD 失败率 | GitHub Actions | Actions Tab → Workflow Success Rate |

### 告警触发条件

参考 `docs/operations/SLO-SLA.md` 告警阈值：

| 指标 | 警告阈值 | 严重阈值 |
|------|---------|---------|
| 可用性 | < 99.95% | < 99.9% |
| API P95 | > 500ms | > 1000ms |
| 错误率 | > 0.05% | > 0.1% |
| CPU | > 70% | > 90% |
| 内存 | > 80% | > 95% |

---

## Error Budget 月度追踪

| 月份 | 后端停机(分) | 错误率峰值 | P95峰值 | Budget 消耗% | 状态 |
|------|------------|----------|--------|------------|------|
| 2026-03 | 0 | - | - | 0% | 正常 |

---

## 相关文档

- `docs/operations/SLO-SLA.md` — SLO/SLA 详细定义
- `docs/MONITORING.md` — 监控体系
- `docs/INCIDENT-RESPONSE.md` — 事件响应流程
- `docs/POSTMORTEM/` — 事故复盘记录
- `docs/RUNBOOK.md` — 运维手册
