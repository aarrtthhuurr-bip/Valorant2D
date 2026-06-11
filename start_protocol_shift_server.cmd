@echo off
setlocal
cd /d "%~dp0"

where py.exe >nul 2>nul
if %errorlevel%==0 (
  start "Valorant2D Server" /min py.exe "%~dp0protocol_shift_server.py" --ports 8088,8124 --open
  exit /b 0
)

where python.exe >nul 2>nul
if %errorlevel%==0 (
  start "Valorant2D Server" /min python.exe "%~dp0protocol_shift_server.py" --ports 8088,8124 --open
  exit /b 0
)

echo Python nao foi encontrado. Instale Python 3 para abrir o servidor local.
pause
exit /b 1
