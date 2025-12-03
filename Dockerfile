# Shelf Dockerfile
# Multi-stage build for optimized production image

# Stage 1: Base image with dependencies
FROM node:22-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    curl \
    tini

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install --omit=dev && \
    npm cache clean --force

# Stage 2: Production image
FROM node:22-alpine

# Install tini for proper signal handling
RUN apk add --no-cache tini

WORKDIR /app

# Copy node modules from base stage
COPY --from=base /app/node_modules ./node_modules

# Copy entrypoint script (before switching to node user)
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Copy application code
COPY admin ./admin
COPY backend ./backend
COPY frontend ./frontend
COPY package.json ./

# Create directories for runtime data
RUN mkdir -p logs cache/images backend/resources

# Copy overrides.json to backend/resources (will be bundled in image)
# Note: shelf.properties will be generated at runtime by entrypoint script
COPY backend/resources/overrides.json ./backend/resources/overrides.json

# Set proper permissions - backend/resources must be writable for shelf.properties generation
RUN chown -R node:node /app && \
    chown node:node /usr/local/bin/docker-entrypoint.sh && \
    chmod -R 775 /app/backend/resources

# Switch to non-root user
USER node

# Expose backend port
EXPOSE 10801

# Expose frontend port
EXPOSE 10800

# Use tini as entrypoint for proper signal handling
ENTRYPOINT ["/sbin/tini", "--", "docker-entrypoint.sh"]

# Start the application
CMD ["node", "admin/main.js"]
