const Memory = require("../models/Memory");
const Couple = require("../models/Couple");

/**
 * Trouver le couple auquel appartient l'utilisateur
 */
const getUserCouple = async (userId) => {
  const couple = await Couple.findOne({
    $or: [
      { user1: userId },
      { user2: userId },
    ],
  });

  return couple;
};

/**
 * GET /api/memories
 * Récupérer tous les souvenirs du couple
 */
exports.getMemories = async (req, res) => {
  try {
    const userId = req.user.id;

    const couple = await getUserCouple(userId);

    if (!couple) {
      return res.status(404).json({
        message: "Vous n'êtes pas encore connecté à un partenaire.",
      });
    }

    const memories = await Memory.find({
      couple: couple._id,
    })
      .populate("createdBy", "name email")
      .sort({
        date: -1,
        createdAt: -1,
      });

    return res.status(200).json(memories);
  } catch (error) {
    console.error("Erreur récupération souvenirs :", error);

    return res.status(500).json({
      message: "Erreur serveur.",
      error: error.message,
    });
  }
};

/**
 * POST /api/memories
 * Ajouter un souvenir
 */
exports.createMemory = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      title,
      description,
      date,
      image,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Le titre du souvenir est obligatoire.",
      });
    }

    const couple = await getUserCouple(userId);

    if (!couple) {
      return res.status(404).json({
        message: "Vous devez d'abord être en couple.",
      });
    }

    const memory = await Memory.create({
      couple: couple._id,
      createdBy: userId,
      title: title.trim(),
      description: description || "",
      date: date || new Date(),
      image: image || "",
    });

    const populatedMemory = await Memory.findById(memory._id)
      .populate("createdBy", "name email");

    return res.status(201).json(populatedMemory);
  } catch (error) {
    console.error("Erreur création souvenir :", error);

    return res.status(500).json({
      message: "Impossible de créer le souvenir.",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/memories/:id
 * Supprimer un souvenir
 */
exports.deleteMemory = async (req, res) => {
  try {
    const userId = req.user.id;
    const memoryId = req.params.id;

    const couple = await getUserCouple(userId);

    if (!couple) {
      return res.status(404).json({
        message: "Couple introuvable.",
      });
    }

    const memory = await Memory.findOne({
      _id: memoryId,
      couple: couple._id,
    });

    if (!memory) {
      return res.status(404).json({
        message: "Souvenir introuvable.",
      });
    }

    await Memory.findByIdAndDelete(memoryId);

    return res.status(200).json({
      message: "Souvenir supprimé.",
    });
  } catch (error) {
    console.error("Erreur suppression souvenir :", error);

    return res.status(500).json({
      message: "Impossible de supprimer le souvenir.",
      error: error.message,
    });
  }
};
