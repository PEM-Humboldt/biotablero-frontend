# Build stage
FROM node:22.12-slim as build
RUN corepack enable

ENV NPM_CONFIG_LOGLEVEL warn
RUN mkdir /app
WORKDIR /app

COPY . .
WORKDIR /app
RUN pnpm -r install
RUN pnpm -r build-pkg
RUN pnpm install
RUN pnpm build

# Release stage
FROM node:22.12-slim as release

COPY --from=build /app/build ./build
RUN npm install -g serve@~13.0.0
EXPOSE 5000
CMD [ "serve", "-p", "5000", "-s", "build" ]
