#!/bin/bash

# CleanKili Frontend Build Script for Render Deployment

echo "🚀 Starting CleanKili Frontend Build..."

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the frontend directory."
    exit 1
fi

# Set environment to production
export NODE_ENV=production

echo "📦 Installing dependencies..."
npm ci --only=production

echo "🔧 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output is in the 'dist' directory"
    
    # Display build info
    if [ -d "dist" ]; then
        echo "📊 Build statistics:"
        echo "   Total files: $(find dist -type f | wc -l)"
        echo "   Total size: $(du -sh dist | cut -f1)"
    fi
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Frontend ready for deployment!"
