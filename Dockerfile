FROM hub.lumigame.com/docker-hub/library/node:20.14-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock .modprunerrc ./
RUN npm run reg \
    && yarn install
COPY . .
RUN npm run build \
    && rm -rf ./node_modules
RUN yarn install --production \
    && npx mod-pruner prune --force 

FROM hub.lumigame.com/docker-hub/library/node:20.14-alpine
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN mkdir /app && chown node:node /app
WORKDIR /app

RUN apk --no-cache add curl

USER node
ENV PATH /app/node_modules/.bin:$PATH

HEALTHCHECK  --interval=10s CMD curl --fail http://localhost:5000 || exit 1

# Command to run the app
CMD ["node", "dist/server.js"]