@echo off
echo ========================================
echo   GLIMPSE RESTAURANT - BACKEND SERVER
echo ========================================
echo.

cd backend

echo [1/3] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo Node.js: OK

echo.
echo [2/3] Checking dependencies...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
) else (
    echo Dependencies: OK
)

echo.
echo [3/3] Starting backend server...
echo Server will run on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

call npm run dev
