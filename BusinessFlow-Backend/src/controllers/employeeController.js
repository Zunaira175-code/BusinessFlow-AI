const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Lead = require("../models/Lead");
const Deal = require("../models/Deal");
const Task = require("../models/Task");
const Customer = require("../models/Customer");

// =====================================================
// CONSTANTS
// =====================================================

const INVITATION_EXPIRY_HOURS = 48;

const allowedWorkStatuses = [
  "active",
  "on_leave",
];

// =====================================================
// HELPERS
// =====================================================

const getCompanyId = (req) => {
  if (!req.user?.companyId) {
    return null;
  }

  return (
    req.user.companyId._id ||
    req.user.companyId
  );
};

const getUserId = (req) => {
  return req.user?._id || null;
};

const isAdmin = (req) => {
  return req.user?.role === "admin";
};

const getFrontendUrl = () => {
  return (
    process.env.FRONTEND_URL ||
    "http://localhost:5173"
  ).replace(/\/$/, "");
};

const formatEmployee = (employee) => {
  if (!employee) {
    return null;
  }

  return {
    _id: employee._id,

    firstName:
      employee.firstName || "",

    lastName:
      employee.lastName || "",

    name:
      `${employee.firstName || ""} ${
        employee.lastName || ""
      }`.trim(),

    email:
      employee.email || "",

    role:
      employee.role || "employee",

    department:
      employee.department || null,

    jobTitle:
      employee.jobTitle || null,

    phone:
      employee.phone || null,

    isActive:
      employee.isActive === true,

    workStatus:
      employee.workStatus || "active",

    invitationAcceptedAt:
      employee.invitationAcceptedAt ||
      null,

    createdAt:
      employee.createdAt || null,

    updatedAt:
      employee.updatedAt || null,

    // Temporary metrics.
    // These can later be connected
    // with Leads / Deals / Revenue.
    leads:
      employee.leads || 0,

    deals:
      employee.deals || 0,

    revenue:
      employee.revenue || "$0",
  };
};

const normalizeEmail = (email) => {
  return String(email || "")
    .trim()
    .toLowerCase();
};

const normalizeName = (value) => {
  return String(value || "")
    .trim();
};

const validateEmployeeFields = ({
  firstName,
  lastName,
  email,
}) => {
  if (!firstName) {
    return "First name is required.";
  }

  if (!lastName) {
    return "Last name is required.";
  }

  if (!email) {
    return "Email is required.";
  }

  if (firstName.length < 2) {
    return "First name must be at least 2 characters.";
  }

  if (lastName.length < 2) {
    return "Last name must be at least 2 characters.";
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Please provide a valid email address.";
  }

  return null;
};

const generateInvitation = () => {
  const token =
    crypto
      .randomBytes(32)
      .toString("hex");

  const tokenHash =
    crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

  const expiresAt =
    new Date(
      Date.now() +
        INVITATION_EXPIRY_HOURS *
          60 *
          60 *
          1000
    );

  return {
    token,
    tokenHash,
    expiresAt,
  };
};

// =====================================================
// ADMIN CHECK HELPER
// =====================================================

const requireAdmin = (req, res) => {
  if (!isAdmin(req)) {
    res.status(403).json({
      success: false,
      message:
        "Only administrators can manage employees.",
    });

    return false;
  }

  return true;
};

// =====================================================
// GET EMPLOYEE STATISTICS
// GET /api/employees/stats
// ADMIN ONLY
// =====================================================

