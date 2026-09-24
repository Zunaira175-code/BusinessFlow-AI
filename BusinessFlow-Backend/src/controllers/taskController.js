const mongoose = require("mongoose");

const Task = require("../models/Task");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Lead = require("../models/Lead");
const Deal = require("../models/Deal");

// =====================================================
// CONSTANTS
// =====================================================

const allowedStatuses = [
  "Pending",
  "In Progress",
  "Completed",
  "Cancelled",
];

const allowedPriorities = [
  "LOW",
  "MEDIUM",
  "HIGH",
];

// =====================================================
// HELPERS
// =====================================================

const getCompanyId = (req) => {
  if (!req.user?.companyId) {
    return null;
  }

  return req.user.companyId._id || req.user.companyId;
};

const getUserId = (req) => {
  return req.user?._id || null;
};

const isAdmin = (req) => {
  return req.user?.role === "admin";
};

const isValidObjectId = (id) => {
  return Boolean(
    id && mongoose.Types.ObjectId.isValid(id)
  );
};

const normalizePriority = (priority) => {
  if (!priority) {
    return "MEDIUM";
  }

  const value = String(priority)
    .trim()
    .toUpperCase();

  if (allowedPriorities.includes(value)) {
    return value;
  }

  return null;
};

const normalizeStatus = (status) => {
  if (!status) {
    return "Pending";
  }

  const value = String(status).trim();

  if (allowedStatuses.includes(value)) {
    return value;
  }

  return null;
};

const parseDueAt = (value) => {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
};

// =====================================================
// USER FORMATTER
// =====================================================

const formatUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    _id: user._id,

    firstName: user.firstName || "",

    lastName: user.lastName || "",

    name:
      `${user.firstName || ""} ${
        user.lastName || ""
      }`.trim() || "Unknown User",

    email: user.email || "",

    role: user.role || null,

    isActive:
      user.isActive !== undefined
        ? user.isActive
        : true,
  };
};

// =====================================================
// RELATED RECORD FORMATTERS
// =====================================================

const formatCustomer = (customer) => {
  if (!customer) {
    return null;
  }

  return {
    _id: customer._id,

    firstName:
      customer.firstName || "",

    lastName:
      customer.lastName || "",

    companyName:
      customer.companyName || "",

    email:
      customer.email || "",
  };
};

const formatLead = (lead) => {
  if (!lead) {
    return null;
  }

  return {
    _id: lead._id,

    firstName:
      lead.firstName || "",

    lastName:
      lead.lastName || "",

    company:
      lead.company || "",

    email:
      lead.email || "",
  };
};

const formatDeal = (deal) => {
  if (!deal) {
    return null;
  }

  return {
    _id: deal._id,

    title:
      deal.title || "",

    value:
      deal.value || 0,

    stage:
      deal.stage || "",

    status:
      deal.status || "",
  };
};

// =====================================================
// TASK FORMATTER
// =====================================================

const formatTask = (task) => {
  if (!task) {
    return null;
  }

  return {
    _id: task._id,

    title:
      task.title || "",

    description:
      task.description || null,

    status:
      task.status || "Pending",

    priority:
      task.priority || "MEDIUM",

    dueAt:
      task.dueAt || null,

    completedAt:
      task.completedAt || null,

    assignedTo:
      formatUser(task.assignedTo),

    createdBy:
      formatUser(task.createdBy),

    customerId:
      formatCustomer(task.customerId),

    leadId:
      formatLead(task.leadId),

    dealId:
      formatDeal(task.dealId),

    notes:
      task.notes || null,

    createdAt:
      task.createdAt || null,

    updatedAt:
      task.updatedAt || null,
  };
};

// =====================================================
// POPULATE TASK
// =====================================================

const populateTask = (query) => {
  return query
    .populate(
      "assignedTo",
      "firstName lastName email role isActive"
    )
    .populate(
      "createdBy",
      "firstName lastName email role isActive"
    )
    .populate(
      "customerId",
      "firstName lastName companyName email phone jobTitle status"
    )
    .populate(
      "leadId",
      "firstName lastName email phone company jobTitle status value source"
    )
    .populate(
      "dealId",
      "title description value stage status expectedCloseDate"
    );
};

// =====================================================
// VALIDATE EMPLOYEE ASSIGNEE
// =====================================================

const validateAssignee = async (
  assignedTo,
  companyId
) => {
  if (!assignedTo) {
    return {
      valid: false,
      message: "Task assignee is required.",
    };
  }

  if (!isValidObjectId(assignedTo)) {
    return {
      valid: false,
      message: "Invalid assigned employee ID.",
    };
  }

  const employee = await User.findOne({
    _id: assignedTo,
    companyId,
    role: "employee",
    isActive: true,
  }).select(
    "_id firstName lastName email role isActive"
  );

  if (!employee) {
    return {
      valid: false,
      message:
        "Selected employee does not belong to this company or is inactive.",
    };
  }

  return {
    valid: true,
    user: employee,
  };
};

