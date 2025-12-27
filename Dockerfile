# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy SSL certificates (if available)
COPY ssl /etc/nginx/ssl 2>/dev/null || true

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Create non-root nginx user
RUN addgroup -g 1001 -S nginx_app && \
    adduser -S nginx_app -u 1001 -G nginx_app

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Expose port
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
