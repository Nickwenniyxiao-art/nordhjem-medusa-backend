# 数据库同步脱敏（Production → Staging）

## 概述

为保证 staging 具备接近生产的数据分布，同时满足 GDPR 与最小暴露原则，我们采用“同步 + 脱敏”机制：

1. 从 production 导出数据库；
2. 导入 staging；
3. 对敏感字段执行统一脱敏；
4. 验证脱敏结果后结束。

该机制可定时执行，也支持手动触发与 dry-run 预演。

## 脱敏字段与策略

| 字段 | 策略 |
| --- | --- |
| `email` | 替换为 `user_<id>@sanitized.local`（若无 `id` 列则使用 `user_sanitized@sanitized.local`） |
| `phone` | 替换为 `+0000000000` |
| `password_hash` | 替换为固定 bcrypt hash |
| `first_name` / `last_name` / `address_1` / `address_2` / `city` / `postal_code` | 替换为 `REDACTED` |

> 脱敏脚本会动态扫描 `public` schema 中包含这些列的表并执行更新，支持重复执行（幂等）。

## 手动运行

### 前置条件

- 本机安装 PostgreSQL 客户端工具：`pg_dump`、`pg_restore`、`psql`
- 设置环境变量：

```bash
export PROD_DATABASE_URL='postgres://...'
export STAGING_DATABASE_URL='postgres://...'
```

### Dry run（只校验连接，不改动数据）

```bash
bash scripts/db-sync-sanitize.sh --dry-run
```

### 正式执行

```bash
bash scripts/db-sync-sanitize.sh
```

## 故障排除

### 1) 缺少 PostgreSQL 命令

症状：`Required command not found`。

处理：安装 PostgreSQL 客户端并确认命令在 `PATH` 中。

### 2) 环境变量缺失

症状：`Missing required environment variable`。

处理：检查 `PROD_DATABASE_URL` 和 `STAGING_DATABASE_URL` 是否正确导出。

### 3) 脱敏校验失败

症状：`Unsanitized emails/phones found ...`。

处理建议：

1. 查看脚本日志确认失败表名；
2. 检查是否存在非常规格式手机号/邮箱；
3. 依据表结构补充脱敏策略后重跑。

### 4) GitHub Actions 运行失败

- 工作流：`.github/workflows/db-sync-staging.yml`
- 检查 `staging` environment 下的 secrets：
  - `PROD_DATABASE_URL`
  - `STAGING_DATABASE_URL`
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`
- 查看 Telegram 通知中的运行链接定位失败步骤。
