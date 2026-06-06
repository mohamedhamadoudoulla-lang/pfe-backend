const mongoose = require("mongoose");
require("dotenv").config();
const Equipment = require("./models/Equipment");
const ConstructionMaterial = require("./models/ConstructionMaterial");
const Package = require("./models/Package");
const RegionPrice = require("./models/RegionPrice");

const IMG = {
  carrelage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  peinture: "https://images.unsplash.com/photo-1562259949-e8e2f38b4f2d?w=400&h=300&fit=crop",
  portes_interieures: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&cb=1",
  portes_exterieures: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&cb=2",
  fenetres: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
  cuisine: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
  sanitaires: "https://images.unsplash.com/photo-1552321534-7263e5e4f2e5?w=400&h=300&fit=crop",
  electricite: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
  eclairage: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=400&h=300&fit=crop",
  plomberie: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop",
  faux_plafond: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
  climatisation: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop",
  revetements: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&cb=3",
  bois: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop&cb=4",
};
const img = (cat) => IMG[cat] || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop";

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    console.log("Seeding equipment and construction materials...");

    // ── ECONOMIQUE PACK ─────────────────────────────────────
    const ecoItems = [
      // Carrelage
      { name: "Carrelage gres cerame economique", category: "carrelage", qualityLevel: "economique", unit: "m2", price: 45, description: "Carrelage gres cerame 40x40, epaisseur 7mm, classe PEI 3", image: img("carrelage") },
      { name: "Carrelage mural salle de bain", category: "carrelage", qualityLevel: "economique", unit: "m2", price: 35, description: "Carrelage mural blanc 20x30, resistant a l'humidite", image: img("carrelage") },
      // Peinture
      { name: "Peinture vinylique blanche", category: "peinture", qualityLevel: "economique", unit: "litre", price: 25, description: "Peinture vinylique tendu, rendement 10m2/L, 2 couches", image: img("peinture") },
      { name: "Enduit de rebouchage", category: "peinture", qualityLevel: "economique", unit: "kg", price: 8, description: "Enduit de rebouchage et lissage interieur", image: img("peinture") },
      // Portes interieures
      { name: "Porte interieure panneau derivet", category: "portes_interieures", qualityLevel: "economique", unit: "piece", price: 180, description: "Porte panneau derivet 70x200cm, cadre bois, poignee plastique", image: img("portes_interieures") },
      { name: "Porte salle de bain panneau", category: "portes_interieures", qualityLevel: "economique", unit: "piece", price: 160, description: "Porte panneau 70x200cm, resistant a l'humidite", image: img("portes_interieures") },
      // Portes exterieures
      { name: "Porte entree aluminium", category: "portes_exterieures", qualityLevel: "economique", unit: "piece", price: 450, description: "Porte entree aluminium double vantail, 90x210cm", image: img("portes_exterieures") },
      // Fenetres
      { name: "Fenetre PVC 120x100", category: "fenetres", qualityLevel: "economique", unit: "piece", price: 220, description: "Fenetre PVC double vitrage, 120x100cm, 2 vantaux", image: img("fenetres") },
      { name: "Fenetre salle de bain 60x60", category: "fenetres", qualityLevel: "economique", unit: "piece", price: 120, description: "Fenetre PVC avec vitrage, 60x60cm", image: img("fenetres") },
      { name: "Volet roulant PVC", category: "fenetres", qualityLevel: "economique", unit: "piece", price: 150, description: "Volet roulant PVC pour fenetre 120x100", image: img("fenetres") },
      // Cuisine
      { name: "Cuisine equipee economique", category: "cuisine", qualityLevel: "economique", unit: "lot", price: 2500, description: "Cuisine equipee 3m lineaire, agglomere melamine, poignees plastique", image: img("cuisine") },
      { name: "Evier stainless 1 bac", category: "cuisine", qualityLevel: "economique", unit: "piece", price: 120, description: "Evier stainless 1 bac + vide sauce, 50x50cm", image: img("cuisine") },
      { name: "Robinetterie cuisine standard", category: "cuisine", qualityLevel: "economique", unit: "piece", price: 80, description: "Melangeur chromado, bec standard", image: img("cuisine") },
      // Sanitaires
      { name: "Vasque salle de bain 50cm", category: "sanitaires", qualityLevel: "economique", unit: "piece", price: 90, description: "Vasque ceramique 50cm avec colonne", image: img("sanitaires") },
      { name: "WC complet sol", category: "sanitaires", qualityLevel: "economique", unit: "piece", price: 180, description: "Cuvette WC sol avec reservoir double chasse, blanc", image: img("sanitaires") },
      { name: "Receveur de douche 80x80", category: "sanitaires", qualityLevel: "economique", unit: "piece", price: 120, description: "Receveur douche carre emboitable, 80x80cm", image: img("sanitaires") },
      { name: "Robinetterie baignoire", category: "sanitaires", qualityLevel: "economique", unit: "piece", price: 100, description: "Melangeur baignoire + douchette, chromado", image: img("sanitaires") },
      // Electricite
      { name: "Tableau electrique 12 modules", category: "electricite", qualityLevel: "economique", unit: "piece", price: 80, description: "Tableau electrique encastre, 12 modules + disjoncteurs", image: img("electricite") },
      { name: "Prise de courant 16A", category: "electricite", qualityLevel: "economique", unit: "piece", price: 15, description: "Prise de courant 16A encastree + boite", image: img("electricite") },
      { name: "Interrupteur simple", category: "electricite", qualityLevel: "economique", unit: "piece", price: 12, description: "Interrupteur simple encastre, blanc", image: img("electricite") },
      { name: "Gaine electrique 2.5mm", category: "electricite", qualityLevel: "economique", unit: "ml", price: 3, description: "Cable H07V-U 2.5mm gaine rouge/bleu/vert-jaune", image: img("electricite") },
      // Eclairage
      { name: "Applique murale LED 7W", category: "eclairage", qualityLevel: "economique", unit: "piece", price: 35, description: "Applique LED 7W, blanc chaud 3000K", image: img("eclairage") },
      { name: "Dalle LED plafond 24W", category: "eclairage", qualityLevel: "economique", unit: "piece", price: 45, description: "Dalle LED encastree 60x60cm, 24W", image: img("eclairage") },
      { name: "Spot LED encastre 5W", category: "eclairage", qualityLevel: "economique", unit: "piece", price: 20, description: "Spot LED GU10 5W, orientable", image: img("eclairage") },
      // Plomberie
      { name: "Tuyau eau chaude/froide PPR 20mm", category: "plomberie", qualityLevel: "economique", unit: "ml", price: 8, description: "Tube PPR 20mm pour distribution eau, avec raccords", image: img("plomberie") },
      { name: "Tuyau evacuation PVC 40mm", category: "plomberie", qualityLevel: "economique", unit: "ml", price: 5, description: "Tube PVC 40mm evacuation avec coudes et colliers", image: img("plomberie") },
      { name: "Chauffe-eau 50L", category: "plomberie", qualityLevel: "economique", unit: "piece", price: 400, description: "Chauffe-eau electrique 50L, blinde, garantie 3 ans", image: img("plomberie") },
      // Faux plafond
      { name: "Faux plafond placo 9.5mm", category: "faux_plafond", qualityLevel: "economique", unit: "m2", price: 35, description: "Plaque de platre BA13 standard, pose sur ossature metallique", image: img("faux_plafond") },
      // Climatisation
      { name: "Climatiseur split 9000 BTU", category: "climatisation", qualityLevel: "economique", unit: "piece", price: 900, description: "Climatiseur split mural 9000 BTU, classe A, froid seul", image: img("climatisation") },
      { name: "Climatiseur split 12000 BTU", category: "climatisation", qualityLevel: "economique", unit: "piece", price: 1200, description: "Climatiseur split mural 12000 BTU, classe A, froid seul", image: img("climatisation") },
      // Revetements
      { name: "Peinture facade acrylique", category: "revetements", qualityLevel: "economique", unit: "m2", price: 20, description: "Peinture facade acrylique, resistance aux intemperies", image: img("revetements") },
      { name: "Mortier colle carrelage", category: "revetements", qualityLevel: "economique", unit: "sac25kg", price: 18, description: "Mortier colle C1 pour carrelage interieur/exterieur", image: img("revetements") },
      // Menuiserie
      { name: "Garde-corps balcon aluminium", category: "menuiserie", qualityLevel: "economique", unit: "ml", price: 120, description: "Garde-corps aluminium 1m10, barreaux verticaux", image: img("bois") },
    ];

