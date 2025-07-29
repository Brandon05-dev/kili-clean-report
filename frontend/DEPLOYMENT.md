# CleanKili Frontend Deployment Guide

This guide covers deploying the CleanKili frontend as a static site to Render.

## 🚀 Quick Deploy to Render

### Option 1: Using the Render Dashboard

1. **Connect your repository** to Render:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Static Site"
   - Connect your GitHub repository

2. **Configure the deployment**:
   - **Name**: `cleankili-frontend`
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`

3. **Set Environment Variables**:
   - `NODE_ENV`: `production`
   - `VITE_API_URL`: Your backend URL (e.g., `https://your-backend.onrender.com`)

### Option 2: Using render.yaml (Infrastructure as Code)

The project includes a `render.yaml` file that automatically configures both frontend and backend. Simply:

1. Connect your repository to Render
2. Render will automatically detect the `render.yaml` file
3. Both services will be deployed according to the configuration

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── config/        # Configuration files
│   ├── services/      # API services
│   └── types/         # TypeScript types
├── public/            # Static assets
├── dist/              # Build output (generated)
└── package.json       # Dependencies and scripts
```

## ⚙️ Environment Variables

### Development (.env.local)
```env
VITE_API_URL=http://localhost:5001
VITE_APP_ENV=development
VITE_ENABLE_DEBUG=true
```

### Production (Set in Render Dashboard)
```env
VITE_API_URL=https://your-backend.onrender.com
VITE_APP_ENV=production
VITE_ENABLE_DEBUG=false
```

## 🔗 API Configuration

The frontend uses a centralized API configuration in `src/config/api.ts`. This automatically:
- Detects the environment (development/production)
- Uses appropriate API URLs
- Provides type-safe endpoint definitions
- Handles request configuration

## 📊 Build Optimization

The Vite configuration includes optimizations for production:
- **Code splitting**: Separates vendor libraries, routing, and UI components
- **Tree shaking**: Removes unused code
- **Minification**: Reduces bundle size
- **Modern browser targets**: Uses latest JavaScript features

## 🚨 Troubleshooting

### Common Issues

1. **Build fails with dependency errors**:
   ```bash
   npm ci --force
   npm run build
   ```

2. **API calls fail in production**:
   - Check `VITE_API_URL` environment variable
   - Ensure backend is deployed and accessible
   - Check browser console for CORS errors

3. **Routing doesn't work on refresh**:
   - The `_redirects` file handles SPA routing
   - Ensure it's included in the build output

### Debugging

1. **Check build output**:
   ```bash
   npm run build
   ls -la dist/
   ```

2. **Test production build locally**:
   ```bash
   npm run preview
   ```

3. **Check environment variables**:
   ```javascript
   console.log(import.meta.env);
   ```

## 📈 Performance Tips

1. **Optimize images**: Use WebP format when possible
2. **Lazy load components**: Use React.lazy() for route components
3. **Bundle analysis**: Use `npm run build -- --analyze` to check bundle size
4. **CDN**: Render automatically provides CDN for static assets

## 🔒 Security

The deployment includes security headers:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 📚 Additional Resources

- [Render Static Sites Documentation](https://render.com/docs/static-sites)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Browser History](https://reactrouter.com/en/main/routers/create-browser-router)
