const express     = require("express");
const router      = express.Router();
const Project     = require("../models/Project");
const { protect } = require("../middleware/authMiddleware");

// ── GET tous les projets ouverts (pour ingénieurs) ──────
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find({ status: "ouvert" })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// ── GET mes projets (client) ─────────────────────────────
router.get("/mine", protect, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id })
      .populate({
        path: "applications",
        populate: {
          path: "engineer",
          populate: { path: "user", select: "name email phone" },
        },
      })
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// ── GET un projet par ID ─────────────────────────────────
router.get("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("user", "name email")
      .populate({
        path: "applications",
        populate: {
          path: "engineer",
          populate: { path: "user", select: "name email" },
        },
      });
    if (!project) return res.status(404).json({ message: "Projet non trouvé" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// ── POST créer un projet ─────────────────────────────────
router.post("/", protect, async (req, res) => {
  try {
    const {
      title, description, region,
      budget, surface, floors, finitionLevel,
    } = req.body;

    // ✅ Validation minimale
    if (!title) {
      return res.status(400).json({ message: "Le titre est obligatoire" });
    }

    const project = await Project.create({
      title:         title         || "Mon projet",
      description:   description   || "",
      region:        region        || "",
      budget:        Number(budget)  || 0,
      surface:       Number(surface) || 0,
      floors:        Number(floors)  || 1,
      finitionLevel: finitionLevel || "standard",
      user:          req.user._id,
      status:        "ouvert",
      applications:  [],
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("❌ Erreur création projet :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// ── PUT mettre à jour le statut ──────────────────────────
router.put("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;