// ── STANDARD PACK ─────────────────────────────────────
    const stdItems = [
      // Carrelage
      { name: "Carrelage gres pleine masse 60x60", category: "carrelage", qualityLevel: "standard", unit: "m2", price: 80, description: "Carrelage gres pleine masse 60x60cm, epaisseur 9mm, classe PEI 4", image: img("carrelage") },
      { name: "Carrelage mural decoratif", category: "carrelage", qualityLevel: "standard", unit: "m2", price: 60, description: "Carrelage mural decoratif 25x40, large choix de motifs", image: img("carrelage") },
      // Peinture
      { name: "Peinture acrylique satinee", category: "peinture", qualityLevel: "standard", unit: "litre", price: 45, description: "Peinture acrylique satinee, lavable, rendement 12m2/L", image: img("peinture") },
      { name: "Enduit de lissage fin", category: "peinture", qualityLevel: "standard", unit: "kg", price: 15, description: "Enduit de lissage fin pour walls parfait", image: img("peinture") },
      // Portes interieures
      { name: "Porte interieure bois massif", category: "portes_interieures", qualityLevel: "standard", unit: "piece", price: 350, description: "Porte bois massif 80x200cm, type israelien, poignee metal", image: img("portes_interieures") },
      { name: "Porte salle de bain hydrofuge", category: "portes_interieures", qualityLevel: "standard", unit: "piece", price: 320, description: "Porte hydrofuge 70x200cm, panneaux PVC", image: img("portes_interieures") },
      // Portes exterieures
      { name: "Porte entree securisee 3 points", category: "portes_exterieures", qualityLevel: "standard", unit: "piece", price: 800, description: "Porte entree blindee, 3 points de fermeture, 90x210cm", image: img("portes_exterieures") },
      // Fenetres
      { name: "Fenetre PVC double vitrage 140x110", category: "fenetres", qualityLevel: "standard", unit: "piece", price: 380, description: "Fenetre PVC 140x110cm, double vitrage 4-16-4, 3 vantaux", image: img("fenetres") },
      { name: "Fenetre salle de bain 70x50", category: "fenetres", qualityLevel: "standard", unit: "piece", price: 200, description: "Fenetre PVC oscillo-battant 70x50cm", image: img("fenetres") },
      { name: "Volet roulant aluminium 140x110", category: "fenetres", qualityLevel: "standard", unit: "piece", price: 250, description: "Volet roulant aluminium thermique, 140x110cm", image: img("fenetres") },
      // Cuisine
      { name: "Cuisine equipee standard 4m", category: "cuisine", qualityLevel: "standard", unit: "lot", price: 5500, description: "Cuisine equipee 4m lineaire, agglomere hydrofuge, poignees metal", image: img("cuisine") },
      { name: "Plan de travail granit", category: "cuisine", qualityLevel: "standard", unit: "ml", price: 250, description: "Plan de travail granit noir 2cm, largeur 60cm", image: img("cuisine") },
      { name: "Evier granit 1 bac + 1/2", category: "cuisine", qualityLevel: "standard", unit: "piece", price: 280, description: "Evier granit composite 80x50cm, 1 bac + 1/2", image: img("cuisine") },
      { name: "Robinetterie cuisine melangeur", category: "cuisine", qualityLevel: "standard", unit: "piece", price: 180, description: "Melangeur cuisine haute pression, bec orientable", image: img("cuisine") },
      // Sanitaires
      { name: "Vasque plan 80cm avec meuble", category: "sanitaires", qualityLevel: "standard", unit: "piece", price: 380, description: "Vasque 80cm avec meuble suspendu, miroir et eclairage", image: img("sanitaires") },
      { name: "WC suspendu avec chasseintegree", category: "sanitaires", qualityLevel: "standard", unit: "piece", price: 480, description: "WC suspendu japana, reservoir encastre, abattant soft-close", image: img("sanitaires") },
      { name: "Douche a l'italienne equipee", category: "sanitaires", qualityLevel: "standard", unit: "piece", price: 600, description: "Receveur extra-plat 90x90 + paroi verre 6mm + syst. vidage", image: img("sanitaires") },
      { name: "Baignoire acrylique 170x70", category: "sanitaires", qualityLevel: "standard", unit: "piece", price: 500, description: "Baignoire droite acrylique 170x70cm, + colonne", image: img("sanitaires") },
      { name: "Robinetterie complete standard", category: "sanitaires", qualityLevel: "standard", unit: "lot", price: 350, description: "Kit complet: mitigeur lavabo + baignoire + douche", image: img("sanitaires") },
      // Electricite
      { name: "Tableau electrique 24 modules + diff", category: "electricite", qualityLevel: "standard", unit: "piece", price: 200, description: "Tableau 24 modules + inter diff 30mA + disjoncteurs", image: img("electricite") },
      { name: "Prise de courant 16A Legrand-like", category: "electricite", qualityLevel: "standard", unit: "piece", price: 25, description: "Prise encastree avec plaques design", image: img("electricite") },
      { name: "Interrupteur double", category: "electricite", qualityLevel: "standard", unit: "piece", price: 22, description: "Interrupteur double encastre, design moderne", image: img("electricite") },
      { name: "Cable 2.5mm type H07V-U", category: "electricite", qualityLevel: "standard", unit: "ml", price: 4, description: "Cable 2.5mm rigide pour circuit prises, rouleaux 100m", image: img("electricite") },
      // Eclairage
      { name: "Dalle LED 40W encastree 60x60", category: "eclairage", qualityLevel: "standard", unit: "piece", price: 80, description: "Dalle LED 60x60cm 40W, UGR<22, montage suspendu", image: img("eclairage") },
      { name: "Spot LED GU10 7W orientable", category: "eclairage", qualityLevel: "standard", unit: "piece", price: 35, description: "Spot GU10 7W, IRC>80, faisceau 38°, noir", image: img("eclairage") },
      { name: "Ruban LED 5m avec transfo", category: "eclairage", qualityLevel: "standard", unit: "lot", price: 80, description: "Ruban LED RGB 5m, 5050, avec transfo 12V", image: img("eclairage") },
      // Plomberie
      { name: "Kit plomberie PPR complet", category: "plomberie", qualityLevel: "standard", unit: "lot", price: 1200, description: "Kit PPR 20/25mm: tubes + raccords + colliers pour maison 100m2", image: img("plomberie") },
      { name: "Evacuation PVC complete maison", category: "plomberie", qualityLevel: "standard", unit: "lot", price: 600, description: "Kit evacuation PVC 40/50/110mm pour maison", image: img("plomberie") },
      { name: "Chauffe-eau solaire 150L", category: "plomberie", qualityLevel: "standard", unit: "piece", price: 1800, description: "Chauffe-eau solaire 150L, panneaux 2x1.5m, garantie 5 ans", image: img("plomberie") },
      // Faux plafond
      { name: "Faux plafond staff hydrofuge", category: "faux_plafond", qualityLevel: "standard", unit: "m2", price: 65, description: "Plaque hydrofuge BA13 + ossature + finition", image: img("faux_plafond") },
      // Climatisation
      { name: "Climatiseur split 9000 BTU Inverter", category: "climatisation", qualityLevel: "standard", unit: "piece", price: 1400, description: "Split mural 9000 BTU, inverter, classe A++, froid/chaud", image: img("climatisation") },
      { name: "Climatiseur split 18000 BTU Inverter", category: "climatisation", qualityLevel: "standard", unit: "piece", price: 2200, description: "Split mural 18000 BTU, inverter, classe A++, froid/chaud", image: img("climatisation") },
      // Revetements
      { name: "Crepi exterieur acrylique", category: "revetements", qualityLevel: "standard", unit: "m2", price: 45, description: "Crepi acrylique decoration exterieur, 3 couleurs au choix", image: img("revetements") },
      { name: "Mortier colle C2 premium", category: "revetements", qualityLevel: "standard", unit: "sac25kg", price: 30, description: "Mortier colle C2S1 pour carrelage grand format", image: img("revetements") },
      // Menuiserie
      { name: "Garde-corps balcon verre trempe", category: "menuiserie", qualityLevel: "standard", unit: "ml", price: 280, description: "Garde-corps verre trempe 10mm + aluminium, 1m10", image: img("bois") },
      { name: "Porte coulissante placard", category: "menuiserie", qualityLevel: "standard", unit: "piece", price: 350, description: "Porte coulissante placard 200x220cm, cadre alu + miroir", image: img("bois") },
    ];

