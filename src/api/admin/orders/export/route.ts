import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

const CSV_HEADERS = [
  "order_id",
  "display_id",
  "date",
  "customer_email",
  "items",
  "subtotal",
  "shipping",
  "tax",
  "discount",
  "total",
  "payment_status",
  "fulfillment_status",
  "refund_amount",
  "currency_code",
];

function escCsv(val: unknown): string {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function amount(raw: unknown, plain: unknown): number {
  if (raw && typeof raw === "object" && "value" in (raw as Record<string, unknown>)) {
    return Number((raw as { value: unknown }).value || 0);
  }
  return Number(plain || 0);
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as {
    raw: (query: string, params?: any[]) => Promise<{ rows?: any[] }>;
  };

  const {
    format = "csv",
    date_from,
    date_to,
    status,
    currency_code = "usd",
  } = req.query as Record<string, string>;

  if (format.toLowerCase() === "xlsx") {
    return res.status(400).json({ note: "XLSX export requires xlsx dependency, use CSV" });
  }

  if (format.toLowerCase() !== "csv") {
    return res.status(400).json({ error: "format must be csv or xlsx" });
  }

  const conditions = ["o.currency_code = ?"];
  const params: any[] = [currency_code.toLowerCase()];

  if (date_from) {
    conditions.push("o.created_at >= ?::timestamptz");
    params.push(date_from);
  }

  if (date_to) {
    conditions.push("o.created_at < (?::date + interval '1 day')");
    params.push(date_to);
  }

  if (status) {
    conditions.push("o.status = ?");
    params.push(status);
  }

  const query = `
    SELECT
      o.id AS order_id,
      o.display_id,
      o.created_at AS date,
      o.email AS customer_email,
      o.raw_subtotal,
      o.subtotal,
      o.raw_shipping_total,
      o.shipping_total,
      o.raw_tax_total,
      o.tax_total,
      o.raw_discount_total,
      o.discount_total,
      o.raw_total,
      o.total,
      o.raw_refunded_total,
      o.refunded_total,
      o.payment_status,
      o.fulfillment_status,
      o.currency_code,
      (
        SELECT STRING_AGG(CONCAT(li.title, ' (x', li.quantity, ')'), '; ')
        FROM order_line_item li
        WHERE li.order_id = o.id
      ) AS items
    FROM "order" o
    WHERE ${conditions.join(" AND ")}
    ORDER BY o.created_at DESC
  `;

  let rows: any[] = [];
  try {
    const result = await pgConnection.raw(query, params);
    rows = result?.rows || [];
  } catch (err: any) {
    if (!err.message?.includes("does not exist")) {
      return res.status(500).json({ error: "Failed to export orders" });
    }
  }

  const lines = [CSV_HEADERS.join(",")];
  for (const row of rows) {
    lines.push(
      [
        escCsv(row.order_id),
        escCsv(row.display_id),
        escCsv(row.date ? new Date(row.date).toISOString() : ""),
        escCsv(row.customer_email),
        escCsv(row.items || ""),
        escCsv(amount(row.raw_subtotal, row.subtotal)),
        escCsv(amount(row.raw_shipping_total, row.shipping_total)),
        escCsv(amount(row.raw_tax_total, row.tax_total)),
        escCsv(amount(row.raw_discount_total, row.discount_total)),
        escCsv(amount(row.raw_total, row.total)),
        escCsv(row.payment_status),
        escCsv(row.fulfillment_status),
        escCsv(amount(row.raw_refunded_total, row.refunded_total)),
        escCsv(row.currency_code),
      ].join(","),
    );
  }

  const today = new Date().toISOString().split("T")[0];
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="nordhjem-orders-export-${today}.csv"`,
  );
  return res.status(200).send(lines.join("\n") + "\n");
}
