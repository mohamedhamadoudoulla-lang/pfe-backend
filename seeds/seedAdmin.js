const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const connectDB = require("../config/db");

dotenv.config();
connectDB();

async function seedAdmin() {
  try {
    // Vérifier si un admin existe déjà
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("✓ Un administrateur existe déjà:", adminExists.email);
      process.exit(0);
    }

    // Créer un administrateur par défaut
    const admin = await User.create({
      name: "Administrateur",
      email: "admin@smartbuild.tn",
      password: "Admin@123456", // À changer après première connexion
      role: "admin",
      phone: "+216 1234567",
      avatar: "⚙️"
    });

    console.log("✅ Administrateur créé avec succès:");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Mot de passe: Admin@123456`);
    console.log("   ⚠️  Changez le mot de passe après la première connexion!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur création admin:", error.message);
    process.exit(1);
  }
}

seedAdmin();
