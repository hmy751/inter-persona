FROM node:20-alpine AS builder

RUN npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/ ./packages/

COPY . .

RUN pnpm install --frozen-lockfile

ARG TURBO_TOKEN
ARG TURBO_TEAM
ENV TURBO_TOKEN=$TURBO_TOKEN
ENV TURBO_TEAM=$TURBO_TEAM

RUN pnpm turbo build --filter=@apps/backend

# --- Runner 스테이지 ---
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

ENV NODE_ENV=production

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist/
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/packages ./packages

COPY --from=builder /app/node_modules ./node_modules


EXPOSE 8000

CMD ["pnpm", "--filter", "@apps/backend", "run", "start:backend"]
