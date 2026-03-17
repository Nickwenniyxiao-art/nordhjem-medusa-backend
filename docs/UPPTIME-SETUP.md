# Upptime 监控与状态页配置指南

本指南用于在独立仓库中部署 NordHjem 的 Upptime 监控与状态页，覆盖生产前后端与
Staging 后端健康检查。配套模板见 `docs/upptime-config/.upptimerc.yml`，自动化脚本见
`scripts/setup-upptime.sh`。

## 1. Upptime 简介

Upptime 是一个基于 GitHub Actions、Issues 和 GitHub Pages 的开源监控方案，特点：

- 无需单独监控服务器（以 GitHub Actions 作为调度执行器）。
- 每次探测都会写入仓库历史，便于审计与追踪。
- 探测失败自动创建 Incident Issue，恢复后自动关闭。
- 可自动生成状态页，展示可用性、响应时间与事件时间线。

## 2. 创建 `nordhjem-upptime` 仓库步骤

### 2.1 自动化方式（推荐）

在本仓库执行：

```bash
bash scripts/setup-upptime.sh <github-org> <repo-name>
```

示例：

```bash
bash scripts/setup-upptime.sh nordhjem nordhjem-upptime
```

脚本会自动执行以下操作：

1. 创建目标 GitHub 仓库（若不存在）。
2. 引导拉取 `upptime/upptime` 模板并写入 NordHjem `.upptimerc.yml`。
3. 根据环境变量尝试写入通知 Secrets。
4. 推送初始化提交并启用 GitHub Pages。
5. 触发首次 `uptime.yml` 工作流。

### 2.2 手动方式（备选）

1. 在 GitHub 新建仓库：`nordhjem-upptime`（建议 Public，便于公开状态页）。
2. 使用 Upptime 官方模板初始化仓库：

   - 模板仓库：`upptime/upptime`
   - 或通过 Upptime CLI 初始化（如团队已有脚手架流程）。

3. 在仓库 Settings > Actions > General 中确保允许 Actions 运行。
4. 在 Settings > Pages 中启用 GitHub Pages（分支通常为 `gh-pages` 或 `main`）。
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

## 4. Telegram 告警联动（R-P2-02）

Upptime 可直接通过 Telegram 渠道推送 Incident 事件，作为现有
`scripts/telegram-notify.sh` 告警体系的补充来源。推荐策略：

- Upptime 负责**可用性事件**（端点 down / recovered）。
- 业务/部署脚本继续复用 `scripts/telegram-notify.sh` 推送关键运维事件。
- 两者使用同一组 `TELEGRAM_BOT_TOKEN` 与 `TELEGRAM_CHAT_ID`，便于统一收敛告警。

建议在群组命名上区分渠道，例如：

- `#infra-upptime`：可用性事件。
- `#infra-release`：发布/回滚/任务执行事件。

## 5. Secrets 清单（Owner 配置）

以下 Secrets 需要在 Upptime 仓库 Settings > Secrets and variables > Actions 配置：

| Secret 名称 | 必需 | 用途 |
| --- | --- | --- |
| `UPPTIME_DISCORD_WEBHOOK` | 否 | Discord Incident 通知 |
| `SLACK_WEBHOOK_URL` | 否 | Slack 通知渠道（如启用 Slack 模板） |
| `TELEGRAM_BOT_TOKEN` | 是（启用 Telegram 时） | Telegram Bot Token |
| `TELEGRAM_CHAT_ID` | 是（启用 Telegram 时） | Telegram 群组/频道 Chat ID |

若使用自动化脚本，可在执行前导出环境变量后自动写入：

```bash
export TELEGRAM_BOT_TOKEN="<bot-token>"
export TELEGRAM_CHAT_ID="<chat-id>"
export UPPTIME_DISCORD_WEBHOOK="https://discord.com/api/webhooks/..."
bash scripts/setup-upptime.sh nordhjem nordhjem-upptime
```

## 6. 部署状态页步骤

1. 在 Upptime 仓库中提交 `.upptimerc.yml`。
2. 推送到默认分支（通常 `main`）。
3. GitHub Actions 会自动执行以下流程：

   - 站点探测（`uptime`）
   - 汇总与图表更新（`summary` / `graphs`）
   - 状态页静态站点构建（`staticSite`）

4. 等待首次工作流完成后，访问 Pages 地址验证页面可用性。

## 7. 自定义域名配置

1. 在 `.upptimerc.yml` 的 `status-website.cname` 设置域名（示例：
   `status.nordhjem.com`）。
2. 在 DNS 提供商添加 CNAME 记录指向 `<owner>.github.io`。
3. 在 Upptime 仓库的 Pages 设置中确认 Custom domain 生效。
4. 开启 HTTPS（GitHub Pages 通常会自动申请证书）。

## 8. 通知设置说明

推荐以 GitHub Secrets 管理通知凭据：

- Slack：`SLACK_WEBHOOK_URL`
- Discord：`UPPTIME_DISCORD_WEBHOOK`
- Telegram：`TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`

建议规则：

- 仅在故障/恢复时通知，避免噪声。
- 将告警路由到运维与值班频道。
- 关键端点可增加 on-call 提醒（配合第三方告警系统）。

## 9. 验证步骤（上线后必做）

1. **工作流检查**：确认 `Update summary in README` 与 `Response time` 按计划执行。
2. **状态页检查**：访问 `https://<owner>.github.io/<repo>/` 或自定义域名。
3. **通知检查**：手动将一个监控 URL 改为无效地址，确认 Telegram/Discord/Slack 收到 Incident。
4. **恢复检查**：将 URL 恢复后，确认 Recovery 通知与 Issue 自动关闭。
5. **审计留痕**：在部署 PR 记录验证截图、Issue 链接与告警消息链接。

## 10. 维护和更新指南

- 端点变更：新增环境或服务时同步更新 `sites`。
- 调度策略：根据流量与成本平衡，审查 `workflowSchedule`。
- 事件管理：每次 Incident 补充根因与修复记录。
- 版本升级：定期同步 Upptime 模板更新，关注 breaking changes。
- 审计留痕：在基础设施变更 PR 中引用本指南并更新配置差异说明。

---

如需在 CI 门禁中增加状态页可用性校验，可在后续基础设施任务中补充自动检查。
