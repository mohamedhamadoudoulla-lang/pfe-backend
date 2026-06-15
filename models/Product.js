const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    vendeurId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    nom: { type: String, required: true },
    categorie: { type: String, enum: ["materiaux", "ameublement"], required: true },
    type: { type: String, required: true },
    scenario: [{ type: String, enum: ["eco", "standard", "premium"] }],
    prixUnitaire: { type: Number, required: true },
    unite: { type: String, required: true },
    stock: { type: Number, default: 0 },
    image: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
