const express     = require("express");
const router      = express.Router();
const Project     = require("../models/Project");
const Estimation  = require("../models/Estimation");
const { protect } = require("../middleware/authMiddleware");

// ── GET tous les projets ouverts (pour ingénieurs) ──────
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find({ status: "ouvert" })
      .populate("user", "name email phone")
      .populate("estimation")
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
      .populate("estimation")
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
      .populate("estimation")
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
      estimationId,
      terrain, terrainInput, construction, furnishing,
      materiauxConstruction, totalMateriaux, totalCost,
    } = req.body;

    // ✅ Validation minimale
    if (!title) {
      return res.status(400).json({ message: "Le titre est obligatoire" });
    }

    let linkedEstimationId = estimationId || undefined;

    const terrainData = terrain || {};
    const terrainInputData = terrainInput || {};
    const constructionData = construction || {};
    const furnishingData = furnishing || {};

    const totalTerrainCost = terrainData.estimatedTotal
      || (terrainInputData.surface && terrainData.avgPricePerM2
        ? terrainInputData.surface * terrainData.avgPricePerM2
        : 0);

    const totalConstructionCost = constructionData.totalConstructionCost || 0;

    let totalFurnishingCost = furnishingData.totalFurnishingCost || 0;
    const rooms = (furnishingData.rooms || []).map((room) => {
      totalFurnishingCost += room.cost || 0;
      return room;
    });

    const computedTotalCost = totalCost || (totalTerrainCost + totalConstructionCost + totalFurnishingCost + (totalMateriaux || 0));

    const estimationPayload = {
      user: req.user._id,
      terrain: {
        region: terrainInputData.region || terrainData.region || "",
        surface: terrainInputData.surface || terrainData.surface || 0,
        pricePerM2: terrainData.avgPricePerM2 || terrainData.pricePerM2 || 0,
        totalTerrainCost,
      },
      construction: {
        surface: constructionData.surface || 0,
        floors: constructionData.floors || 1,
        constructionType: constructionData.constructionType || "",
        finitionLevel: constructionData.finitionLevel || "standard",
        totalConstructionCost,
      },
      furnishing: {
        rooms,
        totalFurnishingCost,
      },
      materiauxConstruction: materiauxConstruction || [],
      totalMateriaux: totalMateriaux || 0,
      totalCost: computedTotalCost,
      status: "completed",
    };

    // Si estimationId existe déjà, la mettre à jour. Sinon en créer une nouvelle
    if (linkedEstimationId) {
      try {
        await Estimation.findByIdAndUpdate(linkedEstimationId, estimationPayload);
      } catch (e) {
        console.error("⚠️ Erreur update estimation:", e.message);
      }
    } else if (construction) {
      try {
        const estimation = await Estimation.create(estimationPayload);
        linkedEstimationId = estimation._id;
      } catch (e) {
        console.error("⚠️ Erreur création estimation:", e.message);
      }
    }

    const project = await Project.create({
      title:         title         || "Mon projet",
      description:   description   || "",
      region:        region || (terrainInput && terrainInput.region) || "",
      budget:        Number(budget) || (totalCost) || 0,
      surface:       Number(surface) || (construction && construction.surface) || 0,
      floors:        Number(floors)  || (construction && construction.floors) || 1,
      finitionLevel: finitionLevel || (construction && construction.finitionLevel) || "standard",
      estimation:    linkedEstimationId,
      user:          req.user._id,
      status:        "ouvert",
      applications:  [],
      devis: {
        terrain: estimationPayload.terrain,
        construction: estimationPayload.construction,
        furnishing: estimationPayload.furnishing,
        materiauxConstruction: estimationPayload.materiauxConstruction,
        totalMateriaux: estimationPayload.totalMateriaux,
        totalCost: estimationPayload.totalCost,
      },
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

// ── POST migrer les devis des anciens projets ─────────────
router.post("/migrate-devis", protect, async (req, res) => {
  try {
    const projects = await Project.find({}).populate("estimation");
    let updated = 0;
    for (const p of projects) {
      if (p.devis && p.devis.totalCost > 0) continue;
      if (!p.estimation) continue;
      const e = p.estimation;
      p.devis = {
        terrain: e.terrain || {},
        construction: e.construction || {},
        furnishing: e.furnishing || { rooms: [], totalFurnishingCost: 0 },
        materiauxConstruction: e.materiauxConstruction || [],
        totalMateriaux: e.totalMateriaux || 0,
        totalCost: e.totalCost || 0,
      };
      await p.save();
      updated++;
    }
    res.json({ message: updated + " projets mis a jour" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;