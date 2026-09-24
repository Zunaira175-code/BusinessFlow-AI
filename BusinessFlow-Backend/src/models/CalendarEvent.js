const mongoose = require("mongoose");

const calendarEventSchema = new mongoose.Schema(
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
    // EVENT CREATOR
    // =====================================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Event creator is required"],
      index: true,
    },

    // =====================================================
    // ASSIGNED EMPLOYEE
    // =====================================================

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Event assignee is required"],
      index: true,
    },

    // =====================================================
    // BASIC EVENT INFORMATION
    // =====================================================

    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      minlength: [
        2,
        "Event title must be at least 2 characters",
      ],
      maxlength: [
        200,
        "Event title cannot exceed 200 characters",
      ],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [
        2000,
        "Event description cannot exceed 2000 characters",
      ],
      default: null,
    },

    // =====================================================
    // EVENT TYPE
    // =====================================================

    type: {
      type: String,
      enum: [
        "Meeting",
        "Follow-up",
        "Call",
        "Demo",
        "Review",
        "Task",
        "Other",
      ],
      default: "Meeting",
      index: true,
    },

    // =====================================================
    // DATE / TIME
    // =====================================================

    startAt: {
      type: Date,
      required: [true, "Event start date is required"],
      index: true,
    },

    endAt: {
      type: Date,
      required: [true, "Event end date is required"],
      index: true,
    },

    allDay: {
      type: Boolean,
      default: false,
    },

    // =====================================================
    // LOCATION
    // =====================================================

    location: {
      type: String,
      trim: true,
      maxlength: [
        300,
        "Location cannot exceed 300 characters",
      ],
      default: null,
    },

    // =====================================================
    // RELATED CUSTOMER
    // =====================================================

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
      index: true,
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
    // RELATED DEAL
    // =====================================================

    dealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
      default: null,
      index: true,
    },

    // =====================================================
    // STATUS
    // =====================================================

    status: {
      type: String,
      enum: [
        "Scheduled",
        "Completed",
        "Cancelled",
      ],
      default: "Scheduled",
      index: true,
    },

    // =====================================================
    // REMINDER
    // =====================================================

    reminderMinutes: {
      type: Number,
      enum: [
        0,
        5,
        10,
        15,
        30,
        60,
        1440,
      ],
      default: 15,
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// INDEXES
// =====================================================

calendarEventSchema.index({
  companyId: 1,
  startAt: 1,
});

calendarEventSchema.index({
  companyId: 1,
  endAt: 1,
});

calendarEventSchema.index({
  companyId: 1,
  assignedTo: 1,
  startAt: 1,
});

calendarEventSchema.index({
  companyId: 1,
  status: 1,
  startAt: 1,
});

calendarEventSchema.index({
  companyId: 1,
  customerId: 1,
});

calendarEventSchema.index({
  companyId: 1,
  leadId: 1,
});

calendarEventSchema.index({
  companyId: 1,
  dealId: 1,
});

module.exports =
  mongoose.model(
    "CalendarEvent",
    calendarEventSchema
  );