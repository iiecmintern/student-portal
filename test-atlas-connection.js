const mongoose = require("mongoose");
require("dotenv").config();

async function testAtlasConnection() {
  console.log("🔍 Testing MongoDB Atlas Connection...\n");

  // Check environment variables
  console.log("📋 Environment Check:");
  console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(
    `   MONGODB_URI: ${process.env.MONGODB_URI ? "✅ Set" : "❌ Not set"}`
  );
  console.log(
    `   MONGODB_URI_PROD: ${
      process.env.MONGODB_URI_PROD ? "✅ Set" : "❌ Not set"
    }`
  );

  // Determine which URI to use
  const mongoURI =
    process.env.NODE_ENV === "production"
      ? process.env.MONGODB_URI_PROD
      : process.env.MONGODB_URI;

  console.log(
    `\n🌍 Using URI: ${
      process.env.NODE_ENV === "production"
        ? "PRODUCTION (Atlas)"
        : "DEVELOPMENT (Local)"
    }`
  );

  if (!mongoURI) {
    console.error("❌ No MongoDB URI found in environment variables");
    console.log("\n💡 To test Atlas connection:");
    console.log("   1. Set NODE_ENV=production in your .env file");
    console.log(
      "   2. Ensure MONGODB_URI_PROD is set with your Atlas connection string"
    );
    process.exit(1);
  }

  // Test connection
  try {
    console.log("\n📡 Attempting to connect...");

    const startTime = Date.now();

    // Updated connection options (removed deprecated options)
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: "majority",
    });

    const endTime = Date.now();
    const connectionTime = endTime - startTime;

    console.log("✅ Connection Successful!");
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Connection Time: ${connectionTime}ms`);
    console.log(
      `   Ready State: ${
        conn.connection.readyState === 1 ? "Connected" : "Disconnected"
      }`
    );

    // Test a simple query
    console.log("\n🧪 Testing database query...");
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`   Collections found: ${collections.length}`);

    if (collections.length > 0) {
      console.log("   Collection names:");
      collections.forEach((col) => {
        console.log(`     - ${col.name}`);
      });
    }

    // Test ping
    console.log("\n🏓 Testing ping...");
    const pingResult = await conn.connection.db.admin().ping();
    console.log(`   Ping result: ${JSON.stringify(pingResult)}`);

    console.log("\n🎉 Atlas connection is working perfectly!");
  } catch (error) {
    console.error("\n❌ Connection Failed!");
    console.error(`   Error: ${error.message}`);

    // Provide helpful error messages
    if (error.message.includes("ECONNREFUSED")) {
      console.log("\n💡 Possible solutions:");
      console.log("   1. Check if your Atlas cluster is running");
      console.log("   2. Verify your connection string is correct");
      console.log("   3. Check if your IP is whitelisted in Atlas");
    } else if (error.message.includes("Authentication failed")) {
      console.log("\n💡 Possible solutions:");
      console.log("   1. Check your username and password");
      console.log("   2. Ensure your database user has proper permissions");
      console.log("   3. Verify the connection string format");
    } else if (error.message.includes("ENOTFOUND")) {
      console.log("\n💡 Possible solutions:");
      console.log("   1. Check your internet connection");
      console.log("   2. Verify the cluster hostname is correct");
      console.log("   3. Try using a different DNS server");
    }

    process.exit(1);
  } finally {
    // Close connection
    await mongoose.disconnect();
    console.log("\n🔌 Connection closed");
  }
}

// Run the test
testAtlasConnection();
