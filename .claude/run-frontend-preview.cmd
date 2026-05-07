@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0\.."
"C:\Program Files\nodejs\npm.cmd" --prefix frontend run preview -- --port 4173 --host 127.0.0.1
