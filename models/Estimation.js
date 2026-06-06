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