const mongoose = require("mongoose");

const Deal = require("../models/Deal");
const Lead = require("../models/Lead");
const User = require("../models/User");

const { createNotification } = require("./notificationController");

// =====================================================
// CONSTANTS
// =====================================================

const DEAL_STAGES = [
  "Prospecting",
  "Qualification",
  "Proposal",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

const DEAL_STATUSES = [
  "Open",
  "Won",
  "Lost",
];

// =====================================================
// HELPERS
// =====================================================

const getCompanyId = (req) => {
  return (
    req.user?.companyId?._id ||
    req.user?.companyId ||
    null
  );
};

// =====================================================
// COMPANY OBJECT ID
// =====================================================

const getCompanyObjectId = (req) => {
  const companyId = getCompanyId(req);

  if (
    !companyId ||
    !mongoose.Types.ObjectId.isValid(companyId)
  ) {
    return null;
  }

  return new mongoose.Types.ObjectId(companyId);
};

// =====================================================
// VALID OBJECT ID
// =====================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// =====================================================
// ADMIN
// =====================================================

const isAdmin = (req) => {
  return req.user?.role === "admin";
};

const checkAdminAccess = (req, res) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
    });

    return false;
  }

  if (!isAdmin(req)) {
    res.status(403).json({
      success: false,
      message: "Admin access is required.",
    });

    return false;
  }

  return true;
};

// =====================================================
// PERCENTAGE CHANGE
// =====================================================

const calculatePercentageChange = (
  current,
  previous
) => {
  if (previous === 0) {
    if (current === 0) {
      return 0;
    }

    return 100;
  }

  return (
    ((current - previous) / previous) *
    100
  );
};

// =====================================================
// TREND
// =====================================================

const getTrend = (change) => {
  if (change > 0) {
    return "up";
  }

  if (change < 0) {
    return "down";
  }

  return "neutral";
};

// =====================================================
// NUMBER NORMALIZER
// =====================================================

const normalizeNumber = (value) => {
  return Number(
    Number(value || 0).toFixed(2)
  );
};

// =====================================================
// SAFE SEARCH REGEX
// =====================================================

const createSearchRegex = (value) => {
  return new RegExp(
    value
      .trim()
      .replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      ),
    "i"
  );
};

// =====================================================
// EMPLOYEE VALIDATION
// =====================================================

const validateAssignedEmployee = async ({
  assignedTo,
  companyObjectId,
}) => {
  if (!assignedTo) {
    return {
      valid: true,
      employee: null,
    };
  }

  if (!isValidObjectId(assignedTo)) {
    return {
      valid: false,
      message:
        "Invalid assigned employee ID.",
    };
  }

  const employee =
    await User.findOne({
      _id: assignedTo,
      companyId: companyObjectId,
      role: "employee",
      isActive: true,
    }).select(
      "firstName lastName email role isActive"
    );

  if (!employee) {
    return {
      valid: false,
      message:
        "Assigned employee was not found or is not an active employee of your company.",
    };
  }

  return {
    valid: true,
    employee,
  };
};

// =====================================================
// LEAD VALIDATION
// =====================================================

const validateLead = async ({
  leadId,
  companyObjectId,
}) => {
  if (!leadId) {
    return {
      valid: true,
      lead: null,
    };
  }

  if (!isValidObjectId(leadId)) {
    return {
      valid: false,
      message: "Invalid lead ID.",
    };
  }

  const lead =
    await Lead.findOne({
      _id: leadId,
      companyId: companyObjectId,
    }).select(
      "firstName lastName email company assignedTo status"
    );

  if (!lead) {
    return {
      valid: false,
      message:
        "Lead was not found in your company.",
    };
  }

  return {
    valid: true,
    lead,
  };
};

// =====================================================
// DEAL NAME / DISPLAY
// =====================================================

const getDealCompany = (deal) => {
  if (
    deal?.customerId &&
    typeof deal.customerId === "object" &&
    deal.customerId.companyName
  ) {
    return deal.customerId.companyName;
  }

  if (
    deal?.leadId &&
    typeof deal.leadId === "object" &&
    deal.leadId.company
  ) {
    return deal.leadId.company;
  }

  return "—";
};

// =====================================================
// FORMAT DEAL
// =====================================================

const formatDeal = (deal) => {
  if (!deal) {
    return null;
  }

  const lead =
    deal.leadId &&
    typeof deal.leadId === "object"
      ? deal.leadId
      : null;

  const customer =
    deal.customerId &&
    typeof deal.customerId === "object"
      ? deal.customerId
      : null;

  const assignedEmployee =
    deal.assignedTo &&
    typeof deal.assignedTo === "object"
      ? deal.assignedTo
      : null;

  return {
    ...deal,

    id: deal._id,

    company: getDealCompany(deal),

    leadName: lead
      ? `${lead.firstName || ""} ${
          lead.lastName || ""
        }`.trim()
      : null,

    customerName: customer
      ? `${customer.firstName || ""} ${
          customer.lastName || ""
        }`.trim()
      : null,

    assignedEmployee,

    value: Number(deal.value) || 0,

    stage: deal.stage,

    status: deal.status,

    expectedCloseDate:
      deal.expectedCloseDate || null,

    lastActivityAt:
      deal.lastActivityAt ||
      deal.updatedAt ||
      deal.createdAt,
  };
};

// =====================================================
// NOTIFICATION
// =====================================================

const notifyDealEmployee = async ({
  companyId,
  userId,
  title,
  message,
  dealId,
  actionLabel = "View Deal",
  actionUrl,
}) => {
  if (!userId) {
    return;
  }

  try {
    await createNotification({
      companyId,
      userId,
      type: "deal",
      title,
      message,
      relatedId: dealId,
      relatedModel: "Deal",
      actionLabel,
      actionUrl:
        actionUrl ||
        `/deals/${dealId}`,
    });
  } catch (error) {
    console.error(
      "Deal Notification Error:",
      error
    );
  }
};

