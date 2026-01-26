@echo off
echo ========================================
echo  Perfect Pick AI - Starting Services
echo ========================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
timeout /t 2 /nobreak >nul

REM Start Server
echo.
echo [1/2] Starting Backend Server...
cd server
start "Perfect Pick - Backend" cmd /k "npm start"
timeout /t 3 /nobreak >nul

REM Start Client
echo.
echo [2/2] Starting Frontend Client...
cd ..\client
start "Perfect Pick - Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo  Services Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul
