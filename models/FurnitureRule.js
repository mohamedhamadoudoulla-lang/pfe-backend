const mongoose = require("mongoose");

const furnitureRuleSchema = new mongoose.Schema({
  piece: { type: String, required: true },
  scenario: { type: String, enum: ["eco", "standard", "premium"], required: true },
  items: [
    {
      type: { type: String, required: true },
      quantite: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("FurnitureRule", furnitureRuleSchema);
