const express      = require("express");
const router       = express.Router();
const Application  = require("../models/Application");
const Project      = require("../models/Project");
const Engineer     = require("../models/Engineer");
const { protect }  = require("../middleware/authMiddleware");

// POST — Postuler
router.post("/", protect, async (req, res) => {
  try {
    const { projectId, message, price } = req.body;
    let engineer = await Engineer.findOne({ user: req.user._id });
    if (!engineer) engineer = await Engineer.create({ user: req.user._id });

    const application = await Application.create({
      project:  projectId,
      engineer: engineer._id,
      message,
      price,
      status:   "en_attente",
    });
    await Project.findByIdAndUpdate(projectId, {
      $push: { applications: application._id },
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// PUT — Accepter ou refuser
router.put("/:id", protect, async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// GET — Mes candidatures (ingénieur)
router.get("/mine", protect, async (req, res) => {
  try {
    const engineer = await Engineer.findOne({ user: req.user._id });
    if (!engineer) return res.json([]);
    const applications = await Application.find({ engineer: engineer._id })
      .populate({
        path: "project",
        populate: { path: "user", select: "name email phone" },
      })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// GET — Tous les projets ouverts (pour ingénieurs) via applications
router.get("/available", protect, async (req, res) => {
  try {
    const engineer = await Engineer.findOne({ user: req.user._id });
    const myAppProjectIds = engineer
      ? (await Application.find({ engineer: engineer._id })).map((a) => a.project.toString())
      : [];
    const projects = await Project.find({ status: "ouvert" })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });
    const withStatus = projects.map((p) => ({
      ...p.toObject(),
      hasApplied: myAppProjectIds.includes(p._id.toString()),
    }));
    res.json(withStatus);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;