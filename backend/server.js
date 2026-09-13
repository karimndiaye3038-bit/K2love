require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const { Server } = require("socket.io");

// =====================================================
// MODELS
// =====================================================

const User = require("./models/User");

// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/auth.routes");
const calendarRoutes = require("./routes/calendar.routes");
const invitationRoutes = require("./routes/invitation.routes");
const messageRoutes = require("./routes/message.routes");
const memoryRoutes = require("./routes/memory.routes");

// =====================================================
// APP
// =====================================================

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "http://localhost:5174";

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5173",
  "https://k2love.vercel.app",
];

if (FRONTEND_URL && !allowedOrigins.includes(FRONTEND_URL)) {
  allowedOrigins.push(FRONTEND_URL);
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS refusé :", origin);

      return callback(
        new Error(`Origine non autorisée : ${origin}`)
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
// MIDDLEWARE
// =====================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// UPLOADS
// =====================================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// =====================================================
// ROUTES
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/calendar",
  calendarRoutes
);

app.use(
  "/api/invitations",
  invitationRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);

app.use(
  "/api/memories",
  memoryRoutes
);

// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "K2Love Backend fonctionne ❤️",
  });
});

// =====================================================
// HEALTH
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
    methods: ["GET", "POST"],
    credentials: true,
  },

  transports: ["websocket", "polling"],
});

app.set("io", io);

// =====================================================
// UTILISATEURS CONNECTÉS
// =====================================================

// userId => socketId
const connectedUsers = new Map();

// =====================================================
// SOCKET CONNECTION
// =====================================================

