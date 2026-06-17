const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  titre: { type: String, required: true },
  type: { type: String, enum: ['maison', 'appartement', 'terrain'], required: true },
  prix: { type: Number, required: true },
  surface: { type: Number, required: true },
  chambres: { type: Number },
  sallesDeBain: { type: Number },
  ville: { type: String, required: true },
  pays: { type: String, default: 'Tunisie' },
  statut: { type: String, enum: ['disponible', 'nouveau', 'vendu'], default: 'disponible' },
  images: [{ type: String }],
  vendeurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);
