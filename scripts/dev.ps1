<#
.SYNOPSIS
  Inicia desarrollo: backend (watch) + frontend (Vite dev server) en paralelo.
.DESCRIPTION
  Ejecuta dos procesos en segundo plano:
    - Backend: `npm run start:dev` en backend/
    - Frontend: `npm run dev` en frontend/
.NOTES
  Requiere haber ejecutado primero scripts/init.ps1.
#>
param(
    [string]$BaseDir = $PSScriptRoot
)

Write-Host "Iniciando entrono de desarrollo SIPPCI..." -ForegroundColor Yellow
Write-Host "Backend → http://localhost:3000/api"
Write-Host "Swagger  → http://localhost:3000/api/docs"
Write-Host "Frontend → http://localhost:5173"
Write-Host ""

# Backend en watch mode
$procBackend = Start-Process -FilePath 'npm' -ArgumentList 'run', 'start:dev' -WorkingDirectory "$BaseDir\backend" -PassThru -WindowStyle Normal
Write-Host "Backend PID: $($procBackend.Id)"

# Frontend en watch mode
$procFrontend = Start-Process -FilePath 'npm' -ArgumentName 'dev' -WorkingDirectory "$BaseDir\frontend" -PassThru -WindowStyle Normal
Write-Host "Frontend PID: $($procFrontend.Id)"

Write-Host "`nPara detener ambos: Ctrl+C en cada terminal o cerrar ventanas."
