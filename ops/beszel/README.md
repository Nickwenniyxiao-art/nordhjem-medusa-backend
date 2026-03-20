# Beszel 部署指南

> RFC-001: Phase 1 运维监控体系
> Beszel 官网: https://beszel.dev

---

## 架构

```
VPS2 (94.72.125.79)        VPS1 (66.94.127.117)
┌─────────────────┐         ┌──────────────────┐
│  Beszel Hub     │◄────────│  Beszel Agent    │
│  port: 8090     │WebSocket│  port: 45876     │
│  (dashboard)    │         │  (data collector) │
└─────────────────┘         └──────────────────┘
```

---

## 1. 部署 Beszel Hub（VPS2）

> ⚠️ 需要 Owner 授权 + ai-decision GitHub Issue

```bash
# 在 VPS2 上执行（通过授权 workflow）
mkdir -p /opt/beszel
cd /opt/beszel

# 复制此目录的 docker-compose.yml 到 VPS2
docker compose up -d

# 验证
docker ps | grep beszel-hub
curl -s http://localhost:8090  # 应返回 HTML
```

**初始化**：
1. 访问 `http://94.72.125.79:8090`
2. 创建管理员账号
3. 点击 "Add System" 添加 VPS1
4. 复制生成的 Agent 启动命令（含 --key 参数）

---

## 2. 部署 Beszel Agent（VPS1）

> 使用 Hub 生成的唯一 --key

```bash
# 在 VPS1 上执行（通过授权 workflow）
docker run -d \
  --name beszel-agent \
  --restart unless-stopped \
  --network host \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  henrygd/beszel-agent:latest \
  --hub "94.72.125.79:8090" \
  --key "YOUR_AGENT_KEY_FROM_HUB"
```

**注意**:
- `--network host` 允许 Agent 采集宿主机网络指标
- `-v /var/run/docker.sock:ro` 允许 Agent 监控 Docker 容器
- `--key` 从 Hub 生成，每个 Server 唯一

---

## 3. 监控指标

Beszel 自动采集并展示：

| 指标 | 说明 |
|------|------|
| CPU 使用率 | 实时 + 历史趋势 |
| 内存使用 | 总量 / 已用 / 缓存 |
| 磁盘 I/O | 读写速度 |
| 网络流量 | 入站 / 出站 |
| Docker 容器 | 各容器资源占用 |

---

## 4. 告警配置（Phase 2）

Beszel 支持通过 Webhook 发送告警。Phase 2 中计划配置：
- 磁盘 > 85% 触发 Webhook → 转发到 Telegram
- 容器意外停止触发告警

（当前阶段使用 disk-alert.sh crontab 替代）

---

## 5. 访问方式

| 资源 | 地址 |
|------|------|
| Beszel Hub 仪表板 | http://94.72.125.79:8090 |
| Agent 数据端口 | VPS1:45876（内部，不需公网暴露） |

---

## 部署 Checklist

- [ ] ai-decision Issue 已创建（记录授权依据）
- [ ] Owner 已明确授权（在对话中回复"可以"）
- [ ] VPS2 Hub 部署完成（docker ps 验证）
- [ ] VPS2 管理员账号已创建（记录在 Issue 中）
- [ ] VPS1 Agent 部署完成（Hub 界面可见 VPS1 数据）
- [ ] Telegram 发送部署通知
- [ ] GitHub Issue 记录执行结果
