# ------------------------------------------------------
# Base
# ------------------------------------------------------
FROM node:22-bookworm-slim AS base

WORKDIR /usr/src/app

RUN corepack enable

# ------------------------------------------------------
# Development
# ------------------------------------------------------
FROM base AS development

ENV NODE_ENV=development

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Crear carpeta de uploads dentro del contenedor
RUN mkdir -p /usr/src/app/uploads

EXPOSE 3000

CMD ["pnpm", "start:dev"]

## ------------------------------------------------------
## Builder
## ------------------------------------------------------
#FROM base AS builder
#
#ENV NODE_ENV=production
#
#COPY package.json pnpm-lock.yaml ./
#RUN pnpm install --frozen-lockfile
#
#COPY . .
#
#RUN pnpm build
#
## ------------------------------------------------------
## Production dependencies
## ------------------------------------------------------
#FROM base AS prod-deps
#
#ENV NODE_ENV=production
#
#COPY package.json pnpm-lock.yaml ./
#RUN pnpm install --prod --frozen-lockfile
#
## ------------------------------------------------------
## Production
## ------------------------------------------------------
#FROM node:22-bookworm-slim AS production
#
#ENV NODE_ENV=production
#ENV API_PORT=3000
#
#WORKDIR /usr/src/app
#
#RUN corepack enable \
#    && groupadd -r nodejs \
#    && useradd -r -g nodejs nodeuser
#
#COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
#COPY --from=builder /usr/src/app/dist ./dist
#COPY --from=builder /usr/src/app/package.json ./package.json
#
#RUN chown -R nodeuser:nodejs /usr/src/app
#
#USER nodeuser
#
#EXPOSE 3000
#
#CMD ["node", "dist/main"]