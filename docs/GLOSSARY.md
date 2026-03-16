---
项目名称: NordHjem
创建日期: 2026-03-16
状态: Active
负责人: CTO (AI)
---

# 术语表

## 术语清单

| 术语 | 英文 | 定义 |
| --- | --- | --- |
| 商店 API | Store API | 面向前台用户的接口集合，用于浏览与下单。 |
| 管理 API | Admin API | 面向后台运营管理的接口集合。 |
| 区域 | Region | 定义国家/地区、币种、税费与配送规则的业务单元。 |
| 产品变体 | Product Variant | 同一商品下的规格组合（如颜色、尺寸）。 |
| 销售渠道 | Sales Channel | 控制商品在哪些渠道可售。 |
| 商品 | Product | 可售卖的核心实体，包含标题、描述、价格等。 |
| SKU | Stock Keeping Unit | 库存最小管理单元，对应具体变体。 |
| 购物车 | Cart | 用户临时保存待结算商品的容器。 |
| 结算 | Checkout | 从购物车到支付确认的流程。 |
| 履约 | Fulfillment | 订单拣货、打包、发货与配送流程。 |
| 支付意图 | Payment Intent | Stripe 中表示一次支付尝试的对象。 |
| 订单 | Order | 支付与购买行为确认后的业务记录。 |
| 退款 | Refund | 对已支付订单进行金额返还的操作。 |
| 库存 | Inventory | 商品可售数量与库存可用性管理。 |
| 价格表 | Price List | 按地区/渠道定义的价格策略集合。 |
| 多币种 | Multi-currency | 支持多个货币展示与结算能力。 |
| 多地区 | Multi-region | 支持不同国家/地区规则的能力。 |
| 服务端渲染 | SSR | Server-Side Rendering，请求时在服务端生成页面。 |
| 静态站点生成 | SSG | Static Site Generation，构建时预生成页面。 |
| 持续集成 | CI | Continuous Integration，自动构建与测试。 |
| 持续交付 | CD | Continuous Delivery/Deployment，自动发布流程。 |
| 拉取请求 | PR | Pull Request，用于代码审查与合并。 |
| 端到端测试 | E2E | End-to-End Test，模拟用户全流程测试。 |
| DORA 指标 | DORA Metrics | 衡量工程效能的四项核心指标。 |
| 服务等级协议 | SLA | Service Level Agreement，服务承诺协议。 |
| 服务等级目标 | SLO | Service Level Objective，可量化服务目标。 |
| 服务等级指标 | SLI | Service Level Indicator，衡量服务质量的指标。 |
| 执行保障协议 | EGP | Execution Guarantee Protocol，任务追溯治理机制。 |
| 架构决策记录 | ADR | Architecture Decision Record，记录架构决策。 |
| 通用数据保护条例 | GDPR | 欧盟个人数据保护法规。 |
| 预发布环境 | Staging | 用于上线前验证的环境。 |
| 生产环境 | Production | 面向真实用户的正式运行环境。 |
| Webhook | Webhook | 外部系统事件回调通知机制。 |
| 可观测性 | Observability | 通过日志、指标、追踪理解系统状态的能力。 |
| 蓝绿发布 | Blue-Green Deployment | 双环境切换的低风险发布策略。 |

## 缩略语

| 缩写 | 全称 |
| --- | --- |
| API | Application Programming Interface |
| CI | Continuous Integration |
| CD | Continuous Delivery / Continuous Deployment |
| PR | Pull Request |
| E2E | End-to-End |
| SSR | Server-Side Rendering |
| SSG | Static Site Generation |
| GDPR | General Data Protection Regulation |
| DORA | DevOps Research and Assessment |
| SLA | Service Level Agreement |
| SLO | Service Level Objective |
| SLI | Service Level Indicator |
| SKU | Stock Keeping Unit |
| MVP | Minimum Viable Product |
| CTO | Chief Technology Officer |
| DTC | Direct-to-Consumer |

## 业务名词解释

- **Nordic Minimalism Catalog（北欧极简目录）**：NordHjem 的核心选品集合，强调材质、线条与功能平衡。
- **Dual-Market Operation（双市场运营）**：同时面向 DK 与 US 的区域化价格与配送策略。
- **Conversion Backbone（转化主链路）**：从首页到订单确认页的关键漏斗路径，是监控与优化重点。
- **Owner Approval Gate（Owner 审批门）**：生产发布前由 Owner 最终确认的治理关卡。
- **AI-Augmented Delivery（AI 增强交付）**：由 CTO(AI) 驱动文档、编码、测试与运维自动化的交付方式。
