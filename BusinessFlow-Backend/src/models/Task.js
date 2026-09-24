const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    // =====================================================
    // COMPANY
    // =====================================================

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
      index: true,
    },

    // =====================================================
    // TASK DETAILS
    // =====================================================

    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [2, "Task title must be at least 2 characters"],
      maxlength: [200, "Task title cannot exceed 200 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [
        1000,
        "Task description cannot exceed 1000 characters",
      ],
      default: null,
    },

    // =====================================================
    // RELATED CUSTOMER / LEAD / DEAL
    // =====================================================

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
      index: true,
    },

    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
      index: true,
    },

    dealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
      default: null,
      index: true,
    },

    // =====================================================
    // ASSIGNMENT
    // =====================================================

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task assignee is required"],
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task creator is required"],
      index: true,
    },

    // =====================================================
    // TASK STATUS
    // =====================================================

    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
      index: true,
    },

    // =====================================================
    // PRIORITY
    // =====================================================

    priority: {
      type: String,
      enum: [
        "LOW",
        "MEDIUM",
        "HIGH",
      ],
      default: "MEDIUM",
      index: true,
    },

    // =====================================================
    // DUE DATE
    // =====================================================

    dueAt: {
      type: Date,
      required: [true, "Task due date is required"],
      index: true,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    // =====================================================
    // ADDITIONAL
    // =====================================================

    notes: {
      type: String,
      trim: true,
      maxlength: [
        1000,
        "Task notes cannot exceed 1000 characters",
      ],
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

taskSchema.index({
  companyId: 1,
  dueAt: 1,
});

taskSchema.index({
  companyId: 1,
  status: 1,
  dueAt: 1,
});

taskSchema.index({
  companyId: 1,
  assignedTo: 1,
  dueAt: 1,
});

taskSchema.index({
  companyId: 1,
  createdAt: -1,
});

// =====================================================
// MODEL
// =====================================================

module.exports = mongoose.model(
  "Task",
  taskSchema
);