const mongoose = require("mongoose");
require("dotenv").config();

const TeamMember = require("./models/TeamMember");

async function testTeam() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ MongoDB Connected\n");

    console.log("📊 Fetching team members...");
    const team = await TeamMember.find();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📈 Total Team Members: ${team.length}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    if (team.length === 0) {
      console.log("⚠️  WARNING: No team members found in database!");
      console.log("");
      console.log("💡 To fix this:");
      console.log("   1. Start your backend: npm start");
      console.log("   2. Start your frontend: cd ../frontend && npm run dev");
      console.log("   3. Login to admin: http://localhost:5173/admin/login");
      console.log("   4. Go to Team section");
      console.log("   5. Add team members with photos and positions");
      console.log("");
    } else {
      console.log("👥 Team Members:\n");
      team.forEach((member, index) => {
        console.log(`${index + 1}. ${member.name}`);
        console.log(`   Position: ${member.position}`);
        console.log(`   Image: ${member.image}`);
        console.log(`   ID: ${member._id}`);
        console.log(`   Created: ${member.createdAt}`);
        console.log("");
      });
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Test completed successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("❌ ERROR:", error.message);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("");
    console.error("🔧 Troubleshooting:");
    console.error("   1. Check your .env file has DB_URL");
    console.error("   2. Verify MongoDB connection string is correct");
    console.error("   3. Ensure MongoDB Atlas allows your IP");
    console.error("   4. Check network connection");
    console.error("");
    process.exit(1);
  }
}

console.log("");
console.log("🧪 Rainbow Films - Team API Test");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

testTeam();
