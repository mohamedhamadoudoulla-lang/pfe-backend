const express = require("express");
const router = express.Router();
const House = require("../models/House");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", async (req, res) => {
  try {
    const houses = await House.find({ isActive: true });
    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) return res.status(404).json({ message: "Maison non trouvée" });
    res.json(house);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const house = await House.create(req.body);
    res.status(201).json(house);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await House.findByIdAndDelete(req.params.id);
    res.json({ message: "Maison supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;