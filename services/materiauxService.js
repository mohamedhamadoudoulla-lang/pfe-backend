const MaterialRule = require("../models/MaterialRule");
const Product = require("../models/Product");

async function calculerMateriauxConstruction(surface, scenario) {
  const surfaceNum = Number(surface);
  if (!surfaceNum || surfaceNum <= 0) {
    throw new Error(`Surface invalide reçue : "${surface}"`);
  }
  if (!["eco", "standard", "premium"].includes(scenario)) {
    throw new Error(`Scénario invalide reçu : "${scenario}"`);
  }

  const regles = await MaterialRule.find({ scenario });

  if (regles.length === 0) {
    return {
      surface: surfaceNum,
      scenario,
      lignes: [],
      totalMateriaux: 0,
      avertissement: `Aucune règle de calcul trouvée pour le scénario "${scenario}". Vérifie la collection MaterialRule.`,
    };
  }

  const lignes = [];
  let totalMateriaux = 0;

  for (const regle of regles) {
    const quantite = Math.round(surfaceNum * regle.ratioParM2 * 100) / 100;

    // D'abord chercher un produit correspondant au scenario exact
    let produit = await Product.findOne({
      type: regle.type,
      categorie: "materiaux",
      scenario: scenario,
    }).sort({ prixUnitaire: 1 });

    // Fallback: chercher un produit du meme type sans restriction de scenario
    if (!produit) {
      produit = await Product.findOne({
        type: regle.type,
        categorie: "materiaux",
      }).sort({ prixUnitaire: 1 });
    }

    if (!produit) {
      lignes.push({
        type: regle.type,
        nom: regle.nom,
        quantite,
        unite: regle.unite,
        prixUnitaire: null,
        sousTotal: null,
        disponible: false,
        message: `Aucun produit "${regle.type}" disponible pour le scénario "${scenario}".`,
      });
      continue;
    }

    const sousTotal = Math.round(quantite * produit.prixUnitaire * 100) / 100;
    totalMateriaux += sousTotal;

    lignes.push({
      type: regle.type,
      nom: regle.nom,
      quantite,
      unite: regle.unite,
      prixUnitaire: produit.prixUnitaire,
      sousTotal,
      disponible: true,
      produitId: produit._id,
      vendeurId: produit.vendeurId || null,
    });
  }

  return {
    surface: surfaceNum,
    scenario,
    lignes,
    totalMateriaux: Math.round(totalMateriaux * 100) / 100,
  };
}

module.exports = { calculerMateriauxConstruction };
