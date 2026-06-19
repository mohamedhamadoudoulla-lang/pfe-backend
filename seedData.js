const mongoose = require("mongoose");
require("dotenv").config();

const RegionPrice = require("./models/RegionPrice");
const Furniture   = require("./models/Furniture");
const Terrain     = require("./models/Terrain");
const User        = require("./models/User");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .then(seed)
  .catch(console.error);

async function seed() {
  console.log("🌱 Démarrage du seed...");
  await seedRegionPrices();
  await seedFurniture();
  await seedTerrains();
  console.log("✅ Seed terminé !");
  process.exit();
}

// ============================================================
// 1. PRIX PAR RÉGION (terrain + construction)
// ============================================================
async function seedRegionPrices() {
  await RegionPrice.deleteMany({});
  console.log("📍 Insertion des prix par région...");

  const regions = [
    { region:"Tunis",       pricePerM2:800  },
    { region:"Ariana",      pricePerM2:600  },
    { region:"Ben Arous",   pricePerM2:500  },
    { region:"Manouba",     pricePerM2:300  },
    { region:"Nabeul",      pricePerM2:350  },
    { region:"Zaghouan",    pricePerM2:150  },
    { region:"Bizerte",     pricePerM2:250  },
    { region:"Béja",        pricePerM2:100  },
    { region:"Jendouba",    pricePerM2:80   },
    { region:"Kef",         pricePerM2:80   },
    { region:"Siliana",     pricePerM2:70   },
    { region:"Sousse",      pricePerM2:400  },
    { region:"Monastir",    pricePerM2:450  },
    { region:"Mahdia",      pricePerM2:200  },
    { region:"Sfax",        pricePerM2:300  },
    { region:"Kairouan",    pricePerM2:120  },
    { region:"Kasserine",   pricePerM2:80   },
    { region:"Sidi Bouzid", pricePerM2:70   },
    { region:"Gabès",       pricePerM2:180  },
    { region:"Médenine",    pricePerM2:150  },
    { region:"Tataouine",   pricePerM2:60   },
    { region:"Gafsa",       pricePerM2:100  },
    { region:"Tozeur",      pricePerM2:90   },
    { region:"Kébili",      pricePerM2:70   },
  ];

  await RegionPrice.insertMany(regions);
  console.log(`   ✅ ${regions.length} régions insérées`);
}

