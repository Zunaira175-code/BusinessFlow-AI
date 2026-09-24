const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
      index: true,
    },

    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [150, "Company name cannot exceed 150 characters"],
    },

    industry: {
      type: String,
      trim: true,
      maxlength: [100, "Industry cannot exceed 100 characters"],
      default: null,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: [30, "Phone number cannot exceed 30 characters"],
      default: null,
    },

    jobTitle: {
      type: String,
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"],
      default: null,
    },

    status: {
      type: String,
      enum: ["Active", "Pending", "Inactive"],
      default: "Active",
      index: true,
    },

    accountManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    totalRevenue: {
      type: Number,
      min: 0,
      default: 0,
    },

    accountValue: {
      type: Number,
      min: 0,
      default: 0,
    },

    healthScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 75,
    },

    healthStatus: {
      type: String,
      enum: [
        "Healthy",
        "At Risk",
        "Expansion Opportunity",
        "Neutral",
      ],
      default: "Healthy",
    },

    healthMessage: {
      type: String,
      trim: true,
      maxlength: [500, "Health message cannot exceed 500 characters"],
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      default: null,
    },

    lastActivityAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Company-scoped indexes
 */
customerSchema.index({
  companyId: 1,
  createdAt: -1,
});

customerSchema.index({
  companyId: 1,
  status: 1,
});

customerSchema.index({
  companyId: 1,
  accountManager: 1,
});

customerSchema.index({
  companyId: 1,
  healthStatus: 1,
});

customerSchema.index({
  companyId: 1,
  email: 1,
});

module.exports = mongoose.model("Customer", customerSchema);