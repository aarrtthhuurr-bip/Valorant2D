@echo off
setlocal
cd /d "%~dp0"

:loop
git add .
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "Auto commit %date% %time%"
)
timeout /t 300 /nobreak >nul
goto loop
