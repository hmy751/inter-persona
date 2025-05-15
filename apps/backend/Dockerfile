FROM node:20-alpine AS builder

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

RUN mkdir /deploy
RUN pnpm --filter=@apps/backend deploy /deploy --prod

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /deploy .

RUN echo "--- Runner: Verifying file structure ---" && \
    echo "Current directory: $(pwd)" && \
    echo "Listing /app root (ls -Al /app):" && \
    ls -Al /app && \
    echo "Recursive listing of /app (ls -R /app) - first few levels:" && \
    ls -R /app | head -n 50 && \
    echo "Checking existence of /app/dist/app.js:" && \
    (test -f /app/dist/app.js && echo "/app/dist/app.js EXISTS" || echo "/app/dist/app.js NOT FOUND") && \
    echo "Checking existence of /app/apps/backend/dist/app.js (should NOT exist):" && \
    (test -f /app/apps/backend/dist/app.js && echo "/app/apps/backend/dist/app.js EXISTS (UNEXPECTED)" || echo "/app/apps/backend/dist/app.js NOT FOUND (EXPECTED)") && \
    echo "Checking /app/node_modules/dotenv symlink:" && \
    (ls -l /app/node_modules/dotenv || echo "/app/node_modules/dotenv symlink NOT FOUND") && \
    echo "Checking actual dotenv in .pnpm:" && \
    (find /app/node_modules/.pnpm -name dotenv -type d -path '*/node_modules/dotenv' -print -exec ls -ld {} \; || echo "dotenv not found in .pnpm structure") && \
    echo "Checking package.json in /app:" && \
    (ls -l /app/package.json && echo "Content of /app/package.json:" && cat /app/package.json || echo "/app/package.json NOT FOUND") && \
    echo "--- Runner: File structure verification end ---"

EXPOSE 8000

CMD ["node", "dist/app.js"]
