# SIPPCI Frontend

Sistema de Planificacion y Supervision de la Actividad de los Cuerpos de Bomberos - Frontend

## Stack

- React 19 + TypeScript 5
- Vite 6
- CSS Modules + SCSS
- Zustand (estado global)
- TanStack Query (estado servidor)
- React Hook Form + Zod (formularios)
- React Router 7
- TanStack Table (tablas)
- Headless UI + Radix (UI)
- Lucide React (iconos)
- Sonner (toasts)

## Instalacion

```bash
npm install --legacy-peer-deps
```

## Scripts

```bash
npm run dev        # Desarrollo
npm run build      # Build produccion
npm run preview    # Preview build
npm run lint       # Linting
npm run format     # Formateo
npm run test       # Tests unitarios
npm run test:e2e   # Tests e2e
```

## Estructura

```
src/
├── assets/        # Estilos, imagenes, fuentes
├── components/    # Componentes reutilizables
├── features/      # Modulos por feature
├── hooks/         # Custom hooks
├── layouts/       # Layouts de pagina
├── lib/           # Utilidades
├── router/        # Rutas
├── services/      # API services
├── stores/        # Zustand stores
├── types/         # Tipos TypeScript
└── utils/         # Funciones utilitarias
```
