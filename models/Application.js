const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    project:  { type: mongoose.Schema.Types.ObjectId, ref: "Project",  required: true },
    engineer: { type: mongoose.Schema.Types.ObjectId, ref: "Engineer", required: true },
    message:  { type: String },
    price:    { type: Number },
    status: {
      type: String,
      enum: ["en_attente", "acceptée", "refusée"],
      default: "en_attente",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);