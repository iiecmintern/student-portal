const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Import all models
const User = require("./src/models/User");
const Course = require("./src/models/Course");
const Lesson = require("./src/models/Lesson");
const Quiz = require("./src/models/Quiz");
const Enrollment = require("./src/models/Enrollment");
const Certificate = require("./src/models/Certificate");
const Notification = require("./src/models/Notification");
const Affiliation = require("./src/models/Affiliation");
const Franchise = require("./src/models/Franchise");
const LessonProgress = require("./src/models/LessonProgress");
const QuizAttempt = require("./src/models/QuizAttempt");

const models = {
  User,
  Course,
  Lesson,
  Quiz,
  Enrollment,
  Certificate,
  Notification,
  Affiliation,
  Franchise,
  LessonProgress,
  QuizAttempt,
};

async function migrateToAtlas() {
  console.log("🚀 Starting migration to MongoDB Atlas...\n");

  try {
    // Connect to local MongoDB (source)
    console.log("📡 Connecting to local MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to local MongoDB\n");

    // Export data from local MongoDB
    const exportData = {};

    for (const [modelName, Model] of Object.entries(models)) {
      console.log(`📤 Exporting ${modelName} data...`);
      const data = await Model.find({}).lean();
      exportData[modelName] = data;
      console.log(`✅ Exported ${data.length} ${modelName} records`);
    }

    // Disconnect from local MongoDB
    await mongoose.disconnect();
    console.log("✅ Disconnected from local MongoDB\n");

    // Connect to MongoDB Atlas (destination)
    console.log("📡 Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URI_PROD, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: "majority",
    });
    console.log("✅ Connected to MongoDB Atlas\n");

    // Import data to MongoDB Atlas
    for (const [modelName, data] of Object.entries(exportData)) {
      if (data.length > 0) {
        console.log(
          `📥 Importing ${data.length} ${modelName} records to Atlas...`
        );

        // Clear existing data (optional - comment out if you want to keep existing data)
        await models[modelName].deleteMany({});

        // Insert new data
        const result = await models[modelName].insertMany(data);
        console.log(
          `✅ Successfully imported ${result.length} ${modelName} records`
        );
      }
    }

    // Create backup file
    const backupPath = path.join(__dirname, "backup-data.json");
    fs.writeFileSync(backupPath, JSON.stringify(exportData, null, 2));
    console.log(`\n💾 Backup saved to: ${backupPath}`);

    console.log("\n🎉 Migration completed successfully!");
    console.log("📊 Summary:");
    for (const [modelName, data] of Object.entries(exportData)) {
      console.log(`   - ${modelName}: ${data.length} records`);
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB Atlas");
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateToAtlas();
}

module.exports = migrateToAtlas;