io.on("connection", (socket) => {
  console.log(
    "🔌 Socket connecté :",
    socket.id
  );

  // ===================================================
  // REGISTER USER
  // ===================================================

  socket.on("registerUser", async (userId) => {
    try {
      if (!userId) {
        console.log(
          "⚠️ registerUser sans userId"
        );

        return;
      }

      const id = String(userId);

      // Vérification MongoDB
      const user = await User.findById(id)
        .select("_id partner couple")
        .lean();

      if (!user) {
        console.log(
          "❌ Utilisateur introuvable :",
          id
        );

        return;
      }

      // Si une ancienne socket existe,
      // on la remplace par la nouvelle.
      const oldSocketId =
        connectedUsers.get(id);

      if (
        oldSocketId &&
        oldSocketId !== socket.id
      ) {
        const oldSocket =
          io.sockets.sockets.get(
            oldSocketId
          );

        if (oldSocket) {
          oldSocket.disconnect(true);
        }
      }

      connectedUsers.set(
        id,
        socket.id
      );

      socket.userId = id;

      socket.partnerId = user.partner
        ? String(user.partner)
        : null;

      socket.coupleId = user.couple
        ? String(user.couple)
        : null;

      console.log(
        `👤 User ${id} connecté => ${socket.id}`
      );

      console.log(
        `❤️ Partner => ${
          socket.partnerId || "aucun"
        }`
      );

      console.log(
        `💑 Couple => ${
          socket.coupleId || "aucun"
        }`
      );

      // Retour au frontend
      socket.emit("user-registered", {
        userId: id,
        partnerId:
          socket.partnerId,
        coupleId:
          socket.coupleId,
      });
    } catch (error) {
      console.error(
        "❌ registerUser :",
        error
      );
    }
  });

  // ===================================================
  // JOIN COUPLE
  // ===================================================

  socket.on(
    "joinCouple",
    (coupleId) => {
      if (!coupleId) {
        return;
      }

      const room = String(coupleId);

      socket.join(room);

      socket.coupleId = room;

      console.log(
        `❤️ ${socket.id} rejoint le couple ${room}`
      );
    }
  );

  // ===================================================
  // LEAVE COUPLE
  // ===================================================

  socket.on(
    "leaveCouple",
    (coupleId) => {
      if (!coupleId) {
        return;
      }

      socket.leave(
        String(coupleId)
      );
    }
  );

  // ===================================================
  // MESSAGE
  // ===================================================

  socket.on(
    "sendMessage",
    (message) => {
      if (
        !message ||
        !message.couple
      ) {
        return;
      }

      io.to(
        String(message.couple)
      ).emit(
        "newMessage",
        message
      );
    }
  );

  // ===================================================
  // APPEL
  // ===================================================

  socket.on(
    "call-user",
    ({
      to,
      from,
      type,
      offer,
    } = {}) => {
      try {
        if (!to || !offer) {
          console.log(
            "⚠️ Appel invalide"
          );

          return;
        }

        const targetUserId =
          String(to);

        const targetSocket =
          connectedUsers.get(
            targetUserId
          );

        if (!targetSocket) {
          console.log(
            `📵 User ${targetUserId} hors ligne`
          );

          socket.emit(
            "user-offline",
            {
              userId:
                targetUserId,
            }
          );

          return;
        }

        console.log(
          `📞 Appel ${from} -> ${targetUserId}`
        );

        io.to(
          targetSocket
        ).emit(
          "incoming-call",
          {
            from:
              String(from),
            type,
            offer,
          }
        );
      } catch (error) {
        console.error(
          "❌ call-user :",
          error
        );
      }
    }
  );

  // ===================================================
  // RÉPONSE APPEL
  // ===================================================

  socket.on(
    "answer-call",
    ({
      to,
      answer,
    } = {}) => {
      try {
        if (!to || !answer) {
          return;
        }

        const targetSocket =
          connectedUsers.get(
            String(to)
          );

        if (!targetSocket) {
          return;
        }

        console.log(
          `📞 Réponse appel -> ${to}`
        );

        io.to(
          targetSocket
        ).emit(
          "call-answered",
          {
            answer,
          }
        );
      } catch (error) {
        console.error(
          "❌ answer-call :",
          error
        );
      }
    }
  );

  // ===================================================
  // ICE CANDIDATE
  // ===================================================

  socket.on(
    "ice-candidate",
    ({
      to,
      candidate,
    } = {}) => {
      try {
        if (!to || !candidate) {
          return;
        }

        const targetSocket =
          connectedUsers.get(
            String(to)
          );

        if (!targetSocket) {
          return;
        }

        io.to(
          targetSocket
        ).emit(
          "ice-candidate",
          {
            candidate,
          }
        );
      } catch (error) {
        console.error(
          "❌ ice-candidate :",
          error
        );
      }
    }
  );

  // ===================================================
  // REFUSER
  // ===================================================

  socket.on(
    "reject-call",
    ({
      to,
    } = {}) => {
      if (!to) {
        return;
      }

      const targetSocket =
        connectedUsers.get(
          String(to)
        );

      if (!targetSocket) {
        return;
      }

      console.log(
        `❌ Appel refusé par ${socket.userId}`
      );

      io.to(
        targetSocket
      ).emit(
        "call-rejected"
      );
    }
  );

  // ===================================================
  // TERMINER APPEL
  // ===================================================

  socket.on(
    "end-call",
    ({
      to,
    } = {}) => {
      if (!to) {
        return;
      }

      const targetSocket =
        connectedUsers.get(
          String(to)
        );

      if (!targetSocket) {
        return;
      }

      console.log(
        `📴 Appel terminé par ${socket.userId}`
      );

      io.to(
        targetSocket
      ).emit(
        "call-ended"
      );
    }
  );

  // ===================================================
  // DISCONNECT
  // ===================================================

  socket.on(
    "disconnect",
    (reason) => {
      console.log(
        `🔌 Socket ${socket.id} déconnecté : ${reason}`
      );

      if (!socket.userId) {
        return;
      }

      const currentSocket =
        connectedUsers.get(
          socket.userId
        );

      // Important :
      // on ne supprime pas une nouvelle socket
      // si l'ancienne vient de se déconnecter.
      if (
        currentSocket ===
        socket.id
      ) {
        connectedUsers.delete(
          socket.userId
        );
      }
    }
  );
});

// =====================================================
// 404
// =====================================================

app.use(
  (req, res) => {
    console.log(
      `❌ Route introuvable : ${req.method} ${req.originalUrl}`
    );

    res.status(404).json({
      success: false,
      message:
        `Route introuvable : ${req.method} ${req.originalUrl}`,
    });
  }
);

// =====================================================
// ERROR HANDLER
// =====================================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "❌ Erreur serveur :",
      error
    );

    if (
      error.code ===
      "LIMIT_FILE_SIZE"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Fichier trop volumineux. Maximum 50 MB.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Erreur serveur.",
    });
  }
);

// =====================================================
// MONGODB
// =====================================================

const connectDatabase =
  async () => {
    try {
      if (
        !process.env.MONGO_URI
      ) {
        throw new Error(
          "MONGO_URI est manquant."
        );
      }

      await mongoose.connect(
        process.env.MONGO_URI
      );

      console.log(
        "🟢 MongoDB connecté"
      );

      server.listen(
        PORT,
        () => {
          console.log(
            `🚀 Serveur lancé sur le port ${PORT}`
          );

          console.log(
            "💬 Messages : /api/messages"
          );

          console.log(
            "📁 Uploads : /uploads"
          );

          console.log(
            "📞 Appels : WebRTC + Socket.IO"
          );
        }
      );
    } catch (error) {
      console.error(
        "❌ MongoDB :",
        error.message
      );

      process.exit(1);
    }
  };

connectDatabase();

// =====================================================
// PROCESS ERRORS
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
