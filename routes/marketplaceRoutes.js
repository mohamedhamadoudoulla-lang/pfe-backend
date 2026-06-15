const express = require("express");
const router = express.Router();
const Estimation = require("../models/Estimation");
const Product = require("../models/Product");
const { genererMateriauxGrosOeuvre, genererMarketplace } = require("../services/marketplaceService");

// GET /api/marketplace/gros-oeuvre?surface=150&scenario=standard — calcul des matériaux BTP
router.get("/gros-oeuvre", async (req, res) => {
  try {
    const surface = parseFloat(req.query.surface);
    const scenario = req.query.scenario || "standard";
    if (!surface || surface <= 0) {
      return res.status(400).json({ message: "Surface invalide" });
    }
    const resultat = await genererMateriauxGrosOeuvre(surface, scenario);
    res.json(resultat);
  } catch (err) {
    res.status(500).json({ message: "Erreur calcul matériaux", error: err.message });
  }
});

// POST /api/marketplace/gros-oeuvre/save — sauvegarder les matériaux dans une estimation
router.post("/gros-oeuvre/save", async (req, res) => {
  try {
    const { estimationId, materiaux, total } = req.body;
    if (!estimationId || !materiaux) {
      return res.status(400).json({ message: "estimationId et materiaux requis" });
    }
    const estimation = await Estimation.findByIdAndUpdate(
      estimationId,
      { materiauxConstruction: materiaux, totalMateriaux: total },
      { new: true }
    );
    if (!estimation) return res.status(404).json({ message: "Estimation introuvable" });
    res.json(estimation);
  } catch (err) {
    res.status(500).json({ message: "Erreur sauvegarde matériaux", error: err.message });
  }
});

// GET /api/marketplace/:devisId — récupérer les recommandations
router.get("/:devisId", async (req, res) => {
  try {
    const devis = await Estimation.findById(req.params.devisId);
    if (!devis) return res.status(404).json({ message: "Devis introuvable" });
    if (!devis.caracteristiques || !devis.caracteristiques.surface) {
      return res.status(400).json({ message: "Caractéristiques du projet manquantes" });
    }
    const marketplace = await genererMarketplace(devis.caracteristiques);
    res.json(marketplace);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// POST /api/marketplace/panier/:devisId — ajouter un produit au panier
router.post("/panier/:devisId", async (req, res) => {
  try {
    const { produitId, quantite } = req.body;
    const produit = await Product.findById(produitId);
    if (!produit) return res.status(404).json({ message: "Produit introuvable" });

    const devis = await Estimation.findById(req.params.devisId);
    if (!devis) return res.status(404).json({ message: "Devis introuvable" });

    devis.panierMarketplace.push({
      produitId,
      quantite,
      prixUnitaire: produit.prixUnitaire,
      prixTotal: produit.prixUnitaire * quantite,
    });

    // Recalculer le total général
    const coutEstimation = devis.totalCost || 0;
    const totalPanier = devis.panierMarketplace.reduce((s, i) => s + i.prixTotal, 0);
    devis.totalCost = coutEstimation + totalPanier;

    await devis.save();
    res.json(devis);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// DELETE /api/marketplace/panier/:devisId/:itemId — retirer un produit du panier
router.delete("/panier/:devisId/:itemId", async (req, res) => {
  try {
    const devis = await Estimation.findById(req.params.devisId);
    if (!devis) return res.status(404).json({ message: "Devis introuvable" });

    devis.panierMarketplace.pull({ _id: req.params.itemId });
    const coutEstimation = devis.totalCost || 0;
    const totalPanier = devis.panierMarketplace.reduce((s, i) => s + i.prixTotal, 0);
    devis.totalCost = coutEstimation + totalPanier;

    await devis.save();
    res.json(devis);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;
