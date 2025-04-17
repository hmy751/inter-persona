FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

COPY apps/frontend/package.json ./apps/frontend/package.json

COPY packages/ ./packages/
COPY apps/frontend/ ./apps/frontend/

RUN pnpm install --frozen-lockfile


RUN pnpm turbo build --filter=@apps/frontend

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/frontend/.next ./apps/frontend/.next/
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public/
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/apps/frontend/package.json ./apps/frontend/package.json
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["pnpm", "--filter", "@apps/frontend", "start"]