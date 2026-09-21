# Estructura de carpetas — SIPPCI

## Raíz (`SIPPCI/`)

```
backend/
frontend/
docs/
scripts/
.gitignore
.editorconfig
docker-compose.yml   # referencia, no usar
README.md
```

## Backend (`backend/`)

```
backend/
├── prisma/
│   └── schema.prisma          # Modelo de datos (25 tablas)
├── src/
│   ├── main.ts                # Entry point NestJS
│   ├── app.module.ts          # Módulo raíz
│   ├── config/
│   │   ├── configuration.ts   # Variables de entorno
│   │   └── validation.ts      # Esquema Joi para validación
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── modules/               # Módulos de dominio (fases posteriores)
│   ├── common/                # Guards, interceptors, pipes, DTOs
│   └── decorators/            # Decoradores personalizados
├── test/                      # Tests Jest
├── package.json
├── tsconfig.json
├── nest-cli.json
├── .env.example
└── .eslintrc.js
```

## Frontend (`frontend/`)

```
frontend/
├── src/
│   ├── main.ts                # Entry point Vite + React
│   ├── App.tsx
│   ├── views/
│   │   ├── public/            # Home, trámites
│   │   ├── auth/              # Login, registro, OTP
│   │   └── admin/             # Dashboard (fases posteriores)
│   ├── components/
│   ├── stores/                # Zustand
│   ├── services/              # API client + TanStack Query
│   ├── hooks/
│   ├── lib/                   # Utilidades (date-fns, etc.)
│   └── types/                 # TypeScript interfaces
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── vitest.config.ts
└── playwright.config.ts
```
