const express = require("express");
const router = express.Router();
const Estimation = require("../models/Estimation");
const { protect } = require("../middleware/authMiddleware");

const CONSTRUCTION_COSTS = {
  "économique": 600,
  "standard": 900,
  "haut de gamme": 1400,
};

router.get("/", protect, async (req, res) => {
  try {
    const estimations = await Estimation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(estimations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.post("/calculate", protect, async (req, res) => {
  try {
    const { terrain, construction, furnishing } = req.body;
    const totalTerrainCost = terrain.surface * terrain.pricePerM2;
    const costPerM2 = CONSTRUCTION_COSTS[construction.finitionLevel] || 900;
    const totalConstructionCost = construction.surface * costPerM2 * construction.floors;
    let totalFurnishingCost = 0;
    const rooms = furnishing.rooms.map((room) => {
      totalFurnishingCost += room.cost;
      return room;
    });
    const totalCost = totalTerrainCost + totalConstructionCost + totalFurnishingCost;
    const estimation = await Estimation.create({
      user: req.user._id,
      terrain: { ...terrain, totalTerrainCost },
      construction: { ...construction, totalConstructionCost },
      furnishing: { rooms, totalFurnishingCost },
      totalCost,
      status: "completed",
    });
    res.status(201).json(estimation);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// POST /api/estimations/init-marketplace — créer un devis avec caractéristiques pour la marketplace
router.post("/init-marketplace", protect, async (req, res) => {
  try {
    const { caracteristiques } = req.body;
    if (!caracteristiques || !caracteristiques.surface) {
      return res.status(400).json({ message: "Caractéristiques du projet requises (surface minimum)" });
    }
    const estimation = await Estimation.create({
      user: req.user._id,
      caracteristiques,
      status: "draft",
    });
    res.status(201).json(estimation);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const estimation = await Estimation.findById(req.params.id).populate("user", "name email");
    if (!estimation) return res.status(404).json({ message: "Estimation non trouvée" });
    res.json(estimation);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;