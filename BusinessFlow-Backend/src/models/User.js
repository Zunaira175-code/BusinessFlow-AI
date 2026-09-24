const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // =====================================================
    // COMPANY
    // =====================================================
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },

    // =====================================================
    // BASIC INFORMATION
    // =====================================================
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // =====================================================
    // PASSWORD
    // =====================================================
    password: {
      type: String,
      default: null,
      minlength: [6, "Password must be at least 6 characters"],
    },

    // =====================================================
    // ROLE
    // =====================================================
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },

    // =====================================================
    // EMPLOYEE INFORMATION
    // =====================================================
    department: {
      type: String,
      trim: true,
      maxlength: [100, "Department cannot exceed 100 characters"],
      default: null,
    },

    jobTitle: {
      type: String,
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"],
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: [30, "Phone number cannot exceed 30 characters"],
      default: null,
    },

    profilePicture: {
      type: String,
      trim: true,
      default: null,
    },

    // =====================================================
    // ACCOUNT STATUS
    // =====================================================
    isActive: {
      type: Boolean,
      default: true,
    },

    // =====================================================
    // EMPLOYEE WORK STATUS
    // =====================================================
    workStatus: {
      type: String,
      enum: ["active", "on_leave"],
      default: "active",
    },

    notificationPreferences: {
      email: {
        newLead: {
          type: Boolean,
          default: true,
        },

        newDeal: {
          type: Boolean,
          default: true,
        },

        dealStage: {
          type: Boolean,
          default: true,
        },

        taskAssignments: {
          type: Boolean,
          default: true,
        },

        customerActivity: {
          type: Boolean,
          default: false,
        },

        teamActivity: {
          type: Boolean,
          default: true,
        },

        systemUpdates: {
          type: Boolean,
          default: true,
        },
      },

      inApp: {
        leadActivity: {
          type: Boolean,
          default: true,
        },

        dealActivity: {
          type: Boolean,
          default: true,
        },

        customerUpdates: {
          type: Boolean,
          default: true,
        },

        teamMentions: {
          type: Boolean,
          default: true,
        },

        taskReminders: {
          type: Boolean,
          default: true,
        },
      },

      schedule: {
        quietHours: {
          type: Boolean,
          default: false,
        },

        startTime: {
          type: String,
          default: "22:00",
        },

        endTime: {
          type: String,
          default: "07:00",
        },

        timezone: {
          type: String,
          default: "Asia/Karachi",
        },
      },
    },

    // =====================================================
    // EMPLOYEE INVITATION
    // =====================================================
    invitationTokenHash: {
      type: String,
      default: null,
    },

    invitationExpiresAt: {
      type: Date,
      default: null,
    },

    invitationAcceptedAt: {
      type: Date,
      default: null,
    },

    // =====================================================
    // PASSWORD RESET
    // =====================================================
    resetPasswordTokenHash: {
      type: String,
      default: null,
    },

    resetPasswordExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);