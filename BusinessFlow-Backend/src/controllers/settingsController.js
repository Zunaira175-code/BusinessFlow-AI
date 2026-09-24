const mongoose = require("mongoose");

const Company = require("../models/Company");
const User = require("../models/User");

// =====================================================
// GET GENERAL SETTINGS
// GET /api/settings/general
// =====================================================

const getGeneralSettings = async (req, res) => {
  try {
    // -------------------------------------------------
    // Admin only
    // -------------------------------------------------

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Only administrators can access general settings.",
      });
    }

    const companyId =
      req.user.companyId?._id || req.user.companyId;

    if (
      !companyId ||
      !mongoose.Types.ObjectId.isValid(companyId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid company information.",
      });
    }

    const company = await Company.findById(companyId).select(
      "name workspaceSlug industry timezone dateFormat language currency isActive"
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "General settings retrieved successfully.",
      data: {
        settings: {
          workspaceName: company.name,
          workspaceSlug: company.workspaceSlug || "",
          industry:
            company.industry || "Enterprise CRM",
          timezone:
            company.timezone || "Asia/Karachi",
          dateFormat:
            company.dateFormat || "DD/MM/YYYY",
          language:
            company.language || "en-US",
          currency:
            company.currency || "USD",
        },
      },
    });
  } catch (error) {
    console.error(
      "Get General Settings Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while retrieving general settings.",
    });
  }
};

// =====================================================
// UPDATE GENERAL SETTINGS
// PATCH /api/settings/general
// =====================================================

const updateGeneralSettings = async (req, res) => {
  try {
    // -------------------------------------------------
    // Admin only
    // -------------------------------------------------

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Only administrators can update general settings.",
      });
    }

    const companyId =
      req.user.companyId?._id || req.user.companyId;

    if (
      !companyId ||
      !mongoose.Types.ObjectId.isValid(companyId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid company information.",
      });
    }

    const {
      workspaceName,
      workspaceSlug,
      industry,
      timezone,
      dateFormat,
      language,
      currency,
    } = req.body || {};

    // -------------------------------------------------
    // Validate Workspace Name
    // -------------------------------------------------

    if (
      !workspaceName ||
      !workspaceName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Workspace name is required.",
      });
    }

    const trimmedWorkspaceName =
      workspaceName.trim();

    if (trimmedWorkspaceName.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Workspace name must be at least 2 characters.",
      });
    }

    if (trimmedWorkspaceName.length > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Workspace name cannot exceed 100 characters.",
      });
    }

    // -------------------------------------------------
    // Normalize Workspace Slug
    // -------------------------------------------------

    let normalizedSlug = "";

    if (
      workspaceSlug &&
      workspaceSlug.trim()
    ) {
      normalizedSlug = workspaceSlug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      if (!normalizedSlug) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide a valid workspace URL.",
        });
      }
    }

    // -------------------------------------------------
    // Check Duplicate Workspace Slug
    // -------------------------------------------------

    if (normalizedSlug) {
      const existingCompany =
        await Company.findOne({
          workspaceSlug: normalizedSlug,
          _id: { $ne: companyId },
        });

      if (existingCompany) {
        return res.status(409).json({
          success: false,
          message:
            "This workspace URL is already in use.",
        });
      }
    }

    // -------------------------------------------------
    // Allowed Values
    // -------------------------------------------------

    const allowedDateFormats = [
      "DD/MM/YYYY",
      "MM/DD/YYYY",
      "YYYY-MM-DD",
    ];

    const allowedLanguages = [
      "en-US",
      "en-GB",
    ];

    const allowedCurrencies = [
      "USD",
      "EUR",
      "GBP",
      "PKR",
      "AED",
      "SAR",
    ];

    // -------------------------------------------------
    // Validate Date Format
    // -------------------------------------------------

    if (
      dateFormat &&
      !allowedDateFormats.includes(dateFormat)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format.",
      });
    }

    // -------------------------------------------------
    // Validate Language
    // -------------------------------------------------

    if (
      language &&
      !allowedLanguages.includes(language)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid language.",
      });
    }

    // -------------------------------------------------
    // Validate Currency
    // -------------------------------------------------

    if (
      currency &&
      !allowedCurrencies.includes(currency)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid currency.",
      });
    }

    // -------------------------------------------------
    // Update Company
    // -------------------------------------------------

    const company =
      await Company.findByIdAndUpdate(
        companyId,
        {
          name: trimmedWorkspaceName,
          workspaceSlug:
            normalizedSlug || null,
          industry:
            industry?.trim() ||
            "Enterprise CRM",
          timezone:
            timezone?.trim() ||
            "Asia/Karachi",
          dateFormat:
            dateFormat ||
            "DD/MM/YYYY",
          language:
            language ||
            "en-US",
          currency:
            currency ||
            "USD",
        },
        {
          new: true,
          runValidators: true,
        }
      ).select(
        "name workspaceSlug industry timezone dateFormat language currency isActive"
      );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "General settings updated successfully.",
      data: {
        settings: {
          workspaceName: company.name,
          workspaceSlug:
            company.workspaceSlug || "",
          industry:
            company.industry ||
            "Enterprise CRM",
          timezone:
            company.timezone ||
            "Asia/Karachi",
          dateFormat:
            company.dateFormat ||
            "DD/MM/YYYY",
          language:
            company.language || "en-US",
          currency:
            company.currency || "USD",
        },
      },
    });
  } catch (error) {
    console.error(
      "Update General Settings Error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "This workspace URL is already in use.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while updating general settings.",
    });
  }
};

