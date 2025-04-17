FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY . .

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/frontend/.next /app/apps/frontend/.next
COPY --from=builder /app/apps/frontend/public /app/apps/frontend/public
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/frontend/package.json /app/apps/frontend/package.json
COPY --from=builder /app/package.json /app/package.json # 루트 package.json도 필요할 수 있음

EXPOSE 3000

CMD ["pnpm", "--filter", "@apps/frontend", "start"] 