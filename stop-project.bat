@echo off
setlocal
cd /d "%~dp0"
echo Stopping NUTRI AI full stack...
docker compose down
