@echo off
echo Starting CityInfo Backend Server...
echo.

cd /d "%~dp0server"

echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Generating Prisma client...
npx prisma generate
if %errorlevel% neq 0 (
    echo Failed to generate Prisma client
    pause
    exit /b 1
)

echo.
echo Building TypeScript...
npm run build
if %errorlevel% neq 0 (
    echo Failed to build TypeScript
    pause
    exit /b 1
)

echo.
echo Starting server...
npm start

pause