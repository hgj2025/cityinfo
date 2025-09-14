@echo off
echo Starting CityInfo Frontend Development Server...
echo.

cd /d "%~dp0"

echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Starting development server...
npm run dev

pause