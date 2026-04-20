@echo off
REM ============================================================================
REM AFRICOIN APP - STARTUP SCRIPT
REM ============================================================================
REM This script starts both the frontend and backend servers
REM Run this file to start the entire app with one click

echo.
echo ============================================================================
echo   AFRICOIN APP STARTUP
echo ============================================================================
echo.
echo Starting frontend and backend servers...
echo.
echo Frontend will open at: http://localhost:5173
echo Backend API will run at: http://localhost:3001
echo.
pause

REM Change to project directory
cd /d "C:\Users\zwexm\LPSN\AFRICOIN-APP - IOS"

REM Start two separate terminal windows
REM Terminal 1: Frontend
echo.
echo [FRONTEND] Starting Vite dev server on port 5173...
start cmd /k "npm run dev"

REM Wait a moment for frontend to start
timeout /t 3 /nobreak

REM Terminal 2: Backend
echo [BACKEND] Starting Express server on port 3001...
start cmd /k "cd backend && npm run dev"

echo.
echo ============================================================================
echo   SERVERS STARTED!
echo ============================================================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3001
echo.
echo Close either terminal to stop the respective server.
echo.
