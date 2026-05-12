# ShopMotion v1 - 部署指南

## 环境要求

- Node.js >= 18
- npm >= 9

## 快速开始

```bash
# 1. 安装依赖
cd ShopMotion
npm install

# 2. 配置环境变量（可选）
cp .env.example .env
# 编辑 .env 填入 FEISHU_WEBHOOK_URL（可选）

# 3. 启动后端 API（端口 3001）
npm run dev:server

# 4. 启动前端（端口 5173）
npm run dev:frontend

# 5. 启动 Remotion Studio（可选）
npm run dev:remotion
```

## 环境变量

| 变量 | 说明 | 必填 |
|------|------|------|
| `FEISHU_WEBHOOK_URL` | 飞书机器人 Webhook 地址 | 否 |
| `PORT` | 后端端口 | 否（默认 3001） |
| `VITE_API_BASE` | 前端 API 地址 | 否（默认 http://localhost:3001/api） |

## 访问地址

- 前端: http://localhost:5173
- API: http://localhost:3001/api
- Remotion Studio: http://localhost:3000

## Docker 部署（预留）

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3001 5173
CMD ["npm", "run", "dev:server"]
```
