# API-DESIGN — NordHjem API 设计规范

> 项目名称: NordHjem
> 创建日期: 2026-03-20
> 状态: Active
> 负责人: Backend Lead

本文档定义 NordHjem 后端 API 的设计规范与约定。基于 Medusa v2 框架的实际实现提取，分为**当前模式**（descriptive，描述现状）和**目标模式**（prescriptive，规定标准）。

与 `docs/API-REFERENCE.md` 互补：REFERENCE 描述"有哪些端点"，本文档描述"如何设计端点"。

---

## 1. RESTful 约定

### 1.1 命名空间

| 前缀 | 面向 | 认证方式 | 用途 |
|------|------|---------|------|
| `/store/*` | 顾客端（Storefront） | Publishable API Key + Customer session/bearer | 商品浏览、购物车、结算、账户管理 |
| `/admin/*` | 运营后台 | Admin User session/bearer | 商品管理、订单管理、数据分析、系统配置 |
| `/health` | 监控系统 | 无认证 | 服务健康检查 |
| `/hooks/*` | 外部服务回调 | Webhook signature 验证 | Stripe 等第三方回调 |

### 1.2 URL 命名规则

**当前模式 & 目标模式（一致）：**

- 资源名使用**复数名词**，小写，连字符分隔：`/admin/gift-cards`、`/admin/audit-log`
- 单个资源使用动态路由参数：`/admin/brands/[id]`
- 嵌套资源表达从属关系：`/admin/orders/[id]/notes`、`/admin/tickets/[id]/messages`
- 批量操作使用 `/batch` 子路由：`/admin/orders/batch`、`/admin/inventory/batch`
- 特殊动作使用描述性子路由：`/admin/products/[id]/ai-generate`、`/store/me/change-email`
- 统计/聚合端点使用 `/stats` 或语义化名称：`/admin/orders/stats`、`/admin/analytics/sales-summary`
- 导出端点使用 `/export`：`/admin/orders/export`、`/admin/finance/export`

### 1.3 HTTP 方法语义

| 方法 | 语义 | 幂等 | 示例 |
|------|------|------|------|
| GET | 查询资源（列表或单个） | 是 | `GET /admin/brands` |
| POST | 创建资源或执行动作 | 否 | `POST /admin/brands`、`POST /store/me/change-email` |
| PATCH | 部分更新资源 | 是 | `PATCH /admin/brands/[id]` |
| DELETE | 删除资源 | 是 | `DELETE /admin/brands/[id]`、`DELETE /store/me`（账户注销） |

**注意：** 当前项目不使用 PUT（全量替换），统一使用 PATCH 进行更新。

---

## 2. 版本策略

### 2.1 当前状态

- 无 URL 路径版本前缀（非 `/v1/store/*`）
- Health 端点包含 `API_VERSION: "1.0.0"` 常量（`src/api/health/route.ts:23`）
- 无 Header-based 版本协商
- Stripe SDK 使用显式 `apiVersion: "2026-02-25.clover"`

### 2.2 目标模式

在 Phase 1（核心商业功能开发）阶段，暂不引入 API 版本前缀。演进策略：

| 策略 | 适用场景 | 优缺点 |
|------|---------|--------|
| **向后兼容演进**（当前） | Phase 1-2，API 仍在快速迭代 | 简单，无版本管理开销；但破坏性变更需协调前端 |
| **Header-based 版本**（推荐 Phase 3+） | API 稳定后，需支持多版本客户端 | 灵活，URL 不变；需中间件路由 |
| **URL 前缀版本**（备选） | 公开 API 或第三方集成 | 直观；但 URL 膨胀 |

**向后兼容规则（立即生效）：**
- 新增字段：可以在响应中新增字段，不影响现有客户端
- 删除字段：必须先标记 deprecated，至少保留一个发布周期
- 修改字段类型：禁止，必须新增字段替代
- URL 变更：禁止修改已发布的端点 URL，需新增端点 + 旧端点标记 deprecated

> **需 CTO 决策：** Phase 3 版本策略选型（Header vs URL prefix）

---

## 3. 认证方式

### 3.1 认证模式

基于 Medusa v2 的 `authenticate()` 中间件，在 `src/api/middlewares.ts` 统一配置。

