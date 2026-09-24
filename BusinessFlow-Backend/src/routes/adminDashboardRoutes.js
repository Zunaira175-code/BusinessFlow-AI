const express = require("express");

const {
  getDashboardStats,
  getPipelineStats,
  getActivityFeed,
  getTeamPerformance,
  getIntelligenceSummary,
  getInsightCards,
} = require("../controllers/adminDashboardController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/stats",
  authMiddleware,
  getDashboardStats
);

router.get(
  "/pipeline",
  authMiddleware,
  getPipelineStats
);

router.get(
  "/activity",
  authMiddleware,
  getActivityFeed
);

router.get(
  "/team-performance",
  authMiddleware,
  getTeamPerformance
);

router.get(
  "/intelligence",
  authMiddleware,
  getIntelligenceSummary
);

router.get(
  "/insights",
  authMiddleware,
  getInsightCards
);

module.exports = router;