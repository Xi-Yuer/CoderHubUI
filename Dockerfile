# 第一阶段：构建阶段
FROM node:23-alpine AS build-stage

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（如果存在）
COPY package*.json ./

# 安装依赖，仅安装生产依赖
RUN npm install --legacy-peer-deps

# 复制所有源代码
COPY . .

# 设置环境变量
# websocket地址
ENV NEXT_PUBLIC_APP_WEBSOCKET_URL=wss://xiyuer.club
# 站点域名
ENV NEXT_PUBLIC_SITE_DOMAIN=https://xiyuer.club

# 构建 Next.js 项目
RUN npm run build

# 第二阶段：运行阶段
FROM node:23 AS run-stage

# 设置工作目录
WORKDIR /app


ENV NODE_ENV=production

# 仅复制构建产物和必要文件
COPY --from=build-stage /app/package*.json ./
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/.next ./.next
COPY --from=build-stage /app/public ./public

# 暴露端口
EXPOSE 3000

# 运行 Next.js
CMD ["npm", "start"]