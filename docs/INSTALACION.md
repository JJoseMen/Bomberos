# Instalación — SIPPCI

## Entorno verificado

- Ruta del proyecto (esta máquina): `E:\bomberos\Bomberos`
- Node.js 20+, npm 10+
- PostgreSQL 16.10 (servicio `postgresql-x64-16`, puerto 5432)
- Base de datos: `sippci`
- Usuario/password BD: **`postgres` / `admin`** (no `1234`)

> En el archivo `backend/.env`, `DATABASE_URL` debe quedar:
> `postgresql://postgres:admin@localhost:5432/sippci?schema=public`

## Instalación backend

```bash
cd backend
npm install
cp .env.example .env   # y editar DATABASE_URL/JWT_SECRET
npx prisma migrate dev
npx prisma db seed
npm run build
npm run start:dev      # o start:prod tras build
```

## Instalación frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173 (proxy /api -> :3001)
```

## Levantar todo (script)

```bash
.\scripts\dev.ps1
```

## Verificación rápida

1. Swagger en `http://localhost:3001/api/docs`.
2. `POST /api/auth/register` devuelve `{ "message": "Usuario registrado", "userId": N }`.
3. Sin SMTP configurado, el OTP se imprime en consola del backend `[DEV] OTP para ...`.

## Error común

| Síntoma | Causa | Solución |
|---------|-------|----------|
| `password authentication failed` al migrar | password BD incorrecto en `.env` | Usar `postgres:admin` |
| Pantalla blanca frontend | doble Router (BrowserRouter + RouterProvider) | Usar solo `createBrowserRouter` en `src/router/index.tsx` |
| Register 400 | frontend enviaba nombre+apellido | Backend espera `nombreCompleto` |