// =====================================================
// =====================================================
// ADMIN DEAL STATS
// =====================================================
// GET /api/admin/deals/stats
// =====================================================

const getDealStats = async (req, res) => {
  try {
    if (!checkAdminAccess(req, res)) {
      return;
    }

    const companyObjectId =
      getCompanyObjectId(req);

    if (!companyObjectId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing or invalid.",
      });
    }

    const now = new Date();

    const currentQuarter =
      Math.floor(
        now.getMonth() / 3
      );

    const currentQuarterStart =
      new Date(
        now.getFullYear(),
        currentQuarter * 3,
        1
      );

    const nextQuarterStart =
      new Date(
        now.getFullYear(),
        currentQuarter * 3 + 3,
        1
      );

    const previousQuarterStart =
      new Date(
        now.getFullYear(),
        currentQuarter * 3 - 3,
        1
      );

    // =====================================================
    // ACTIVE DEALS
    // =====================================================

    const activeDeals =
      await Deal.countDocuments({
        companyId: companyObjectId,
        status: "Open",
      });

    const currentQuarterActiveDeals =
      await Deal.countDocuments({
        companyId: companyObjectId,
        status: "Open",
        createdAt: {
          $gte: currentQuarterStart,
          $lt: nextQuarterStart,
        },
      });

    const previousQuarterActiveDeals =
      await Deal.countDocuments({
        companyId: companyObjectId,
        status: "Open",
        createdAt: {
          $gte: previousQuarterStart,
          $lt: currentQuarterStart,
        },
      });

    const activeDealsChange =
      calculatePercentageChange(
        currentQuarterActiveDeals,
        previousQuarterActiveDeals
      );

    // =====================================================
    // PIPELINE VALUE
    // =====================================================

    const pipelineResult =
      await Deal.aggregate([
        {
          $match: {
            companyId:
              companyObjectId,
            status: "Open",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$value",
            },
          },
        },
      ]);

    const pipelineValue =
      pipelineResult.length
        ? pipelineResult[0].total
        : 0;

    // =====================================================
    // CURRENT QUARTER PIPELINE
    // =====================================================

    const currentQuarterPipelineResult =
      await Deal.aggregate([
        {
          $match: {
            companyId:
              companyObjectId,
            status: "Open",
            createdAt: {
              $gte: currentQuarterStart,
              $lt: nextQuarterStart,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$value",
            },
          },
        },
      ]);

    const currentQuarterPipeline =
      currentQuarterPipelineResult.length
        ? currentQuarterPipelineResult[0].total
        : 0;

    // =====================================================
    // PREVIOUS QUARTER PIPELINE
    // =====================================================

    const previousQuarterPipelineResult =
      await Deal.aggregate([
        {
          $match: {
            companyId:
              companyObjectId,
            status: "Open",
            createdAt: {
              $gte: previousQuarterStart,
              $lt: currentQuarterStart,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$value",
            },
          },
        },
      ]);

    const previousQuarterPipeline =
      previousQuarterPipelineResult.length
        ? previousQuarterPipelineResult[0].total
        : 0;

    const pipelineChange =
      calculatePercentageChange(
        currentQuarterPipeline,
        previousQuarterPipeline
      );

    // =====================================================
    // WON / LOST
    // =====================================================

    const [
      wonDeals,
      lostDeals,
    ] = await Promise.all([
      Deal.countDocuments({
        companyId:
          companyObjectId,
        status: "Won",
      }),

      Deal.countDocuments({
        companyId:
          companyObjectId,
        status: "Lost",
      }),
    ]);

    const closedDeals =
      wonDeals + lostDeals;

    const winRate =
      closedDeals > 0
        ? (wonDeals / closedDeals) *
          100
        : 0;

    // =====================================================
    // CURRENT QUARTER WIN RATE
    // =====================================================

    const [
      currentQuarterWon,
      currentQuarterLost,
    ] = await Promise.all([
      Deal.countDocuments({
        companyId:
          companyObjectId,
        status: "Won",
        createdAt: {
          $gte: currentQuarterStart,
          $lt: nextQuarterStart,
        },
      }),

      Deal.countDocuments({
        companyId:
          companyObjectId,
        status: "Lost",
        createdAt: {
          $gte: currentQuarterStart,
          $lt: nextQuarterStart,
        },
      }),
    ]);

    const currentQuarterClosed =
      currentQuarterWon +
      currentQuarterLost;

    const currentQuarterWinRate =
      currentQuarterClosed > 0
        ? (currentQuarterWon /
            currentQuarterClosed) *
          100
        : 0;

    // =====================================================
    // PREVIOUS QUARTER WIN RATE
    // =====================================================

    const [
      previousQuarterWon,
      previousQuarterLost,
    ] = await Promise.all([
      Deal.countDocuments({
        companyId:
          companyObjectId,
        status: "Won",
        createdAt: {
          $gte: previousQuarterStart,
          $lt: currentQuarterStart,
        },
      }),

      Deal.countDocuments({
        companyId:
          companyObjectId,
        status: "Lost",
        createdAt: {
          $gte: previousQuarterStart,
          $lt: currentQuarterStart,
        },
      }),
    ]);

    const previousQuarterClosed =
      previousQuarterWon +
      previousQuarterLost;

    const previousQuarterWinRate =
      previousQuarterClosed > 0
        ? (previousQuarterWon /
            previousQuarterClosed) *
          100
        : 0;

    const winRateChange =
      currentQuarterWinRate -
      previousQuarterWinRate;

    // =====================================================
    // AVERAGE DEAL SIZE
    // =====================================================

    const averageDealSize =
      activeDeals > 0
        ? pipelineValue /
          activeDeals
        : 0;

    const currentQuarterAvgResult =
      await Deal.aggregate([
        {
          $match: {
            companyId:
              companyObjectId,
            status: "Open",
            createdAt: {
              $gte: currentQuarterStart,
              $lt: nextQuarterStart,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalValue: {
              $sum: "$value",
            },
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    const currentQuarterAvgDealSize =
      currentQuarterAvgResult.length &&
      currentQuarterAvgResult[0].count > 0
        ? currentQuarterAvgResult[0]
            .totalValue /
          currentQuarterAvgResult[0]
            .count
        : 0;

    const previousQuarterAvgResult =
      await Deal.aggregate([
        {
          $match: {
            companyId:
              companyObjectId,
            status: "Open",
            createdAt: {
              $gte: previousQuarterStart,
              $lt: currentQuarterStart,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalValue: {
              $sum: "$value",
            },
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    const previousQuarterAvgDealSize =
      previousQuarterAvgResult.length &&
      previousQuarterAvgResult[0].count > 0
        ? previousQuarterAvgResult[0]
            .totalValue /
          previousQuarterAvgResult[0]
            .count
        : 0;

    const averageDealSizeChange =
      calculatePercentageChange(
        currentQuarterAvgDealSize,
        previousQuarterAvgDealSize
      );

    // =====================================================
    // WON VALUE
    // =====================================================

    const wonValueResult =
      await Deal.aggregate([
        {
          $match: {
            companyId:
              companyObjectId,
            status: "Won",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$value",
            },
          },
        },
      ]);

    const wonValue =
      wonValueResult.length
        ? wonValueResult[0].total
        : 0;

    // =====================================================
    // TOTAL VALUE
    // =====================================================

    const totalValueResult =
      await Deal.aggregate([
        {
          $match: {
            companyId:
              companyObjectId,
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$value",
            },
          },
        },
      ]);

    const totalValue =
      totalValueResult.length
        ? totalValueResult[0].total
        : 0;

    // =====================================================
    // STAGE BREAKDOWN
    // =====================================================

    const stageBreakdown =
      await Deal.aggregate([
        {
          $match: {
            companyId:
              companyObjectId,
          },
        },
        {
          $group: {
            _id: "$stage",
            count: {
              $sum: 1,
            },
            value: {
              $sum: "$value",
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);

    return res.status(200).json({
      success: true,
      message:
        "Deal statistics fetched successfully.",

      data: {
        pipelineValue: {
          value:
            normalizeNumber(
              pipelineValue
            ),
          change:
            Number(
              pipelineChange.toFixed(
                1
              )
            ),
          trend:
            getTrend(
              pipelineChange
            ),
        },

        activeDeals: {
          value: activeDeals,
          change:
            Number(
              activeDealsChange.toFixed(
                1
              )
            ),
          trend:
            getTrend(
              activeDealsChange
            ),
        },

        winRate: {
          value:
            Number(
              winRate.toFixed(1)
            ),
          change:
            Number(
              winRateChange.toFixed(
                1
              )
            ),
          trend:
            getTrend(
              winRateChange
            ),
        },

        avgDealSize: {
          value:
            normalizeNumber(
              averageDealSize
            ),
          change:
            Number(
              averageDealSizeChange.toFixed(
                1
              )
            ),
          trend:
            getTrend(
              averageDealSizeChange
            ),
        },

        wonDeals: {
          value: wonDeals,
        },

        lostDeals: {
          value: lostDeals,
        },

        wonValue: {
          value:
            normalizeNumber(
              wonValue
            ),
        },

        totalValue: {
          value:
            normalizeNumber(
              totalValue
            ),
        },

        stageBreakdown,
      },
    });
  } catch (error) {
    console.error(
      "Deal Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching deal statistics.",
    });
  }
};

// =====================================================
// =====================================================
// EMPLOYEE DEAL STATS
// =====================================================
// GET /api/deals/me/stats
// =====================================================

const getMyDealStats = async (
  req,
  res
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const companyObjectId =
      getCompanyObjectId(req);

    if (!companyObjectId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing or invalid.",
      });
    }

    const userId = req.user._id;

    // =====================================================
    // DATE RANGE
    // =====================================================

    const now = new Date();

    const startOfMonth =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

    const nextMonthStart =
      new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
      );

    // =====================================================
    // MY DEALS
    // =====================================================

    const myDeals =
      await Deal.countDocuments({
        companyId:
          companyObjectId,
        assignedTo: userId,
      });

    // =====================================================
    // MY OPEN DEALS
    // =====================================================

    const openDeals =
      await Deal.countDocuments({
        companyId:
          companyObjectId,
        assignedTo: userId,
        status: "Open",
      });

    // =====================================================
    // MY WON DEALS
    // =====================================================

    const wonDeals =
      await Deal.countDocuments({
        companyId:
          companyObjectId,
        assignedTo: userId,
        status: "Won",
      });

    // =====================================================
    // MY WON VALUE
    // =====================================================

    const wonValueResult =
      await Deal.aggregate([
        {
          $match: {
            companyId:
              companyObjectId,
            assignedTo: new mongoose.Types.ObjectId(
              userId
            ),
            status: "Won",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$value",
            },
          },
        },
      ]);

    const wonValue =
      wonValueResult.length
        ? wonValueResult[0].total
        : 0;

    // =====================================================
    // ACTIVE PIPELINE VALUE
    // =====================================================

    const pipelineResult =
      await Deal.aggregate([
        {
          $match: {
            companyId:
              companyObjectId,
            assignedTo: new mongoose.Types.ObjectId(
              userId
            ),
            status: "Open",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$value",
            },
          },
        },
      ]);

    const pipelineValue =
      pipelineResult.length
        ? pipelineResult[0].total
        : 0;

    // =====================================================
    // CLOSING THIS MONTH
    // =====================================================

    const closingThisMonth =
      await Deal.countDocuments({
        companyId:
          companyObjectId,
        assignedTo: userId,
        status: "Open",
        expectedCloseDate: {
          $gte: startOfMonth,
          $lt: nextMonthStart,
        },
      });

    // =====================================================
    // CLOSING THIS MONTH VALUE
    // =====================================================

    const closingThisMonthResult =
      await Deal.aggregate([
        {
          $match: {
            companyId:
              companyObjectId,
            assignedTo: new mongoose.Types.ObjectId(
              userId
            ),
            status: "Open",
            expectedCloseDate: {
              $gte: startOfMonth,
              $lt: nextMonthStart,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$value",
            },
          },
        },
      ]);

    const closingThisMonthValue =
      closingThisMonthResult.length
        ? closingThisMonthResult[0].total
        : 0;

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      message:
        "My deal statistics fetched successfully.",

      data: {
        myDeals: {
          value: myDeals,
          pipelineValue:
            normalizeNumber(
              pipelineValue
            ),
          formattedPipelineValue:
            `$${Number(
              pipelineValue || 0
            ).toLocaleString()}`,
        },

        wonDeals: {
          value: wonDeals,
          valueAmount:
            normalizeNumber(
              wonValue
            ),
          formattedValue:
            `$${Number(
              wonValue || 0
            ).toLocaleString()}`,
        },

        dealsInProgress: {
          value: openDeals,
          pipelineValue:
            normalizeNumber(
              pipelineValue
            ),
          formattedPipelineValue:
            `$${Number(
              pipelineValue || 0
            ).toLocaleString()}`,
        },

        closingThisMonth: {
          value:
            closingThisMonth,
          potentialValue:
            normalizeNumber(
              closingThisMonthValue
            ),
          formattedPotentialValue:
            `$${Number(
              closingThisMonthValue ||
                0
            ).toLocaleString()}`,
        },
      },
    });
  } catch (error) {
    console.error(
      "Get My Deal Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch your deal statistics.",
    });
  }
};

