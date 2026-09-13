const Message = require("../models/Message");
const User = require("../models/User");

// =====================================================
// RÉCUPÉRER LES MESSAGES
// =====================================================

const getMessages = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Utilisateur introuvable.",
      });
    }

    if (!user.couple) {
      return res.status(400).json({
        success: false,
        message:
          "Vous n'avez pas encore de partenaire.",
      });
    }

    const messages =
      await Message.find({
        couple: user.couple,
      })
        .populate(
          "sender",
          "name email avatar"
        )
        .sort({
          createdAt: 1,
        });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(
      "❌ Erreur récupération messages :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Erreur serveur.",
      error: error.message,
    });
  }
};

// =====================================================
// MESSAGE TEXTE
// =====================================================

const sendMessage = async (
  req,
  res
) => {
  try {
    const { content } =
      req.body;

    const user =
      await User.findById(
        req.user.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Utilisateur introuvable.",
      });
    }

    if (!user.couple) {
      return res.status(400).json({
        success: false,
        message:
          "Vous devez d'abord connecter votre partenaire.",
      });
    }

    if (
      !content ||
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Le message est vide.",
      });
    }

    const message =
      await Message.create({
        couple: user.couple,

        sender: user._id,

        content:
          content.trim(),

        type: "text",

        fileUrl: null,

        audioUrl: null,
      });

    const populatedMessage =
      await Message.findById(
        message._id
      ).populate(
        "sender",
        "name email avatar"
      );

    const io =
      req.app.get("io");

    if (io) {
      io.to(
        user.couple.toString()
      ).emit(
        "newMessage",
        populatedMessage
      );
    }

    return res.status(201).json({
      success: true,
      message:
        populatedMessage,
    });
  } catch (error) {
    console.error(
      "❌ Erreur envoi message :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Erreur serveur.",
      error: error.message,
    });
  }
};

// =====================================================
// PHOTO / VIDEO / AUDIO
// =====================================================

const sendMediaMessage =
  async (req, res) => {
    try {
      console.log(
        "================================"
      );

      console.log(
        "📁 NOUVEL UPLOAD"
      );

      console.log(
        "================================"
      );

      console.log(
        "📁 req.file :",
        req.file
      );

      console.log(
        "📦 req.body :",
        req.body
      );

      // =============================================
      // UTILISATEUR
      // =============================================

      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "Utilisateur introuvable.",
        });
      }

      // =============================================
      // COUPLE
      // =============================================

      if (!user.couple) {
        return res.status(400).json({
          success: false,
          message:
            "Vous devez d'abord connecter votre partenaire.",
        });
      }

      // =============================================
      // FICHIER
      // =============================================

      if (!req.file) {
        console.error(
          "❌ Aucun fichier reçu"
        );

        return res.status(400).json({
          success: false,
          message:
            "Aucun fichier reçu.",
        });
      }

      // =============================================
      // MIME
      // =============================================

      const mimeType =
        req.file.mimetype || "";

      let messageType =
        null;

      if (
        mimeType.startsWith(
          "image/"
        )
      ) {
        messageType =
          "image";
      } else if (
        mimeType.startsWith(
          "video/"
        )
      ) {
        messageType =
          "video";
      } else if (
        mimeType.startsWith(
          "audio/"
        )
      ) {
        messageType =
          "audio";
      }

      if (!messageType) {
        return res.status(400).json({
          success: false,
          message:
            "Type de fichier non supporté.",
        });
      }

      // =============================================
      // URL
      // =============================================

      const fileUrl =
        `/uploads/media/${req.file.filename}`;

      console.log(
        "📎 fileUrl :",
        fileUrl
      );

      console.log(
        "🎞️ type :",
        messageType
      );

      // =============================================
      // MESSAGE
      // =============================================

      const message =
        await Message.create({
          couple: user.couple,

          sender: user._id,

          content: "",

          type: messageType,

          fileUrl,

          audioUrl:
            messageType ===
            "audio"
              ? fileUrl
              : null,
        });

      // =============================================
      // POPULATE
      // =============================================

      const populatedMessage =
        await Message.findById(
          message._id
        ).populate(
          "sender",
          "name email avatar"
        );

      // =============================================
      // SOCKET
      // =============================================

      const io =
        req.app.get("io");

      if (io) {
        io.to(
          user.couple.toString()
        ).emit(
          "newMessage",
          populatedMessage
        );
      }

      // =============================================
      // RÉPONSE
      // =============================================

      return res.status(201).json({
        success: true,
        message:
          populatedMessage,
      });
    } catch (error) {
      console.error(
        "❌ ERREUR ENVOI MÉDIA"
      );

      console.error(
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Erreur serveur lors de l'envoi du fichier.",
        error:
          error.message,
      });
    }
  };

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getMessages,
  sendMessage,
  sendMediaMessage,
};