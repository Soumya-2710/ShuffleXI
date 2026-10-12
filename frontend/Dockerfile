# Multi-stage Dockerfile for Football Game Frontend (React + Vite)
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies first for optimal Docker layer caching
COPY package*.json ./
RUN npm install

# Stage for local development with Vite HMR
FROM base AS development
ENV NODE_ENV=development
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev:frontend", "--", "--host", "0.0.0.0", "--port", "3000"]

# Stage for building production static bundle
FROM base AS build
ENV NODE_ENV=production
COPY . .
RUN npm run build

# Stage for serving production build via Nginx
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