// =====================================================
// VALIDATE CUSTOMER
// =====================================================

const validateCustomer = async (
  customerId,
  companyId
) => {
  if (!customerId) {
    return {
      valid: true,
      record: null,
    };
  }

  if (!isValidObjectId(customerId)) {
    return {
      valid: false,
      message: "Invalid customer ID.",
    };
  }

  const customer = await Customer.findOne({
    _id: customerId,
    companyId,
  }).select(
    "_id firstName lastName companyName email phone jobTitle status"
  );

  if (!customer) {
    return {
      valid: false,
      message:
        "Customer does not belong to this company or does not exist.",
    };
  }

  return {
    valid: true,
    record: customer,
  };
};

// =====================================================
// VALIDATE LEAD
// =====================================================

const validateLead = async (
  leadId,
  companyId
) => {
  if (!leadId) {
    return {
      valid: true,
      record: null,
    };
  }

  if (!isValidObjectId(leadId)) {
    return {
      valid: false,
      message: "Invalid lead ID.",
    };
  }

  const lead = await Lead.findOne({
    _id: leadId,
    companyId,
  }).select(
    "_id firstName lastName email phone company jobTitle status value source"
  );

  if (!lead) {
    return {
      valid: false,
      message:
        "Lead does not belong to this company or does not exist.",
    };
  }

  return {
    valid: true,
    record: lead,
  };
};

// =====================================================
// VALIDATE DEAL
// =====================================================

const validateDeal = async (
  dealId,
  companyId
) => {
  if (!dealId) {
    return {
      valid: true,
      record: null,
    };
  }

  if (!isValidObjectId(dealId)) {
    return {
      valid: false,
      message: "Invalid deal ID.",
    };
  }

  const deal = await Deal.findOne({
    _id: dealId,
    companyId,
  }).select(
    "_id title description value stage status expectedCloseDate"
  );

  if (!deal) {
    return {
      valid: false,
      message:
        "Deal does not belong to this company or does not exist.",
    };
  }

  return {
    valid: true,
    record: deal,
  };
};

// =====================================================
// VALIDATE RELATED RECORDS
// =====================================================

const validateRelatedRecords = async ({
  customerId,
  leadId,
  dealId,
  companyId,
}) => {
  const customerResult =
    await validateCustomer(
      customerId,
      companyId
    );

  if (!customerResult.valid) {
    return customerResult;
  }

  const leadResult =
    await validateLead(
      leadId,
      companyId
    );

  if (!leadResult.valid) {
    return leadResult;
  }

  const dealResult =
    await validateDeal(
      dealId,
      companyId
    );

  if (!dealResult.valid) {
    return dealResult;
  }

  return {
    valid: true,

    customer:
      customerResult.record || null,

    lead:
      leadResult.record || null,

    deal:
      dealResult.record || null,
  };
};

// =====================================================
// GET TASK STATS
// GET /api/tasks/stats
// =====================================================

const getTaskStats = async (req, res) => {
  try {
    const companyId =
      getCompanyId(req);

    const userId =
      getUserId(req);

    if (!companyId || !userId) {
      return res.status(400).json({
        success: false,
        message:
          "User or company information is missing.",
      });
    }

    const match = {
      companyId,
    };

    // Employees only see their own task statistics.
    if (!isAdmin(req)) {
      match.assignedTo = userId;
    }

    const [
      total,
      pending,
      inProgress,
      completed,
      cancelled,
    ] = await Promise.all([
      Task.countDocuments(match),

      Task.countDocuments({
        ...match,
        status: "Pending",
      }),

      Task.countDocuments({
        ...match,
        status: "In Progress",
      }),

      Task.countDocuments({
        ...match,
        status: "Completed",
      }),

      Task.countDocuments({
        ...match,
        status: "Cancelled",
      }),
    ]);

    return res.status(200).json({
      success: true,

      message:
        "Task statistics fetched successfully.",

      data: {
        total,
        pending,
        inProgress,
        completed,
        cancelled,
      },
    });
  } catch (error) {
    console.error(
      "Get Task Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching task statistics.",
    });
  }
};

// =====================================================
// EMPLOYEE TASK STATS
// GET /api/tasks/me/stats
// =====================================================

