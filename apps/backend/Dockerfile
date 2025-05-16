FROM node:20-slim AS builder

RUN apt-get update && apt-get install -y openssl libssl3 && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/ ./apps/
COPY packages/ ./packages/

RUN pnpm install --frozen-lockfile

ARG TURBO_TOKEN
ARG TURBO_TEAM
ENV TURBO_TOKEN=$TURBO_TOKEN
ENV TURBO_TEAM=$TURBO_TEAM

RUN pnpm turbo run build --filter=@apps/backend

RUN pnpm turbo run prisma:generate --filter=@apps/backend

RUN mkdir /deploy_target_root
RUN pnpm --filter=@apps/backend deploy /deploy_target_root --prod


FROM node:20-slim AS runner

RUN apt-get update && apt-get install -y libssl3 ca-certificates && rm -rf /var/lib/apt/lists/* 

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /deploy_target_root . 

RUN echo "--- Runner (Debian, as root): Verifying File Structure & Built Code ---" && \
  echo "Current directory: $(pwd)" && \
  ls -Al /app && \
  (test -f /app/dist/app.js && echo "/app/dist/app.js EXISTS") || echo "/app/dist/app.js NOT FOUND" && \
  (ls -l /app/node_modules/@prisma/client && echo "@prisma/client symlink details displayed") || echo "@prisma/client symlink NOT FOUND or ls -l failed" && \
  echo "--- Runner (Debian, as root): File structure verification and code check end ---"

EXPOSE 8000

CMD ["pnpm", "--filter", "@apps/backend", "start:backend"]
