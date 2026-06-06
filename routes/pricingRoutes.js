const express = require("express");
const router = express.Router();
const RegionPrice = require("../models/RegionPrice");
const Furniture = require("../models/Furniture");
const Equipment = require("../models/Equipment");
const Package = require("../models/Package");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", async (req, res) => {
  try {
    const [regionPrices, furniture, equipment] = await Promise.all([
      RegionPrice.find().sort({ region: 1 }),
      Furniture.find({ isActive: true }).sort({ category: 1, qualityLevel: 1 }),
      Equipment.find({ isActive: true }).sort({ category: 1, qualityLevel: 1 }),
    ]);
    res.json({ regionPrices, furniture, equipment });
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

router.get("/package", async (req, res) => {
  try {
    let { finition, region } = req.query;
    if (!finition || !region) return res.status(400).json({ message: "finition and region required" });
    region = region.replace(/\+/g, " ");
    finition = finition.replace(/\+/g, " ");
    const regionDoc = await RegionPrice.findOne({ region: new RegExp(`^${region}$`, "i") });
    const coeff = regionDoc?.coeff || 1;
    const equipment = await Equipment.find({
      qualityLevel: finition,
      isActive: true,
    }).populate("seller", "name phone");
    const items = equipment.map((e) => ({
      _id: e._id,
      name: e.name,
      category: e.category,
      qualityLevel: e.qualityLevel,
      unit: e.unit,
      price: Math.round(e.price * coeff),
      originalPrice: e.price,
      coeff,
      description: e.description,
      image: e.image,
    }));
    const total = items.reduce((sum, item) => sum + item.price, 0);
    res.json({ items, total, coeff, region: regionDoc?.region });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.get("/packages", async (req, res) => {
  try {
    const packages = await Package.find().populate({
      path: "furnitureIds",
      match: { isActive: true },
    });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.post("/packages", protect, adminOnly, async (req, res) => {
  try {
    const { name, furnitureIds } = req.body;
    const pkg = await Package.findOneAndUpdate(
      { name },
      { name, furnitureIds },
      { upsert: true, new: true }
    );
    res.status(201).json(pkg);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.get("/furniture/:region", async (req, res) => {
  try {
    const { region } = req.params;
    const furniture = await Furniture.find({ isActive: true }).sort({ category: 1, qualityLevel: 1 });
    res.json(furniture);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.get("/equipment/:region", async (req, res) => {
  try {
    const equipment = await Equipment.find({ isActive: true }).sort({ category: 1, qualityLevel: 1 });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.put("/regions/:region", protect, adminOnly, async (req, res) => {
  try {
    const { region } = req.params;
    const { pricePerM2, coeff } = req.body;
    const price = await RegionPrice.findOneAndUpdate(
      { region: new RegExp(`^${region}$`, "i") },
      { pricePerM2, coeff, updatedBy: req.user._id },
      { upsert: true, new: true }
    );
    if (!price) return res.status(404).json({ message: "Region non trouvee" });
    res.json(price);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.post("/regions", protect, adminOnly, async (req, res) => {
  try {
    const { region, pricePerM2, coeff } = req.body;
    const price = await RegionPrice.findOneAndUpdate(
      { region },
      { region, pricePerM2, coeff, updatedBy: req.user._id },
      { upsert: true, new: true }
    );
    res.status(201).json(price);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.delete("/regions/:region", protect, adminOnly, async (req, res) => {
  try {
    const { region } = req.params;
    await RegionPrice.deleteOne({ region: new RegExp(`^${region}$`, "i") });
    res.json({ message: "Prix supprime" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;