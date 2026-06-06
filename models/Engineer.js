const mongoose = require("mongoose");

const engineerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    speciality: { type: String },
    experience: { type: Number },
    region: { type: String },
    pricePerM2: { type: Number },
    rating: { type: Number, default: 0 },
    portfolio: [{ type: String }],
    description: { type: String },
    isVerified: { type: Boolean, default: false },
    cv: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Engineer", engineerSchema);