// =====================================================
// =====================================================
// EMPLOYEE MY DEALS
// =====================================================
// GET /api/deals/me
// =====================================================

const getMyDeals = async (
  req,
  res
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const companyObjectId =
      getCompanyObjectId(req);

    if (!companyObjectId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing or invalid.",
      });
    }

    const userId = req.user._id;

    // =====================================================
    // QUERY PARAMS
    // =====================================================

    const {
      search = "",
      stage = "",
      status = "",
      value = "",
      closeDate = "",
      sort = "newest",
      page = 1,
      limit = 5,
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const currentLimit = Math.min(
      Math.max(
        Number(limit) || 5,
        1
      ),
      100
    );

    const skip =
      (currentPage - 1) *
      currentLimit;

    // =====================================================
    // BASE FILTER
    // =====================================================

    const filter = {
      companyId:
        companyObjectId,

      assignedTo: userId,
    };

    // =====================================================
    // SEARCH
    // =====================================================

    if (
      typeof search === "string" &&
      search.trim()
    ) {
      const searchRegex =
        createSearchRegex(search);

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
      ];
    }

    // =====================================================
    // STAGE
    // =====================================================

    if (stage) {
      if (
        !DEAL_STAGES.includes(
          stage
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid deal stage.",
        });
      }

      filter.stage = stage;
    }

    // =====================================================
    // STATUS
    // =====================================================

    if (status) {
      if (
        !DEAL_STATUSES.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid deal status.",
        });
      }

      filter.status = status;
    }

    // =====================================================
    // DEAL VALUE FILTER
    // =====================================================

    if (value) {
      const numericValue =
        Number(value);

      // Exact numeric value
      if (
        Number.isFinite(
          numericValue
        )
      ) {
        filter.value =
          numericValue;
      }

      // Common frontend aliases
      if (
        value === "low" ||
        value === "low-value"
      ) {
        filter.value = {
          $lt: 10000,
        };
      }

      if (
        value === "medium" ||
        value === "mid"
      ) {
        filter.value = {
          $gte: 10000,
          $lt: 50000,
        };
      }

      if (
        value === "high" ||
        value === "high-value"
      ) {
        filter.value = {
          $gte: 50000,
        };
      }

      if (
        value === "under-10k"
      ) {
        filter.value = {
          $lt: 10000,
        };
      }

      if (
        value === "10k-50k"
      ) {
        filter.value = {
          $gte: 10000,
          $lt: 50000,
        };
      }

      if (
        value === "over-50k"
      ) {
        filter.value = {
          $gte: 50000,
        };
      }
    }

    // =====================================================
    // CLOSE DATE FILTER
    // =====================================================

    if (closeDate) {
      const now = new Date();

      const startOfToday =
        new Date(now);

      startOfToday.setHours(
        0,
        0,
        0,
        0
      );

      const startOfTomorrow =
        new Date(
          startOfToday
        );

      startOfTomorrow.setDate(
        startOfTomorrow.getDate() +
          1
      );

      const startOfMonth =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        );

      const nextMonthStart =
        new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          1
        );

      if (
        closeDate ===
          "today"
      ) {
        filter.expectedCloseDate = {
          $gte: startOfToday,
          $lt: startOfTomorrow,
        };
      }

      if (
        closeDate ===
          "this-month"
      ) {
        filter.expectedCloseDate = {
          $gte: startOfMonth,
          $lt: nextMonthStart,
        };
      }

      if (
        closeDate ===
          "next-month"
      ) {
        const nextNextMonth =
          new Date(
            now.getFullYear(),
            now.getMonth() + 2,
            1
          );

        filter.expectedCloseDate = {
          $gte: nextMonthStart,
          $lt: nextNextMonth,
        };
      }

      if (
        closeDate ===
          "overdue"
      ) {
        filter.expectedCloseDate = {
          $lt: startOfToday,
        };

        filter.status = "Open";
      }

      if (
        closeDate ===
          "upcoming"
      ) {
        filter.expectedCloseDate = {
          $gte: startOfToday,
        };
      }
    }

    // =====================================================
    // SORT
    // =====================================================

    let sortQuery = {
      createdAt: -1,
    };

    switch (sort) {
      case "newest":
      case "recent":
      case "recently-updated":
        sortQuery = {
          updatedAt: -1,
        };
        break;

      case "oldest":
        sortQuery = {
          createdAt: 1,
        };
        break;

      case "value-high":
      case "highest-value":
        sortQuery = {
          value: -1,
        };
        break;

      case "value-low":
      case "lowest-value":
        sortQuery = {
          value: 1,
        };
        break;

      case "close-soon":
      case "close-date":
        sortQuery = {
          expectedCloseDate: 1,
        };
        break;

      case "close-late":
        sortQuery = {
          expectedCloseDate: -1,
        };
        break;

      default:
        sortQuery = {
          updatedAt: -1,
        };
        break;
    }

    // =====================================================
    // FETCH
    // =====================================================

    const [
      deals,
      total,
    ] = await Promise.all([
      Deal.find(filter)
        .populate(
          "assignedTo",
          "firstName lastName email role isActive"
        )
        .populate(
          "leadId",
          "firstName lastName email company"
        )
        .populate(
          "customerId",
          "firstName lastName companyName email"
        )
        .sort(sortQuery)
        .skip(skip)
        .limit(currentLimit)
        .lean(),

      Deal.countDocuments(
        filter
      ),
    ]);

    // =====================================================
    // FORMAT
    // =====================================================

    const formattedDeals =
      deals.map(formatDeal);

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages =
      total > 0
        ? Math.ceil(
            total /
              currentLimit
          )
        : 0;

    return res.status(200).json({
      success: true,

      message:
        "My deals fetched successfully.",

      data: {
        deals:
          formattedDeals,

        pagination: {
          page:
            currentPage,

          currentPage:
            currentPage,

          limit:
            currentLimit,

          total,

          totalDeals:
            total,

          totalPages,

          hasNextPage:
            currentPage <
            totalPages,

          hasPreviousPage:
            currentPage > 1,
        },
      },
    });
  } catch (error) {
    console.error(
      "Get My Deals Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch your deals.",
    });
  }
};

