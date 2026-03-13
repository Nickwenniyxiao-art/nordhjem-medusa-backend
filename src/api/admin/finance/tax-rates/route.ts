import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

type RawResultRow = Record<string, string | number | Date | null>;

const mapTaxRateRow = (row: RawResultRow) => ({
  id: String(row.id ?? ""),
  name: String(row.name ?? ""),
  code: row.code ? String(row.code) : null,
  rate: Number(row.rate ?? 0),
  is_default: Boolean(row.is_default ?? false),
  is_combinable: Boolean(row.is_combinable ?? false),
  tax_region_id: row.tax_region_id ? String(row.tax_region_id) : null,
  tax_region_name: row.tax_region_name ? String(row.tax_region_name) : null,
  created_at: row.created_at ?? null,
  updated_at: row.updated_at ?? null,
});

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as { error: (message: string) => void };
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as {
    raw: (query: string, params?: unknown[]) => Promise<{ rows?: RawResultRow[] }>;
  };

  try {
    try {
      const taxService = req.scope.resolve("tax") as any;
      if (taxService?.listTaxRegions) {
        const regions = await taxService.listTaxRegions({}, { relations: ["rates"] });
        const rates = (regions || []).flatMap((region: any) =>
          (region.rates || []).map((rate: any) => ({
            id: rate.id,
            name: rate.name,
            code: rate.code ?? null,
            rate: Number(rate.rate ?? 0),
            is_default: Boolean(rate.is_default ?? false),
            is_combinable: Boolean(rate.is_combinable ?? false),
            tax_region_id: region.id,
            tax_region_name: region.name ?? null,
            created_at: rate.created_at ?? null,
            updated_at: rate.updated_at ?? null,
          })),
        );

        return res.status(200).json({ tax_rates: rates });
      }
    } catch {
      // fallback to SQL below
    }

    const query = `
      SELECT
        tr.id,
        tr.name,
        tr.code,
        tr.rate,
        tr.is_default,
        tr.is_combinable,
        tr.tax_region_id,
        trg.name AS tax_region_name,
        tr.created_at,
        tr.updated_at
      FROM tax_rate tr
      LEFT JOIN tax_region trg ON trg.id = tr.tax_region_id
      ORDER BY tr.created_at DESC
    `;

    const result = await pgConnection.raw(query);
    return res.status(200).json({ tax_rates: (result?.rows ?? []).map(mapTaxRateRow) });
  } catch (err: any) {
    logger.error(`[finance-tax-rates] GET error: ${err.message}`);

    if (err.message?.includes("does not exist")) {
      return res.status(200).json({
        tax_rates: [],
        note: "Tax tables not initialized.",
      });
    }

    return res.status(500).json({ error: "Failed to list tax rates" });
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as { error: (message: string) => void };
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as {
    raw: (query: string, params?: unknown[]) => Promise<{ rows?: RawResultRow[] }>;
  };

  const body = (req.body ?? {}) as Record<string, unknown>;

  try {
    try {
      const taxService = req.scope.resolve("tax") as any;
      if (taxService?.createTaxRates) {
        const created = await taxService.createTaxRates([
          {
            name: body.name,
            code: body.code,
            rate: body.rate,
            is_default: body.is_default,
            is_combinable: body.is_combinable,
            tax_region_id: body.tax_region_id,
          },
        ]);

        return res.status(200).json({ tax_rate: created?.[0] ?? created });
      }
    } catch {
      // fallback to SQL below
    }

    const query = `
      INSERT INTO tax_rate (name, code, rate, is_default, is_combinable, tax_region_id)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING *
    `;
    const result = await pgConnection.raw(query, [
      body.name ?? null,
      body.code ?? null,
      body.rate ?? 0,
      body.is_default ?? false,
      body.is_combinable ?? false,
      body.tax_region_id ?? null,
    ]);

    return res.status(200).json({ tax_rate: result?.rows?.[0] ?? null });
  } catch (err: any) {
    logger.error(`[finance-tax-rates] POST error: ${err.message}`);

    if (err.message?.includes("does not exist")) {
      return res.status(200).json({
        tax_rate: null,
        note: "Tax tables not initialized.",
      });
    }

    return res.status(500).json({ error: "Failed to create tax rate" });
  }
}
