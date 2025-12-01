const mongoose = require("mongoose");
const Admin = require("../models/Admin");
require("dotenv").config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: "admin" });

    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit(0);
    }

    // Create super admin
    const admin = new Admin({
      username: "admin",
      email: "admin@rainbowfilms.com",
      password: "admin123",
      role: "superadmin",
    });

    await admin.save();

    console.log("✅ Super Admin created successfully!");
    console.log("Username: admin");
    console.log("Password: admin123");
    console.log("⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createSuperAdmin();
