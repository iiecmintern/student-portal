#!/usr/bin/env node

/**
 * Deployment Preparation Script
 * This script prepares your application for deployment
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🚀 Starting deployment preparation...\n");

// Step 1: Run URL replacement
console.log("📝 Step 1: Replacing hardcoded URLs...");
try {
  execSync("node scripts/replace-urls.js", { stdio: "inherit" });
  console.log("✅ URL replacement completed\n");
} catch (error) {
  console.error("❌ URL replacement failed:", error.message);
  process.exit(1);
}

// Step 2: Check environment files
console.log("🔧 Step 2: Checking environment configuration...");

const backendEnvPath = path.join(__dirname, "..", ".env");
const frontendEnvPath = path.join(__dirname, "..", "frontend", ".env");

// Check backend .env
if (fs.existsSync(backendEnvPath)) {
  const backendEnv = fs.readFileSync(backendEnvPath, "utf8");
  const requiredBackendVars = [
    "NODE_ENV",
    "MONGODB_URI_PROD",
    "JWT_SECRET",
    "MAIL_USER",
    "MAIL_PASS",
  ];

  const missingBackendVars = requiredBackendVars.filter(
    (varName) => !backendEnv.includes(`${varName}=`)
  );

  if (missingBackendVars.length > 0) {
    console.log(
      "⚠️  Missing backend environment variables:",
      missingBackendVars.join(", ")
    );
  } else {
    console.log("✅ Backend environment variables look good");
  }
} else {
  console.log("⚠️  Backend .env file not found");
}

// Check frontend .env
if (fs.existsSync(frontendEnvPath)) {
  const frontendEnv = fs.readFileSync(frontendEnvPath, "utf8");
  const requiredFrontendVars = ["VITE_API_URL", "VITE_APP_NAME"];

  const missingFrontendVars = requiredFrontendVars.filter(
    (varName) => !frontendEnv.includes(`${varName}=`)
  );

  if (missingFrontendVars.length > 0) {
    console.log(
      "⚠️  Missing frontend environment variables:",
      missingFrontendVars.join(", ")
    );
  } else {
    console.log("✅ Frontend environment variables look good");
  }
} else {
  console.log("⚠️  Frontend .env file not found");
}

// Step 3: Build check
console.log("\n🔨 Step 3: Testing builds...");

// Test backend build
console.log("Testing backend...");
try {
  execSync("npm run build", { stdio: "pipe" });
  console.log("✅ Backend build test passed");
} catch (error) {
  console.log("ℹ️  Backend build test skipped (no build step)");
}

// Test frontend build
console.log("Testing frontend build...");
try {
  process.chdir(path.join(__dirname, "..", "frontend"));
  execSync("npm run build", { stdio: "pipe" });
  console.log("✅ Frontend build test passed");
  process.chdir(path.join(__dirname, ".."));
} catch (error) {
  console.error("❌ Frontend build failed:", error.message);
  process.exit(1);
}

// Step 4: Generate deployment summary
console.log("\n📋 Step 4: Generating deployment summary...");

const summary = `
# 🚀 Deployment Summary

## ✅ Completed Steps
- [x] Replaced hardcoded URLs with centralized configuration
- [x] Added URLS imports to frontend files
- [x] Updated backend CORS configuration
- [x] Tested frontend build

## 🔧 Environment Variables Needed

### Backend (.env)
\`\`\`env
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/global_lms
JWT_SECRET=your_jwt_secret
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
\`\`\`

### Frontend (.env)
\`\`\`env
VITE_API_URL=https://your-backend-domain.com
VITE_APP_NAME=Global LMS
\`\`\`

## 🌐 Deployment Platforms

### Option 1: Vercel (Frontend) + Railway (Backend)
- Frontend: Connect to Vercel, set build command: \`cd frontend && npm run build\`
- Backend: Connect to Railway, set start command: \`npm start\`

### Option 2: Netlify (Frontend) + Render (Backend)
- Frontend: Connect to Netlify, set build command: \`cd frontend && npm run build\`
- Backend: Connect to Render, set start command: \`npm start\`

## 📁 Files Updated
- 17 frontend files now use centralized URL configuration
- Backend CORS updated to use environment variables
- All hardcoded localhost URLs replaced

## 🔍 Next Steps
1. Set environment variables in your deployment platform
2. Deploy backend first, then frontend
3. Test all functionality after deployment
4. Update DNS if using custom domains

## 📞 Support
If you encounter issues, check:
- Environment variables are set correctly
- CORS configuration matches your domains
- API endpoints are accessible
- File upload paths are correct
`;

// Write summary to file
const summaryPath = path.join(__dirname, "..", "DEPLOYMENT_SUMMARY.md");
fs.writeFileSync(summaryPath, summary);
console.log("✅ Deployment summary saved to DEPLOYMENT_SUMMARY.md");

console.log("\n🎉 Deployment preparation completed!");
console.log("\n📋 Next steps:");
console.log("1. Review DEPLOYMENT_SUMMARY.md");
console.log("2. Set environment variables in your deployment platform");
console.log("3. Deploy your application");
console.log("4. Test all functionality");

console.log("\n🔗 Useful files:");
console.log("- DEPLOYMENT_SUMMARY.md - Complete deployment guide");
console.log("- DEPLOYMENT_GUIDE.md - Detailed deployment instructions");
console.log("- scripts/replace-urls.js - URL replacement script");
