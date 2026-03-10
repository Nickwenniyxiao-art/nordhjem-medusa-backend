import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

type ProductModuleServiceLike = {
  listProducts?: (filters?: Record<string, unknown>, config?: Record<string, unknown>) => Promise<unknown[]>
}

const CSV_HEADERS = ["id", "title", "handle", "status", "description", "created_at", "updated_at"]

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) {
    return ""
  }

  const text = String(value)
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const format = String((req.query as Record<string, unknown>)?.format || "csv").toLowerCase()
  if (format !== "csv") {
    return res.status(400).json({ error: "format must be csv" })
  }

  const productService = req.scope.resolve(Modules.PRODUCT) as ProductModuleServiceLike

  if (typeof productService.listProducts !== "function") {
    return res.status(500).json({ error: "ProductModuleService.listProducts is unavailable" })
  }

  const products = await productService.listProducts({}, { take: 10000 })

  const lines = [CSV_HEADERS.join(",")]
  for (const product of products) {
    const row = product as {
      id?: string
      title?: string
      handle?: string
      status?: string
      description?: string
      created_at?: string | Date
      updated_at?: string | Date
    }

    lines.push(
      [
        escapeCsv(row.id),
        escapeCsv(row.title),
        escapeCsv(row.handle),
        escapeCsv(row.status),
        escapeCsv(row.description),
        escapeCsv(row.created_at ? new Date(row.created_at).toISOString() : ""),
        escapeCsv(row.updated_at ? new Date(row.updated_at).toISOString() : ""),
      ].join(",")
    )
  }

  const today = new Date().toISOString().slice(0, 10)
  res.setHeader("Content-Type", "text/csv; charset=utf-8")
  res.setHeader("Content-Disposition", `attachment; filename="products-export-${today}.csv"`)

  return res.status(200).send(`${lines.join("\n")}\n`)
}
