const express = require("express");

const {
  // Existing customer APIs
  getCustomerStats,
  getCustomers,
  getCustomerById,
  createCustomer,
  getCustomerHealth,
  getRecentCustomerActivity,

  // Employee customer APIs
  getMyCustomerStats,
  getMyCustomers,
  getMyCustomerById,
  getMyCustomerActivity,
  getMyUpcomingFollowUps,
} = require("../controllers/customerController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// EMPLOYEE CUSTOMER STATS
// GET /api/customers/me/stats
// =====================================================

router.get(
  "/me/stats",
  authMiddleware,
  getMyCustomerStats
);

// =====================================================
// EMPLOYEE CUSTOMER DIRECTORY
// GET /api/customers/me
// =====================================================

router.get(
  "/me",
  authMiddleware,
  getMyCustomers
);

// =====================================================
// EMPLOYEE CUSTOMER ACTIVITY
// GET /api/customers/me/activity
// =====================================================

router.get(
  "/me/activity",
  authMiddleware,
  getMyCustomerActivity
);

// =====================================================
// EMPLOYEE UPCOMING FOLLOW-UPS
// GET /api/customers/me/follow-ups
// =====================================================

router.get(
  "/me/follow-ups",
  authMiddleware,
  getMyUpcomingFollowUps
);

// =====================================================
// EMPLOYEE CUSTOMER BY ID
// GET /api/customers/me/:id
// =====================================================

router.get(
  "/me/:id",
  authMiddleware,
  getMyCustomerById
);

// =====================================================
// CUSTOMER STATS
// GET /api/customers/stats
// =====================================================

router.get(
  "/stats",
  authMiddleware,
  getCustomerStats
);

// =====================================================
// CUSTOMER HEALTH
// GET /api/customers/health
// =====================================================

router.get(
  "/health",
  authMiddleware,
  getCustomerHealth
);

// =====================================================
// RECENT CUSTOMER ACTIVITY
// GET /api/customers/activity
// =====================================================

router.get(
  "/activity",
  authMiddleware,
  getRecentCustomerActivity
);

// =====================================================
// CUSTOMER DIRECTORY
// GET /api/customers
// =====================================================

router.get(
  "/",
  authMiddleware,
  getCustomers
);

// =====================================================
// CREATE CUSTOMER
// POST /api/customers
// =====================================================

router.post(
  "/",
  authMiddleware,
  createCustomer
);

// =====================================================
// CUSTOMER BY ID
// GET /api/customers/:id
// =====================================================

router.get(
  "/:id",
  authMiddleware,
  getCustomerById
);

module.exports = router;