const express = require("express");

const {
  getTasks,
  getTaskById,
  getTaskStats,

  getMyTaskStats,
  getMyUpcomingTasks,
  getMyTaskAIFocus,

  createTask,
  updateTask,
  completeTask,
  reassignTask,
  deleteTask,
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// EMPLOYEE TASK ROUTES
// =====================================================

router.get(
  "/me/stats",
  authMiddleware,
  getMyTaskStats
);

router.get(
  "/me/upcoming",
  authMiddleware,
  getMyUpcomingTasks
);

router.get(
  "/me/ai-focus",
  authMiddleware,
  getMyTaskAIFocus
);

// =====================================================
// GENERAL TASK ROUTES
// =====================================================

router.get(
  "/stats",
  authMiddleware,
  getTaskStats
);

router.get(
  "/",
  authMiddleware,
  getTasks
);

router.post(
  "/",
  authMiddleware,
  createTask
);

router.get(
  "/:id",
  authMiddleware,
  getTaskById
);

router.patch(
  "/:id/complete",
  authMiddleware,
  completeTask
);

router.patch(
  "/:id/reassign",
  authMiddleware,
  reassignTask
);

router.patch(
  "/:id",
  authMiddleware,
  updateTask
);

router.delete(
  "/:id",
  authMiddleware,
  deleteTask
);

module.exports = router;