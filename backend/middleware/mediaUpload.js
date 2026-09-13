const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =====================================================
// DOSSIER UPLOAD
// =====================================================

const uploadDir = path.join(
  __dirname,
  "../uploads/media"
);

// Créer automatiquement le dossier
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// =====================================================
// STORAGE
// =====================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const filename =
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

    cb(null, filename);
  },
});

// =====================================================
// FILTRE
// =====================================================

const fileFilter = (req, file, cb) => {
  const mimeType =
    file.mimetype || "";

  if (
    mimeType.startsWith("image/") ||
    mimeType.startsWith("video/") ||
    mimeType.startsWith("audio/")
  ) {
    cb(null, true);
    return;
  }

  cb(
    new Error(
      "Type de fichier non supporté."
    )
  );
};

// =====================================================
// MULTER
// =====================================================

const uploadMedia = multer({
  storage,

  fileFilter,

  limits: {
    fileSize:
      50 * 1024 * 1024,
  },
});

module.exports = uploadMedia;