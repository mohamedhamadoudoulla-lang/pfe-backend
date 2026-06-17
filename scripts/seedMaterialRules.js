const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const MaterialRuleSchema = new mongoose.Schema({
  type: { type: String, required: true },
  nom: { type: String, required: true },
  scenario: { type: String, enum: ["eco", "standard", "premium"], required: true },
  ratioParM2: { type: Number, required: true },
  unite: { type: String, required: true },
}, { strict: false });

const MaterialRule = mongoose.model("MaterialRule", MaterialRuleSchema);

const rules = [
  // ─── ECO ──
  { type: "ciment",       nom: "Ciment CPJ 45",        scenario: "eco",      ratioParM2: 0.35,  unite: "sac 50kg" },
  { type: "sable_epure",  nom: "Sable épuré 0/4",       scenario: "eco",      ratioParM2: 0.05,  unite: "m3" },
  { type: "gravier",      nom: "Gravier 15/25",          scenario: "eco",      ratioParM2: 0.04,  unite: "m3" },
  { type: "parpaing",     nom: "Parpaing 20x20x40",      scenario: "eco",      ratioParM2: 12.5,  unite: "unite" },
  { type: "fer_ouvrage",  nom: "Fer à béton ouvrage",    scenario: "eco",      ratioParM2: 8,     unite: "kg" },
  { type: "brique",       nom: "Brique rouge standard",  scenario: "eco",      ratioParM2: 55,    unite: "unite" },
  { type: "enduit",       nom: "Enduit façade",          scenario: "eco",      ratioParM2: 0.15,  unite: "sac 25kg" },

  // ─── STANDARD ──
  { type: "ciment",       nom: "Ciment CPJ 45",        scenario: "standard", ratioParM2: 0.45,  unite: "sac 50kg" },
  { type: "sable_epure",  nom: "Sable épuré 0/4",       scenario: "standard", ratioParM2: 0.06,  unite: "m3" },
  { type: "gravier",      nom: "Gravier 15/25",          scenario: "standard", ratioParM2: 0.05,  unite: "m3" },
  { type: "parpaing",     nom: "Parpaing 20x20x40",      scenario: "standard", ratioParM2: 13,    unite: "unite" },
  { type: "fer_ouvrage",  nom: "Fer à béton ouvrage",    scenario: "standard", ratioParM2: 10,    unite: "kg" },
  { type: "brique",       nom: "Brique rouge standard",  scenario: "standard", ratioParM2: 60,    unite: "unite" },
  { type: "enduit",       nom: "Enduit façade",          scenario: "standard", ratioParM2: 0.2,   unite: "sac 25kg" },
  { type: "carrelage",    nom: "Carrelage sol",          scenario: "standard", ratioParM2: 1.1,   unite: "m2" },

  // ─── PREMIUM ──
  { type: "ciment",       nom: "Ciment CPJ 45",        scenario: "premium",  ratioParM2: 0.5,   unite: "sac 50kg" },
  { type: "sable_epure",  nom: "Sable épuré 0/4",       scenario: "premium",  ratioParM2: 0.07,  unite: "m3" },
  { type: "gravier",      nom: "Gravier 15/25",          scenario: "premium",  ratioParM2: 0.06,  unite: "m3" },
  { type: "parpaing",     nom: "Parpaing 20x20x40",      scenario: "premium",  ratioParM2: 13.5,  unite: "unite" },
  { type: "fer_ouvrage",  nom: "Fer à béton ouvrage",    scenario: "premium",  ratioParM2: 12,    unite: "kg" },
  { type: "brique",       nom: "Brique rouge standard",  scenario: "premium",  ratioParM2: 65,    unite: "unite" },
  { type: "enduit",       nom: "Enduit façade",          scenario: "premium",  ratioParM2: 0.25,  unite: "sac 25kg" },
  { type: "carrelage",    nom: "Carrelage sol",          scenario: "premium",  ratioParM2: 1.2,   unite: "m2" },
  { type: "isolation",    nom: "Panneau isolation",      scenario: "premium",  ratioParM2: 1.05,  unite: "m2" },
];

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function seed() {
  if (!MONGO_URI) {
    console.error("❌ MONGO_URI non défini. Vérifie ton .env");
    process.exit(1);
  }
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connecté à MongoDB:", mongoose.connection.name);

  const before = await MaterialRule.countDocuments();
  console.log(`📊 Avant: ${before} règles`);

  await MaterialRule.deleteMany({});
  console.log("🗑️  Anciennes règles supprimées");

  await MaterialRule.insertMany(rules);
  console.log(`✅ ${rules.length} règles insérées`);

  const after = await MaterialRule.countDocuments();
  console.log(`📊 Après: ${after} règles`);

  const byScenario = await MaterialRule.aggregate([
    { $group: { _id: "$scenario", count: { $sum: 1 } } },
  ]);
  byScenario.forEach((s) => console.log(`   ${s._id}: ${s.count} règles`));

  await mongoose.disconnect();
  console.log("👋 Déconnecté");
}

seed().catch((err) => {
  console.error("❌ Erreur seed:", err);
  process.exit(1);
});
