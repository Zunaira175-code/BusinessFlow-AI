const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    // =========================
    // COMPANY / WORKSPACE
    // =========================
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      minlength: [2, "Company name must be at least 2 characters"],
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },

    workspaceSlug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      maxlength: [100, "Workspace URL cannot exceed 100 characters"],
    },

    industry: {
      type: String,
      trim: true,
      maxlength: [100, "Industry cannot exceed 100 characters"],
      default: "Enterprise CRM",
    },

    // =========================
    // REGIONAL SETTINGS
    // =========================
    timezone: {
      type: String,
      trim: true,
      default: "Asia/Karachi",
    },

    dateFormat: {
      type: String,
      enum: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"],
      default: "DD/MM/YYYY",
    },

    language: {
      type: String,
      enum: ["en-US", "en-GB"],
      default: "en-US",
    },

    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "PKR", "AED", "SAR"],
      default: "USD",
    },

    // =========================
    // STATUS
    // =========================
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);