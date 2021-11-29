# Build stage
FROM node:14.15 as build
LABEL maintainer="dlopez@humboldt.org.co"
USER node

ENV NPM_CONFIG_LOGLEVEL warn
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node . .
WORKDIR /home/node/app/packages/cbm-dashboard
RUN yarn install
RUN yarn run build-pkg

WORKDIR /home/node/app/packages/indicators
RUN yarn install
RUN yarn run build-pkg

WORKDIR /home/node/app
RUN yarn install
RUN yarn build

# Release stage
FROM node:14.15 as release

COPY --from=build /home/node/app/build ./build
RUN yarn global add serve
EXPOSE 5000
CMD [ "serve", "-s", "build" ]
