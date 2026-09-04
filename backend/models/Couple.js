const mongoose = require("mongoose");

const coupleSchema = new mongoose.Schema(
  {
    partner1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    partner2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    relationshipDate: {
      type: Date,
      default: null,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = mongoose.model(
  "Couple",
  coupleSchema
);