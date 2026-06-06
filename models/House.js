const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    surface: { type: Number, required: true },       // en m²
    floors: { type: Number, default: 1 },            // nombre d'étages
    rooms: { type: Number },                         // nombre de pièces
    style: { type: String },                         // moderne, traditionnel...
    finitionLevel: {
      type: String,
      enum: ["économique", "standard", "haut de gamme"],
      default: "standard",
    },
    estimatedPrice: { type: Number },                // prix estimé
    images: [{ type: String }],                      // URLs des images
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("House", houseSchema);