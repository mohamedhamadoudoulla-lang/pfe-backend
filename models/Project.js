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
  status:        { type: String, enum: ["ouvert","en_cours","terminé"], default: "ouvert" },
  user:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  applications:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);