const getMyTaskStats = async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const userId = getUserId(req);

    if (!companyId || !userId) {
      return res.status(400).json({
        success: false,
        message:
          "User or company information is missing.",
      });
    }

    const now = new Date();

    // =====================================================
    // TODAY
    // =====================================================

    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const tomorrowStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    // =====================================================
    // BASE EMPLOYEE FILTER
    // =====================================================

    const baseFilter = {
      companyId,
      assignedTo: userId,
    };

    // =====================================================
    // COUNTS
    // =====================================================

    const [
      totalTasks,
      pending,
      inProgress,
      completed,
      cancelled,
      dueToday,
      overdue,
      highPriority,
      highPriorityStuck,
    ] = await Promise.all([
      Task.countDocuments(
        baseFilter
      ),

      Task.countDocuments({
        ...baseFilter,
        status: "Pending",
      }),

      Task.countDocuments({
        ...baseFilter,
        status: "In Progress",
      }),

      Task.countDocuments({
        ...baseFilter,
        status: "Completed",
      }),

      Task.countDocuments({
        ...baseFilter,
        status: "Cancelled",
      }),

      Task.countDocuments({
        ...baseFilter,

        status: {
          $in: [
            "Pending",
            "In Progress",
          ],
        },

        dueAt: {
          $gte: todayStart,
          $lt: tomorrowStart,
        },
      }),

      Task.countDocuments({
        ...baseFilter,

        status: {
          $in: [
            "Pending",
            "In Progress",
          ],
        },

        dueAt: {
          $lt: now,
        },
      }),

      Task.countDocuments({
        ...baseFilter,

        priority: "HIGH",

        status: {
          $in: [
            "Pending",
            "In Progress",
          ],
        },
      }),

      Task.countDocuments({
        ...baseFilter,

        priority: "HIGH",

        status: "Pending",

        createdAt: {
          $lte: new Date(
            now.getTime() -
              48 * 60 * 60 * 1000
          ),
        },
      }),
    ]);

    // =====================================================
    // COMPLETION PERCENTAGE
    // =====================================================

    const completionPercentage =
      totalTasks > 0
        ? Math.round(
            (completed / totalTasks) * 100
          )
        : 0;

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      message:
        "My task statistics fetched successfully.",

      data: {
        totalTasks,

        pending,

        inProgress,

        completed,

        cancelled,

        dueToday,

        overdue,

        highPriority,

        highPriorityStuck,

        completionPercentage,
      },
    });
  } catch (error) {
    console.error(
      "Get My Task Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Something went wrong while fetching your task statistics.",
    });
  }
};

// =====================================================
// GET TASKS
// GET /api/tasks
// =====================================================

