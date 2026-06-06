const mongoose = require("mongoose");

const regionPriceSchema = new mongoose.Schema(
  {
    region:      { type: String, required: true, unique: true },
    pricePerM2:  { type: Number, required: true },
    coeff:       { type: Number, default: 1.0 },
    updatedBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RegionPrice", regionPriceSchema);