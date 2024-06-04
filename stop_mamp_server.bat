@echo off
REM Stop Apache server
echo Stopping Apache server...
taskkill /F /IM httpd.exe

REM Stop MySQL server
echo Stopping MySQL server...
taskkill /F /IM mysqld.exe

REM Keep the terminal open to display any errors
echo.
echo Servers stopped. Press any key to exit.
pause
