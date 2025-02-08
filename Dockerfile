# 第一阶段：构建前端
FROM node:23 AS build-stage

# 设置工作目录
WORKDIR /app

# 复制package.json到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install --legacy-peer-deps

# 复制源代码到工作目录
COPY . .

# 构建前端
RUN npm run build

# 暴露端口
EXPOSE 3000

CMD ["npm", "start"]
