# Build stage
FROM node:14.15 as build
MAINTAINER Daniel Lopez "dlopez@humboldt.org.co"

ENV NPM_CONFIG_LOGLEVEL warn
COPY package.json package.json
RUN yarn install --production
COPY . .
RUN yarn run build

# Release stage
FROM node:14.15 as release

COPY --from=build /build ./build
RUN yarn install -g serve
EXPOSE 5000
CMD [ "serve", "-s", "build" ]
