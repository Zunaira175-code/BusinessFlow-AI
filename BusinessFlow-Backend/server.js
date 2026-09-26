require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./src/config/db");

// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./src/routes/authRoutes");
const employeeRoutes = require("./src/routes/employeeRoutes");
const adminDashboardRoutes = require("./src/routes/adminDashboardRoutes");
const leadRoutes = require("./src/routes/LeadRoutes");
const dealRoutes = require("./src/routes/dealRoutes");
const reportsRoutes = require("./src/routes/reportsRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const customerRoutes = require("./src/routes/customerRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const calendarRoutes = require("./src/routes/calendarRoutes");
const settingsRoutes = require("./src/routes/settingsRoutes");
const integrationRoutes = require("./src/routes/integrationRoutes");

// =====================================================
// AI ROUTES
// =====================================================

const aiRoutes = require("./src/routes/aiRoutes");

// =====================================================
// APP
// =====================================================

const app = express();

// =====================================================
// DATABASE
// =====================================================

connectDB();

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // Example: Postman / server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);

      return callback(
        new Error(`CORS blocked origin: ${origin}`)
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
    ],

    // Bearer token authentication
    // Cookies are not required
    credentials: false,
  })
);

// =====================================================
// BODY PARSER
// =====================================================

app.use(express.json());

// =====================================================
// STATIC UPLOADS
// =====================================================
//
// Uploaded files are stored inside:
//
// BusinessFlow-Backend/
// └── uploads/
//     └── profile-pictures/
//
// They are accessible through:
//
// http://localhost:5000/uploads/profile-pictures/filename.jpg
//
// =====================================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// =====================================================
// API ROUTES
// =====================================================

// =====================================================
// AUTHENTICATION
// =====================================================
//
// Base:
// /api/auth
//
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);

// =====================================================
// EMPLOYEES
// =====================================================
//
// Base:
// /api/employees
//
// =====================================================

app.use(
  "/api/employees",
  employeeRoutes
);

// =====================================================
// ADMIN DASHBOARD
// =====================================================
//
// Base:
// /api/admin/dashboard
//
// =====================================================

app.use(
  "/api/admin/dashboard",
  adminDashboardRoutes
);

// =====================================================
// ADMIN LEADS
// =====================================================
//
// Base:
// /api/admin/leads
//
// =====================================================

app.use(
  "/api/admin/leads",
  leadRoutes
);

// =====================================================
// EMPLOYEE LEADS
// =====================================================
//
// Base:
// /api/leads
//
// Employee endpoints:
//
// GET /api/leads/me
// GET /api/leads/me/stats
// GET /api/leads/me/pipeline
// GET /api/leads/me/activity
//
// =====================================================

app.use(
  "/api/leads",
  leadRoutes
);

// =====================================================
// ADMIN DEALS
// =====================================================
//
// Base:
// /api/admin/deals
//
// Admin endpoints:
//
// GET    /api/admin/deals/stats
// GET    /api/admin/deals
// GET    /api/admin/deals/:id
// POST   /api/admin/deals
// PUT    /api/admin/deals/:id
// DELETE /api/admin/deals/:id
//
// =====================================================

app.use(
  "/api/admin/deals",
  dealRoutes
);

// =====================================================
// EMPLOYEE DEALS
// =====================================================
//
// Base:
// /api/deals
//
// Employee endpoints:
//
// GET /api/deals/me
// GET /api/deals/me/stats
// GET /api/deals/me/:id
//
// =====================================================

app.use(
  "/api/deals",
  dealRoutes
);

// =====================================================
// REPORTS
// =====================================================
//
// Base:
// /api/reports
//
// =====================================================

app.use(
  "/api/reports",
  reportsRoutes
);

// =====================================================
// NOTIFICATIONS
// =====================================================
//
// Base:
// /api/notifications
//
// =====================================================

app.use(
  "/api/notifications",
  notificationRoutes
);

// =====================================================
// CUSTOMERS
// =====================================================
//
// Base:
// /api/customers
//
// =====================================================

app.use(
  "/api/customers",
  customerRoutes
);

// =====================================================
// TASKS
// =====================================================
//
// Base:
// /api/tasks
//
// =====================================================

app.use(
  "/api/tasks",
  taskRoutes
);

// =====================================================
// CALENDAR
// =====================================================
//
// Base:
// /api/calendar
//
// Employee endpoints:
//
// GET    /api/calendar/me/events
// GET    /api/calendar/me/today
// GET    /api/calendar/me/upcoming
// GET    /api/calendar/me/tasks-due
//
// Event endpoints:
//
// POST   /api/calendar/events
// GET    /api/calendar/events/:id
// PATCH  /api/calendar/events/:id
// DELETE /api/calendar/events/:id
//
// =====================================================

app.use(
  "/api/calendar",
  calendarRoutes
);

// =====================================================
// SETTINGS
// =====================================================
//
// Base:
// /api/settings
//
// General:
//
// GET   /api/settings/general
// PATCH /api/settings/general
//
// Account:
//
// GET   /api/settings/account
// PATCH /api/settings/account
//
// Profile Picture:
//
// POST  /api/settings/account/profile-picture
//
// Notifications:
//
// GET   /api/settings/notifications
// PATCH /api/settings/notifications
//
// =====================================================

app.use(
  "/api/settings",
  settingsRoutes
);

// =====================================================
// INTEGRATIONS
// =====================================================
//
// Base:
// /api/integrations
//
// GET    /api/integrations
// GET    /api/integrations/available
// POST   /api/integrations/connect
// PATCH  /api/integrations/:id
// DELETE /api/integrations/:id
//
// =====================================================

app.use(
  "/api/integrations",
  integrationRoutes
);

// =====================================================
// AI
// =====================================================
//
// Base:
// /api/ai
//
// Dashboard AI:
//
// POST /api/ai/dashboard-insights
//
// =====================================================

app.use(
  "/api/ai",
  aiRoutes
);

// =====================================================
// HEALTH / TEST ROUTE
// =====================================================

app.get(
  "/",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "BusinessFlow AI Backend is running",
    });
  }
);

// =====================================================
// 404 HANDLER
// =====================================================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
      path: req.originalUrl,
    });
  }
);

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (err, req, res, next) => {
    console.error(
      "Server Error:",
      err
    );

    // ===================================================
    // CORS ERROR
    // ===================================================

    if (
      err.message?.startsWith(
        "CORS blocked origin"
      )
    ) {
      return res.status(403).json({
        success: false,
        message: err.message,
      });
    }

    // ===================================================
    // GENERAL SERVER ERROR
    // ===================================================

    return res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
);

// =====================================================
// SERVER
// =====================================================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(
      `BusinessFlow AI Backend running on port ${PORT}`
    );

    console.log(
      `Uploads available at: http://localhost:${PORT}/uploads`
    );

    console.log(
      `Integrations API: http://localhost:${PORT}/api/integrations`
    );

    console.log(
      `AI API: http://localhost:${PORT}/api/ai`
    );
  }
);