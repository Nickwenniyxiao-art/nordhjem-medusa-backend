# Resend Notification 模块

## 概述

Resend Notification 模块是 NordHjem 的邮件通知提供器实现，基于 Resend API 对接 Medusa Notification 模块，负责模板分发、邮件发送与日志记录。

## 职责范围

- 实现 `AbstractNotificationProviderService`，注册 provider 标识 `resend-notification`
- 处理 email 渠道发送逻辑（不支持非 email channel）
- 根据模板名渲染 HTML 内容并发送通知
- 在发送失败时记录错误日志并抛出异常

## 对外接口

- 暴露 Service / API
  - Provider Identifier：`resend-notification`
  - Service：`ResendNotificationProviderService`
    - `send(notification)`：发送通知，返回 `{ id }`
- 导出的类型
  - `ResendNotificationConfig`：`apiKey`、`fromEmail`、`replyToEmail?`
  - `SendNotificationInput`：`to`、`channel`、`template`、`data`
  - `SendNotificationResult`：`id`

## 依赖关系

- 依赖的其他模块
  - 挂载在 Medusa 官方通知模块 `@medusajs/medusa/notification` 的 providers 配置中
  - 被工作流与事件处理流程用于发送业务通知
- 外部依赖
  - `@medusajs/framework/utils`（`AbstractNotificationProviderService`）
  - `@medusajs/framework/types`（`Logger`）
  - `resend` SDK（邮件发送）

## 配置项

- 环境变量
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`（缺省：`NordHjem <noreply@nordhjem.store>`）
  - `RESEND_REPLY_TO`（缺省：`support@nordhjem.store`）
- 配置参数
  - 在 `medusa-config.ts` 的 notification provider 中配置：
    - `channels: ["email"]`
    - `resolve: "./src/modules/resend-notification"`
    - `id: "resend-notification"`

## 数据模型

- 核心实体/表
  - 无（该模块不定义数据库模型，仅作为通知 provider）

## 使用示例

```ts
const notificationProvider = container.resolve("resend-notification");

await notificationProvider.send({
  to: "customer@example.com",
  channel: "email",
  template: "order-confirmation",
  data: {
    subject: "Your order is confirmed",
    order: { display_id: "1001", items: [] },
  },
});
```