const getEmployeeStats = async (
  req,
  res
) => {
  try {
    if (!requireAdmin(req, res)) {
      return;
    }

    const companyId =
      getCompanyId(req);

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing.",
      });
    }

    const startOfMonth =
      new Date();

    startOfMonth.setDate(1);
    startOfMonth.setHours(
      0,
      0,
      0,
      0
    );

    const [
      totalEmployees,
      activeEmployees,
      onLeave,
      pendingInvitations,
      newThisMonth,
    ] = await Promise.all([
      User.countDocuments({
        companyId,
        role: "employee",
      }),

      User.countDocuments({
        companyId,
        role: "employee",
        isActive: true,
        workStatus: "active",
      }),

      User.countDocuments({
        companyId,
        role: "employee",
        workStatus: "on_leave",
      }),

      User.countDocuments({
        companyId,
        role: "employee",
        isActive: false,
        invitationAcceptedAt: null,
        invitationExpiresAt: {
          $gt: new Date(),
        },
      }),

      User.countDocuments({
        companyId,
        role: "employee",
        createdAt: {
          $gte: startOfMonth,
        },
      }),
    ]);

    const activePercentage =
      totalEmployees > 0
        ? Math.round(
            (activeEmployees /
              totalEmployees) *
              100
          )
        : 0;

    return res.status(200).json({
      success: true,

      message:
        "Employee statistics fetched successfully.",

      data: {
        totalEmployees: {
          value:
            totalEmployees,
        },

        activeEmployees: {
          value:
            activeEmployees,

          percentage:
            activePercentage,
        },

        onLeave: {
          value:
            onLeave,
        },

        pendingInvitations: {
          value:
            pendingInvitations,
        },

        newThisMonth: {
          value:
            newThisMonth,
        },
      },
    });
  } catch (error) {
    console.error(
      "Get Employee Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch employee statistics.",
    });
  }
};

// =====================================================
// GET MY EMPLOYEE DASHBOARD STATISTICS
// GET /api/employees/me/stats
// AUTHENTICATED EMPLOYEE / ADMIN
// =====================================================

const getMyEmployeeStats = async (req, res) => {
  try {
    // ===================================================
    // LOGGED-IN USER
    // ===================================================

    const userId = getUserId(req);
    const companyId = getCompanyId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user information is missing.",
      });
    }

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company information is missing.",
      });
    }

    // ===================================================
    // FETCH PERSONAL STATS
    // ===================================================

    const [
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      totalLeads,
      totalDeals,
      wonDeals,
      revenueData,
      totalCustomers,
    ] = await Promise.all([
      // -----------------------------------------------
      // MY TASKS
      // -----------------------------------------------

      Task.countDocuments({
        companyId,
        assignedTo: userId,
      }),

      // -----------------------------------------------
      // PENDING TASKS
      // -----------------------------------------------

      Task.countDocuments({
        companyId,
        assignedTo: userId,
        status: "Pending",
      }),

      // -----------------------------------------------
      // IN PROGRESS TASKS
      // -----------------------------------------------

      Task.countDocuments({
        companyId,
        assignedTo: userId,
        status: "In Progress",
      }),

      // -----------------------------------------------
      // COMPLETED TASKS
      // -----------------------------------------------

      Task.countDocuments({
        companyId,
        assignedTo: userId,
        status: "Completed",
      }),

      // -----------------------------------------------
      // MY LEADS
      // -----------------------------------------------

      Lead.countDocuments({
        companyId,
        assignedTo: userId,
      }),

      // -----------------------------------------------
      // MY DEALS
      // Open + Won
      // -----------------------------------------------

      Deal.countDocuments({
        companyId,
        assignedTo: userId,
        status: {
          $in: ["Open", "Won"],
        },
      }),

      // -----------------------------------------------
      // WON DEALS
      // -----------------------------------------------

      Deal.countDocuments({
        companyId,
        assignedTo: userId,
        status: "Won",
      }),

      // -----------------------------------------------
      // MY REVENUE
      // Won deals only
      // -----------------------------------------------

      Deal.aggregate([
        {
          $match: {
            companyId,
            assignedTo: userId,
            status: "Won",
          },
        },
        {
          $group: {
            _id: null,
            revenue: {
              $sum: "$value",
            },
          },
        },
      ]),

      // -----------------------------------------------
      // MY CUSTOMERS
      // -----------------------------------------------

      Customer.countDocuments({
        companyId,
        accountManager: userId,
      }),
    ]);

    // ===================================================
    // REVENUE
    // ===================================================

    const myRevenue =
      revenueData?.[0]?.revenue || 0;

    const revenueFormatted =
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(myRevenue);

    // ===================================================
    // TASK COMPLETION %
    // ===================================================

    const taskCompletionPercentage =
      totalTasks > 0
        ? Math.round(
            (completedTasks / totalTasks) * 100
          )
        : 0;

    // ===================================================
    // RESPONSE
    // ===================================================

    return res.status(200).json({
      success: true,

      message:
        "Employee dashboard statistics fetched successfully.",

      data: {
        myTasks: {
          value: totalTasks,
          pending: pendingTasks,
          inProgress: inProgressTasks,
          completed: completedTasks,
          completionPercentage:
            taskCompletionPercentage,
        },

        myLeads: {
          value: totalLeads,
        },

        myDeals: {
          value: totalDeals,
          won: wonDeals,
        },

        myRevenue: {
          value: myRevenue,
          formatted: revenueFormatted,
        },

        myCustomers: {
          value: totalCustomers,
        },
      },
    });
  } catch (error) {
    console.error(
      "Get My Employee Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch your dashboard statistics.",
    });
  }
};
// =====================================================
// GET EMPLOYEES
// ADMIN ONLY
// GET /api/employees
// =====================================================

