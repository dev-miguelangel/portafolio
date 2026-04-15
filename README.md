# Portfolio — Miguel Ángel Gonzalez Jaimen

Monorepo del portafolio personal. Incluye un sitio público para mostrar proyectos y publicar newsletters, un portal de administración privado, y una API REST.

**Producción:** https://miguelangeljaimen.cl  
**Staging:** https://dev.miguelangeljaimen.cl

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 21, Tailwind CSS, Google Material Icons |
| Backend | NestJS 11, TypeORM |
| Base de datos | PostgreSQL 16 |
| Infraestructura | Docker, Nginx, Coolify |

---

## Estructura del monorepo

```
portafolio/
├── apps/
│   ├── web/                        # Angular SPA
│   │   └── src/app/
│   │       ├── core/               # Guards, interceptors, servicios, modelos
│   │       ├── features/
│   │       │   ├── public/         # Home, proyectos, newsletter (público)
│   │       │   └── admin/          # Login, dashboard, CRUD (privado)
│   │       └── shared/             # Componentes reutilizables
│   └── api/                        # NestJS REST API
│       └── src/
│           ├── config/             # Configuración y seed de admin
│           ├── common/             # Guards JWT
│           └── modules/
│               ├── auth/           # Login con JWT
│               ├── users/          # Usuario admin
│               ├── projects/       # CRUD proyectos
│               ├── newsletter/     # CRUD newsletters
│               └── subscribers/    # Suscriptores de email
├── docker/
│   └── nginx/nginx.conf            # Reverse proxy (producción)
├── docs/
│   └── coolify-deployment.md       # Guía de deployment
├── docker-compose.yml              # Stack completo (producción/local Docker)
├── docker-compose.dev.yml          # Solo PostgreSQL (desarrollo local)
└── .env.example                    # Variables de entorno de referencia
```

---

## Desarrollo local

### Opción A — Levantando solo la base de datos con Docker

Ideal para desarrollar con hot-reload en Angular y NestJS.

**1. Levantar PostgreSQL**

```bash
docker compose -f docker-compose.dev.yml up -d
```

**2. Configurar variables de entorno de la API**

```bash
cp apps/api/.env.example apps/api/.env
```

El `.env` por defecto ya apunta a `localhost:5432` con usuario `postgres/postgres`.

**3. Instalar dependencias**

```bash
npm install
```

**4. Crear el usuario admin (primera vez)**

```bash
cd apps/api
ADMIN_EMAIL=admin@miguelangeljaimen.cl \
ADMIN_PASSWORD=tu-clave \
npx ts-node -r tsconfig-paths/register src/config/seed.ts
cd ../..
```

**5. Iniciar API y frontend en paralelo**

```bash
npm run dev
```

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:4200 |
| API | http://localhost:3000/api |

---

### Opción B — Stack completo con Docker

Reproduce el entorno de producción localmente (Angular compilado, nginx, API y PostgreSQL en contenedores).

**1. Crear el archivo `.env` en la raíz**

```bash
cp .env.example .env
```

Edita `.env` con los valores que quieras para local:

```env
DB_USER=postgres
DB_PASS=postgres123
DB_NAME=portafolio
JWT_SECRET=local-dev-secret
JWT_EXPIRES_IN=7d
```

**2. Construir e iniciar todos los servicios**

```bash
docker compose up --build
```

La primera vez tarda unos minutos (instala dependencias y compila Angular + NestJS).

**3. Verificar que todo esté corriendo**

```bash
docker compose ps
```

Deberías ver 4 contenedores en estado `running` / `healthy`:

```
NAME       SERVICE   STATUS
...db      db        running (healthy)
...api     api       running
...web     web       running
...nginx   nginx     running
```

**4. Crear el usuario admin (primera vez)**

Con los contenedores levantados, corre el seed desde tu máquina apuntando a la DB del contenedor. Para eso, expón temporalmente el puerto de Postgres añadiendo esto al servicio `db` en `docker-compose.yml`:

```yaml
ports:
  - "5432:5432"
```

Luego reinicia solo la DB y ejecuta el seed:

```bash
docker compose up -d db

cd apps/api
DB_HOST=localhost DB_USER=postgres DB_PASS=postgres123 DB_NAME=portafolio \
ADMIN_EMAIL=admin@miguelangeljaimen.cl ADMIN_PASSWORD=tu-clave \
npx ts-node -r tsconfig-paths/register src/config/seed.ts
cd ../..
```

> Después de hacer el seed, quita el `ports` que agregaste al servicio `db`.

**5. Acceder a la aplicación**

| URL | Descripción |
|-----|-------------|
| http://localhost | Sitio público |
| http://localhost/proyectos | Lista de proyectos |
| http://localhost/newsletter | Newsletter |
| http://localhost/login | Login del admin |
| http://localhost/admin/dashboard | Dashboard (requiere login) |
| http://localhost/api/projects | API REST (JSON) |

---

## Comandos útiles

```bash
# Ver logs en tiempo real
docker compose logs -f

# Logs de un servicio específico
docker compose logs -f api
docker compose logs -f web

# Reiniciar un servicio sin reconstruir
docker compose restart api

# Reconstruir y reiniciar solo un servicio
docker compose up --build api

# Detener todos los contenedores (mantiene los datos)
docker compose down

# Detener y borrar volúmenes (reset completo, borra la DB)
docker compose down -v
```

---

## Endpoints de la API

**Públicos**

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/projects` | Lista paginada de proyectos |
| `GET` | `/api/projects/:id` | Detalle de un proyecto |
| `GET` | `/api/newsletters` | Newsletters publicadas |
| `GET` | `/api/newsletters/:id` | Detalle de una newsletter |
| `POST` | `/api/subscribers` | Suscribirse al newsletter |

**Protegidos (requieren `Authorization: Bearer <token>`)**

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/auth/login` | Login → retorna `accessToken` |
| `POST` | `/api/projects` | Crear proyecto |
| `PATCH` | `/api/projects/:id` | Editar proyecto |
| `DELETE` | `/api/projects/:id` | Eliminar proyecto |
| `POST` | `/api/newsletters` | Crear newsletter |
| `PATCH` | `/api/newsletters/:id` | Editar newsletter |
| `DELETE` | `/api/newsletters/:id` | Eliminar newsletter |
| `GET` | `/api/subscribers` | Lista de suscriptores |

---

## Deployment en producción

Ver la guía completa: [docs/coolify-deployment.md](docs/coolify-deployment.md)

Resumen:
1. Instalar Coolify en el VPS
2. Conectar el repositorio GitHub
3. Crear recurso Docker Compose apuntando a `docker-compose.yml`
4. Configurar variables de entorno y dominio en Coolify
5. Activar SSL automático con Let's Encrypt
6. Deploy y seed del usuario admin

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DB_USER` | Usuario de PostgreSQL | `postgres` |
| `DB_PASS` | Contraseña de PostgreSQL | `secreto` |
| `DB_NAME` | Nombre de la base de datos | `portafolio` |
| `JWT_SECRET` | Secreto para firmar tokens JWT | `openssl rand -hex 64` |
| `JWT_EXPIRES_IN` | Expiración del token | `7d` |
| `ADMIN_EMAIL` | Email del usuario admin (seed) | `admin@dominio.cl` |
| `ADMIN_PASSWORD` | Contraseña del usuario admin (seed) | `clave-segura` |
