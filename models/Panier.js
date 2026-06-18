const mongoose = require("mongoose");

const PanierItemSchema = new mongoose.Schema({
  produit:      { type: mongoose.Schema.Types.ObjectId, refPath: "typeRef" },
  typeRef:      { type: String, enum: ["Terrain", "Equipement"] },
  quantite:     { type: Number, default: 1 },
  prixUnitaire: { type: Number },
  nomProduit:   { type: String },
  imageProduit: { type: String },
  vendeurNom:   { type: String, default: "" },
});

const PanierSchema = new mongoose.Schema({
  client:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items:   [PanierItemSchema],
  statut:  { type: String, enum: ["actif", "commande", "annule"], default: "actif" },
  total:   { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

PanierSchema.pre("save", function (next) {
  this.total = this.items.reduce((sum, item) => sum + item.prixUnitaire * item.quantite, 0);
  next();
});

module.exports = mongoose.model("Panier", PanierSchema);
