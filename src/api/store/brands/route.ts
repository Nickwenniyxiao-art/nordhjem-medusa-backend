import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { BRAND_MODULE } from "../../../modules/brand";

type BrandRecord = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string | null;
  domain: string | null;
};

type BrandService = {
  retrieveBrand: (id: string) => Promise<BrandRecord>;
};

type RequestWithBrandContext = MedusaRequest & {
  brand_context?: {
    brand_id: string;
    sales_channel_id: string | null;
  };
};

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const request = req as RequestWithBrandContext;

  if (!request.brand_context?.brand_id) {
    res.status(404).json({ message: "No brand context found" });
    return;
  }

  const brandService = req.scope.resolve(BRAND_MODULE) as BrandService;
  const brand = await brandService.retrieveBrand(request.brand_context.brand_id);

  res.status(200).json({
    brand: {
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logo_url: brand.logo_url,
      primary_color: brand.primary_color,
    },
  });
}
