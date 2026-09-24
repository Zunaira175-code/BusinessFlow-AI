const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Inviting user is required"],
    },

    role: {
      type: String,
      enum: ["employee"],
      default: "employee",
    },

    tokenHash: {
      type: String,
      required: [true, "Invitation token is required"],
    },

    expiresAt: {
      type: Date,
      required: [true, "Invitation expiry is required"],
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "cancelled", "expired"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invitation", invitationSchema);