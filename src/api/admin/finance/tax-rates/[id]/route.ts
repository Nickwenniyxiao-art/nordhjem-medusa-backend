import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

type RawResultRow = Record<string, string | number | Date | null>;

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as { error: (message: string) => void };
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as {
    raw: (query: string, params?: unknown[]) => Promise<{ rows?: RawResultRow[] }>;
  };

  const id = req.params.id;
  const body = (req.body ?? {}) as Record<string, unknown>;

  try {
    try {
      const taxService = req.scope.resolve("tax") as any;
      if (taxService?.updateTaxRates) {
        const updated = await taxService.updateTaxRates([
          {
            id,
            ...body,
          },
        ]);

        return res.status(200).json({ tax_rate: updated?.[0] ?? updated });
      }
    } catch {
      // fallback to SQL below
    }

    const query = `
      UPDATE tax_rate
      SET
        name = COALESCE(?, name),
        code = COALESCE(?, code),
        rate = COALESCE(?, rate),
        is_default = COALESCE(?, is_default),
        is_combinable = COALESCE(?, is_combinable),
        tax_region_id = COALESCE(?, tax_region_id),
        updated_at = NOW()
      WHERE id = ?
      RETURNING *
    `;

    const result = await pgConnection.raw(query, [
      body.name ?? null,
      body.code ?? null,
      body.rate ?? null,
      body.is_default ?? null,
      body.is_combinable ?? null,
      body.tax_region_id ?? null,
      id,
    ]);

    return res.status(200).json({ tax_rate: result?.rows?.[0] ?? null });
  } catch (err: any) {
    logger.error(`[finance-tax-rates] PATCH error: ${err.message}`);

    if (err.message?.includes("does not exist")) {
      return res.status(200).json({
        tax_rate: null,
        note: "Tax tables not initialized.",
      });
    }

    return res.status(500).json({ error: "Failed to update tax rate" });
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as { error: (message: string) => void };
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as {
    raw: (query: string, params?: unknown[]) => Promise<{ rows?: RawResultRow[] }>;
  };

  const id = req.params.id;

  try {
    try {
      const taxService = req.scope.resolve("tax") as any;
      if (taxService?.deleteTaxRates) {
        await taxService.deleteTaxRates([id]);
        return res.status(200).json({ id, deleted: true });
      }
    } catch {
      // fallback to SQL below
    }

    const query = `DELETE FROM tax_rate WHERE id = ? RETURNING id`;
    const result = await pgConnection.raw(query, [id]);

    return res.status(200).json({ id: result?.rows?.[0]?.id ?? id, deleted: true });
  } catch (err: any) {
    logger.error(`[finance-tax-rates] DELETE error: ${err.message}`);

    if (err.message?.includes("does not exist")) {
      return res.status(200).json({
        id,
        deleted: false,
        note: "Tax tables not initialized.",
      });
    }

    return res.status(500).json({ error: "Failed to delete tax rate" });
  }
}
