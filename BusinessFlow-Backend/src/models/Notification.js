const mongoose = require("mongoose");

// =====================================================
// NOTIFICATION SCHEMA
// =====================================================

const notificationSchema = new mongoose.Schema(
  {
    // -------------------------------------------------
    // COMPANY
    // -------------------------------------------------

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
      index: true,
    },

    // -------------------------------------------------
    // USER
    // -------------------------------------------------
    // Notification jis user ko show hogi

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    // -------------------------------------------------
    // NOTIFICATION TYPE
    // -------------------------------------------------

    type: {
      type: String,
      enum: [
        "lead",
        "deal",
        "task",
        "meeting",
      ],
      required: [true, "Notification type is required"],
      index: true,
    },

    // -------------------------------------------------
    // TITLE
    // -------------------------------------------------

    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
      maxlength: [
        200,
        "Notification title cannot exceed 200 characters",
      ],
    },

    // -------------------------------------------------
    // MESSAGE
    // -------------------------------------------------

    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
      maxlength: [
        500,
        "Notification message cannot exceed 500 characters",
      ],
    },

    // -------------------------------------------------
    // READ / UNREAD
    // -------------------------------------------------

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },

    // -------------------------------------------------
    // RELATED RECORD
    // -------------------------------------------------
    // Lead / Deal / Task / Meeting ki ID

    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // -------------------------------------------------
    // RELATED MODEL
    // -------------------------------------------------

    relatedModel: {
      type: String,
      enum: [
        "Lead",
        "Deal",
        "Task",
        "Meeting",
        null,
      ],
      default: null,
    },

    // -------------------------------------------------
    // ACTION BUTTON
    // -------------------------------------------------

    actionLabel: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },

    actionUrl: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    // -------------------------------------------------
    // EXTRA DATA
    // -------------------------------------------------

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

notificationSchema.index({
  companyId: 1,
  userId: 1,
  createdAt: -1,
});

notificationSchema.index({
  companyId: 1,
  userId: 1,
  isRead: 1,
});

notificationSchema.index({
  companyId: 1,
  userId: 1,
  type: 1,
});

// =====================================================
// EXPORT
// =====================================================

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);