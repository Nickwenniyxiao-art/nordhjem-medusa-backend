FROM node:20-alpine

WORKDIR /app

# Build dependencies
RUN apk add --no-cache python3 make g++ curl

# Layer 1: dependencies (always use npm install, never npm ci)
COPY package.json package-lock.json ./

RUN npm ci --legacy-peer-deps --maxsockets=2 --network-timeout=120000

# Layer 2: source code
COPY . .

# Layer 3: build backend + admin frontend
RUN npx medusa build

# Admin static files link
RUN mkdir -p /app/public && \
    ln -sfn /app/.medusa/server/public/admin /app/public/admin 2>/dev/null || true

EXPOSE 9000

# Sentry instrumentation: only preload if build emitted the file (RFC-001)
# If medusa build skips instrument.js, the server starts without Sentry
# rather than crash-looping with MODULE_NOT_FOUND.
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npx", "medusa", "start"]
