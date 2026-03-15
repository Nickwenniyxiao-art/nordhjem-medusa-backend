# Brand 模块

## 概述

Brand 模块负责 NordHjem 的品牌领域数据管理，维护品牌基础信息并作为品牌与销售渠道等域对象关联的锚点。

## 职责范围

- 定义品牌实体（名称、slug、品牌视觉信息、站点域名等）
- 提供基于 MedusaService 的品牌数据 CRUD 能力
- 作为 `src/links/brand-sales-channel.ts` 的 linkable 端，支持品牌与销售渠道关联
- 通过模块入口向依赖方暴露统一 DI token（`brandModuleService`）

## 对外接口

- 暴露 Service / API
  - DI Token：`BRAND_MODULE = "brandModuleService"`
  - Service：`BrandModuleService`（继承 `MedusaService`，针对 `Brand` 模型自动生成标准数据访问方法）
- 导出的类型
  - 无显式导出自定义 TypeScript 类型（主要依赖 Medusa 自动推导实体与服务方法类型）

## 依赖关系

- 依赖的其他模块
  - 通过 links 与 Medusa Sales Channel 模块建立关联（`Brand ↔ SalesChannel`）
- 外部依赖
  - `@medusajs/framework/utils`（`Module`、`MedusaService`、`model`）

## 配置项

- 环境变量
  - 无模块专属环境变量
- 配置参数
  - 在 `medusa-config.ts` 中通过 `modules` 注册：`resolve: "./src/modules/brand"`

## 数据模型

- 核心实体/表
  - `brand`
    - 主键：`id`
    - 关键字段：`name`、`slug`、`logo_url`、`primary_color`、`domain`、`metadata`

## 使用示例

```ts
import { BRAND_MODULE } from "../../modules/brand";

const brandService = container.resolve(BRAND_MODULE);

const brand = await brandService.createBrands({
  name: "NordHjem",
  slug: "nordhjem",
  primary_color: "#2C3E2D",
});

const brands = await brandService.listBrands({});
```