const getEmployees = async (req, res) => {
  try {
    // =====================================================
    // ADMIN CHECK
    // =====================================================

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Only administrators can view employees.",
      });
    }

    // =====================================================
    // COMPANY
    // =====================================================

    const companyId =
      req.user.companyId?._id ||
      req.user.companyId;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing.",
      });
    }

    // =====================================================
    // QUERY PARAMETERS
    // =====================================================

    const {
      search = "",
      role = "",
      department = "",
      status = "",
      performance = "",
      page = 1,
      limit = 10,
    } = req.query;

    // =====================================================
    // BASE FILTER
    // =====================================================

    const filter = {
      companyId,
      role: "employee",
    };

    // =====================================================
    // SEARCH
    // Name / Email / Job Title
    // =====================================================

    if (search.trim()) {
      const searchRegex = {
        $regex: search.trim(),
        $options: "i",
      };

      filter.$or = [
        {
          firstName: searchRegex,
        },
        {
          lastName: searchRegex,
        },
        {
          email: searchRegex,
        },
        {
          jobTitle: searchRegex,
        },
      ];
    }

    // =====================================================
    // ROLE FILTER
    // =====================================================

    if (role.trim()) {
      filter.jobTitle = {
        $regex: `^${role.trim()}$`,
        $options: "i",
      };
    }

    // =====================================================
    // DEPARTMENT FILTER
    // =====================================================

    if (department.trim()) {
      filter.department = {
        $regex: `^${department.trim()}$`,
        $options: "i",
      };
    }

    // =====================================================
    // STATUS FILTER
    // =====================================================

    if (status === "active") {
      filter.isActive = true;
      filter.workStatus = "active";
    }

    if (status === "on_leave") {
      filter.workStatus = "on_leave";
    }

    if (status === "inactive") {
      filter.isActive = false;
    }

    // =====================================================
    // PAGINATION
    // =====================================================

    const pageNumber = Math.max(
      Number(page) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(Number(limit) || 10, 1),
      100
    );

    const skip =
      (pageNumber - 1) *
      limitNumber;

    // =====================================================
    // FETCH EMPLOYEES
    // =====================================================

    const employees =
      await User.find(filter)
        .select(
          "-password " +
          "-invitationTokenHash " +
          "-invitationExpiresAt " +
          "-resetPasswordTokenHash " +
          "-resetPasswordExpiresAt"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber)
        .lean();

    // =====================================================
    // TOTAL EMPLOYEES
    // =====================================================

    const total =
      await User.countDocuments(
        filter
      );

    // =====================================================
    // IMPORT MODELS
    // =====================================================

    const Lead =
      require("../models/Lead");

    const Deal =
      require("../models/Deal");

    // =====================================================
    // EMPLOYEE METRICS
    // =====================================================

    const employeeIds =
      employees.map(
        (employee) =>
          employee._id
      );

    // =====================================================
    // LEAD COUNTS
    // =====================================================

    const leadCounts =
      await Lead.aggregate([
        {
          $match: {
            companyId,
            assignedTo: {
              $in: employeeIds,
            },
          },
        },

        {
          $group: {
            _id: "$assignedTo",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    // =====================================================
    // DEAL COUNTS
    // =====================================================

    const dealCounts =
      await Deal.aggregate([
        {
          $match: {
            companyId,
            assignedTo: {
              $in: employeeIds,
            },
            status: {
              $in: [
                "Open",
                "Won",
              ],
            },
          },
        },

        {
          $group: {
            _id: "$assignedTo",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    // =====================================================
    // YTD REVENUE
    // =====================================================

    const now =
      new Date();

    const startOfYear =
      new Date(
        now.getFullYear(),
        0,
        1
      );

    const revenueData =
      await Deal.aggregate([
        {
          $match: {
            companyId,

            assignedTo: {
              $in: employeeIds,
            },

            status: "Won",

            updatedAt: {
              $gte: startOfYear,
            },
          },
        },

        {
          $group: {
            _id: "$assignedTo",

            revenue: {
              $sum: "$value",
            },
          },
        },
      ]);

    // =====================================================
    // MAP METRICS
    // =====================================================

    const leadMap =
      new Map();

    leadCounts.forEach(
      (item) => {
        leadMap.set(
          String(item._id),
          item.count
        );
      }
    );

    const dealMap =
      new Map();

    dealCounts.forEach(
      (item) => {
        dealMap.set(
          String(item._id),
          item.count
        );
      }
    );

    const revenueMap =
      new Map();

    revenueData.forEach(
      (item) => {
        revenueMap.set(
          String(item._id),
          item.revenue
        );
      }
    );

    // =====================================================
    // FORMAT EMPLOYEES
    // =====================================================

    let formattedEmployees =
      employees.map(
        (employee) => {
          const employeeId =
            String(
              employee._id
            );

          const leads =
            leadMap.get(
              employeeId
            ) || 0;

          const deals =
            dealMap.get(
              employeeId
            ) || 0;

          const revenue =
            revenueMap.get(
              employeeId
            ) || 0;

          // ---------------------------------------------
          // PERFORMANCE SCORE
          // ---------------------------------------------

          const performanceScore =
            leads +
            deals * 2 +
            revenue / 10000;

          let performanceLevel =
            "average";

          if (
            performanceScore >= 15
          ) {
            performanceLevel =
              "top";
          } else if (
            performanceScore < 5
          ) {
            performanceLevel =
              "low";
          }

          return {
            _id:
              employee._id,

            firstName:
              employee.firstName,

            lastName:
              employee.lastName,

            email:
              employee.email,

            role:
              employee.role,

            department:
              employee.department,

            jobTitle:
              employee.jobTitle,

            phone:
              employee.phone,

            isActive:
              employee.isActive,

            workStatus:
              employee.workStatus,

            createdAt:
              employee.createdAt,

            // -------------------------------------------
            // REAL METRICS
            // -------------------------------------------

            leads,

            deals,

            revenue,

            revenueFormatted:
              new Intl.NumberFormat(
                "en-US",
                {
                  style:
                    "currency",
                  currency:
                    "USD",
                  maximumFractionDigits: 0,
                }
              ).format(
                revenue
              ),

            performance:
              performanceLevel,

            performanceScore:
              Math.round(
                performanceScore *
                  100
              ) / 100,
          };
        }
      );

    // =====================================================
    // PERFORMANCE FILTER
    // =====================================================

    if (
      [
        "top",
        "average",
        "low",
      ].includes(
        performance
      )
    ) {
      formattedEmployees =
        formattedEmployees.filter(
          (employee) =>
            employee.performance ===
            performance
        );
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      message:
        "Employees fetched successfully.",

      data: {
        employees:
          formattedEmployees,

        total:
          performance
            ? formattedEmployees.length
            : total,

        page:
          pageNumber,

        limit:
          limitNumber,

        totalPages:
          Math.ceil(
            (
              performance
                ? formattedEmployees.length
                : total
            ) /
              limitNumber
          ),
      },
    });
  } catch (error) {
    console.error(
      "Get Employees Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch employees.",
    });
  }
};

// =====================================================
// GET SINGLE EMPLOYEE
// GET /api/employees/:id
// ADMIN ONLY
// =====================================================

const getEmployeeById = async (
  req,
  res
) => {
  try {
    if (!requireAdmin(req, res)) {
      return;
    }

    const companyId =
      getCompanyId(req);

    const {
      id,
    } = req.params;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing.",
      });
    }

    if (
      !id ||
      !require("mongoose")
        .Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid employee ID.",
      });
    }

    const employee =
      await User.findOne({
        _id: id,
        companyId,
        role: "employee",
      })
        .select(
          "-password " +
            "-invitationTokenHash " +
            "-invitationExpiresAt " +
            "-resetPasswordTokenHash " +
            "-resetPasswordExpiresAt"
        )
        .lean();

    if (!employee) {
      return res.status(404).json({
        success: false,
        message:
          "Employee not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Employee fetched successfully.",

      data: {
        employee:
          formatEmployee(
            employee
          ),
      },
    });
  } catch (error) {
    console.error(
      "Get Employee Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch employee.",
    });
  }
};

