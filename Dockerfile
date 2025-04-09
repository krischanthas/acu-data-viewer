# 1. Base image for installing dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./

# Install both production and development dependencies for dev environment
RUN npm install  # Instead of 'npm ci', which installs only prod deps

# 2. Build the app with standalone output
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build using standalone output for optimal Docker deployment
RUN npm run build

# 3. Production runner image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Add runtime-only deps
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
