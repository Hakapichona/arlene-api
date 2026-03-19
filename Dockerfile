FROM node:22-bookworm-slim AS base

WORKDIR /usr/src/app

RUN corepack enable

FROM base AS development

ENV NODE_ENV=development

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

RUN mkdir -p /usr/src/app/uploads

EXPOSE 3000

CMD ["pnpm", "start:dev"]