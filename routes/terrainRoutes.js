const express = require("express");
const router = express.Router();
const Terrain = require("../models/Terrain");
const RegionPrice = require("../models/RegionPrice");
const { protect } = require("../middleware/authMiddleware");

router.get("/estimate", async (req, res) => {
  try {
    const { region, surface } = req.query;
    if (!region || !surface) {
      return res.status(400).json({ message: "Région et surface sont obligatoires" });
    }

    const s = parseFloat(surface);

    const regionPrice = await RegionPrice.findOne({
      region: new RegExp(`^${region}$`, "i"),
    });

    if (regionPrice) {
      const estimatedTotal = regionPrice.pricePerM2 * s;
      const terrains = await Terrain.find({
        region: new RegExp(region, "i"),
        isAvailable: true,
      }).limit(10);

      return res.json({
        region,
        surface: s,
        avgPricePerM2: regionPrice.pricePerM2,
        estimatedTotal: Math.round(estimatedTotal),
        terrains,
        source: "region_prices",
      });
    }

    const terrains = await Terrain.find({
      region: new RegExp(region, "i"),
      isAvailable: true,
    });

    if (terrains.length > 0) {
      const avgPricePerM2 =
        terrains.reduce((sum, t) => sum + t.pricePerM2, 0) / terrains.length;
      const estimatedTotal = avgPricePerM2 * s;
      return res.json({
        region,
        surface: s,
        avgPricePerM2: Math.round(avgPricePerM2),
        estimatedTotal: Math.round(estimatedTotal),
        terrains,
        source: "terrain_listings",
      });
    }

    res.status(404).json({
      message: "Aucun terrain ni prix par région trouvé pour: " + region,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.get("/regions", async (req, res) => {
  try {
    const prices = await RegionPrice.find().sort({ region: 1 });
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { region } = req.query;
    const filter = { isAvailable: true };
    if (region) filter.region = new RegExp(region, "i");
    const terrains = await Terrain.find(filter).populate("seller", "name phone");
    res.json(terrains);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const terrain = await Terrain.create({ ...req.body, seller: req.user._id });
    res.status(201).json(terrain);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.get("/vendor", protect, async (req, res) => {
  try {
    const terrains = await Terrain.find({ seller: req.user._id });
    res.json(terrains);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const terrain = await Terrain.findById(req.params.id);
    if (!terrain) return res.status(404).json({ message: "Terrain non trouvé" });
    if (terrain.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }
    await Terrain.findByIdAndDelete(req.params.id);
    res.json({ message: "Terrain supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;