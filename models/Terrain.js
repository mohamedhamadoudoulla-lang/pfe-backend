const mongoose = require("mongoose");

const terrainSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    region: { type: String, required: true },
    city: { type: String },
    surface: { type: Number, required: true },
    pricePerM2: { type: Number, required: true },
    totalPrice: { type: Number },
    description: { type: String },
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ✅ Sans next — Mongoose 7+
terrainSchema.pre("save", async function () {
  this.totalPrice = this.surface * this.pricePerM2;
});

module.exports = mongoose.model("Terrain", terrainSchema);