const express = require("express");

const {
  getNotifications,
  getNotificationStats,
  getUpcomingReminders,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getNotificationPreferences,
  updateNotificationPreferences,
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// NOTIFICATION STATS
// GET /api/notifications/stats
// =====================================================

router.get(
  "/stats",
  authMiddleware,
  getNotificationStats
);

// =====================================================
// UPCOMING REMINDERS
// GET /api/notifications/reminders
// =====================================================

router.get(
  "/reminders",
  authMiddleware,
  getUpcomingReminders
);

// =====================================================
// NOTIFICATION PREFERENCES
// GET /api/notifications/preferences
// =====================================================

router.get(
  "/preferences",
  authMiddleware,
  getNotificationPreferences
);

// =====================================================
// UPDATE NOTIFICATION PREFERENCES
// PATCH /api/notifications/preferences
// =====================================================

router.patch(
  "/preferences",
  authMiddleware,
  updateNotificationPreferences
);

// =====================================================
// MARK ALL AS READ
// PATCH /api/notifications/read-all
// =====================================================

router.patch(
  "/read-all",
  authMiddleware,
  markAllNotificationsAsRead
);

// =====================================================
// GET MY NOTIFICATIONS
// GET /api/notifications
// =====================================================
//
// Supported:
//
// ?search=proposal
// ?type=lead
// ?status=unread
// ?date=today
// ?page=1
// ?limit=20
//
// =====================================================

router.get(
  "/",
  authMiddleware,
  getNotifications
);

// =====================================================
// MARK SINGLE NOTIFICATION AS READ
// PATCH /api/notifications/:id/read
// =====================================================

router.patch(
  "/:id/read",
  authMiddleware,
  markNotificationAsRead
);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;