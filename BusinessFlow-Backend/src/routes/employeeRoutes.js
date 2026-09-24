const express = require("express");

const {
  getEmployeeStats,
  getMyEmployeeStats,
  getEmployees,
  createEmployee,
  verifyInvitation,
  acceptInvitation,
} = require("../controllers/employeeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// GET EMPLOYEES
// ADMIN ONLY
// =====================================================

router.get(
  "/",
  authMiddleware,
  getEmployees
);

// =====================================================
// EMPLOYEE STATS
// ADMIN ONLY
// =====================================================

router.get(
  "/stats",
  authMiddleware,
  getEmployeeStats
);


// =====================================================
// MY EMPLOYEE DASHBOARD STATS
// AUTHENTICATED USER
// =====================================================

router.get(
  "/me/stats",
  authMiddleware,
  getMyEmployeeStats
);
// =====================================================
// CREATE EMPLOYEE
// ADMIN ONLY
// =====================================================

router.post(
  "/",
  authMiddleware,
  createEmployee
);

// =====================================================
// INVITATION
// PUBLIC
// =====================================================

router.get(
  "/invitation/:token",
  verifyInvitation
);

router.post(
  "/invitation/:token/accept",
  acceptInvitation
);

module.exports = router;