# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files first (better cache)
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev --prefer-offline --no-audit

# Install dev dependencies needed for build
RUN npm install --save-dev typescript @types/react @types/react-dom @vitejs/plugin-react vite terser

# Copy source code
COPY . .

# Build
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]