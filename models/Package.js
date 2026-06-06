const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["economique", "standard", "haut de gamme"],
      unique: true,
    },
    furnitureIds:   [{ type: mongoose.Schema.Types.ObjectId, ref: "Furniture" }],
    equipmentIds:   [{ type: mongoose.Schema.Types.ObjectId, ref: "Equipment" }],
    constructionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "ConstructionMaterial" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema);