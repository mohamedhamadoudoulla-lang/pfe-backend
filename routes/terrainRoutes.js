const express = require("express");
const router = express.Router();
const Terrain = require("../models/Terrain");
const RegionPrice = require("../models/RegionPrice");
const { protect } = require("../middleware/authMiddleware");
const { uploadPlan } = require("../middleware/upload");

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

router.post("/", protect, uploadPlan.single("plan"), async (req, res) => {
  try {
    const body = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;
    const payload = { ...body, seller: req.user._id };
    if (req.file) payload.plan = `/uploads/plans/${req.file.filename}`;
    if (body.lat && body.lng) {
      payload.location = {
        type: "Point",
        coordinates: [parseFloat(body.lng), parseFloat(body.lat)],
      };
    }
    const terrain = await Terrain.create(payload);
    res.status(201).json(terrain);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// POST /in-zone — terrains dans un polygone GeoJSON
router.post("/in-zone", async (req, res) => {
  try {
    const { polygon } = req.body;
    if (!polygon || !polygon.coordinates || polygon.coordinates.length === 0) {
      return res.status(400).json({ message: "Polygone invalide" });
    }
    const coords = polygon.coordinates[0];
    const first = coords[0];
    const last = coords[coords.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      return res.status(400).json({ message: "Le polygone doit être fermé" });
    }
    const terrains = await Terrain.find({
      location: {
        $geoWithin: {
          $geometry: {
            type: "Polygon",
            coordinates: polygon.coordinates,
          },
        },
      },
    }).populate("seller", "name phone");
    res.json(terrains);
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