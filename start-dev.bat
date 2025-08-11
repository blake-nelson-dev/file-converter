@echo off
echo Starting ConvertStudio Development Environment...
echo.

REM Build functions first
echo [1/3] Building Firebase Functions...
cd packages\functions
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to build functions
    pause
    exit /b 1
)
cd ..\..

REM Start Firebase emulators in background
echo [2/3] Starting Firebase Emulators...
cd packages\config
start "Firebase Emulators" cmd /c "firebase emulators:start --only functions,firestore,storage,auth && pause"
cd ..\..

REM Wait a moment for emulators to start
timeout /t 5 /nobreak > nul

REM Start frontend development server
echo [3/3] Starting Frontend Development Server...
echo.
echo ================================================================
echo   ConvertStudio Development Environment Ready!
echo   
echo   Frontend:  http://localhost:5173
echo   Emulator UI: http://localhost:4000
echo   
echo   Press Ctrl+C to stop the frontend server
echo   Close the Firebase Emulators window to stop backend services
echo ================================================================
echo.
npm run dev

pause