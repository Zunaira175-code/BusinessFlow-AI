const express = require("express");

const {
  getMyCalendarEvents,
  getMyTodaySchedule,
  getMyUpcomingEvents,
  getMyCalendarTasksDue,
  getCalendarEventById,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} = require("../controllers/calendarController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// EMPLOYEE CALENDAR
// =====================================================

// Calendar Grid
router.get(
  "/me/events",
  authMiddleware,
  getMyCalendarEvents
);

// Today's Schedule
router.get(
  "/me/today",
  authMiddleware,
  getMyTodaySchedule
);

// Upcoming Events
router.get(
  "/me/upcoming",
  authMiddleware,
  getMyUpcomingEvents
);

// Tasks Due
router.get(
  "/me/tasks-due",
  authMiddleware,
  getMyCalendarTasksDue
);

// =====================================================
// EVENT CRUD
// =====================================================

// Create Event
router.post(
  "/events",
  authMiddleware,
  createCalendarEvent
);

// Get Event
router.get(
  "/events/:id",
  authMiddleware,
  getCalendarEventById
);

// Update Event
router.patch(
  "/events/:id",
  authMiddleware,
  updateCalendarEvent
);

// Delete Event
router.delete(
  "/events/:id",
  authMiddleware,
  deleteCalendarEvent
);

module.exports = router;