const getTasks = async (req, res) => {
  try {
    const companyId =
      getCompanyId(req);

    const userId =
      getUserId(req);

    if (!companyId || !userId) {
      return res.status(400).json({
        success: false,
        message:
          "User or company information is missing.",
      });
    }

    const {
      view = "all",
      status,
      priority,
      assignedTo,
      type,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {
      companyId,
    };

    // ===================================================
    // EMPLOYEE SCOPE
    // ===================================================

    if (!isAdmin(req)) {
      filter.assignedTo = userId;
    }

    // ===================================================
    // ADMIN ASSIGNEE FILTER
    // ===================================================

    if (
      isAdmin(req) &&
      assignedTo
    ) {
      if (!isValidObjectId(assignedTo)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid assigned employee ID.",
        });
      }

      const assignee =
        await User.findOne({
          _id: assignedTo,
          companyId,
          role: "employee",
          isActive: true,
        }).select("_id");

      if (!assignee) {
        return res.status(400).json({
          success: false,
          message:
            "Assigned employee does not belong to this company or is inactive.",
        });
      }

      filter.assignedTo =
        assignedTo;
    }

    // ===================================================
    // STATUS FILTER
    // ===================================================

    if (status) {
      const normalizedStatus =
        normalizeStatus(status);

      if (!normalizedStatus) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid task status.",
        });
      }

      filter.status =
        normalizedStatus;
    }

    // ===================================================
    // PRIORITY FILTER
    // ===================================================

    if (priority) {
      const normalizedPriority =
        normalizePriority(priority);

      if (!normalizedPriority) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid task priority.",
        });
      }

      filter.priority =
        normalizedPriority;
    }

    // ===================================================
    // TYPE FILTER
    //
    // Customer => customerId exists
    // Lead     => leadId exists
    // Deal     => dealId exists
    // Internal => none of them exists
    // Multiple => two or more related records exist
    // ===================================================

    if (type) {
      const normalizedType =
        String(type).trim();

      if (
        ![
          "Customer",
          "Lead",
          "Deal",
          "Internal",
          "Multiple",
        ].includes(normalizedType)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid task related type.",
        });
      }

      if (
        normalizedType ===
        "Customer"
      ) {
        filter.customerId = {
          $ne: null,
        };

        filter.leadId = null;
        filter.dealId = null;
      }

      if (
        normalizedType === "Lead"
      ) {
        filter.leadId = {
          $ne: null,
        };

        filter.customerId = null;
        filter.dealId = null;
      }

      if (
        normalizedType === "Deal"
      ) {
        filter.dealId = {
          $ne: null,
        };

        filter.customerId = null;
        filter.leadId = null;
      }

      if (
        normalizedType ===
        "Internal"
      ) {
        filter.customerId = null;
        filter.leadId = null;
        filter.dealId = null;
      }

      if (
        normalizedType ===
        "Multiple"
      ) {
        filter.$expr = {
          $gte: [
            {
              $add: [
                {
                  $cond: [
                    {
                      $ne: [
                        "$customerId",
                        null,
                      ],
                    },
                    1,
                    0,
                  ],
                },
                {
                  $cond: [
                    {
                      $ne: [
                        "$leadId",
                        null,
                      ],
                    },
                    1,
                    0,
                  ],
                },
                {
                  $cond: [
                    {
                      $ne: [
                        "$dealId",
                        null,
                      ],
                    },
                    1,
                    0,
                  ],
                },
              ],
            },
            2,
          ],
        };
      }
    }

    // ===================================================
    // SEARCH
    // ===================================================

    if (search?.trim()) {
      const searchRegex = {
        $regex: search.trim(),
        $options: "i",
      };

      const matchingUsers =
        await User.find({
          companyId,
          $or: [
            {
              firstName:
                searchRegex,
            },
            {
              lastName:
                searchRegex,
            },
            {
              email:
                searchRegex,
            },
          ],
        }).select("_id");

      const matchingCustomers =
        await Customer.find({
          companyId,
          $or: [
            {
              firstName:
                searchRegex,
            },
            {
              lastName:
                searchRegex,
            },
            {
              companyName:
                searchRegex,
            },
            {
              email:
                searchRegex,
            },
          ],
        }).select("_id");

      const matchingLeads =
        await Lead.find({
          companyId,
          $or: [
            {
              firstName:
                searchRegex,
            },
            {
              lastName:
                searchRegex,
            },
            {
              company:
                searchRegex,
            },
            {
              email:
                searchRegex,
            },
          ],
        }).select("_id");

      const matchingDeals =
        await Deal.find({
          companyId,
          $or: [
            {
              title:
                searchRegex,
            },
          ],
        }).select("_id");

      const userIds =
        matchingUsers.map(
          (user) => user._id
        );

      const customerIds =
        matchingCustomers.map(
          (customer) =>
            customer._id
        );

      const leadIds =
        matchingLeads.map(
          (lead) => lead._id
        );

      const dealIds =
        matchingDeals.map(
          (deal) => deal._id
        );

      filter.$or = [
        {
          title: searchRegex,
        },
        {
          description:
            searchRegex,
        },
        {
          notes: searchRegex,
        },
        {
          assignedTo: {
            $in: userIds,
          },
        },
        {
          createdBy: {
            $in: userIds,
          },
        },
        {
          customerId: {
            $in: customerIds,
          },
        },
        {
          leadId: {
            $in: leadIds,
          },
        },
        {
          dealId: {
            $in: dealIds,
          },
        },
      ];
    }

    // ===================================================
    // DATE VIEW
    // ===================================================

    const now = new Date();

    const todayStart =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

    const tomorrowStart =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );

    const upcomingEnd =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 31
      );

    if (view === "today") {
      filter.dueAt = {
        $gte: todayStart,
        $lt: tomorrowStart,
      };
    } else if (
      view === "upcoming"
    ) {
      filter.dueAt = {
        $gte: tomorrowStart,
        $lt: upcomingEnd,
      };
    } else if (
      view === "overdue"
    ) {
      filter.dueAt = {
        $lt: todayStart,
      };
    } else if (
      view !== "all"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid task view. Use today, upcoming, overdue, or all.",
      });
    }

    // ===================================================
    // PAGINATION
    // ===================================================

    const pageNumber = Math.max(
      Number(page) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(
        Number(limit) || 20,
        1
      ),
      100
    );

    const skip =
      (pageNumber - 1) *
      limitNumber;

    // ===================================================
    // FETCH
    // ===================================================

    const [
      tasks,
      total,
    ] = await Promise.all([
      populateTask(
        Task.find(filter)
          .sort({
            dueAt: 1,
            createdAt: -1,
          })
          .skip(skip)
          .limit(limitNumber)
          .lean()
      ),

      Task.countDocuments(
        filter
      ),
    ]);

    return res.status(200).json({
      success: true,

      message:
        "Tasks fetched successfully.",

      data:
        tasks.map(formatTask),

      pagination: {
        page: pageNumber,

        limit: limitNumber,

        total,

        totalPages:
          Math.max(
            Math.ceil(
              total /
                limitNumber
            ),
            1
          ),
      },
    });
  } catch (error) {
    console.error(
      "Get Tasks Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching tasks.",
    });
  }
};

