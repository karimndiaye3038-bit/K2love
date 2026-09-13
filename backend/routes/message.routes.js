const express = require("express");

const router =
  express.Router();

const {
  getMessages,
  sendMessage,
  sendMediaMessage,
} =
  require("../controllers/messageController");

const protect =
  require("../middleware/authMiddleware");

const uploadMedia =
  require("../middleware/mediaUpload");

// =====================================================
// MESSAGES
// =====================================================

router.get(
  "/",
  protect,
  getMessages
);

// =====================================================
// TEXTE
// =====================================================

router.post(
  "/",
  protect,
  sendMessage
);

// =====================================================
// PHOTO / VIDEO / AUDIO
// =====================================================

router.post(
  "/media",
  protect,
  uploadMedia.single("file"),
  sendMediaMessage
);

module.exports = router;