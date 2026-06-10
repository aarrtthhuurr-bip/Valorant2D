@echo off
setlocal
cd /d "%~dp0"

where node.exe >nul 2>nul
if %errorlevel%==0 (
  start "" /min node.exe "%~dp0protocol_shift_server.js"
  exit /b 0
)

set "CODEX_NODE=C:\Users\HP\AppData\Local\OpenAI\Codex\bin\5b9024f90663758b\node.exe"
if exist "%CODEX_NODE%" (
  start "" /min "%CODEX_NODE%" "%~dp0protocol_shift_server.js"
  exit /b 0
)

echo Node.js was not found. Install Node.js or update this launcher.
exit /b 1