// =====================================================
// CREATE EMPLOYEE INVITATION
// POST /api/employees
// ADMIN ONLY
// =====================================================

const createEmployee = async (
  req,
  res
) => {
  try {
    if (!requireAdmin(req, res)) {
      return;
    }

    const companyId =
      getCompanyId(req);

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing.",
      });
    }

    const {
      firstName,
      lastName,
      email,
      department,
      jobTitle,
      phone,
    } = req.body;

    const cleanFirstName =
      normalizeName(
        firstName
      );

    const cleanLastName =
      normalizeName(
        lastName
      );

    const normalizedEmail =
      normalizeEmail(
        email
      );

    // ===================================================
    // VALIDATION
    // ===================================================

    const validationError =
      validateEmployeeFields({
        firstName:
          cleanFirstName,

        lastName:
          cleanLastName,

        email:
          normalizedEmail,
      });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message:
          validationError,
      });
    }

    // ===================================================
    // CHECK EXISTING EMAIL
    // ===================================================

    const existingUser =
      await User.findOne({
        email:
          normalizedEmail,
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    // ===================================================
    // GENERATE INVITATION
    // ===================================================

    const {
      token,
      tokenHash,
      expiresAt,
    } =
      generateInvitation();

    // ===================================================
    // CREATE EMPLOYEE
    // ===================================================

    const employee =
      await User.create({
        companyId,

        firstName:
          cleanFirstName,

        lastName:
          cleanLastName,

        email:
          normalizedEmail,

        password:
          null,

        role:
          "employee",

        department:
          normalizeName(
            department
          ) || null,

        jobTitle:
          normalizeName(
            jobTitle
          ) || null,

        phone:
          normalizeName(
            phone
          ) || null,

        // Cannot login
        // until invitation
        // is accepted.
        isActive:
          false,

        workStatus:
          "active",

        invitationTokenHash:
          tokenHash,

        invitationExpiresAt:
          expiresAt,

        invitationAcceptedAt:
          null,
      });

    // ===================================================
    // INVITATION LINK
    // ===================================================

    const invitationLink =
      `${getFrontendUrl()}/accept-invitation/${token}`;

    // ===================================================
    // RESPONSE
    // ===================================================

    return res.status(201).json({
      success: true,

      message:
        "Employee invitation created successfully.",

      data: {
        employee: {
          _id:
            employee._id,

          firstName:
            employee.firstName,

          lastName:
            employee.lastName,

          email:
            employee.email,

          role:
            employee.role,

          department:
            employee.department,

          jobTitle:
            employee.jobTitle,

          phone:
            employee.phone,

          isActive:
            employee.isActive,

          workStatus:
            employee.workStatus,

          invitationExpiresAt:
            employee.invitationExpiresAt,

          createdAt:
            employee.createdAt,
        },

        invitation: {
          link:
            invitationLink,

          expiresAt,

          expiresIn:
            `${INVITATION_EXPIRY_HOURS} hours`,
        },
      },
    });
  } catch (error) {
    console.error(
      "Create Employee Error:",
      error
    );

    if (
      error.code === 11000
    ) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    if (
      error.name ===
      "ValidationError"
    ) {
      const message =
        Object.values(
          error.errors || {}
        )
          .map(
            (item) =>
              item.message
          )
          .join(", ");

      return res.status(400).json({
        success: false,
        message:
          message ||
          "Employee validation failed.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while creating the employee invitation.",
    });
  }
};

// =====================================================
// UPDATE EMPLOYEE
// PATCH /api/employees/:id
// ADMIN ONLY
// =====================================================

const updateEmployee = async (
  req,
  res
) => {
  try {
    if (!requireAdmin(req, res)) {
      return;
    }

    const companyId =
      getCompanyId(req);

    const {
      id,
    } = req.params;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing.",
      });
    }

    if (
      !id ||
      !require("mongoose")
        .Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid employee ID.",
      });
    }

    const employee =
      await User.findOne({
        _id: id,
        companyId,
        role: "employee",
      });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message:
          "Employee not found.",
      });
    }

    const {
      firstName,
      lastName,
      email,
      department,
      jobTitle,
      phone,
      workStatus,
      isActive,
    } = req.body;

    // ===================================================
    // NAME
    // ===================================================

    if (
      firstName !==
      undefined
    ) {
      const value =
        normalizeName(
          firstName
        );

      if (value.length < 2) {
        return res.status(400).json({
          success: false,
          message:
            "First name must be at least 2 characters.",
        });
      }

      employee.firstName =
        value;
    }

    if (
      lastName !==
      undefined
    ) {
      const value =
        normalizeName(
          lastName
        );

      if (value.length < 2) {
        return res.status(400).json({
          success: false,
          message:
            "Last name must be at least 2 characters.",
        });
      }

      employee.lastName =
        value;
    }

    // ===================================================
    // EMAIL
    // ===================================================

    if (
      email !==
      undefined
    ) {
      const normalizedEmail =
        normalizeEmail(
          email
        );

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          normalizedEmail
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide a valid email address.",
        });
      }

      if (
        normalizedEmail !==
        employee.email
      ) {
        const existingUser =
          await User.findOne({
            email:
              normalizedEmail,

            _id: {
              $ne: employee._id,
            },
          });

        if (existingUser) {
          return res.status(409).json({
            success: false,
            message:
              "Another account with this email already exists.",
          });
        }

        employee.email =
          normalizedEmail;
      }
    }

    // ===================================================
    // OTHER FIELDS
    // ===================================================

    if (
      department !==
      undefined
    ) {
      employee.department =
        normalizeName(
          department
        ) || null;
    }

    if (
      jobTitle !==
      undefined
    ) {
      employee.jobTitle =
        normalizeName(
          jobTitle
        ) || null;
    }

    if (
      phone !==
      undefined
    ) {
      employee.phone =
        normalizeName(
          phone
        ) || null;
    }

    // ===================================================
    // WORK STATUS
    // ===================================================

    if (
      workStatus !==
      undefined
    ) {
      if (
        !allowedWorkStatuses.includes(
          workStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid employee work status.",
        });
      }

      employee.workStatus =
        workStatus;
    }

    // ===================================================
    // ACTIVE STATUS
    // ===================================================

    if (
      isActive !==
      undefined
    ) {
      if (
        typeof isActive !==
        "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "isActive must be a boolean value.",
        });
      }

      // Don't allow activating
      // an invitation that was
      // never accepted.
      if (
        isActive === true &&
        !employee.invitationAcceptedAt
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Employee must accept the invitation before the account can be activated.",
        });
      }

      employee.isActive =
        isActive;
    }

    await employee.save();

    const updatedEmployee =
      await User.findById(
        employee._id
      )
        .select(
          "-password " +
            "-invitationTokenHash " +
            "-invitationExpiresAt " +
            "-resetPasswordTokenHash " +
            "-resetPasswordExpiresAt"
        )
        .lean();

    return res.status(200).json({
      success: true,

      message:
        "Employee updated successfully.",

      data: {
        employee:
          formatEmployee(
            updatedEmployee
          ),
      },
    });
  } catch (error) {
    console.error(
      "Update Employee Error:",
      error
    );

    if (
      error.code === 11000
    ) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to update employee.",
    });
  }
};

