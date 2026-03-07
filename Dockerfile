FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache python3 make g++ curl
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npx medusa build && mkdir -p /app/public && ln -sfn /app/.medusa/server/public/admin /app/public/admin
EXPOSE 9000
CMD ["npx", "medusa", "start"]