// =====================================================
// EMPLOYEE UPCOMING TASKS
// GET /api/tasks/me/upcoming
// =====================================================

const getMyUpcomingTasks = async (
  req,
  res
) => {
  try {
    const companyId =
      getCompanyId(req);

    const userId =
      getUserId(req);

    if (!companyId || !userId) {
      return res.status(400).json({
        success: false,
        message:
          "User or company information is missing.",
      });
    }

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 5,
        1
      ),
      20
    );

    const now = new Date();

    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const upcomingEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 31
    );

    const tasks =
      await populateTask(
        Task.find({
          companyId,

          assignedTo: userId,

          status: {
            $in: [
              "Pending",
              "In Progress",
            ],
          },

          dueAt: {
            $gte: todayStart,
            $lt: upcomingEnd,
          },
        })
          .sort({
            dueAt: 1,
          })
          .limit(limit)
          .lean()
      );

    return res.status(200).json({
      success: true,

      message:
        "Upcoming tasks fetched successfully.",

      data:
        tasks.map(formatTask),
    });
  } catch (error) {
    console.error(
      "Get My Upcoming Tasks Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Something went wrong while fetching upcoming tasks.",
    });
  }
};

// =====================================================
// EMPLOYEE AI FOCUS SUGGESTION
// GET /api/tasks/me/ai-focus
// =====================================================

const getMyTaskAIFocus = async (
  req,
  res
) => {
  try {
    const companyId =
      getCompanyId(req);

    const userId =
      getUserId(req);

    if (!companyId || !userId) {
      return res.status(400).json({
        success: false,

        message:
          "User or company information is missing.",
      });
    }

    const now = new Date();

    const fortyEightHoursAgo =
      new Date(
        now.getTime() -
          48 * 60 * 60 * 1000
      );

    const todayStart =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

    const tomorrowStart =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );

    // =====================================================
    // STUCK HIGH PRIORITY TASKS
    // =====================================================

    const stuckTasks =
      await Task.find({
        companyId,

        assignedTo: userId,

        priority: "HIGH",

        status: "Pending",

        createdAt: {
          $lte: fortyEightHoursAgo,
        },
      })
        .sort({
          createdAt: 1,
        })
        .limit(5)
        .lean();

    // =====================================================
    // OVERDUE TASKS
    // =====================================================

    const overdueTasks =
      await Task.find({
        companyId,

        assignedTo: userId,

        status: {
          $in: [
            "Pending",
            "In Progress",
          ],
        },

        dueAt: {
          $lt: now,
        },
      })
        .sort({
          dueAt: 1,
        })
        .limit(5)
        .lean();

    // =====================================================
    // TODAY TASKS
    // =====================================================

    const todayTasks =
      await Task.countDocuments({
        companyId,

        assignedTo: userId,

        status: {
          $in: [
            "Pending",
            "In Progress",
          ],
        },

        dueAt: {
          $gte: todayStart,
          $lt: tomorrowStart,
        },
      });

    // =====================================================
    // SUGGESTION
    // =====================================================

    let title =
      "You're on track";

    let message =
      "No urgent task issues detected. Continue working through your upcoming tasks.";

    let priority =
      "LOW";

    let focusType =
      "normal";

    let taskCount = 0;

    // =====================================================
    // PRIORITY 1
    // STUCK HIGH PRIORITY
    // =====================================================

    if (
      stuckTasks.length > 0
    ) {
      title =
        "Prioritize stuck high-priority tasks";

      message =
        `You have ${stuckTasks.length} high priority ${
          stuckTasks.length === 1
            ? "task"
            : "tasks"
        } stuck in To Do for more than 48 hours. Consider completing or rescheduling them before taking on new work.`;

      priority =
        "HIGH";

      focusType =
        "stuck";

      taskCount =
        stuckTasks.length;
    }

    // =====================================================
    // PRIORITY 2
    // OVERDUE
    // =====================================================

    else if (
      overdueTasks.length > 0
    ) {
      title =
        "Clear overdue tasks first";

      message =
        `You have ${overdueTasks.length} overdue ${
          overdueTasks.length === 1
            ? "task"
            : "tasks"
        }. Consider resolving these before moving to lower-priority work.`;

      priority =
        "HIGH";

      focusType =
        "overdue";

      taskCount =
        overdueTasks.length;
    }

    // =====================================================
    // PRIORITY 3
    // TODAY
    // =====================================================

    else if (
      todayTasks > 0
    ) {
      title =
        "Focus on today's deadlines";

      message =
        `You have ${todayTasks} active ${
          todayTasks === 1
            ? "task"
            : "tasks"
        } scheduled for today. Prioritize the highest-impact work first.`;

      priority =
        "MEDIUM";

      focusType =
        "today";

      taskCount =
        todayTasks;
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      message:
        "AI task focus suggestion generated successfully.",

      data: {
        title,

        message,

        priority,

        focusType,

        taskCount,

        stuckTasks:
          stuckTasks.map(
            (task) => ({
              _id: task._id,

              title:
                task.title,

              priority:
                task.priority,

              status:
                task.status,

              dueAt:
                task.dueAt,
            })
          ),

        overdueTasks:
          overdueTasks.map(
            (task) => ({
              _id: task._id,

              title:
                task.title,

              priority:
                task.priority,

              status:
                task.status,

              dueAt:
                task.dueAt,
            })
          ),
      },
    });
  } catch (error) {
    console.error(
      "Get My Task AI Focus Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Something went wrong while generating your task focus suggestion.",
    });
  }
};

