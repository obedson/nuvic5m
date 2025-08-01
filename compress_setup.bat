@echo off
echo ========================================
echo NUVIC5M Image Compression Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    echo 📥 Please install Python from https://python.org
    echo 💡 Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

echo ✅ Python is installed
echo.

REM Check if pip is available
pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ pip is not available
    echo 💡 Please reinstall Python with pip included
    pause
    exit /b 1
)

echo ✅ pip is available
echo.

REM Install Pillow
echo 📦 Installing Pillow (PIL) for image processing...
pip install Pillow

if %errorlevel% neq 0 (
    echo ❌ Failed to install Pillow
    echo 💡 Try running as administrator or check your internet connection
    pause
    exit /b 1
)

echo ✅ Pillow installed successfully
echo.

REM Run the compression script
echo 🖼️  Starting image compression...
echo.
python compress_images_windows.py

echo.
echo 🎉 Setup and compression complete!
echo 💡 You can run 'python compress_images_windows.py' anytime to compress new images
pause
