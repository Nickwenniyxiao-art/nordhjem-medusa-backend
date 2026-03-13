import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

type AiGenerateField = "description" | "seo_title" | "seo_description";

type AiGenerateBody = {
  field?: AiGenerateField;
  language?: string;
};

function isAllowedField(field: string | undefined): field is AiGenerateField {
  return !!field && ["description", "seo_title", "seo_description"].includes(field);
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = (req.body || {}) as AiGenerateBody;
  const productId = String((req.params as Record<string, string>)?.id || "");

  if (!productId) {
    return res.status(400).json({ error: "product id is required" });
  }

  if (!isAllowedField(body.field)) {
    return res.status(400).json({
      error: "field must be one of description, seo_title, seo_description",
    });
  }

  return res.status(200).json({
    product_id: productId,
    field: body.field,
    language: body.language || "en",
    generated: `AI-generated placeholder for ${body.field}`,
    model: "placeholder",
    usage: {
      tokens: 0,
    },
    phase: "phase_1_mock",
  });
}
