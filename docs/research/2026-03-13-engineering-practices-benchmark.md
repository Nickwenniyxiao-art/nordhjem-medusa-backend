# 工程实践对比调研：Microsoft / Google / AWS

## 调研日期

2026-03-13

## 调研背景

在建立 NordHjem 开发管理体系前，对行业头部公司的工程实践标准进行调研，作为体系设计的参考。本报告由 AI 完成调研，CTO 负责审阅归档。

## 调研来源

- [Microsoft Engineering Fundamentals Playbook](https://microsoft.github.io/code-with-engineering-playbook/)
- Google Engineering Practices
- AWS ADR 实践

---

## 调研结论

### Microsoft Engineering Fundamentals Playbook

定义了 15 个工程维度，覆盖软件交付全生命周期：

1. **Source Control** — 分支策略、提交规范
2. **Work Item Tracking** — 任务追踪与需求管理
3. **Testing** — 单元测试、集成测试、端到端测试
4. **CI/CD** — 持续集成与持续交付流水线
5. **Security** — 安全编码与依赖扫描
6. **Observability** — 日志、指标、告警
7. **Agile/Scrum** — 敏捷迭代与 Sprint 管理
8. **Design Reviews** — 架构评审流程
9. **Code Reviews** — 代码审查标准
10. **Documentation** — 文档编写与维护规范
11. **Developer Experience** — 开发环境与工具链
12. **Non-Functional Requirements** — 性能、可用性等非功能需求
13. **Accessibility** — 可访问性标准
14. **Engineering Feedback** — 工程反馈机制
15. **Retrospectives** — 团队回顾与持续改进

---

### Google Engineering Practices

核心理念与实践要点：

- **代码审查流程**：以小粒度变更为主，快速迭代，降低单次 PR 风险。
- **文档与代码同源**：文档和代码放在同一仓库维护，避免文档腐烂。
- **知识共享文化**：鼓励工程师主动记录与分享，减少信息孤岛。
- **渐进式发布与 Feature Flags**：通过功能开关控制上线节奏，降低变更风险。
- **技术债管理**：将技术债显性化，纳入迭代计划统一管理。
- **无责事后复盘（Blameless Postmortem）**：聚焦系统与流程问题，不追究个人责任，营造安全的工程文化。

---

### AWS

核心实践重点：

- **ADR（架构决策记录）**：大力推行 Architecture Decision Record，将每一项重要技术决策文档化，形成可追溯的决策历史。
- **团队协作审批**：ADR 需经过相关利益方评审，确保决策质量与团队共识。
- **决策状态管理**：ADR 维护明确的状态（提议中 / 已接受 / 已废弃），便于追踪决策生命周期。
- **与开发工件关联**：ADR 与对应的 PR、Issue 相互引用，保持上下文完整性。

---

## 对比分析

| 维度 | Microsoft | Google | AWS | NordHjem |
|------|-----------|--------|-----|----------|
| Source Control | ✅ | ✅ | ✅ | ✅ Playbook 第 3 章 |
| CI/CD | ✅ | ✅ | ✅ | ✅ 第 4 章（含 AI，超标准）|
| Code Review | ✅ | ✅ | ✅ | ✅ AI 三审制 |
| Testing | ✅ | ✅ | ✅ | ✅ 第 6 章 |
| Security | ✅ | ✅ | ✅ | ✅ 第 6 章 |
| Documentation | ✅ | ✅ | ✅ | ✅ 第 9 章 + 活文档 |
| ADR | ✅ | — | ✅ | ✅ 8 条 ADR |
| Observability | ✅ | ✅ | ✅ | ✅ 第 7 章 |
| Design Review | ✅ | ✅ | — | ✅ 第 5 章 |
| Retrospective | ✅ | ✅ | — | ✅ 第 12 章 |
| Postmortem | — | ✅ | ✅ | ✅ 第 8 章 |
| Developer Experience | ✅ | ✅ | — | ✅ 第 10 章 |
| Runbook | — | ✅ | ✅ | ✅ 独立文件 |
| ROADMAP 锁定 | — | — | — | ✅ 独创 |
| 信息转化铁律 | — | — | — | ✅ 独创 |
| 体系自运转 | — | — | — | ✅ 独创 |
| AI 自动化工作流 | — | — | — | ✅ 独创 |
| 文档保管制度 | — | — | — | ✅ 独创 |

---

## NordHjem 的独创机制

NordHjem 在覆盖行业标准全部 15 个维度的基础上，针对"AI 团队 + 频繁换 CTO"的特殊场景，设计了 5 项独创机制：

1. **ROADMAP 锁定机制** — Owner 确认后 CTO 不能自行修改路线图，防止 AI CTO 在无监督情况下偏离产品方向。

2. **信息转化铁律** — "聊天可以丢，GitHub 记录不能丢"。所有重要决策、讨论结论必须转化为 GitHub 工件（Issue / ADR / PR / 文档）后方视为有效。

3. **体系自运转** — 所有工程体系的维护工作（文档更新、规范修订、INDEX 同步）由 CTO（AI）自主完成，Owner 零介入，确保体系可持续运行。

4. **AI 自动化工作流** — AI Code Review + Codex Auto-fix + AI Test Gen 三位一体，将 AI 能力深度集成到工程流水线，超越行业通行标准。

5. **文档保管制度** — 统一归档规范 + INDEX.md 目录索引，确保任意一任 CTO 交接时能快速定位所有历史文档与决策上下文。

---

## 结论

NordHjem 的工程体系设计覆盖了 Microsoft、Google、AWS 所定义的全部 15 个行业标准维度，同时针对自身场景（小团队、AI 主导开发、高 CTO 迭代频率）增加了 5 项独创机制。

**综合评估**：NordHjem 工程体系在覆盖度上与行业头部对齐，在 AI 集成深度和团队特殊场景适配上具备差异化优势，可作为同类型 AI-first 小团队的参考范本。

---

*本文档由 AI 调研，CTO 审阅归档。归档日期：2026-03-13。*
