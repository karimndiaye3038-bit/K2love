const express = require("express");

const router = express.Router();

const {
  getMessages,
  sendMessage,
  sendMediaMessage,
} = require("../controllers/messageController");

const protect = require("../middleware/authMiddleware");

const uploadMedia = require("../middleware/mediaUpload");

// ========================================
// RÉCUPÉRER LES MESSAGES
// ========================================

router.get(
  "/",
  protect,
  getMessages
);

// ========================================
// ENVOYER UN MESSAGE TEXTE
// ========================================

router.post(
  "/",
  protect,
  sendMessage
);

// ========================================
// ENVOYER PHOTO / VIDÉO / AUDIO
// ========================================

router.post(
  "/media",
  protect,
  uploadMedia.single("file"),
  sendMediaMessage
);

module.exports = router;