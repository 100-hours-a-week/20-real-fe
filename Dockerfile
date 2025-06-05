# Stage 1: 빌드
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install -g pnpm && pnpm install 

COPY . .
RUN pnpm run build
RUN rm -rf node_modules/.cache .next/cache 

# Stage 2: 런타임
FROM node:18-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm

# 의존성 및 빌드 결과 복사
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/package.json ./package.json

USER node

EXPOSE 3000

CMD ["pnpm", "start"]  