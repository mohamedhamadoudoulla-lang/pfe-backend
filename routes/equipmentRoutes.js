const express = require("express");
const router = express.Router();
const Equipment = require("../models/Equipment");
const Estimation = require("../models/Estimation");
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
    const allowed = ["name", "category", "qualityLevel", "unit", "price", "description", "image", "shopName", "shopEmail", "shopAddress", "shopPhone"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) equipment[field] = req.body[field];
    });
    await equipment.save();
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// GET /api/equipment/vendor/orders — commandes contenant les produits du vendeur
router.get("/vendor/orders", protect, async (req, res) => {
  try {
    const vendorItems = await Equipment.find({ seller: req.user._id }).select("_id");
    const vendorItemIds = vendorItems.map((e) => e._id);
    if (vendorItemIds.length === 0) return res.json([]);
    const estimations = await Estimation.find({ selectedEquipmentIds: { $in: vendorItemIds } })
      .populate("user", "name email phone")
      .populate("selectedEquipmentIds", "name category price shopName seller")
      .sort({ createdAt: -1 });
    res.json(estimations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;