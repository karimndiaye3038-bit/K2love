const mongoose = require("mongoose");

const calendarEventSchema = new mongoose.Schema(
  {
    couple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Couple",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "date",
        "anniversary",
        "birthday",
        "romantic",
        "travel",
        "other",
      ],
      default: "date",
    },

    color: {
      type: String,
      default: "#a855f7",
    },

    reminder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CalendarEvent",
  calendarEventSchema
);