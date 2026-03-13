import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

type ProductModuleServiceLike = {
  createProducts?: (payload: Array<Record<string, unknown>>) => Promise<unknown>;
  updateProducts?: (payload: Array<Record<string, unknown>>) => Promise<unknown>;
  listProducts?: (
    filters?: Record<string, unknown>,
    config?: Record<string, unknown>,
  ) => Promise<unknown[]>;
};

type CsvRow = {
  id?: string;
  title?: string;
  handle?: string;
  description?: string;
  status?: string;
};

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values.map((value) => value.trim());
}

function parseCsv(csvContent: string): CsvRow[] {
  const lines = csvContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: CsvRow = {};

    headers.forEach((header, index) => {
      const key = header.trim().toLowerCase() as keyof CsvRow;
      row[key] = values[index];
    });

    return row;
  });
}

function parseMultipartCsv(contentType: string, rawBody: string): string | null {
  const boundaryToken = contentType
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("boundary="));

  if (!boundaryToken) {
    return null;
  }

  const boundary = `--${boundaryToken.replace("boundary=", "")}`;
  const parts = rawBody.split(boundary);

  for (const part of parts) {
    if (!part.includes("Content-Disposition") || !part.includes('name="file"')) {
      continue;
    }

    const splitMarker = "\r\n\r\n";
    const markerIndex = part.indexOf(splitMarker);
    if (markerIndex === -1) {
      continue;
    }

    const fileSection = part.slice(markerIndex + splitMarker.length);
    return fileSection.replace(/\r\n--$/, "").trim();
  }

  return null;
}

function getCsvContent(req: MedusaRequest): string | null {
  const contentType = String(req.headers["content-type"] || "");
  const bodyAsRecord = (req.body || {}) as Record<string, unknown>;

  if (typeof bodyAsRecord.csv === "string") {
    return bodyAsRecord.csv;
  }

  if (typeof bodyAsRecord.file === "string") {
    return bodyAsRecord.file;
  }

  if (typeof bodyAsRecord.content === "string") {
    return bodyAsRecord.content;
  }

  if (contentType.includes("multipart/form-data")) {
    const raw = bodyAsRecord.rawBody;
    if (typeof raw === "string") {
      return parseMultipartCsv(contentType, raw);
    }

    if (Buffer.isBuffer(raw)) {
      return parseMultipartCsv(contentType, raw.toString("utf-8"));
    }
  }

  return null;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const productService = req.scope.resolve(Modules.PRODUCT) as any;
  const csvContent = getCsvContent(req);

  if (!csvContent) {
    return res.status(400).json({ error: "CSV file is required (multipart/form-data: file)" });
  }

  const rows = parseCsv(csvContent);
  if (rows.length === 0) {
    return res.status(400).json({ error: "CSV has no data rows" });
  }

  let imported = 0;
  let skipped = 0;
  const errors: Array<{ row: number; error: string; id?: string; handle?: string }> = [];

  for (let index = 0; index < rows.length; index += 1) {
    const rowNumber = index + 2;
    const row = rows[index];

    if (!row.title && !row.handle && !row.id) {
      skipped += 1;
      continue;
    }

    try {
      const payload = {
        title: row.title,
        handle: row.handle,
        description: row.description,
        status: row.status || "draft",
      };

      if (row.id) {
        if (typeof productService.updateProducts !== "function") {
          throw new Error("ProductModuleService.updateProducts is unavailable");
        }

        await productService.updateProducts([{ id: row.id, ...payload }]);
        imported += 1;
        continue;
      }

      if (!row.handle || typeof productService.listProducts !== "function") {
        if (typeof productService.createProducts !== "function") {
          throw new Error("ProductModuleService.createProducts is unavailable");
        }

        await productService.createProducts([payload]);
        imported += 1;
        continue;
      }

      const existingProducts = await productService.listProducts(
        { handle: row.handle },
        { take: 1 },
      );

      const existingProduct = Array.isArray(existingProducts) ? existingProducts[0] : undefined;

      if (existingProduct && typeof (existingProduct as { id?: string }).id === "string") {
        if (typeof productService.updateProducts !== "function") {
          throw new Error("ProductModuleService.updateProducts is unavailable");
        }

        await productService.updateProducts([
          { id: (existingProduct as { id: string }).id, ...payload },
        ]);
      } else {
        if (typeof productService.createProducts !== "function") {
          throw new Error("ProductModuleService.createProducts is unavailable");
        }

        await productService.createProducts([payload]);
      }

      imported += 1;
    } catch (error) {
      errors.push({
        row: rowNumber,
        id: row.id,
        handle: row.handle,
        error: getErrorMessage(error),
      });
    }
  }

  return res.status(200).json({
    imported,
    skipped,
    errors,
  });
}