// =====================================================
// GET ACCOUNT SETTINGS
// GET /api/settings/account
// =====================================================

const getAccountSettings = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    )
      .select(
        "firstName lastName email phone jobTitle profilePicture role department workStatus"
      )
      .populate("companyId", "name");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Account settings retrieved successfully.",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || "",
          jobTitle: user.jobTitle || "",
          profilePicture:
            user.profilePicture || null,
          role: user.role,
          department:
            user.department || "",
          workStatus:
            user.workStatus,
          companyName:
            user.companyId?.name || "",
        },
      },
    });
  } catch (error) {
    console.error(
      "Get Account Settings Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while retrieving account settings.",
    });
  }
};

// =====================================================
// UPDATE ACCOUNT SETTINGS
// PATCH /api/settings/account
// =====================================================

const updateAccountSettings = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      jobTitle,
    } = req.body || {};

    // -------------------------------------------------
    // Required Fields
    // -------------------------------------------------

    if (
      !firstName ||
      !firstName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "First name is required.",
      });
    }

    if (
      !lastName ||
      !lastName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Last name is required.",
      });
    }

    if (
      !email ||
      !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    // -------------------------------------------------
    // Normalize Email
    // -------------------------------------------------

    const normalizedEmail =
      email.trim().toLowerCase();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(normalizedEmail)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid email address.",
      });
    }

    // -------------------------------------------------
    // Check Duplicate Email
    // -------------------------------------------------

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "This email address is already in use.",
      });
    }

    // -------------------------------------------------
    // Update User
    // -------------------------------------------------

    user.firstName =
      firstName.trim();

    user.lastName =
      lastName.trim();

    user.email =
      normalizedEmail;

    user.phone =
      phone?.trim() || null;

    user.jobTitle =
      jobTitle?.trim() || null;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Account settings updated successfully.",
      data: {
        user: {
          id: user._id,
          firstName:
            user.firstName,
          lastName:
            user.lastName,
          email:
            user.email,
          phone:
            user.phone || "",
          jobTitle:
            user.jobTitle || "",
          profilePicture:
            user.profilePicture || null,
          role:
            user.role,
          department:
            user.department || "",
          workStatus:
            user.workStatus,
        },
      },
    });
  } catch (error) {
    console.error(
      "Update Account Settings Error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "This email address is already in use.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while updating account settings.",
    });
  }
};

// =====================================================
// UPLOAD PROFILE PICTURE
// POST /api/settings/account/profile-picture
// =====================================================

const uploadProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please select a profile picture.",
      });
    }

    // -------------------------------------------------
    // Create Public Image URL
    // -------------------------------------------------

    const baseUrl =
      `${req.protocol}://${req.get("host")}`;

    const profilePictureUrl =
      `${baseUrl}/uploads/profile-pictures/${req.file.filename}`;

    // -------------------------------------------------
    // Save URL in MongoDB
    // -------------------------------------------------

    user.profilePicture =
      profilePictureUrl;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Profile picture uploaded successfully.",
      data: {
        profilePicture:
          user.profilePicture,
      },
    });
  } catch (error) {
    console.error(
      "Upload Profile Picture Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while uploading the profile picture.",
    });
  }
};

// =====================================================
// GET NOTIFICATION SETTINGS
// GET /api/settings/notifications
// =====================================================

const getNotificationSettings = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("notificationPreferences");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    const preferences =
      user.notificationPreferences || {};

    const email =
      preferences.email || {};

    const inApp =
      preferences.inApp || {};

    const schedule =
      preferences.schedule || {};

    return res.status(200).json({
      success: true,
      message:
        "Notification settings fetched successfully.",
      data: {
        notificationPreferences: {
          email: {
            newLead:
              email.newLead ?? true,

            newDeal:
              email.newDeal ?? true,

            dealStage:
              email.dealStage ?? true,

            taskAssignments:
              email.taskAssignments ?? true,

            customerActivity:
              email.customerActivity ?? false,

            teamActivity:
              email.teamActivity ?? true,

            systemUpdates:
              email.systemUpdates ?? true,
          },

          inApp: {
            leadActivity:
              inApp.leadActivity ?? true,

            dealActivity:
              inApp.dealActivity ?? true,

            customerUpdates:
              inApp.customerUpdates ?? true,

            teamMentions:
              inApp.teamMentions ?? true,

            taskReminders:
              inApp.taskReminders ?? true,
          },

          schedule: {
            quietHours:
              schedule.quietHours ?? false,

            startTime:
              schedule.startTime ?? "22:00",

            endTime:
              schedule.endTime ?? "07:00",

            timezone:
              schedule.timezone ??
              "Asia/Karachi",
          },
        },
      },
    });
  } catch (error) {
    console.error(
      "Get Notification Settings Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch notification settings.",
    });
  }
};

// =====================================================
// UPDATE NOTIFICATION SETTINGS
// PATCH /api/settings/notifications
// =====================================================

