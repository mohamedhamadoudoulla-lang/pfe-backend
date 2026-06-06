const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    seller:      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name:        { type: String, required: true },
    category: {
      type: String,
      enum: [
        "carrelage", "peinture", "portes_interieures",
        "portes_exterieures", "fenetres", "cuisine",
        "sanitaires", "electricite", "eclairage",
        "plomberie", "faux_plafond", "climatisation",
        "revetements", "menuiserie",
      ],
      required: true,
    },
    qualityLevel: {
      type: String,
      enum: ["economique", "standard", "haut de gamme"],
      required: true,
    },
    unit:         { type: String, default: "lot" },
    price:        { type: Number, required: true },
    description: { type: String },
    image:        { type: String },
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Equipment", equipmentSchema);