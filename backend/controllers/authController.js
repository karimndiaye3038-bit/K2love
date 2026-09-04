
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ========================================
// INSCRIPTION
// ========================================

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérifier les champs
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires.",
      });
    }

    // Vérifier la longueur du mot de passe
    if (password.length < 6) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 6 caractères.",
      });
    }

    // Nettoyer les données
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Cette adresse email est déjà utilisée.",
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Réponse
    res.status(201).json({
      message: "Compte K2Love créé avec succès ❤️",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Erreur inscription :", error);

    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};


// ========================================
// CONNEXION
// ========================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier les champs
    if (!email || !password) {
      return res.status(400).json({
        message: "L'email et le mot de passe sont obligatoires.",
      });
    }

    // Nettoyer l'email
    const normalizedEmail = email.trim().toLowerCase();

    // Chercher l'utilisateur
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect.",
      });
    }

    // Vérifier le mot de passe
    const passwordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect.",
      });
    }

    // Vérifier JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET est manquant dans .env");

      return res.status(500).json({
        message: "Configuration serveur incorrecte.",
      });
    }

    // Créer le JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Réponse
    res.status(200).json({
      message: "Connexion réussie ❤️",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        partner: user.partner,
        couple: user.couple,
      },
    });

  } catch (error) {
    console.error("Erreur connexion :", error);

    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};


// ========================================
// EXPORT
// ========================================

module.exports = {
  register,
  login,
};

