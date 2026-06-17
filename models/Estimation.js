const mongoose = require("mongoose");

const estimationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Terrain
    terrain: {
      region: String,
      surface: Number,
      pricePerM2: Number,
      totalTerrainCost: Number,
    },

    // Construction
    construction: {
      surface: Number,
      floors: Number,
      constructionType: String,
      finitionLevel: String,
      totalConstructionCost: Number,
    },

    // Ameublement
    furnishing: {
      rooms: [
        {
          roomType: String,
          qualityLevel: String,
          cost: Number,
        },
      ],
      totalFurnishingCost: Number,
    },

    // Equipements selectionnes (par le client sur les pages finition)
    selectedEquipmentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Equipment" }],

    // Caractéristiques du projet (pour marketplace)
    caracteristiques: {
      surface: { type: Number },
      nbChambres: { type: Number },
      nbSallesDeBain: { type: Number, default: 1 },
      nbCuisines: { type: Number, default: 1 },
      nbSalons: { type: Number, default: 1 },
      scenario: { type: String, enum: ["eco", "standard", "premium"] },
    },

    // Matériaux de construction recommandés (gros œuvre)
    materiauxConstruction: [
      {
        type: String,
        nom: String,
        quantite: Number,
        unite: String,
        prixUnitaire: Number,
        sousTotal: Number,
        disponible: Boolean,
        message: String,
        produitId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        vendeurId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    totalMateriaux: { type: Number, default: 0 },

    // Panier marketplace (ameublement séparé)
    panierMarketplace: [
      {
        produitId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantite: Number,
        prixUnitaire: Number,
        prixTotal: Number,
      },
    ],

    // Total
    totalCost: { type: Number },

    // Statut du devis
    status: {
      type: String,
      enum: ["draft", "completed"],
      default: "draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Estimation", estimationSchema);