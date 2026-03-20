ARG NODE_IMG_TAG=22-alpine
ARG BUILD_CMD=build

# Build stage
FROM node:$NODE_IMG_TAG AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NPM_CONFIG_LOGLEVEL=warn
WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install --frozen-lockfile

COPY . .

ARG BUILD_CMD
RUN pnpm $BUILD_CMD

# Release stage
FROM node:$NODE_IMG_TAG AS release

WORKDIR /app

COPY --from=build /app/dist ./dist

RUN npm install -g serve@~13.0.0

EXPOSE 5000
CMD [ "serve", "-p", "5000", "-s", "dist" ]
