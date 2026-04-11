# ------------------------------------------------------
# Base
# ------------------------------------------------------
FROM node:22-bookworm-slim AS base

WORKDIR /usr/src/app

RUN corepack enable

# ------------------------------------------------------
# Builder
# ------------------------------------------------------
FROM base AS builder

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# ------------------------------------------------------
# Production dependencies
# ------------------------------------------------------
FROM base AS prod-deps

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# ------------------------------------------------------
# Production
# ------------------------------------------------------
FROM node:22-bookworm-slim AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

RUN corepack enable \
    && groupadd -r nodejs \
    && useradd -r -g nodejs nodeuser \
    && mkdir -p /usr/src/app/uploads

COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./package.json

RUN chown -R nodeuser:nodejs /usr/src/app

USER nodeuser

EXPOSE 3000

CMD ["node", "dist/main.js"]