# Multi-stage build for Hospital Management System
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ ./
RUN npm run build --prod

FROM node:18-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app

# Install production dependencies
COPY server/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built server
COPY --from=server-build /app/server/dist ./dist
COPY --from=server-build /app/server/src/drizzle ./src/drizzle

# Copy built client
COPY --from=client-build /app/client/dist ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/healthcheck.js

CMD ["node", "dist/server.js"]