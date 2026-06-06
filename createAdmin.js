// backend/createAdmin.js
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
require("dotenv").config();
const User = require("./models/User");

async function createAdmin() {
  try {
    // 1. Se connecter à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📡 Connecté à MongoDB");

    // 2. Vérifier si l'admin existe déjà
    const exists = await User.findOne({ email: "admin@smartbuild.com" });
    if (exists) {
      console.log("✅ L'admin existe déjà");
      process.exit(0);
    }

    // 3. Hasher le mot de passe
    const passwordHash = await bcrypt.hash("Admin123!", 10);

    // 4. Créer l'admin dans la base de données
    await User.create({
      name: "Admin SmartBuild",
      email: "admin@smartbuild.com",
      password: passwordHash,
      role: "admin",
      phone: "+216 00 000 000",
      address: "Tunis",
      country: "Tunisia"
    });

    console.log("\n✅ Admin créé avec succès !");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email    : admin@smartbuild.com");
    console.log("🔑 Password : Admin123!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    process.exit(1);
  }
}

createAdmin();