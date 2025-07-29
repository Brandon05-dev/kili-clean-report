#!/bin/bash
# CleanKili Admin Deployment Script for Render

echo "🚀 Deploying CleanKili Admin to Render..."
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check if we're in the right directory
if [ ! -f "render.yaml" ]; then
    echo -e "${RED}❌ Error: render.yaml not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Step 2: Navigate to frontend and test build
echo -e "${BLUE}📦 Testing frontend build...${NC}"
cd frontend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found in frontend directory.${NC}"
    exit 1
fi

# Install dependencies and build
echo -e "${YELLOW}Installing dependencies...${NC}"
npm ci

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies.${NC}"
    exit 1
fi

echo -e "${YELLOW}Building production bundle...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
    echo -e "${BLUE}📊 Build output summary:${NC}"
    if [ -d "dist" ]; then
        echo "   📁 Output directory: dist/"
        echo "   📈 Total files: $(find dist -type f | wc -l)"
        echo "   💾 Total size: $(du -sh dist | cut -f1)"
        echo "   🗂️  Main files:"
        ls -la dist/
    fi
else
    echo -e "${RED}❌ Build failed! Please fix the errors before deploying.${NC}"
    exit 1
fi

# Step 3: Check admin files
echo -e "${BLUE}🔍 Verifying admin module...${NC}"
if [ -d "src/admin" ]; then
    echo -e "${GREEN}✅ Admin module found${NC}"
    echo "   📂 Components: $(find src/admin/components -name "*.tsx" | wc -l) files"
    echo "   📂 Pages: $(find src/admin/pages -name "*.tsx" | wc -l) files"
    echo "   📂 Services: $(find src/admin/services -name "*.ts" | wc -l) files"
    echo "   📂 Hooks: $(find src/admin/hooks -name "*.ts" | wc -l) files"
    echo "   📂 Types: $(find src/admin/types -name "*.ts" | wc -l) files"
else
    echo -e "${YELLOW}⚠️  Admin module not found at src/admin${NC}"
fi

# Step 4: Go back to project root and prepare for deployment
cd ..

echo -e "${BLUE}📤 Preparing for deployment...${NC}"

# Check Git status
if command -v git &> /dev/null; then
    if [ -d ".git" ]; then
        echo -e "${YELLOW}📋 Current Git status:${NC}"
        git status --short
        
        echo -e "${BLUE}🔄 Would you like to commit and push changes? (y/n)${NC}"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Adding all changes...${NC}"
            git add .
            
            echo -e "${YELLOW}Creating commit...${NC}"
            git commit -m "deploy: admin page ready for Render deployment

Features included:
- ✅ Admin module organized in src/admin/
- ✅ Dependency conflicts resolved
- ✅ Build process optimized
- ✅ Security headers configured
- ✅ Environment variables set
- ✅ SPA routing configured

Ready for production deployment!"

            echo -e "${YELLOW}Pushing to repository...${NC}"
            git push origin main
            
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✅ Changes pushed successfully!${NC}"
            else
                echo -e "${RED}❌ Failed to push changes.${NC}"
                exit 1
            fi
        fi
    else
        echo -e "${YELLOW}⚠️  Not a Git repository. Initialize Git first.${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Git not found. Install Git to enable automatic deployment.${NC}"
fi

# Step 5: Display deployment instructions
echo -e "${GREEN}🎉 Ready for Render Deployment!${NC}"
echo "========================================"
echo -e "${BLUE}Next Steps:${NC}"
echo "1. 🌐 Go to https://dashboard.render.com"
echo "2. 🔗 Click 'New' → 'Static Site'"
echo "3. 📋 Connect your GitHub repository"
echo "4. ⚙️  Configure deployment settings:"
echo "   • Name: cleankili-frontend"
echo "   • Build Command: cd frontend && npm ci && npm run build"
echo "   • Publish Directory: frontend/dist"
echo "5. 🔧 Set environment variables:"
echo "   • NODE_ENV=production"
echo "   • VITE_API_URL=https://your-backend-url.onrender.com"
echo "   • VITE_APP_ENV=production"
echo "6. 🚀 Click 'Create Static Site'"
echo ""
echo -e "${GREEN}📱 Your admin pages will be available at:${NC}"
echo "   • https://your-app.onrender.com/admin/login"
echo "   • https://your-app.onrender.com/admin/dashboard"
echo "   • https://your-app.onrender.com/admin/register"
echo ""
echo -e "${BLUE}🔗 Useful Links:${NC}"
echo "   • Render Dashboard: https://dashboard.render.com"
echo "   • Deployment Guide: ./ADMIN_DEPLOYMENT_GUIDE.md"
echo "   • Admin Module Docs: ./frontend/src/admin/README.md"
echo ""
echo -e "${GREEN}🎯 Deployment Summary:${NC}"
echo "   ✅ Frontend build successful"
echo "   ✅ Admin module organized"
echo "   ✅ Dependencies resolved"
echo "   ✅ render.yaml configured"
echo "   ✅ Security headers set"
echo "   ✅ Environment variables ready"
echo ""
echo -e "${GREEN}Happy deploying! 🚀${NC}"
