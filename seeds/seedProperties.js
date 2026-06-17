const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('../models/Property');
const User = require('../models/User');

dotenv.config();

const properties = [
  { titre: "Villa Moderne Les Oliviers", type: "maison", prix: 650000, surface: 220, chambres: 4, sallesDeBain: 3, ville: "Tunis", statut: "disponible", images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"], description: "Villa moderne avec piscine et jardin, quartier residentiel calme." },
  { titre: "Appartement Lac 2", type: "appartement", prix: 420000, surface: 130, chambres: 3, sallesDeBain: 2, ville: "Tunis", statut: "nouveau", images: ["https://images.unsplash.com/photo-1605146769289-440cc1133d00?w=800"], description: "Appartement vue lac, standing eleve, proche commodites." },
  { titre: "Terrain Industriel Radès", type: "terrain", prix: 280000, surface: 500, ville: "Rades", statut: "disponible", images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"], description: "Terrain constructible zone industrielle, бон accès routier." },
  { titre: "Villa Luxe La Marsa", type: "maison", prix: 1200000, surface: 350, chambres: 5, sallesDeBain: 4, ville: "La Marsa", statut: "disponible", images: ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"], description: "Villa de luxe avec vue mer, piscine chauffee, garage double." },
  { titre: "Appartement Centre Ville Sfax", type: "appartement", prix: 180000, surface: 85, chambres: 2, sallesDeBain: 1, ville: "Sfax", statut: "disponible", images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"], description: "Appartement F3 au centre-ville, proche transport." },
  { titre: "Terrain Agricole Beja", type: "terrain", prix: 95000, surface: 1200, ville: "Beja", statut: "disponible", images: ["https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800"], description: "Grande parcelle agricole, eau et electricite sur place." },
  { titre: "Duplex Menzah", type: "maison", prix: 520000, surface: 180, chambres: 3, sallesDeBain: 2, ville: "La Menzah", statut: "nouveau", images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"], description: "Duplex moderne avec terrasse, quartier prisé." },
  { titre: "Studio Etudiant Sousse", type: "appartement", prix: 95000, surface: 45, chambres: 1, sallesDeBain: 1, ville: "Sousse", statut: "disponible", images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"], description: "Studio meuble, ideal pour etudiant, proche universite." },
  { titre: "Villa Campagne Nabeul", type: "maison", prix: 380000, surface: 200, chambres: 4, sallesDeBain: 2, ville: "Nabeul", statut: "vendu", images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"], description: "Villa en campagne avec grand jardin et vue sur la mer." },
  { titre: "Appartement Hammamet", type: "appartement", prix: 310000, surface: 110, chambres: 2, sallesDeBain: 2, ville: "Hammamet", statut: "nouveau", images: ["https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"], description: "Residence touristique, vue panoramique, piscine commune." },
  { titre: "Terrain Constructible Sidi Bouzid", type: "terrain", prix: 65000, surface: 800, ville: "Sidi Bouzid", statut: "disponible", images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"], description: "Parcelle en pleine expansion, bord de route national." },
  { titre: "Maison Familiale Kairouan", type: "maison", prix: 245000, surface: 160, chambres: 3, sallesDeBain: 2, ville: "Kairouan", statut: "disponible", images: ["https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800"], description: "Maison traditionnelle renovee, calme et confort." },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connecte a MongoDB");

  let vendeur = await User.findOne({ role: 'terrain_seller' });
  if (!vendeur) {
    vendeur = await User.create({
      name: 'Agence Immobiliere',
      email: 'agence@smartbuild.tn',
      password: 'password123',
      role: 'terrain_seller',
    });
    console.log('Vendeur cree');
  }

  await Property.deleteMany({});
  const propsWithVendor = properties.map((p) => ({ ...p, vendeurId: vendeur._id }));
  await Property.insertMany(propsWithVendor);
  console.log(`${properties.length} biens inseres`);

  await mongoose.disconnect();
  console.log('Seed termine');
}

seed().catch((e) => { console.error(e); process.exit(1); });