// =====================================================
// RESEND INVITATION
// POST /api/employees/:id/resend-invitation
// ADMIN ONLY
// =====================================================

const resendInvitation = async (
  req,
  res
) => {
  try {
    if (!requireAdmin(req, res)) {
      return;
    }

    const companyId =
      getCompanyId(req);

    const {
      id,
    } = req.params;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing.",
      });
    }

    if (
      !id ||
      !require("mongoose")
        .Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid employee ID.",
      });
    }

    const employee =
      await User.findOne({
        _id: id,
        companyId,
        role: "employee",
      });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message:
          "Employee not found.",
      });
    }

    // Already accepted.
    if (
      employee.invitationAcceptedAt
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This employee has already accepted the invitation.",
      });
    }

    const {
      token,
      tokenHash,
      expiresAt,
    } =
      generateInvitation();

    employee.invitationTokenHash =
      tokenHash;

    employee.invitationExpiresAt =
      expiresAt;

    employee.invitationAcceptedAt =
      null;

    employee.isActive =
      false;

    await employee.save();

    const invitationLink =
      `${getFrontendUrl()}/accept-invitation/${token}`;

    return res.status(200).json({
      success: true,

      message:
        "Employee invitation resent successfully.",

      data: {
        employee: {
          _id:
            employee._id,

          firstName:
            employee.firstName,

          lastName:
            employee.lastName,

          email:
            employee.email,
        },

        invitation: {
          link:
            invitationLink,

          expiresAt,

          expiresIn:
            `${INVITATION_EXPIRY_HOURS} hours`,
        },
      },
    });
  } catch (error) {
    console.error(
      "Resend Invitation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to resend employee invitation.",
    });
  }
};

