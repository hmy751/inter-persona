FROM node:20-slim AS builder

USER root
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*
USER node

RUN npm install -g pnpm
WORKDIR /app

COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY --chown=node:node apps/ ./apps/
COPY --chown=node:node packages/ ./packages/

RUN pnpm install --frozen-lockfile

ARG TURBO_TOKEN
ARG TURBO_TEAM
ENV TURBO_TOKEN=$TURBO_TOKEN
ENV TURBO_TEAM=$TURBO_TEAM

RUN pnpm turbo run build --filter=@apps/backend
RUN pnpm turbo run prisma:generate --filter=@apps/backend

RUN mkdir /deploy
RUN pnpm --filter=@apps/backend deploy /deploy --prod

FROM node:20-slim AS runner

USER root
RUN apt-get update && apt-get install -y openssl libssl3 && rm -rf /var/lib/apt/lists/*
USER node

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node /deploy .


RUN echo "--- Runner (Debian): Verifying File Structure & Built Code ---" && \
  echo "Current directory: $(pwd)" && \
  ls -Al /app && \
  (test -f /app/dist/app.js && echo "/app/dist/app.js EXISTS") || echo "/app/dist/app.js NOT FOUND" && \
  (ls -l /app/node_modules/@prisma/client && echo "@prisma/client symlink details displayed") || echo "@prisma/client symlink NOT FOUND or ls -l failed" && \
  echo "--- Runner (Debian): File structure verification and code check end ---"


EXPOSE 8000

CMD ["node", "dis/app.js"]
