import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { BRAND_MODULE } from "../../../../modules/brand";

type BrandRecord = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string | null;
  domain: string | null;
  metadata: Record<string, unknown> | null;
};

type BrandService = {
  retrieveBrand: (id: string) => Promise<BrandRecord>;
  updateBrands: (data: { id: string } & Record<string, unknown>) => Promise<BrandRecord>;
  deleteBrands: (id: string | string[]) => Promise<void>;
};

type EventBus = {
  emit: (data: { name: string; data: Record<string, unknown> }) => Promise<void>;
};

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const brandService = req.scope.resolve(BRAND_MODULE) as BrandService;
  const brand = await brandService.retrieveBrand(req.params.id);

  res.status(200).json({ brand });
}

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  const brandService = req.scope.resolve(BRAND_MODULE) as BrandService;
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as EventBus;
  const body = req.body as Record<string, unknown>;

  const brand = await brandService.updateBrands({
    id: req.params.id,
    ...body,
  });

  await eventBus.emit({
    name: "brand.updated",
    data: { id: brand.id },
  });

  res.status(200).json({ brand });
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const brandService = req.scope.resolve(BRAND_MODULE) as BrandService;
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as EventBus;

  await brandService.deleteBrands(req.params.id);

  await eventBus.emit({
    name: "brand.deleted",
    data: { id: req.params.id },
  });

  res.status(200).json({ id: req.params.id, deleted: true });
}
