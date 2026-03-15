# Upptime 监控与状态页配置指南

本指南用于在独立仓库中部署 NordHjem 的 Upptime 监控与状态页，覆盖生产前后端与
Staging 后端健康检查。配套模板见 `docs/upptime-config/.upptimerc.yml`。

## 1. Upptime 简介

Upptime 是一个基于 GitHub Actions、Issues 和 GitHub Pages 的开源监控方案，特点：

- 无需单独监控服务器（以 GitHub Actions 作为调度执行器）。
- 每次探测都会写入仓库历史，便于审计与追踪。
- 探测失败自动创建 Incident Issue，恢复后自动关闭。
- 可自动生成状态页，展示可用性、响应时间与事件时间线。

## 2. 创建 `nordhjem-upptime` 仓库步骤

1. 在 GitHub 新建仓库：`nordhjem-upptime`（建议 Public，便于公开状态页）。
2. 使用 Upptime 官方模板初始化仓库：
   - 模板仓库：`upptime/upptime`
   - 或通过 Upptime CLI 初始化（如团队已有脚手架流程）。
3. 在仓库 Settings > Actions > General 中确保允许 Actions 运行。
4. 在 Settings > Pages 中启用 GitHub Pages（分支通常为 `gh-pages`）。
5. 将本仓库模板文件复制到 Upptime 仓库根目录 `.upptimerc.yml`。

## 3. 配置文件说明

模板路径：`docs/upptime-config/.upptimerc.yml`

关键字段：

- `owner` / `repo`：Upptime 运行仓库信息。
- `sites`：监控端点列表（当前包含）
  - Production Frontend
  - Production Backend API
  - Staging Backend API
- `status-website`：状态页配置（已使用 `theme: dark`）。
- `notifications`：通知渠道定义，配合 GitHub Secrets 使用。
- `workflowSchedule.uptime`：`*/5 * * * *`，每 5 分钟执行可用性检查。

> 建议将 URL 与通知凭据维护为组织标准变量/Secrets，避免硬编码敏感信息。

## 4. 部署状态页步骤

1. 在 Upptime 仓库中提交 `.upptimerc.yml`。
2. 推送到默认分支（通常 `main`）。
3. GitHub Actions 会自动执行以下流程：
   - 站点探测（`uptime`）
   - 汇总与图表更新（`summary` / `graphs`）
   - 状态页静态站点构建（`staticSite`）
4. 等待首次工作流完成后，访问 Pages 地址验证页面可用性。

## 5. 自定义域名配置

1. 在 `.upptimerc.yml` 的 `status-website.cname` 设置域名（示例：
   `status.nordhjem.com`）。
2. 在 DNS 提供商添加 CNAME 记录指向 `<owner>.github.io`。
3. 在 Upptime 仓库的 Pages 设置中确认 Custom domain 生效。
4. 开启 HTTPS（GitHub Pages 通常会自动申请证书）。

## 6. 通知设置说明

推荐以 GitHub Secrets 管理通知凭据：

- Slack：`SLACK_WEBHOOK_URL`
- Discord：`UPPTIME_DISCORD_WEBHOOK`
- Teams / Email（按所选集成方式补充）

建议规则：

- 仅在故障/恢复时通知，避免噪声。
- 将告警路由到运维与值班频道。
- 关键端点可增加 on-call 提醒（配合第三方告警系统）。

## 7. 维护和更新指南

- 端点变更：新增环境或服务时同步更新 `sites`。
- 调度策略：根据流量与成本平衡，审查 `workflowSchedule`。
- 事件管理：每次 Incident 补充根因与修复记录。
- 版本升级：定期同步 Upptime 模板更新，关注 breaking changes。
- 审计留痕：在基础设施变更 PR 中引用本指南并更新配置差异说明。

---

如需在 CI 门禁中增加状态页可用性校验，可在后续基础设施任务中补充自动检查。
