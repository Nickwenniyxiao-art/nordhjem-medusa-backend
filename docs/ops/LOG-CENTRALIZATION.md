# 日志集中化部署模板（Loki + Grafana）

## 1. 架构概述

NordHjem 后端日志集中化采用轻量级三层架构：

```text
应用（Medusa / Node.js）
  └─(stdout / JSON logs)
      └─ Promtail
          └─ Loki
              └─ Grafana
```

- **应用层**：后端服务以结构化 JSON 日志输出到容器标准输出。
- **采集层（Promtail）**：采集 Docker 容器日志文件并打上标签（service、container、environment）。
- **存储层（Loki）**：按标签索引并持久化日志内容，支持 LogQL 查询。
- **可视化层（Grafana）**：统一检索、过滤、聚合日志，并用于告警规则配置。

## 2. 为什么选择 Loki（vs ELK）

相较 ELK（Elasticsearch + Logstash + Kibana），Loki 更适合当前阶段的 NordHjem：

1. **轻量**：Loki 主要索引 labels 而非全文，资源占用更低。
2. **Grafana 原生集成**：无需额外可视化栈，直接复用现有 Grafana 体系。
3. **低成本**：部署维护复杂度和硬件成本显著低于 ELK，适合中小规模日志场景。
4. **运维简单**：组件更少、学习曲线更平缓，便于团队快速落地。

## 3. 日志格式规范（JSON 结构化日志）

应用日志建议统一输出为 JSON，每条日志至少包含以下字段：

```json
{
  "timestamp": "2026-03-17T10:15:30.000Z",
  "level": "info",
  "service": "medusa-backend",
  "env": "staging",
  "trace_id": "2f8a1f8d5b0c4d8a",
  "request_id": "req_01HRK...",
  "message": "Order created successfully",
  "context": {
    "order_id": "order_123",
    "customer_id": "cus_456"
  }
}
```

建议：

- `level` 固定为 `debug|info|warn|error|fatal`。
- `timestamp` 使用 ISO 8601（UTC）。
- `trace_id` / `request_id` 用于跨服务链路排障。
- 避免写入敏感信息（token、密码、完整卡号、PII）。

## 4. 保留策略

建议采用分层保留策略：

- **热数据（Hot）**：7 天，存于 Loki 本地卷（快速检索，支持实时排障）。
- **冷存储（Cold）**：30 天，按天归档到对象存储（如 S3 兼容存储）。

执行建议：

1. Loki 本地 `retention_period` 设为 `168h`（7 天）。
2. 每日离线导出前一日日志到对象存储，保留 30 天。
3. 在对象存储设置生命周期规则，超过 30 天自动删除。

## 5. 告警规则示例

以下为 Grafana/Loki 常见日志告警思路：

### 5.1 Error 日志突增

- 条件：5 分钟内 `error` 级别日志 > 50 条
- 查询示例（LogQL）：

```logql
sum(count_over_time({service="medusa-backend"} |= "\"level\":\"error\"" [5m]))
```

### 5.2 支付失败率异常

- 条件：10 分钟内包含 `payment_failed` 的日志 > 20 条
- 查询示例（LogQL）：

```logql
sum(count_over_time({service="medusa-backend"} |= "payment_failed" [10m]))
```

### 5.3 关键接口高延迟（应用日志埋点）

- 条件：5 分钟窗口内 `duration_ms > 2000` 的请求 > 30 条
- 查询示例（LogQL）：

```logql
sum(count_over_time({service="medusa-backend"} |= "duration_ms" | json | duration_ms > 2000 [5m]))
```

---

配套部署文件：

- `docs/ops/docker-compose.logging.yml`
- `docs/ops/promtail-config.yml`
