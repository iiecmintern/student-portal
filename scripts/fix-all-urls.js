#!/usr/bin/env node

/**
 * Comprehensive script to fix all remaining hardcoded localhost URLs
 */

const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = path.join(__dirname, '..', 'frontend', 'client');

// Files to process
const FILES_TO_FIX = [
  'pages/Profile.tsx',
  'pages/NotificationPanel.tsx',
  'pages/MyLearning.tsx',
  'pages/ManageLessons.tsx',
  'pages/InstructorDashboard.tsx',
  'pages/Index.tsx',
  'pages/Courses.tsx',
  'pages/Affiliations.tsx',
  'components/layout/AppLayout.tsx',
];

// Replacement patterns
const REPLACEMENTS = [
  // API endpoints
  {
    pattern: /["']http:\/\/localhost:3001\/api\/users["']/g,
    replacement: `URLS.API.USERS.LIST`,
  },
  {
    pattern: /["']http:\/\/localhost:3001\/api\/users\/([^"']+)["']/g,
    replacement: `URLS.API.USERS.DETAIL('$1')`,
  },
  {
    pattern: /["']http:\/\/localhost:3001\/api\/analytics\/progress\/([^"']+)["']/g,
    replacement: `URLS.API.ANALYTICS.PROGRESS('$1')`,
  },
  {
    pattern: /["']http:\/\/localhost:3001\/api\/notifications\/([^"']+)["']/g,
    replacement: `URLS.API.NOTIFICATIONS.DELETE('$1')`,
  },
  {
    pattern: /["']http:\/\/localhost:3001\/api\/lessons\/course\/([^"']+)["']/g,
    replacement: `URLS.API.LESSONS.COURSE_LESSONS('$1')`,
  },
  {
    pattern: /["']http:\/\/localhost:3001\/api\/lessons["']/g,
    replacement: `URLS.API.LESSONS.UPLOAD`,
  },
  {
    pattern: /["']http:\/\/localhost:3001\/api\/lessons\/([^"']+)["']/g,
    replacement: `URLS.API.LESSONS.DELETE('$1')`,
  },
  {
    pattern: /["']http:\/\/localhost:3001\/api\/courses\/([^"']+)["']/g,
    replacement: `URLS.API.COURSES.UPDATE('$1')`,
  },
  {
    pattern: /["']http:\/\/localhost:3001\/api\/enrollments\/enroll\/([^"']+)["']/g,
    replacement: `URLS.API.COURSES.ENROLL('$1')`,
  },
  {
    pattern: /["']http:\/\/localhost:3001\/api\/affiliations\/([^"']+)["']/g,
    replacement: `URLS.API.AFFILIATIONS.UPDATE('$1')`,
  },
  {
    pattern: /["']http:\/\/localhost:3001\/api\/affiliations["']/g,
    replacement: `URLS.API.AFFILIATIONS.LIST`,
  },
  
  // File URLs
  {
    pattern: /src=\{["']http:\/\/localhost:3001([^"']+)["']\}/g,
    replacement: `src={URLS.FILES.THUMBNAIL('$1')}`,
  },
  {
    pattern: /src=\{["']http:\/\/localhost:3001\/logo\/([^"']+)["']\}/g,
    replacement: `src={URLS.FILES.LOGO('$1')}`,
  },
  {
    pattern: /const fileUrl = ["']http:\/\/localhost:3001([^"']+)["']/g,
    replacement: `const fileUrl = URLS.FILES.UPLOAD('$1')`,
  },
];

// Add missing endpoints to urls.ts
function updateUrlsConfig() {
  const urlsPath = path.join(FRONTEND_DIR, 'config', 'urls.ts');
  let content = fs.readFileSync(urlsPath, 'utf8');
  
  // Add missing COURSES endpoints
  if (!content.includes('UPDATE: (id: string)')) {
    content = content.replace(
      /COURSES: \{[\s\S]*?\},/,
      `COURSES: {
      LIST: buildUrl("/api/courses"),
      MY_COURSES: buildUrl("/api/courses/my"),
      UPDATE: (id: string) => buildUrl(\`/api/courses/\${id}\`),
      ENROLL: (courseId: string) =>
        buildUrl(\`/api/enrollments/enroll/\${courseId}\`),
    },`
    );
  }
  
  fs.writeFileSync(urlsPath, content, 'utf8');
  console.log('✅ Updated urls.ts with missing endpoints');
}

// Process a single file
function processFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changes = 0;

    // Check if URLS import exists
    const hasUrlsImport = content.includes("import { URLS } from '@/config/urls'");
    
    // Apply replacements
    REPLACEMENTS.forEach(({ pattern, replacement }) => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        changes += matches.length;
      }
    });

    // Add URLS import if needed and changes were made
    if (changes > 0 && !hasUrlsImport) {
      const importMatch = content.match(/import.*from.*['"]@\/.*['"];?\s*\n/);
      if (importMatch) {
        const insertIndex = content.lastIndexOf(importMatch[0]) + importMatch[0].length;
        content = content.slice(0, insertIndex) + 
                 "import { URLS } from '@/config/urls';\n" +
                 content.slice(insertIndex);
      }
    }

    // Write back if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
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

// Main execution
function main() {
  console.log('🚀 Starting comprehensive URL fix...\n');

  // Update urls.ts first
  updateUrlsConfig();

  let totalChanges = 0;

  // Process all files
  FILES_TO_FIX.forEach(file => {
    const filePath = path.join(FRONTEND_DIR, file);
    if (processFile(filePath)) {
      totalChanges++;
    }
  });

  console.log(`\n✅ URL fix complete! ${totalChanges} files updated.`);
  console.log('\n📋 Next steps:');
  console.log('1. Commit and push the changes');
  console.log('2. Wait for Netlify to redeploy');
  console.log('3. Test the application');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { processFile, updateUrlsConfig }; 