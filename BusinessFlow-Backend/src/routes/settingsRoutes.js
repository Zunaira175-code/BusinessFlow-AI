const express = require("express");

const {
  getGeneralSettings,
  updateGeneralSettings,

  getAccountSettings,
  updateAccountSettings,
  uploadProfilePicture,

  getNotificationSettings,
  updateNotificationSettings,
} = require("../controllers/settingsController");

const uploadProfilePictureMiddleware = require(
  "../middleware/uploadProfilePicture"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

/* =====================================================
   GENERAL SETTINGS
===================================================== */

router.get(
  "/general",
  authMiddleware,
  getGeneralSettings
);

router.patch(
  "/general",
  authMiddleware,
  updateGeneralSettings
);

/* =====================================================
   ACCOUNT SETTINGS
===================================================== */

router.get(
  "/account",
  authMiddleware,
  getAccountSettings
);

router.patch(
  "/account",
  authMiddleware,
  updateAccountSettings
);

/* =====================================================
   PROFILE PICTURE
===================================================== */

router.post(
  "/account/profile-picture",
  authMiddleware,
  uploadProfilePictureMiddleware.single(
    "profilePicture"
  ),
  uploadProfilePicture
);

/* =====================================================
   NOTIFICATION SETTINGS
===================================================== */

router.get(
  "/notifications",
  authMiddleware,
  getNotificationSettings
);

router.patch(
  "/notifications",
  authMiddleware,
  updateNotificationSettings
);

module.exports = router;