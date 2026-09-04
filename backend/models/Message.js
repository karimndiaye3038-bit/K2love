const mongoose = require("mongoose");

// ========================================
// SCHEMA MESSAGE
// ========================================

const messageSchema = new mongoose.Schema(
  {
    // ======================================
    // COUPLE
    // ======================================

    couple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Couple",
      required: true,
    },

    // ======================================
    // EXPÉDITEUR
    // ======================================

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ======================================
    // CONTENU
    // ======================================

    content: {
      type: String,
      default: "",
      trim: true,
    },

    // ======================================
    // TYPE
    // ======================================

    type: {
      type: String,

      enum: [
        "text",
        "image",
        "video",
        "audio",
      ],

      default: "text",
    },

    // ======================================
    // FICHIER
    // ======================================

    fileUrl: {
      type: String,
      default: null,
    },

    // ======================================
    // AUDIO
    // ======================================

    audioUrl: {
      type: String,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

// ========================================
// EXPORT
// ========================================

module.exports =
  mongoose.model(
    "Message",
    messageSchema
  );