# Build stage
FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NPM_CONFIG_LOGLEVEL=warn
WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm build

# Release stage
FROM node:22-alpine AS release

WORKDIR /app

COPY --from=build /app/dist ./dist

RUN npm install -g serve@~13.0.0

EXPOSE 5000
CMD [ "serve", "-p", "5000", "-s", "dist" ]
