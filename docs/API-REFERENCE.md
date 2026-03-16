> 项目名称: NordHjem  
> 创建日期: 2026-03-16  
> 状态: Active  
> 负责人: CTO (AI)

# API-REFERENCE

## API 概览
NordHjem 后端基于 Medusa.js v2，提供两类 API：
- **Store API**：公开接口，面向顾客端（Next.js Storefront）。
- **Admin API**：受保护接口，面向运营后台与自动化工具。

基础 URL 格式：
- Store: `https://<host>/store/...`
- Admin: `https://<host>/admin/...`

## 认证与授权
- **Store API**：使用 Publishable API Key（`x-publishable-api-key`）进行客户端访问控制。
- **Admin API**：使用 Bearer Token（JWT）进行授权，Header：`Authorization: Bearer <token>`。
- **Cookie-based session**：后台控制台登录后可使用会话 Cookie 执行受保护操作。

## 接口定义
### Store API（核心端点）
- `GET /store/products`：获取商品列表（支持分页、过滤、排序）。
- `GET /store/products/:id`：获取商品详情与变体信息。
- `POST /store/carts`：创建购物车。
- `POST /store/carts/:id/line-items`：向购物车添加商品变体。
- `POST /store/carts/:id`：更新购物车信息（地址、邮箱等）。
- `POST /store/carts/:id/complete`：完成订单（触发支付与订单创建）。

### Admin API（核心端点）
- `GET /admin/products`：查询商品列表。
- `POST /admin/products`：创建商品。
- `POST /admin/products/:id`：更新商品。
- `GET /admin/orders`：查询订单列表。
- `GET /admin/orders/:id`：查询订单详情。
- `POST /admin/orders/:id/cancel`：取消订单。

## 错误码规范
- `400 Bad Request`：参数非法、缺少必填字段。
- `401 Unauthorized`：认证信息缺失或失效。
- `404 Not Found`：资源不存在。
- `409 Conflict`：业务冲突（如库存不足、状态冲突）。
- `500 Internal Server Error`：服务端未处理异常。

## 示例请求响应
### 示例 1：获取商品列表
**Request**
```http
GET /store/products?limit=2 HTTP/1.1
Host: api.nordhjem.com
x-publishable-api-key: pk_test_xxx
```

**Response**
```json
{
  "products": [
    {
      "id": "prod_01",
      "title": "Nordic Oak Chair",
      "handle": "nordic-oak-chair",
      "variants": [
        { "id": "variant_01", "title": "Natural / Standard" }
      ]
    },
    {
      "id": "prod_02",
      "title": "Linen Lounge Sofa",
      "handle": "linen-lounge-sofa",
      "variants": [
        { "id": "variant_02", "title": "Grey / 3-Seater" }
      ]
    }
  ],
  "count": 24,
  "offset": 0,
  "limit": 2
}
```

### 示例 2：创建购物车
**Request**
```http
POST /store/carts HTTP/1.1
Host: api.nordhjem.com
Content-Type: application/json
x-publishable-api-key: pk_test_xxx

{
  "region_id": "reg_eu",
  "currency_code": "eur"
}
```

**Response**
```json
{
  "cart": {
    "id": "cart_123",
    "region_id": "reg_eu",
    "currency_code": "eur",
    "email": null,
    "items": [],
    "total": 0
  }
}
```

### 示例 3：完成订单
**Request**
```http
POST /store/carts/cart_123/complete HTTP/1.1
Host: api.nordhjem.com
Content-Type: application/json
x-publishable-api-key: pk_test_xxx

{}
```

**Response**
```json
{
  "type": "order",
  "order": {
    "id": "order_456",
    "status": "pending",
    "payment_status": "awaiting",
    "fulfillment_status": "not_fulfilled",
    "total": 129900,
    "currency_code": "eur"
  }
}
```
