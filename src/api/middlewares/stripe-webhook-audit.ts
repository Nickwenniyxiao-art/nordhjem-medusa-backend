import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export async function stripeWebhookAuditMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const logger = req.scope.resolve("logger") as {
    error: (msg: string) => void
    info: (msg: string) => void
  }
  const startTime = Date.now()

  const signature = req.headers["stripe-signature"]
  if (!signature) {
    logger.error(
      `[stripe-webhook-audit] ❌ REJECTED: Missing stripe-signature header from ${req.ip}`
    )
    res.status(400).json({ error: "Missing stripe-signature header" })
    return
  }

  const body = req.body as Record<string, unknown> | undefined
  const eventType = typeof body?.type === "string" ? body.type : "unknown"
  const eventId = typeof body?.id === "string" ? body.id : "unknown"

  logger.info(
    `[stripe-webhook-audit] Incoming webhook: event=${eventType} id=${eventId} ip=${req.ip}`
  )

  const originalJson = res.json.bind(res)
  const originalStatus = res.status.bind(res)
  let responseStatus = res.statusCode || 200

  res.status = (code: number) => {
    responseStatus = code
    return originalStatus(code)
  }

  res.json = (data: unknown) => {
    const duration = Date.now() - startTime
    logger.info(
      `[stripe-webhook-audit] Processed: event=${eventType} id=${eventId} status=${responseStatus} duration=${duration}ms`
    )
    return originalJson(data)
  }

  next()
}