// =====================================================
// =====================================================
// EMPLOYEE SINGLE DEAL
// =====================================================
// GET /api/deals/me/:id
// =====================================================

const getMyDealById = async (
  req,
  res
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const companyObjectId =
      getCompanyObjectId(req);

    if (!companyObjectId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing or invalid.",
      });
    }

    const { id } =
      req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid deal ID.",
      });
    }

    const deal =
      await Deal.findOne({
        _id: id,

        companyId:
          companyObjectId,

        assignedTo:
          req.user._id,
      })
        .populate(
          "assignedTo",
          "firstName lastName email role isActive"
        )
        .populate(
          "leadId",
          "firstName lastName email company"
        )
        .populate(
          "customerId",
          "firstName lastName companyName email"
        )
        .lean();

    if (!deal) {
      return res.status(404).json({
        success: false,
        message:
          "Deal not found or is not assigned to you.",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "My deal fetched successfully.",

      data: {
        deal:
          formatDeal(deal),
      },
    });
  } catch (error) {
    console.error(
      "Get My Deal Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch your deal.",
    });
  }
};

// =====================================================
// =====================================================
// ADMIN GET ALL DEALS
// =====================================================
// GET /api/admin/deals
// =====================================================

const getDeals = async (req, res) => {
  try {
    if (!checkAdminAccess(req, res)) {
      return;
    }

    const companyObjectId =
      getCompanyObjectId(req);

    if (!companyObjectId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing or invalid.",
      });
    }

    const {
      search = "",
      stage,
      status,
      assignedTo,
      leadId,
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage =
      Math.max(
        Number(page) || 1,
        1
      );

    const currentLimit =
      Math.min(
        Math.max(
          Number(limit) || 10,
          1
        ),
        100
      );

    const skip =
      (currentPage - 1) *
      currentLimit;

    const filter = {
      companyId:
        companyObjectId,
    };

    // =====================================================
    // STAGE
    // =====================================================

    if (stage) {
      if (
        !DEAL_STAGES.includes(
          stage
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid deal stage.",
        });
      }

      filter.stage = stage;
    }

    // =====================================================
    // STATUS
    // =====================================================

    if (status) {
      if (
        !DEAL_STATUSES.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid deal status.",
        });
      }

      filter.status = status;
    }

    // =====================================================
    // ASSIGNED EMPLOYEE
    // =====================================================

    if (assignedTo) {
      if (
        !isValidObjectId(
          assignedTo
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid assigned employee ID.",
        });
      }

      const employee =
        await User.findOne({
          _id: assignedTo,
          companyId:
            companyObjectId,
          role: "employee",
        }).select("_id");

      if (!employee) {
        return res.status(400).json({
          success: false,
          message:
            "Assigned employee does not belong to your company.",
        });
      }

      filter.assignedTo =
        employee._id;
    }

    // =====================================================
    // LEAD
    // =====================================================

    if (leadId) {
      const leadResult =
        await validateLead({
          leadId,
          companyObjectId,
        });

      if (!leadResult.valid) {
        return res.status(400).json({
          success: false,
          message:
            leadResult.message,
        });
      }

      filter.leadId =
        leadId;
    }

    // =====================================================
    // SEARCH
    // =====================================================

    if (
      typeof search === "string" &&
      search.trim()
    ) {
      const searchRegex =
        createSearchRegex(search);

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
      ];
    }

    // =====================================================
    // FETCH
    // =====================================================

    const [
      deals,
      total,
    ] = await Promise.all([
      Deal.find(filter)
        .populate(
          "assignedTo",
          "firstName lastName email role isActive"
        )
        .populate(
          "leadId",
          "firstName lastName email company"
        )
        .populate(
          "customerId",
          "firstName lastName companyName email"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(currentLimit)
        .lean(),

      Deal.countDocuments(
        filter
      ),
    ]);

    const formattedDeals =
      deals.map(formatDeal);

    const totalPages =
      total > 0
        ? Math.ceil(
            total /
              currentLimit
          )
        : 0;

    return res.status(200).json({
      success: true,

      message:
        "Deals fetched successfully.",

      data: {
        deals:
          formattedDeals,

        pagination: {
          page:
            currentPage,

          limit:
            currentLimit,

          total,

          totalPages,

          hasNextPage:
            currentPage <
            totalPages,

          hasPreviousPage:
            currentPage > 1,
        },
      },
    });
  } catch (error) {
    console.error(
      "Get Deals Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching deals.",
    });
  }
};

// =====================================================
// =====================================================
// ADMIN GET SINGLE DEAL
// =====================================================
// GET /api/admin/deals/:id
// =====================================================

const getDealById = async (
  req,
  res
) => {
  try {
    if (!checkAdminAccess(req, res)) {
      return;
    }

    const companyObjectId =
      getCompanyObjectId(req);

    const { id } =
      req.params;

    if (!companyObjectId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing or invalid.",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid deal ID.",
      });
    }

    const deal =
      await Deal.findOne({
        _id: id,
        companyId:
          companyObjectId,
      })
        .populate(
          "assignedTo",
          "firstName lastName email role isActive"
        )
        .populate(
          "leadId",
          "firstName lastName email company"
        )
        .populate(
          "customerId",
          "firstName lastName companyName email"
        )
        .lean();

    if (!deal) {
      return res.status(404).json({
        success: false,
        message:
          "Deal not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Deal fetched successfully.",

      data: {
        deal:
          formatDeal(deal),
      },
    });
  } catch (error) {
    console.error(
      "Get Deal Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching the deal.",
    });
  }
};

// =====================================================
// =====================================================
// CREATE DEAL
// =====================================================
// POST /api/admin/deals
// =====================================================

const createDeal = async (
  req,
  res
) => {
  try {
    if (!checkAdminAccess(req, res)) {
      return;
    }

    const companyObjectId =
      getCompanyObjectId(req);

    if (!companyObjectId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing or invalid.",
      });
    }

    const {
      title,
      description,
      leadId,
      value,
      stage,
      status,
      assignedTo,
      expectedCloseDate,
      notes,
      customerId,
    } = req.body;

    // =====================================================
    // CUSTOMER
    // =====================================================

    if (customerId) {
      return res.status(400).json({
        success: false,
        message:
          "Customer assignment is not available yet.",
      });
    }

    // =====================================================
    // TITLE
    // =====================================================

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Deal title is required.",
      });
    }

    // =====================================================
    // VALUE
    // =====================================================

    const numericValue =
      value === undefined ||
      value === null ||
      value === ""
        ? 0
        : Number(value);

    if (
      !Number.isFinite(
        numericValue
      ) ||
      numericValue < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Deal value must be a valid non-negative number.",
      });
    }

    // =====================================================
    // STATUS
    // =====================================================

    const normalizedStatus =
      status || "Open";

    if (
      !DEAL_STATUSES.includes(
        normalizedStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid deal status.",
      });
    }

    // =====================================================
    // STAGE
    // =====================================================

    let normalizedStage =
      stage || "Prospecting";

    if (
      !DEAL_STAGES.includes(
        normalizedStage
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid deal stage.",
      });
    }

    if (
      normalizedStatus === "Won"
    ) {
      normalizedStage =
        "Closed Won";
    }

    if (
      normalizedStatus === "Lost"
    ) {
      normalizedStage =
        "Closed Lost";
    }

    if (
      normalizedStatus === "Open" &&
      (
        normalizedStage ===
          "Closed Won" ||
        normalizedStage ===
          "Closed Lost"
      )
    ) {
      normalizedStage =
        "Prospecting";
    }

    // =====================================================
    // LEAD
    // =====================================================

    const leadResult =
      await validateLead({
        leadId,
        companyObjectId,
      });

    if (!leadResult.valid) {
      return res.status(400).json({
        success: false,
        message:
          leadResult.message,
      });
    }

    // =====================================================
    // EMPLOYEE
    // =====================================================

    const employeeResult =
      await validateAssignedEmployee({
        assignedTo,
        companyObjectId,
      });

    if (!employeeResult.valid) {
      return res.status(400).json({
        success: false,
        message:
          employeeResult.message,
      });
    }

    // =====================================================
    // CLOSE DATE
    // =====================================================

    let parsedExpectedCloseDate =
      null;

    if (expectedCloseDate) {
      parsedExpectedCloseDate =
        new Date(
          expectedCloseDate
        );

      if (
        Number.isNaN(
          parsedExpectedCloseDate.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid expected close date.",
        });
      }
    }

    // =====================================================
    // CREATE
    // =====================================================

    const deal =
      await Deal.create({
        companyId:
          companyObjectId,

        title:
          title.trim(),

        description:
          typeof description ===
          "string"
            ? description.trim() ||
              null
            : null,

        leadId:
          leadId || null,

        customerId:
          null,

        value:
          numericValue,

        stage:
          normalizedStage,

        status:
          normalizedStatus,

        assignedTo:
          assignedTo || null,

        expectedCloseDate:
          parsedExpectedCloseDate,

        notes:
          typeof notes === "string"
            ? notes.trim() ||
              null
            : null,

        lastActivityAt:
          new Date(),

        closedAt:
          normalizedStatus ===
            "Won" ||
          normalizedStatus ===
            "Lost"
            ? new Date()
            : null,
      });

    // =====================================================
    // NOTIFICATION
    // =====================================================

    if (
      employeeResult.employee
    ) {
      await notifyDealEmployee({
        companyId:
          companyObjectId,

        userId:
          employeeResult.employee
            ._id,

        title:
          "New Deal Assigned",

        message:
          `A new deal "${deal.title}" has been assigned to you.`,

        dealId:
          deal._id,
      });
    }

    // =====================================================
    // POPULATE
    // =====================================================

    const populatedDeal =
      await Deal.findById(
        deal._id
      )
        .populate(
          "assignedTo",
          "firstName lastName email role isActive"
        )
        .populate(
          "leadId",
          "firstName lastName email company"
        )
        .populate(
          "customerId",
          "firstName lastName companyName email"
        )
        .lean();

    return res.status(201).json({
      success: true,

      message:
        "Deal created successfully.",

      data: {
        deal:
          formatDeal(
            populatedDeal
          ),
      },
    });
  } catch (error) {
    console.error(
      "Create Deal Error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          Object.values(
            error.errors
          )
            .map(
              (item) =>
                item.message
            )
            .join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while creating the deal.",
    });
  }
};

