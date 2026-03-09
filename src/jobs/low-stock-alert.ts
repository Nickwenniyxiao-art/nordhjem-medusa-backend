import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

const LOW_STOCK_THRESHOLD = parseInt(process.env.LOW_STOCK_THRESHOLD || "10", 10)
const ADMIN_EMAIL = process.env.LOW_STOCK_ALERT_EMAIL || "admin@nordhjem.com"
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ""
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || ""

interface InventoryLevel {
  id: string
  inventory_item_id: string
  location_id: string
  stocked_quantity: number
  reserved_quantity: number
}

interface InventoryItem {
  id: string
  sku: string | null
  title: string | null
}

interface LowStockItem {
  sku: string | null
  title: string | null
  available: number
  stocked: number
  reserved: number
  locationId: string
}

export default async function lowStockAlertJob(container: MedusaContainer) {
  const logger = container.resolve("logger") as {
    info: (msg: string) => void
    error: (msg: string) => void
  }
  const inventoryService = container.resolve(Modules.INVENTORY) as {
    listAndCountInventoryItems: (
      selector: Record<string, unknown>,
      config: { take: number; skip: number }
    ) => Promise<[InventoryItem[], number]>
    listInventoryLevels: (selector: { inventory_item_id: string }) => Promise<InventoryLevel[]>
  }
  const notificationService = container.resolve(Modules.NOTIFICATION) as unknown as {
    createNotifications: (data: Record<string, unknown>) => Promise<unknown>
  }

  logger.info("[low-stock-alert] Starting low stock check...")

  try {
    const lowStockItems: LowStockItem[] = []
    let offset = 0
    const limit = 100

    while (true) {
      const [items] = await inventoryService.listAndCountInventoryItems({}, { take: limit, skip: offset })

      if (!items || items.length === 0) {
        break
      }

      for (const item of items) {
        const levels = await inventoryService.listInventoryLevels({
          inventory_item_id: item.id,
        })

        for (const level of levels) {
          const available = level.stocked_quantity - level.reserved_quantity
          if (available <= LOW_STOCK_THRESHOLD) {
            lowStockItems.push({
              sku: item.sku,
              title: item.title,
              available,
              stocked: level.stocked_quantity,
              reserved: level.reserved_quantity,
              locationId: level.location_id,
            })
          }
        }
      }

      if (items.length < limit) {
        break
      }
      offset += limit
    }

    if (lowStockItems.length === 0) {
      logger.info("[low-stock-alert] No low stock items found. Skipping notification.")
      return
    }

    logger.info(`[low-stock-alert] Found ${lowStockItems.length} low stock items.`)

    const tableRows = lowStockItems
      .map(
        (item) => `<tr>
            <td style="padding:8px;border:1px solid #ddd;">${item.sku || "N/A"}</td>
            <td style="padding:8px;border:1px solid #ddd;">${item.title || "Unknown"}</td>
            <td style="padding:8px;border:1px solid #ddd;color:${item.available <= 0 ? "#dc2626" : "#f59e0b"};font-weight:bold;">${item.available}</td>
            <td style="padding:8px;border:1px solid #ddd;">${item.stocked}</td>
            <td style="padding:8px;border:1px solid #ddd;">${item.reserved}</td>
          </tr>`
      )
      .join("\n")

    const emailHtml = `
      <div style="font-family:sans-serif;max-width:800px;margin:0 auto;">
        <h2 style="color:#dc2626;">⚠️ NordHjem Low Stock Alert</h2>
        <p>${lowStockItems.length} item(s) are at or below the threshold of ${LOW_STOCK_THRESHOLD} units.</p>
        <table style="border-collapse:collapse;width:100%;margin-top:16px;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="padding:8px;border:1px solid #ddd;text-align:left;">SKU</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:left;">Product</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:left;">Available</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:left;">Stocked</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:left;">Reserved</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <p style="margin-top:16px;color:#6b7280;font-size:14px;">
          Threshold: ${LOW_STOCK_THRESHOLD} units | Generated at: ${new Date().toISOString()}
        </p>
      </div>
    `

    try {
      await notificationService.createNotifications({
        to: ADMIN_EMAIL,
        channel: "email",
        template: "low-stock-alert",
        data: {
          subject: `⚠️ NordHjem Low Stock Alert — ${lowStockItems.length} item(s)`,
          html: emailHtml,
          lowStockItems,
        },
      })
      logger.info(`[low-stock-alert] Email sent to ${ADMIN_EMAIL}`)
    } catch (emailError) {
      logger.error(`[low-stock-alert] Failed to send email: ${emailError}`)
    }

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      try {
        const telegramLines = lowStockItems.map(
          (item) =>
            `• ${item.sku || "N/A"} — ${item.title || "Unknown"}: ${item.available} available (stocked: ${item.stocked}, reserved: ${item.reserved})`
        )

        let message = `⚠️ NordHjem 低库存预警\n\n共 ${lowStockItems.length} 项低于 ${LOW_STOCK_THRESHOLD} 阈值:\n\n`
        const maxTelegramLength = 3800

        for (const [index, line] of telegramLines.entries()) {
          if ((message + line + "\n").length > maxTelegramLength) {
            message += `\n... 及其他 ${lowStockItems.length - index} 项 (详见邮件)`
            break
          }
          message += `${line}\n`
        }

        message += `\n📧 完整列表已发送到 ${ADMIN_EMAIL}`

        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
        await fetch(telegramUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: "HTML",
          }),
        })
        logger.info("[low-stock-alert] Telegram notification sent.")
      } catch (tgError) {
        logger.error(`[low-stock-alert] Failed to send Telegram notification: ${tgError}`)
      }
    }
  } catch (error) {
    logger.error(`[low-stock-alert] Job failed: ${error}`)
  }
}

export const config = {
  name: "low-stock-alert",
  schedule: "0 8 * * *",
}
