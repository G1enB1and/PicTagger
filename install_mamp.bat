@echo off
REM Get the directory of the batch file
SET "SCRIPT_DIR=%~dp0"

REM Verify that the PowerShell script exists
IF NOT EXIST "%SCRIPT_DIR%install_mamp.ps1" (
    echo The PowerShell script install_mamp.ps1 does not exist in the expected location: %SCRIPT_DIR%
    pause
    exit /b 1
)

REM Run the PowerShell script
powershell -ExecutionPolicy Bypass -File "%SCRIPT_DIR%install_mamp.ps1"

REM Keep the terminal open to display any errors
echo.
echo MAMP setup complete. Press any key to exit.
pause