// =====================================================
// =====================================================
// UPDATE DEAL
// =====================================================
// PUT /api/admin/deals/:id
// =====================================================

const updateDeal = async (
  req,
  res
) => {
  try {
    if (!checkAdminAccess(req, res)) {
      return;
    }

    const companyObjectId =
      getCompanyObjectId(req);

    const { id } =
      req.params;

    if (!companyObjectId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing or invalid.",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid deal ID.",
      });
    }

    const deal =
      await Deal.findOne({
        _id: id,
        companyId:
          companyObjectId,
      });

    if (!deal) {
      return res.status(404).json({
        success: false,
        message:
          "Deal not found.",
      });
    }

    const oldAssignedTo =
      deal.assignedTo
        ? deal.assignedTo.toString()
        : null;

    const oldStatus =
      deal.status;

    const oldStage =
      deal.stage;

    const {
      title,
      description,
      leadId,
      value,
      stage,
      status,
      assignedTo,
      expectedCloseDate,
      notes,
      customerId,
    } = req.body;

    // =====================================================
    // CUSTOMER
    // =====================================================

    if (
      customerId !== undefined &&
      customerId !== null &&
      customerId !== ""
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Customer assignment is not available yet.",
      });
    }

    // =====================================================
    // TITLE
    // =====================================================

    if (title !== undefined) {
      if (
        typeof title !== "string" ||
        !title.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Deal title cannot be empty.",
        });
      }

      deal.title =
        title.trim();
    }

    // =====================================================
    // DESCRIPTION
    // =====================================================

    if (
      description !==
      undefined
    ) {
      deal.description =
        typeof description ===
        "string"
          ? description.trim() ||
            null
          : null;
    }

    // =====================================================
    // LEAD
    // =====================================================

    if (leadId !== undefined) {
      const leadResult =
        await validateLead({
          leadId,
          companyObjectId,
        });

      if (!leadResult.valid) {
        return res.status(400).json({
          success: false,
          message:
            leadResult.message,
        });
      }

      deal.leadId =
        leadId || null;
    }

    // =====================================================
    // VALUE
    // =====================================================

    if (value !== undefined) {
      const numericValue =
        Number(value);

      if (
        !Number.isFinite(
          numericValue
        ) ||
        numericValue < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Deal value must be a valid non-negative number.",
        });
      }

      deal.value =
        numericValue;
    }

    // =====================================================
    // STAGE
    // =====================================================

    if (stage !== undefined) {
      if (
        !DEAL_STAGES.includes(
          stage
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid deal stage.",
        });
      }

      deal.stage =
        stage;
    }

    // =====================================================
    // STATUS
    // =====================================================

    if (status !== undefined) {
      if (
        !DEAL_STATUSES.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid deal status.",
        });
      }

      deal.status =
        status;

      if (
        status === "Won"
      ) {
        deal.stage =
          "Closed Won";

        if (!deal.closedAt) {
          deal.closedAt =
            new Date();
        }
      }

      if (
        status === "Lost"
      ) {
        deal.stage =
          "Closed Lost";

        if (!deal.closedAt) {
          deal.closedAt =
            new Date();
        }
      }

      if (
        status === "Open"
      ) {
        deal.closedAt =
          null;

        if (
          deal.stage ===
            "Closed Won" ||
          deal.stage ===
            "Closed Lost"
        ) {
          deal.stage =
            "Prospecting";
        }
      }
    }

    // =====================================================
    // FINAL STATUS / STAGE CONSISTENCY
    // =====================================================

    if (
      deal.status === "Won"
    ) {
      deal.stage =
        "Closed Won";
    }

    if (
      deal.status === "Lost"
    ) {
      deal.stage =
        "Closed Lost";
    }

    if (
      deal.status === "Open" &&
      (
        deal.stage ===
          "Closed Won" ||
        deal.stage ===
          "Closed Lost"
      )
    ) {
      deal.stage =
        "Prospecting";
    }

    // =====================================================
    // ASSIGNED EMPLOYEE
    // =====================================================

    let newEmployee =
      null;

    if (
      assignedTo !==
      undefined
    ) {
      const employeeResult =
        await validateAssignedEmployee({
          assignedTo,
          companyObjectId,
        });

      if (!employeeResult.valid) {
        return res.status(400).json({
          success: false,
          message:
            employeeResult.message,
        });
      }

      newEmployee =
        employeeResult.employee;

      deal.assignedTo =
        assignedTo || null;
    }

    // =====================================================
    // EXPECTED CLOSE DATE
    // =====================================================

    if (
      expectedCloseDate !==
      undefined
    ) {
      if (expectedCloseDate) {
        const closeDate =
          new Date(
            expectedCloseDate
          );

        if (
          Number.isNaN(
            closeDate.getTime()
          )
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid expected close date.",
          });
        }

        deal.expectedCloseDate =
          closeDate;
      } else {
        deal.expectedCloseDate =
          null;
      }
    }

    // =====================================================
    // NOTES
    // =====================================================

    if (notes !== undefined) {
      deal.notes =
        typeof notes ===
        "string"
          ? notes.trim() ||
            null
          : null;
    }

    // =====================================================
    // ACTIVITY
    // =====================================================

    deal.lastActivityAt =
      new Date();

    await deal.save();

    // =====================================================
    // ASSIGNMENT CHANGE
    // =====================================================

    const newAssignedTo =
      deal.assignedTo
        ? deal.assignedTo.toString()
        : null;

    const assignmentChanged =
      newAssignedTo !==
      oldAssignedTo;

    if (
      assignmentChanged &&
      newAssignedTo &&
      newEmployee
    ) {
      await notifyDealEmployee({
        companyId:
          companyObjectId,

        userId:
          newEmployee._id,

        title:
          "Deal Assigned To You",

        message:
          `The deal "${deal.title}" has been assigned to you.`,

        dealId:
          deal._id,
      });

      if (oldAssignedTo) {
        await notifyDealEmployee({
          companyId:
            companyObjectId,

          userId:
            oldAssignedTo,

          title:
            "Deal Reassigned",

          message:
            `The deal "${deal.title}" has been reassigned to another team member.`,

          dealId:
            deal._id,
        });
      }
    }

    // =====================================================
    // STATUS CHANGE
    // =====================================================

    if (
      oldStatus !==
        deal.status &&
      newAssignedTo
    ) {
      let notificationTitle =
        "Deal Status Updated";

      let notificationMessage =
        `The deal "${deal.title}" status changed from ${oldStatus} to ${deal.status}.`;

      if (
        deal.status === "Won"
      ) {
        notificationTitle =
          "Deal Won 🎉";

        notificationMessage =
          `Congratulations! The deal "${deal.title}" has been marked as Won.`;
      }

      if (
        deal.status === "Lost"
      ) {
        notificationTitle =
          "Deal Lost";

        notificationMessage =
          `The deal "${deal.title}" has been marked as Lost.`;
      }

      await notifyDealEmployee({
        companyId:
          companyObjectId,

        userId:
          newAssignedTo,

        title:
          notificationTitle,

        message:
          notificationMessage,

        dealId:
          deal._id,
      });
    }

    // =====================================================
    // STAGE CHANGE
    // =====================================================

    if (
      oldStage !==
        deal.stage &&
      oldStatus ===
        deal.status &&
      newAssignedTo
    ) {
      await notifyDealEmployee({
        companyId:
          companyObjectId,

        userId:
          newAssignedTo,

        title:
          "Deal Stage Updated",

        message:
          `The deal "${deal.title}" moved to ${deal.stage}.`,

        dealId:
          deal._id,
      });
    }

    // =====================================================
    // POPULATE
    // =====================================================

    const updatedDeal =
      await Deal.findById(
        deal._id
      )
        .populate(
          "assignedTo",
          "firstName lastName email role isActive"
        )
        .populate(
          "leadId",
          "firstName lastName email company"
        )
        .populate(
          "customerId",
          "firstName lastName companyName email"
        )
        .lean();

    return res.status(200).json({
      success: true,

      message:
        "Deal updated successfully.",

      data: {
        deal:
          formatDeal(
            updatedDeal
          ),
      },
    });
  } catch (error) {
    console.error(
      "Update Deal Error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          Object.values(
            error.errors
          )
            .map(
              (item) =>
                item.message
            )
            .join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while updating the deal.",
    });
  }
};

