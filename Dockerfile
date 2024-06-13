# Use the official Node.js 20.14 image as the base image
FROM node:20.14-alpine
FROM hub.lumigame.com/docker-hub/library/node:18.1-alpine AS builder

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package.json yarn.lock .modprunerrc ./
RUN yarn install --production \
    && yarn cache clean

# Copy the rest of the application files
COPY . .

# Copy the .env file (if needed)
COPY .env .env

# Build the TypeScript code
RUN yarn run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["node", "dist/server.js"]