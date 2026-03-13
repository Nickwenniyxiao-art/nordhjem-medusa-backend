import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const logger = req.scope.resolve("logger") as {
    error: (m: string) => void
  }

  try {
    const orderService = req.scope.resolve(Modules.ORDER)

    const order = await orderService.retrieveOrder(id, {
      select: ["id", "display_id", "status"],
      relations: ["fulfillments", "fulfillments.labels", "fulfillments.items"],
    })

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    const trackingInfo = ((order as any).fulfillments ?? []).map((f: any) => {
      const trackingNumber =
        f.tracking_links?.[0]?.tracking_number ?? f.labels?.[0]?.tracking_number ?? null

      const carrier = f.tracking_links?.[0]?.carrier ?? f.provider_id ?? null

      let trackingUrl: string | null = null
      if (trackingNumber) {
        trackingUrl = `https://t.17track.net/en/track?nums=${encodeURIComponent(trackingNumber)}`
      }

      return {
        fulfillment_id: f.id,
        status: f.delivery_status || f.shipped_at ? "shipped" : "processing",
        shipped_at: f.shipped_at || f.created_at,
        tracking_number: trackingNumber,
        carrier,
        tracking_url: trackingUrl,
        items_count: f.items?.length ?? 0,
      }
    })

    return res.json({
      order_id: order.id,
      display_id: order.display_id,
      order_status: order.status,
      fulfillments: trackingInfo,
    })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : JSON.stringify(error)
    logger.error(`[tracking-api] Failed for order ${id}: ${errMsg}`)
    return res.status(500).json({ message: "Internal server error" })
  }
}