// =====================================================
// GET SINGLE TASK
// GET /api/tasks/:id
// =====================================================

const getTaskById = async (
  req,
  res
) => {
  try {
    const companyId =
      getCompanyId(req);

    const userId =
      getUserId(req);

    const { id } =
      req.params;

    if (!companyId || !userId) {
      return res.status(400).json({
        success: false,
        message:
          "User or company information is missing.",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid task ID.",
      });
    }

    const filter = {
      _id: id,
      companyId,
    };

    if (!isAdmin(req)) {
      filter.assignedTo =
        userId;
    }

    const task =
      await populateTask(
        Task.findOne(
          filter
        ).lean()
      );

    if (!task) {
      return res.status(404).json({
        success: false,
        message:
          "Task not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Task fetched successfully.",

      data:
        formatTask(task),
    });
  } catch (error) {
    console.error(
      "Get Task Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching the task.",
    });
  }
};

// =====================================================
// CREATE TASK
// POST /api/tasks
// =====================================================

const createTask = async (
  req,
  res
) => {
  try {
    const companyId =
      getCompanyId(req);

    const userId =
      getUserId(req);

    if (!companyId || !userId) {
      return res.status(400).json({
        success: false,
        message:
          "User or company information is missing.",
      });
    }

    const {
      title,
      description,
      assignedTo,
      status = "Pending",
      priority = "MEDIUM",
      dueAt,
      customerId,
      leadId,
      dealId,
      notes,
    } = req.body;

    // ===================================================
    // TITLE
    // ===================================================

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Task title is required.",
      });
    }

    // ===================================================
    // DUE DATE
    // ===================================================

    const parsedDueAt =
      parseDueAt(dueAt);

    if (!parsedDueAt) {
      return res.status(400).json({
        success: false,
        message:
          "Task due date is required and must be valid.",
      });
    }

    // ===================================================
    // STATUS
    // ===================================================

    const normalizedStatus =
      normalizeStatus(status);

    if (!normalizedStatus) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid task status.",
      });
    }

    // ===================================================
    // PRIORITY
    // ===================================================

    const normalizedPriority =
      normalizePriority(priority);

    if (!normalizedPriority) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid task priority. Use LOW, MEDIUM, or HIGH.",
      });
    }

    // ===================================================
    // ASSIGNMENT
    // ===================================================

    let finalAssignedTo =
      assignedTo;

    // Employee-created task
    // always belongs to the
    // logged-in employee.
    if (!isAdmin(req)) {
      finalAssignedTo =
        userId;
    }

    const assigneeResult =
      await validateAssignee(
        finalAssignedTo,
        companyId
      );

    if (!assigneeResult.valid) {
      return res.status(400).json({
        success: false,
        message:
          assigneeResult.message,
      });
    }

    // ===================================================
    // RELATED RECORDS
    // ===================================================

    const relatedResult =
      await validateRelatedRecords({
        customerId,
        leadId,
        dealId,
        companyId,
      });

    if (!relatedResult.valid) {
      return res.status(400).json({
        success: false,
        message:
          relatedResult.message,
      });
    }

    // ===================================================
    // CREATE TASK
    // =====================================================

    const task =
      await Task.create({
        companyId,

        title:
          title.trim(),

        description:
          description?.trim() ||
          null,

        customerId:
          customerId ||
          null,

        leadId:
          leadId ||
          null,

        dealId:
          dealId ||
          null,

        assignedTo:
          finalAssignedTo,

        createdBy:
          userId,

        status:
          normalizedStatus,

        priority:
          normalizedPriority,

        dueAt:
          parsedDueAt,

        completedAt:
          normalizedStatus ===
          "Completed"
            ? new Date()
            : null,

        notes:
          notes?.trim() ||
          null,
      });

    // ===================================================
    // FETCH CREATED TASK
    // ===================================================

    const populatedTask =
      await populateTask(
        Task.findById(
          task._id
        ).lean()
      );

    return res.status(201).json({
      success: true,

      message:
        "Task created successfully.",

      data:
        formatTask(
          populatedTask
        ),
    });
  } catch (error) {
    console.error(
      "Create Task Error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      const validationMessage =
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
          validationMessage ||
          "Task validation failed.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while creating the task.",
    });
  }
};

