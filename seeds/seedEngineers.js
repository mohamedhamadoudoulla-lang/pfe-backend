const mongoose = require("mongoose");
const User = require("../models/User");
const Engineer = require("../models/Engineer");
require("dotenv").config();

const seedEngineers = async () => {
  try {
    // Connexion à la base de données
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/smartbuild");
    console.log("✅ Connecté à la base de données");

    // Données des ingénieurs à ajouter
    const engineersData = [
      {
        name: "Ahmed Ben Ali",
        email: "ahmed.benali@engineer.tn",
        phone: "+216 91 234 567",
        role: "engineer",
        speciality: "Génie Civil",
        experience: 8,
        region: "Sfax",
        pricePerM2: 150,
        rating: 4.8,
        description: "Expert en constructions résidentielles avec 8 ans d'expérience. Portfolio riche et clients satisfaits.",
        isVerified: true,
      },
      {
        name: "Fatima Kharrat",
        email: "fatima.kharrat@engineer.tn",
        phone: "+216 92 345 678",
        role: "engineer",
        speciality: "Architecture",
        experience: 6,
        region: "Tunis",
        pricePerM2: 180,
        rating: 4.9,
        description: "Architecte créative spécialisée dans la conception moderne. Projets innovants et durables.",
        isVerified: true,
      },
      {
        name: "Mohamed Saidane",
        email: "mohamed.saidane@engineer.tn",
        phone: "+216 93 456 789",
        role: "engineer",
        speciality: "Génie Civil",
        experience: 10,
        region: "Sousse",
        pricePerM2: 200,
        rating: 5.0,
        description: "Ingénieur confirmé avec expertise en structures complexes. Garant de qualité premium.",
        isVerified: true,
      },
      {
        name: "Leila Trabelsi",
        email: "leila.trabelsi@engineer.tn",
        phone: "+216 94 567 890",
        role: "engineer",
        speciality: "Design d'intérieur",
        experience: 5,
        region: "Monastir",
        pricePerM2: 120,
        rating: 4.7,
        description: "Designer créative pour transformer vos espaces. Spécialiste en petit budget.",
        isVerified: true,
      },
      {
        name: "Karim Boutaleb",
        email: "karim.boutaleb@engineer.tn",
        phone: "+216 95 678 901",
        role: "engineer",
        speciality: "Génie Civil",
        experience: 12,
        region: "Gafsa",
        pricePerM2: 160,
        rating: 4.6,
        description: "Spécialiste en projets commerciaux et résidentiels. Respect des délais garanti.",
        isVerified: true,
      },
      {
        name: "Noor El Hana",
        email: "noor.elhana@engineer.tn",
        phone: "+216 96 789 012",
        role: "engineer",
        speciality: "Architecture",
        experience: 7,
        region: "Nabul",
        pricePerM2: 170,
        rating: 4.5,
        description: "Architecte passionnée par le design écologique et les espaces harmonieux.",
        isVerified: true,
      },
    ];

    // Vérifier et créer les ingénieurs
    for (const engineerData of engineersData) {
      // Vérifier si l'utilisateur existe
      let user = await User.findOne({ email: engineerData.email });
      
      if (!user) {
        // Créer l'utilisateur
        user = await User.create({
          name: engineerData.name,
          email: engineerData.email,
          phone: engineerData.phone,
          role: engineerData.role,
          password: "password123", // Mot de passe par défaut
        });
        console.log(`✅ Utilisateur créé: ${user.name}`);
      }

      // Vérifier si l'ingénieur existe
      const engineerExists = await Engineer.findOne({ user: user._id });
      
      if (!engineerExists) {
        // Créer l'ingénieur
        const engineer = await Engineer.create({
          user: user._id,
          speciality: engineerData.speciality,
          experience: engineerData.experience,
          region: engineerData.region,
          pricePerM2: engineerData.pricePerM2,
          rating: engineerData.rating,
          description: engineerData.description,
          isVerified: engineerData.isVerified,
          portfolio: [],
        });
        console.log(`✅ Ingénieur ajouté: ${engineer.speciality} - ${user.name}`);
      } else {
        console.log(`⚠️  Ingénieur déjà existant: ${user.name}`);
      }
    }

    console.log("\n✅ Seed des ingénieurs terminé avec succès!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error.message);
    process.exit(1);
  }
};

// Exécuter le seed
seedEngineers();
