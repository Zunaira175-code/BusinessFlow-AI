const Lead = require("../models/Lead");
const Deal = require("../models/Deal");
const CustomerActivity = require("../models/CustomerActivity");
const User = require("../models/User");

// =====================================================
// HELPERS
// =====================================================

const getCompanyId = (req) => {
  if (!req.user?.companyId) {
    return null;
  }

  return req.user.companyId._id || req.user.companyId;
};

const calculatePercentageChange = (
  current,
  previous
) => {
  const currentValue = Number(current) || 0;
  const previousValue = Number(previous) || 0;

  if (previousValue === 0) {
    if (currentValue === 0) {
      return 0;
    }

    return 100;
  }

  return (
    ((currentValue - previousValue) /
      previousValue) *
    100
  );
};

// =====================================================
// ADMIN DASHBOARD STATS
// GET /api/admin/dashboard/stats
// ADMIN ONLY
// =====================================================

const getDashboardStats = async (req, res) => {
  try {
    // =====================================================
    // ADMIN CHECK
    // =====================================================

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Only administrators can access dashboard statistics.",
      });
    }

    // =====================================================
    // COMPANY CHECK
    // =====================================================

    const companyId = getCompanyId(req);

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company information is missing.",
      });
    }

    // =====================================================
    // DATE RANGE
    // =====================================================

    const now = new Date();

    const currentMonthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const nextMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    // =====================================================
    // 1. TOTAL REVENUE
    // =====================================================

    const totalRevenueResult =
      await Deal.aggregate([
        {
          $match: {
            companyId,
            status: "Won",
            stage: "Closed Won",
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

    const totalRevenue =
      totalRevenueResult[0]?.total || 0;

    // =====================================================
    // CURRENT MONTH REVENUE
    // =====================================================

    const currentMonthRevenueResult =
      await Deal.aggregate([
        {
          $match: {
            companyId,
            status: "Won",
            stage: "Closed Won",
            closedAt: {
              $gte: currentMonthStart,
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

    const currentMonthRevenue =
      currentMonthRevenueResult[0]?.total || 0;

    // =====================================================
    // PREVIOUS MONTH REVENUE
    // =====================================================

    const previousMonthRevenueResult =
      await Deal.aggregate([
        {
          $match: {
            companyId,
            status: "Won",
            stage: "Closed Won",
            closedAt: {
              $gte: previousMonthStart,
              $lt: currentMonthStart,
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

    const previousMonthRevenue =
      previousMonthRevenueResult[0]?.total || 0;

    const revenueChange =
      calculatePercentageChange(
        currentMonthRevenue,
        previousMonthRevenue
      );

    // =====================================================
    // 2. NEW LEADS
    // =====================================================

    const currentNewLeads =
      await Lead.countDocuments({
        companyId,
        createdAt: {
          $gte: currentMonthStart,
          $lt: nextMonthStart,
        },
      });

    const previousNewLeads =
      await Lead.countDocuments({
        companyId,
        createdAt: {
          $gte: previousMonthStart,
          $lt: currentMonthStart,
        },
      });

    const leadsChange =
      calculatePercentageChange(
        currentNewLeads,
        previousNewLeads
      );

    // =====================================================
    // 3. ACTIVE DEALS
    // =====================================================

    const activeDeals =
      await Deal.countDocuments({
        companyId,
        status: "Open",
      });

    const previousActiveDeals =
      await Deal.countDocuments({
        companyId,
        status: "Open",
        createdAt: {
          $lt: currentMonthStart,
        },
      });

    const dealsChange =
      calculatePercentageChange(
        activeDeals,
        previousActiveDeals
      );

    // =====================================================
    // 4. CONVERSION RATE
    // =====================================================

    const totalLeads =
      await Lead.countDocuments({
        companyId,
      });

    const convertedLeads =
      await Lead.countDocuments({
        companyId,
        status: "Converted",
      });

    const conversionRate =
      totalLeads > 0
        ? (convertedLeads / totalLeads) * 100
        : 0;

    // =====================================================
    // PREVIOUS CONVERSION RATE
    // =====================================================

    const previousTotalLeads =
      await Lead.countDocuments({
        companyId,
        createdAt: {
          $lt: currentMonthStart,
        },
      });

    const previousConvertedLeads =
      await Lead.countDocuments({
        companyId,
        status: "Converted",
        createdAt: {
          $lt: currentMonthStart,
        },
      });

    const previousConversionRate =
      previousTotalLeads > 0
        ? (previousConvertedLeads /
            previousTotalLeads) *
          100
        : 0;

    const conversionChange =
      conversionRate -
      previousConversionRate;

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      message:
        "Dashboard statistics fetched successfully.",

      data: {
        totalRevenue: {
          value: Number(totalRevenue),

          change: Number(
            revenueChange.toFixed(1)
          ),

          trend:
            revenueChange >= 0
              ? "up"
              : "down",
        },

        newLeads: {
          value: Number(
            currentNewLeads
          ),

          change: Number(
            leadsChange.toFixed(1)
          ),

          trend:
            leadsChange >= 0
              ? "up"
              : "down",
        },

        activeDeals: {
          value: Number(
            activeDeals
          ),

          change: Number(
            dealsChange.toFixed(1)
          ),

          trend:
            dealsChange >= 0
              ? "up"
              : "down",
        },

        conversionRate: {
          value: Number(
            conversionRate.toFixed(1)
          ),

          change: Number(
            conversionChange.toFixed(1)
          ),

          trend:
            conversionChange >= 0
              ? "up"
              : "down",
        },
      },
    });
  } catch (error) {
    console.error(
      "Dashboard Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching dashboard statistics.",
    });
  }
};

// =====================================================
// ADMIN PIPELINE STATS
// GET /api/admin/dashboard/pipeline
// ADMIN ONLY
// =====================================================

const getPipelineStats = async (req, res) => {
  try {
    // =====================================================
    // ADMIN CHECK
    // =====================================================

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Only administrators can access pipeline statistics.",
      });
    }

    // =====================================================
    // COMPANY CHECK
    // =====================================================

    const companyId = getCompanyId(req);

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing.",
      });
    }

    // =====================================================
    // LAST 6 MONTHS
    // =====================================================

    const now = new Date();

    const currentMonthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const months = [];

    for (let i = 5; i >= 0; i--) {
      const start = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      const end = new Date(
        start.getFullYear(),
        start.getMonth() + 1,
        1
      );

      months.push({
        month: start.toLocaleString(
          "en-US",
          {
            month: "short",
          }
        ),

        start,

        end,

        type:
          start <= currentMonthStart
            ? "actual"
            : "projected",
      });
    }

    // =====================================================
    // MONTHLY PIPELINE
    // =====================================================

    const monthlyPipeline = [];

    for (const month of months) {
      let value = 0;

      // ===================================================
      // ACTUAL MONTH
      // Closed Won revenue
      // ===================================================

      if (month.type === "actual") {
        const result =
          await Deal.aggregate([
            {
              $match: {
                companyId,
                status: "Won",
                stage: "Closed Won",
                closedAt: {
                  $gte: month.start,
                  $lt: month.end,
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

        value =
          result[0]?.total || 0;
      }

      // ===================================================
      // PROJECTED MONTH
      // Open deals expected to close
      // ===================================================

      if (month.type === "projected") {
        const result =
          await Deal.aggregate([
            {
              $match: {
                companyId,
                status: "Open",

                stage: {
                  $nin: [
                    "Closed Won",
                    "Closed Lost",
                  ],
                },

                expectedCloseDate: {
                  $gte: month.start,
                  $lt: month.end,
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

        value =
          result[0]?.total || 0;
      }

      monthlyPipeline.push({
        month: month.month,

        type: month.type,

        value: Number(value),
      });
    }

    // =====================================================
    // PIPELINE STAGES
    // =====================================================

    const stages = [
      "Prospecting",
      "Qualification",
      "Proposal",
      "Negotiation",
      "Closed Won",
      "Closed Lost",
    ];

    // =====================================================
    // PIPELINE AGGREGATION
    // =====================================================

    const pipelineResult =
      await Deal.aggregate([
        {
          $match: {
            companyId,
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
      ]);

    // =====================================================
    // PIPELINE MAP
    // =====================================================

    const pipelineMap = {};

    pipelineResult.forEach((item) => {
      pipelineMap[item._id] = {
        count: Number(
          item.count || 0
        ),

        value: Number(
          item.value || 0
        ),
      };
    });

    // =====================================================
    // COMPLETE PIPELINE
    // =====================================================

    const pipeline = stages.map(
      (stage) => ({
        stage,

        count:
          pipelineMap[stage]
            ?.count || 0,

        value:
          pipelineMap[stage]
            ?.value || 0,
      })
    );

    // =====================================================
    // ACTUAL REVENUE
    // =====================================================

    const actualRevenueResult =
      await Deal.aggregate([
        {
          $match: {
            companyId,
            status: "Won",
            stage: "Closed Won",
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

    const actualRevenue =
      actualRevenueResult[0]?.total ||
      0;

    // =====================================================
    // PROJECTED REVENUE
    // =====================================================

    const projectedRevenueResult =
      await Deal.aggregate([
        {
          $match: {
            companyId,
            status: "Open",

            stage: {
              $nin: [
                "Closed Won",
                "Closed Lost",
              ],
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

    const projectedRevenue =
      projectedRevenueResult[0]?.total ||
      0;

    // =====================================================
    // TOTAL PIPELINE VALUE
    // =====================================================

    const totalPipelineValue =
      pipeline.reduce(
        (total, item) => {
          return (
            total +
            Number(item.value || 0)
          );
        },
        0
      );

    // =====================================================
    // DEAL COUNTS
    // =====================================================

    const openDeals =
      await Deal.countDocuments({
        companyId,
        status: "Open",
      });

    const wonDeals =
      await Deal.countDocuments({
        companyId,
        status: "Won",
      });

    const lostDeals =
      await Deal.countDocuments({
        companyId,
        status: "Lost",
      });

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      message:
        "Pipeline statistics fetched successfully.",

      data: {
        monthlyPipeline,

        pipeline,

        summary: {
          actualRevenue:
            Number(actualRevenue),

          projectedRevenue:
            Number(projectedRevenue),

          totalPipelineValue:
            Number(
              totalPipelineValue
            ),

          openDeals,

          wonDeals,

          lostDeals,
        },
      },
    });
  } catch (error) {
    console.error(
      "Pipeline Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Something went wrong while fetching pipeline statistics.",
    });
  }
};

// =====================================================
// ADMIN ACTIVITY FEED
// GET /api/admin/dashboard/activity
// ADMIN ONLY
// =====================================================

const getActivityFeed = async (req, res) => {
  try {
    // =====================================================
    // ADMIN CHECK
    // =====================================================

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,

        message:
          "Only administrators can access the activity feed.",
      });
    }

    // =====================================================
    // COMPANY CHECK
    // =====================================================

    const companyId = getCompanyId(req);

    if (!companyId) {
      return res.status(400).json({
        success: false,

        message:
          "Company information is missing.",
      });
    }

    // =====================================================
    // LIMIT
    // =====================================================

    const requestedLimit =
      Number(req.query.limit) || 10;

    const limit = Math.min(
      Math.max(requestedLimit, 1),
      50
    );

    // =====================================================
    // FETCH ACTIVITIES
    // =====================================================

    const activities =
      await CustomerActivity.find({
        companyId,
      })
        .populate(
          "userId",
          "firstName lastName email"
        )
        .populate(
          "customerId",
          "firstName lastName companyName"
        )
        .sort({
          createdAt: -1,
        })
        .limit(limit)
        .lean();

    // =====================================================
    // RELATIVE TIME
    // =====================================================

    const getRelativeTime = (date) => {
      if (!date) {
        return "Just now";
      }

      const now = new Date();
      const activityDate =
        new Date(date);

      const difference =
        now.getTime() -
        activityDate.getTime();

      const seconds = Math.floor(
        difference / 1000
      );

      if (seconds < 60) {
        return "Just now";
      }

      const minutes = Math.floor(
        seconds / 60
      );

      if (minutes < 60) {
        return `${minutes} ${
          minutes === 1
            ? "min"
            : "mins"
        } ago`;
      }

      const hours = Math.floor(
        minutes / 60
      );

      if (hours < 24) {
        return `${hours} ${
          hours === 1
            ? "hour"
            : "hours"
        } ago`;
      }

      const days = Math.floor(
        hours / 24
      );

      if (days < 30) {
        return `${days} ${
          days === 1
            ? "day"
            : "days"
        } ago`;
      }

      const months = Math.floor(
        days / 30
      );

      return `${months} ${
        months === 1
          ? "month"
          : "months"
      } ago`;
    };

    // =====================================================
    // FORMAT ACTIVITIES
    // =====================================================

    const formattedActivities =
      activities.map((activity) => {
        const user =
          activity.userId;

        const customer =
          activity.customerId;

        const userName = user
          ? `${user.firstName || ""} ${
              user.lastName || ""
            }`.trim()
          : null;

        const customerName = customer
          ? `${customer.firstName || ""} ${
              customer.lastName || ""
            }`.trim()
          : null;

        // =================================================
        // USER ACTIVITY
        // =================================================

        if (userName) {
          let text =
            activity.description ||
            activity.title ||
            "performed an activity";

          if (
            customerName &&
            !text
              .toLowerCase()
              .includes(
                customerName.toLowerCase()
              )
          ) {
            text = `${text} with ${customerName}`;
          }

          return {
            id: activity._id,

            type: "user",

            name: userName,

            text,

            time: getRelativeTime(
              activity.createdAt
            ),

            avatar: null,

            activityType:
              activity.type,

            customer: customer
              ? {
                  id: customer._id,

                  name: customerName,

                  companyName:
                    customer.companyName ||
                    null,
                }
              : null,

            createdAt:
              activity.createdAt,
          };
        }

        // =================================================
        // SYSTEM ACTIVITY
        // =================================================

        return {
          id: activity._id,

          type: "system",

          name: null,

          text:
            activity.description ||
            activity.title ||
            "System activity",

          time: getRelativeTime(
            activity.createdAt
          ),

          avatar: null,

          activityType:
            activity.type,

          customer: customer
            ? {
                id: customer._id,

                name: customerName,

                companyName:
                  customer.companyName ||
                  null,
              }
            : null,

          createdAt:
            activity.createdAt,
        };
      });

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      message:
        "Activity feed fetched successfully.",

      data: {
        activities:
          formattedActivities,
      },
    });
  } catch (error) {
    console.error(
      "Activity Feed Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Something went wrong while fetching the activity feed.",
    });
  }
};

// =====================================================
// ADMIN TEAM PERFORMANCE
// GET /api/admin/dashboard/team-performance
// ADMIN ONLY
// =====================================================

const getTeamPerformance = async (req, res) => {
  try {
    // =====================================================
    // ADMIN CHECK
    // =====================================================

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Only administrators can access team performance.",
      });
    }

    // =====================================================
    // COMPANY CHECK
    // =====================================================

    const companyId = getCompanyId(req);

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing.",
      });
    }

    // =====================================================
    // CURRENT MONTH
    // =====================================================

    const now = new Date();

    const currentMonthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const nextMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    // =====================================================
    // GET ACTIVE TEAM MEMBERS
    // =====================================================

    const teamMembers = await User.find({
      companyId,
      isActive: true,
    })
      .select(
        "firstName lastName email role"
      )
      .sort({
        firstName: 1,
        lastName: 1,
      })
      .lean();

    // =====================================================
    // GET DEAL STATISTICS
    // =====================================================

    const dealStats =
      await Deal.aggregate([
        {
          $match: {
            companyId,

            createdAt: {
              $gte: currentMonthStart,
              $lt: nextMonthStart,
            },

            assignedTo: {
              $ne: null,
            },
          },
        },

        {
          $group: {
            _id: "$assignedTo",

            totalDeals: {
              $sum: 1,
            },

            wonDeals: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $eq: [
                          "$status",
                          "Won",
                        ],
                      },

                      {
                        $eq: [
                          "$stage",
                          "Closed Won",
                        ],
                      },
                    ],
                  },

                  1,

                  0,
                ],
              },
            },

            revenue: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $eq: [
                          "$status",
                          "Won",
                        ],
                      },

                      {
                        $eq: [
                          "$stage",
                          "Closed Won",
                        ],
                      },
                    ],
                  },

                  "$value",

                  0,
                ],
              },
            },
          },
        },
      ]);

    // =====================================================
    // CREATE STATISTICS MAP
    // =====================================================

    const statsMap = {};

    dealStats.forEach((item) => {
      statsMap[String(item._id)] = {
        totalDeals:
          Number(
            item.totalDeals || 0
          ),

        wonDeals:
          Number(
            item.wonDeals || 0
          ),

        revenue:
          Number(
            item.revenue || 0
          ),
      };
    });

    // =====================================================
    // FORMAT TEAM PERFORMANCE
    // =====================================================

    const team = teamMembers.map(
      (member) => {
        const stats =
          statsMap[
            String(member._id)
          ] || {
            totalDeals: 0,
            wonDeals: 0,
            revenue: 0,
          };

        const conversion =
          stats.totalDeals > 0
            ? (stats.wonDeals /
                stats.totalDeals) *
              100
            : 0;

        return {
          id: member._id,

          name:
            `${member.firstName || ""} ${
              member.lastName || ""
            }`.trim() ||
            member.email,

          deals:
            stats.totalDeals,

          wonDeals:
            stats.wonDeals,

          revenue:
            stats.revenue,

          conversion:
            Number(
              conversion.toFixed(1)
            ),

          progress:
            Number(
              Math.min(
                conversion,
                100
              ).toFixed(1)
            ),

          role:
            member.role,

          email:
            member.email,
        };
      }
    );

    // =====================================================
    // SORT
    // Highest revenue first
    // =====================================================

    team.sort(
      (a, b) =>
        b.revenue - a.revenue
    );

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      message:
        "Team performance fetched successfully.",

      data: {
        period: "This Month",

        team,
      },
    });
  } catch (error) {
    console.error(
      "Team Performance Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Something went wrong while fetching team performance.",
    });
  }
};

// =====================================================
// ADMIN INTELLIGENCE SUMMARY
// GET /api/admin/dashboard/intelligence
// ADMIN ONLY
// =====================================================

const getIntelligenceSummary = async (req, res) => {
  try {
    // =====================================================
    // ADMIN CHECK
    // =====================================================

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Only administrators can access intelligence summary.",
      });
    }

    // =====================================================
    // COMPANY CHECK
    // =====================================================

    const companyId = getCompanyId(req);

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing.",
      });
    }

    // =====================================================
    // CURRENT TIME
    // =====================================================

    const now = new Date();

    // =====================================================
    // FETCH OPEN DEALS
    // =====================================================

    const deals = await Deal.find({
      companyId,

      status: "Open",

      value: {
        $gt: 0,
      },
    })
      .populate(
        "customerId",
        "firstName lastName companyName"
      )
      .sort({
        value: -1,
        lastActivityAt: -1,
        createdAt: -1,
      })
      .limit(10)
      .lean();

    // =====================================================
    // GENERATE INSIGHTS
    // =====================================================

    const insights = [];

    for (const deal of deals) {
      if (insights.length >= 3) {
        break;
      }

      let score = 60;

      let type = "warning";

      // ===================================================
      // DEAL VALUE SIGNAL
      // ===================================================

      if (deal.value >= 100000) {
        score += 15;
      } else if (deal.value >= 50000) {
        score += 10;
      } else if (deal.value >= 25000) {
        score += 5;
      }

      // ===================================================
      // RECENT ACTIVITY SIGNAL
      // ===================================================

      if (deal.lastActivityAt) {
        const activityDate =
          new Date(
            deal.lastActivityAt
          );

        const daysSinceActivity =
          (now.getTime() -
            activityDate.getTime()) /
          (1000 * 60 * 60 * 24);

        if (daysSinceActivity <= 1) {
          score += 15;
        } else if (
          daysSinceActivity <= 3
        ) {
          score += 10;
        } else if (
          daysSinceActivity <= 7
        ) {
          score += 5;
        }
      }

      // ===================================================
      // DEAL STAGE SIGNAL
      // ===================================================

      if (
        deal.stage === "Proposal" ||
        deal.stage === "Negotiation"
      ) {
        score += 10;
      }

      // ===================================================
      // SCORE LIMIT
      // ===================================================

      score = Math.min(
        Math.max(score, 0),
        99
      );

      // ===================================================
      // INSIGHT TYPE
      // ===================================================

      if (score >= 75) {
        type = "success";
      }

      // ===================================================
      // CUSTOMER NAME
      // ===================================================

      let customerName = null;

      if (deal.customerId) {
        if (deal.customerId.companyName) {
          customerName =
            deal.customerId.companyName;
        } else {
          customerName =
            `${deal.customerId.firstName || ""} ${
              deal.customerId.lastName || ""
            }`.trim() || null;
        }
      }

      // ===================================================
      // TITLE
      // ===================================================

      const title =
        deal.title ||
        customerName ||
        "Sales Opportunity";

      // ===================================================
      // DESCRIPTION
      // ===================================================

      let description =
        "Open deal showing positive sales signals.";

      if (
        deal.stage === "Negotiation"
      ) {
        description =
          "Deal is in negotiation and showing strong conversion potential.";
      } else if (
        deal.stage === "Proposal"
      ) {
        description =
          "Proposal-stage opportunity with strong potential to move forward.";
      } else if (
        deal.lastActivityAt
      ) {
        description =
          "Recent customer activity indicates active engagement.";
      } else if (
        deal.value >= 50000
      ) {
        description =
          "High-value opportunity identified in the current pipeline.";
      }

      // ===================================================
      // PUSH INSIGHT
      // ===================================================

      insights.push({
        id: deal._id,

        score,

        title,

        description,

        type,

        dealValue:
          Number(deal.value) || 0,

        stage:
          deal.stage || null,
      });
    }

    // =====================================================
    // SUMMARY TEXT
    // =====================================================

    const summary =
      insights.length > 0
        ? `AI has analyzed your pipeline and identified ${insights.length} high probability conversions for this week.`
        : "No high probability conversions were identified for this week.";

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      message:
        "Intelligence summary fetched successfully.",

      data: {
        summary,

        count:
          insights.length,

        insights,

        period:
          "This Week",
      },
    });
  } catch (error) {
    console.error(
      "Intelligence Summary Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Something went wrong while fetching intelligence summary.",
    });
  }
};

