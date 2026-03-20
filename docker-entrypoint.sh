#!/bin/sh
set -e

# Conditionally preload Sentry instrumentation (RFC-001)
INSTRUMENT_PATH="/app/.medusa/server/src/instrument.js"
if [ -f "$INSTRUMENT_PATH" ]; then
  export NODE_OPTIONS="--require $INSTRUMENT_PATH ${NODE_OPTIONS:-}"
fi

exec "$@"
