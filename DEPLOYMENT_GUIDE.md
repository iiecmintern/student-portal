# 🚀 Deployment Guide - Centralized URL Configuration

This guide explains how to deploy your Global LMS application with centralized URL configuration.

## 📋 Overview

The application now uses centralized URL configuration to make deployment easier. Instead of manually changing URLs in every file, you only need to update environment variables.

## 🔧 Pre-Deployment Setup

### 1. Run the URL Replacement Script

Before deploying, run the automated script to replace all hardcoded URLs:

```bash
# Make the script executable
chmod +x scripts/replace-urls.js

# Run the script
node scripts/replace-urls.js
```

This script will:

- ✅ Replace all hardcoded `http://localhost:3001` URLs with centralized configuration
- ✅ Add necessary imports to frontend files
- ✅ Update backend CORS configuration
- ✅ Process 17+ frontend files automatically

### 2. Environment Variables for Production

#### Backend (.env)

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Frontend URL (for CORS and CSP)
FRONTEND_URL=https://your-frontend-domain.com

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/global_lms
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/global_lms

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Email Configuration
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
ADMIN_EMAIL=admin@example.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@globallms.com

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,video/mp4,video/webm,application/pdf

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env)

```env
# API Configuration
VITE_API_URL=https://your-backend-domain.com
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=Global LMS
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_CERTIFICATES=true

# File Upload
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,video/mp4,video/webm,application/pdf

# Authentication
VITE_JWT_STORAGE_KEY=token
VITE_USER_STORAGE_KEY=user

# Pagination
VITE_DEFAULT_PAGE_SIZE=10
VITE_MAX_PAGE_SIZE=100

# UI Configuration
VITE_THEME=light
VITE_LANGUAGE=en
```

## 🌐 Deployment Platforms

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/dist/spa`
4. Add environment variables in Vercel dashboard

#### Backend (Railway)

1. Connect your GitHub repository to Railway
2. Set start command: `npm start`
3. Add environment variables in Railway dashboard
4. Railway will provide a URL like: `https://your-app.railway.app`

### Option 2: Netlify (Frontend) + Render (Backend)

#### Frontend (Netlify)

1. Connect your GitHub repository to Netlify
2. Set build command: `cd frontend && npm run build`
3. Set publish directory: `frontend/dist/spa`
4. Add environment variables in Netlify dashboard

#### Backend (Render)

1. Connect your GitHub repository to Render
2. Set start command: `npm start`
3. Add environment variables in Render dashboard
4. Render will provide a URL like: `https://your-app.onrender.com`

### Option 3: AWS/Google Cloud/Azure

For cloud deployment, follow the same environment variable setup but use your cloud provider's specific deployment process.

## 🔄 URL Configuration Flow

### Development

```
Frontend (localhost:8080) → Backend (localhost:3001)
```

### Production

```
Frontend (https://your-frontend.com) → Backend (https://your-backend.com)
```

## 📁 File Structure After URL Replacement

```
project/
├── frontend/
│   ├── client/
│   │   ├── config/
│   │   │   ├── api.ts          # API endpoints
│   │   │   ├── environment.ts  # Environment variables
│   │   │   └── urls.ts         # 🆕 Centralized URLs
│   │   ├── pages/              # All pages now use URLS.API.*
│   │   └── components/         # All components now use URLS.API.*
│   └── .env                    # Frontend environment variables
├── src/
│   ├── index.js               # Backend with environment-based CORS
│   └── ...
├── .env                       # Backend environment variables
└── scripts/
    └── replace-urls.js        # 🆕 URL replacement script
```

## ✅ Verification Steps

### 1. Test Local Development

```bash
# Backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### 2. Test Production Build

```bash
# Backend
npm run start:prod

# Frontend
cd frontend
npm run build
npm start
```

### 3. Check Environment Variables

```bash
# Backend health check
curl https://your-backend.com/health

# Frontend should load without errors
# Check browser console for any remaining localhost URLs
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**

   - Ensure `FRONTEND_URL` is set correctly in backend `.env`
   - Check that frontend domain matches exactly

2. **API Connection Errors**

   - Verify `VITE_API_URL` is set correctly in frontend `.env`
   - Ensure backend is accessible from frontend domain

3. **File Upload Issues**

   - Check file upload paths in `URLS.FILES.*`
   - Verify backend file serving configuration

4. **Environment Variable Issues**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify environment variable loading

### Debug Commands

```bash
# Check backend environment
node -e "console.log(require('dotenv').config())"

# Check frontend environment
cd frontend
node -e "console.log(process.env)"
```

## 🔒 Security Considerations

1. **Environment Variables**

   - Never commit `.env` files to version control
   - Use secure environment variable storage in deployment platforms
   - Rotate secrets regularly

2. **CORS Configuration**

   - Only allow necessary origins
   - Use HTTPS in production
   - Validate origin headers

3. **API Security**
   - Use rate limiting
   - Implement proper authentication
   - Validate all inputs

## 📞 Support

If you encounter issues:

1. Check the deployment platform logs
2. Verify environment variables are set correctly
3. Test API endpoints individually
4. Check browser console for errors
5. Review the URL replacement script output

---

**Note**: Always test your deployment in a staging environment before going to production.
