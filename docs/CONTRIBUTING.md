# CONTRIBUTING

> 项目名称: NordHjem  
> 创建日期: 2026-03-16  
> 状态: Active  
> 负责人: CTO (AI)

# CONTRIBUTING

## 提交流程

1. Fork 仓库并同步最新 `develop`。
2. 创建分支并实现改动。
3. 本地执行 lint / type-check / tests。
4. 提交 commit 并推送分支。
5. 发起 PR（目标分支：`develop`）。
6. CI 通过后进入 Code Review。
7. Review 通过后由 Maintainer 合并。

流程摘要：**Fork → Branch → Commit → PR → CI → Review → Merge**。

## 分支与提交规范

- 分支命名：`feat/xxx`、`fix/xxx`、`docs/xxx`（或 `codex/xxx` 用于 AI 任务）。
- 提交信息：必须遵循 Conventional Commits，格式 `type(scope): description`。
- 代码风格与结构要求请参考 `docs/CODE-STYLE-GUIDE.md`。

## 代码审查流程

- PR 创建后触发 **AI Review Gate** 自动审查。
- AI Gate 通过且 CI 通过后，可进入人工最终审批。
- `CODEOWNERS` 规则会自动分配 Reviewer，确保关键模块有责任人审批。

## 社区行为准则

- 尊重所有贡献者，保持包容与专业沟通。
- 提供建设性反馈，聚焦问题本身而非个人。
- 禁止骚扰、歧视、攻击性语言与任何不当行为。
- 对新成员保持友好，鼓励知识共享与文档沉淀。
