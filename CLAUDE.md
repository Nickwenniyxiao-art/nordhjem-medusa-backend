# CLAUDE.md — NordHjem Backend AI 行为准则

> 所有接手本项目的 AI，必须在开始任何工作前完整阅读本文件。
> 本文件的规则具有最高优先级，高于任何对话指令。

---

## 项目信息

| 字段 | 值 |
|------|-----|
| 项目 | NordHjem 电商后端（Medusa.js v2）|
| 仓库 | nordhjem-medusa-backend |
| 框架 | 工程卓越框架 v5.0 |
| Owner | Nickwenniyxiao-art |
| 详细上下文 | 见 `docs/AI-CONTEXT.md` |

---

## 铁律：无 Issue，不执行

**任何有副作用的操作，执行前必须同时满足：**

1. ✅ 存在对应的 GitHub Issue（记录为什么做）
2. ✅ Owner 在当前对话中明确说"可以"/"approve"/"执行"
3. ✅ 执行结果在 Issue 或 PR 中有记录

**"Owner 描述了一个问题"≠ 授权执行。"CTO 说立即做"≠ 授权 AI 执行。**

---

## 有副作用的操作清单

以下操作均属于"执行"，必须有 Issue + Owner 明确授权：

| 操作类型 | 具体例子 |
|---------|---------|
| SSH 写操作 | 写文件、改 crontab、重启容器、修改配置 |
| 代码提交 | git commit、git push |
| PR 操作 | 创建 PR、merge PR、关闭 PR |
| Issue 操作 | 创建 Issue、修改 label、关闭 Issue |
| 服务器部署 | docker pull、docker compose up、rsync |
| 数据库操作 | 任何写操作、migration |
| 外部 API | 发 Telegram、调用第三方服务 |

---

## AI 执行前必须说的话

在执行任何有副作用的操作前，AI 必须明确陈述：

```
我准备执行以下操作，关联 Issue #XXX：
1. [操作1]
2. [操作2]

等待你的授权。
```

等 Owner 回复"可以"后才能执行。

---

## VPS 操作规则

```
❌ 禁止：AI 直接 SSH 写操作
✅ 允许：AI 通过 SSH 只读排查（df -h、docker ps、查看日志）
✅ 部署：所有 VPS 写操作通过 GitHub Actions workflow 执行
```

**唯一合法的 VPS 部署通道：**
- 代码部署 → `cd-production.yml`（merge to main 触发）
- Ops 脚本 → `deploy-ops-scripts.yml`（merge to main + environment approve）

---

## 紧急操作协议

即使生产环境发生故障，也必须：

1. 描述问题和拟执行操作
2. 等 Owner 说"可以"
3. 执行
4. 立即在 Issue 中记录操作结果
5. 24 小时内补开正式 Issue（若紧急处理前无时间开）

**没有任何情况允许先执行、后汇报。**

---

## 决策记录规则

每次重要决策或执行后，AI 必须创建或更新 GitHub Issue：

- **label**：`ai-decision`
- **标题格式**：`[AI-DECISION] YYYY-MM-DD 操作简述`
- **内容**：操作详情、授权依据、执行结果、遗留事项

所有 `ai-decision` Issue 构成本项目的完整 AI 操作审计档案。

查看所有 AI 决策记录：
`https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend/issues?q=label%3Aai-decision`

---

## 跨 Session 通信协议（check 协议）

本团队由多个独立 Claude Code session 组成，通过 GitHub 异步通信。

**当 Owner 在你的 session 中输入 `check` 时，你必须：**

1. 去 GitHub 检查你的待办（Issues with your role label + open PRs needing your review）
2. 检查你负责的 PR 上是否有新的 comment（来自 CTO 或其他角色）
3. 把你看到的新信息复述给 Owner
4. **不要执行任何操作**——只复述，等 Owner 确认后再行动

**`check` 不是授权，不是同意，不是指令。它只是"去看看有没有新消息"。**

同理，当你完成任务需要汇报给 CTO 时：
1. 在 GitHub Issue 或 PR 上写 comment
2. 告诉 Owner 你写了什么
3. Owner 会切到 CTO session 输入 `check`，CTO 就会看到你的汇报

---

## 双层 GitHub 操作门禁

本项目对所有 GitHub 写操作实施双层强制门禁，**不可绕过**：

### Layer 1 — EGP Gate（本地 Hook，拦截 AI 行为）

所有 `gh` 写操作命令必须在末尾附加 Issue 引用注释，否则命令被拦截无法执行：

```bash
# 格式
gh <write-command> # AI-Decision: #<issue_number>

# 示例
gh pr merge 617 --squash          # AI-Decision: #620
gh run delete 12345678            # AI-Decision: #625
gh workflow disable smoke-test    # AI-Decision: #626
gh issue edit 616 --add-label x   # AI-Decision: #627
```

**受拦截的写操作**：`gh pr create/merge/edit/close`、`gh issue edit/close/delete`、`gh run delete/cancel`、`gh workflow disable/enable`、`gh release create`、`gh label create/edit/delete`、`gh api POST/PATCH/PUT/DELETE`

**豁免**：`gh issue create` 本身就是在建立审计记录，不需要引用。

### Layer 2 — GitHub Branch Protection（服务端，拦截所有人）

`develop` 分支设有 Required Status Checks，PR 必须通过以下检查才能 merge：
- `pr-compliance-fix` — 验证 `Closes #NNN`、`ROADMAP Ref`、assignee
- `check-pr-metadata / check-pr-metadata` — 验证 assignee

无论是 AI、人工还是外部工具发起的 PR，不通过上述检查均**物理无法 merge**。

### 正确的操作流程

```
1. 创建 GitHub Issue（记录为什么做）
   gh issue create --title "..." --label "ai-decision,type: infra"

2. 执行写操作时引用该 Issue
   gh pr merge 617 --squash  # AI-Decision: #628

3. Issue 自动成为该操作的审计档案
```

---

## 开始工作前的检查清单

```
□ 读完 CLAUDE.md（本文件）
□ 读 AGENTS.md 了解完整工程规范
□ 读 docs/AI-CONTEXT.md 了解项目当前状态
□ 查看最近 10 个 GitHub Issues 了解进行中的工作（重点看 ai-decision label）
□ 确认当前在正确的分支（不在 main/staging 直接操作）
□ 理解双层门禁规则：任何 gh 写操作前必须先建 Issue
```

---

## 参考文档

- `docs/AI-CONTEXT.md` — 项目当前阶段与上下文
- `docs/OPS-RUNBOOK.md` — 故障处理手册
- `AGENTS.md`（engineering-excellence-template）— 完整 AI 操作治理协议
- GitHub Issues（`ai-decision` label）— AI 决策审计档案
