const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { calculerMateriauxConstruction } = require("../services/materiauxService");
const Estimation = require("../models/Estimation");

// GET /api/materiaux-construction/:estimationId
router.get("/materiaux-construction/:estimationId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.estimationId)) {
      return res.status(400).json({ message: "estimationId invalide." });
    }

    const estimation = await Estimation.findById(req.params.estimationId);
    if (!estimation) {
      return res.status(404).json({ message: "Estimation introuvable." });
    }

    const surface = estimation.caracteristiques?.surface || estimation.construction?.surface;
    const scenario = estimation.caracteristiques?.scenario;

    if (!surface || !scenario) {
      return res.status(400).json({
        message: "Données manquantes sur l'estimation.",
        debug: { surface, scenario, caracteristiques: estimation.caracteristiques },
      });
    }

    const resultat = await calculerMateriauxConstruction(surface, scenario);
    res.json(resultat);
  } catch (err) {
    console.error("[materiaux GET]", err.message);
    res.status(500).json({ message: "Erreur serveur lors du calcul.", error: err.message });
  }
});

// POST /api/materiaux-construction/:estimationId/valider
router.post("/materiaux-construction/:estimationId/valider", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.estimationId)) {
      return res.status(400).json({ message: "estimationId invalide." });
    }

    const estimation = await Estimation.findById(req.params.estimationId);
    if (!estimation) {
      return res.status(404).json({ message: "Estimation introuvable." });
    }

    const { lignes, totalMateriaux } = req.body;
    estimation.materiauxConstruction = lignes || [];
    estimation.totalMateriaux = totalMateriaux || 0;
    await estimation.save();

    res.json(estimation);
  } catch (err) {
    console.error("[materiaux POST]", err.message);
    res.status(500).json({ message: "Erreur sauvegarde.", error: err.message });
  }
});

module.exports = router;
