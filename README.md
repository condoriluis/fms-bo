# FMS-BO — File Manager System

Plataforma web para la gestión y almacenamiento de archivos con múltiples proveedores cloud.

## Stack

| Tecnología | Uso |
|---|---|
| Next.js 16 + TypeScript | Framework (App Router) |
| NextAuth v5 + bcrypt | Autenticación con JWT |
| Prisma ORM + PostgreSQL | Base de datos (Supabase) |
| Tailwind CSS v4 + shadcn/ui | Estilos y componentes |
| AWS S3 / Cloudinary / Mailchimp | Almacenamiento de archivos |
| react-hook-form + zod | Formularios y validación |
| sonner + motion | Notificaciones y animaciones |
| next-themes | Tema claro / oscuro |

## Instalación

```bash
git clone https://github.com/condoriluis/fms-bo.git
cd fms-bo
npm install
cp .env.example .env   # Configurar variables de entorno
npx prisma generate
npm run dev
```

## Variables de entorno

Ver `.env.example` para todas las variables requeridas. Incluye conexión a PostgreSQL, claves de AWS S3, Cloudinary, Mailchimp y `AUTH_SECRET`.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build producción |
| `npm run start` | Servidor producción |
| `npm run lint` | Linter |
| `npm run format` | Formatear código |
| `npm run db:seed` | Poblar base de datos |

## Licencia

MIT