// ============================================================
// 2. MEUBLES & ÉQUIPEMENTS PAR NIVEAU DE QUALITÉ
// ============================================================
async function seedFurniture() {
  await Furniture.deleteMany({});
  console.log("🛋️ Insertion des meubles et équipements...");

  // Trouve ou crée un vendeur équipement
  let seller = await User.findOne({ role: "equipment_seller" });
  if (!seller) {
    const bcrypt = require("bcryptjs");
    seller = await User.create({
      name:     "SmartBuild Store",
      email:    "store@smartbuild.tn",
      password: await bcrypt.hash("Store123!", 10),
      role:     "equipment_seller",
    });
    console.log("   👤 Vendeur SmartBuild Store créé");
  }

  const items = [

    // ────── SALON ──────
    { name:"Canapé 3 places tissu",        category:"salon", qualityLevel:"économique",    price:1200,  description:"Canapé en tissu robuste, coloris variés", seller:seller._id, isActive:true },
    { name:"Canapé d'angle moderne",       category:"salon", qualityLevel:"standard",      price:3200,  description:"Canapé d'angle en tissu premium, 5 places", seller:seller._id, isActive:true },
    { name:"Canapé en cuir haut de gamme", category:"salon", qualityLevel:"haut de gamme", price:7500,  description:"Canapé cuir véritable, rembourrage mousse HR", seller:seller._id, isActive:true },
    { name:"Table basse bois",             category:"salon", qualityLevel:"économique",    price:380,   description:"Table basse MDF, décor bois", seller:seller._id, isActive:true },
    { name:"Table basse verre trempé",     category:"salon", qualityLevel:"standard",      price:850,   description:"Table basse verre 10mm + pieds métal doré", seller:seller._id, isActive:true },
    { name:"Table basse marbre",           category:"salon", qualityLevel:"haut de gamme", price:3200,  description:"Marbre naturel blanc, pieds laiton brossé", seller:seller._id, isActive:true },
    { name:"Meuble TV 120cm",              category:"salon", qualityLevel:"économique",    price:450,   description:"Meuble TV MDF décor bois, 2 portes", seller:seller._id, isActive:true },
    { name:"Meuble TV suspendu 150cm",     category:"salon", qualityLevel:"standard",      price:1100,  description:"Meuble TV mural avec LED intégré", seller:seller._id, isActive:true },
    { name:"Bibliothèque modulable",       category:"salon", qualityLevel:"standard",      price:950,   description:"Bibliothèque 5 étagères bois massif", seller:seller._id, isActive:true },

    // ────── CHAMBRE ──────
    { name:"Lit 140x190 avec tête",        category:"chambre", qualityLevel:"économique",    price:800,   description:"Lit double, tête de lit tissu gris", seller:seller._id, isActive:true },
    { name:"Lit 160x200 coffre",           category:"chambre", qualityLevel:"standard",      price:2200,  description:"Lit coffre de rangement, tête capitonnée", seller:seller._id, isActive:true },
    { name:"Lit 180x200 en bois massif",   category:"chambre", qualityLevel:"haut de gamme", price:5500,  description:"Lit en chêne massif, finition naturelle", seller:seller._id, isActive:true },
    { name:"Armoire 3 portes battantes",   category:"chambre", qualityLevel:"économique",    price:950,   description:"Armoire mélaminé, miroir central", seller:seller._id, isActive:true },
    { name:"Dressing 4 portes coulissantes",category:"chambre", qualityLevel:"standard",     price:2800,  description:"Dressing miroir, éclairage LED intégré", seller:seller._id, isActive:true },
    { name:"Dressing sur mesure",          category:"chambre", qualityLevel:"haut de gamme", price:8500,  description:"Dressing laqué blanc, penderie + tiroirs", seller:seller._id, isActive:true },
    { name:"Table de chevet simple",       category:"chambre", qualityLevel:"économique",    price:180,   description:"Chevet 1 tiroir, décor bois", seller:seller._id, isActive:true },
    { name:"Table de chevet avec LED",     category:"chambre", qualityLevel:"standard",      price:480,   description:"Chevet design, prise USB intégrée", seller:seller._id, isActive:true },
    { name:"Matelas mousse 140x190",       category:"chambre", qualityLevel:"économique",    price:350,   description:"Matelas mousse haute densité 20cm", seller:seller._id, isActive:true },
    { name:"Matelas ressorts ensachés",    category:"chambre", qualityLevel:"standard",      price:1200,  description:"Matelas 160x200, 7 zones de confort", seller:seller._id, isActive:true },
    { name:"Matelas latex naturel",        category:"chambre", qualityLevel:"haut de gamme", price:3800,  description:"Matelas latex 100% naturel, 25cm", seller:seller._id, isActive:true },

    // ────── CUISINE ──────
    { name:"Cuisine équipée 3m linéaires", category:"cuisine", qualityLevel:"économique",    price:4500,  description:"Caisson MDF, plan de travail stratifié, évier inox", seller:seller._id, isActive:true },
    { name:"Cuisine équipée 4m complète",  category:"cuisine", qualityLevel:"standard",      price:9500,  description:"Cuisine avec électroménager : réfrigérateur, four, hotte", seller:seller._id, isActive:true },
    { name:"Cuisine îlot central",         category:"cuisine", qualityLevel:"haut de gamme", price:22000, description:"Cuisine avec îlot, plan granit, électroménager Bosch", seller:seller._id, isActive:true },
    { name:"Réfrigérateur 300L",           category:"cuisine", qualityLevel:"économique",    price:1200,  description:"Réfrigérateur combiné A+, blanc", seller:seller._id, isActive:true },
    { name:"Réfrigérateur américain",      category:"cuisine", qualityLevel:"haut de gamme", price:4500,  description:"Réfrigérateur américain Samsung, distributeur eau", seller:seller._id, isActive:true },
    { name:"Cuisinière à gaz 60cm",        category:"cuisine", qualityLevel:"économique",    price:650,   description:"Cuisinière 4 feux + four, blanc", seller:seller._id, isActive:true },
    { name:"Piano de cuisson 90cm",        category:"cuisine", qualityLevel:"haut de gamme", price:5500,  description:"Piano de cuisson Falcon, 5 feux gaz + électrique", seller:seller._id, isActive:true },
    { name:"Table de cuisine 4 personnes", category:"cuisine", qualityLevel:"économique",    price:480,   description:"Table extensible + 4 chaises, MDF blanc", seller:seller._id, isActive:true },
    { name:"Table salle à manger 6P",      category:"cuisine", qualityLevel:"standard",      price:1800,  description:"Table en verre + 6 chaises rembourrées", seller:seller._id, isActive:true },

    // ────── SALLE DE BAIN ──────
    { name:"Pack salle de bain basique",   category:"salle_de_bain", qualityLevel:"économique",    price:1800,  description:"Lavabo + WC + douche italienne + accessoires", seller:seller._id, isActive:true },
    { name:"Salle de bain complète",       category:"salle_de_bain", qualityLevel:"standard",      price:4500,  description:"Baignoire encastrée + douche + double vasque", seller:seller._id, isActive:true },
    { name:"Salle de bain spa",            category:"salle_de_bain", qualityLevel:"haut de gamme", price:12000, description:"Baignoire balnéo + hammam + douche à pluie + jacuzzi", seller:seller._id, isActive:true },
    { name:"Meuble sous-vasque 80cm",      category:"salle_de_bain", qualityLevel:"économique",    price:450,   description:"Meuble sous-vasque avec miroir", seller:seller._id, isActive:true },
    { name:"Meuble double vasque 120cm",   category:"salle_de_bain", qualityLevel:"standard",      price:1400,  description:"Meuble laqué blanc, double vasque encastrée", seller:seller._id, isActive:true },
    { name:"Robinetterie chromée",         category:"salle_de_bain", qualityLevel:"économique",    price:120,   description:"Mitigeur lavabo + douche, chromé standard", seller:seller._id, isActive:true },
    { name:"Robinetterie design or",       category:"salle_de_bain", qualityLevel:"haut de gamme", price:950,   description:"Mitigeur design, finition or brossé", seller:seller._id, isActive:true },

    // ────── BUREAU ──────
    { name:"Bureau simple 120cm",          category:"bureau", qualityLevel:"économique",    price:320,   description:"Bureau MDF blanc, 2 tiroirs", seller:seller._id, isActive:true },
    { name:"Bureau en L 160cm",            category:"bureau", qualityLevel:"standard",      price:1100,  description:"Bureau angle, caisson de rangement, décor bois", seller:seller._id, isActive:true },
    { name:"Bureau direction en cuir",     category:"bureau", qualityLevel:"haut de gamme", price:4500,  description:"Bureau direction en cuir et verre trempé", seller:seller._id, isActive:true },
    { name:"Chaise de bureau tissu",       category:"bureau", qualityLevel:"économique",    price:280,   description:"Chaise réglable, dossier résille", seller:seller._id, isActive:true },
    { name:"Fauteuil ergonomique",         category:"bureau", qualityLevel:"standard",      price:950,   description:"Fauteuil ergonomique, accoudoirs réglables", seller:seller._id, isActive:true },
    { name:"Bibliothèque bureau 5 cases",  category:"bureau", qualityLevel:"standard",      price:680,   description:"Bibliothèque 5 cases bois massif huilé", seller:seller._id, isActive:true },

    // ────── AUTRE (Équipements généraux) ──────
    { name:"Climatiseur split 12000 BTU",  category:"autre", qualityLevel:"économique",    price:950,   description:"Climatiseur réversible chaud/froid, A+", seller:seller._id, isActive:true },
    { name:"Climatiseur inverter 18000",   category:"autre", qualityLevel:"standard",      price:2200,  description:"Climatiseur inverter, A+++, télécommande", seller:seller._id, isActive:true },
    { name:"Chauffe-eau électrique 100L",  category:"autre", qualityLevel:"économique",    price:380,   description:"Chauffe-eau électrique, protection anti-corrosion", seller:seller._id, isActive:true },
    { name:"Chauffe-eau thermodynamique",  category:"autre", qualityLevel:"haut de gamme", price:2800,  description:"Pompe à chaleur, économie 75% énergie", seller:seller._id, isActive:true },
    { name:"Panneau solaire 300W",         category:"autre", qualityLevel:"standard",      price:950,   description:"Panneau photovoltaïque, garantie 25 ans", seller:seller._id, isActive:true },
    { name:"Portail motorisé",             category:"autre", qualityLevel:"standard",      price:3500,  description:"Portail aluminium coulissant, motorisation incluse", seller:seller._id, isActive:true },
    { name:"Alarme maison sans fil",       category:"autre", qualityLevel:"standard",      price:1200,  description:"Système alarme WiFi, détecteurs + sirène", seller:seller._id, isActive:true },
    { name:"Luminaires LED salon",         category:"autre", qualityLevel:"économique",    price:450,   description:"Pack 5 spots + plafonnier LED, 6000K", seller:seller._id, isActive:true },
    { name:"Luminaires design",            category:"autre", qualityLevel:"haut de gamme", price:3800,  description:"Lustre cristal + appliques + spots encastrés", seller:seller._id, isActive:true },
  ];

  await Furniture.insertMany(items);
  console.log(`   ✅ ${items.length} produits insérés`);
}