// =====================================================
// VERIFY EMPLOYEE INVITATION
// GET /api/employees/invitation/:token
// PUBLIC
// =====================================================

const verifyInvitation = async (
  req,
  res
) => {
  try {
    const {
      token,
    } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message:
          "Invitation token is required.",
      });
    }

    const tokenHash =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const employee =
      await User.findOne({
        invitationTokenHash:
          tokenHash,
      }).populate(
        "companyId",
        "name isActive"
      );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message:
          "Invalid invitation.",
      });
    }

    if (
      employee.invitationAcceptedAt
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This invitation has already been accepted.",
      });
    }

    if (
      !employee.invitationExpiresAt ||
      employee.invitationExpiresAt <
        new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This invitation has expired.",
      });
    }

    if (
      !employee.companyId ||
      !employee.companyId.isActive
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This company account is inactive.",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Invitation is valid.",

      data: {
        employee: {
          firstName:
            employee.firstName,

          lastName:
            employee.lastName,

          email:
            employee.email,

          companyName:
            employee.companyId
              ?.name || null,

          role:
            employee.role,

          department:
            employee.department ||
            null,

          jobTitle:
            employee.jobTitle ||
            null,
        },

        expiresAt:
          employee.invitationExpiresAt,
      },
    });
  } catch (error) {
    console.error(
      "Verify Invitation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while verifying the invitation.",
    });
  }
};

