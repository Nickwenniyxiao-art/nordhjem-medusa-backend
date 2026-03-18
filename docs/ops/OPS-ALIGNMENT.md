# Ops 工作流与 Runbook 对齐矩阵

## 对齐矩阵

| Runbook 场景 | 对应工作流 | 自动化程度 | 状态 |
|-------------|-----------|-----------|------|
| Health Check 失败 | cd-staging.yml / cd-production.yml | 部署后自动检查 | ✅ |
| 数据库连接失败 | nightly.yml | Nightly 构建检测 | ✅ |
| Redis 连接失败 | smoke-test-*.yml | 冒烟测试检测 | ✅ |
| 部署后报错 | deployment-log.yml | 自动记录部署状态 | ✅ |
| 密钥泄露 | gitleaks.yml | 自动扫描每个 PR | ✅ |
| 后端回滚 | 手动操作 | 参考 RUNBOOK.md | ⚠️ 手动 |

## 改进计划
- [ ] 添加自动回滚机制（当冒烟测试失败时）
- [ ] 添加数据库健康检查工作流
