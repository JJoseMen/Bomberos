<#
.SYNOPSIS
  Compila backend y frontend para producción.
.DESCRIPTION
  Ejecuta `npm run build` en backend/ y frontend/.
.NOTES
  Requiere haber ejecutado scripts/init.ps1 primero.
#>
param(
    [string]$BaseDir = $PSScriptRoot
)

$ErrorActionPreference = 'Stop'

Write-Host "Iniciando builds de SIPPCI..." -ForegroundColor Yellow

Write-Host "`n==> Building backend..." -ForegroundColor Cyan
Set-Location "$BaseDir\backend"
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "`n==> Building frontend..." -ForegroundColor Cyan
Set-Location "$BaseDir\frontend"
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "`n✓ Builds completados exitosamente." -ForegroundColor Green