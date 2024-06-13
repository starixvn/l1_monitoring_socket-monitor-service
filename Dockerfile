# Use the official Node.js 20.14 image as the base image
FROM hub.lumigame.com/docker-hub/library/node:18.1-alpine

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package.json yarn.lock .modprunerrc ./

RUN npm run reg \
    && yarn install

# Copy the rest of the application files
COPY . .

# Build the TypeScript code
RUN npm run build
RUN rm -rf ./node_modules

RUN yarn install --production \
    && yarn cache clean
RUN npx mod-pruner prune --force 


# Copy the .env file (if needed)
COPY .env .env

RUN apk --no-cache add curl

HEALTHCHECK  --interval=10s CMD curl --fail http://localhost:5000 || exit 1

# Command to run the app
CMD ["node", "dist/server.js"]