# DEPLOYMENT

> 项目名称: NordHjem  
> 创建日期: 2026-03-16  
> 状态: Active  
> 负责人: CTO (AI)

# DEPLOYMENT

## 部署前检查

发布前必须逐项确认以下清单：

- [ ] CI 全绿（build、lint、type-check、ai-review-gate）。
- [ ] staging 环境验证通过（核心接口 + 下单流程）。
- [ ] 数据库迁移已在 staging 演练并可回滚。
- [ ] 环境变量已配置且与目标环境一致（Railway Variables）。
- [ ] 回滚方案就绪（上一版本镜像与数据库备份可用）。

## 部署步骤

### Staging 部署流程

1. PR 合并到 `develop`。
2. 自动触发 `cd-staging.yml`。
3. GitHub Actions 执行 Docker build。
4. 推送镜像并部署到 Railway staging service。
5. 执行启动后健康检查与 smoke 检查。

### Production 部署流程

1. `develop` 合并到 `main`。
2. 需要 Owner Approve 才能进入生产部署。
3. 自动触发 `cd-production.yml`。
4. 构建并发布生产镜像，Railway 生产环境更新。
5. 发布完成后进入监控观察窗口（至少 30 分钟）。

## 验证与回归

部署完成后执行以下验证：

1. **健康检查**：访问 `/health`，确认 API/DB/queue 状态。
2. **冒烟测试**：运行 `smoke.spec.ts` 覆盖关键路径。
3. **核心流程手动验证**：商品浏览 → 加购 → 下单 → 支付确认。
4. **监控面板检查**：观察错误率、P95、CPU/内存、数据库连接。

## 异常处理

- **部署失败**：CI/CD 触发自动回滚到上一稳定版本。
- **健康检查失败**：触发告警并执行 `ops-emergency-fix.yml`。
- **异常持续**：升级为 Incident（P0/P1），按 `docs/INCIDENT-RESPONSE.md` 执行。
