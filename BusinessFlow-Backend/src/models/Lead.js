const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
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
    // LEAD INFORMATION
    // =====================================================

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    // =====================================================
    // COMPANY / ORGANIZATION
    // =====================================================

    company: {
      type: String,
      trim: true,
      default: null,
    },

    jobTitle: {
      type: String,
      trim: true,
      default: null,
    },

    // =====================================================
    // HUBSPOT SYNC
    // =====================================================

    // Stores the HubSpot Contact ID when this lead
    // comes from HubSpot.
    //
    // This ID is used to:
    // 1. Identify the original HubSpot contact
    // 2. Prevent duplicate BusinessFlow leads
    // 3. Update the same lead when HubSpot data changes
    //
    // Manual BusinessFlow leads can keep this as null.

    hubspotContactId: {
      type: String,
      trim: true,
      default: null,
    },

    // =====================================================
    // LEAD VALUE
    // =====================================================

    value: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =====================================================
    // LEAD STATUS
    // =====================================================

    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Qualified",
        "Proposal Sent",
        "Converted",
        "Lost",
      ],
      default: "New",
      index: true,
    },

    // =====================================================
    // LEAD SOURCE
    // =====================================================

    source: {
      type: String,
      enum: [
        "Website",
        "Referral",
        "LinkedIn",
        "Facebook",
        "Instagram",
        "Google",
        "Email",
        "Cold Call",
        "HubSpot",
        "Other",
      ],
      default: "Other",
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
    // NOTES
    // =====================================================

    notes: {
      type: String,
      trim: true,
      default: null,
    },

    // =====================================================
    // CONVERSION
    // =====================================================

    convertedAt: {
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
  },
  {
    timestamps: true,
  }
);

// =====================================================
// INDEXES
// =====================================================

// -----------------------------------------------------
// General lead listing
// -----------------------------------------------------

leadSchema.index({
  companyId: 1,
  createdAt: -1,
});

// -----------------------------------------------------
// Filter leads by status
// -----------------------------------------------------

leadSchema.index({
  companyId: 1,
  status: 1,
});

// -----------------------------------------------------
// Filter leads by assigned employee
// -----------------------------------------------------

leadSchema.index({
  companyId: 1,
  assignedTo: 1,
});

// -----------------------------------------------------
// Search/check leads by email
// -----------------------------------------------------

leadSchema.index({
  companyId: 1,
  email: 1,
});

// -----------------------------------------------------
// HubSpot duplicate prevention
// -----------------------------------------------------
//
// A single HubSpot contact should map to only one
// BusinessFlow Lead within the same company.
//
// Manual leads are allowed to have hubspotContactId = null.
//
// partialFilterExpression makes the unique constraint
// apply only when hubspotContactId is a string.
//

leadSchema.index(
  {
    companyId: 1,
    hubspotContactId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      hubspotContactId: {
        $type: "string",
      },
    },
  }
);

// =====================================================
// EXPORT MODEL
// =====================================================

module.exports = mongoose.model("Lead", leadSchema);