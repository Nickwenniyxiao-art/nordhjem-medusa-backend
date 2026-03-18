# 生产就绪评审 (PRR)

> 模块: [Module Name]
> 评审日期: [YYYY-MM-DD]
> 负责 AI: [AI Agent]
> Owner 批准: [ ] 待批准

---

## 功能就绪

- [ ] 功能与 FEATURE-LIST.md 中的定义一致
- [ ] 所有验收标准（ACCEPTANCE-CRITERIA.md）已通过测试
- [ ] 变更记录完整（CHANGELOG.md 已更新）
- [ ] 相关 RFC 已获批准（如涉及架构变更）

## 数据库与迁移

- [ ] 数据库迁移脚本已编写并测试（staging 环境验证通过）
- [ ] 迁移可回滚（有对应的 down migration）
- [ ] Schema 变更已同步到 `docs/DATABASE-SCHEMA.md`
- [ ] 无破坏性变更，或已通知相关消费方
- [ ] 迁移脚本在生产等量数据下执行时间 < 10 分钟（或已规划停机窗口）

## API 可用性

- [ ] 新增 / 修改的 API 端点已记录在 `docs/API-REFERENCE.md`
- [ ] API 向后兼容（或已通过版本控制隔离）
- [ ] Medusa v2 自定义路由已经过 Supertest 集成测试
- [ ] 错误响应格式符合项目规范（统一错误码 + message）
- [ ] 关键端点有限流保护（如支付、订单接口）

## 可观测性

- [ ] Sentry 错误监控已配置，关键模块有 breadcrumb 上报
- [ ] 关键指标已定义（API P95、错误率、DB 查询耗时）
- [ ] 告警阈值已设置（参考 `docs/operations/SLO-SLA.md`）
- [ ] 部署后有冒烟测试验证（`scripts/smoke-test.sh`）

## 测试覆盖

- [ ] 单元测试通过（Jest 覆盖率 >= 30%）
- [ ] API 集成测试通过（Supertest）
- [ ] E2E 测试在 staging 环境验证通过（如适用）
- [ ] 性能测试通过（未超出 SLO 性能预算）
- [ ] 安全扫描通过（npm audit / Semgrep / Trivy）
- [ ] 测试已登记到 `docs/TEST-REGISTRY.json`

## 备份验证

- [ ] 生产数据库备份策略已验证（`docs/DB-BACKUP.md`）
- [ ] 备份恢复流程已测试（至少每季度一次）
- [ ] 本次上线前已确认最新备份可用
- [ ] pg_dump 备份已集成到 CD 流程（部署前自动备份）

## 运维准备

- [ ] Runbook 已更新（新功能的运维场景已覆盖）
- [ ] 回滚方案已记录并在 staging 测试（`docs/ROLLBACK-PLAN.md`）
- [ ] Feature Flag 已配置（如适用，允许灰度发布）
- [ ] 依赖服务（Redis、PostgreSQL、Stripe）可用性已确认
- [ ] Railway 环境变量已配置（staging 和 production 分别验证）

## 文档完整性

- [ ] 模块设计文档已更新（`docs/modules/`）
- [ ] API 文档已更新（`docs/API-REFERENCE.md`）
- [ ] CHANGELOG 已更新
- [ ] DOC-REGISTRY.json 已更新
- [ ] ADR 已记录（如有重要技术决策）

## Owner 确认

> 以上检查项全部完成后，Owner 在 GitHub 上 approve promote PR 即视为批准生产发布。
> 任何未完成项必须在发布前解决，或获得 Owner 明确豁免。

## 已知风险

[列出任何已知风险和缓解措施]

| 风险 | 严重等级 | 缓解措施 |
|------|---------|---------|
| - | - | - |
