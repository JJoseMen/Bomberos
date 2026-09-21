<#
.SYNOPSIS
  Inicializa el proyecto SIPPCI: instala dependencias, genera Prisma, ejecuta migraciones y seed.
.DESCRIPTION
  Ejecuta secuencialmente:
    1. npm install en backend/
    2. npm install en frontend/
    3. npx prisma generate (backend)
    4. npx prisma migrate dev (backend) --name init
    5. npx prisma db seed (backend)
.NOTES
  Requiere: Node.js >= 20, npm >= 10, PostgreSQL 17 local con DB "sippci".
#>
param(
    [string]$BaseDir = $PSScriptRoot
)

$ErrorActionPreference = 'Stop'

function Exec-Step {
    param($Command, $Label)
    Write-Host "`n=== $Label ===" -ForegroundColor Cyan
    try {
        & $Command
        Write-Host "OK: $Label" -ForegroundColor Green
    } catch {
        Write-Host "ERROR en $Label : $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Iniciando configuración del proyecto SIPPCI..." -ForegroundColor Yellow
Write-Host "Directorio base: $BaseDir"

# 1. Instalar backend
Exec-Step -Command { Set-Location "$BaseDir\backend"; npm install } -Label 'npm install (backend)'

# 2. Instalar frontend
Exec-Step -Command { Set-Location "$BaseDir\frontend"; npm install } -Label 'npm install (frontend)'

# 3. Generar cliente Prisma
Exec-Step -Command { Set-Location "$BaseDir\backend"; npx prisma generate } -Label 'prisma generate'

# 4. Migraciones (si existe DATABASE_URL y PostgreSQL corriendo)
if ($env:DATABASE_URL -or $true) {
    Exec-Step -Command { Set-Location "$BaseDir\backend"; npx prisma migrate dev --name init } -Label 'prisma migrate dev'
}

# 5. Seed
Exec-Step -Command { Set-Location "$BaseDir\backend"; npx prisma db seed } -Label 'prisma db seed'

Write-Host "`n✓ Proyecto inicializado correctamente." -ForegroundColor Green
