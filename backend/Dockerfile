# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app/backend

# Install dependencies first (layer caching)
COPY package.json tsconfig.json ./
COPY prisma/ ./prisma/
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
COPY src/ ./src/
RUN npx tsc

# Stage 2: Production
FROM node:22-alpine
WORKDIR /app/backend

ENV NODE_ENV=production

# Copy Prisma schema and migrations (needed for prisma migrate deploy in entrypoint)
COPY --from=builder /app/backend/prisma ./prisma

# Copy package.json and install production dependencies
COPY --from=builder /app/backend/package.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy Prisma CLI from builder so entrypoint can run prisma commands
COPY --from=builder /app/backend/node_modules/prisma ./node_modules/prisma
# Copy generated Prisma client
COPY --from=builder /app/backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/backend/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/backend/node_modules/@prisma/adapter-better-sqlite3 ./node_modules/@prisma/adapter-better-sqlite3

# Copy compiled JS
COPY --from=builder /app/backend/dist ./dist

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5174

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/server.js"]