const updateNotificationSettings = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    const {
      email,
      inApp,
      schedule,
    } = req.body || {};

    // =================================================
    // VALIDATE OBJECTS
    // =================================================

    if (
      email !== undefined &&
      (
        typeof email !== "object" ||
        Array.isArray(email) ||
        email === null
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email notification settings must be an object.",
      });
    }

    if (
      inApp !== undefined &&
      (
        typeof inApp !== "object" ||
        Array.isArray(inApp) ||
        inApp === null
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "In-app notification settings must be an object.",
      });
    }

    if (
      schedule !== undefined &&
      (
        typeof schedule !== "object" ||
        Array.isArray(schedule) ||
        schedule === null
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Notification schedule must be an object.",
      });
    }

    // =================================================
    // CURRENT PREFERENCES
    // =================================================

    const current =
      user.notificationPreferences || {};

    const currentEmail =
      current.email || {};

    const currentInApp =
      current.inApp || {};

    const currentSchedule =
      current.schedule || {};

    // =================================================
    // EMAIL SETTINGS
    // =================================================

    const updatedEmail = {
      newLead:
        typeof email?.newLead === "boolean"
          ? email.newLead
          : currentEmail.newLead ??
            true,

      newDeal:
        typeof email?.newDeal === "boolean"
          ? email.newDeal
          : currentEmail.newDeal ??
            true,

      dealStage:
        typeof email?.dealStage === "boolean"
          ? email.dealStage
          : currentEmail.dealStage ??
            true,

      taskAssignments:
        typeof email?.taskAssignments ===
          "boolean"
          ? email.taskAssignments
          : currentEmail.taskAssignments ??
            true,

      customerActivity:
        typeof email?.customerActivity ===
          "boolean"
          ? email.customerActivity
          : currentEmail.customerActivity ??
            false,

      teamActivity:
        typeof email?.teamActivity ===
          "boolean"
          ? email.teamActivity
          : currentEmail.teamActivity ??
            true,

      systemUpdates:
        typeof email?.systemUpdates ===
          "boolean"
          ? email.systemUpdates
          : currentEmail.systemUpdates ??
            true,
    };

    // =================================================
    // IN-APP SETTINGS
    // =================================================

    const updatedInApp = {
      leadActivity:
        typeof inApp?.leadActivity ===
          "boolean"
          ? inApp.leadActivity
          : currentInApp.leadActivity ??
            true,

      dealActivity:
        typeof inApp?.dealActivity ===
          "boolean"
          ? inApp.dealActivity
          : currentInApp.dealActivity ??
            true,

      customerUpdates:
        typeof inApp?.customerUpdates ===
          "boolean"
          ? inApp.customerUpdates
          : currentInApp.customerUpdates ??
            true,

      teamMentions:
        typeof inApp?.teamMentions ===
          "boolean"
          ? inApp.teamMentions
          : currentInApp.teamMentions ??
            true,

      taskReminders:
        typeof inApp?.taskReminders ===
          "boolean"
          ? inApp.taskReminders
          : currentInApp.taskReminders ??
            true,
    };

    // =================================================
    // VALID TIME FORMAT
    // =================================================

    const isValidTime = (value) => {
      return (
        typeof value === "string" &&
        /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(
          value
        )
      );
    };

    // =================================================
    // SCHEDULE SETTINGS
    // =================================================

    let startTime =
      currentSchedule.startTime ||
      "22:00";

    let endTime =
      currentSchedule.endTime ||
      "07:00";

    if (
      schedule?.startTime !== undefined
    ) {
      if (
        !isValidTime(
          schedule.startTime
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid notification start time. Use HH:MM format.",
        });
      }

      startTime =
        schedule.startTime;
    }

    if (
      schedule?.endTime !== undefined
    ) {
      if (
        !isValidTime(
          schedule.endTime
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid notification end time. Use HH:MM format.",
        });
      }

      endTime =
        schedule.endTime;
    }

    // =================================================
    // ALLOWED TIMEZONES
    // =================================================

    const allowedTimezones = [
      "Asia/Karachi",
      "UTC",
      "America/New_York",
      "America/Los_Angeles",
      "Europe/Berlin",
    ];

    let timezone =
      currentSchedule.timezone ||
      "Asia/Karachi";

    if (
      schedule?.timezone !== undefined
    ) {
      if (
        typeof schedule.timezone !==
          "string" ||
        !allowedTimezones.includes(
          schedule.timezone
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid notification timezone.",
        });
      }

      timezone =
        schedule.timezone;
    }

    const updatedSchedule = {
      quietHours:
        typeof schedule?.quietHours ===
          "boolean"
          ? schedule.quietHours
          : currentSchedule.quietHours ??
            false,

      startTime,

      endTime,

      timezone,
    };

    // =================================================
    // SAVE NOTIFICATION PREFERENCES
    // =================================================

    user.notificationPreferences = {
      email: updatedEmail,
      inApp: updatedInApp,
      schedule: updatedSchedule,
    };

    await user.save();

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message:
        "Notification settings updated successfully.",
      data: {
        notificationPreferences:
          user.notificationPreferences,
      },
    });
  } catch (error) {
    console.error(
      "Update Notification Settings Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update notification settings.",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  // General
  getGeneralSettings,
  updateGeneralSettings,

  // Account
  getAccountSettings,
  updateAccountSettings,

  // Profile Picture
  uploadProfilePicture,

  // Notifications
  getNotificationSettings,
  updateNotificationSettings,
};