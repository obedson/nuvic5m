# NUVIC5M Image Compression PowerShell Script
# Run with: powershell -ExecutionPolicy Bypass -File compress_images.ps1

Write-Host "🖼️  NUVIC5M Image Compression Tool (PowerShell)" -ForegroundColor Green
Write-Host "=" * 50

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python from https://python.org" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Pillow is installed
try {
    python -c "import PIL; print('✅ Pillow is installed')" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "📦 Installing Pillow..." -ForegroundColor Yellow
        pip install Pillow
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to install Pillow" -ForegroundColor Red
            Read-Host "Press Enter to exit"
            exit 1
        }
    }
} catch {
    Write-Host "📦 Installing Pillow..." -ForegroundColor Yellow
    pip install Pillow
}

# Run the compression script
Write-Host "🚀 Starting compression..." -ForegroundColor Cyan
python compress_images_windows.py

Write-Host "🎉 Compression complete!" -ForegroundColor Green
Read-Host "Press Enter to exit"
