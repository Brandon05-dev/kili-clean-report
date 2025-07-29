@echo off
REM CleanKili Frontend Build Script for Render Deployment (Windows)

echo 🚀 Starting CleanKili Frontend Build...

REM Check if we're in the frontend directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Make sure you're in the frontend directory.
    exit /b 1
)

REM Set environment to production
set NODE_ENV=production

echo 📦 Installing dependencies...
call npm ci --only=production

echo 🔧 Building application...
call npm run build

REM Check if build was successful
if %errorlevel% equ 0 (
    echo ✅ Build completed successfully!
    echo 📁 Build output is in the 'dist' directory
    echo 🎉 Frontend ready for deployment!
) else (
    echo ❌ Build failed!
    exit /b 1
)