// =====================================================
// ACCEPT EMPLOYEE INVITATION
// POST /api/employees/invitation/:token/accept
// PUBLIC
// =====================================================

const acceptInvitation = async (
  req,
  res
) => {
  try {
    const {
      token,
    } = req.params;

    const {
      password,
      confirmPassword,
    } = req.body;

    // ===================================================
    // REQUIRED
    // ===================================================

    if (!token) {
      return res.status(400).json({
        success: false,
        message:
          "Invitation token is required.",
      });
    }

    if (
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password and confirm password are required.",
      });
    }

    // ===================================================
    // PASSWORD MATCH
    // ===================================================

    if (
      password !==
      confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Passwords do not match.",
      });
    }

    // ===================================================
    // PASSWORD RULES
    // ===================================================

    if (
      password.length < 8
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters.",
      });
    }

    if (
      !/[A-Z]/.test(
        password
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one uppercase letter.",
      });
    }

    if (
      !/[a-z]/.test(
        password
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one lowercase letter.",
      });
    }

    if (
      !/[0-9]/.test(
        password
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one number.",
      });
    }

    // ===================================================
    // TOKEN HASH
    // ===================================================

    const tokenHash =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    // ===================================================
    // FIND EMPLOYEE
    // ===================================================

    const employee =
      await User.findOne({
        invitationTokenHash:
          tokenHash,
      });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message:
          "Invalid invitation.",
      });
    }

    // ===================================================
    // ALREADY ACCEPTED
    // ===================================================

    if (
      employee.invitationAcceptedAt
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This invitation has already been accepted.",
      });
    }

    // ===================================================
    // EXPIRATION
    // ===================================================

    if (
      !employee.invitationExpiresAt ||
      employee.invitationExpiresAt <
        new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This invitation has expired.",
      });
    }

    // ===================================================
    // PASSWORD HASH
    // ===================================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    // ===================================================
    // ACTIVATE EMPLOYEE
    // ===================================================

    employee.password =
      hashedPassword;

    employee.isActive =
      true;

    employee.workStatus =
      "active";

    employee.invitationAcceptedAt =
      new Date();

    // One-time invitation.
    employee.invitationTokenHash =
      null;

    employee.invitationExpiresAt =
      null;

    await employee.save();

    return res.status(200).json({
      success: true,

      message:
        "Invitation accepted successfully. Your account is now active.",

      data: {
        employee: {
          _id:
            employee._id,

          firstName:
            employee.firstName,

          lastName:
            employee.lastName,

          email:
            employee.email,

          role:
            employee.role,

          isActive:
            employee.isActive,

          workStatus:
            employee.workStatus,

          invitationAcceptedAt:
            employee.invitationAcceptedAt,
        },
      },
    });
  } catch (error) {
    console.error(
      "Accept Invitation Error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      const message =
        Object.values(
          error.errors || {}
        )
          .map(
            (item) =>
              item.message
          )
          .join(", ");

      return res.status(400).json({
        success: false,
        message:
          message ||
          "Employee validation failed.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while accepting the invitation.",
    });
  }
};