// ── HAUT DE GAMME PACK ─────────────────────────────────
    const hgItems = [
      // Carrelage
      { name: "Carrelage poreux grand format 80x80", category: "carrelage", qualityLevel: "haut de gamme", unit: "m2", price: 150, description: "Carrelagegres masse 80x80cm, epaisseur 10mm, rectifie, classe PEI 5", image: img("carrelage") },
      { name: "Carrelage decoratif 30x60 premium", category: "carrelage", qualityLevel: "haut de gamme", unit: "m2", price: 100, description: "Carrelage mural decoratif 30x60, imitation pierre naturelle", image: img("carrelage") },
      { name: "Parement pierre naturelle", category: "carrelage", qualityLevel: "haut de gamme", unit: "m2", price: 120, description: "Parement pierre naturelle pour mur accent", image: img("carrelage") },
      // Peinture
      { name: "Peinture minerale silicate", category: "peinture", qualityLevel: "haut de gamme", unit: "litre", price: 80, description: "Peinture minérale silicate, tres perméable a la vapeur, ecologique", image: img("peinture") },
      { name: "Tadelakt decoration", category: "peinture", qualityLevel: "haut de gamme", unit: "m2", price: 120, description: "Tadelakt murs salle de bain et douche, finition lustree", image: img("peinture") },
      // Portes interieures
      { name: "Porte interieure design contemporain", category: "portes_interieures", qualityLevel: "haut de gamme", unit: "piece", price: 650, description: "Porte design 90x210cm, cadre aluminium, panneau verre depoli", image: img("portes_interieures") },
      { name: "Porte coulissante vitree", category: "portes_interieures", qualityLevel: "haut de gamme", unit: "piece", price: 800, description: "Porte coulissante verre 200x220cm, systeme amorti", image: img("portes_interieures") },
      // Portes exterieures
      { name: "Porte entree blindee securite max", category: "portes_exterieures", qualityLevel: "haut de gamme", unit: "piece", price: 1800, description: "Porte entree classe 5 anti-effraction, 5 points, 100x210cm", image: img("portes_exterieures") },
      // Fenetres
      { name: "Fenetre aluminium rupture pont thermique", category: "fenetres", qualityLevel: "haut de gamme", unit: "piece", price: 650, description: "Fenetre aluminium RPT 140x130cm, double vitrage faible emissivite", image: img("fenetres") },
      { name: "Fenetre panoramique 200x150", category: "fenetres", qualityLevel: "haut de gamme", unit: "piece", price: 900, description: "Fenetre panoramique aluminium, double vitrage, 200x150cm", image: img("fenetres") },
      { name: "Volet roulant motorise", category: "fenetres", qualityLevel: "haut de gamme", unit: "piece", price: 450, description: "Volet roulant aluminium motorise, telecommande + detection obstacle", image: img("fenetres") },
      // Cuisine
      { name: "Cuisine italienne haut de gamme 5m", category: "cuisine", qualityLevel: "haut de gamme", unit: "lot", price: 15000, description: "Cuisine设计和造 5m lineaire, facade laque mate, plan quartz", image: img("cuisine") },
      { name: "Ilot central cuisine", category: "cuisine", qualityLevel: "haut de gamme", unit: "piece", price: 5000, description: "Ilot central cuisine avec plaques, evier et rangement", image: img("cuisine") },
      { name: "Plan de travail quartz noir", category: "cuisine", qualityLevel: "haut de gamme", unit: "ml", price: 500, description: "Plan de travail quartz composite 2cm, couleur personnalisee", image: img("cuisine") },
      { name: "Robinetterie cuisine design", category: "cuisine", qualityLevel: "haut de gamme", unit: "piece", price: 450, description: "Robinet mitigeur design douchette extractible", image: img("cuisine") },
      // Sanitaires
      { name: "Vasque suspendue designer", category: "sanitaires", qualityLevel: "haut de gamme", unit: "piece", price: 800, description: "Vasque suspendue designer, ceramique artisanale, avec meuble", image: img("sanitaires") },
      { name: "WC japonais Toto washlet", category: "sanitaires", qualityLevel: "haut de gamme", unit: "piece", price: 2500, description: "WC japonais avec lavage automatique, seche-linge, abattant chauffant", image: img("sanitaires") },
      { name: "Douche hammam 120x90", category: "sanitaires", qualityLevel: "haut de gamme", unit: "piece", price: 3500, description: "Douche hammam avec generator vapeur, chromotherapie LED, siege", image: img("sanitaires") },
      { name: "Baignoire asymetrique balneo", category: "sanitaires", qualityLevel: "haut de gamme", unit: "piece", price: 2000, description: "Baignoire asymetrique acrylique avec systeme balneo 8 jets", image: img("sanitaires") },
      { name: "Paroi doucheWalk-in 100x200", category: "sanitaires", qualityLevel: "haut de gamme", unit: "piece", price: 800, description: "Paroi douche Walk-in verre trempe 10mm, fixe", image: img("sanitaires") },
      { name: "Robinetterie Grohe complete", category: "sanitaires", qualityLevel: "haut de gamme", unit: "lot", price: 1500, description: "Kit complet Grohe: douchette, baignoire, vasque, wc", image: img("sanitaires") },
      // Electricite
      { name: "Tableau electrique 36 modules+survoltage", category: "electricite", qualityLevel: "haut de gamme", unit: "piece", price: 500, description: "Tableau complet 36 modules, parafoudre, diff. 300mA + 30mA", image: img("electricite") },
      { name: "Prise design Gira E2", category: "electricite", qualityLevel: "haut de gamme", unit: "piece", price: 40, description: "Prise encastree Gira E2, blanc mat", image: img("electricite") },
      { name: "Interrupteur tactile", category: "electricite", qualityLevel: "haut de gamme", unit: "piece", price: 55, description: "Interrupteur tactile avec detection de mouvement", image: img("electricite") },
      { name: "Domotique: module eclairage", category: "electricite", qualityLevel: "haut de gamme", unit: "piece", price: 150, description: "Module domotique KNX pour controle eclairage smartphone", image: img("electricite") },
      // Eclairage
      { name: "Lustre designer pour salon", category: "eclairage", qualityLevel: "haut de gamme", unit: "piece", price: 800, description: "Lustre designer chrome+ cristal, LED 80W, dimmable", image: img("eclairage") },
      { name: "Eclairage architectural LED profile", category: "eclairage", qualityLevel: "haut de gamme", unit: "ml", price: 120, description: "Profile LED encastre 3m avec douille GU10", image: img("eclairage") },
      { name: "Dalle LED 50W haute qualite", category: "eclairage", qualityLevel: "haut de gamme", unit: "piece", price: 150, description: "Dalle LED 60x60cm 50W, UGR<19, pour bureaux", image: img("eclairage") },
      { name: "Spot downlight LED 15W", category: "eclairage", qualityLevel: "haut de gamme", unit: "piece", price: 80, description: "Downlight LED encastre 15W, faisceau 60°, IRC>90", image: img("eclairage") },
      // Plomberie
      { name: "Kit plomberie PER multicouche complet", category: "plomberie", qualityLevel: "haut de gamme", unit: "lot", price: 2500, description: "Kit PER multicouche 20/26mm + collecteur pour maison 200m2", image: img("plomberie") },
      { name: "Station vidange complete", category: "plomberie", qualityLevel: "haut de gamme", unit: "piece", price: 800, description: "Station de relevage eaux usees pour sous-sol", image: img("plomberie") },
      { name: "Chauffe-eau thermodynamique 200L", category: "plomberie", qualityLevel: "haut de gamme", unit: "piece", price: 3500, description: "Chauffe-eau thermodynamique 200L, COP 3.5, classe A+", image: img("plomberie") },
      // Faux plafond
      { name: "Faux plafond deco设计与造", category: "faux_plafond", qualityLevel: "haut de gamme", unit: "m2", price: 120, description: "Faux plafond设计与造 avec spots encastres et LED", image: img("faux_plafond") },
      // Climatisation
      { name: "Climatisation gainable 24000 BTU", category: "climatisation", qualityLevel: "haut de gamme", unit: "piece", price: 4500, description: "Systeme gainable Daikin 24000 BTU, inverter, reseau gaines + grilles", image: img("climatisation") },
      { name: "Climatiseur window 18000 BTU", category: "climatisation", qualityLevel: "haut de gamme", unit: "piece", price: 2800, description: "Console Daikin 18000 BTU, inverter, froid/chaud, silencieux", image: img("climatisation") },
      // Revetements
      { name: "Enduit decoratif 3D", category: "revetements", qualityLevel: "haut de gamme", unit: "m2", price: 100, description: "Enduit decoratif 3D pour mur accent salon", image: img("revetements") },
      { name: "Bois exotique decking", category: "revetements", qualityLevel: "haut de gamme", unit: "m2", price: 200, description: "Terrasse bois exotique ipe, lame 145x21mm", image: img("revetements") },
      // Menuiserie
      { name: "Garde-corps swim Spa verre 12mm", category: "menuiserie", qualityLevel: "haut de gamme", unit: "ml", price: 600, description: "Garde-corps verre trempe 12mm + pinces U,inox", image: img("bois") },
      { name: "Menuiserie alu coulissant grandes dimensions", category: "menuiserie", qualityLevel: "haut de gamme", unit: "piece", price: 2500, description: "Porte coulissante aluminium 3 vantaux 360x250cm", image: img("bois") },
      { name: "Porte entree bois massif 3 points", category: "menuiserie", qualityLevel: "haut de gamme", unit: "piece", price: 1200, description: "Porte bois massif 3 points, serrure securite", image: img("bois") },
    ];

    const allItems = [...ecoItems, ...stdItems, ...hgItems];

    // Create equipment
    const createdItems = [];
    for (const item of allItems) {
      const existing = await Equipment.findOne({ name: item.name, qualityLevel: item.qualityLevel });
      if (!existing) {
        const created = await Equipment.create(item);
        createdItems.push({ ...item, _id: created._id });
      } else {
        await Equipment.findByIdAndUpdate(existing._id, item);
        createdItems.push({ ...item, _id: existing._id });
      }
    }
    console.log(`${createdItems.length} equipment items created/updated`);

    // Create packages
    const ecoIds = createdItems.filter(i => i.qualityLevel === "economique").map(i => i._id);
    const stdIds = createdItems.filter(i => i.qualityLevel === "standard").map(i => i._id);
    const hgIds = createdItems.filter(i => i.qualityLevel === "haut de gamme").map(i => i._id);

    await Package.findOneAndUpdate({ name: "economique" }, { name: "economique", equipmentIds: ecoIds }, { upsert: true });
    await Package.findOneAndUpdate({ name: "standard" }, { name: "standard", equipmentIds: stdIds }, { upsert: true });
    await Package.findOneAndUpdate({ name: "haut de gamme" }, { name: "haut de gamme", equipmentIds: hgIds }, { upsert: true });

    console.log("Packages created:");
    console.log(`  Economique: ${ecoIds.length} items`);
    console.log(`  Standard: ${stdIds.length} items`);
    console.log(`  Haut de gamme: ${hgIds.length} items`);

    console.log("\nSeed complete!");
  } catch (err) {
    console.error("Error:", err.message);
  }
  process.exit();
});