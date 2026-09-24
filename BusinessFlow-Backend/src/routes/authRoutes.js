const express = require("express");

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// PUBLIC AUTH ROUTES
// =====================================================

router.post("/register", register);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

// =====================================================
// PROTECTED ROUTE
// =====================================================

router.get("/me", authMiddleware, getMe);

module.exports = router;