@echo off
REM Change to the MAMP installation directory
cd /d "C:\MAMP"

REM Start the MAMP application to initialize the servers
echo Starting MAMP...
start "" "C:\MAMP\MAMP.exe"

REM Wait for MAMP to fully start
timeout /t 10 /nobreak >nul

REM Open the project in the default web browser
echo Opening project in web browser...
start "" "http://localhost/PicTagger/index.php"

REM Keep the terminal open to display any errors
echo.
echo Servers are running. Press Ctrl+C to stop.
pause
