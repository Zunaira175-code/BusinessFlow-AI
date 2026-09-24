const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    // =====================================================
    // COMPANY
    // =====================================================

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    // =====================================================
    // DEAL INFORMATION
    // =====================================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: null,
    },

    // =====================================================
    // RELATED LEAD
    // =====================================================

    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
      index: true,
    },

    // =====================================================
    // CUSTOMER
    // =====================================================

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
      index: true,
    },

    // =====================================================
    // DEAL VALUE
    // =====================================================

    value: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    // =====================================================
    // DEAL STAGE
    // =====================================================

    stage: {
      type: String,
      enum: [
        "Prospecting",
        "Qualification",
        "Proposal",
        "Negotiation",
        "Closed Won",
        "Closed Lost",
      ],
      default: "Prospecting",
      index: true,
    },

    // =====================================================
    // DEAL STATUS
    // =====================================================

    status: {
      type: String,
      enum: ["Open", "Won", "Lost"],
      default: "Open",
      index: true,
    },

    // =====================================================
    // ASSIGNED EMPLOYEE
    // =====================================================

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // =====================================================
    // EXPECTED CLOSE DATE
    // =====================================================

    expectedCloseDate: {
      type: Date,
      default: null,
      index: true,
    },

    // =====================================================
    // ACTUAL CLOSE DATE
    // =====================================================

    closedAt: {
      type: Date,
      default: null,
    },

    // =====================================================
    // LAST ACTIVITY
    // =====================================================

    lastActivityAt: {
      type: Date,
      default: null,
    },

    // =====================================================
    // NOTES
    // =====================================================

    notes: {
      type: String,
      trim: true,
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

dealSchema.index({ companyId: 1, createdAt: -1 });
dealSchema.index({ companyId: 1, status: 1 });
dealSchema.index({ companyId: 1, stage: 1 });
dealSchema.index({ companyId: 1, assignedTo: 1 });
dealSchema.index({ companyId: 1, expectedCloseDate: 1 });

module.exports = mongoose.model("Deal", dealSchema);