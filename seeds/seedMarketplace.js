const mongoose = require("mongoose");
const dotenv = require("dotenv");
const MaterialRule = require("../models/MaterialRule");
const FurnitureRule = require("../models/FurnitureRule");
const Product = require("../models/Product");
const User = require("../models/User");

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connecté");

  // ── 1. MaterialRules (gros œuvre BTP) ──
  await MaterialRule.deleteMany({});
  const materiaux = [
    // type                  scenario      ratioParM2   unite
    { type: "gravier",       scenario: "eco",      ratioParM2: 0.12, unite: "m3" },
    { type: "gravier",       scenario: "standard",  ratioParM2: 0.15, unite: "m3" },
    { type: "gravier",       scenario: "premium",   ratioParM2: 0.18, unite: "m3" },
    { type: "sable_epure",   scenario: "eco",      ratioParM2: 0.10, unite: "m3" },
    { type: "sable_epure",   scenario: "standard",  ratioParM2: 0.12, unite: "m3" },
    { type: "sable_epure",   scenario: "premium",   ratioParM2: 0.14, unite: "m3" },
    { type: "ciment",        scenario: "eco",      ratioParM2: 40,   unite: "kg" },
    { type: "ciment",        scenario: "standard",  ratioParM2: 50,   unite: "kg" },
    { type: "ciment",        scenario: "premium",   ratioParM2: 60,   unite: "kg" },
    { type: "fer_ouvrage",   scenario: "eco",      ratioParM2: 6,    unite: "kg" },
    { type: "fer_ouvrage",   scenario: "standard",  ratioParM2: 8,    unite: "kg" },
    { type: "fer_ouvrage",   scenario: "premium",   ratioParM2: 10,   unite: "kg" },
    { type: "beton_dose",    scenario: "eco",      ratioParM2: 0.20, unite: "m3" },
    { type: "beton_dose",    scenario: "standard",  ratioParM2: 0.25, unite: "m3" },
    { type: "beton_dose",    scenario: "premium",   ratioParM2: 0.30, unite: "m3" },
    { type: "brique",        scenario: "eco",      ratioParM2: 30,   unite: "unite" },
    { type: "brique",        scenario: "standard",  ratioParM2: 40,   unite: "unite" },
    { type: "brique",        scenario: "premium",   ratioParM2: 50,   unite: "unite" },
    { type: "fer_rond_10",   scenario: "eco",      ratioParM2: 0.2,  unite: "barre" },
    { type: "fer_rond_10",   scenario: "standard",  ratioParM2: 0.3,  unite: "barre" },
    { type: "fer_rond_10",   scenario: "premium",   ratioParM2: 0.4,  unite: "barre" },
    { type: "fer_rond_6",    scenario: "eco",      ratioParM2: 0.15, unite: "barre" },
    { type: "fer_rond_6",    scenario: "standard",  ratioParM2: 0.2,  unite: "barre" },
    { type: "fer_rond_6",    scenario: "premium",   ratioParM2: 0.25, unite: "barre" },
    { type: "tube_pvc_125",  scenario: "eco",      ratioParM2: 0.4,  unite: "ml" },
    { type: "tube_pvc_125",  scenario: "standard",  ratioParM2: 0.5,  unite: "ml" },
    { type: "tube_pvc_125",  scenario: "premium",   ratioParM2: 0.6,  unite: "ml" },
    { type: "tube_pvc_75",   scenario: "eco",      ratioParM2: 0.6,  unite: "ml" },
    { type: "tube_pvc_75",   scenario: "standard",  ratioParM2: 0.8,  unite: "ml" },
    { type: "tube_pvc_75",   scenario: "premium",   ratioParM2: 1.0,  unite: "ml" },
  ];
  await MaterialRule.insertMany(materiaux);
  console.log(`✅ ${materiaux.length} MaterialRules créées`);

  // ── 2. FurnitureRules (ameublement — inchangé) ──
  await FurnitureRule.deleteMany({});
  const meubles = [
    {
      piece: "chambre", scenario: "eco",
      items: [{ type: "lit_simple", quantite: 1 }, { type: "armoire", quantite: 1 }],
    },
    {
      piece: "chambre", scenario: "standard",
      items: [{ type: "lit_double", quantite: 1 }, { type: "armoire", quantite: 1 }, { type: "table_chevet", quantite: 2 }],
    },
    {
      piece: "chambre", scenario: "premium",
      items: [{ type: "lit_double", quantite: 1 }, { type: "armoire", quantite: 1 }, { type: "table_chevet", quantite: 2 }, { type: "commode", quantite: 1 }],
    },
    {
      piece: "salon", scenario: "eco",
      items: [{ type: "canape", quantite: 1 }, { type: "table_basse", quantite: 1 }],
    },
    {
      piece: "salon", scenario: "standard",
      items: [{ type: "canape", quantite: 1 }, { type: "table_basse", quantite: 1 }, { type: "meuble_tv", quantite: 1 }],
    },
    {
      piece: "salon", scenario: "premium",
      items: [{ type: "canape", quantite: 2 }, { type: "table_basse", quantite: 1 }, { type: "meuble_tv", quantite: 1 }, { type: "bibliotheque", quantite: 1 }],
    },
    {
      piece: "cuisine", scenario: "eco",
      items: [{ type: "table_cuisine", quantite: 1 }, { type: "chaise", quantite: 4 }],
    },
    {
      piece: "cuisine", scenario: "standard",
      items: [{ type: "table_cuisine", quantite: 1 }, { type: "chaise", quantite: 6 }, { type: "placard_cuisine", quantite: 1 }],
    },
    {
      piece: "cuisine", scenario: "premium",
      items: [{ type: "table_cuisine", quantite: 1 }, { type: "chaise", quantite: 6 }, { type: "placard_cuisine", quantite: 2 }, { type: "ilot", quantite: 1 }],
    },
    {
      piece: "salle_de_bain", scenario: "eco",
      items: [{ type: "lavabo", quantite: 1 }, { type: "wc", quantite: 1 }],
    },
    {
      piece: "salle_de_bain", scenario: "standard",
      items: [{ type: "lavabo", quantite: 1 }, { type: "wc", quantite: 1 }, { type: "douche", quantite: 1 }],
    },
    {
      piece: "salle_de_bain", scenario: "premium",
      items: [{ type: "lavabo", quantite: 2 }, { type: "wc", quantite: 1 }, { type: "douche", quantite: 1 }, { type: "baignoire", quantite: 1 }],
    },
  ];
  await FurnitureRule.insertMany(meubles);
  console.log(`✅ ${meubles.length} FurnitureRules créées`);

  // ── 3. Products ──
  await Product.deleteMany({});
  let vendeur = await User.findOne({ role: "equipment_seller" });
  if (!vendeur) {
    vendeur = await User.create({
      name: "Fournisseur Test",
      email: "fournisseur@test.com",
      password: "password123",
      role: "equipment_seller",
    });
  }

  const produits = [
    // ── Matériaux de construction (gros œuvre) ──
    { nom: "Gravier 15/25",            categorie: "materiaux", type: "gravier",     scenario: ["eco","standard","premium"], prixUnitaire: 46,    unite: "m3",     stock: 200 },
    { nom: "Sable épuré 0/4",          categorie: "materiaux", type: "sable_epure",  scenario: ["eco","standard","premium"], prixUnitaire: 34,    unite: "m3",     stock: 200 },
    { nom: "Ciment CPJ 45",            categorie: "materiaux", type: "ciment",       scenario: ["eco","standard","premium"], prixUnitaire: 0.35,  unite: "kg",     stock: 50000 },
    { nom: "Ciment CPJ 55 (haute résistance)", categorie: "materiaux", type: "ciment", scenario: ["premium"], prixUnitaire: 0.45, unite: "kg", stock: 30000 },
    { nom: "Fer à béton ouvrage",      categorie: "materiaux", type: "fer_ouvrage",  scenario: ["eco","standard","premium"], prixUnitaire: 1.2,   unite: "kg",     stock: 10000 },
    { nom: "Fer à béton Haute Adhérence", categorie: "materiaux", type: "fer_ouvrage", scenario: ["premium"], prixUnitaire: 1.5, unite: "kg", stock: 8000 },
    { nom: "Béton dosé C25/30",        categorie: "materiaux", type: "beton_dose",   scenario: ["eco","standard"],           prixUnitaire: 95,   unite: "m3",     stock: 100 },
    { nom: "Béton dosé C30/37",        categorie: "materiaux", type: "beton_dose",   scenario: ["premium"],                  prixUnitaire: 115,  unite: "m3",     stock: 80 },
    { nom: "Brique Creuse 10cm",       categorie: "materiaux", type: "brique",       scenario: ["eco","standard"],           prixUnitaire: 0.55, unite: "unite",   stock: 50000 },
    { nom: "Brique Monomur 20cm",      categorie: "materiaux", type: "brique",       scenario: ["premium"],                  prixUnitaire: 0.95, unite: "unite",   stock: 30000 },
    { nom: "Fer rond Ø10",             categorie: "materiaux", type: "fer_rond_10",  scenario: ["eco","standard","premium"], prixUnitaire: 8.5,   unite: "barre",  stock: 500 },
    { nom: "Fer rond Ø6",              categorie: "materiaux", type: "fer_rond_6",   scenario: ["eco","standard","premium"], prixUnitaire: 5.5,   unite: "barre",  stock: 500 },
    { nom: "Tube PVC Ø125",            categorie: "materiaux", type: "tube_pvc_125", scenario: ["eco","standard","premium"], prixUnitaire: 12.5,  unite: "ml",     stock: 1000 },
    { nom: "Tube PVC Ø75",             categorie: "materiaux", type: "tube_pvc_75",  scenario: ["eco","standard","premium"], prixUnitaire: 8.5,   unite: "ml",     stock: 1000 },
    // ── Ameublement (inchangé) ──
    { nom: "Lit Double 160x200",       categorie: "ameublement", type: "lit_double",  scenario: ["standard","premium"],       prixUnitaire: 450,  unite: "unite",   stock: 20 },
    { nom: "Lit Simple 90x190",        categorie: "ameublement", type: "lit_simple",  scenario: ["eco"],                      prixUnitaire: 180,  unite: "unite",   stock: 30 },
    { nom: "Armoire 3 portes",         categorie: "ameublement", type: "armoire",     scenario: ["eco","standard"],           prixUnitaire: 350,  unite: "unite",   stock: 15 },
    { nom: "Armoire Premium 4 portes", categorie: "ameublement", type: "armoire",     scenario: ["premium"],                  prixUnitaire: 650,  unite: "unite",   stock: 10 },
    { nom: "Table de Chevet",          categorie: "ameublement", type: "table_chevet", scenario: ["standard","premium"],       prixUnitaire: 120,  unite: "unite",   stock: 40 },
    { nom: "Commode 5 tiroirs",        categorie: "ameublement", type: "commode",     scenario: ["premium"],                  prixUnitaire: 380,  unite: "unite",   stock: 12 },
    { nom: "Canape 3 places",          categorie: "ameublement", type: "canape",      scenario: ["eco","standard"],           prixUnitaire: 600,  unite: "unite",   stock: 10 },
    { nom: "Canape Angle Premium",     categorie: "ameublement", type: "canape",      scenario: ["premium"],                  prixUnitaire: 1200, unite: "unite",   stock: 5 },
    { nom: "Table Basse Verre",        categorie: "ameublement", type: "table_basse", scenario: ["eco","standard","premium"], prixUnitaire: 200,  unite: "unite",   stock: 25 },
    { nom: "Meuble TV 180cm",          categorie: "ameublement", type: "meuble_tv",   scenario: ["standard","premium"],       prixUnitaire: 280,  unite: "unite",   stock: 15 },
    { nom: "Bibliotheque 4 etageres",  categorie: "ameublement", type: "bibliotheque", scenario: ["premium"],                 prixUnitaire: 320,  unite: "unite",   stock: 8 },
    { nom: "Table Cuisine 6 places",   categorie: "ameublement", type: "table_cuisine", scenario: ["eco","standard","premium"], prixUnitaire: 250, unite: "unite",   stock: 20 },
    { nom: "Chaise Cuisine",           categorie: "ameublement", type: "chaise",      scenario: ["eco","standard","premium"], prixUnitaire: 55,   unite: "unite",   stock: 100 },
    { nom: "Placard Cuisine Standard", categorie: "ameublement", type: "placard_cuisine", scenario: ["standard"],              prixUnitaire: 400,  unite: "unite",   stock: 10 },
    { nom: "Placard Cuisine Premium",  categorie: "ameublement", type: "placard_cuisine", scenario: ["premium"],               prixUnitaire: 700,  unite: "unite",   stock: 8 },
    { nom: "Ilot Cuisine avec rangement", categorie: "ameublement", type: "ilot",     scenario: ["premium"],                  prixUnitaire: 850,  unite: "unite",   stock: 5 },
    { nom: "Lavabo Vasque",            categorie: "ameublement", type: "lavabo",      scenario: ["eco","standard"],           prixUnitaire: 120,  unite: "unite",   stock: 30 },
    { nom: "Lavabo Double Vasque",     categorie: "ameublement", type: "lavabo",      scenario: ["premium"],                  prixUnitaire: 250,  unite: "unite",   stock: 15 },
    { nom: "WC Suspendu",              categorie: "ameublement", type: "wc",          scenario: ["eco","standard","premium"], prixUnitaire: 180,  unite: "unite",   stock: 25 },
    { nom: "Douche Italienne",         categorie: "ameublement", type: "douche",      scenario: ["standard","premium"],       prixUnitaire: 350,  unite: "unite",   stock: 10 },
    { nom: "Baignoire Balneo",         categorie: "ameublement", type: "baignoire",   scenario: ["premium"],                  prixUnitaire: 1200, unite: "unite",   stock: 5 },
  ];

  const produitsAvecVendeur = produits.map((p) => ({ ...p, vendeurId: vendeur._id }));
  await Product.insertMany(produitsAvecVendeur);
  console.log(`✅ ${produits.length} Produits créés`);

  await mongoose.disconnect();
  console.log("🏁 Seed terminé");
}

seed().catch((e) => { console.error(e); process.exit(1); });
