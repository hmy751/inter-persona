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

RUN echo "--- Runner: Deployed files structure ---" && ls -R && echo "--- End of structure ---"
RUN echo "--- Runner: Checking for dotenv in deployed node_modules ---" && \
    (find ./node_modules -name dotenv -type d -print -exec ls -ld {} \; || echo "dotenv not found in deployed node_modules") && \
    echo "--- Runner: dotenv check end ---"
# --- 디버깅 라인 끝 ---

EXPOSE 8000

CMD ["node", "dist/app.js"]
