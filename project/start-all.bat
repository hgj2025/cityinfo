@echo off
echo Starting CityInfo Full Stack Application...
echo.

cd /d "%~dp0"

echo ========================================
echo Starting Backend Server...
echo ========================================
start "Backend Server" cmd /k "start-backend.bat"

echo.
echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak >nul

echo ========================================
echo Starting Frontend Development Server...
echo ========================================
start "Frontend Server" cmd /k "start-frontend.bat"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause >nul