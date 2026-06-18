const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  ajouterAuPanier,
  getMonPanier,
  supprimerDuPanier,
  modifierQuantite,
  viderPanier,
  validerCommande,
  getCommandesVendeur,
} = require("../controllers/panierController");

router.post("/ajouter",    protect, ajouterAuPanier);
router.get("/moi",         protect, getMonPanier);
router.delete("/:itemId",  protect, supprimerDuPanier);
router.put("/:itemId",     protect, modifierQuantite);
router.delete("/",         protect, viderPanier);
router.post("/valider",    protect, validerCommande);
router.get("/vendeur/commandes", protect, getCommandesVendeur);

module.exports = router;
