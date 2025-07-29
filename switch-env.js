#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
require("dotenv").config();

const envFile = path.join(__dirname, ".env");

function switchEnvironment(targetEnv) {
  try {
    // Read current .env file
    let envContent = fs.readFileSync(envFile, "utf8");

    // Update NODE_ENV
    envContent = envContent.replace(/NODE_ENV=.*/, `NODE_ENV=${targetEnv}`);

    // Write back to .env file
    fs.writeFileSync(envFile, envContent);

    console.log(`✅ Environment switched to: ${targetEnv}`);
    console.log(`🌍 NODE_ENV is now set to: ${targetEnv}`);

    if (targetEnv === "production") {
      console.log("📡 Will use MongoDB Atlas (MONGODB_URI_PROD)");
    } else {
      console.log("🏠 Will use local MongoDB (MONGODB_URI)");
    }
  } catch (error) {
    console.error("❌ Error switching environment:", error.message);
    process.exit(1);
  }
}

// Get command line argument
const targetEnv = process.argv[2];

if (!targetEnv || !["development", "production"].includes(targetEnv)) {
  console.log("Usage: node switch-env.js [development|production]");
  console.log("");
  console.log("Examples:");
  console.log("  node switch-env.js development  # Switch to local MongoDB");
  console.log("  node switch-env.js production   # Switch to MongoDB Atlas");
  process.exit(1);
}

switchEnvironment(targetEnv);
