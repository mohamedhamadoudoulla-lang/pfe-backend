const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

// GET /api/products/vendor — produits du vendeur connecté
router.get("/vendor", protect, async (req, res) => {
  try {
    const products = await Product.find({ vendeurId: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// GET /api/products — tous les produits (public)
router.get("/", async (req, res) => {
  try {
    const { categorie, scenario } = req.query;
    const filter = {};
    if (categorie) filter.categorie = categorie;
    if (scenario) filter.scenario = scenario;
    const products = await Product.find(filter).populate("vendeurId", "name email phone");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// POST /api/products — ajouter un produit
router.post("/", protect, async (req, res) => {
  try {
    const { nom, categorie, type, scenario, prixUnitaire, unite, stock, image, description, shopName, shopEmail, shopAddress, shopPhone } = req.body;
    if (!nom || !categorie || !type || prixUnitaire === undefined || !unite) {
      return res.status(400).json({ message: "Champs requis: nom, categorie, type, prixUnitaire, unite" });
    }
    if (prixUnitaire < 0) {
      return res.status(400).json({ message: "Le prix ne peut pas etre negatif" });
    }
    const product = await Product.create({
      vendeurId: req.user._id,
      nom,
      categorie,
      type,
      scenario: scenario || [],
      prixUnitaire,
      unite,
      stock: stock || 0,
      image: image || "",
      description: description || "",
      shopName: shopName || "",
      shopEmail: shopEmail || "",
      shopAddress: shopAddress || "",
      shopPhone: shopPhone || "",
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// PUT /api/products/:id — modifier un produit
router.put("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit non trouve" });
    if (product.vendeurId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorise" });
    }
    const allowed = ["nom", "categorie", "type", "scenario", "prixUnitaire", "unite", "stock", "image", "description", "shopName", "shopEmail", "shopAddress", "shopPhone"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });
    if (product.prixUnitaire < 0) {
      return res.status(400).json({ message: "Le prix ne peut pas etre negatif" });
    }
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// DELETE /api/products/:id — supprimer un produit
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit non trouve" });
    if (product.vendeurId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorise" });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Produit supprime" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;
