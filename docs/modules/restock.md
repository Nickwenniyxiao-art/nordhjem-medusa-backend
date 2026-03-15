# Restock 模块

## 概述

Restock 模块负责“到货通知/补货订阅”领域能力，管理用户对商品变体的补货订阅记录，并提供去重后的订阅聚合查询用于通知任务。

## 职责范围

- 定义补货订阅实体 `restock_subscription`
- 提供订阅记录的创建、查询、删除等标准服务能力
- 提供 `getUniqueSubscriptions`，用于按 `variant_id + sales_channel_id` 聚合唯一订阅集合
- 作为补货工作流与定时任务的数据基础模块

## 对外接口

- 暴露 Service / API
  - DI Token：`RESTOCK_MODULE = "restock"`
  - Service：`RestockModuleService`
    - 标准方法：由 `MedusaService({ RestockSubscription })` 自动生成
    - 自定义方法：`getUniqueSubscriptions(context?)`
- 导出的类型
  - `UniqueSubscription`
    - `variant_id: string`
    - `sales_channel_id: string | null`

## 依赖关系

- 依赖的其他模块
  - 通过 `src/links/restock-variant.ts` 与 Product Variant 建立只读关联
  - 被工作流（如 `create-restock-subscription`、`send-restock-notifications`）调用
- 外部依赖
  - `@medusajs/framework/utils`（`Module`、`MedusaService`、`InjectManager`、`MedusaContext`、`model`）
  - `@mikro-orm/postgresql`（`EntityManager` 查询构建）

## 配置项

- 环境变量
  - 无模块专属环境变量
- 配置参数
  - 在 `medusa-config.ts` 中通过 `modules` 注册：`resolve: "./src/modules/restock"`

## 数据模型

- 核心实体/表
  - `restock_subscription`
    - 主键：`id`
    - 字段：`variant_id`、`sales_channel_id`、`email`、`customer_id`
    - 唯一索引：`IDX_RESTOCK_SUBSCRIPTION_UNIQUE`（`variant_id`, `sales_channel_id`, `email`）

## 使用示例

```ts
import { RESTOCK_MODULE } from "../../modules/restock";

const restockService = container.resolve(RESTOCK_MODULE);

await restockService.createRestockSubscriptions({
  variant_id: "variant_123",
  sales_channel_id: "sc_123",
  email: "customer@example.com",
});

const targets = await restockService.getUniqueSubscriptions();
```
