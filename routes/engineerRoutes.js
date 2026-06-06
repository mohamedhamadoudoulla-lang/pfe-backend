const express = require("express");
const router = express.Router();
const Engineer = require("../models/Engineer");
const { protect } = require("../middleware/authMiddleware");

router.get("/", async (req, res) => {
  try {
    const engineers = await Engineer.find({ isVerified: true }).populate(
      "user", "name email phone avatar"
    );
    res.json(engineers);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const engineer = await Engineer.findById(req.params.id).populate(
      "user", "name email phone avatar"
    );
    if (!engineer) return res.status(404).json({ message: "Ingénieur non trouvé" });
    res.json(engineer);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const engineer = await Engineer.create({ ...req.body, user: req.user._id });
    res.status(201).json(engineer);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// PUT mettre à jour un ingénieur (pour upload CV etc)
router.put("/:id", protect, async (req, res) => {
  try {
    const engineer = await Engineer.findById(req.params.id);
    if (!engineer) return res.status(404).json({ message: "Ingénieur non trouvé" });
    if (engineer.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }
    const updated = await Engineer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("user", "name email phone avatar");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;