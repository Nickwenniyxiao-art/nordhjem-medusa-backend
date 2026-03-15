# Ticket 模块

## 概述

Ticket 模块负责售后工单域能力，支持工单主记录与消息记录的统一管理，为管理端售后流程、状态流转与 SLA 相关处理提供数据基础。

## 职责范围

- 定义工单实体 `ticket` 与工单消息实体 `ticket_message`
- 提供工单与消息的标准 CRUD 服务能力
- 支持工单状态、优先级、处理时效等字段管理
- 为管理端 Ticket API 与事件订阅逻辑提供统一模块服务

## 对外接口

- 暴露 Service / API
  - DI Token：`TICKET_MODULE = "ticketModuleService"`
  - Service：`TicketModuleService`（基于 `Ticket` 与 `TicketMessage`）
    - 自动方法示例：`createTickets`、`updateTickets`、`retrieveTicket`、`listTickets`、`createTicketMessages`
- 导出的类型
  - 无显式导出自定义类型（依赖 MedusaService 自动生成方法签名）

## 依赖关系

- 依赖的其他模块
  - 被 `src/api/admin/tickets/**` 等管理端接口调用
  - 与事件总线联动（例如 ticket 创建、状态变更、消息发送等事件）
- 外部依赖
  - `@medusajs/framework/utils`（`Module`、`MedusaService`、`model`）

## 配置项

- 环境变量
  - 无模块专属环境变量
- 配置参数
  - 在 `medusa-config.ts` 中通过 `modules` 注册：`resolve: "./src/modules/ticket"`

## 数据模型

- 核心实体/表
  - `ticket`
    - 主键：`id`
    - 关键字段：`order_id`、`customer_id`、`type`、`status`、`priority`、`subject`、`description`
    - 时效字段：`resolved_at`、`resolution_time_hours`、`sla_deadline`、`closed_at`
  - `ticket_message`
    - 主键：`id`
    - 关键字段：`ticket_id`、`sender_type`、`sender_id`、`body`、`metadata`

## 使用示例

```ts
import { TICKET_MODULE } from "../../modules/ticket";

const ticketService = container.resolve(TICKET_MODULE);

const ticket = await ticketService.createTickets({
  order_id: "order_123",
  type: "return",
  subject: "Need return support",
});

await ticketService.createTicketMessages({
  ticket_id: ticket.id,
  sender_type: "admin",
  body: "We have received your request.",
});
```
