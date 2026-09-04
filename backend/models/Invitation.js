const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      default: () => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date;
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invitation", invitationSchema);