# Deployment en Coolify — Guía completa

**Producción:** https://miguelangeljaimen.cl  
**Dev/Staging:** https://dev.miguelangeljaimen.cl

---

## 1. Pre-requisitos en el VPS

### 1.1 Requisitos mínimos del servidor
- Ubuntu 22.04 LTS (o Debian 12)
- 2 vCPU, 4 GB RAM, 40 GB SSD
- Puertos abiertos: `22` (SSH), `80` (HTTP), `443` (HTTPS), `8000` (Coolify UI)

### 1.2 Actualizar el sistema
```bash
apt update && apt upgrade -y
apt install -y curl git ufw
```

### 1.3 Configurar firewall
```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 8000/tcp   # Coolify dashboard
ufw enable
```

---

## 2. Instalar Coolify

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Una vez terminada la instalación:
1. Accede a `http://<IP-DEL-VPS>:8000`
2. Crea la cuenta de administrador (primer uso)
3. Completa el onboarding de Coolify

---

## 3. Configurar el servidor en Coolify

### 3.1 Agregar el VPS como servidor
- En Coolify → **Servers** → **Add Server**
- Tipo: **Localhost** (si Coolify está en el mismo VPS) o **Remote Server**
- Verifica la conexión SSH

### 3.2 Validar Docker
Coolify instalará Docker automáticamente. Verifica con:
```bash
docker --version
docker compose version
```

---

## 4. Configurar dominio y DNS

En tu proveedor DNS (ej. Cloudflare, GoDaddy):

| Tipo | Nombre | Valor         |
|------|--------|---------------|
| A    | @      | `<IP-VPS>`    |
| A    | www    | `<IP-VPS>`    |
| A    | dev    | `<IP-VPS>`    |

> Espera propagación DNS (hasta 24 h, normalmente minutos con Cloudflare en proxy mode).

---

## 5. Agregar el repositorio GitHub

### 5.1 Conectar GitHub en Coolify
- Coolify → **Sources** → **GitHub App** → **Register**
- Sigue el flujo OAuth para instalar la GitHub App en tu cuenta
- Autoriza acceso al repositorio `portafolio`

### 5.2 Crear un nuevo proyecto
- Coolify → **Projects** → **New Project**
- Nombre: `portafolio`

---

## 6. Desplegar el servicio (Docker Compose)

### 6.1 Crear el recurso
- Proyecto `portafolio` → **New Resource** → **Docker Compose**
- Fuente: repositorio GitHub → rama `main`
- Archivo compose: `docker-compose.yml` (en la raíz del repo)

### 6.2 Configurar variables de entorno
En Coolify → Resource → **Environment Variables**, agrega:

```
DB_USER=postgres
DB_PASS=<contraseña-segura>
DB_NAME=portafolio
JWT_SECRET=<secreto-jwt-muy-largo-y-aleatorio>
JWT_EXPIRES_IN=7d
```

> **Importante:** Genera `JWT_SECRET` con `openssl rand -hex 64`

### 6.3 Configurar dominio en Coolify
- En el recurso → **Domains**
- Agrega `miguelangeljaimen.cl` apuntando al servicio `nginx` (puerto 80)
- Activa **SSL/TLS automático con Let's Encrypt**

### 6.4 Para staging/dev
Repite los pasos 6.1–6.3 con:
- Rama: `dev` (o usa la misma rama `main` en otro recurso)
- Dominio: `dev.miguelangeljaimen.cl`
- Las variables de entorno pueden ser iguales excepto `DB_NAME=portafolio_dev`

---

## 7. Primer deploy y seed del usuario admin

### 7.1 Deploy inicial
- Coolify → Resource → **Deploy**
- Espera a que todos los servicios estén `healthy`

### 7.2 Crear el usuario admin
Conéctate al contenedor de la API y ejecuta el seed:

```bash
# En el VPS
docker exec -it <container-name-api> sh

# Dentro del contenedor
ADMIN_EMAIL=tu@correo.cl \
ADMIN_PASSWORD=tu-clave-segura \
node -e "
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { UsersService } = require('./dist/modules/users/users.service');
// O usa el seed script directamente:
"
```

**Alternativa más sencilla** — ejecuta el seed desde tu máquina local apuntando a la DB de producción:
```bash
cd apps/api
DB_HOST=<IP-VPS> \
DB_USER=postgres \
DB_PASS=<contraseña-prod> \
DB_NAME=portafolio \
ADMIN_EMAIL=admin@miguelangeljaimen.cl \
ADMIN_PASSWORD=<clave-admin-segura> \
npx ts-node -r tsconfig-paths/register src/config/seed.ts
```

---

## 8. CI/CD automático con GitHub

### 8.1 Activar auto-deploy en Coolify
- Resource → **Build** → Enable **Auto Deploy on Push**
- Rama: `main`

### 8.2 (Opcional) GitHub Actions para tests antes del deploy
Crea `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main]

jobs:
  test-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci --workspace=apps/api
      - run: npm test --workspace=apps/api

  test-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci --workspace=apps/web
      - run: npm test --workspace=apps/web
```

---

## 9. Flujo de trabajo diario

### Desarrollo local
```bash
# 1. Levantar PostgreSQL
docker compose -f docker-compose.dev.yml up -d

# 2. Copiar y configurar variables
cp apps/api/.env.example apps/api/.env

# 3. Instalar dependencias
npm install

# 4. Ejecutar en modo desarrollo
npm run dev
# API: http://localhost:3000/api
# Web: http://localhost:4200
```

### Publicar cambios
```bash
git add .
git commit -m "feat: descripción del cambio"
git push origin main
# Coolify detecta el push y hace deploy automático
```

---

## 10. Checklist de seguridad antes de producción

- [ ] `JWT_SECRET` generado con `openssl rand -hex 64` (mínimo 64 chars)
- [ ] `DB_PASS` es una contraseña fuerte y única
- [ ] `ADMIN_PASSWORD` es una contraseña fuerte (no la uses en ningún otro servicio)
- [ ] SSL/TLS activo en ambos dominios (verificar candado en el browser)
- [ ] El puerto `5432` de PostgreSQL **no está expuesto** hacia internet (solo accesible entre contenedores)
- [ ] El puerto `3000` de la API **no está expuesto** hacia internet (solo a través de nginx)
- [ ] Backups de la base de datos configurados (Coolify tiene soporte nativo)
- [ ] `synchronize: false` en TypeORM de producción → usar migraciones

---

## 11. Backups de la base de datos

En Coolify → el servicio `db` → **Scheduled Backups**:
- Frecuencia: diaria
- Retención: 7 días
- Destino: S3 compatible (ej. Cloudflare R2, AWS S3, Hetzner Object Storage)

---

## 12. Migraciones en producción

Una vez en producción, deshabilitar `synchronize` y usar migraciones TypeORM:

```bash
# Generar migración
cd apps/api
npx typeorm migration:generate src/migrations/NombreMigracion -d src/config/data-source.ts

# Ejecutar migraciones
npx typeorm migration:run -d src/config/data-source.ts
```

Recuerda crear `src/config/data-source.ts` con la configuración de `DataSource` para CLI.