// =====================================================
// ADMIN INSIGHT CARDS
// GET /api/admin/dashboard/insights
// ADMIN ONLY
// =====================================================

const getInsightCards = async (req, res) => {
  try {
    // =====================================================
    // ADMIN CHECK
    // =====================================================

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Only administrators can access dashboard insights.",
      });
    }

    // =====================================================
    // COMPANY CHECK
    // =====================================================

    const companyId = getCompanyId(req);

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing.",
      });
    }

    // =====================================================
    // 1. LEAD PRIORITIZATION
    // =====================================================

    const topLeads = await Lead.find({
      companyId,
      status: {
        $nin: ["Converted", "Lost"],
      },
    })
      .sort({
        createdAt: -1,
      })
      .limit(2)
      .lean();

    let leadInsight = {
      type: "info",
      title: "Lead Prioritization",
      description:
        "No high-priority leads have been identified yet.",
      action: "Review top leads",
    };

    if (topLeads.length > 0) {
      const leadNames = topLeads
        .map(
          (lead) =>
            `${lead.firstName || ""} ${
              lead.lastName || ""
            }`.trim()
        )
        .filter(Boolean);

      const namesText =
        leadNames.length === 1
          ? leadNames[0]
          : leadNames.join(" and ");

      leadInsight = {
        type: "info",
        title: "Lead Prioritization",
        description: `Focus on ${namesText} today. These leads are currently active in your pipeline and should receive follow-up attention.`,
        action: "Review top leads",
      };
    }

    // =====================================================
    // 2. DEAL RISK ALERT
    // =====================================================

    const riskDeals = await Deal.find({
      companyId,
      status: "Open",
      lastActivityAt: {
        $ne: null,
      },
    })
      .sort({
        lastActivityAt: 1,
      })
      .limit(10)
      .lean();

    let riskInsight = {
      type: "warning",
      title: "Deal Risk Alert",
      description:
        "No significant deal risks have been detected.",
      action: "View risk details",
    };

    const now = new Date();

    const riskyDeal = riskDeals.find(
      (deal) => {
        const lastActivity =
          new Date(
            deal.lastActivityAt
          );

        const daysSinceActivity =
          (now.getTime() -
            lastActivity.getTime()) /
          (1000 * 60 * 60 * 24);

        return daysSinceActivity >= 7;
      }
    );

    if (riskyDeal) {
      const lastActivity =
        new Date(
          riskyDeal.lastActivityAt
        );

      const daysSinceActivity =
        Math.floor(
          (now.getTime() -
            lastActivity.getTime()) /
            (1000 * 60 * 60 * 24)
        );

      riskInsight = {
        type: "warning",
        title: "Deal Risk Alert",
        description: `${riskyDeal.title} may be at risk. ${daysSinceActivity} days have passed since the last recorded activity.`,
        action: "View risk details",
      };
    }

    // =====================================================
    // 3. OPTIMAL FOLLOW-UP
    // =====================================================

    const recentActivities =
      await CustomerActivity.find({
        companyId,
        type: {
          $in: [
            "email",
            "call",
            "meeting",
            "message",
          ],
        },
      })
        .sort({
          createdAt: -1,
        })
        .limit(20)
        .lean();

    let followUpInsight = {
      type: "success",
      title: "Optimal Follow-up",
      description:
        "Recent customer activity is available. Follow up with engaged prospects while their activity is fresh.",
      action: "Schedule email",
    };

    if (
      recentActivities.length === 0
    ) {
      followUpInsight = {
        type: "success",
        title: "Optimal Follow-up",
        description:
          "No recent communication activity is available yet. Start follow-ups with your active leads and customers.",
        action: "Schedule email",
      };
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      message:
        "Dashboard insights fetched successfully.",

      data: {
        insights: [
          leadInsight,
          riskInsight,
          followUpInsight,
        ],
      },
    });
  } catch (error) {
    console.error(
      "Dashboard Insights Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Something went wrong while fetching dashboard insights.",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getDashboardStats,
  getPipelineStats,
  getActivityFeed,
  getTeamPerformance,
  getIntelligenceSummary,
  getInsightCards,
};