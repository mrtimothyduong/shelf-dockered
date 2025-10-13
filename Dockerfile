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

# Copy application code
COPY admin ./admin
COPY backend ./backend
COPY frontend ./frontend
COPY package.json ./

# Create directories for runtime data
RUN mkdir -p logs cache/images

# Set proper permissions
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose backend port
EXPOSE 10801

# Expose frontend port
EXPOSE 10800

# Use tini as entrypoint for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Start the application
CMD ["node", "admin/main.js"]
