const express = require("express");
const router = express.Router();
const Equipment = require("../models/Equipment");
const { protect } = require("../middleware/authMiddleware");

router.get("/", async (req, res) => {
  try {
    const { category, qualityLevel } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (qualityLevel) filter.qualityLevel = qualityLevel;
    const equipments = await Equipment.find(filter).populate("seller", "name phone");
    res.json(equipments);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.get("/vendor", protect, async (req, res) => {
  try {
    const equipments = await Equipment.find({ seller: req.user._id });
    res.json(equipments);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const equipment = await Equipment.create({ ...req.body, seller: req.user._id });
    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) return res.status(404).json({ message: "Equipement non trouve" });
    if (equipment.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorise" });
    }
    await Equipment.findByIdAndDelete(req.params.id);
    res.json({ message: "Equipement supprime" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) return res.status(404).json({ message: "Equipement non trouve" });
    if (equipment.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorise" });
    }
    const allowed = ["name", "category", "qualityLevel", "unit", "price", "description", "image"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) equipment[field] = req.body[field];
    });
    await equipment.save();
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;