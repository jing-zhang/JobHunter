# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app/frontend

# Install dependencies first (layer caching)
COPY package.json tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY postcss.config.js tailwind.config.js vite.config.ts ./
COPY index.html ./
RUN npm ci

# Copy source and build
COPY public/ ./public/
COPY src/ ./src/
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
