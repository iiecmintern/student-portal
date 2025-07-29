const mongoose = require("mongoose");
require("dotenv").config();

async function testConnection(uri, name) {
  console.log(`\n🔍 Testing ${name} Atlas Connection...`);
  console.log(`   URI: ${uri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")}`);

  try {
    const startTime = Date.now();

    const conn = await mongoose.connect(uri, {
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

    console.log(`✅ ${name} Connection Successful!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Connection Time: ${connectionTime}ms`);

    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.error(`❌ ${name} Connection Failed!`);
    console.error(`   Error: ${error.message}`);

    if (error.message.includes("whitelist")) {
      console.log("   💡 Solution: Add your IP to Atlas Network Access");
    } else if (error.message.includes("Authentication failed")) {
      console.log("   💡 Solution: Check username/password");
    } else if (error.message.includes("ENOTFOUND")) {
      console.log("   💡 Solution: Check cluster hostname");
    }

    return false;
  }
}

async function testBothAtlas() {
  console.log("🚀 Testing Both Atlas Connections...\n");

  const personalAtlas =
    "mongodb+srv://aman2450:Am%40n3101@mern.suqdd.mongodb.net/global_lms";
  const companyAtlas =
    "mongodb+srv://iiecmintern2:mKaI1T3F5K3I95uu@cluster0.sidgh14.mongodb.net/global_lms";

  const personalResult = await testConnection(personalAtlas, "Personal");
  const companyResult = await testConnection(companyAtlas, "Company");

  console.log("\n📊 Summary:");
  console.log(
    `   Personal Atlas: ${personalResult ? "✅ Working" : "❌ Failed"}`
  );
  console.log(
    `   Company Atlas: ${companyResult ? "✅ Working" : "❌ Failed"}`
  );

  if (!companyResult && personalResult) {
    console.log("\n💡 Recommendation:");
    console.log(
      "   Use Personal Atlas temporarily while fixing Company Atlas IP whitelist"
    );
  } else if (!personalResult && !companyResult) {
    console.log("\n💡 Recommendation:");
    console.log("   Check your internet connection and Atlas cluster status");
  } else if (companyResult) {
    console.log("\n🎉 Company Atlas is working! You can switch to it.");
  }
}

testBothAtlas();
