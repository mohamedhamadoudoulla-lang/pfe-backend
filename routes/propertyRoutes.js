const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { protect } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  try {
    const { type, prixMin, prixMax, surfaceMin, surfaceMax, ville, statut, page = 1, limit = 9 } = req.query;

    const filtre = {};
    if (type) filtre.type = type;
    if (statut) filtre.statut = statut;
    if (ville) filtre.ville = { $regex: ville, $options: 'i' };
    if (prixMin || prixMax) {
      filtre.prix = {};
      if (prixMin) filtre.prix.$gte = Number(prixMin);
      if (prixMax) filtre.prix.$lte = Number(prixMax);
    }
    if (surfaceMin || surfaceMax) {
      filtre.surface = {};
      if (surfaceMin) filtre.surface.$gte = Number(surfaceMin);
      if (surfaceMax) filtre.surface.$lte = Number(surfaceMax);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [properties, total] = await Promise.all([
      Property.find(filtre).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Property.countDocuments(filtre)
    ]);

    res.json({
      properties,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error) {
    console.error('[properties GET]', error.message);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('vendeurId', 'name email phone');
    if (!property) return res.status(404).json({ message: 'Bien introuvable' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const property = await Property.create({ ...req.body, vendeurId: req.user._id });
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Bien introuvable' });
    if (property.vendeurId?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorise' });
    }
    const allowed = ['titre', 'type', 'prix', 'surface', 'chambres', 'sallesDeBain', 'ville', 'pays', 'statut', 'images', 'description'];
    allowed.forEach((f) => { if (req.body[f] !== undefined) property[f] = req.body[f]; });
    await property.save();
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Bien introuvable' });
    if (property.vendeurId?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorise' });
    }
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bien supprime' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
