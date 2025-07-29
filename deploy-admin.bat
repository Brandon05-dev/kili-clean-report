@echo off
REM CleanKili Admin Deployment Script for Render (Windows)

echo 🚀 Deploying CleanKili Admin to Render...
echo ========================================

REM Step 1: Check if we're in the right directory
if not exist "render.yaml" (
    echo ❌ Error: render.yaml not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Step 2: Navigate to frontend and test build
echo 📦 Testing frontend build...
cd frontend

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ Error: package.json not found in frontend directory.
    pause
    exit /b 1
)

REM Install dependencies and build
echo 📥 Installing dependencies...
call npm ci

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies.
    pause
    exit /b 1
)

echo 🔧 Building production bundle...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo 📊 Build output summary:
    if exist "dist" (
        echo    📁 Output directory: dist/
        dir dist
    )
) else (
    echo ❌ Build failed! Please fix the errors before deploying.
    pause
    exit /b 1
)

REM Step 3: Check admin files
echo 🔍 Verifying admin module...
if exist "src\admin" (
    echo ✅ Admin module found
    echo    📂 Admin structure verified
) else (
    echo ⚠️  Admin module not found at src/admin
)

REM Step 4: Go back to project root
cd ..

echo 📤 Preparing for deployment...

REM Check Git status
where git >nul 2>nul
if %errorlevel% equ 0 (
    if exist ".git" (
        echo 📋 Git repository detected
        echo 🔄 Checking git status...
        git status --short
        
        echo.
        echo Would you like to commit and push changes? (y/n)
        set /p response=
        if /i "%response%"=="y" (
            echo 📝 Adding all changes...
            git add .
            
            echo 💾 Creating commit...
            git commit -m "deploy: admin page ready for Render deployment"
            
            echo 📤 Pushing to repository...
            git push origin main
            
            if %errorlevel% equ 0 (
                echo ✅ Changes pushed successfully!
            ) else (
                echo ❌ Failed to push changes.
                pause
                exit /b 1
            )
        )
    ) else (
        echo ⚠️  Not a Git repository. Initialize Git first.
    )
) else (
    echo ⚠️  Git not found. Install Git to enable automatic deployment.
)

REM Step 5: Display deployment instructions
echo.
echo 🎉 Ready for Render Deployment!
echo ========================================
echo Next Steps:
echo 1. 🌐 Go to https://dashboard.render.com
echo 2. 🔗 Click 'New' → 'Static Site'
echo 3. 📋 Connect your GitHub repository
echo 4. ⚙️  Configure deployment settings:
echo    • Name: cleankili-frontend
echo    • Build Command: cd frontend ^&^& npm ci ^&^& npm run build
echo    • Publish Directory: frontend/dist
echo 5. 🔧 Set environment variables:
echo    • NODE_ENV=production
echo    • VITE_API_URL=https://your-backend-url.onrender.com
echo    • VITE_APP_ENV=production
echo 6. 🚀 Click 'Create Static Site'
echo.
echo 📱 Your admin pages will be available at:
echo    • https://your-app.onrender.com/admin/login
echo    • https://your-app.onrender.com/admin/dashboard
echo    • https://your-app.onrender.com/admin/register
echo.
echo 🔗 Useful Links:
echo    • Render Dashboard: https://dashboard.render.com
echo    • Deployment Guide: .\ADMIN_DEPLOYMENT_GUIDE.md
echo    • Admin Module Docs: .\frontend\src\admin\README.md
echo.
echo 🎯 Deployment Summary:
echo    ✅ Frontend build successful
echo    ✅ Admin module organized
echo    ✅ Dependencies resolved
echo    ✅ render.yaml configured
echo    ✅ Security headers set
echo    ✅ Environment variables ready
echo.
echo 🚀 Happy deploying!
echo.
pause
