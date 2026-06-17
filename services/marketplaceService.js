const MaterialRule = require("../models/MaterialRule");
const FurnitureRule = require("../models/FurnitureRule");
const Product = require("../models/Product");

// ── Gros œuvre : calcul + matching des matériaux BTP ──
async function genererMateriauxGrosOeuvre(surface, scenario) {
  const regles = await MaterialRule.find({ scenario });
  const besoins = regles.map((r) => ({
    type: r.type,
    quantite: surface * r.ratioParM2,
    unite: r.unite,
  }));
  const resultats = [];
  for (const besoin of besoins) {
    const produits = await Product.find({
      type: besoin.type,
      scenario,
      stock: { $gt: 0 },
    }).sort({ prixUnitaire: 1 });
    const meilleur = produits[0] || null;
    resultats.push({
      type: besoin.type,
      quantite: Math.round(besoin.quantite * 100) / 100,
      unite: besoin.unite,
      prixUnitaire: meilleur ? meilleur.prixUnitaire : 0,
      sousTotal: meilleur ? Math.round(besoin.quantite * meilleur.prixUnitaire * 100) / 100 : 0,
      produit: meilleur,
      alternatives: produits.slice(1, 4),
    });
  }
  const total = resultats.reduce((s, r) => s + r.sousTotal, 0);
  return { materiaux: resultats, total };
}

// ── Marketplace complet (materiaux auto + ameublement) ──
async function calculerBesoinsMateriaux(caracteristiques) {
  const { surface, scenario } = caracteristiques;
  const regles = await MaterialRule.find({ scenario });
  return regles.map((r) => ({
    type: r.type,
    quantite: surface * r.ratioParM2,
    unite: r.unite,
  }));
}

async function calculerBesoinsAmeublement(caracteristiques) {
  const { nbChambres, nbSallesDeBain, nbCuisines, nbSalons, scenario } = caracteristiques;
  const piecesCount = {
    chambre: nbChambres,
    salle_de_bain: nbSallesDeBain,
    cuisine: nbCuisines,
    salon: nbSalons,
  };
  const regles = await FurnitureRule.find({ scenario });
  const besoinsMap = {};
  regles.forEach((regle) => {
    const nbPieces = piecesCount[regle.piece] || 0;
    if (nbPieces === 0) return;
    regle.items.forEach((item) => {
      besoinsMap[item.type] = (besoinsMap[item.type] || 0) + item.quantite * nbPieces;
    });
  });
  return Object.entries(besoinsMap).map(([type, quantite]) => ({ type, quantite }));
}

async function matcherProduits(besoins, scenario) {
  const resultats = [];
  for (const besoin of besoins) {
    const produits = await Product.find({
      type: besoin.type,
      scenario,
      stock: { $gt: 0 },
    }).sort({ prixUnitaire: 1 });
    if (produits.length === 0) {
      resultats.push({
        besoin: besoin.type,
        quantiteRequise: besoin.quantite,
        unite: besoin.unite,
        produitRecommande: null,
        prixTotal: 0,
        autresOptions: [],
      });
      continue;
    }
    resultats.push({
      besoin: besoin.type,
      quantiteRequise: besoin.quantite,
      unite: besoin.unite,
      produitRecommande: produits[0],
      prixTotal: produits[0].prixUnitaire * besoin.quantite,
      autresOptions: produits.slice(1, 4),
    });
  }
  return resultats;
}

async function genererMarketplace(caracteristiques) {
  const { scenario } = caracteristiques;
  const besoinsMateriaux = await calculerBesoinsMateriaux(caracteristiques);
  const besoinsAmeublement = await calculerBesoinsAmeublement(caracteristiques);
  const recommandationsMateriaux = await matcherProduits(besoinsMateriaux, scenario);
  const recommandationsAmeublement = await matcherProduits(besoinsAmeublement, scenario);
  const totalMateriaux = recommandationsMateriaux.reduce((s, r) => s + r.prixTotal, 0);
  const totalAmeublement = recommandationsAmeublement.reduce((s, r) => s + r.prixTotal, 0);
  return {
    materiaux: recommandationsMateriaux,
    ameublement: recommandationsAmeublement,
    totalMateriaux,
    totalAmeublement,
    totalGeneral: totalMateriaux + totalAmeublement,
  };
}

module.exports = { genererMateriauxGrosOeuvre, genererMarketplace, calculerBesoinsMateriaux, calculerBesoinsAmeublement, matcherProduits };
