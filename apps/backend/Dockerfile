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

RUN echo "--- Runner: Verifying File Structure & Built Code ---" && \
    echo "Current directory: $(pwd)" && \
    echo "Listing /app root (ls -Al /app):" && \
    ls -Al /app && \
    echo "Checking existence of /app/dist/app.js:" && \
    (test -f /app/dist/app.js && echo "/app/dist/app.js EXISTS" || echo "/app/dist/app.js NOT FOUND") && \
    echo "Checking /app/node_modules/dotenv symlink:" && \
    (ls -l /app/node_modules/dotenv || echo "/app/node_modules/dotenv symlink NOT FOUND") && \
    echo "Checking actual dotenv in .pnpm:" && \
    (find /app/node_modules/.pnpm -name dotenv -type d -path '*/node_modules/dotenv' -print -exec ls -ld {} \; || echo "dotenv not found in .pnpm structure") && \
    echo "Content of /app/package.json:" && \
    (cat /app/package.json || echo "/app/package.json NOT FOUND") && \
    echo "--- First 30 lines of /app/dist/app.js (to check dotenv import) ---" && \
    (cat /app/dist/app.js | head -n 30 || echo "/app/dist/app.js not found or cat failed") && \
    echo "--- Grepping for 'dotenv' in /app/dist/app.js ---" && \
    (grep 'dotenv' /app/dist/app.js || echo "'dotenv' string not found in /app/dist/app.js") && \
    echo "--- Runner: File structure verification and code check end ---"

EXPOSE 8000

CMD ["node", "-e", "\
console.log('--- FINAL TEST: Node.js Direct dotenv Import (via Dockerfile CMD) ---'); \
console.log('Timestamp:', new Date().toISOString()); \
console.log('process.env.NODE_ENV:', process.env.NODE_ENV); \
console.log('Current working directory (process.cwd()):', process.cwd()); \
console.log('Attempting to import dotenv/config directly:'); \
import('dotenv/config') \
  .then(() => { \
    console.log('SUCCESS: dotenv/config imported directly.'); \
    console.log('DATABASE_URL from process.env (example from secrets):', process.env.DATABASE_URL ? 'Exists' : 'NOT FOUND'); \
  }) \
  .catch(err => { \
    console.error('ERROR: Failed to import dotenv/config directly:', err); \
    console.error('Error Name:', err.name); \
    console.error('Error Message:', err.message); \
    console.error('Error Code:', err.code); \
    console.error('Error Stack:', err.stack); \
  }); \
console.log('--- FINAL TEST End (via Dockerfile CMD) ---'); \
setInterval(() => { console.log('Container alive with FINAL TEST CMD...'); }, 300000); \
"]