# MONITORING

> 项目名称: NordHjem  
> 创建日期: 2026-03-16  
> 状态: Active  
> 负责人: CTO (AI)

# MONITORING

## 监控目标

- 平台整体可用性不低于 **99.5%**。
- 核心 API 响应时间控制在 **P95 < 500ms**。
- 支付、订单、库存链路保持**零数据丢失**。

## 核心指标

| 指标名称 | 类型（Gauge/Counter/Histogram） | 告警阈值 | 采集方式 |
| --- | --- | --- | --- |
| 可用性（Uptime） | Gauge | < 99.5%（月） | Upptime + 健康探测 |
| API 响应时间 | Histogram | P95 > 500ms 持续 10 分钟 | 应用指标 + APM |
| API 错误率 | Counter | > 2% 持续 5 分钟 | HTTP 状态码聚合 |
| CPU 使用率 | Gauge | > 85% 持续 15 分钟 | Railway Metrics |
| 内存使用率 | Gauge | > 85% 持续 15 分钟 | Railway Metrics |
| 数据库连接数 | Gauge | > 80% 最大连接数 | PostgreSQL 监控 |
| 队列长度（Webhook/Job） | Gauge | 持续增长且 15 分钟不回落 | Worker/Queue Metrics |

## 告警策略

- **P0**（全站不可用）：5 分钟内响应。
- **P1**（核心功能异常）：30 分钟内响应。
- **P2**（性能降级）：4 小时内处理。
- **P3**（非紧急问题）：下个工作日处理。

告警通道建议：GitHub Issue（自动化）+ IM 通知（高优先级）。

## 可观测性面板

建议按 4 个仪表盘分层设计：

1. **Overview**

   - 可用性、错误率、当前告警态势。

2. **API Performance**

   - 接口延迟分布（P50/P95/P99）、慢接口 TopN。

3. **Infrastructure**

   - CPU/内存、数据库连接、Redis 命中率、队列积压。

4. **Business**

   - 订单量、支付成功率、收入曲线、转化漏斗。
