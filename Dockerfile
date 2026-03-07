FROM node:20-alpine

WORKDIR /app

# 构建依赖
RUN apk add --no-cache python3 make g++ curl

# 先复制依赖清单，利用 Docker 缓存层
COPY package*.json ./

# 安装依赖（优先 npm ci，失败则回退）
RUN if [ -f package-lock.json ]; then \
      npm ci --legacy-peer-deps || npm install --legacy-peer-deps; \
    else \
      npm install --legacy-peer-deps; \
    fi

# 复制源码
COPY . .

# 编译 TypeScript → JavaScript (medusa build)
RUN npx medusa build

# 创建 admin 静态文件链接
RUN mkdir -p /app/public && \
    ln -sfn /app/.medusa/server/public/admin /app/public/admin

EXPOSE 9000

CMD ["npx", "medusa", "start"]
