const express = require("express");

const router = express.Router();

// =====================================================
// CONTROLLERS
// =====================================================

const {
  getReportSummary,
  getSalesPerformance,
  getDealPipeline,
  getLeadConversionFunnel,
  getTeamPerformance,
  getRecentPerformance,
  getAIPerformanceAnalysis,
  exportReport,
} = require("../controllers/reportsController");

// =====================================================
// AUTH MIDDLEWARE
// =====================================================

const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// REPORT SUMMARY
// GET /api/reports/summary
// =====================================================

router.get(
  "/summary",
  authMiddleware,
  getReportSummary
);

// =====================================================
// SALES PERFORMANCE
// GET /api/reports/sales-performance
// =====================================================

router.get(
  "/sales-performance",
  authMiddleware,
  getSalesPerformance
);

// =====================================================
// DEAL PIPELINE
// GET /api/reports/deal-pipeline
// =====================================================

router.get(
  "/deal-pipeline",
  authMiddleware,
  getDealPipeline
);

// =====================================================
// LEAD CONVERSION FUNNEL
// GET /api/reports/lead-funnel
// =====================================================

router.get(
  "/lead-funnel",
  authMiddleware,
  getLeadConversionFunnel
);

// =====================================================
// TEAM PERFORMANCE
// GET /api/reports/team-performance
// =====================================================

router.get(
  "/team-performance",
  authMiddleware,
  getTeamPerformance
);

// =====================================================
// RECENT PERFORMANCE
// GET /api/reports/recent-performance
// =====================================================

router.get(
  "/recent-performance",
  authMiddleware,
  getRecentPerformance
);

// =====================================================
// AI PERFORMANCE ANALYSIS
// GET /api/reports/ai-analysis
// =====================================================

router.get(
  "/ai-analysis",
  authMiddleware,
  getAIPerformanceAnalysis
);

// =====================================================
// EXPORT REPORT
// GET /api/reports/export
// =====================================================

router.get(
  "/export",
  authMiddleware,
  exportReport
);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;