# Contexto de build: raíz del monorepo
# docker-compose.yml usa context: . y dockerfile: apps/web/Dockerfile

# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar lockfile raíz + package.json del workspace
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/

# Instalar deps del workspace web (queda en /app/node_modules)
RUN npm ci --workspace=apps/web --ignore-scripts

# Copiar fuente del workspace
COPY apps/web/ ./apps/web/

WORKDIR /app/apps/web
RUN npm run build

# ── Production stage (nginx) ──────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/apps/web/dist/web/browser /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
