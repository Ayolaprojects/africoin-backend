@echo off
echo.
echo ============================================
echo  AFRICOIN APP - QUICK START
echo ============================================
echo.
echo Installing dependencies...
call npm install
echo.
echo npm install complete!
echo.
echo Starting development server...
echo Server will run on: http://localhost:5173
echo.
timeout /t 3
npm run dev
pause