// ============================================================
// 3. ANNONCES TERRAINS PAR RÉGION
// ============================================================
async function seedTerrains() {
  await Terrain.deleteMany({});
  console.log("🏗️ Insertion des terrains...");

  let seller = await User.findOne({ role: "terrain_seller" });
  if (!seller) {
    const bcrypt = require("bcryptjs");
    seller = await User.create({
      name:     "Agence Immobilière Tunisie",
      email:    "agence@smartbuild.tn",
      password: await bcrypt.hash("Agence123!", 10),
      role:     "terrain_seller",
    });
    console.log("   👤 Vendeur terrain créé");
  }

  const terrains = [
    // TUNIS & GRAND TUNIS
    { title:"Terrain constructible La Marsa",     region:"Tunis",     surface:300, pricePerM2:2500, description:"Terrain de 300m², zone résidentielle, toutes commodités", location:{ type:"Point", coordinates:[10.3236, 36.8878] }, isAvailable:true, seller:seller._id },
    { title:"Terrain résidentiel El Menzah",      region:"Tunis",     surface:450, pricePerM2:1800, description:"Zone calme, vis-à-vis, titre foncier", location:{ type:"Point", coordinates:[10.1972, 36.8528] }, isAvailable:true, seller:seller._id },
    { title:"Terrain 500m² Cité Ettahrir",        region:"Tunis",     surface:500, pricePerM2:1200, description:"Terrain plat, accès direct route principale", location:{ type:"Point", coordinates:[10.1658, 36.8188] }, isAvailable:true, seller:seller._id },
    { title:"Terrain Ariana Soghra",              region:"Ariana",    surface:400, pricePerM2:900,  description:"Zone villa, électricité et eau disponibles", location:{ type:"Point", coordinates:[10.1956, 36.8625] }, isAvailable:true, seller:seller._id },
    { title:"Terrain Ben Arous résidentiel",      region:"Ben Arous", surface:350, pricePerM2:750,  description:"Quartier calme, proche école et commerces", location:{ type:"Point", coordinates:[10.2275, 36.7531] }, isAvailable:true, seller:seller._id },

    // NORD
    { title:"Terrain vue mer Bizerte",            region:"Bizerte",   surface:600, pricePerM2:650,  description:"Vue mer dégagée, zone résidentielle", location:{ type:"Point", coordinates:[9.8739, 37.2744] }, isAvailable:true, seller:seller._id },
    { title:"Terrain agricole Béja",              region:"Béja",      surface:2000,pricePerM2:120,  description:"Terrain agricole fertile, puits", location:{ type:"Point", coordinates:[9.1817, 36.7256] }, isAvailable:true, seller:seller._id },
    { title:"Terrain résidentiel Nabeul",         region:"Nabeul",    surface:500, pricePerM2:550,  description:"Zone villa, proche plage 2km", location:{ type:"Point", coordinates:[10.7357, 36.4513] }, isAvailable:true, seller:seller._id },

    // CAP BON & SAHEL
    { title:"Terrain Hammamet zone villa",        region:"Nabeul",    surface:800, pricePerM2:800,  description:"Zone touristique, permis de construire disponible", location:{ type:"Point", coordinates:[10.6131, 36.3975] }, isAvailable:true, seller:seller._id },
    { title:"Terrain Sousse Khzema",              region:"Sousse",    surface:450, pricePerM2:1200, description:"Quartier résidentiel, toutes facilités", location:{ type:"Point", coordinates:[10.6346, 35.8245] }, isAvailable:true, seller:seller._id },
    { title:"Terrain Monastir Khnis",             region:"Monastir",  surface:600, pricePerM2:1400, description:"Vue mer partielle, titre foncier propre", location:{ type:"Point", coordinates:[10.8113, 35.7643] }, isAvailable:true, seller:seller._id },
    { title:"Terrain Mahdia bord de mer",         region:"Mahdia",    surface:500, pricePerM2:600,  description:"100m de la plage, eau et électricité", location:{ type:"Point", coordinates:[11.0622, 35.5047] }, isAvailable:true, seller:seller._id },

    // SFAX & CENTRE
    { title:"Terrain Sfax Gremda",                region:"Sfax",      surface:600, pricePerM2:500,  description:"Zone villa, accès asphalté", location:{ type:"Point", coordinates:[10.7128, 34.7478] }, isAvailable:true, seller:seller._id },
    { title:"Terrain Sfax centre urbain",         region:"Sfax",      surface:300, pricePerM2:900,  description:"Centre ville, idéal construction R+2", location:{ type:"Point", coordinates:[10.7603, 34.7406] }, isAvailable:true, seller:seller._id },
    { title:"Terrain Kairouan ville",             region:"Kairouan",  surface:400, pricePerM2:250,  description:"Zone résidentielle, eau et électricité", location:{ type:"Point", coordinates:[10.0963, 35.6781] }, isAvailable:true, seller:seller._id },

    // SUD
    { title:"Terrain Gabès zone industrielle",    region:"Gabès",     surface:1000,pricePerM2:200,  description:"Terrain plat, accès route nationale", location:{ type:"Point", coordinates:[10.0975, 33.8881] }, isAvailable:true, seller:seller._id },
    { title:"Terrain Médenine résidentiel",       region:"Médenine",  surface:500, pricePerM2:200,  description:"Quartier calme, permis de construire", location:{ type:"Point", coordinates:[10.5055, 33.3549] }, isAvailable:true, seller:seller._id },
    { title:"Terrain Djerba zone touristique",    region:"Médenine",  surface:700, pricePerM2:450,  description:"Zone Midoun Djerba, accès mer 3km", location:{ type:"Point", coordinates:[10.9978, 33.8076] }, isAvailable:true, seller:seller._id },
    { title:"Terrain Tozeur palmeraie",           region:"Tozeur",    surface:400, pricePerM2:150,  description:"Bordure de palmeraie, vue oasis", location:{ type:"Point", coordinates:[8.1337, 33.9197] }, isAvailable:true, seller:seller._id },
    { title:"Terrain Gafsa résidentiel",          region:"Gafsa",     surface:500, pricePerM2:180,  description:"Quartier El Ksar, commodités proches", location:{ type:"Point", coordinates:[8.7757, 34.4311] }, isAvailable:true, seller:seller._id },

    // 4 NOUVEAUX TERRAINS
    { title:"Terrain Manouba centre",             region:"Tunis",     surface:250, pricePerM2:1100, description:"Plein centre de Manouba, transport en commun", location:{ type:"Point", coordinates:[10.1284, 36.8108] }, isAvailable:true, seller:seller._id },
    { title:"Terrain Jendouba campagne",          region:"Jendouba",  surface:1200,pricePerM2:150,  description:"Zone campagne verdoyante, vue montagne", location:{ type:"Point", coordinates:[8.7803, 36.5019] }, isAvailable:true, seller:seller._id },
    { title:"Terrain Sfax El Abadia",            region:"Sfax",      surface:450, pricePerM2:650,  description:"Quartier résidentiel calme, proche université", location:{ type:"Point", coordinates:[10.7200, 34.7550] }, isAvailable:true, seller:seller._id },
    { title:"Terrain Kasserine montagne",         region:"Kasserine", surface:800, pricePerM2:180,  description:"Zone montagneuse, air pur, grand terrain", location:{ type:"Point", coordinates:[8.8360, 35.1676] }, isAvailable:true, seller:seller._id },
  ];

  await Terrain.insertMany(terrains);
  console.log(`   ✅ ${terrains.length} terrains insérés`);
}