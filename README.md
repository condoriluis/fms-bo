# FMS-BO: Gestor de Archivos en la Nube

## Descripción
FMS-BO es una plataforma web (SPA) para la gestión y almacenamiento de archivos en la nube. Permite a los usuarios subir, listar, buscar, filtrar, renombrar, copiar enlaces y eliminar archivos de manera sencilla y segura.

## Características principales
- Soporte para múltiples servicios de almacenamiento: Server local, AWS S3, Cloudinary y Mailchimp.
- Subida de archivos en diversos formatos: imágenes, audio, PDF, ZIP, TXT, entre otros.
- Filtros y ordenamiento por tipo de archivo, tamaño, fecha y nombre.
- Autenticación de usuarios para operaciones protegidas (subir, renombrar, eliminar).
- Interfaz moderna con vistas de lista y cuadrícula.
- Backend con Supabase y API propia para gestión de archivos y metadatos.

## Tecnologías utilizadas
- **Next.js** (React)
- **Supabase** (Backend y autenticación)
- **AWS S3**, **Cloudinary**, **Mailchimp** (servicios de almacenamiento)
- **TypeScript**
- **Tailwind CSS**

## Instalación y uso

### Configuración de credenciales (.env.example)
Debes crear un archivo `.env` en la raíz del proyecto con las siguientes variables (un ejemplo está en `.env.example`, no subas tus credenciales reales a GitHub):

```env
# -------------------------------
# BD SUPABASE
# -------------------------------
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# -------------------------------
# AWS S3
# -------------------------------
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_aws_bucket_name

# -------------------------------
# Cloudinary
# -------------------------------
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# -------------------------------
# Mailchimp
# -------------------------------
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_LIST_ID=your_mailchimp_list_id

# -------------------------------
# URL de tu sitio
# -------------------------------
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

1. Clona el repositorio:
   ```bash
   git clone https://github.com/condoriluis/fms-bo.git
   cd fms-bo
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno para Supabase y los servicios de almacenamiento.
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Estructura principal del proyecto
- `/src/app/(home)`: Componentes y hooks principales de la interfaz de usuario.
- `/src/app/api/archivos`: API para gestión de archivos (listar, crear, actualizar, eliminar).
- `/src/lib/constants`: Tipos y constantes de archivos.

## Contribuciones
¡Las contribuciones son bienvenidas! Por favor, abre un issue o un pull request para sugerencias o mejoras.

## Licencia
MIT