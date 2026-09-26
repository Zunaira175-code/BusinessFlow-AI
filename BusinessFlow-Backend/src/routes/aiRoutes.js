const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getDashboardAIInsights,
  getLeadAIInsights,
  getDealAIInsights,
  getReportAIInsights,
} = require("../controllers/aiController");

const router = express.Router();

// =====================================================
// DASHBOARD AI INSIGHTS
// POST /api/ai/dashboard-insights
// =====================================================

router.post(
  "/dashboard-insights",
  authMiddleware,
  getDashboardAIInsights
);

// =====================================================
// LEADS AI INSIGHTS
// POST /api/ai/leads-insights
// =====================================================

router.post(
  "/leads-insights",
  authMiddleware,
  getLeadAIInsights
);

// =====================================================
// DEALS AI INSIGHTS
// POST /api/ai/deals-insights
// =====================================================

router.post(
  "/deals-insights",
  authMiddleware,
  getDealAIInsights
);

// =====================================================
// REPORTS AI INSIGHTS
// POST /api/ai/reports-insights
// =====================================================

router.post(
  "/reports-insights",
  authMiddleware,
  getReportAIInsights
);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;