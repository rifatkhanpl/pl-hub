# Multi-stage Dockerfile for PracticeLink Platform
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files for better caching
COPY package*.json ./
COPY packages/design/package.json ./packages/design/
COPY packages/sdk/package.json ./packages/sdk/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]