# Define log file path
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Definition
$LOGFILE = Join-Path $SCRIPT_DIR "mamp_install_log.txt"

# Function to log and display messages
function Log {
    param (
        [string]$message
    )
    $message | Out-File -Append -FilePath $LOGFILE
    Write-Host $message
}

Log "Starting MAMP setup..."

# Check if MAMP is installed by looking for the MAMP directory
if (Test-Path "C:\MAMP\MAMP.exe") {
    Log "MAMP is already installed."
} else {
    Log "MAMP is not installed. Downloading and installing MAMP..."

    # Define the URL for the MAMP installer
    $URL = "https://downloads.mamp.info/MAMP-PRO-WINDOWS/releases/5.0.6/MAMP_MAMP_PRO_5.0.6.exe"
    # Define the download location
    $DOWNLOAD_PATH = "$env:TEMP\mamp-installer.exe"

    # Function to download the MAMP installer with retry mechanism
    function Download-Installer {
        $attempts = 3
        for ($i = 0; $i -lt $attempts; $i++) {
            try {
                Log "Attempting to download MAMP installer (Attempt $($i + 1))..."
                $webClient = New-Object System.Net.WebClient
                $webClient.DownloadFile($URL, $DOWNLOAD_PATH)
                return $true
            } catch {
                Log "Download failed. Error: $_"
                if ($i -eq $attempts - 1) {
                    return $false
                }
                Start-Sleep -Seconds 5
            }
        }
    }

    # Download the MAMP installer
    if (Download-Installer) {
        Log "MAMP installer downloaded successfully."
    } else {
        Log "Failed to download the MAMP installer."
        Log "See log file for details: $LOGFILE"
        exit 1
    }

    # Verify the download by checking its size (assumes size > 10MB is valid)
    if ((Get-Item $DOWNLOAD_PATH).Length -gt 10485760) {
        Log "Download verification successful."
    } else {
        Log "Download verification failed. The file size is too small."
        exit 1
    }

    # Run the MAMP installer
    Log "Running MAMP installer..."
    try {
        Start-Process -FilePath $DOWNLOAD_PATH -ArgumentList "/SILENT" -Wait -ErrorAction Stop
    } catch {
        Log "Failed to run the installer. Error: $_"
        exit 1
    }

    # Check if MAMP installed successfully
    if (Test-Path "C:\MAMP\MAMP.exe") {
        Log "MAMP installed successfully."
    } else {
        Log "Failed to install MAMP."
        Log "See log file for details: $LOGFILE"
        exit 1
    }

    # Clean up by deleting the downloaded installer
    Remove-Item $DOWNLOAD_PATH
    Log "Deleted installer."
}

# Start the Apache server
Log "Starting Apache server..."
Start-Process -FilePath "C:\MAMP\bin\apache\bin\httpd.exe" -ArgumentList "-k start" -Wait

# Wait for Apache to start
Start-Sleep -Seconds 5
Log "Waiting for Apache to start..."

# Open the project in the default web browser
Start-Process "http://localhost/PicTagger/index.php"
Log "Opening project in web browser..."

Log "Server is running. Press Ctrl+C to stop."
