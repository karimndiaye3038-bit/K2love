const express = require("express");

const router = express.Router();

const {
  getMemories,
  createMemory,
  deleteMemory,
} = require("../controllers/memoryController");

const authMiddleware = require("../middleware/authMiddleware");

// Récupérer les souvenirs du couple
router.get("/", authMiddleware, getMemories);

// Ajouter un souvenir
router.post("/", authMiddleware, createMemory);

// Supprimer un souvenir
router.delete("/:id", authMiddleware, deleteMemory);

module.exports = router;
