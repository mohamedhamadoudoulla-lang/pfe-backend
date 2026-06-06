const mongoose = require("mongoose");

const furnitureSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["salon", "chambre", "cuisine", "salle_de_bain", "bureau", "autre"],
      required: true,
    },
    qualityLevel: {
      type: String,
      enum: ["économique", "standard", "haut de gamme"],
      default: "standard",
    },
    price:       { type: Number, required: true },
    description: { type: String },
    image:       { type: String },
    stock:       { type: Number, default: 1 },
    isActive:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Furniture", furnitureSchema);