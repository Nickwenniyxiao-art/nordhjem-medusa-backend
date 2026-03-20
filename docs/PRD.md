---
项目名称: NordHjem
创建日期: 2026-03-16
更新日期: 2026-03-19
状态: Active
负责人: Product Manager
---

# 产品需求文档（PRD）

> 本文档定义 NordHjem 电商平台的产品需求，用于指导开发优先级和验收标准。
> 关联文档：[USER-PERSONAS.md](product/USER-PERSONAS.md) | [COMPETITIVE-ANALYSIS.md](product/COMPETITIVE-ANALYSIS.md) | [ROADMAP.md](ROADMAP.md)
> 关联 Issue: #688

---

## 1. 产品目标

### 愿景

打造 "Curated Nordic Living" — 精选北欧生活方式电商平台，面向 DK 和国际市场，提供从商品浏览到支付确认的完整购买体验，并建立可持续迭代的后台运营能力。

### 目标市场

- **主要市场**：丹麦（DKK 本地化）
- **扩展市场**：欧洲（EUR）、英国（GBP）
- **定位**：中高端精选北欧设计家具，介于 HAY（自有品牌）和 Nordic Nest（多品牌聚合）之间
- **差异化**：精选 + 设计师故事 + 极简购物体验

### 阶段目标

| 时间 | 目标 | 对应 Phase |
|------|------|-----------|
| 6 个月 | 核心购物流程 100% 可用，Stripe Live Mode 上线，月 UV 1,000 | Phase 1.5 完成 |
| 12 个月 | 多品牌扩展，i18n 上线，月 UV 5,000，月 GMV 31,250 EUR | Phase 3 推进 |

### 关键假设与约束

- 初期流量低于 1,000 DAU，峰值并发可通过基础容器规格承载
- 团队结构为单人 + AI 协作，开发与运营需高度自动化
- 预算有限，基础设施优先采用低成本方案（VPS + Docker）
- 交付优先级以"交易闭环可用"高于"高级体验增强"
- 必须满足 GDPR 基线要求（参见 PD-005, BR-004）

---

## 2. 目标用户

> 详见 [USER-PERSONAS.md](product/USER-PERSONAS.md)

| Persona | 角色 | 当前优先级 | 核心需求 |
|---------|------|-----------|---------|
| Anna (Nordic Design Enthusiast) | 北欧本地消费者 | 高 | DKK 定价、简洁购物流程、高质量产品图片 |
| James (International Decorator) | 国际消费者 | 高 | 英文界面、多币种、国际配送透明度、品牌信任 |
| Maria (Small Business Buyer) | B2B 潜在用户 | 低 | 批量询价、商业发票（当前 Out of Scope） |
| Owner/Admin | 平台运营者 | 高 | 高效 Admin Panel、自动化通知、数据看板 |

---

## 3. 用户故事

### 3.1 商品浏览（Anna, James）

| ID | 用户故事 | 优先级 | ROADMAP |
|----|---------|--------|---------|
| US-01 | As a Customer, I want to browse products by category (chairs, tables, lighting), so that I can find furniture that matches my room needs | Must | Phase 1.5 |
| US-02 | As a Customer, I want to filter products by price range and style, so that I can narrow down options within my budget | Must | Phase 1.5 |
| US-03 | As a Customer, I want to see high-quality product images with zoom, so that I can judge the design and material quality online | Must | Phase 1.5 |
| US-04 | As a Customer, I want to view detailed product specs (dimensions, materials, weight), so that I can confirm the item fits my space | Must | Phase 1.5 |
| US-05 | As a Customer, I want to search products by keyword, so that I can quickly find a specific item | Should | R-P3-05 |

### 3.2 购物车与结算（Anna, James）

| ID | 用户故事 | 优先级 | ROADMAP |
|----|---------|--------|---------|
| US-06 | As a Customer, I want to add items to my cart and adjust quantities, so that I can prepare my order before checkout | Must | Phase 1.5 |
| US-07 | As a Customer, I want to see a real-time price breakdown (subtotal, shipping, tax), so that I know the exact cost before paying | Must | R-P1-12 |
| US-08 | As a Customer, I want to enter my shipping address and select a delivery method, so that I can receive my order at the right location | Must | R-P1-12 |
| US-09 | As a Customer, I want to see prices in my local currency (DKK/EUR/GBP), so that I can understand the cost without manual conversion | Must | PD-005 |

### 3.3 支付（Anna, James）

| ID | 用户故事 | 优先级 | ROADMAP |
|----|---------|--------|---------|
| US-10 | As a Customer, I want to pay securely via Stripe (credit card), so that my payment information is protected | Must | R-P1-16 |
| US-11 | As a Customer, I want to retry payment if my first attempt fails, so that I don't lose my cart | Must | BR-006 |
| US-12 | As a Customer, I want to receive an order confirmation email after successful payment, so that I have a receipt and order reference | Must | R-P1-12 |