| 端点类型 | 认证函数 | 策略 | 备注 |
|---------|---------|------|------|
| Admin API | `authenticate("user", ["bearer", "session"])` | JWT Bearer 或 Session Cookie | 管理员登录后获取 |
| Store 受保护端点 | `authenticate("customer", ["bearer", "session"])` | 顾客 JWT 或 Session | 账户相关操作 |
| Store 可选认证 | `authenticate("customer", [...], { allowUnauthenticated: true })` | 可匿名访问 | 补货订阅、订单追踪 |
| Webhook | 无 Medusa 认证 | Stripe Signature 手动验证 | `stripe-signature` Header |
| Health | 无认证 | 公开 | 监控探针 |

### 3.2 认证 Header

```
# Admin API
Authorization: Bearer <admin_jwt_token>
Cookie: connect.sid=<session_id>

# Store API（需认证端点）
Authorization: Bearer <customer_jwt_token>
Cookie: connect.sid=<session_id>

# Store API（Publishable Key，所有请求）
x-publishable-api-key: <publishable_key>

# Webhook
stripe-signature: <signature_string>
```

### 3.3 目标模式

**输入验证规范：**

当前仅 1 个端点使用 Zod 验证（`POST /store/restock-subscriptions` 使用 `validateAndTransformBody`）。

**目标：** 所有接受请求体的 POST/PATCH 端点应使用 `validateAndTransformBody` + Zod schema：
- 在 `src/api/<namespace>/<resource>/validators.ts` 定义 schema
- 在 `src/api/middlewares.ts` 注册验证中间件

---

## 4. 错误码规范

### 4.1 当前模式（不一致）

当前错误响应存在两种格式：

| 格式 | 使用次数 | 示例 | 使用位置 |
|------|---------|------|---------|
| `{ error: "..." }` | ~139 处 | `{ error: "Failed to list tickets" }` | tickets、payments、security、inventory 等 |
| `{ message: "..." }` | ~25 处 | `{ message: "name is required" }` | brands、gift-cards、store 端点 |

### 4.2 目标模式（标准化）

统一使用以下错误响应结构：

```json
{
  "type": "invalid_request",
  "message": "Human-readable error description",
  "code": "VALIDATION_ERROR"
}
```

**标准错误类型：**

| HTTP 状态码 | type | 使用场景 | 当前使用次数 |
|------------|------|---------|------------|
| 400 | `invalid_request` | 请求参数错误、验证失败 | 61 处 |
| 401 | `unauthorized` | 未认证或认证过期 | 14 处 |
| 403 | `forbidden` | 无权限访问 | 2 处 |
| 404 | `not_found` | 资源不存在 | 21 处 |
| 409 | `conflict` | 资源冲突（重复创建等） | 1 处 |
| 500 | `internal_error` | 服务器内部错误 | 65 处 |

**错误码注册表（按模块）：**

| 模块 | 错误码前缀 | 示例 |
|------|-----------|------|
| brands | `BRAND_` | `BRAND_NOT_FOUND`、`BRAND_NAME_REQUIRED` |
| orders | `ORDER_` | `ORDER_NOT_FOUND`、`ORDER_INVALID_STATUS` |
| tickets | `TICKET_` | `TICKET_NOT_FOUND`、`TICKET_INVALID_TRANSITION` |
| payments | `PAYMENT_` | `PAYMENT_STRIPE_NOT_CONFIGURED`、`PAYMENT_RECONCILIATION_FAILED` |
| inventory | `INVENTORY_` | `INVENTORY_INSUFFICIENT_STOCK` |
| auth | `AUTH_` | `AUTH_MISSING_SIGNATURE`、`AUTH_INVALID_TOKEN` |

> **迁移计划：** 新端点必须使用标准化格式。现有端点在下次修改时逐步迁移。

---

## 5. 分页规范

### 5.1 请求参数

| 参数 | 类型 | 默认值 | 上限 | 说明 |
|------|------|-------|------|------|
| `limit` | number | 20 | 100 | 每页返回数量 |
| `offset` | number | 0 | — | 跳过记录数 |

```
GET /admin/brands?limit=10&offset=20
```

### 5.2 响应结构

**当前模式（不一致）：** 资源 key 使用资源名复数：

```json
// GET /admin/brands
{ "brands": [...], "count": 50, "limit": 10, "offset": 0 }

// GET /admin/orders
{ "orders": [...], "count": 120, "limit": 20, "offset": 0 }
```

**目标模式：** 保持资源名 key 的模式（与 Medusa v2 官方 API 一致），但确保 4 个分页字段齐全：

```json
{
  "<resource_plural>": [...],
  "count": 50,
  "limit": 10,
  "offset": 0
}
```

**规则：**
- `count` 必须返回**过滤后的总数**（不是当前页数量）
- `limit` 和 `offset` 必须回显请求参数（便于客户端分页计算）
- 客户端判断是否有下一页：`offset + limit < count`

