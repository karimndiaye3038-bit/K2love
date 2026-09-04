const User = require("../models/User");
const CalendarEvent = require("../models/CalendarEvent");

// =====================================================
// UTILITAIRE : récupérer l'utilisateur et son couple
// =====================================================

const getUserWithCouple = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    return {
      error: "Utilisateur introuvable.",
      status: 404,
    };
  }

  if (!user.couple) {
    return {
      error: "Vous n'êtes pas encore en couple.",
      status: 400,
    };
  }

  return { user };
};

// =====================================================
// RÉCUPÉRER LES ÉVÉNEMENTS DU COUPLE
// =====================================================

const getEvents = async (req, res) => {
  try {
    const result = await getUserWithCouple(req.user.id);

    if (result.error) {
      return res.status(result.status).json({
        message: result.error,
      });
    }

    const { user } = result;

    const events = await CalendarEvent.find({
      couple: user.couple,
    })
      .populate("createdBy", "name avatar")
      .sort({
        startDate: 1,
      });

    return res.status(200).json({
      events,
    });
  } catch (error) {
    console.error(
      "Erreur récupération calendrier :",
      error
    );

    return res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};

// =====================================================
// CRÉER UN ÉVÉNEMENT
// =====================================================

const createEvent = async (req, res) => {
  try {
    const result = await getUserWithCouple(req.user.id);

    if (result.error) {
      return res.status(result.status).json({
        message: result.error,
      });
    }

    const { user } = result;

    const {
      title,
      description,
      startDate,
      endDate,
      type,
      color,
      reminder,
    } = req.body;

    // -------------------------------
    // VALIDATION
    // -------------------------------

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Le titre est obligatoire.",
      });
    }

    if (!startDate) {
      return res.status(400).json({
        message: "La date de début est obligatoire.",
      });
    }

    if (!endDate) {
      return res.status(400).json({
        message: "La date de fin est obligatoire.",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime())) {
      return res.status(400).json({
        message: "La date de début est invalide.",
      });
    }

    if (isNaN(end.getTime())) {
      return res.status(400).json({
        message: "La date de fin est invalide.",
      });
    }

    if (end < start) {
      return res.status(400).json({
        message:
          "La date de fin doit être après la date de début.",
      });
    }

    // -------------------------------
    // CRÉATION
    // -------------------------------

    const event = await CalendarEvent.create({
      couple: user.couple,
      createdBy: user._id,
      title: title.trim(),
      description: description?.trim() || "",
      startDate: start,
      endDate: end,
      type: type || "date",
      color: color || "#a855f7",
      reminder: Number(reminder) || 0,
    });

    // -------------------------------
    // POPULATE
    // -------------------------------

    const populatedEvent =
      await CalendarEvent.findById(event._id)
        .populate("createdBy", "name avatar");

    // -------------------------------
    // SOCKET.IO
    // -------------------------------

    const io = req.app.get("io");

    if (io) {
      io.to(user.couple.toString()).emit(
        "calendarEventCreated",
        populatedEvent
      );
    }

    return res.status(201).json({
      message: "Événement créé avec succès ❤️",
      event: populatedEvent,
    });
  } catch (error) {
    console.error(
      "Erreur création événement :",
      error
    );

    return res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};

// =====================================================
// MODIFIER UN ÉVÉNEMENT
// =====================================================

const updateEvent = async (req, res) => {
  try {
    const result = await getUserWithCouple(req.user.id);

    if (result.error) {
      return res.status(result.status).json({
        message: result.error,
      });
    }

    const { user } = result;

    // IMPORTANT :
    // On vérifie que l'événement appartient
    // bien au couple connecté.

    const event = await CalendarEvent.findOne({
      _id: req.params.id,
      couple: user.couple,
    });

    if (!event) {
      return res.status(404).json({
        message: "Événement introuvable.",
      });
    }

    const {
      title,
      description,
      startDate,
      endDate,
      type,
      color,
      reminder,
    } = req.body;

    // -------------------------------
    // TITRE
    // -------------------------------

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Le titre est obligatoire.",
        });
      }

      event.title = title.trim();
    }

    // -------------------------------
    // DESCRIPTION
    // -------------------------------

    if (description !== undefined) {
      event.description =
        description?.trim() || "";
    }

    // -------------------------------
    // DATE DE DÉBUT
    // -------------------------------

    if (startDate !== undefined) {
      const start = new Date(startDate);

      if (isNaN(start.getTime())) {
        return res.status(400).json({
          message: "La date de début est invalide.",
        });
      }

      event.startDate = start;
    }

    // -------------------------------
    // DATE DE FIN
    // -------------------------------

    if (endDate !== undefined) {
      const end = new Date(endDate);

      if (isNaN(end.getTime())) {
        return res.status(400).json({
          message: "La date de fin est invalide.",
        });
      }

      event.endDate = end;
    }

    // -------------------------------
    // TYPE
    // -------------------------------

    if (type !== undefined) {
      event.type = type;
    }

    // -------------------------------
    // COULEUR
    // -------------------------------

    if (color !== undefined) {
      event.color = color;
    }

    // -------------------------------
    // RAPPEL
    // -------------------------------

    if (reminder !== undefined) {
      event.reminder =
        Number(reminder) || 0;
    }

    // -------------------------------
    // VÉRIFICATION DES DATES
    // -------------------------------

    if (event.endDate < event.startDate) {
      return res.status(400).json({
        message:
          "La date de fin doit être après la date de début.",
      });
    }

    await event.save();

    // -------------------------------
    // POPULATE
    // -------------------------------

    const updatedEvent =
      await CalendarEvent.findById(event._id)
        .populate("createdBy", "name avatar");

    // -------------------------------
    // SOCKET.IO
    // -------------------------------

    const io = req.app.get("io");

    if (io) {
      io.to(user.couple.toString()).emit(
        "calendarEventUpdated",
        updatedEvent
      );
    }

    return res.status(200).json({
      message:
        "Événement modifié avec succès ❤️",
      event: updatedEvent,
    });
  } catch (error) {
    console.error(
      "Erreur modification événement :",
      error
    );

    return res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};

// =====================================================
// SUPPRIMER UN ÉVÉNEMENT
// =====================================================

const deleteEvent = async (req, res) => {
  try {
    const result = await getUserWithCouple(req.user.id);

    if (result.error) {
      return res.status(result.status).json({
        message: result.error,
      });
    }

    const { user } = result;

    // -------------------------------
    // RECHERCHE SÉCURISÉE
    // -------------------------------

    const event = await CalendarEvent.findOne({
      _id: req.params.id,
      couple: user.couple,
    });

    if (!event) {
      return res.status(404).json({
        message: "Événement introuvable.",
      });
    }

    const eventId = event._id.toString();

    // -------------------------------
    // SUPPRESSION
    // -------------------------------

    await CalendarEvent.deleteOne({
      _id: event._id,
    });

    // -------------------------------
    // SOCKET.IO
    // -------------------------------

    const io = req.app.get("io");

    if (io) {
      io.to(user.couple.toString()).emit(
        "calendarEventDeleted",
        {
          eventId,
        }
      );
    }

    return res.status(200).json({
      message:
        "Événement supprimé avec succès.",
      eventId,
    });
  } catch (error) {
    console.error(
      "Erreur suppression événement :",
      error
    );

    return res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};