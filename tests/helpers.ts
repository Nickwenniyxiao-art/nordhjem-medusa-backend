import assert from "node:assert/strict"

export const API_URL = process.env.API_URL || "http://localhost:9000"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@nordhjem.com"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "NordHjem2026!"

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export function testPrefix(scope: string): string {
  return `test-${scope}-${Date.now()}`
}

export async function getAdminToken(): Promise<string> {
  const res = await fetch(`${API_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  })

  const data = (await res.json().catch(() => ({}))) as { token?: string; message?: string }
  assert.ok(res.ok, `获取 Admin token 失败，状态码=${res.status}，响应=${JSON.stringify(data)}`)
  assert.ok(data.token, `获取 Admin token 失败，缺少 token 字段，响应=${JSON.stringify(data)}`)
  return data.token
}

export async function adminRequest<T = Record<string, unknown>>(params: {
  token: string
  method?: HttpMethod
  path: string
  body?: unknown
}): Promise<{ response: Response; data: T }> {
  const { token, method = "GET", path, body } = params
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = (await response.json().catch(() => ({}))) as T
  return { response, data }
}

export async function storeRequest<T = Record<string, unknown>>(params: {
  method?: HttpMethod
  path: string
  body?: unknown
  publishableApiKey?: string
}): Promise<{ response: Response; data: T }> {
  const { method = "GET", path, body, publishableApiKey } = params
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (publishableApiKey) {
    headers["x-publishable-api-key"] = publishableApiKey
  }
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = (await response.json().catch(() => ({}))) as T
  return { response, data }
}

export async function runStep(name: string, step: () => Promise<void>): Promise<void> {
  console.log(`\n[步骤开始] ${name}`)
  try {
    await step()
    console.log(`[步骤通过] ${name}`)
  } catch (error) {
    console.error(`[步骤失败] ${name}`, error)
    throw error
  }
}
