const express = require("express");

const router = express.Router();

const {
  sendInvitation,
  getMyInvitations,
  acceptInvitation,
} = require("../controllers/invitationController");

const protect = require("../middleware/authMiddleware");

// ========================================
// ENVOYER UNE INVITATION
// ========================================

router.post(
  "/send",
  protect,
  sendInvitation
);

// ========================================
// RÉCUPÉRER MES INVITATIONS
// ========================================

router.get(
  "/",
  protect,
  getMyInvitations
);

// ========================================
// ACCEPTER UNE INVITATION
// ========================================

router.post(
  "/accept",
  protect,
  acceptInvitation
);

module.exports = router;