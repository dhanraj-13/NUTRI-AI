$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot
Write-Host "Starting NUTRI AI full stack..." -ForegroundColor Green
docker compose up --build
