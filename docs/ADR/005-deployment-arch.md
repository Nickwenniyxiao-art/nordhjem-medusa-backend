# ADR-005: 部署架构

## 状态

已采纳

## 日期

2025-06-01

## 背景

项目进入初期上线阶段，需要确定生产环境的部署架构。核心约束条件：

- **预算有限**：早期项目，月均基础设施预算控制在 $50 以内
- **团队规模小**：无专职 DevOps，运维复杂度需要控制
- **流量预期低**：初期 DAU 预期在百级别，无需高并发架构
- **组件构成**：Medusa.js v2 后端（Node.js）+ Next.js 15 前端 + PostgreSQL + Redis + Nginx

主要决策点：选择云平台还是 VPS？选择容器编排还是简单进程管理？

## 方案对比

### 云平台选择

| 方案 | 优点 | 缺点 |
|------|------|------|
| AWS / GCP / Azure（托管服务） | 托管数据库（RDS）、自动扩缩容、高可用、监控完善 | 月费显著更高（RDS 最低 ~$30/月起）；配置复杂；初期浪费资源 |
| Vercel（前端） + Railway（后端） | 前端部署极简、自动 HTTPS、Preview 部署好用 | 后端在 Railway 有冷启动问题；数据库额外计费；扩展到自有基础设施需要迁移 |
| 单 VPS（Hetzner / DigitalOcean / Vultr） | 成本最低（$6-20/月）、完全控制、无供应商锁定 | 需要自行运维（备份、安全补丁）；单点故障 |

### 容器/进程管理

| 方案 | 优点 | 缺点 |
|------|------|------|
| Kubernetes（K8s） | 高可用、自动恢复、弹性伸缩 | 运维复杂度极高；单 VPS 上跑 K8s 资源浪费 |
| Docker Compose | 容器化隔离、声明式配置、易于本地复现 | 无内置高可用；多服务启动顺序需要手动管理 |
| PM2（Node.js 进程管理） | 轻量、自动重启、日志管理、零停机重启 | 仅适用于 Node.js；无容器隔离 |
| Docker（后端）+ PM2（前端）+ Nginx（反向代理） | 后端容器化隔离；前端利用 PM2 zero-downtime；Nginx 统一入口 | 混合方案，两套工具需要分别维护 |

## 决策

采用**单 VPS + Docker（后端）+ PM2（前端）+ Nginx 反向代理**：

- **VPS**：固定 IP `66.94.127.117`，配置 2 vCPU / 4GB RAM / 80GB SSD
- **Medusa.js 后端**：Docker 容器运行，通过 Docker Compose 管理（含 PostgreSQL、Redis）
- **Next.js 前端**：PM2 进程管理，`npm run build && pm2 restart nordhjem-frontend`
- **Nginx**：统一反向代理，处理 SSL 终止（Let's Encrypt）、静态文件缓存、路由分发
- **数据库**：PostgreSQL 运行在 Docker 容器内，挂载宿主机 Volume 持久化数据

部署流程（由 CD 流水线触发）：
1. SSH 连接到 VPS
2. `docker compose pull && docker compose up -d`（后端更新）
3. `pm2 restart nordhjem-frontend`（前端更新）

## 后果

### 正面影响

- 月均成本约 $15-20，远低于托管云服务方案
- 无供应商锁定，可随时迁移到其他 VPS 提供商或云平台
- Docker 容器化确保后端环境一致性，本地开发与生产环境对齐
- Nginx 提供统一的 SSL 终止和访问日志，便于后续接入 CDN

### 负面影响 / 需关注的风险

- **单点故障**：VPS 宕机即服务中断，无高可用保障，需定期快照备份
- **PostgreSQL 自管理**：数据库运行在 Docker 内，需要自行配置定时备份（pg_dump + 异地存储）
- **纵向扩展瓶颈**：单 VPS 垂直扩展有上限，流量增长后需迁移至多节点或托管服务
- **部署窗口期**：Docker 重启和 PM2 重启期间存在短暂服务中断，后续需要引入蓝绿部署
- 后续评估：当 DAU 超过 10,000 或融资后，应重新评估迁移到 AWS ECS 或 Kubernetes 的方案
