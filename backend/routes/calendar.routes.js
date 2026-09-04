const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/calendarController");

// =====================================================
// CALENDRIER
// =====================================================

router.get(
  "/",
  authMiddleware,
  getEvents
);

router.post(
  "/",
  authMiddleware,
  createEvent
);

router.put(
  "/:id",
  authMiddleware,
  updateEvent
);

router.delete(
  "/:id",
  authMiddleware,
  deleteEvent
);

module.exports = router;