// =====================================================
// DEACTIVATE / ACTIVATE EMPLOYEE
// PATCH /api/employees/:id/status
// ADMIN ONLY
// =====================================================

const updateEmployeeStatus =
  async (
    req,
    res
  ) => {
    try {
      if (
        !requireAdmin(
          req,
          res
        )
      ) {
        return;
      }

      const companyId =
        getCompanyId(req);

      const {
        id,
      } = req.params;

      const {
        isActive,
      } = req.body;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message:
            "Company information is missing.",
        });
      }

      if (
        !id ||
        !require("mongoose")
          .Types.ObjectId.isValid(
            id
          )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid employee ID.",
        });
      }

      if (
        typeof isActive !==
        "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "isActive must be a boolean value.",
        });
      }

      const employee =
        await User.findOne({
          _id: id,
          companyId,
          role: "employee",
        });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message:
            "Employee not found.",
        });
      }

      // Pending invitation
      // cannot be manually activated.
      if (
        isActive === true &&
        !employee.invitationAcceptedAt
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Employee must accept the invitation before activation.",
        });
      }

      employee.isActive =
        isActive;

      await employee.save();

      return res.status(200).json({
        success: true,

        message:
          isActive
            ? "Employee activated successfully."
            : "Employee deactivated successfully.",

        data: {
          employee:
            formatEmployee(
              employee
            ),
        },
      });
    } catch (error) {
      console.error(
        "Update Employee Status Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update employee status.",
      });
    }
  };

// =====================================================
// DELETE / REMOVE EMPLOYEE
// DELETE /api/employees/:id
// ADMIN ONLY
// =====================================================

const deleteEmployee =
  async (
    req,
    res
  ) => {
    try {
      if (
        !requireAdmin(
          req,
          res
        )
      ) {
        return;
      }

      const companyId =
        getCompanyId(req);

      const {
        id,
      } = req.params;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message:
            "Company information is missing.",
        });
      }

      if (
        !id ||
        !require("mongoose")
          .Types.ObjectId.isValid(
            id
          )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid employee ID.",
        });
      }

      const employee =
        await User.findOne({
          _id: id,
          companyId,
          role: "employee",
        });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message:
            "Employee not found.",
        });
      }

      await User.deleteOne({
        _id:
          employee._id,

        companyId,

        role:
          "employee",
      });

      return res.status(200).json({
        success: true,

        message:
          "Employee removed successfully.",
      });
    } catch (error) {
      console.error(
        "Delete Employee Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to remove employee.",
      });
    }
  };

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getEmployeeStats,
  getMyEmployeeStats,
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  resendInvitation,
  verifyInvitation,
  acceptInvitation,
  updateEmployeeStatus,
  deleteEmployee,
};