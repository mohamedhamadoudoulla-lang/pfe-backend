// backend/createAdmin.js
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
require("dotenv").config();
const User = require("./models/User");

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await User.findOne({ email: "admin@smartbuild.com" });
  if (exists) { console.log("✅ Admin existe déjà"); process.exit(); }
  const hash = await bcrypt.hash("Admin123!", 10);
  await User.create({ name: "Admin SmartBuild", email: "admin@smartbuild.com", password: hash, role: "admin" });
  console.log("✅ Admin créé !\n📧 admin@smartbuild.com\n🔑 Admin123!");
  process.exit();
}
main();