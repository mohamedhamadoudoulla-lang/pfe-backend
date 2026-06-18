const Panier = require("../models/Panier");

exports.ajouterAuPanier = async (req, res) => {
  try {
    const { produitId, typeRef, quantite, prixUnitaire, nomProduit, imageProduit, vendeurNom } = req.body;
    const clientId = req.user._id;

    let panier = await Panier.findOne({ client: clientId, statut: "actif" });
    if (!panier) panier = new Panier({ client: clientId, items: [] });

    const existant = panier.items.find(
      (i) => i.produit.toString() === produitId && i.typeRef === typeRef
    );
    if (existant) {
      existant.quantite += quantite || 1;
    } else {
      panier.items.push({
        produit: produitId,
        typeRef,
        quantite: quantite || 1,
        prixUnitaire,
        nomProduit,
        imageProduit,
        vendeurNom: vendeurNom || "",
      });
    }

    await panier.save();
    res.json({ success: true, panier, message: "Ajoute au panier" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMonPanier = async (req, res) => {
  try {
    const panier = await Panier.findOne({ client: req.user._id, statut: "actif" });
    res.json(panier || { items: [], total: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.supprimerDuPanier = async (req, res) => {
  try {
    const panier = await Panier.findOne({ client: req.user._id, statut: "actif" });
    if (!panier) return res.status(404).json({ message: "Panier vide" });

    panier.items = panier.items.filter((i) => i._id.toString() !== req.params.itemId);
    await panier.save();
    res.json({ success: true, panier });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.modifierQuantite = async (req, res) => {
  try {
    const { quantite } = req.body;
    const panier = await Panier.findOne({ client: req.user._id, statut: "actif" });
    if (!panier) return res.status(404).json({ message: "Panier vide" });

    const item = panier.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Article non trouve" });

    if (quantite <= 0) {
      panier.items = panier.items.filter((i) => i._id.toString() !== req.params.itemId);
    } else {
      item.quantite = quantite;
    }

    await panier.save();
    res.json({ success: true, panier });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.viderPanier = async (req, res) => {
  try {
    await Panier.findOneAndUpdate(
      { client: req.user._id, statut: "actif" },
      { items: [], total: 0 }
    );
    res.json({ success: true, message: "Panier vide" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.validerCommande = async (req, res) => {
  try {
    const panier = await Panier.findOne({ client: req.user._id, statut: "actif" });
    if (!panier || panier.items.length === 0) {
      return res.status(400).json({ message: "Panier vide" });
    }
    panier.statut = "commande";
    await panier.save();
    res.json({ success: true, message: "Commande validee ! Paiement en especes au presentiel.", panier });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCommandesVendeur = async (req, res) => {
  try {
    const paniers = await Panier.find({ statut: "commande" })
      .populate("client", "name email phone")
      .lean();

    const commandes = paniers.filter((p) =>
      p.items.some((i) => i.vendeurNom && i.vendeurNom !== "")
    );
    res.json({ success: true, commandes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
