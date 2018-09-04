# Build stage
FROM node:8.11.3-alpine as build
MAINTAINER Daniel Lopez "dlopez@humboldt.org.co"

ENV NPM_CONFIG_LOGLEVEL warn
COPY package.json package.json
RUN npm install --production
COPY . .
RUN npm run build --production

# Release stage
FROM node:8.11.3-alpine as release

COPY --from=build /build ./build
RUN npm install -g serve
EXPOSE 5000
CMD [ "serve", "-s", "build" ]