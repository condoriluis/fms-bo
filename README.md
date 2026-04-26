# FMS-BO — File Manager System

Plataforma web profesional para la gestión y almacenamiento de archivos en la nube. Permite subir, listar, buscar, filtrar, renombrar, copiar y eliminar archivos desde múltiples proveedores de almacenamiento.

## Características

- 📁 Soporte multi-almacenamiento: **Server local**, **AWS S3**, **Cloudinary** y **Mailchimp**
- 🔐 Autenticación de administrador con Supabase Auth
- ⚡ Carga instantánea con Server-Side Rendering y Prisma ORM
- 🖼️ Vistas de lista y cuadrícula con preview de imágenes
- 🔍 Búsqueda, filtrado y ordenamiento avanzado
- 📱 Interfaz completamente responsive (mobile + desktop)
- 🌙 Tema claro / oscuro integrado

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| Next.js 16 | Framework principal (App Router + SSR) |
| TypeScript | Tipado estático |
| Prisma ORM | Acceso a base de datos |
| Supabase | Base de datos PostgreSQL + Autenticación |
| Tailwind CSS v4 | Estilos |
| AWS S3 | Almacenamiento de archivos |
| Cloudinary | CDN multimedia |
| Mailchimp | Archivos de marketing |

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/condoriluis/fms-bo.git
   cd fms-bo
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Copia el archivo de ejemplo y configura tus variables de entorno:
   ```bash
   cp .env.example .env
   ```

4. Genera el cliente de Prisma:
   ```bash
   npx prisma generate
   ```

5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto. Consulta `.env.example` para ver todas las variables necesarias. **Nunca subas tus credenciales reales a GitHub.**

Variables requeridas:
- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase Auth
- `DATABASE_URL` y `DIRECT_URL` — Conexión directa PostgreSQL para Prisma
- Credenciales de AWS S3, Cloudinary y Mailchimp según los servicios que uses

## Estructura del proyecto

```
src/
├── app/
│   ├── (home)/          # Página principal y componentes de UI
│   └── api/             # Rutas API (archivos, storage)
├── components/          # Componentes reutilizables (Header, Footer, Auth)
├── lib/
│   ├── prisma.ts        # Cliente Prisma global
│   └── supabase/        # Cliente Supabase (auth)
└── styles/              # Estilos globales
```

## Licencia

MIT © [condoriluis](https://github.com/condoriluis)