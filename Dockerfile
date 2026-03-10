FROM node:20-alpine

WORKDIR /app

# Build dependencies
RUN apk add --no-cache python3 make g++ curl

# Layer 1: dependencies (always use npm install, never npm ci)
COPY package.json ./

RUN npm install --legacy-peer-deps

# Layer 2: source code
COPY . .

# Layer 3: build backend only (skip Admin Vite compilation ~3-5 min)
# medusa-config.ts reads DISABLE_MEDUSA_ADMIN to set admin.disable
ENV DISABLE_MEDUSA_ADMIN=true
RUN npx medusa build

# Reset so admin is enabled at runtime
ENV DISABLE_MEDUSA_ADMIN=false

# Admin static files link (no-op if admin wasn't built, harmless)
RUN mkdir -p /app/public && \
    ln -sfn /app/.medusa/server/public/admin /app/public/admin 2>/dev/null || true

EXPOSE 9000

CMD ["npx", "medusa", "start"]