// =====================================================
// UPDATE TASK
// PATCH /api/tasks/:id
// =====================================================

const updateTask = async (
  req,
  res
) => {
  try {
    const companyId =
      getCompanyId(req);

    const userId =
      getUserId(req);

    const { id } =
      req.params;

    if (!companyId || !userId) {
      return res.status(400).json({
        success: false,
        message:
          "User or company information is missing.",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid task ID.",
      });
    }

    const filter = {
      _id: id,
      companyId,
    };

    // Employees can only update
    // their own tasks.
    if (!isAdmin(req)) {
      filter.assignedTo =
        userId;
    }

    const task =
      await Task.findOne(
        filter
      );

    if (!task) {
      return res.status(404).json({
        success: false,
        message:
          "Task not found.",
      });
    }

    const {
      title,
      description,
      assignedTo,
      status,
      priority,
      dueAt,
      customerId,
      leadId,
      dealId,
      notes,
    } = req.body;

    // ===================================================
    // TITLE
    // ===================================================

    if (
      title !== undefined
    ) {
      if (
        !String(title).trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Task title cannot be empty.",
        });
      }

      task.title =
        String(title).trim();
    }

    // ===================================================
    // DESCRIPTION
    // ===================================================

    if (
      description !==
      undefined
    ) {
      task.description =
        String(
          description
        ).trim() || null;
    }

    // ===================================================
    // STATUS
    // ===================================================

    if (
      status !== undefined
    ) {
      const normalizedStatus =
        normalizeStatus(
          status
        );

      if (!normalizedStatus) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid task status.",
        });
      }

      task.status =
        normalizedStatus;
    }

    // ===================================================
    // PRIORITY
    // ===================================================

    if (
      priority !== undefined
    ) {
      const normalizedPriority =
        normalizePriority(
          priority
        );

      if (!normalizedPriority) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid task priority. Use LOW, MEDIUM, or HIGH.",
        });
      }

      task.priority =
        normalizedPriority;
    }

    // ===================================================
    // DUE DATE
    // ===================================================

    if (
      dueAt !== undefined
    ) {
      const parsedDueAt =
        parseDueAt(
          dueAt
        );

      if (!parsedDueAt) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid task due date.",
        });
      }

      task.dueAt =
        parsedDueAt;
    }

    // ===================================================
    // ASSIGNEE
    // ===================================================

    if (
      assignedTo !==
      undefined
    ) {
      // Employees cannot
      // reassign tasks.
      if (!isAdmin(req)) {
        return res.status(403).json({
          success: false,
          message:
            "Employees cannot reassign tasks.",
        });
      }

      const assigneeResult =
        await validateAssignee(
          assignedTo,
          companyId
        );

      if (!assigneeResult.valid) {
        return res.status(400).json({
          success: false,
          message:
            assigneeResult.message,
        });
      }

      task.assignedTo =
        assignedTo;
    }

    // ===================================================
    // RELATED RECORDS
    // ===================================================

    const relatedFieldsProvided =
      customerId !==
        undefined ||
      leadId !==
        undefined ||
      dealId !==
        undefined;

    if (
      relatedFieldsProvided
    ) {
      const finalCustomerId =
        customerId !==
        undefined
          ? customerId ||
            null
          : task.customerId;

      const finalLeadId =
        leadId !==
        undefined
          ? leadId || null
          : task.leadId;

      const finalDealId =
        dealId !==
        undefined
          ? dealId || null
          : task.dealId;

      const relatedResult =
        await validateRelatedRecords({
          customerId:
            finalCustomerId,
          leadId:
            finalLeadId,
          dealId:
            finalDealId,
          companyId,
        });

      if (!relatedResult.valid) {
        return res.status(400).json({
          success: false,
          message:
            relatedResult.message,
        });
      }

      task.customerId =
        finalCustomerId;

      task.leadId =
        finalLeadId;

      task.dealId =
        finalDealId;
    }

    // ===================================================
    // NOTES
    // ===================================================

    if (
      notes !== undefined
    ) {
      task.notes =
        String(notes).trim() ||
        null;
    }

    // ===================================================
    // COMPLETED AT
    // ===================================================

    if (
      task.status ===
      "Completed"
    ) {
      task.completedAt =
        task.completedAt ||
        new Date();
    } else {
      task.completedAt =
        null;
    }

    await task.save();

    // ===================================================
    // FETCH UPDATED TASK
    // ===================================================

    const updatedTask =
      await populateTask(
        Task.findById(
          task._id
        ).lean()
      );

    return res.status(200).json({
      success: true,

      message:
        "Task updated successfully.",

      data:
        formatTask(
          updatedTask
        ),
    });
  } catch (error) {
    console.error(
      "Update Task Error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      const validationMessage =
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
          validationMessage ||
          "Task validation failed.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while updating the task.",
    });
  }
};

