const express              = require("express");
const router               = express.Router();
const RegionPrice          = require("../models/RegionPrice");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// GET tous les prix
router.get("/", async (req, res) => {
  try {
    const prices = await RegionPrice.find();
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// POST ou PUT créer/modifier un prix (admin)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { region, pricePerM2 } = req.body;
    const price = await RegionPrice.findOneAndUpdate(
      { region },
      { region, pricePerM2, updatedBy: req.user._id },
      { upsert: true, new: true }
    );
    res.status(201).json(price);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;