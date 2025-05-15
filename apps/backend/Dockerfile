FROM node:20-alpine AS builder

RUN npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

COPY packages/ ./packages/

COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/backend/ ./apps/backend/

RUN pnpm install --frozen-lockfile

ARG TURBO_TOKEN
ARG TURBO_TEAM
ENV TURBO_TOKEN=$TURBO_TOKEN
ENV TURBO_TEAM=$TURBO_TEAM

RUN pnpm turbo build --filter=@apps/backend

# --- 최종 실행 환경 (Runner) ---
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist/

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

EXPOSE 8000

CMD ["node", "./apps/backend/dist/app.js"]
