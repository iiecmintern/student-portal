#!/usr/bin/env node

/**
 * Script to replace hardcoded localhost URLs with centralized configuration
 * Run this script before deployment to update all URLs
 */

const fs = require("fs");
const path = require("path");

// Configuration
const FRONTEND_DIR = path.join(__dirname, "..", "frontend", "client");
const BACKEND_DIR = path.join(__dirname, "..", "src");

// Files to process (relative to frontend/client)
const FRONTEND_FILES = [
  "pages/Index.tsx",
  "pages/Login.tsx",
  "pages/Register.tsx",
  "pages/Profile.tsx",
  "pages/MyLearning.tsx",
  "pages/LessonViewer.tsx",
  "pages/ManageLessons.tsx",
  "pages/InstructorDashboard.tsx",
  "pages/Franchise.tsx",
  "pages/Courses.tsx",
  "pages/CourseDetail.tsx",
  "pages/Contact.tsx",
  "pages/Affiliations.tsx",
  "pages/AdminDashboard.tsx",
  "pages/NotificationPanel.tsx",
  "components/QuizAttempt.tsx",
  "components/layout/AppLayout.tsx",
];

// Backend files to process
const BACKEND_FILES = ["index.js"];

// Replacement patterns
const REPLACEMENTS = {
  // Frontend replacements
  frontend: [
    {
      pattern: /const BACKEND_URL = ["']http:\/\/localhost:3001["'];/g,
      replacement: `import { BACKEND_URL } from '@/config/urls';`,
    },
    {
      pattern: /["']http:\/\/localhost:3001\/api\/auth\/login["']/g,
      replacement: `URLS.API.AUTH.LOGIN`,
    },
    {
      pattern: /["']http:\/\/localhost:3001\/api\/auth\/register["']/g,
      replacement: `URLS.API.AUTH.REGISTER`,
    },
    {
      pattern: /["']http:\/\/localhost:3001\/api\/auth\/change-password["']/g,
      replacement: `URLS.API.AUTH.CHANGE_PASSWORD`,
    },
    {
      pattern: /["']http:\/\/localhost:3001\/api\/users\/profile["']/g,
      replacement: `URLS.API.USERS.PROFILE`,
    },
    {
      pattern: /["']http:\/\/localhost:3001\/api\/courses["']/g,
      replacement: `URLS.API.COURSES.LIST`,
    },
    {
      pattern: /["']http:\/\/localhost:3001\/api\/courses\/my["']/g,
      replacement: `URLS.API.COURSES.MY_COURSES`,
    },
    {
      pattern: /["']http:\/\/localhost:3001\/api\/enrollments\/my-courses["']/g,
      replacement: `URLS.API.ENROLLMENTS.MY_COURSES`,
    },
    {
      pattern:
        /["']http:\/\/localhost:3001\/api\/enrollments\/enroll\/([^"']+)["']/g,
      replacement: `URLS.API.COURSES.ENROLL('$1')`,
    },
    {
      pattern: /["']http:\/\/localhost:3001\/api\/lessons\/upload["']/g,
      replacement: `URLS.API.LESSONS.UPLOAD`,
    },
    {
      pattern:
        /["']http:\/\/localhost:3001\/api\/lessons\/course\/([^"']+)["']/g,
      replacement: `URLS.API.LESSONS.COURSE_LESSONS('$1')`,
    },
    {
      pattern: /["']http:\/\/localhost:3001\/api\/lessons\/([^"']+)["']/g,
      replacement: `URLS.API.LESSONS.DELETE('$1')`,
    },
    {
      pattern: /["']http:\/\/localhost:3001\/api\/quizzes["']/g,
      replacement: `URLS.API.QUIZZES.CREATE`,
    },
    {
      pattern:
        /["']http:\/\/localhost:3001\/api\/analytics\/progress\/([^"']+)["']/g,
      replacement: `URLS.API.ANALYTICS.PROGRESS('$1')`,
    },
    {
      pattern: /["']http:\/\/localhost:3001\/api\/analytics\/hours["']/g,
      replacement: `URLS.API.ANALYTICS.HOURS`,
    },
    {
      pattern: /["']http:\/\/localhost:3001\/api\/notifications["']/g,
      replacement: `URLS.API.NOTIFICATIONS.LIST`,
    },
    {
      pattern: /["']http:\/\/localhost:3001\/api\/notifications\/([^"']+)["']/g,
      replacement: `URLS.API.NOTIFICATIONS.DELETE('$1')`,
    },
    {
      pattern: /["']http:\/\/localhost:3001\/api\/affiliations["']/g,
      replacement: `URLS.API.AFFILIATIONS.LIST`,
    },
    {
      pattern: /["']http:\/\/localhost:3001\/api\/affiliations\/([^"']+)["']/g,
      replacement: `URLS.API.AFFILIATIONS.UPDATE('$1')`,
    },
    {
      pattern: /["']http:\/\/localhost:3001\/api\/franchise["']/g,
      replacement: `URLS.API.FRANCHISE.LIST`,
    },
    {
      pattern: /["']http:\/\/localhost:3001\/api\/contact["']/g,
      replacement: `URLS.API.CONTACT.SEND`,
    },
    // File URL replacements
    {
      pattern: /src=\{["']http:\/\/localhost:3001([^"']+)["']\}/g,
      replacement: `src={URLS.FILES.THUMBNAIL('$1')}`,
    },
    {
      pattern: /src=\{["']http:\/\/localhost:3001\/logo\/([^"']+)["']\}/g,
      replacement: `src={URLS.FILES.LOGO('$1')}`,
    },
  ],

  // Backend replacements
  backend: [
    {
      pattern: /['"]http:\/\/localhost:8080['"]/g,
      replacement: `process.env.FRONTEND_URL || 'http://localhost:8080'`,
    },
  ],
};

// Function to process a file
function processFile(filePath, replacements) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, "utf8");
    let originalContent = content;
    let changes = 0;

    // Apply replacements
    replacements.forEach(({ pattern, replacement }) => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        changes += matches.length;
      }
    });

    // Write back if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✅ Updated ${filePath} (${changes} changes)`);
      return true;
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to add imports to files that need them
function addImports() {
  const filesNeedingImports = [
    path.join(FRONTEND_DIR, "pages/Index.tsx"),
    path.join(FRONTEND_DIR, "pages/Login.tsx"),
    path.join(FRONTEND_DIR, "pages/Register.tsx"),
    path.join(FRONTEND_DIR, "pages/Profile.tsx"),
    path.join(FRONTEND_DIR, "pages/MyLearning.tsx"),
    path.join(FRONTEND_DIR, "pages/LessonViewer.tsx"),
    path.join(FRONTEND_DIR, "pages/ManageLessons.tsx"),
    path.join(FRONTEND_DIR, "pages/InstructorDashboard.tsx"),
    path.join(FRONTEND_DIR, "pages/Franchise.tsx"),
    path.join(FRONTEND_DIR, "pages/Courses.tsx"),
    path.join(FRONTEND_DIR, "pages/CourseDetail.tsx"),
    path.join(FRONTEND_DIR, "pages/Contact.tsx"),
    path.join(FRONTEND_DIR, "pages/Affiliations.tsx"),
    path.join(FRONTEND_DIR, "pages/AdminDashboard.tsx"),
    path.join(FRONTEND_DIR, "pages/NotificationPanel.tsx"),
    path.join(FRONTEND_DIR, "components/QuizAttempt.tsx"),
    path.join(FRONTEND_DIR, "components/layout/AppLayout.tsx"),
  ];

  filesNeedingImports.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, "utf8");

      // Check if URLS import already exists
      if (!content.includes("import { URLS } from '@/config/urls'")) {
        // Add import after existing imports
        const importMatch = content.match(/import.*from.*['"]@\/.*['"];?\s*\n/);
        if (importMatch) {
          const insertIndex =
            content.lastIndexOf(importMatch[0]) + importMatch[0].length;
          content =
            content.slice(0, insertIndex) +
            "import { URLS } from '@/config/urls';\n" +
            content.slice(insertIndex);

          fs.writeFileSync(filePath, content, "utf8");
          console.log(`✅ Added URLS import to ${filePath}`);
        }
      }
    }
  });
}

// Main execution
function main() {
  console.log("🚀 Starting URL replacement process...\n");

  let totalChanges = 0;

  // Process frontend files
  console.log("📁 Processing frontend files...");
  FRONTEND_FILES.forEach((file) => {
    const filePath = path.join(FRONTEND_DIR, file);
    if (processFile(filePath, REPLACEMENTS.frontend)) {
      totalChanges++;
    }
  });

  // Process backend files
  console.log("\n📁 Processing backend files...");
  BACKEND_FILES.forEach((file) => {
    const filePath = path.join(BACKEND_DIR, file);
    if (processFile(filePath, REPLACEMENTS.backend)) {
      totalChanges++;
    }
  });

  // Add imports to frontend files
  console.log("\n📦 Adding URLS imports...");
  addImports();

  console.log(`\n✅ URL replacement complete! ${totalChanges} files updated.`);
  console.log("\n📋 Next steps:");
  console.log("1. Set VITE_API_URL in your frontend .env file for production");
  console.log("2. Set FRONTEND_URL in your backend .env file for production");
  console.log("3. Test the application to ensure all URLs work correctly");
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { processFile, addImports };
