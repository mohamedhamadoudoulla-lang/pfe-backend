const express              = require("express");
const router               = express.Router();
const User                 = require("../models/User");
const Engineer             = require("../models/Engineer");
const Estimation           = require("../models/Estimation");
const Furniture            = require("../models/Furniture");
const Terrain              = require("../models/Terrain");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const [users, engineers, estimations, terrains, furniture] = await Promise.all([
      User.countDocuments(),
      Engineer.countDocuments(),
      Estimation.countDocuments(),
      Terrain.countDocuments(),    // ✅ virgule sans tiret
      Furniture.countDocuments(),
    ]);
    res.json({ users, engineers, estimations, terrains, furniture });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.put("/engineers/:id/verify", protect, adminOnly, async (req, res) => {
  try {
    const engineer = await Engineer.findByIdAndUpdate(
      req.params.id, { isVerified: true }, { new: true }
    );
    res.json(engineer);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.put("/furniture/:id/approve", protect, adminOnly, async (req, res) => {
  try {
    const furniture = await Furniture.findByIdAndUpdate(
      req.params.id, { isActive: true }, { new: true }
    );
    res.json(furniture);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.get("/engineers", protect, adminOnly, async (req, res) => {
  try {
    const engineers = await Engineer.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(engineers);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.post("/create-admin", protect, adminOnly, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email déjà utilisé" });
    const admin = await User.create({ name, email, password, role: "admin" });
    res.status(201).json({
      message: "Admin créé",
      user: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;