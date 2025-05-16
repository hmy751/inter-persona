FROM node:20-slim AS builder

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

FROM node:20-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /deploy .


RUN echo "--- Runner (Debian): Verifying File Structure & Built Code ---" && \
  echo "Current directory: $(pwd)" && \
  ls -Al /app && \
  (test -f /app/dist/app.js && echo "/app/dist/app.js EXISTS") || echo "/app/dist/app.js NOT FOUND" && \
  (ls -l /app/node_modules/@prisma/client && echo "@prisma/client symlink details displayed") || echo "@prisma/client symlink NOT FOUND or ls -l failed" && \
  echo "--- Runner (Debian): File structure verification and code check end ---"


EXPOSE 8000

CMD ["node", "--enable-source-maps", "-e", "\
console.log('--- MINIMAL PRISMA CLIENT INSTANTIATION TEST ---'); \
import { PrismaClient } from '@prisma/client'; \
console.log('Attempting to instantiate PrismaClient...'); \
let prisma_instance; \
try { \
  prisma_instance = new PrismaClient({ \
    log: [{ emit: 'stdout', level: 'query' }, { emit: 'stdout', level: 'info' }, { emit: 'stdout', level: 'warn' }, { emit: 'stdout', level: 'error' }], \
  }); \
  console.log('SUCCESS: PrismaClient instantiated.'); \
  console.log('Attempting to connect (simple $connect call)...'); \
  prisma_instance.$connect() \
    .then(() => { \
      console.log('SUCCESS: PrismaClient connected via $connect().'); \
      /* 간단한 실제 쿼리 시도 (테이블이 존재하고 DATABASE_URL이 유효해야 함) */ \
      /* 예를 들어 User 모델이 있다면: */ \
      /* return prisma_instance.user.count(); */ \
      /* 간단히 연결만 확인하려면 위 쿼리 없이 $disconnect만 호출 */ \
      return Promise.resolve('Simulated query success after connect'); \
    }) \
    .then((result) => { \
      console.log('Query/Operation after connect:', result); \
    }) \
    .catch(connErr => { \
      console.error('ERROR: PrismaClient $connect() or subsequent operation failed:', connErr); \
    }) \
    .finally(() => { \
      console.log('Attempting to $disconnect...'); \
      return prisma_instance.$disconnect().then(() => console.log('PrismaClient disconnected.')).catch(discErr => console.error('ERROR during $disconnect:', discErr)); \
    }); \
} catch (err) { \
  console.error('ERROR: Failed to instantiate PrismaClient:', err); \
  console.error('Error Name:', err.name); \
  console.error('Error Message:', err.message); \
  console.error('Error Code:', err.code); \
  console.error('Error Stack:', err.stack); \
} \
console.log('--- MINIMAL PRISMA TEST END ---'); \
setInterval(() => { console.log('Container alive with Minimal Prisma Test CMD...'); }, 300000); \
"]