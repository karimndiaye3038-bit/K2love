const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ========================================
// DOSSIER UPLOADS
// ========================================

const uploadDir = path.join(
  __dirname,
  "../uploads/media"
);

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// ========================================
// STOCKAGE
// ========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const name =
      path
        .basename(
          file.originalname,
          extension
        )
        .replace(/[^a-zA-Z0-9]/g, "-")
        .toLowerCase();

    const uniqueName = `${Date.now()}-${name}${extension}`;

    cb(null, uniqueName);
  },
});

// ========================================
// FILTRE
// ========================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",

    // Vidéos
    "video/mp4",
    "video/webm",
    "video/quicktime",

    // Audio
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/webm",
    "audio/mp4",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Type de fichier non autorisé."
      ),
      false
    );
  }
};

// ========================================
// MULTER
// ========================================

const uploadMedia = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
});

module.exports = uploadMedia;