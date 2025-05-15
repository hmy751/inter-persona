FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/ ./packages/
COPY apps/backend/prisma ./apps/backend/prisma/

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @apps/backend exec prisma generate --schema=./apps/backend/prisma/schema.prisma

ARG TURBO_TOKEN
ARG TURBO_TEAM
ENV TURBO_TOKEN=$TURBO_TOKEN
ENV TURBO_TEAM=$TURBO_TEAM

RUN pnpm turbo build --filter=@apps/backend

# --- Runner 스테이지 ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
RUN npm install -g pnpm

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist/
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

EXPOSE 8000

CMD ["sh", "-c", "echo '--- [Runner Stage] Listing /app/node_modules/.prisma/client ---' && ls -lA /app/node_modules/.prisma/client && echo '--- [Runner Stage] Listing /app/node_modules/@prisma/client/generated (if it exists, for pnpm structure) ---' && ls -lA /app/node_modules/@prisma/client/generated || echo 'Generated dir not found' && echo '--- [Runner Stage] Checking specific Prisma Client file expected by error message ---' && ls -lA /app/node_modules/.pnpm/@prisma+client@6.6.0_prisma@6.6.0_typescript@5.5.4__typescript@5.5.4/node_modules/.prisma/client/default.js || echo 'Specific default.js not found' && echo '--- [Runner Stage] Attempting to run app ---' && pnpm --filter @apps/backend run start:backend"]
