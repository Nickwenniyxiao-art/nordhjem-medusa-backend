# RFC (Request for Comments)

RFC 是 NordHjem 后端项目的技术提案流程。任何涉及架构变更、重大技术决策、或跨模块影响的变更，都应先撰写 RFC 并经过 Owner 审批。

## 什么时候需要 RFC

- 引入新的第三方服务或依赖（如新的支付网关、消息队列）
- 修改数据库 Schema 结构（新增表、字段类型变更、删除字段）
- 变更 API 契约（影响前端或外部消费者的接口变更）
- 调整 Medusa v2 模块边界或引入新模块
- 变更认证/授权机制
- 重大性能优化方案（影响现有架构）
- 变更部署策略或基础设施配置

## 不需要 RFC 的情况

- Bug 修复（走普通 Issue + PR 流程）
- 文档更新
- 依赖版本小版本升级
- 样式/格式修复

## RFC 流程

1. 复制 `docs/templates/RFC.md` 到本目录，命名为 `RFC-NNN-title.md`（NNN 为序号）
2. 填写 RFC 内容，状态设为 `Draft`
3. 提交 PR，关联到对应的 Issue
4. 标记 PR 为 `rfc` 类型，等待 Owner Review
5. Owner 批准后，状态更新为 `Approved`，可以开始实施
6. 实施完成后，状态更新为 `Implemented`，并在 CHANGELOG 中记录

## RFC 模板

模板位于 `docs/templates/RFC.md`（如存在）或参考本目录已有 RFC 文件结构。

## 已有 RFC 列表

| 编号 | 标题 | 状态 | 作者 | 日期 |
|------|------|------|------|------|
| - | 暂无已批准的 RFC | - | - | - |

---

> 参考资料：[Rust RFC Process](https://github.com/rust-lang/rfcs) | [React RFC Process](https://github.com/reactjs/rfcs)
