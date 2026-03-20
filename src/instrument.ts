/**
 * Sentry instrumentation — must be imported/required BEFORE any other modules.
 *
 * Loaded via NODE_OPTIONS="--require ./.medusa/server/src/instrument.js" in production.
 * For local dev, import this at the top of the entry file or set NODE_OPTIONS in .env.
 *
 * RFC-001 / Engineering Excellence Framework — Incident Management L2 → L3
 */
import * as Sentry from "@sentry/node";

const dsn = process.env.SENTRY_DSN;
const env = process.env.NODE_ENV || "production";

// No-op if DSN is not configured (local dev / test environments)
if (dsn && env !== "test") {
  Sentry.init({
    dsn,
    environment: env,
    release: process.env.GITHUB_SHA || "local",

    // Capture 10% of transactions for performance monitoring
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || "0.1"),

    // Reduce noise: ignore known non-actionable errors
    ignoreErrors: ["ECONNRESET", "EPIPE", "AbortError"],

    beforeSend(event) {
      // Strip sensitive cookie data before sending to Sentry
      if (event.request) {
        delete event.request.cookies;
      }
      return event;
    },
  });

  console.log(`[Sentry] Initialized — env: ${env}, release: ${process.env.GITHUB_SHA || "local"}`);
}

export { Sentry };