### 3.4 订单管理（Anna, James）

| ID | 用户故事 | 优先级 | ROADMAP |
|----|---------|--------|---------|
| US-13 | As a Customer, I want to view my order status (pending, paid, shipped), so that I know when to expect delivery | Must | R-P1-13 |
| US-14 | As a Customer, I want to cancel my order before it ships, so that I can change my mind without hassle | Must | BR-007 |
| US-15 | As a Customer, I want to request a return within 14 days of delivery, so that I can return items that don't meet expectations | Must | BR-004 |

### 3.5 用户账户（Anna, James）

| ID | 用户故事 | 优先级 | ROADMAP |
|----|---------|--------|---------|
| US-16 | As a Customer, I want to check out as a guest, so that I can buy without creating an account | Must | R-P1-15 |
| US-17 | As a Customer, I want to create an account to track orders and save my address, so that repeat purchases are faster | Should | R-P1-15 |

### 3.6 Admin 运营（Owner）

| ID | 用户故事 | 优先级 | ROADMAP |
|----|---------|--------|---------|
| US-18 | As an Admin, I want to create, edit, and delete products with images and specs, so that I can manage the catalog | Must | R-P3-02 |
| US-19 | As an Admin, I want to view and manage order statuses (confirm, ship, cancel, refund), so that I can process customer orders | Must | R-P1-13 |
| US-20 | As an Admin, I want to see inventory levels and receive low-stock alerts, so that I can restock before items sell out | Should | R-P1-19, R-P3-03 |
| US-21 | As an Admin, I want to view sales data and key metrics on a dashboard, so that I can make informed business decisions | Should | R-P1-17 |
| US-22 | As an Admin, I want to manage customer support tickets, so that I can resolve issues efficiently | Should | ticket module |
| US-23 | As an Admin, I want price changes to be audit-logged, so that pricing integrity is maintained | Must | BR-008 |

### 3.7 品牌与内容（James）

| ID | 用户故事 | 优先级 | ROADMAP |
|----|---------|--------|---------|
| US-24 | As a Customer, I want to see the brand story and designer background for each product, so that I trust the quality and authenticity | Should | R-P3-01 |
| US-25 | As a Customer, I want to browse products by brand, so that I can explore a specific designer's collection | Could | R-P3-01 |

### 3.8 SEO 与发现（James）

| ID | 用户故事 | 优先级 | ROADMAP |
|----|---------|--------|---------|
| US-26 | As a potential Customer, I want product pages to appear in Google search results, so that I can discover NordHjem through organic search | Should | R-P1-21 |
| US-27 | As a potential Customer, I want rich snippets (price, availability) in search results, so that I get key info before clicking | Should | R-P1-21 |

---

## 4. 功能清单

> 与 [FEATURE-LIST.md](FEATURE-LIST.md) 保持一致，此处补充产品视角的优先级和验收关联。

| 模块 | 子功能 | 用户对象 | MoSCoW | Phase | ROADMAP ID | 用户故事 |
|------|--------|---------|--------|-------|------------|---------|
| 商品浏览 | 列表页、详情页、筛选、搜索 | Customer | Must | 1.5 | — | US-01~05 |
| 购物车 | 加购、删改数量、价格计算 | Customer | Must | 1.5 | — | US-06 |
| 结算 | 地址、配送、税费、订单确认 | Customer | Must | 1.5 | R-P1-12 | US-07~09 |
| 支付 | Stripe 支付、回调、失败重试 | Customer/System | Must | 1.5 | R-P1-16 | US-10~12 |
| 订单管理 | 下单确认、状态流转、查询 | Customer/Admin | Must | 1.5 | R-P1-13 | US-13~15 |
| 退款 | 退款申请、处理、状态追踪 | Customer/Admin | Must | 1.5 | R-P1-14 | US-15 |
| 用户账户 | 游客下单、注册、地址管理 | Customer | Must | 1.5 | R-P1-15 | US-16~17 |
| 商品管理 | 商品 CRUD、分类、标签、图片 | Admin | Must | 1.5 | R-P3-02 | US-18 |
| 库存管理 | 库存查看、低库存告警 | Admin | Should | 1.5-3 | R-P1-19, R-P3-03 | US-20 |
| 数据分析 BI | 销售报表、关键指标看板 | Admin | Should | 1.5 | R-P1-17 | US-21 |
| 客服工单 | 工单创建、消息、SLA | Admin | Should | 1.5 | ticket module | US-22 |
| 财务管理 | 税务报表、财务数据展示 | Admin | Should | 1.5 | R-P1-18 | — |
| Admin Panel UI | 订单统计、库存报表绑定 | Admin/Owner | Must | 3 | R-P3-02 | US-18~23 |
| 多品牌 | 品牌管理、品牌切换、数据隔离 | Customer/Admin | Should | 3 | R-P3-01 | US-24~25 |
| SEO 基础 | Sitemap、结构化数据、meta | System | Should | 1.5 | R-P1-21 | US-26~27 |
| 安全合规 | Cookie Consent、GDPR 基础 | System | Must | 1.5 | R-P1-22 | — |
| 国际化 i18n | 多语言界面 | Customer | Could | 3 | R-P3-06 | — |
| 营销系统 | 促销、折扣码、邮件营销 | Admin/Customer | Could | 3 | R-P3-07 | — |
| CMS | 博客、Landing Page | Admin/Customer | Could | 3 | R-P3-08 | — |
| 自动库存 | 低库存告警、自动补货建议 | Admin/System | Could | 3 | R-P3-03 | US-20 |
| 高级 SEO | 进阶 SEO 优化 | System | Could | 3 | R-P3-05 | US-05 |

