// backend/models/Project.js
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title:         { type: String, required: true },
  description:   { type: String, default: "" },
  region:        { type: String, default: "" },
  budget:        { type: Number, default: 0 },
  surface:       { type: Number, default: 0 },
  floors:        { type: Number, default: 1 },
  finitionLevel: { type: String, default: "standard" },
  estimation:    { type: mongoose.Schema.Types.ObjectId, ref: "Estimation" },

  // Devis complet stocké directement dans le projet
  devis: {
    terrain: {
      region: String,
      surface: Number,
      pricePerM2: Number,
      totalTerrainCost: Number,
    },
    construction: {
      surface: Number,
      floors: Number,
      constructionType: String,
      finitionLevel: String,
      totalConstructionCost: Number,
    },
    furnishing: {
      rooms: [{
        roomType: String,
        qualityLevel: String,
        cost: Number,
      }],
      totalFurnishingCost: Number,
    },
    materiauxConstruction: [{
      type: String,
      nom: String,
      quantite: Number,
      unite: String,
      prixUnitaire: Number,
      sousTotal: Number,
    }],
    totalMateriaux: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
  },

  status:        { type: String, enum: ["ouvert","en_cours","terminé"], default: "ouvert" },
  user:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  applications:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);