const nodemailer = require("nodemailer");
require("dotenv").config();

async function testEmailConfig() {
  console.log("📧 Testing Email Configuration...\n");

  // Check environment variables
  console.log("📋 Email Configuration Check:");
  console.log(
    `   MAIL_USER: ${process.env.MAIL_USER ? "✅ Set" : "❌ Not set"}`
  );
  console.log(
    `   MAIL_PASS: ${process.env.MAIL_PASS ? "✅ Set" : "❌ Not set"}`
  );
  console.log(
    `   SMTP_HOST: ${process.env.SMTP_HOST ? "✅ Set" : "❌ Not set"}`
  );
  console.log(
    `   SMTP_PORT: ${process.env.SMTP_PORT ? "✅ Set" : "❌ Not set"}`
  );
  console.log(
    `   SMTP_FROM: ${process.env.SMTP_FROM ? "✅ Set" : "❌ Not set"}`
  );

  if (
    !process.env.MAIL_USER ||
    !process.env.MAIL_PASS ||
    !process.env.SMTP_HOST
  ) {
    console.error("\n❌ Missing required email configuration");
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || process.env.MAIL_USER,
      pass: process.env.SMTP_PASS || process.env.MAIL_PASS,
    },
  });

  try {
    console.log("\n📡 Testing SMTP connection...");

    // Verify connection
    await transporter.verify();
    console.log("✅ SMTP connection successful!");

    // Test email
    console.log("\n📤 Sending test email...");

    const testEmail = {
      from: process.env.SMTP_FROM || process.env.MAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.MAIL_USER,
      subject: "Test Email - Global LMS Configuration",
      html: `
        <h2>Email Configuration Test</h2>
        <p>This is a test email to verify your email configuration is working correctly.</p>
        <p><strong>Configuration Details:</strong></p>
        <ul>
          <li>SMTP Host: ${process.env.SMTP_HOST}</li>
          <li>SMTP Port: ${process.env.SMTP_PORT}</li>
          <li>From Email: ${process.env.SMTP_FROM || process.env.MAIL_USER}</li>
          <li>To Email: ${process.env.ADMIN_EMAIL || process.env.MAIL_USER}</li>
        </ul>
        <p>If you receive this email, your email configuration is working properly!</p>
        <hr>
        <p><small>Sent from Global LMS Application</small></p>
      `,
    };

    const info = await transporter.sendMail(testEmail);

    console.log("✅ Test email sent successfully!");
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Sent to: ${testEmail.to}`);
  } catch (error) {
    console.error("\n❌ Email configuration failed:");
    console.error(`   Error: ${error.message}`);

    // Provide helpful error messages
    if (error.code === "EAUTH") {
      console.log("\n💡 Authentication Error - Possible solutions:");
      console.log("   1. Check username and password");
      console.log(
        "   2. For Gmail, use App Password instead of regular password"
      );
      console.log('   3. Enable "Less secure app access" (not recommended)');
    } else if (error.code === "ECONNECTION") {
      console.log("\n💡 Connection Error - Possible solutions:");
      console.log("   1. Check SMTP host and port");
      console.log("   2. Verify internet connection");
      console.log("   3. Check firewall settings");
    } else if (error.code === "ETIMEDOUT") {
      console.log("\n💡 Timeout Error - Possible solutions:");
      console.log("   1. Check SMTP server status");
      console.log("   2. Try different port (587, 465, 25)");
      console.log("   3. Check network connectivity");
    }
  }
}

testEmailConfig();
