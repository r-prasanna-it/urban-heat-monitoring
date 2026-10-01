@echo off
title Urban Heat Monitoring & Cooling Platform
echo ========================================================
echo   Starting Urban Heat Monitoring Platform
echo ========================================================
echo.
echo Starting Backend Server (Port 5000)...
start "Urban Heat - Backend" cmd /k "cd /d %~dp0backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Dev Server (Port 5173)...
start "Urban Heat - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo Opening Browser...
start http://localhost:5173

echo.
echo ========================================================
echo Application is running!
echo Frontend URL: http://localhost:5173
echo Backend API:  http://localhost:5000
echo Demo Login:   admin@gmail.com / admin123
echo ========================================================
pause
