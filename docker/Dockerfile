# ==========================
# Stage 1: Build React App
# ==========================
FROM node:lts-alpine AS builder

# Set timezone
ENV TZ=Asia/Jakarta
RUN apk add --no-cache tzdata && ln -sf /usr/share/zoneinfo/Asia/Jakarta /etc/localtime

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies efficiently
RUN npm ci --no-cache

# Copy the entire project
COPY . .

# Increase memory limit before building
ENV NODE_OPTIONS="--max-old-space-size=8192"

# Run build process
RUN npm run build

# ==========================
# Stage 2: Setup Nginx
# ==========================
FROM nginx:alpine

# Set timezone
ENV TZ=Asia/Jakarta
RUN apk add --no-cache tzdata && ln -sf /usr/share/zoneinfo/Asia/Jakarta /etc/localtime

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy build files from the builder stage
COPY --from=builder /app/build/ .

# Copy custom Nginx configuration (optional)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
