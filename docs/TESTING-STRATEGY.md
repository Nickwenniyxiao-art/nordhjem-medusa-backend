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

## 9. 覆盖率 CI 门禁

### 门禁规则

| 阶段 | 规则 | 行为 |
|------|------|------|
| Phase 2（当前） | 无覆盖率门禁 | lint + typecheck 必须通过 |
| Phase 3 | 新增代码覆盖率 ≥ 60% | CI Warning（不阻断） |
| Phase 4 | 总体覆盖率 ≥ 70%，关键路径 ≥ 90% | CI 阻断合并 |

### 实施方式

- 工具：Istanbul / c8（与 Vitest 集成）
- CI 集成：在 `ci.yml` 中增加 `coverage` step
- 报告：生成 `coverage/lcov-report/` 并以 PR Comment 展示
- 配置文件：`vitest.config.ts` 中设置 `coverage.thresholds`

### 豁免规则

以下情况可豁免覆盖率门禁：
- 纯配置文件修改（`.yml`, `.json`, `.md`）
- 自动生成代码（Medusa migrations）
- 第三方类型定义文件

## 10. Flaky Test 治理

### 定义

Flaky Test（不稳定测试）= 同一代码、同一环境下，多次运行结果不一致（时而通过、时而失败）的测试。

### 识别机制

1. **CI 自动标记**：同一测试在最近 5 次运行中失败 ≥ 2 次 → 标记为 flaky
2. **Nightly Build 监控**：nightly 全量测试如果出现非代码变更导致的失败 → 记录到 flaky 清单
3. **手动报告**：开发者发现不稳定测试 → 创建 Issue，Label: `flaky-test`

### 治理流程

| 步骤 | 行为 | 时限 |
|------|------|------|
| 1. 发现 | 标记 flaky，添加 `test.skip` + TODO 注释 | 当天 |
| 2. 定位 | CTO 分析根因（时序依赖、网络调用、随机数据等） | 3 个工作日 |
| 3. 修复 | 创建修复 Issue，优先级 P2 | 1 个 Sprint |
| 4. 验证 | 修复后连续运行 10 次全部通过 → 移除 `test.skip` | 修复后立即 |

### Flaky Test 阈值

- Flaky 率（flaky 测试数 / 总测试数）≤ 5%
- 超过 5% → P1 紧急处理，暂停新功能开发直到降到阈值以下

## 11. 测试所有权

### 原则

每个测试文件都有明确的"所有者"，负责该测试的维护、更新和 flaky 修复。

### 所有权分配规则

| 测试类型 | 所有者 | 职责 |
|---------|--------|------|
| Unit Tests | 编写该功能的 Codex Agent | 随功能代码同步更新 |
| Integration Tests | CTO（通过 Codex 指派） | API 变更时更新对应测试 |
| E2E Tests | CTO（通过 Codex 指派） | 业务流程变更时更新 |
| Smoke Tests | CTO | 核心健康检查，最高优先级维护 |

### CODEOWNERS 集成

测试目录已在 CODEOWNERS 中配置：
- `src/**/*.test.ts` → CTO Review
- `src/**/*.spec.ts` → CTO Review
- `e2e-monitor/tests/` → CTO Review

### 测试维护规则

1. **功能变更 = 测试变更**：修改业务逻辑的 PR 必须同步更新对应测试
2. **删除功能 = 删除测试**：功能下线时，同步清理对应测试代码
3. **测试债务跟踪**：每个 Sprint 回顾时检查测试覆盖率变化趋势