// =====================================================
// =====================================================
// DELETE DEAL
// =====================================================
// DELETE /api/admin/deals/:id
// =====================================================

const deleteDeal = async (
  req,
  res
) => {
  try {
    if (!checkAdminAccess(req, res)) {
      return;
    }

    const companyObjectId =
      getCompanyObjectId(req);

    const { id } =
      req.params;

    if (!companyObjectId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing or invalid.",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid deal ID.",
      });
    }

    const deal =
      await Deal.findOne({
        _id: id,
        companyId:
          companyObjectId,
      });

    if (!deal) {
      return res.status(404).json({
        success: false,
        message:
          "Deal not found.",
      });
    }

    const assignedEmployeeId =
      deal.assignedTo
        ? deal.assignedTo.toString()
        : null;

    await Deal.deleteOne({
      _id: id,
      companyId:
        companyObjectId,
    });

    // =====================================================
    // NOTIFICATION
    // =====================================================

    if (assignedEmployeeId) {
      await notifyDealEmployee({
        companyId:
          companyObjectId,

        userId:
          assignedEmployeeId,

        title:
          "Deal Removed",

        message:
          `The deal "${deal.title}" assigned to you has been removed.`,

        dealId:
          deal._id,

        actionLabel:
          "View Deals",

        actionUrl:
          "/deals",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Deal deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Deal Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while deleting the deal.",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  // =====================================================
  // ADMIN
  // =====================================================

  getDealStats,
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,

  // =====================================================
  // EMPLOYEE
  // =====================================================

  getMyDealStats,
  getMyDeals,
  getMyDealById,
};