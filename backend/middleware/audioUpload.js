const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ========================================
// DOSSIER DES AUDIOS
// ========================================

const uploadDir = path.join(
  __dirname,
  "../uploads/audio"
);

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// ========================================
// CONFIGURATION MULTER
// ========================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const extension =
      path.extname(file.originalname) || ".webm";

    const filename =
      `audio-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

    cb(null, filename);
  },
});

// ========================================
// FILTRE AUDIO
// ========================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "audio/webm",
    "audio/ogg",
    "audio/wav",
    "audio/mpeg",
    "audio/mp4",
    "audio/x-m4a",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Format audio non autorisé."
      ),
      false
    );
  }
};

// ========================================
// UPLOAD
// ========================================

const uploadAudio = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// ========================================
// EXPORT
// ========================================

module.exports = uploadAudio;