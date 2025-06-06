FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

COPY apps/frontend/package.json ./apps/frontend/package.json

COPY packages/ ./packages/
COPY apps/frontend/ ./apps/frontend/

RUN pnpm install --frozen-lockfile

COPY . .

ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN
ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM
ARG NEXT_PUBLIC_CLIENT_SECRET
ENV NEXT_PUBLIC_CLIENT_SECRET=$NEXT_PUBLIC_CLIENT_SECRET
ARG NEXT_PUBLIC_INVOKE_URL
ENV NEXT_PUBLIC_INVOKE_URL=$NEXT_PUBLIC_INVOKE_URL
ARG NEXT_PUBLIC_API_HOST
ENV NEXT_PUBLIC_API_HOST=$NEXT_PUBLIC_API_HOST
ARG NEXT_PUBLIC_CLARITY
ENV NEXT_PUBLIC_CLARITY=$NEXT_PUBLIC_CLARITY
ARG NEXT_PUBLIC_GTM
ENV NEXT_PUBLIC_GTM=$NEXT_PUBLIC_GTM

RUN pnpm turbo build --filter=@apps/frontend

FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

ENV NODE_ENV=production

COPY --from=builder /app/apps/frontend/.next ./apps/frontend/.next/
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public/
COPY --from=builder /app/apps/frontend/package.json ./apps/frontend/package.json
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml .
COPY --from=builder /app/pnpm-workspace.yaml .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @apps/frontend install --prod

RUN pnpm --filter @apps/frontend exec next --version || echo "next 패키지 설치 실패"

ENV PATH /app/node_modules/.bin:$PATH

EXPOSE 3000

CMD ["pnpm", "--filter", "@apps/frontend", "start:prod"]
