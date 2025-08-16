# Build stage
FROM node:22-alpine AS build

# (Por si tenemos addons nativos) 
# RUN apk add --no-cache python3 make g++

# Corepac + pnpm actualizado para evitar el lio de las keys
RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NPM_CONFIG_LOGLEVEL=warn
WORKDIR /app

COPY . .

# Congelamos todas las versiones para evitar lios
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Release stage
FROM node:22-alpine AS release

WORKDIR /app

COPY --from=build /app/build ./build

RUN npm install -g serve@~13.0.0

EXPOSE 5000
CMD [ "serve", "-p", "5000", "-s", "build" ]
