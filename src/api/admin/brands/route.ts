import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { BRAND_MODULE } from "../../../modules/brand";

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
  listAndCountBrands: (
    filters: Record<string, unknown>,
    config: { take: number; skip: number; order: Record<string, "ASC" | "DESC"> },
  ) => Promise<[BrandRecord[], number]>;
  createBrands: (data: Record<string, unknown>) => Promise<BrandRecord>;
  updateBrands: (data: Record<string, unknown>) => Promise<BrandRecord>;
};

type SalesChannel = { id: string; name: string };

type SalesChannelService = {
  createSalesChannels: (data: {
    name: string;
    description?: string;
    metadata?: Record<string, unknown>;
  }) => Promise<SalesChannel>;
};

type EventBus = {
  emit: (data: { name: string; data: Record<string, unknown> }) => Promise<void>;
};

function toSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const brandService = req.scope.resolve(BRAND_MODULE) as BrandService;

  const parsedLimit = Number.parseInt((req.query.limit as string) ?? "20", 10);
  const parsedOffset = Number.parseInt((req.query.offset as string) ?? "0", 10);
  const limit = Number.isNaN(parsedLimit) ? 20 : parsedLimit;
  const offset = Number.isNaN(parsedOffset) ? 0 : parsedOffset;

  const [brands, count] = await brandService.listAndCountBrands(
    {},
    {
      take: limit,
      skip: offset,
      order: { created_at: "DESC" },
    },
  );

  res.status(200).json({ brands, count, limit, offset });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const brandService = req.scope.resolve(BRAND_MODULE) as BrandService;
  const salesChannelService = req.scope.resolve(Modules.SALES_CHANNEL) as SalesChannelService;
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as EventBus;

  const body = req.body as {
    name?: string;
    slug?: string;
    logo_url?: string;
    primary_color?: string;
    domain?: string;
    metadata?: Record<string, unknown>;
  };

  if (!body.name) {
    res.status(400).json({ message: "name is required" });
    return;
  }

  const brand = await brandService.createBrands({
    name: body.name,
    slug: body.slug ?? toSlug(body.name),
    logo_url: body.logo_url ?? null,
    primary_color: body.primary_color ?? null,
    domain: body.domain?.toLowerCase() ?? null,
    metadata: body.metadata ?? null,
  });

  const salesChannel = await salesChannelService.createSalesChannels({
    name: body.name,
    description: `Sales channel for brand ${body.name}`,
    metadata: {
      brand_id: brand.id,
    },
  });

  await brandService.updateBrands({
    id: brand.id,
    metadata: {
      ...(brand.metadata ?? {}),
      sales_channel_id: salesChannel.id,
    },
  });

  await eventBus.emit({
    name: "brand.created",
    data: {
      id: brand.id,
      sales_channel_id: salesChannel.id,
    },
  });

  res.status(200).json({ brand, sales_channel: salesChannel });
}
