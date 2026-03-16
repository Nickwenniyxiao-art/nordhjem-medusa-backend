# SECURITY TEST

> 项目名称: NordHjem  
> 创建日期: 2026-03-16  
> 状态: Active  
> 负责人: CTO (AI)

# SECURITY-TEST

## 测试范围

NordHjem 安全测试覆盖以下入口与高风险链路：

- **Store API**：商品、购物车、结算、订单查询接口。
- **Admin API**：后台管理接口（价格、库存、订单状态、用户管理）。
- **前端输入**：搜索框、地址表单、优惠码、备注字段、上传字段。
- **认证流程**：管理员登录、令牌签发与刷新、权限边界。
- **支付流程**：Stripe 支付意图创建、回调校验、订单状态落库。
- **文件上传**：商品图上传、文件类型校验、存储路径安全策略。

## 威胁模型

以 OWASP Top 10 为基线进行对照评估：

1. **注入（Injection）**

   - 风险点：搜索参数、过滤参数、Admin 批量更新输入。
   - 控制点：参数化查询、输入白名单、ORM 安全 API。

2. **失效认证（Broken Authentication）**

   - 风险点：Admin 会话、JWT 续签、权限绕过。
   - 控制点：最小权限、短时令牌、refresh token 轮换。

3. **敏感数据暴露（Sensitive Data Exposure）**

   - 风险点：日志中输出邮箱/地址/支付相关字段。
   - 控制点：日志脱敏、密钥环境变量加密、HTTPS 强制。

4. **XSS**

   - 风险点：前端用户输入回显、Admin 文本字段渲染。
   - 控制点：输出转义、CSP、富文本白名单。

5. **CSRF**

   - 风险点：Admin 后台状态变更接口。
   - 控制点：SameSite Cookie、CSRF Token、防重放。

6. **SSRF**

   - 风险点：服务端处理外部 URL（如图片抓取、回调处理）。
   - 控制点：目标地址白名单、内网地址阻断、DNS 重绑定防护。

## 漏洞发现与评级

> 漏洞台账模板，待渗透测试与日常扫描结果填充。

| 漏洞 ID | 描述 | 严重级别（Critical/High/Medium/Low） | 状态 | 修复 PR |
| --- | --- | --- | --- | --- |
| VULN-TBD-001 | 待填 | TBD | Open | TBD |
| VULN-TBD-002 | 待填 | TBD | Open | TBD |
| VULN-TBD-003 | 待填 | TBD | Open | TBD |

## 修复建议

1. **输入验证**

   - 统一在 API 层做 schema 校验（必填/长度/枚举/格式）。

2. **参数化查询**

   - 禁止拼接 SQL；统一使用 MikroORM 参数绑定能力。

3. **CORS 白名单**

   - 仅允许 Store 与 Admin 的正式域名访问敏感接口。

4. **CSP Header**

   - 前端与 Admin 配置严格 CSP，限制 script-src、connect-src 来源。

5. **Stripe Webhook 签名验证**

   - 所有回调必须验证签名，失败请求直接拒绝并记录审计日志。

6. **JWT 过期策略**

   - 缩短 access token 生命周期，配合 refresh token 轮换与吊销列表。
