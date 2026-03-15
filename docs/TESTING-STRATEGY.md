# TESTING-STRATEGY

## 1. 概述

随着 NordHjem 后端能力持续扩展，仅依赖 lint 与 typecheck 已不足以长期保障质量。我们需要统一测试策略，来明确不同类型测试的职责边界、投入优先级与 CI 执行方式，降低回归风险并提升交付稳定性。

本文档目标读者：

- CTO Agent：用于制定质量门禁和阶段性测试目标。
- Codex Agent：用于在实现任务时遵循一致的测试分层与规范。
- 未来开发者：用于快速理解项目测试基线并扩展测试体系。

## 2. 测试金字塔

```text
        /  E2E  \         ← 少量：关键用户流程
       /----------\
      / Integration \     ← 中量：API 端点 + 数据库
     /----------------\
    /   Unit Tests     \  ← 大量：独立函数和工具
   /--------------------\
```

### Unit Tests（大量）

- 定义：验证独立函数、工具方法、纯业务逻辑模块，不依赖真实外部系统。
- 工具：Jest 或 Vitest（待最终选型）。
- 比例建议：70%~80%。

### Integration Tests（中量）

- 定义：验证模块间协作，重点覆盖 API 路由、服务层、数据库读写和依赖注入流程。
- 工具：Supertest + 测试数据库（PostgreSQL test DB 或 in-memory 方案）。
- 比例建议：15%~25%。

### E2E Tests（少量）

- 定义：验证关键端到端业务流程（如注册、下单、支付回调关键路径）。
- 工具：Playwright 或 Cypress（按阶段推进）。
- 比例建议：5%~10%。

## 3. 当前测试状态

| 类型        | 后端                              | 前端                     |
| ----------- | --------------------------------- | ------------------------ |
| Lint        | ✅ ESLint（每个 PR）              | ✅ ESLint（每个 PR）     |
| Type Check  | ✅ TypeScript（每个 PR）          | ✅ TypeScript（每个 PR） |
| Unit Test   | ⚠️ 待补充                         | ⚠️ 待补充                |
| Integration | ⚠️ 待补充                         | —                        |
| E2E         | 📋 Phase 3 计划                   | 📋 Phase 3 计划          |
| Security    | ✅ Gitleaks + Semgrep + npm audit | ✅ 同步中                |

## 4. 测试规范

### 文件命名

- 单元测试：`*.test.ts` 或 `*.spec.ts`
- 集成测试：`*.integration.test.ts`
- 测试文件位置：与被测文件同目录

### 命名约定

```typescript
describe("模块名/函数名", () => {
  it("should 描述预期行为", () => {
    // Arrange - 准备
    // Act - 执行
    // Assert - 断言
  });
});
```

### Mock 策略

- 优先使用 Medusa 内置测试工具
- 外部服务（Stripe、邮件等）必须 mock
- 数据库测试使用 test database 或 in-memory

## 5. 覆盖率目标

| 阶段            | 目标         | 指标                       |
| --------------- | ------------ | -------------------------- |
| Phase 2（当前） | CI 基础保障  | lint + typecheck 100% 通过 |
| Phase 3         | 关键路径覆盖 | 核心业务逻辑 > 60% 覆盖率  |
| Phase 4         | 全面覆盖     | 总体 > 70%，关键路径 > 90% |

## 6. CI 中的测试

| 触发时机      | 运行内容                     | 失败处理       |
| ------------- | ---------------------------- | -------------- |
| PR 提交       | lint + typecheck + security  | 阻断合并       |
| Nightly Build | lint + typecheck + test 全量 | 自动创建 Issue |
| 手动触发      | workflow_dispatch 全量       | 报告结果       |

## 7. 测试最佳实践

1. **每个 bugfix PR 附带回归测试** — 防止问题复现
2. **新功能 PR 附带基础单元测试** — 验证核心逻辑
3. **测试不依赖外部服务** — 使用 mock 和 stub
4. **测试数据用 factory 生成** — 不硬编码测试数据
5. **测试应该快速** — 单元测试 < 5 秒，集成测试 < 30 秒
6. **测试应该独立** — 不依赖执行顺序

## 8. 工具清单

| 工具                  | 用途         | 状态    |
| --------------------- | ------------ | ------- |
| Jest / Vitest         | 单元测试框架 | 待确定  |
| Supertest             | API 集成测试 | 待确定  |
| React Testing Library | 前端组件测试 | Phase 3 |
| Playwright / Cypress  | E2E 测试     | Phase 4 |
| Istanbul / c8         | 覆盖率报告   | Phase 3 |
