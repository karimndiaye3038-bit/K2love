const crypto = require("crypto");
const Invitation = require("../models/Invitation");
const User = require("../models/User");
const Couple = require("../models/Couple")
const sendInvitation = async (req, res) => {
  try {
    const { email } = req.body;

    // Vérifier l'email
    if (!email) {
      return res.status(400).json({
        message: "L'adresse email est obligatoire.",
      });
    }

    const receiverEmail = email.trim().toLowerCase();

    // Vérifier que l'utilisateur connecté existe
    const sender = await User.findById(req.user.id);

    if (!sender) {
      return res.status(404).json({
        message: "Utilisateur introuvable.",
      });
    }

    // Empêcher de s'inviter soi-même
    if (sender.email === receiverEmail) {
      return res.status(400).json({
        message: "Vous ne pouvez pas vous inviter vous-même.",
      });
    }

    // Vérifier si une invitation est déjà en attente
    const existingInvitation = await Invitation.findOne({
      sender: sender._id,
      receiverEmail,
      status: "pending",
    });

    if (existingInvitation) {
      return res.status(409).json({
        message: "Une invitation est déjà en attente pour cet email.",
      });
    }

    // Vérifier si l'utilisateur est déjà en couple
    if (sender.partner) {
      return res.status(400).json({
        message: "Vous avez déjà un partenaire.",
      });
    }

    // Générer un token sécurisé
    const token = crypto.randomBytes(32).toString("hex");

    // Créer l'invitation
    const invitation = await Invitation.create({
      sender: sender._id,
      receiverEmail,
      token,
    });

    res.status(201).json({
      message: "Invitation envoyée avec succès ❤️",
      invitation: {
        id: invitation._id,
        email: invitation.receiverEmail,
        status: invitation.status,
        token: invitation.token,
      },
    });
  } catch (error) {
    console.error("Erreur invitation :", error);

    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};


const acceptInvitation = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Token d'invitation manquant.",
      });
    }

    // ==============================
    // UTILISATEUR QUI ACCEPTE
    // ==============================

    const receiver = await User.findById(
      req.user.id
    );

    if (!receiver) {
      return res.status(404).json({
        message: "Utilisateur introuvable.",
      });
    }

    // ==============================
    // CHERCHER L'INVITATION
    // ==============================

    const invitation =
      await Invitation.findOne({
        token,
        status: "pending",
      });

    if (!invitation) {
      return res.status(404).json({
        message:
          "Invitation invalide ou déjà utilisée.",
      });
    }

    // ==============================
    // VÉRIFIER EXPIRATION
    // ==============================

    if (
      invitation.expiresAt &&
      invitation.expiresAt < new Date()
    ) {
      invitation.status = "expired";

      await invitation.save();

      return res.status(400).json({
        message: "Cette invitation a expiré.",
      });
    }

    // ==============================
    // VÉRIFIER EMAIL
    // ==============================

    if (
      receiver.email.toLowerCase() !==
      invitation.receiverEmail.toLowerCase()
    ) {
      return res.status(403).json({
        message:
          "Cette invitation ne vous est pas destinée.",
      });
    }

    // ==============================
    // EXPÉDITEUR
    // ==============================

    const sender = await User.findById(
      invitation.sender
    );

    if (!sender) {
      return res.status(404).json({
        message: "Expéditeur introuvable.",
      });
    }

    // ==============================
    // VÉRIFIER SI DÉJÀ EN COUPLE
    // ==============================

    if (receiver.couple) {
      return res.status(400).json({
        message:
          "Vous êtes déjà connecté à un partenaire.",
      });
    }

    if (sender.couple) {
      return res.status(400).json({
        message:
          "Cet utilisateur est déjà connecté à un partenaire.",
      });
    }

    // ==============================
    // CRÉER LE COUPLE
    // ==============================

    const couple = await Couple.create({
      partner1: sender._id,
      partner2: receiver._id,
    });

    // ==============================
    // RELIER KARIM ET KHADY
    // ==============================

    sender.partner = receiver._id;
    sender.couple = couple._id;

    receiver.partner = sender._id;
    receiver.couple = couple._id;

    await sender.save();
    await receiver.save();

    // ==============================
    // MARQUER INVITATION ACCEPTÉE
    // ==============================

    invitation.status = "accepted";

    await invitation.save();

    // ==============================
    // RÉPONSE
    // ==============================

    res.status(200).json({
      message:
        "Invitation acceptée ❤️ Vous êtes maintenant un couple K2Love !",

      couple: {
        id: couple._id,
        partner1: {
          id: sender._id,
          name: sender.name,
          email: sender.email,
        },
        partner2: {
          id: receiver._id,
          name: receiver.name,
          email: receiver.email,
        },
      },
    });

  } catch (error) {
    console.error(
      "Erreur acceptation invitation :",
      error
    );

    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};
const getMyInvitations = async (req, res) => {
  try {
    // Récupérer l'utilisateur connecté
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable.",
      });
    }

    // Chercher les invitations envoyées à son email
    const invitations = await Invitation.find({
      receiverEmail: user.email.toLowerCase(),
      status: "pending",
    })
      .populate("sender", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      invitations,
    });
  } catch (error) {
    console.error(
      "Erreur récupération invitations :",
      error
    );

    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};
module.exports = {
  sendInvitation,
  getMyInvitations,
  acceptInvitation,
};