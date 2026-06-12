@echo off
setlocal
cd /d "%~dp0"
echo Starting NUTRI AI full stack...
docker compose up --build
