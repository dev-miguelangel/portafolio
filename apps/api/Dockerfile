# Contexto de build: raíz del monorepo
# docker-compose.yml usa context: . y dockerfile: apps/api/Dockerfile

# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar lockfile raíz + package.json del workspace
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/

# Instalar deps del workspace api (queda en /app/node_modules)
RUN npm ci --workspace=apps/api --ignore-scripts

# Copiar fuente del workspace
COPY apps/api/ ./apps/api/

WORKDIR /app/apps/api
RUN npm run build

# ── Production stage ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/

RUN npm ci --workspace=apps/api --omit=dev --ignore-scripts && npm cache clean --force

COPY --from=builder /app/apps/api/dist ./apps/api/dist

WORKDIR /app/apps/api

EXPOSE 3000

CMD ["node", "dist/main"]
