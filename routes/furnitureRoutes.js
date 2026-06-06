const express     = require("express");
const router      = express.Router();
const Furniture   = require("../models/Furniture");
const { protect } = require("../middleware/authMiddleware");

/// GET tous les meubles — public, sans filtre isActive strict
router.get("/", async (req, res) => {
  try {
    const { category, qualityLevel } = req.query;
    const filter = {};                        // ✅ supprime isActive: true
    if (category)     filter.category     = category;
    if (qualityLevel) filter.qualityLevel = qualityLevel;

    const furniture = await Furniture.find(filter)
      .populate("seller", "name phone")
      .sort({ createdAt: -1 });

    res.json(furniture);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// GET mes meubles (vendeur)
router.get("/mine", protect, async (req, res) => {
  try {
    const furniture = await Furniture.find({ seller: req.user._id });
    res.json(furniture);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// POST ajouter un meuble (vendeur)
router.post("/", protect, async (req, res) => {
  try {
    const furniture = await Furniture.create({ ...req.body, seller: req.user._id });
    res.status(201).json(furniture);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// PUT modifier un meuble
router.put("/:id", protect, async (req, res) => {
  try {
    const furniture = await Furniture.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(furniture);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// DELETE supprimer un meuble
router.delete("/:id", protect, async (req, res) => {
  try {
    await Furniture.findByIdAndDelete(req.params.id);
    res.json({ message: "Meuble supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;