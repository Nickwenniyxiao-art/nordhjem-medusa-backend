> 项目名称: NordHjem  
> 创建日期: 2026-03-16  
> 状态: Active  
> 负责人: CTO (AI)

# DATABASE-SCHEMA

## 数据模型概览
Medusa.js v2 核心实体关系可按以下主链路理解：
- **Product → ProductVariant → MoneyAmount**：商品（SPU）下挂变体（SKU），每个变体可按 Region/Currency 绑定价格金额。
- **Cart → LineItem**：购物车作为会话聚合根，行项目记录所选变体、数量、单价和折扣快照。
- **Order → Fulfillment → Payment**：订单在完成结算后关联履约记录（发货、追踪）与支付记录（授权、捕获、退款）。
- **Customer → Address**：客户主档关联账单与收货地址，支持多地址管理。
- **Region → Currency**：区域定义税务/配送上下文，并绑定默认结算货币。

## 表结构定义
核心表及关键字段（示例）如下：
- `product`
  - `id` (PK)
  - `title`, `subtitle`, `handle`, `description`
  - `status`, `created_at`, `updated_at`, `deleted_at`
- `product_variant`
  - `id` (PK)
  - `product_id` (FK -> `product.id`)
  - `title`, `sku`, `barcode`, `inventory_quantity`
  - `created_at`, `updated_at`, `deleted_at`
- `money_amount`
  - `id` (PK)
  - `variant_id` (FK -> `product_variant.id`)
  - `region_id` (FK -> `region.id`, nullable)
  - `currency_code` (FK -> `currency.code`)
  - `amount`, `min_quantity`, `max_quantity`
- `cart`
  - `id` (PK)
  - `customer_id` (FK -> `customer.id`, nullable)
  - `region_id` (FK -> `region.id`)
  - `currency_code`, `email`, `completed_at`, `deleted_at`
- `line_item`
  - `id` (PK)
  - `cart_id` (FK -> `cart.id`, nullable)
  - `order_id` (FK -> `order.id`, nullable)
  - `variant_id` (FK -> `product_variant.id`)
  - `quantity`, `unit_price`, `subtotal`
- `order`
  - `id` (PK)
  - `cart_id` (FK -> `cart.id`)
  - `customer_id` (FK -> `customer.id`, nullable)
  - `region_id` (FK -> `region.id`)
  - `status`, `payment_status`, `fulfillment_status`, `total`, `deleted_at`
- `payment`
  - `id` (PK)
  - `order_id` (FK -> `order.id`, nullable)
  - `cart_id` (FK -> `cart.id`, nullable)
  - `provider_id`, `amount`, `currency_code`, `captured_at`
- `customer`
  - `id` (PK)
  - `email` (unique), `first_name`, `last_name`, `phone`, `has_account`
  - `created_at`, `updated_at`, `deleted_at`
- `address`
  - `id` (PK)
  - `customer_id` (FK -> `customer.id`)
  - `first_name`, `last_name`, `address_1`, `city`, `country_code`, `postal_code`
- `region`
  - `id` (PK)
  - `name`, `currency_code` (FK -> `currency.code`), `tax_rate`
- `currency`
  - `code` (PK)
  - `symbol`, `symbol_native`, `name`, `includes_tax`

## 索引与约束
- 主键：所有核心表使用 `id` 或 `code` 作为主键。
- 外键：
  - `product_variant.product_id` -> `product.id`
  - `line_item.variant_id` -> `product_variant.id`
  - `order.customer_id` -> `customer.id`
  - `money_amount.currency_code` -> `currency.code`
- 唯一索引：
  - `product.handle` 全局唯一（避免重复路由）
  - `customer.email` 唯一（账号系统）
  - `product_variant.sku` 唯一（库存与 ERP 对接）
- 查询索引建议：
  - `line_item(cart_id)`、`line_item(order_id)`
  - `order(created_at)`、`order(status, payment_status)`
  - `product(status, deleted_at)`
- 软删除：统一使用 `deleted_at`；业务查询默认过滤 `deleted_at IS NULL`。

## 演进策略
- 所有 schema 变更必须通过 Medusa Migration（`npx medusa db:migrate`）管理。
- 严禁手动在数据库执行不可追踪的 DDL（如直接 `ALTER TABLE`）作为长期方案。
- 每次结构变更需新增 ADR，记录背景、方案、风险与回滚策略。
- 变更前后必须执行：类型检查、迁移校验、回滚演练（至少在 staging 环境）。
