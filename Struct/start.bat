@echo off
REM filepath: c:\Users\Uriel\Documents\Struct\Struct\start.bat
cd /d %~dp0
start cmd /k "python manage.py runserver"
start cmd /k "cd frontend && npm run dev"