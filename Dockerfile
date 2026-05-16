# ============================================================
# VIVA Memorial Platform — Dockerfile
# Multi-stage: Node build → Nginx static serve
# ============================================================

# ── Stage 1: Build ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (better layer caching)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --prefer-offline

# Copy all source code
COPY . .

# Build args for public env vars (required at build time for static export)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Build the static export (generates /app/out)
RUN npm run build

# ── Stage 2: Serve with Nginx ────────────────────────────────
FROM nginx:1.27-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder stage
COPY --from=builder /app/out /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
