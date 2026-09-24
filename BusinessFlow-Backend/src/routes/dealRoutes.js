const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  // =====================================================
  // EMPLOYEE DEAL CONTROLLERS
  // =====================================================

  getMyDealStats,
  getMyDeals,
  getMyDealById,

  // =====================================================
  // ADMIN DEAL CONTROLLERS
  // =====================================================

  getDealStats,
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
} = require("../controllers/dealController");

// =====================================================
// EMPLOYEE DEAL STATS
// GET /api/deals/me/stats
// =====================================================

router.get(
  "/me/stats",
  authMiddleware,
  getMyDealStats
);

// =====================================================
// EMPLOYEE MY DEALS
// GET /api/deals/me
// =====================================================

router.get(
  "/me",
  authMiddleware,
  getMyDeals
);

// =====================================================
// EMPLOYEE SINGLE DEAL
// GET /api/deals/me/:id
// =====================================================

router.get(
  "/me/:id",
  authMiddleware,
  getMyDealById
);

// =====================================================
// ADMIN DEAL STATS
// GET /api/deals/stats
// =====================================================

router.get(
  "/stats",
  authMiddleware,
  getDealStats
);

// =====================================================
// ADMIN / GENERAL DEALS
// GET /api/deals
// =====================================================

router.get(
  "/",
  authMiddleware,
  getDeals
);

// =====================================================
// ADMIN SINGLE DEAL
// GET /api/deals/:id
// =====================================================

router.get(
  "/:id",
  authMiddleware,
  getDealById
);

// =====================================================
// CREATE DEAL
// POST /api/deals
// =====================================================

router.post(
  "/",
  authMiddleware,
  createDeal
);

// =====================================================
// UPDATE DEAL
// PUT /api/deals/:id
// =====================================================

router.put(
  "/:id",
  authMiddleware,
  updateDeal
);

// =====================================================
// DELETE DEAL
// DELETE /api/deals/:id
// =====================================================

router.delete(
  "/:id",
  authMiddleware,
  deleteDeal
);

module.exports = router;