---

## 6. 排序与过滤

### 6.1 排序

| 参数 | 类型 | 默认值 | 说明 |
|------|------|-------|------|
| `sort_by` | string | `created_at` | 排序字段（仅允许白名单字段） |
| `sort_order` | `asc` \| `desc` | `desc` | 排序方向 |

**安全要求：** 排序字段必须使用白名单验证，禁止直接拼接用户输入到 SQL ORDER BY。

当前实现示例（`src/api/admin/orders/route.ts:11`）：
```typescript
const sortBy = query.sort_by === "total" ? "total" : "created_at";
const sortOrder = String(query.sort_order || "desc").toLowerCase() === "asc" ? "ASC" : "DESC";
```

### 6.2 过滤

**日期范围过滤：**

| 参数 | 格式 | 语义 |
|------|------|------|
| `date_from` | ISO 8601 date | `created_at >= date_from` |
| `date_to` | ISO 8601 date | `created_at < date_to + 1 day`（包含当天） |

**枚举过滤：** 使用白名单验证，例如 `status` 参数仅接受预定义的允许值列表。

**安全要求：** 所有过滤参数必须使用参数化查询（`?` 占位符），禁止字符串拼接。当前所有 raw SQL 查询已正确使用参数化（已验证）。

---

## 7. 安全要求

### 7.1 输入验证

| 层级 | 机制 | 当前覆盖率 | 目标 |
|------|------|-----------|------|
| 中间件层 | `validateAndTransformBody` (Zod) | 1/74 端点 | 所有 POST/PATCH 端点 |
| 路由层 | 手动 `if (!body.field)` 检查 | 大部分端点 | 逐步迁移到 Zod |
| 数据库层 | 参数化查询（`?` 占位符） | 所有 raw SQL | 保持 |

### 7.2 SQL 安全

所有使用 `pgConnection.raw()` 的端点必须：
- 使用 `?` 占位符进行参数化
- 排序字段使用白名单映射（非直接拼接）
- 字符串过滤使用 allowlist 验证

### 7.3 审计日志

`adminAuditLogMiddleware` 覆盖所有 `/admin/*` 的 POST/PATCH/DELETE 请求，自动记录：
- 操作者身份
- 请求方法和路径
- 时间戳

### 7.4 Webhook 安全

Stripe webhook 端点（`/store/stripe-events`）使用 `stripe.webhooks.constructEvent()` 验证签名，拒绝无效请求并记录 IP。

---

## 8. 响应格式约定

### 8.1 成功响应

| 操作 | 状态码 | 响应结构 |
|------|-------|---------|
| 查询列表 | 200 | `{ <resources>: [...], count, limit, offset }` |
| 查询单个 | 200 | `{ <resource>: { ... } }` |
| 创建资源 | 200 | `{ <resource>: { ... } }` |
| 更新资源 | 200 | `{ <resource>: { ... } }` |
| 删除资源 | 200 | `{ success: true }` 或 `{ message: "..." }` |
| 异步操作 | 202 | `{ message: "...", id: "..." }` |

> **注意：** 当前创建操作返回 200 而非 201。目标模式中新端点应使用 201 Created。

### 8.2 Health 端点

```json
{
  "status": "ok",
  "timestamp": "2026-03-20T00:00:00.000Z",
  "version": "1.0.0",
  "checks": {
    "database": "ok",
    "redis": "ok"
  }
}
```

状态码：200（健康）或 503（异常）。

---

## 附录 A：当前不一致项汇总

| 项目 | 现状 | 目标 | 优先级 |
|------|------|------|-------|
| 错误响应 key | `error` (139处) vs `message` (25处) | 统一为 `{ type, message, code }` | Medium |
| 创建操作状态码 | 全部返回 200 | 新端点使用 201 | Low |
| 输入验证 | 1/74 端点使用 Zod | 所有 POST/PATCH 端点 | High |
| 分页响应 | 大部分一致，个别缺少 limit/offset 回显 | 4 字段齐全 | Low |

---

## 附录 B：端点总览

| 命名空间 | 端点数量 | 功能域 |
|---------|---------|-------|
| `/admin/*` | 54 | 品牌、订单、库存、财务、分析、安全、工单、支付、Webhook |
| `/store/*` | 19 | 品牌、购物车、结算、账户、支付、补货订阅、Stripe 回调 |
| `/health` | 1 | 服务健康检查 |
| **总计** | **74** | |
