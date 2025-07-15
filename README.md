# SistemaTutoUleam

Un sistema web desarrollado con Next.js y TypeScript para la gestión de tutorías.

## 🚀 Requisitos Previos

- Node.js (versión 18 o superior)
- pnpm (gestor de paquetes recomendado)
- Supabase cuenta (para la base de datos y autenticación)

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPO]
cd SistemaTutoUleam
```

2. Instala las dependencias:
```bash
pnpm install
```

3. Configura las variables de entorno:
Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:
```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_llave_anonima
```

4. Inicia el servidor de desarrollo:
```bash
pnpm dev
```

## 📦 Scripts Disponibles

- `pnpm dev`: Inicia el servidor de desarrollo
- `pnpm build`: Crea la build de producción
- `pnpm start`: Inicia la aplicación en modo producción
- `pnpm lint`: Ejecuta el linting del código

## 📚 Tecnologías Utilizadas

- Next.js 15.2.4
- TypeScript
- Supabase (Base de datos y autenticación)
- Tailwind CSS
- Radix UI (Componentes accesibles)
- React Hook Form
- Zod (Validación de formularios)

## 🎨 Estilos y UI

El proyecto utiliza:
- Tailwind CSS para estilos
- Radix UI para componentes accesibles
- Lucide React para íconos
- Next Themes para soporte de tema oscuro/claro

## 🚀 Despliegue

El proyecto está configurado para ser desplegado en Vercel o cualquier otro proveedor de hosting que soporte Next.js.

## 📝 Notas

- Asegúrate de tener un proyecto de Supabase configurado antes de iniciar el proyecto
- Los componentes están organizados en la carpeta `components`
- Las rutas de la aplicación están en la carpeta `app`
- Los hooks personalizados están en la carpeta `hooks`

## 📝 Licencia

Este proyecto está bajo la licencia MIT.