// =====================================================
// COMPLETE TASK
// PATCH /api/tasks/:id/complete
// =====================================================

const completeTask = async (
  req,
  res
) => {
  try {
    const companyId =
      getCompanyId(req);

    const userId =
      getUserId(req);

    const { id } =
      req.params;

    if (!companyId || !userId) {
      return res.status(400).json({
        success: false,
        message:
          "User or company information is missing.",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid task ID.",
      });
    }

    const filter = {
      _id: id,
      companyId,
    };

    if (!isAdmin(req)) {
      filter.assignedTo =
        userId;
    }

    const task =
      await Task.findOneAndUpdate(
        filter,
        {
          $set: {
            status:
              "Completed",

            completedAt:
              new Date(),
          },
        },
        {
          new: true,

          runValidators:
            true,
        }
      );

    if (!task) {
      return res.status(404).json({
        success: false,
        message:
          "Task not found.",
      });
    }

    const completedTask =
      await populateTask(
        Task.findById(
          task._id
        ).lean()
      );

    return res.status(200).json({
      success: true,

      message:
        "Task completed successfully.",

      data:
        formatTask(
          completedTask
        ),
    });
  } catch (error) {
    console.error(
      "Complete Task Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while completing the task.",
    });
  }
};

// =====================================================
// REASSIGN TASK
// PATCH /api/tasks/:id/reassign
// =====================================================

const reassignTask = async (
  req,
  res
) => {
  try {
    const companyId =
      getCompanyId(req);

    const { id } =
      req.params;

    const {
      assignedTo,
    } = req.body;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing.",
      });
    }

    // Admin only.
    if (!isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message:
          "Only administrators can reassign tasks.",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid task ID.",
      });
    }

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message:
          "New assignee is required.",
      });
    }

    const assigneeResult =
      await validateAssignee(
        assignedTo,
        companyId
      );

    if (!assigneeResult.valid) {
      return res.status(400).json({
        success: false,
        message:
          assigneeResult.message,
      });
    }

    const task =
      await Task.findOne({
        _id: id,
        companyId,
      });

    if (!task) {
      return res.status(404).json({
        success: false,
        message:
          "Task not found.",
      });
    }

    task.assignedTo =
      assignedTo;

    await task.save();

    const updatedTask =
      await populateTask(
        Task.findById(
          task._id
        ).lean()
      );

    return res.status(200).json({
      success: true,

      message:
        "Task reassigned successfully.",

      data:
        formatTask(
          updatedTask
        ),
    });
  } catch (error) {
    console.error(
      "Reassign Task Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while reassigning the task.",
    });
  }
};

// =====================================================
// DELETE TASK
// DELETE /api/tasks/:id
// =====================================================

const deleteTask = async (
  req,
  res
) => {
  try {
    const companyId =
      getCompanyId(req);

    const { id } =
      req.params;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing.",
      });
    }

    // Admin only.
    if (!isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message:
          "Only administrators can delete tasks.",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid task ID.",
      });
    }

    const task =
      await Task.findOneAndDelete({
        _id: id,
        companyId,
      });

    if (!task) {
      return res.status(404).json({
        success: false,
        message:
          "Task not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Task deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Task Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while deleting the task.",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  // =====================================================
  // TASK READ APIs
  // =====================================================

  getTasks,
  getTaskById,
  getTaskStats,

  // =====================================================
  // EMPLOYEE TASK APIs
  // =====================================================

  getMyTaskStats,
  getMyUpcomingTasks,
  getMyTaskAIFocus,

  // =====================================================
  // TASK MUTATION APIs
  // =====================================================

  createTask,
  updateTask,
  completeTask,
  reassignTask,
  deleteTask,
};