const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  // =====================================================
  // ADMIN / GENERAL LEAD CONTROLLERS
  // =====================================================

  getLeadStats,
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,

  // =====================================================
  // EMPLOYEE LEAD CONTROLLERS
  // =====================================================

  getMyLeads,
  getMyLeadStats,
  getMyLeadPipeline,
  getMyLeadActivity,
} = require("../controllers/leadController");

// =====================================================
// EMPLOYEE LEAD STATS
// GET /api/leads/me/stats
// =====================================================

router.get(
  "/me/stats",
  authMiddleware,
  getMyLeadStats
);

// =====================================================
// EMPLOYEE LEAD PIPELINE
// GET /api/leads/me/pipeline
// =====================================================

router.get(
  "/me/pipeline",
  authMiddleware,
  getMyLeadPipeline
);

// =====================================================
// EMPLOYEE LEAD ACTIVITY
// GET /api/leads/me/activity
// =====================================================

router.get(
  "/me/activity",
  authMiddleware,
  getMyLeadActivity
);

// =====================================================
// EMPLOYEE MY LEADS
// GET /api/leads/me
// =====================================================

router.get(
  "/me",
  authMiddleware,
  getMyLeads
);

// =====================================================
// LEAD STATS
// GET /api/leads/stats
// =====================================================

router.get(
  "/stats",
  authMiddleware,
  getLeadStats
);

// =====================================================
// GET ALL LEADS
// GET /api/leads
// =====================================================

router.get(
  "/",
  authMiddleware,
  getLeads
);

// =====================================================
// GET SINGLE LEAD
// GET /api/leads/:id
// =====================================================

router.get(
  "/:id",
  authMiddleware,
  getLeadById
);

// =====================================================
// CREATE LEAD
// POST /api/leads
// =====================================================

router.post(
  "/",
  authMiddleware,
  createLead
);

// =====================================================
// UPDATE LEAD
// PUT /api/leads/:id
// =====================================================

router.put(
  "/:id",
  authMiddleware,
  updateLead
);

// =====================================================
// DELETE LEAD
// DELETE /api/leads/:id
// =====================================================

router.delete(
  "/:id",
  authMiddleware,
  deleteLead
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;