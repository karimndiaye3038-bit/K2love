require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const { Server } = require("socket.io");

// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/auth.routes");
const calendarRoutes = require("./routes/calendar.routes");
const invitationRoutes = require("./routes/invitation.routes");
const messageRoutes = require("./routes/message.routes");

// =====================================================
// APPLICATION
// =====================================================

const app = express();
const server = http.createServer(app);

// =====================================================
// CONFIGURATION
// =====================================================

const PORT = process.env.PORT || 5000;

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5174";

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Autoriser les requêtes sans origin
      // Exemple : Postman
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(
        "❌ Origine CORS refusée :",
        origin
      );

      return callback(
        new Error(
          `Origine non autorisée : ${origin}`
        )
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// =====================================================
// MIDDLEWARES
// =====================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// FICHIERS UPLOADÉS
// =====================================================

// Les fichiers seront accessibles avec :
// http://localhost:5000/uploads/...

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// =====================================================
// ROUTE PRINCIPALE
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "K2Love Backend fonctionne ❤️",
  });
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API opérationnelle",
  });
});

// =====================================================
// SOCKET.IO
// =====================================================

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ],

    credentials: true,
  },
});

// Permettre aux controllers d'utiliser Socket.IO

app.set("io", io);

// =====================================================
// SOCKET.IO CONNECTION
// =====================================================

io.on("connection", (socket) => {
  console.log(
    "🔌 Socket connecté :",
    socket.id
  );

  // ===================================================
  // REJOINDRE LE COUPLE
  // ===================================================

  socket.on("joinCouple", (coupleId) => {
    if (!coupleId) {
      console.log(
        "⚠️ Aucun coupleId envoyé par",
        socket.id
      );

      return;
    }

    const room = String(coupleId);

    socket.join(room);

    socket.coupleId = room;

    console.log(
      `❤️ Socket ${socket.id} a rejoint le couple ${room}`
    );
  });

  // ===================================================
  // QUITTER LE COUPLE
  // ===================================================

  socket.on("leaveCouple", (coupleId) => {
    if (!coupleId) {
      return;
    }

    const room = String(coupleId);

    socket.leave(room);

    console.log(
      `👋 Socket ${socket.id} a quitté le couple ${room}`
    );
  });

  // ===================================================
  // MESSAGE EN TEMPS RÉEL
  // ===================================================

  socket.on("sendMessage", (message) => {
    if (!message) {
      return;
    }

    if (!message.couple) {
      return;
    }

    const room = String(message.couple);

    io.to(room).emit(
      "newMessage",
      message
    );
  });

  // ===================================================
  // DÉCONNEXION
  // ===================================================

  socket.on("disconnect", (reason) => {
    console.log(
      `🔌 Socket déconnecté ${socket.id} : ${reason}`
    );
  });
});

// =====================================================
// ROUTES API
// =====================================================

// -----------------------------------------------------
// AUTHENTIFICATION
// -----------------------------------------------------

app.use(
  "/api/auth",
  authRoutes
);

// -----------------------------------------------------
// CALENDRIER
// -----------------------------------------------------

app.use(
  "/api/calendar",
  calendarRoutes
);

// -----------------------------------------------------
// INVITATIONS
// -----------------------------------------------------

app.use(
  "/api/invitations",
  invitationRoutes
);

// -----------------------------------------------------
// MESSAGES
// -----------------------------------------------------

app.use(
  "/api/messages",
  messageRoutes
);

// =====================================================
// ROUTE 404
// =====================================================

app.use((req, res) => {
  console.log(
    `❌ Route introuvable : ${req.method} ${req.originalUrl}`
  );

  res.status(404).json({
    success: false,
    message:
      `Route introuvable : ${req.method} ${req.originalUrl}`,
  });
});

// =====================================================
// GESTION DES ERREURS
// =====================================================

app.use(
  (error, req, res, next) => {
    console.error(
      "❌ Erreur serveur :",
      error
    );

    // -----------------------------------------------
    // ERREUR CORS
    // -----------------------------------------------

    if (
      error.message &&
      error.message.includes(
        "Origine non autorisée"
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Origine CORS non autorisée.",
      });
    }

    // -----------------------------------------------
    // ERREUR UPLOAD
    // -----------------------------------------------

    if (
      error.code === "LIMIT_FILE_SIZE"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Fichier trop volumineux.",
      });
    }

    // -----------------------------------------------
    // ERREUR GÉNÉRALE
    // -----------------------------------------------

    return res.status(500).json({
      success: false,
      message: "Erreur serveur.",
    });
  }
);

// =====================================================
// CONNEXION MONGODB
// =====================================================

const connectDatabase = async () => {
  try {
    // -------------------------------------------------
    // Vérifier MONGO_URI
    // -------------------------------------------------

    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI est manquant dans le fichier .env"
      );
    }

    // -------------------------------------------------
    // Connexion MongoDB
    // -------------------------------------------------

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "🟢 MongoDB connecté"
    );

    // -------------------------------------------------
    // Démarrage serveur
    // -------------------------------------------------

    server.listen(
      PORT,
      () => {
        console.log(
          `🚀 Serveur lancé sur http://localhost:${PORT}`
        );

        console.log(
          `🌐 Frontend autorisé : ${FRONTEND_URL}`
        );

        console.log(
          `🔌 Socket.IO disponible sur http://localhost:${PORT}`
        );

        console.log(
          "📅 Route calendrier : /api/calendar"
        );

        console.log(
          "🔐 Route authentification : /api/auth"
        );

        console.log(
          "💑 Route invitations : /api/invitations"
        );

        console.log(
          "💬 Route messages : /api/messages"
        );

        console.log(
          "📁 Dossier uploads : /uploads"
        );
      }
    );
  } catch (error) {
    console.error(
      "❌ Erreur connexion MongoDB :",
      error.message
    );

    process.exit(1);
  }
};

// =====================================================
// START
// =====================================================

connectDatabase();

// =====================================================
// ERREURS NON GÉRÉES
// =====================================================

process.on(
  "unhandledRejection",
  (error) => {
    console.error(
      "❌ Unhandled rejection :",
      error
    );
  }
);

process.on(
  "uncaughtException",
  (error) => {
    console.error(
      "❌ Uncaught exception :",
      error
    );
  }
);