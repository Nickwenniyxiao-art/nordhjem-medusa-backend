# NordHjem Ops Scripts

服务器运维脚本，部署于 VPS1（`66.94.127.117`）的 `/opt/nordhjem/scripts/`。

## 部署方式

```bash
# 首次部署（或更新）
scp ops/scripts/*.sh root@66.94.127.117:/opt/nordhjem/scripts/
ssh root@66.94.127.117 "chmod +x /opt/nordhjem/scripts/*.sh"
```

## 脚本列表

### `disk-alert.sh`
- **触发**：每小时 `:07`（`7 * * * *`）
- **功能**：检查 `/` 分区磁盘使用率
  - `≥ 75%` → Telegram ⚠️ warning
  - `≥ 90%` → Telegram 🚨 critical
- **日志**：`/var/log/nordhjem/disk-alert.log`

### `docker-cleanup.sh`
- **触发**：每周日 UTC 03:00（`0 3 * * 0`）
- **功能**：清理 72 小时内未使用的 Docker 镜像、停止的容器、无用网络
- **安全**：运行中容器的镜像不会被删除
- **日志**：`/var/log/nordhjem/docker-cleanup.log`

## Crontab 配置

```cron
# NordHjem Ops — disk alert every hour
7 * * * * /opt/nordhjem/scripts/disk-alert.sh

# NordHjem Ops — Docker cleanup every Sunday UTC 03:00
0 3 * * 0 /opt/nordhjem/scripts/docker-cleanup.sh
```

查看当前 crontab：`crontab -l`

## 环境变量依赖

脚本在服务器上直接使用硬编码的 Token（存放于 `/opt/nordhjem/medusa/.env`），
不依赖 GitHub Secrets。如需更新 Token，直接修改服务器上的脚本文件。
