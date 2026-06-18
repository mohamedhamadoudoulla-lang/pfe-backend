const express              = require("express");
const router               = express.Router();
const User                 = require("../models/User");
const Engineer             = require("../models/Engineer");
const Estimation           = require("../models/Estimation");
const Furniture            = require("../models/Furniture");
const Terrain              = require("../models/Terrain");
const MaterialRule         = require("../models/MaterialRule");
const Product              = require("../models/Product");
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

// ── ESTIMATIONS ──────────────────────────────────
router.get("/estimations", protect, adminOnly, async (req, res) => {
  try {
    const estimations = await Estimation.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(estimations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.delete("/estimations/:id", protect, adminOnly, async (req, res) => {
  try {
    await Estimation.findByIdAndDelete(req.params.id);
    res.json({ message: "Estimation supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// ── MATERIAL RULES ───────────────────────────────
router.get("/material-rules", protect, adminOnly, async (req, res) => {
  try {
    const rules = await MaterialRule.find().sort({ scenario: 1, type: 1 });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.post("/material-rules", protect, adminOnly, async (req, res) => {
  try {
    const { type, nom, scenario, ratioParM2, unite } = req.body;
    if (!type || !nom || !scenario || ratioParM2 == null || !unite) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }
    const rule = await MaterialRule.create({ type, nom, scenario, ratioParM2, unite });
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.put("/material-rules/:id", protect, adminOnly, async (req, res) => {
  try {
    const rule = await MaterialRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rule) return res.status(404).json({ message: "Règle non trouvée" });
    res.json(rule);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.delete("/material-rules/:id", protect, adminOnly, async (req, res) => {
  try {
    await MaterialRule.findByIdAndDelete(req.params.id);
    res.json({ message: "Règle supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// ── PRODUCTS (materiaux) ─────────────────────────
router.get("/products", protect, adminOnly, async (req, res) => {
  try {
    const products = await Product.find({ categorie: "materiaux" })
      .populate("vendeurId", "name email")
      .sort({ type: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.delete("/products/:id", protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Produit supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;