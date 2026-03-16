---
项目名称: NordHjem Medusa Backend
创建日期: 2026-03-16
状态: 已发布
负责人: CTO
---

# CODE STYLE GUIDE

> 本文档定义 NordHjem Medusa Backend（Medusa v2）代码与协作规范，适用于 `src/`、`docs/` 与工程配置文件。

## 编码原则

### 1. 一致性优先

- 统一使用 TypeScript。
- 统一遵守 ESLint 与 Prettier：
  - `semi: true`
  - `singleQuote: false`
  - `trailingComma: all`
  - `printWidth: 100`
  - `tabWidth: 2`

✅ 正确（与 Prettier 一致）
```ts
const serviceName = "product-service";
const result = {
  id: "prod_123",
  active: true,
};
```

❌ 错误（单引号、缺少分号）
```ts
const serviceName = 'product-service'
const result = {
  id: 'prod_123',
  active: true
}
```

### 2. 类型安全优先

- 保持 `strictNullChecks: true` 下可编译。
- 能显式声明返回值时应声明。
- 谨慎使用 `any`（项目允许，但仅用于确实无法建模的边界场景，并需注释原因）。

✅ 正确
```ts
interface ProductSummary {
  id: string;
  title: string;
}

function toSummary(input: { id: string; title: string }): ProductSummary {
  return { id: input.id, title: input.title };
}
```

❌ 错误
```ts
function toSummary(input: any) {
  return input;
}
```

### 3. 可维护性优先

- 单一职责：函数/类只处理单一业务目标。
- 避免超长函数；推荐将复杂逻辑拆分成私有辅助函数或 workflow step。
- 不允许硬编码环境值，统一读取环境变量。

### 4. 错误处理规范

- 业务错误必须抛出语义化错误（包含可定位的信息）。
- 禁止吞错（`catch` 后无日志、无重抛）。
- API 层返回明确状态码与错误消息；内部日志保留 trace 信息。

✅ 正确
```ts
try {
  const order = await orderService.retrieve(id);
  if (!order) {
    throw new Error(`Order not found: ${id}`);
  }
  return order;
} catch (error) {
  logger.error(`Failed to retrieve order ${id}`, error);
  throw error;
}
```

❌ 错误
```ts
try {
  return await orderService.retrieve(id);
} catch (error) {
  return null;
}
```

## 命名规范

### 1. TypeScript 命名

- `interface`：用于对象结构契约，使用 `PascalCase`。
- `type`：用于联合类型、映射类型、工具类型组合，使用 `PascalCase`。
- 变量/函数：`camelCase`。
- 常量：`UPPER_SNAKE_CASE`（仅真正常量）。
- 类、模块、DTO：`PascalCase`。

✅ 正确
```ts
interface CreateCartInput {
  customerId: string;
}

type CartStatus = "open" | "completed";

const MAX_RETRY_COUNT = 3;
function createCart(input: CreateCartInput): void {}
```

❌ 错误
```ts
type create_cart_input = {
  customer_id: string;
};

const maxRetryCount = 3;
```

### 2. interface vs type 使用原则

- 优先 `interface`：
  - 领域实体输入/输出结构
  - Service 参数对象
- 优先 `type`：
  - 联合类型（如状态机）
  - 交叉类型与条件类型

### 3. Import 排序规范

按以下顺序分组，并且组间空一行：
1. Node 内置模块
2. 第三方依赖
3. 项目内模块（`src/...`）
4. 相对路径

✅ 正确
```ts
import fs from "node:fs";

import { MedusaError } from "@medusajs/framework/utils";

import { buildOrderPayload } from "src/workflows/orders/utils";

import { toAmount } from "./money";
```

❌ 错误
```ts
import { toAmount } from "./money";
import fs from "node:fs";
import { MedusaError } from "@medusajs/framework/utils";
```

### 4. 注释规范（JSDoc、TODO/FIXME）

- 对外暴露函数、复杂逻辑必须有简洁 JSDoc。
- `TODO` 必须带上下文；建议附 issue 编号。
- `FIXME` 仅用于已知缺陷，需标注影响范围。

✅ 正确
```ts
/**
 * 计算订单折扣后金额。
 * @param subtotal 原始金额（分）
 * @param discountRate 折扣率（0~1）
 */
export function calculateDiscount(subtotal: number, discountRate: number): number {
  // TODO(#194): 接入分层折扣策略后替换线性算法
  return Math.floor(subtotal * (1 - discountRate));
}
```

❌ 错误
```ts
// TODO: later
export function calculateDiscount(a: number, b: number): number {
  return a * b;
}
```

## 目录与模块规范

### 1. Medusa v2 目录约定

- Store API：`src/api/store/...`
- Admin API：`src/api/admin/...`
- Module：`src/modules/...`
- Workflows：`src/workflows/...`
- Jobs：`src/jobs/...`
- Subscribers：`src/subscribers/...`

### 2. Medusa v2 Module 结构规范

- 模块目录内按 `service`、`models`、`types` 等职责拆分。
- 通过 Medusa 容器/依赖注入获取依赖，不直接 `new` service。

✅ 正确
```ts
class BrandService {
  constructor(private readonly logger: Logger) {}
}

export default BrandService;
```

❌ 错误
```ts
const brandService = new BrandService();
```

### 3. Service 编写模式

- Service 方法命名使用动词开头（`createX`, `listX`, `updateX`）。
- 参数尽量对象化，避免位置参数失控。
- 返回值明确，不返回结构不稳定的裸对象。

### 4. API Route 约定

- 路由文件按资源划分，避免“万能路由”。
- Handler 内只做：参数校验、调用 service/workflow、返回结果。
- 复杂事务编排优先放在 workflow 层实现。

## 代码评审要求

### 1. 基础门禁

- 必须通过 lint、type-check、测试。
- 变更需与 Issue 范围一致，避免 scope creep。
- 禁止引入与任务无关的重构。

### 2. 测试规范

- 测试文件命名：`*.spec.ts` 或 `*.test.ts`，与被测模块同层或 `__tests__` 目录。
- 测试组织推荐 AAA 模式：Arrange / Act / Assert。

✅ 正确
```ts
it("creates cart successfully", async () => {
  // Arrange
  const input = { customerId: "cus_123" };

  // Act
  const cart = await service.createCart(input);

  // Assert
  expect(cart.customerId).toBe("cus_123");
});
```

❌ 错误
```ts
it("creates cart", async () => {
  const cart = await service.createCart({ customerId: "cus_123" });
  expect(cart).toBeTruthy();
});
```

### 3. Git 规范

- 分支命名：`codex/*`、`feat/*`、`fix/*`、`docs/*`、`chore/*` 等前缀。
- Commit message 必须遵循 Conventional Commits：`type(scope): description`。
- commitlint 使用 `@commitlint/config-conventional`，提交前确保格式可通过。

✅ 正确
```text
docs(standards): add CODE-STYLE-GUIDE.md (#194)
```

❌ 错误
```text
update docs
```

### 4. 自动化工具说明

- ESLint：基于 `eslint:recommended` + `@typescript-eslint/recommended` + `prettier`。
- Prettier：负责格式统一，冲突规则由 `extends: ["prettier"]` 协调。
- 建议本地执行：
  - `npm run lint`
  - `npx tsc --noEmit`
  - `npm test`

---

如需新增规范，请先在 Issue 中说明动机与影响范围，再更新本文件并在 PR 中引用。
