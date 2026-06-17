const express = require("express");
const router  = express.Router();
const jwt     = require("jsonwebtoken");
const bcrypt  = require("bcryptjs");
const User    = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const axios = require("axios");


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ─── INSCRIPTION ───────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const ALLOWED_ROLES = ["user", "admin", "engineer", "terrain_seller", "equipment_seller"];
    const userRole = ALLOWED_ROLES.includes(role) ? role : "user";

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      isVerified: true,
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      message: "Compte créé avec succès !",
      needsVerification: false,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// ─── VÉRIFICATION EMAIL ─────────────────────────────────
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Email vérifié avec succès ! Vous pouvez maintenant vous connecter." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// ─── RENVOYER EMAIL DE VÉRIFICATION ────────────────────
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    if (user.isVerified) return res.status(400).json({ message: "Compte déjà vérifié" });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(email, user.name, verificationToken);
    res.json({ message: "Email de vérification renvoyé !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// ─── CONNEXION ─────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Connexion réussie",
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// ─── CONNEXION GOOGLE ──────────────────────────────────
router.post("/google", async (req, res) => {
  try {
    const { accessToken, role } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: "accessToken requis" });
    }

    const googleRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const { sub: googleId, email, name, picture } = googleRes.data;

    if (!email) {
      return res.status(400).json({ message: "Email non fourni par Google" });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true;
        await user.save();
      }
    } else {
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        googleId,
        avatar: picture,
        role: role || "user",
        isVerified: true,
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Connexion réussie",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      token,
    });
  } catch (error) {
    console.error("Google Auth Error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Erreur lors de la connexion Google",
      error: error.response?.data || error.message,
    });
  }
});

// ─── CONNEXION FACEBOOK ────────────────────────────────
router.post("/facebook", async (req, res) => {
  try {
    const { accessToken, role } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: "accessToken requis" });
    }

    const fbRes = await axios.get("https://graph.facebook.com/me", {
      params: { fields: "id,name,email,picture", access_token: accessToken },
    });
    const { id: facebookId, name, email } = fbRes.data;

    if (!email) {
      return res.status(400).json({ message: "L'email est requis depuis le compte Facebook" });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (!user.facebookId) {
        user.facebookId = facebookId;
        user.isVerified = true;
        await user.save();
      }
    } else {
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        facebookId,
        role: role || "user",
        isVerified: true,
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Connexion réussie",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error("Facebook Auth Error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Erreur lors de la connexion Facebook",
      error: error.response?.data || error.message,
    });
  }
});

// ─── MON PROFIL ────────────────────────────────────────
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

// ─── MODIFIER PROFIL ───────────────────────────────────
router.put("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const { name, phone, address, country } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (country) user.country = country;

    await user.save();
    res.json({ message: "Profil mis à jour", user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;