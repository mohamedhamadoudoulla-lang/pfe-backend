const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Charger les variables .env
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth",        require("./routes/authRoutes"));
app.use("/api/houses",      require("./routes/houseRoutes"));
app.use("/api/engineers",   require("./routes/engineerRoutes"));
app.use("/api/terrains",    require("./routes/terrainRoutes"));
app.use("/api/equipment", require("./routes/equipmentRoutes"));
app.use("/api/estimations", require("./routes/estimationRoutes"));
// Ajoute ces lignes après les routes existantes
app.use("/api/projects",      require("./routes/projectRoutes"));
app.use("/api/applications",  require("./routes/applicationRoutes"));
app.use("/api/messages",      require("./routes/messageRoutes"));
app.use("/api/furniture",     require("./routes/furnitureRoutes"));
app.use("/api/admin",         require("./routes/adminRoutes"));
app.use("/api/region-prices", require("./routes/regionPriceRoutes"));
app.use("/api/pricing",        require("./routes/pricingRoutes"));
app.use("/api/marketplace",    require("./routes/marketplaceRoutes"));
app.use("/api",                require("./routes/materiauxRoutes"));
app.get("/", (req, res) => {
  res.json({ message: "🏠 SmartBuild API opérationnelle" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});