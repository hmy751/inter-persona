FROM node:20 AS base

RUN apt-get update && \
    apt-get install -y openssl libssl3 ca-certificates && \
    rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

FROM base AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/constant/package.json ./packages/constant/package.json
COPY packages/schema/package.json ./packages/schema/package.json

RUN pnpm install --frozen-lockfile

COPY . .

ARG TURBO_TOKEN
ARG TURBO_TEAM
ENV TURBO_TOKEN=$TURBO_TOKEN
ENV TURBO_TEAM=$TURBO_TEAM

RUN echo "Generating Prisma Client for @apps/backend (schema: apps/backend/prisma/schema.prisma)..."
RUN pnpm --filter=@apps/backend exec prisma generate --schema=./prisma/schema.prisma

RUN echo "Building @apps/backend..."
RUN pnpm turbo run build --filter=@apps/backend

RUN echo "Preparing @apps/backend for deployment using pnpm deploy to /app_deploy..."
RUN mkdir -p /app_deploy
RUN pnpm --filter=@apps/backend deploy /app_deploy --prod


FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app_deploy .

RUN echo "--- Runner: Verifying deployed files in /app ---" && \
    echo "Current directory: $(pwd)" && \
    ls -Al /app && \
    echo "--- Verifying /app/dist/app.js ---" && \
    (test -f /app/dist/app.js && echo "OK: /app/dist/app.js found.") || (echo "CRITICAL ERROR: /app/dist/app.js NOT FOUND! Check build output and pnpm deploy." && exit 1) && \
    echo "--- Verifying /app/package.json (should be backend's package.json) ---" && \
    (test -f /app/package.json && echo "OK: /app/package.json found. Content preview:" && head -n 15 /app/package.json) || (echo "CRITICAL ERROR: /app/package.json NOT FOUND!" && exit 1) && \
    echo "--- Verifying Prisma Client in node_modules ---" && \
    (test -d /app/node_modules/@prisma/client && echo "OK: /app/node_modules/@prisma/client found.") || (echo "CRITICAL ERROR: /app/node_modules/@prisma/client NOT FOUND! Prisma Client packaging failed." && exit 1) && \
    echo "--- Verifying Prisma Query Engine (debian-openssl-3.0.x) ---" && \
    (find /app/node_modules/.prisma/client -name "*query_engine-debian-openssl-3.0.x*" -type f -print -quit && echo "OK: Prisma query engine for debian-openssl-3.0.x found.") || (echo "CRITICAL ERROR: Prisma query engine for debian-openssl-3.0.x NOT FOUND in /app/node_modules/.prisma/client! Check 'prisma generate' binaryTargets and 'pnpm deploy' packaging." && exit 1) && \
    echo "--- Runner: File verification successful. ---"

EXPOSE 8000

CMD ["node", "dist/app.js", "--hostname", "0.0.0.0", "--port", "8000"]
