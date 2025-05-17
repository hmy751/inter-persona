FROM node:20 AS builder

RUN apt-get update && apt-get install -y openssl libssl3 && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/constant/package.json ./packages/constant/package.json
COPY packages/schema/package.json ./packages/schema/package.json

RUN pnpm install --frozen-lockfile

COPY apps/ ./apps/
COPY packages/ ./packages/

ARG TURBO_TOKEN
ARG TURBO_TEAM
ENV TURBO_TOKEN=$TURBO_TOKEN
ENV TURBO_TEAM=$TURBO_TEAM

RUN echo "Generating Prisma Client for @apps/backend..."
RUN pnpm turbo run prisma:generate --filter=@apps/backend

RUN echo "Building @apps/backend..."
RUN pnpm turbo run build --filter=@apps/backend

RUN mkdir -p /deploy_target_root
RUN echo "Deploying @apps/backend to /deploy_target_root..."
RUN pnpm --filter=@apps/backend deploy /deploy_target_root --prod


FROM node:20 AS runner

RUN apt-get update && apt-get install -y libssl3 ca-certificates && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /deploy_target_root .

RUN echo "--- Runner: Verifying File Structure & Built Code in /app ---" && \
    echo "Current directory: $(pwd)" && \
    ls -Al /app && \
    echo "--- Verifying /app/dist/app.js ---" && \
    (test -f /app/dist/app.js && echo "/app/dist/app.js EXISTS") || echo "/app/dist/app.js NOT FOUND - THIS IS A CRITICAL PROBLEM!" && \
    echo "--- Verifying /app/package.json content (should be backend's package.json) ---" && \
    cat /app/package.json && \
    echo "--- Verifying /app/node_modules/@prisma/client directory ---" && \
    (test -d /app/node_modules/@prisma/client && echo "/app/node_modules/@prisma/client EXISTS") || echo "/app/node_modules/@prisma/client NOT FOUND - THIS IS A CRITICAL PROBLEM!" && \
    echo "--- Verifying Prisma query engine binary (debian-openssl-3.0.x) ---" && \
    (find /app/node_modules/.prisma/client -name "*query_engine-debian-openssl-3.0.x*" -type f -print -quit && echo "Prisma Debian OpenSSL 3.0.x engine FOUND in .prisma/client") || echo "Prisma Debian OpenSSL 3.0.x engine NOT FOUND in .prisma/client - THIS IS A MAJOR PROBLEM! Ensure schema.prisma 'binaryTargets' is correct and 'libssl3' is installed." && \
    echo "--- Runner: File structure verification complete ---"

EXPOSE 8000

CMD ["pnpm", "start:backend"]
