const mongoose = require("mongoose");
const dotenv = require("dotenv");
const MaterialRule = require("../models/MaterialRule");
const Product = require("../models/Product");
const User = require("../models/User");

dotenv.config();

const regles = [
  // --- ECO ---
  { type: "gravier",     nom: "Gravier",       scenario: "eco",      ratioParM2: 0.12, unite: "m3" },
  { type: "sable_epure", nom: "Sable épuré",   scenario: "eco",      ratioParM2: 0.10, unite: "m3" },
  { type: "ciment",      nom: "Ciment",         scenario: "eco",      ratioParM2: 40,   unite: "kg" },
  { type: "fer_ouvrage", nom: "Fer ouvrage",    scenario: "eco",      ratioParM2: 6,    unite: "kg" },
  { type: "beton_dose",  nom: "Béton dosé",     scenario: "eco",      ratioParM2: 0.20, unite: "m3" },
  { type: "brique",      nom: "Brique",         scenario: "eco",      ratioParM2: 35,   unite: "unite" },
  { type: "fer_rond_10", nom: "Fer rond Ø10",   scenario: "eco",      ratioParM2: 0.2,  unite: "barre" },
  { type: "fer_rond_6",  nom: "Fer rond Ø6",    scenario: "eco",      ratioParM2: 0.15, unite: "barre" },
  { type: "tube_pvc_125",nom: "Tube PVC Ø125",  scenario: "eco",      ratioParM2: 0.4,  unite: "ml" },
  { type: "tube_pvc_75", nom: "Tube PVC Ø75",   scenario: "eco",      ratioParM2: 0.6,  unite: "ml" },

  // --- STANDARD ---
  { type: "gravier",     nom: "Gravier",       scenario: "standard", ratioParM2: 0.15, unite: "m3" },
  { type: "sable_epure", nom: "Sable épuré",   scenario: "standard", ratioParM2: 0.12, unite: "m3" },
  { type: "ciment",      nom: "Ciment",         scenario: "standard", ratioParM2: 50,   unite: "kg" },
  { type: "fer_ouvrage", nom: "Fer ouvrage",    scenario: "standard", ratioParM2: 8,    unite: "kg" },
  { type: "beton_dose",  nom: "Béton dosé",     scenario: "standard", ratioParM2: 0.25, unite: "m3" },
  { type: "brique",      nom: "Brique",         scenario: "standard", ratioParM2: 40,   unite: "unite" },
  { type: "fer_rond_10", nom: "Fer rond Ø10",   scenario: "standard", ratioParM2: 0.3,  unite: "barre" },
  { type: "fer_rond_6",  nom: "Fer rond Ø6",    scenario: "standard", ratioParM2: 0.2,  unite: "barre" },
  { type: "tube_pvc_125",nom: "Tube PVC Ø125",  scenario: "standard", ratioParM2: 0.5,  unite: "ml" },
  { type: "tube_pvc_75", nom: "Tube PVC Ø75",   scenario: "standard", ratioParM2: 0.8,  unite: "ml" },

  // --- PREMIUM ---
  { type: "gravier",     nom: "Gravier",       scenario: "premium",  ratioParM2: 0.18, unite: "m3" },
  { type: "sable_epure", nom: "Sable épuré",   scenario: "premium",  ratioParM2: 0.15, unite: "m3" },
  { type: "ciment",      nom: "Ciment",         scenario: "premium",  ratioParM2: 60,   unite: "kg" },
  { type: "fer_ouvrage", nom: "Fer ouvrage",    scenario: "premium",  ratioParM2: 10,   unite: "kg" },
  { type: "beton_dose",  nom: "Béton dosé",     scenario: "premium",  ratioParM2: 0.30, unite: "m3" },
  { type: "brique",      nom: "Brique",         scenario: "premium",  ratioParM2: 45,   unite: "unite" },
  { type: "fer_rond_10", nom: "Fer rond Ø10",   scenario: "premium",  ratioParM2: 0.4,  unite: "barre" },
  { type: "fer_rond_6",  nom: "Fer rond Ø6",    scenario: "premium",  ratioParM2: 0.25, unite: "barre" },
  { type: "tube_pvc_125",nom: "Tube PVC Ø125",  scenario: "premium",  ratioParM2: 0.6,  unite: "ml" },
  { type: "tube_pvc_75", nom: "Tube PVC Ø75",   scenario: "premium",  ratioParM2: 1.0,  unite: "ml" },
];

const produits = [
  { nom: "Gravier 15/25",      type: "gravier",     categorie: "materiaux", unite: "m3",     prixUnitaire: 46,    scenario: ["eco","standard","premium"] },
  { nom: "Sable épuré 0/4",    type: "sable_epure", categorie: "materiaux", unite: "m3",     prixUnitaire: 34,    scenario: ["eco","standard","premium"] },
  { nom: "Ciment CPJ 45",      type: "ciment",       categorie: "materiaux", unite: "kg",     prixUnitaire: 0.35,  scenario: ["eco","standard","premium"] },
  { nom: "Fer à béton ouvrage",type: "fer_ouvrage",  categorie: "materiaux", unite: "kg",     prixUnitaire: 8,     scenario: ["eco","standard","premium"] },
  { nom: "Béton dosé C25/30",  type: "beton_dose",   categorie: "materiaux", unite: "m3",     prixUnitaire: 402,   scenario: ["eco","standard","premium"] },
  { nom: "Brique Creuse 10cm", type: "brique",       categorie: "materiaux", unite: "unite",  prixUnitaire: 0.55,  scenario: ["eco","standard","premium"] },
  { nom: "Fer rond Ø10",       type: "fer_rond_10",  categorie: "materiaux", unite: "barre",  prixUnitaire: 12,    scenario: ["eco","standard","premium"] },
  { nom: "Fer rond Ø6",        type: "fer_rond_6",   categorie: "materiaux", unite: "barre",  prixUnitaire: 11,    scenario: ["eco","standard","premium"] },
  { nom: "Tube PVC Ø125",      type: "tube_pvc_125", categorie: "materiaux", unite: "ml",     prixUnitaire: 12.5,  scenario: ["eco","standard","premium"] },
  { nom: "Tube PVC Ø75",       type: "tube_pvc_75",  categorie: "materiaux", unite: "ml",     prixUnitaire: 8.5,   scenario: ["eco","standard","premium"] },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connecté");

  let vendeur = await User.findOne({ role: "equipment_seller" });
  if (!vendeur) {
    vendeur = await User.create({
      name: "Fournisseur Test",
      email: "fournisseur@test.com",
      password: "password123",
      role: "equipment_seller",
    });
    console.log("✅ Vendeur créé");
  }

  await MaterialRule.deleteMany({});
  await MaterialRule.insertMany(regles);
  console.log(`✅ ${regles.length} MaterialRules insérées`);

  await Product.deleteMany({ categorie: "materiaux" });
  const produitsAvecVendeur = produits.map((p) => ({ ...p, vendeurId: vendeur._id }));
  await Product.insertMany(produitsAvecVendeur);
  console.log(`✅ ${produits.length} Produits materiaux insérés`);

  await mongoose.disconnect();
  console.log("🏁 Seed terminé");
}

seed().catch((e) => { console.error(e); process.exit(1); });
