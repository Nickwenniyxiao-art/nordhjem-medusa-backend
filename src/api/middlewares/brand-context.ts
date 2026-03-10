import type { MedusaNextFunction, MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BRAND_MODULE } from "../../modules/brand"

type BrandRecord = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  primary_color: string | null
  domain: string | null
  metadata: Record<string, unknown> | null
}

type BrandService = {
  retrieveBrand: (id: string) => Promise<BrandRecord>
  listBrands: (filters?: Record<string, unknown>, config?: { take?: number }) => Promise<BrandRecord[]>
}

type RequestWithBrandContext = MedusaRequest & {
  brand_context?: {
    brand_id: string
    sales_channel_id: string | null
  }
}

function getHost(req: MedusaRequest) {
  const host = req.headers.host

  if (!host) {
    return null
  }

  return host.split(":")[0]?.toLowerCase() ?? null
}

export async function brandContextMiddleware(req: MedusaRequest, _res: MedusaResponse, next: MedusaNextFunction) {
  const brandService = req.scope.resolve(BRAND_MODULE) as BrandService
  const mutableReq = req as RequestWithBrandContext

  const headerBrandId = req.headers["x-brand-id"]
  const normalizedBrandId = Array.isArray(headerBrandId) ? headerBrandId[0] : headerBrandId

  let brand: BrandRecord | null = null

  if (normalizedBrandId) {
    brand = await brandService.retrieveBrand(normalizedBrandId)
  } else {
    const host = getHost(req)

    if (host) {
      const matches = await brandService.listBrands({ domain: host }, { take: 1 })
      brand = matches[0] ?? null
    }
  }

  if (brand) {
    const salesChannelId = (brand.metadata?.sales_channel_id as string | undefined) ?? null

    mutableReq.brand_context = {
      brand_id: brand.id,
      sales_channel_id: salesChannelId,
    }
  }

  next()
}
