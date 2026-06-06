const mongoose = require("mongoose");
require("dotenv").config();

const houseData = [
  {
    title: "Villa Moderne S+2",
    description: "Villa contemporaine avec piscine, jardin paysager et finition haut de gamme. Vue panoramique sur la medina.",
    surface: 280, floors: 2, rooms: 8,
    finitionLevel: "haut de gamme",
    estimatedPrice: 650000,
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"],
  },
  {
    title: "Appartement F4 Lac 2",
    description: "Appartement lumineux aux Berges du Lac, prestations luxueuses, cuisine equipee, parking double.",
    surface: 180, floors: 1, rooms: 5,
    finitionLevel: "haut de gamme",
    estimatedPrice: 420000,
    images: ["https://images.unsplash.com/photo-1605146769289-440cc1133d00?w=600&q=80"],
  },
  {
    title: "Maison R+1 Ennasr 2",
    description: "Maison individuelle avec toit-terrasse, garage et jardin. Quartier residentiel calme.",
    surface: 220, floors: 1, rooms: 6,
    finitionLevel: "standard",
    estimatedPrice: 380000,
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80"],
  },
  {
    title: "Duplex F5 La Marsa",
    description: "Duplex avec grande terrasse vue mer, cheminee, double sejour et toit-terrasse amenage.",
    surface: 200, floors: 2, rooms: 6,
    finitionLevel: "standard",
    estimatedPrice: 520000,
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"],
  },
  {
    title: "Villa Economique F6",
    description: "Villa abordable avec terrain cloture, finition economique mais solide. Parfait jeune famille.",
    surface: 150, floors: 1, rooms: 5,
    finitionLevel: "economique",
    estimatedPrice: 190000,
    images: ["https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&q=80"],
  },
  {
    title: "Studio S+1 Centre Ville",
    description: "Studio mezzanine au coeur de Tunis, ideal investisseur. Proximite commerces et transports.",
    surface: 65, floors: 1, rooms: 2,
    finitionLevel: "economique",
    estimatedPrice: 95000,
    images: ["https://images.unsplash.com/photo-1600566753086-00f18f6b1252?w=600&q=80"],
  },
  {
    title: "Villa de Luxe Sidi Bou Said",
    description: "Villa d'exception avec vue imprenable sur la mer, architecture andalouse, piscine infinie.",
    surface: 350, floors: 2, rooms: 10,
    finitionLevel: "haut de gamme",
    estimatedPrice: 1200000,
    images: ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80"],
  },
  {
    title: "Appartement F3 Ariana",
    description: "Bel appartement recent, cuisine ouverte, balcon, climatisation centrale, cave et parking.",
    surface: 110, floors: 1, rooms: 4,
    finitionLevel: "standard",
    estimatedPrice: 210000,
    images: ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80"],
  },
  {
    title: "Villa Jardin F5",
    description: "Villa avec grand jardin, piscine et dependance. Quartier prive avec gardien 24h/24.",
    surface: 300, floors: 1, rooms: 7,
    finitionLevel: "haut de gamme",
    estimatedPrice: 720000,
    images: ["https://images.unsplash.com/photo-1600595956482-5c7ca0e73c48?w=600&q=80"],
  },
  {
    title: "Appartement F2 Tunis",
    description: "Appartement cosy et fonctionnel, ideal etudiant ou jeune actif. Charge faible, bonne exposition.",
    surface: 75, floors: 1, rooms: 3,
    finitionLevel: "economique",
    estimatedPrice: 120000,
    images: ["https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80"],
  },
  {
    title: "Maison Traditionnelle F7",
    description: "Maison de charme type arabo-andalouse avec patio central, fontaine et zelliges faits main.",
    surface: 260, floors: 1, rooms: 7,
    finitionLevel: "standard",
    estimatedPrice: 450000,
    images: ["https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=600&q=80"],
  },
  {
    title: "Villa Contemporaine R+2",
    description: "Villa moderne avec ascenseur prive, Smart Home, toit-terrasse equipe et piscine chauffee.",
    surface: 400, floors: 2, rooms: 10,
    finitionLevel: "haut de gamme",
    estimatedPrice: 950000,
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80"],
  },
  {
    title: "Maison de Ville F4",
    description: "Maison de ville en chaine, 3 facades libres, garage double, proche ecoles et commerces.",
    surface: 170, floors: 1, rooms: 5,
    finitionLevel: "standard",
    estimatedPrice: 280000,
    images: ["https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=600&q=80"],
  },
  {
    title: "Villa Economique F4",
    description: "Villa simple mais confortable, terrain 300m², possibilite d'extension. Prix tres attractif.",
    surface: 130, floors: 1, rooms: 4,
    finitionLevel: "economique",
    estimatedPrice: 155000,
    images: ["https://images.unsplash.com/photo-1600573472590-ee6b68d14c68?w=600&q=80"],
  },
  {
    title: "Duplex F6 Megrine",
    description: "Grand duplex avec terrasse de 80m², vue delage, finitions soignees, cuisine italienne.",
    surface: 230, floors: 2, rooms: 7,
    finitionLevel: "standard",
    estimatedPrice: 340000,
    images: ["https://images.unsplash.com/photo-1600566753376-12c8ab7c4a?w=600&q=80"],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/smartbuild");
    console.log("Connecte a MongoDB");

    const House = require("./models/House");
    await House.deleteMany({});
    console.log("Anciennes maisons supprimees");

    const result = await House.insertMany(houseData);
    console.log(`${result.length} maisons ajoutees`);

    await mongoose.disconnect();
    console.log("Termine");
    process.exit(0);
  } catch (err) {
    console.error("Erreur:", err);
    process.exit(1);
  }
}

seed();
