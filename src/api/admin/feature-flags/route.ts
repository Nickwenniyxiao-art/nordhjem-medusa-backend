import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { getAllFlags } from "../../../lib/feature-flags";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  res.json({
    flags: getAllFlags(),
    environment: process.env.NODE_ENV || "production",
  });
};
