@echo off
REM Change to the project root directory
cd /d "C:\MAMP\htdocs\PicTagger"

REM Run the fetch_images.php script
php backend/fetch_images.php "Pictures"

REM Keep the terminal open to display any errors
echo.
echo Images initialized. Press any key to exit.
pause
