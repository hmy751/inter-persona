FROM node:20.18.1 AS base

RUN npm install -g pnpm

WORKDIR /app

FROM base AS builder

ARG TURBO_TOKEN
ARG TURBO_TEAM
ENV TURBO_TOKEN=${TURBO_TOKEN}
ENV TURBO_TEAM=${TURBO_TEAM}

COPY --chown=node:node package.json pnpm-lock.yaml turbo.json pnpm-workspace.yaml ./

COPY --chown=node:node apps/backend/package.json ./apps/backend/
COPY --chown=node:node apps/backend/prisma/schema.prisma ./apps/backend/prisma/schema.prisma 

COPY --chown=node:node packages/ ./packages/

RUN pnpm install --frozen-lockfile

COPY --chown=node:node . .

WORKDIR /app/apps/backend

RUN pnpm run prisma:generate 

WORKDIR /app

RUN pnpm turbo run build --filter=@apps/backend

RUN pnpm --filter @apps/backend deploy --prod /app/deploy/apps/backend

FROM base AS runner

WORKDIR /home/node/app

ENV NODE_ENV production

COPY --from=builder --chown=node:node /app/deploy/apps/backend/ ./
COPY --from=builder --chown=node:node /app/apps/backend/prisma ./prisma

RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

USER node

EXPOSE 8000

CMD ["node", "dist/app.js", "--hostname", "0.0.0.0", "--port", "8000"]
