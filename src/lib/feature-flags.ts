/**
 * Feature Flags — NordHjem
 *
 * Simple environment-variable based feature flag system.
 * All flags default to false/off in production unless explicitly enabled.
 *
 * Engineering Excellence Framework — Deployment L3 → L4
 * Enables canary rollouts and A/B testing without code deployments.
 */

export type FeatureFlag =
  | "RESTOCK_NOTIFICATIONS"
  | "TICKET_MODULE"
  | "BRAND_MODULE"
  | "AI_REVIEW_GATE"
  | "EXPERIMENTAL_CHECKOUT";

const FLAGS: Record<FeatureFlag, boolean> = {
  RESTOCK_NOTIFICATIONS: env("FF_RESTOCK_NOTIFICATIONS", true),
  TICKET_MODULE: env("FF_TICKET_MODULE", true),
  BRAND_MODULE: env("FF_BRAND_MODULE", true),
  AI_REVIEW_GATE: env("FF_AI_REVIEW_GATE", false),
  EXPERIMENTAL_CHECKOUT: env("FF_EXPERIMENTAL_CHECKOUT", false),
};

function env(key: string, defaultValue: boolean): boolean {
  const val = process.env[key];
  if (val === undefined) return defaultValue;
  return val === "1" || val.toLowerCase() === "true";
}

export function isEnabled(flag: FeatureFlag): boolean {
  return FLAGS[flag] ?? false;
}

export function getAllFlags(): Record<FeatureFlag, boolean> {
  return { ...FLAGS };
}
