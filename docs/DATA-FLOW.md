> 项目名称: NordHjem  
> 创建日期: 2026-03-16  
> 状态: Active  
> 负责人: CTO (AI)

# DATA-FLOW

## 数据源与去向
外部数据源：
- 用户浏览器（Next.js 前端发起请求与提交结算数据）
- Stripe（支付意图、支付状态、Webhook 事件）

内部系统：
- PostgreSQL（订单、商品、客户等持久化数据）
- Redis（缓存、会话、幂等 key）

## 核心数据流
### 下单流程
1. 用户输入（商品选择、地址、支付）
2. Next.js Storefront 调用 Store API
3. Store API 进入 Medusa Core 工作流
4. Medusa Core 读写 PostgreSQL（cart/order/payment）
5. 调用 Stripe API 创建/确认支付
6. Stripe 异步回调 Webhook 到后端
7. 后端校验签名并更新订单状态（`payment_status` / `status`）

### Admin 流程
1. Admin Panel 发起管理操作
2. Admin API 鉴权后进入 Medusa Core
3. Medusa Core 执行业务逻辑并写入 PostgreSQL
4. 结果返回 Admin Panel（商品、库存、订单状态变更）

## 边界与接口
- 前后端边界：Next.js 与后端通过 Store API / Admin API 通信。
- 支付边界：后端通过 Stripe SDK/REST API 与 Stripe 交互。
- 存储边界：后端通过 MikroORM 访问 PostgreSQL，不直接拼装原生 SQL 作为主路径。

## 数据治理要求
- PII（邮箱、电话、地址）需加密存储或最小化暴露。
- 支付敏感数据不落本地数据库（仅存支付引用与状态）。
- 应用日志需脱敏处理（token、邮箱、手机号部分掩码）。
- 遵循 GDPR 删除权，支持用户数据删除与审计留痕。
