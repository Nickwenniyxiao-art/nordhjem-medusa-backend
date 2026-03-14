# NordHjem 新 CTO 上手指南

> 预计阅读时间：5 分钟
> 最后更新：2026-03-13

---

## 欢迎

欢迎加入 NordHjem 项目。

**NordHjem**（北欧之家）是一个以北欧极简主义为核心审美的家居电商独立站，目标客群是追求高品质生活方式的消费者。项目从零自建，技术选型务实，团队精简、节奏快。

作为新 CTO，你接手的是一个有清晰工程体系、有实际运行产品的项目，而不是一张白纸。本文件帮你在 5 分钟内建立基本认知。

---

## 技术栈速览

| 层次 | 技术 | 说明 |
|------|------|------|
| 前端 | Next.js 15 | App Router，TypeScript |
| 后端 | Medusa.js v2 | 电商引擎，Node.js |
| 数据库 | PostgreSQL | 主数据库 |
| 缓存 | Redis | 会话、队列、缓存 |
| 容器化 | Docker + Docker Compose | 后端及依赖服务 |
| 前端进程 | PM2 | Node.js 进程管理 |
| Web 服务器 | Nginx | 反向代理 + SSL |
| 服务器 | VPS 66.94.127.117 | 单节点部署 |
| CI/CD | GitHub Actions | 自动化构建、测试、部署 |

---

## GitHub 仓库

| 仓库 | 地址 | 说明 |
|------|------|------|
| 前端 | `Nickwenniyxiao-art/nextjs-starter-medusa` | Next.js 前端 |
| 后端 | `Nickwenniyxiao-art/nordhjem-medusa-backend` | Medusa.js 后端 |

GitHub 组织：**Nickwenniyxiao-art**

---

## 域名

| 用途 | 域名 |
|------|------|
| 前端（用户访问） | `nordhjem.store` |
| 后端 API | `api.nordhjem.store` |

---

## 阅读路线图

按顺序阅读，总耗时约 60 分钟，读完即可独立作战。

| 步骤 | 文件 | 时间 | 目的 |
|------|------|------|------|
| 第 1 步 | 本文件（ONBOARDING.md） | 5 min | 建立基本认知 |
| 第 2 步 | `INDEX.md` | 2 min | 了解文档目录结构 |
| 第 3 步 | `CURRENT-STATUS.md` | 5 min | 了解项目当前所处位置 |
| 第 4 步 | `ROADMAP.md` | 5 min | 知道接下来要做什么 |
| 第 5 步 | `ENGINEERING-PLAYBOOK.md` | 30 min | 知道怎么做（核心纲领） |
| 第 6 步 | `ADR/` 目录 | 15 min | 知道为什么这么做（决策历史） |
| 第 7 步 | `SPRINT-LOG.md` | 5 min | 了解最近在做什么 |

---

## 角色定义速览

### Owner（产品负责人）

Owner 只做两件事：
1. **确认 ROADMAP**：确认每个里程碑的目标和优先级
2. **Approve production**：每次生产部署前给予明确授权（在 GitHub PR 上 Approve 或在 GitHub Actions 中手动触发）

Owner 不参与技术实现、不干预分支、不修改环境变量、不操作服务器。

### CTO（技术负责人，即你）

CTO 全权负责以下所有技术工作：

- 技术架构设计与演进
- 工程规范制定与执行
- CI/CD 流水线设计与维护
- 代码审查（Code Review）
- Sprint 计划与执行
- Codex 任务起草与验收
- 文档撰写与更新
- 服务器运维与监控
- 事故响应与复盘

### 8 条铁律（摘要）

1. **不绕过 CI/CD**：所有代码通过 PR + GitHub Actions 合并，禁止直接 push main
2. **不在生产服务器手动改代码**：服务器只运行容器，不是开发环境
3. **不手动修改生产环境变量**：变量变更须走 PR + 审核流程，并更新文档
4. **不跳过 Code Review**：任何代码合并 main/develop 前必须有 review 记录
5. **不删除备份**：备份保留策略严格执行，手动删除须事先确认
6. **不忽略监控告警**：收到告警必须在 30 分钟内响应并记录
7. **不在 Sprint 中途随意加任务**：新任务进 Backlog，下个 Sprint 评估
8. **不遗漏文档更新**：任何架构/流程变更，当天更新对应文档

> 完整铁律和背景说明见 `ENGINEERING-PLAYBOOK.md`。

---

## 第一天行动清单

完成以下事项，即可结束第一天。

- [ ] 读完本文件（ONBOARDING.md）
- [ ] 浏览 GitHub 仓库代码结构（前端 + 后端各 10 分钟）
- [ ] 查看 GitHub Projects 看板，了解当前 Sprint 状态
- [ ] 阅读 `CURRENT-STATUS.md`，了解项目进度和已知问题
- [ ] 阅读 `ROADMAP.md`，确认下一个里程碑目标
- [ ] 检查 CI/CD 流水线状态（GitHub Actions → 查看最近 10 次 workflow 运行结果）

---

## 第一周行动清单

- [ ] 读完 `ENGINEERING-PLAYBOOK.md`（13 章 + 2 附录）
- [ ] 读完所有 ADR（`docs/ADR/` 目录，当前 8 篇）
- [ ] 熟悉 CI/CD 流程：提一个测试 PR，观察 workflow 全流程
- [ ] 接手当前 Sprint 任务，认领至少一个 Issue
- [ ] 更新 `CURRENT-STATUS.md`，写入你的观察和接手声明

---

## 关键链接汇总

| 资源 | 地址 |
|------|------|
| 前端仓库 | https://github.com/Nickwenniyxiao-art/nextjs-starter-medusa |
| 后端仓库 | https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend |
| GitHub Projects 看板 | https://github.com/orgs/Nickwenniyxiao-art/projects |
| 前端线上地址 | https://nordhjem.store |
| 后端 API | https://api.nordhjem.store |
| 后端 Admin 面板 | https://api.nordhjem.store/app |
| 后端健康检查 | https://api.nordhjem.store/health |
| VPS 地址 | 66.94.127.117 |

---

## 紧急联系

Owner 的联系方式保存在以下位置（不在文档中明文记录）：

- **GitHub**：查看组织 `Nickwenniyxiao-art` 的 Owner 成员
- **私密联系信息**：由上一任 CTO 或 Owner 在交接时面告，存入你的私人密码管理器
- **紧急情况**：如无法联系 Owner，CTO 有权独立处理生产事故，事后同步记录在 `SPRINT-LOG.md`

---

*读完本文件后，下一步：阅读 `INDEX.md`，了解所有文档目录。*