---

## 5. 非功能需求

| 类别 | 需求 | 指标 | 验证方法 |
|------|------|------|---------|
| 性能 | 关键页面加载时间 | LCP < 2.5s, 页面加载 < 3s | Lighthouse / Web Vitals |
| 可用性 | 服务正常运行时间 | 月度 >= 99.5%（SLO 目标 99.9%） | Uptime Kuma 监控 |
| 安全 | 支付链路加密 | HTTPS 全链路，Stripe PCI 合规 | 安全扫描（Semgrep, Trivy） |
| 安全 | 基础防护 | XSS/CSRF 防护，最小权限访问 | Semgrep 规则 + Code Review |
| 合规 | GDPR | 最小化采集、可追踪同意、用户数据删除流程 | GDPR checklist（R-P1-22） |
| 监控 | 错误追踪 | Sentry 错误率监控 + 性能指标 | Sentry Dashboard |
| 监控 | 告警 | 关键事件 Telegram 推送 | Telegram Bot（R-P2-02） |
| 备份 | 数据库备份 | 部署前自动 pg_dump | CD pipeline（R-P0-02） |

---

## 6. 验收标准

### 6.1 商品浏览

- [ ] AC-01: 用户可按分类浏览商品列表，每页显示产品卡片（图片、名称、价格）
- [ ] AC-02: 用户可按价格区间筛选商品
- [ ] AC-03: 产品详情页显示图片（可放大）、名称、价格、描述、规格（尺寸、材质、重量）
- [ ] AC-04: 价格根据用户 Region 显示对应币种（DKK/EUR/GBP）

### 6.2 购物车

- [ ] AC-05: 用户可将商品加入购物车
- [ ] AC-06: 用户可修改购物车商品数量或删除商品
- [ ] AC-07: 购物车实时显示小计、预估运费和税费

### 6.3 结算

- [ ] AC-08: 用户可输入配送地址并选择配送方式
- [ ] AC-09: 结算页面显示完整价格明细（商品小计 + 运费 + 税费 = 总计）
- [ ] AC-10: 订单确认前用户可查看所有订单信息并确认

### 6.4 支付

- [ ] AC-11: 用户可通过 Stripe 完成信用卡支付
- [ ] AC-12: 支付成功后订单状态从 `pending` 变为 `paid`（BR-005）
- [ ] AC-13: 支付失败时用户可重试，3 次失败后自动取消会话（BR-006）
- [ ] AC-14: 支付成功后用户收到订单确认邮件（Resend）
- [ ] AC-15: 订单最低支付金额为 1.00（BR-001）

### 6.5 订单管理

- [ ] AC-16: 用户可查看订单状态（pending, paid, shipped, delivered, cancelled）
- [ ] AC-17: 用户可在未发货状态前取消订单（BR-007）
- [ ] AC-18: 用户可在签收后 14 天内申请退货（BR-004）
- [ ] AC-19: 超卖场景自动退款并发送通知

### 6.6 用户账户

- [ ] AC-20: 用户可以游客身份完成下单流程
- [ ] AC-21: 用户可注册账户，保存地址和查看历史订单

### 6.7 Admin 运营

- [ ] AC-22: Admin 可创建/编辑/删除商品（含图片上传）
- [ ] AC-23: Admin 可查看订单列表并更新订单状态（确认/发货/取消/退款）
- [ ] AC-24: Admin 可查看库存水平
- [ ] AC-25: Admin 手动改价时系统记录审计日志（BR-008）
- [ ] AC-26: 库存低于阈值时系统发送告警通知（restock module）

### 6.8 SEO 与合规

