# SECURITY-POLICY

## 1. 安全概述

NordHjem（北欧风格家具电商平台）后端项目的安全目标是：保护用户数据、防止代码注入、确保依赖安全，并通过自动化安全门禁降低风险进入生产环境的概率。

当前已部署的安全工具如下：

- **Gitleaks** — PR 密钥泄露检测
- **Semgrep** — PR 静态安全分析（JavaScript/TypeScript/Node.js）
- **npm audit** — PR + 每周依赖漏洞扫描
- **Dependabot** — 每周自动依赖更新
- **Trivy** — Docker 镜像漏洞扫描
- **AI Code Review** — 每个 PR 自动 AI 审查

## 2. 安全 CI 管线

PR 阶段安全检查按顺序执行：

1. **Gitleaks**：检测提交内容与变更文件中的密钥/凭证泄露。
2. **Semgrep**：对 JavaScript/TypeScript/Node.js 代码进行静态安全分析。
3. **npm audit**：检查依赖漏洞并评估风险等级。
4. **Trivy**（当涉及 Dockerfile 或镜像相关变更时）：扫描镜像中的系统与依赖漏洞。
5. **AI Code Review**：对 PR 进行自动化 AI 安全与质量审查。

## 3. 密钥管理

- 禁止在代码中硬编码任何密钥、令牌或凭证。
- 所有敏感信息必须使用 **GitHub Secrets** 管理。
- `.env.example` 仅允许保留环境变量键名，不得包含真实值。
- **Gitleaks** 在每个 PR 自动执行泄露检测。
- `.gitleaks.toml` 用于配置必要排除项（如测试 mock token、lock 文件等）。

## 4. 依赖安全

- **Dependabot** 每周一自动创建依赖更新 PR，单次最多 5 个。
- **npm audit** 在 PR 与每周一定时任务中运行。
- 对于 **high/critical** 级别漏洞，CI 必须阻断。
- `@medusajs/*` 核心包排除自动更新，需手动评估与测试兼容性后再升级。
- GitHub Actions 工作流依赖同样纳入 Dependabot 更新范围。

## 5. 容器安全

- 当 Dockerfile 发生变更时，**Trivy** 自动执行镜像漏洞扫描。
- 对存在修复版本的 **CRITICAL/HIGH** 漏洞，CI 必须阻断。
- 对尚无修复版本的漏洞，采用 `--ignore-unfixed` 策略，不作为阻断条件。

## 6. 漏洞响应流程

| 级别 | 响应时间 | 说明 |
|------|----------|------|
| P0 (Critical) | < 24 小时 | 数据泄露、远程代码执行 |
| P1 (High) | < 1 周 | 权限提升、SQL 注入 |
| P2 (Medium) | 下个 Sprint | XSS、信息泄露 |
| P3 (Low) | 酌情处理 | 低风险最佳实践 |

标准流程：**发现 → 评估严重性 → 创建 Issue（标签 `security`） → 修复 → 验证 → 关闭**。

## 7. 安全联系方式

- 安全问题请通过 GitHub Issue 提交，并添加 `security` 标签。
- 紧急安全问题请直接联系 Owner。
