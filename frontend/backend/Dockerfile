# Multi-stage Dockerfile for Football Game Backend (Express + Node.js)
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies first for optimal Docker layer caching
COPY package*.json ./
RUN npm install

# Stage for local development with live code reloading
FROM base AS development
ENV NODE_ENV=development
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]

# Stage for lean production deployment
FROM base AS production
ENV NODE_ENV=production
COPY . .
RUN npm prune --omit=dev
EXPOSE 5000
CMD ["node", "server.js"]
