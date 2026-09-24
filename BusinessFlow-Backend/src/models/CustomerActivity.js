const mongoose = require("mongoose");

// =====================================================
// CUSTOMER ACTIVITY SCHEMA
// =====================================================

const customerActivitySchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
      index: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "note",
        "call",
        "email",
        "meeting",
        "deal",
        "task",
        "status",
        "payment",
        "message",
        "other",
      ],
      default: "other",
      index: true,
    },

    title: {
      type: String,
      required: [true, "Activity title is required"],
      trim: true,
      maxlength: [
        200,
        "Activity title cannot exceed 200 characters",
      ],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [
        500,
        "Activity description cannot exceed 500 characters",
      ],
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// INDEXES
// =====================================================

customerActivitySchema.index({
  companyId: 1,
  customerId: 1,
  createdAt: -1,
});

customerActivitySchema.index({
  companyId: 1,
  type: 1,
  createdAt: -1,
});

// =====================================================
// MODEL
// =====================================================

module.exports = mongoose.model(
  "CustomerActivity",
  customerActivitySchema
);