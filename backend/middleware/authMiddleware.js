const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Accès refusé. Token manquant.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      id: decoded.id,
    };

    next();

  } catch (error) {
    console.error("Erreur authentification :", error);

    return res.status(401).json({
      message: "Token invalide ou expiré.",
    });
  }
};

module.exports = protect;