const https = require("https");

async function getCurrentIP() {
  return new Promise((resolve, reject) => {
    https
      .get("https://api.ipify.org?format=json", (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const result = JSON.parse(data);
            resolve(result.ip);
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

async function checkIP() {
  try {
    console.log("🔍 Checking your current IP address...\n");

    const ip = await getCurrentIP();

    console.log("✅ Your current IP address is:");
    console.log(`   ${ip}\n`);

    console.log("📋 To fix the Atlas connection issue:");
    console.log("   1. Go to MongoDB Atlas Dashboard");
    console.log("   2. Navigate to Network Access");
    console.log('   3. Click "Add IP Address"');
    console.log("   4. Add this IP: " + ip);
    console.log(
      '   5. Or use "Allow Access from Anywhere" (0.0.0.0/0) for testing\n'
    );

    console.log("🔗 Quick Links:");
    console.log("   - Atlas Dashboard: https://cloud.mongodb.com");
    console.log(
      "   - Network Access: https://cloud.mongodb.com/v2/[your-cluster-id]/security/network/access"
    );
  } catch (error) {
    console.error("❌ Failed to get IP address:", error.message);
    console.log("\n💡 Manual steps:");
    console.log("   1. Visit https://whatismyipaddress.com/");
    console.log("   2. Copy your IP address");
    console.log("   3. Add it to MongoDB Atlas Network Access");
  }
}

checkIP();
