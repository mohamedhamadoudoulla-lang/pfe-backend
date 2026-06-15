const mongoose = require("mongoose");

const materialRuleSchema = new mongoose.Schema({
  type: { type: String, required: true },
  nom: { type: String, required: true },
  scenario: { type: String, enum: ["eco", "standard", "premium"], required: true },
  ratioParM2: { type: Number, required: true },
  unite: { type: String, required: true },
  description: { type: String },
});

module.exports = mongoose.model("MaterialRule", materialRuleSchema);
