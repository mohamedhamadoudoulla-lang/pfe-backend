const MaterialRule = require("../models/MaterialRule");
const Product = require("../models/Product");

function normaliserScenario(scenario) {
  if (!scenario) return "standard";
  return scenario.toString().toLowerCase().trim();
}

async function calculerMateriauxConstruction(surface, scenario) {
  const surfaceNum = Number(surface);
  if (!surfaceNum || surfaceNum <= 0) {
    throw new Error(`Surface invalide: "${surface}"`);
  }

  const scenarioNormalise = normaliserScenario(scenario);

  if (!["eco", "standard", "premium"].includes(scenarioNormalise)) {
    throw new Error(`Scénario invalide: "${scenario}"`);
  }

  let regles = await MaterialRule.find({ scenario: scenarioNormalise });

  let avertissement = null;

  if (!regles || regles.length === 0) {
    console.warn(
      `[materiaux] Aucune règle pour "${scenarioNormalise}", fallback sur "standard"`
    );
    regles = await MaterialRule.find({ scenario: "standard" });
    avertissement = `Aucune règle pour le scénario "${scenarioNormalise}". Résultats basés sur le scénario "standard".`;
  }

  if (!regles || regles.length === 0) {
    throw new Error(
      "Base de données non initialisée. Lance: node scripts/seedMaterialRules.js"
    );
  }

  const lignes = [];
  let totalMateriaux = 0;

  for (const regle of regles) {
    const quantite = Math.ceil(surfaceNum * regle.ratioParM2);

    let produit = await Product.findOne({
      type: regle.type,
      categorie: "materiaux",
    }).sort({ prixUnitaire: 1 });

    if (!produit) {
      const nomRegex = new RegExp(regle.nom || regle.type, "i");
      produit = await Product.findOne({
        nom: { $regex: nomRegex },
        categorie: "materiaux",
      }).sort({ prixUnitaire: 1 });
    }

    const prixUnitaire = produit?.prixUnitaire ?? 0;
    const sousTotal = Math.round(quantite * prixUnitaire * 100) / 100;
    totalMateriaux += sousTotal;

    lignes.push({
      type: regle.type,
      nom: regle.nom || regle.type,
      quantite,
      unite: regle.unite,
      prixUnitaire,
      sousTotal,
      disponible: !!produit,
      produitId: produit?._id || null,
      vendeurId: produit?.vendeurId || null,
      message: produit
        ? null
        : `Aucun produit "${regle.type}" trouvé.`,
    });
  }

  return {
    surface: surfaceNum,
    scenario: scenarioNormalise,
    lignes,
    totalMateriaux: Math.round(totalMateriaux * 100) / 100,
    avertissement,
  };
}

module.exports = { calculerMateriauxConstruction };
