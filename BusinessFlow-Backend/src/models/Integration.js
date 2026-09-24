const mongoose = require("mongoose");

const integrationSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
      index: true,
    },

    name: {
      type: String,
      required: [true, "Integration name is required"],
      trim: true,
    },

    key: {
      type: String,
      required: [true, "Integration key is required"],
      trim: true,
      lowercase: true,
    },

    category: {
      type: String,
      enum: ["connected", "available"],
      default: "available",
    },

    status: {
      type: String,
      enum: ["connected", "disconnected", "pending"],
      default: "disconnected",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    icon: {
      type: String,
      trim: true,
      default: "",
    },

    // =================================================
    // GENERAL CONFIGURATION
    // =================================================

    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // =================================================
    // OAUTH DATA
    // =================================================

    oauth: {
      provider: {
        type: String,
        default: null,
      },

      accessToken: {
        type: String,
        default: null,
      },

      refreshToken: {
        type: String,
        default: null,
      },

      tokenType: {
        type: String,
        default: null,
      },

      scope: {
        type: String,
        default: null,
      },

      expiresAt: {
        type: Date,
        default: null,
      },

      accountId: {
        type: String,
        default: null,
      },

      accountName: {
        type: String,
        default: null,
      },
    },

    // =================================================
    // CONNECTION DATES
    // =================================================

    connectedAt: {
      type: Date,
      default: null,
    },

    disconnectedAt: {
      type: Date,
      default: null,
    },

    // =================================================
    // ACTIVE STATUS
    // =================================================

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// UNIQUE COMPANY + INTEGRATION
// =====================================================

integrationSchema.index(
  { companyId: 1, key: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "Integration",
  integrationSchema
);