- [ ] AC-27: 所有产品页有正确的 meta title/description
- [ ] AC-28: Sitemap 自动生成并提交给搜索引擎
- [ ] AC-29: 产品页包含 JSON-LD 结构化数据（Product schema）
- [ ] AC-30: 网站显示 Cookie Consent 弹窗，用户可选择接受/拒绝

---

## 7. 优先级排序

### MoSCoW 矩阵

| 级别 | 功能 | 说明 |
|------|------|------|
| **Must** | 商品浏览、购物车、结算、支付、订单管理、退款、用户账户、商品管理、安全合规 | 交易闭环必需，Phase 1.5 完成 |
| **Should** | 库存管理、BI 看板、客服工单、SEO 基础、多品牌、Admin Panel 完善 | 运营效率提升，Phase 1.5-3 |
| **Could** | i18n、营销系统、CMS、高级 SEO、自动库存 | 增长功能，Phase 3 |
| **Won't (this year)** | B2B 批发、线下 POS、自建物流、社交电商、直播 | 明确 Out of Scope |

### 依赖关系

```
支付(Stripe) ← 结算 ← 购物车 ← 商品浏览
    ↓
订单管理 ← 退款
    ↓
Admin Panel（订单/库存/报表）
    ↓
BI 看板(Metabase) ← 数据积累

多品牌(R-P3-01) ← brand module 已实现
自动库存(R-P3-03) ← 库存管理(R-P1-19) 完成
高级 SEO(R-P3-05) ← SEO 基础(R-P1-21) 完成
```

### 关键阻塞项

| 阻塞项 | 影响范围 | 状态 |
|--------|---------|------|
| Stripe Live Mode 上线 | 结算(R-P1-12)、支付(R-P1-16)、退款(R-P1-14) | 等待中 |
| Metabase 数据绑定 | BI 看板(R-P1-17) | 进行中(88%) |
| Admin Panel 数据绑定 | 订单统计/库存报表(R-P1-20) | 进行中(60%) |

---

## 8. 成功指标

> 基于 [COMPETITIVE-ANALYSIS.md](product/COMPETITIVE-ANALYSIS.md) 竞品基准（估算值，需后续实际数据验证）。

| 指标 | 6 个月目标 | 12 个月目标 | 衡量方式 |
|------|-----------|------------|---------|
| 月访客 (UV) | 1,000 | 5,000 | Google Analytics |
| 转化率 | 1.5% | 2.5% | 订单数 / UV |
| 平均客单价 | 200 EUR | 250 EUR | GMV / 订单数 |
| 月 GMV | 3,000 EUR | 31,250 EUR | Stripe 报表 |
| 购物车放弃率 | < 75% | < 70% | 加购 vs 完成支付 |
| 支付成功率 | > 90% | > 95% | Stripe Dashboard |
| 订单确认邮件送达率 | > 95% | > 99% | Resend 报表 |
| 退货率 | < 15% | < 10% | 退货数 / 订单数 |
| 页面加载 (LCP) | < 3.0s | < 2.5s | Lighthouse |
| 月可用性 | >= 99.5% | >= 99.9% | Uptime Kuma |

---

## 9. Out of Scope

> 引用自 [PROJECT-SCOPE.md](PROJECT-SCOPE.md)，以下内容明确不在当前项目范围内：

- 线下门店管理与 POS 系统
- 自建物流系统（使用第三方履约或手工履约流程）
- B2B 批发分销体系（Persona Maria 的需求暂不满足）
- 社交电商闭环（站内直播/短视频带货）
- 直播卖货与达人联盟体系
- 移动端原生 App（当前使用响应式 Web）
- 用户评论/评分系统（Phase 4+ 考虑）
- 忠诚度积分系统（Phase 4+ 考虑）

---

## 10. 术语表

| 术语 | 定义 |
|------|------|
| Region | Medusa 中的地区概念，定义币种、税率和配送规则的组合（如 DK Region = DKK + 丹麦税率） |
| Sales Channel | Medusa 中的销售渠道，区分不同的店面或平台（如 Web Storefront） |
| Brand | 自定义模块（`src/modules/brand`），管理品牌信息并关联 Sales Channel |
| Restock | 自定义模块（`src/modules/restock`），监控库存并在缺货时触发补货通知 |
| Ticket | 自定义模块（`src/modules/ticket`），管理客服工单和消息记录 |
| Payment Intent | Stripe 中的支付意图对象，表示一次支付尝试 |
| Webhook | Stripe 通过 HTTP 回调通知支付状态变更的机制 |
| LCP | Largest Contentful Paint，衡量页面主要内容加载完成的时间 |
| DTC | Direct-to-Consumer，品牌直接面向消费者销售 |
| MoSCoW | 优先级排序方法：Must / Should / Could / Won't |
