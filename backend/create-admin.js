const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function createAdmin() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Connected to MongoDB\n");

    // Get username and password from command line or use defaults
    const username = process.argv[2] || "admin";
    const password = process.argv[3] || "admin123";

    console.log(`📝 Creating admin user: ${username}`);

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("⚠️  User already exists!");
      console.log("   Updating password...");

      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
      await existingUser.save();

      console.log("✅ Password updated successfully!");
    } else {
      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = new User({
        username,
        password: hashedPassword,
      });

      await admin.save();
      console.log("✅ Admin user created successfully!");
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 Login Credentials:");
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("🔐 IMPORTANT: Change your password after first login!");
    console.log("");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

console.log("");
console.log("🎬 Rainbow Films - Admin User Creator");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

createAdmin();
