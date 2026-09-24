const mongoose = require("mongoose");

const Deal = require("../models/Deal");
const Lead = require("../models/Lead");
const User = require("../models/User");

// =====================================================
// GET AUTHENTICATED COMPANY ID
// =====================================================

const getCompanyId = (req) => {
  return (
    req.user?.companyId?._id ||
    req.user?.companyId ||
    null
  );
};

// =====================================================
// GET AUTHENTICATED USER ID
// =====================================================

const getUserId = (req) => {
  return req.user?._id || null;
};

// =====================================================
// CHECK AUTHENTICATION
// =====================================================

const checkAuthentication = (req, res) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
    });

    return false;
  }

  return true;
};

// =====================================================
// ADMIN ACCESS CHECK
// =====================================================

const checkAdminAccess = (req, res) => {
  if (!checkAuthentication(req, res)) {
    return false;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({
      success: false,
      message:
        "Only administrators can access team performance reports.",
    });

    return false;
  }

  return true;
};

// =====================================================
// VALID COMPANY OBJECT ID
// =====================================================

const getCompanyObjectId = (req, res) => {
  const companyId = getCompanyId(req);

  if (!companyId) {
    res.status(401).json({
      success: false,
      message:
        "Company information not found.",
    });

    return null;
  }

  if (
    !mongoose.Types.ObjectId.isValid(
      companyId
    )
  ) {
    res.status(400).json({
      success: false,
      message:
        "Invalid company information.",
    });

    return null;
  }

  return new mongoose.Types.ObjectId(
    companyId
  );
};

// =====================================================
// VALID USER OBJECT ID
// =====================================================

const getUserObjectId = (req, res) => {
  const userId = getUserId(req);

  if (!userId) {
    res.status(401).json({
      success: false,
      message:
        "User information not found.",
    });

    return null;
  }

  if (
    !mongoose.Types.ObjectId.isValid(
      userId
    )
  ) {
    res.status(400).json({
      success: false,
      message:
        "Invalid user information.",
    });

    return null;
  }

  return new mongoose.Types.ObjectId(
    userId
  );
};

// =====================================================
// DATE RANGE
// =====================================================

const getDateRange = (
  period = "30"
) => {
  const days = Number(period);

  const validDays = [
    7,
    30,
    90,
    180,
  ];

  const selectedDays =
    validDays.includes(days)
      ? days
      : 30;

  const endDate = new Date();

  const startDate = new Date();

  startDate.setDate(
    startDate.getDate() -
      selectedDays
  );

  startDate.setHours(
    0,
    0,
    0,
    0
  );

  endDate.setHours(
    23,
    59,
    59,
    999
  );

  return {
    startDate,
    endDate,
    days: selectedDays,
  };
};

// =====================================================
// PREVIOUS DATE RANGE
// =====================================================

const getPreviousDateRange = (
  startDate,
  endDate
) => {
  const duration =
    endDate.getTime() -
    startDate.getTime();

  const previousEndDate =
    new Date(
      startDate.getTime() - 1
    );

  const previousStartDate =
    new Date(
      previousEndDate.getTime() -
        duration
    );

  previousStartDate.setHours(
    0,
    0,
    0,
    0
  );

  previousEndDate.setHours(
    23,
    59,
    59,
    999
  );

  return {
    startDate:
      previousStartDate,
    endDate:
      previousEndDate,
  };
};

// =====================================================
// FORMAT CURRENCY
// =====================================================

const formatCurrency = (
  value
) => {
  return Number(value || 0);
};

// =====================================================
// PERCENTAGE CHANGE
// =====================================================

const calculatePercentageChange = (
  current,
  previous
) => {
  const currentValue =
    Number(current || 0);

  const previousValue =
    Number(previous || 0);

  if (previousValue === 0) {
    if (currentValue === 0) {
      return 0;
    }

    return 100;
  }

  return Number(
    (
      ((currentValue -
        previousValue) /
        previousValue) *
      100
    ).toFixed(1)
  );
};

// =====================================================
// PERCENTAGE DIFFERENCE
// =====================================================

const calculateRate = (
  numerator,
  denominator
) => {
  if (!denominator) {
    return 0;
  }

  return Number(
    (
      (numerator / denominator) *
      100
    ).toFixed(1)
  );
};

// =====================================================
// EMPLOYEE SCOPING
// =====================================================
//
// Admin:
// company-wide
//
// Employee:
// only records assigned to employee
// =====================================================

const getScopedMatch = (
  req,
  companyObjectId,
  assignedField = "assignedTo"
) => {
  const match = {
    companyId: companyObjectId,
  };

  if (req.user.role !== "admin") {
    const userId = getUserId(req);

    match[assignedField] =
      new mongoose.Types.ObjectId(
        userId
      );
  }

  return match;
};

// =====================================================
// REPORT SUMMARY
// =====================================================
//
// GET /api/reports/summary
//
// Admin:
// company-wide
//
// Employee:
// own deals + own leads
// =====================================================

const getReportSummary = async (
  req,
  res
) => {
  try {
    if (
      !checkAuthentication(
        req,
        res
      )
    ) {
      return;
    }

    const companyObjectId =
      getCompanyObjectId(
        req,
        res
      );

    if (!companyObjectId) {
      return;
    }

    const {
      startDate,
      endDate,
      days,
    } = getDateRange(
      req.query.period
    );

    const {
      startDate:
        previousStartDate,
      endDate:
        previousEndDate,
    } =
      getPreviousDateRange(
        startDate,
        endDate
      );

    const currentDealMatch =
      getScopedMatch(
        req,
        companyObjectId
      );

    const previousDealMatch =
      getScopedMatch(
        req,
        companyObjectId
      );

    const currentLeadMatch =
      getScopedMatch(
        req,
        companyObjectId
      );

    const previousLeadMatch =
      getScopedMatch(
        req,
        companyObjectId
      );

    // -------------------------------------------------
    // CURRENT PERIOD
    // -------------------------------------------------

    currentDealMatch.status =
      "Won";

    currentDealMatch.closedAt = {
      $gte: startDate,
      $lte: endDate,
    };

    currentLeadMatch.createdAt = {
      $gte: startDate,
      $lte: endDate,
    };

    const convertedLeadMatch = {
      ...getScopedMatch(
        req,
        companyObjectId
      ),

      status: "Converted",

      convertedAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    const [
      revenueResult,
      dealsWon,
      totalDeals,
      newLeads,
      convertedLeads,
    ] = await Promise.all([
      Deal.aggregate([
        {
          $match:
            currentDealMatch,
        },

        {
          $group: {
            _id: null,

            totalRevenue: {
              $sum: "$value",
            },
          },
        },
      ]),

      Deal.countDocuments(
        currentDealMatch
      ),

      Deal.countDocuments({
        ...getScopedMatch(
          req,
          companyObjectId
        ),

        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      }),

      Lead.countDocuments(
        currentLeadMatch
      ),

      Lead.countDocuments(
        convertedLeadMatch
      ),
    ]);

    // -------------------------------------------------
    // PREVIOUS PERIOD
    // -------------------------------------------------

    previousDealMatch.status =
      "Won";

    previousDealMatch.closedAt = {
      $gte: previousStartDate,
      $lte: previousEndDate,
    };

    previousLeadMatch.createdAt = {
      $gte: previousStartDate,
      $lte: previousEndDate,
    };

    const previousConvertedLeadMatch =
      {
        ...getScopedMatch(
          req,
          companyObjectId
        ),

        status: "Converted",

        convertedAt: {
          $gte: previousStartDate,
          $lte: previousEndDate,
        },
      };

    const [
      previousRevenueResult,
      previousDealsWon,
      previousTotalDeals,
      previousNewLeads,
      previousConvertedLeads,
    ] = await Promise.all([
      Deal.aggregate([
        {
          $match:
            previousDealMatch,
        },

        {
          $group: {
            _id: null,

            totalRevenue: {
              $sum: "$value",
            },
          },
        },
      ]),

      Deal.countDocuments(
        previousDealMatch
      ),

      Deal.countDocuments({
        ...getScopedMatch(
          req,
          companyObjectId
        ),

        createdAt: {
          $gte: previousStartDate,
          $lte: previousEndDate,
        },
      }),

      Lead.countDocuments(
        previousLeadMatch
      ),

      Lead.countDocuments(
        previousConvertedLeadMatch
      ),
    ]);

    // -------------------------------------------------
    // VALUES
    // -------------------------------------------------

    const totalRevenue =
      revenueResult[0]
        ?.totalRevenue || 0;

    const previousRevenue =
      previousRevenueResult[0]
        ?.totalRevenue || 0;

    const conversionRate =
      calculateRate(
        convertedLeads,
        newLeads
      );

    const previousConversionRate =
      calculateRate(
        previousConvertedLeads,
        previousNewLeads
      );

    const winRate =
      calculateRate(
        dealsWon,
        totalDeals
      );

    const previousWinRate =
      calculateRate(
        previousDealsWon,
        previousTotalDeals
      );

    const averageDealSize =
      dealsWon > 0
        ? totalRevenue /
          dealsWon
        : 0;

    const previousAverageDealSize =
      previousDealsWon > 0
        ? previousRevenue /
          previousDealsWon
        : 0;

    // -------------------------------------------------
    // CHANGES
    // -------------------------------------------------

    const revenueChange =
      calculatePercentageChange(
        totalRevenue,
        previousRevenue
      );

    const dealsWonChange =
      calculatePercentageChange(
        dealsWon,
        previousDealsWon
      );

    const conversionChange =
      Number(
        (
          conversionRate -
          previousConversionRate
        ).toFixed(1)
      );

    const winRateChange =
      Number(
        (
          winRate -
          previousWinRate
        ).toFixed(1)
      );

    const averageDealSizeChange =
      calculatePercentageChange(
        averageDealSize,
        previousAverageDealSize
      );

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      data: {
        totalRevenue:
          formatCurrency(
            totalRevenue
          ),

        dealsWon,

        totalDeals,

        newLeads,

        convertedLeads,

        conversionRate,

        winRate,

        averageDealSize:
          formatCurrency(
            averageDealSize
          ),

        // Quota is not available
        // in the current User model.

        quotaAttainment: null,

        quotaTarget: null,

        changes: {
          totalRevenue:
            revenueChange,

          dealsWon:
            dealsWonChange,

          conversionRate:
            conversionChange,

          winRate:
            winRateChange,

          averageDealSize:
            averageDealSizeChange,
        },

        period: {
          days,
          startDate,
          endDate,
        },

        scope:
          req.user.role ===
          "admin"
            ? "company"
            : "employee",
      },
    });
  } catch (error) {
    console.error(
      "Report Summary Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load report summary.",
    });
  }
};

// =====================================================
// SALES PERFORMANCE
// =====================================================
//
// GET /api/reports/sales-performance
//
// Query:
// ?period=180
// ?groupBy=month
// ?groupBy=quarter
// =====================================================

const getSalesPerformance =
  async (req, res) => {
    try {
      if (
        !checkAuthentication(
          req,
          res
        )
      ) {
        return;
      }

      const companyObjectId =
        getCompanyObjectId(
          req,
          res
        );

      if (!companyObjectId) {
        return;
      }

      const {
        startDate,
        endDate,
        days,
      } = getDateRange(
        req.query.period ||
          "180"
      );

      const groupBy =
        req.query.groupBy ===
        "quarter"
          ? "quarter"
          : "month";

      // -------------------------------------------------
      // ACTUAL SALES
      // Won deals
      // -------------------------------------------------

      const actualMatch =
        getScopedMatch(
          req,
          companyObjectId
        );

      actualMatch.status =
        "Won";

      actualMatch.closedAt = {
        $gte: startDate,
        $lte: endDate,
      };

      const actualData =
        await Deal.aggregate([
          {
            $match:
              actualMatch,
          },

          {
            $group: {
              _id:
                groupBy ===
                "quarter"
                  ? {
                      year: {
                        $year:
                          "$closedAt",
                      },

                      quarter: {
                        $ceil: {
                          $divide: [
                            {
                              $month:
                                "$closedAt",
                            },
                            3,
                          ],
                        },
                      },
                    }
                  : {
                      year: {
                        $year:
                          "$closedAt",
                      },

                      month: {
                        $month:
                          "$closedAt",
                      },
                    },

              actual: {
                $sum: "$value",
              },

              deals: {
                $sum: 1,
              },
            },
          },
        ]);

      // -------------------------------------------------
      // PROJECTED SALES
      // Open deals
      // -------------------------------------------------

      const projectedMatch =
        getScopedMatch(
          req,
          companyObjectId
        );

      projectedMatch.status =
        "Open";

      projectedMatch.expectedCloseDate =
        {
          $gte: startDate,
          $lte: endDate,
        };

      const projectedData =
        await Deal.aggregate([
          {
            $match:
              projectedMatch,
          },

          {
            $group: {
              _id:
                groupBy ===
                "quarter"
                  ? {
                      year: {
                        $year:
                          "$expectedCloseDate",
                      },

                      quarter: {
                        $ceil: {
                          $divide: [
                            {
                              $month:
                                "$expectedCloseDate",
                            },
                            3,
                          ],
                        },
                      },
                    }
                  : {
                      year: {
                        $year:
                          "$expectedCloseDate",
                      },

                      month: {
                        $month:
                          "$expectedCloseDate",
                      },
                    },

              projected: {
                $sum: "$value",
              },
            },
          },
        ]);

      // -------------------------------------------------
      // GENERATE PERIODS
      // -------------------------------------------------

      const periods = [];

      if (
        groupBy ===
        "quarter"
      ) {
        const cursor =
          new Date(
            startDate
          );

        cursor.setMonth(
          Math.floor(
            cursor.getMonth() / 3
          ) * 3
        );

        cursor.setDate(1);
        cursor.setHours(
          0,
          0,
          0,
          0
        );

        while (
          cursor <= endDate
        ) {
          const periodStart =
            new Date(cursor);

          const quarter =
            Math.floor(
              periodStart.getMonth() /
                3
            ) + 1;

          const periodEnd =
            new Date(
              periodStart
            );

          periodEnd.setMonth(
            periodEnd.getMonth() +
              3
          );

          periodEnd.setMilliseconds(
            -1
          );

          periods.push({
            key: `${periodStart.getFullYear()}-Q${quarter}`,

            label: `Q${quarter}`,

            year:
              periodStart.getFullYear(),

            quarter,

            start:
              periodStart,

            end:
              periodEnd,
          });

          cursor.setMonth(
            cursor.getMonth() +
              3
          );
        }
      } else {
        const cursor =
          new Date(
            startDate
          );

        cursor.setDate(1);
        cursor.setHours(
          0,
          0,
          0,
          0
        );

        while (
          cursor <= endDate
        ) {
          const periodStart =
            new Date(cursor);

          const periodEnd =
            new Date(cursor);

          periodEnd.setMonth(
            periodEnd.getMonth() +
              1
          );

          periodEnd.setMilliseconds(
            -1
          );

          periods.push({
            key: `${periodStart.getFullYear()}-${String(
              periodStart.getMonth() +
                1
            ).padStart(2, "0")}`,

            label:
              periodStart.toLocaleString(
                "en-US",
                {
                  month: "short",
                }
              ),

            month:
              periodStart.getMonth() +
              1,

            year:
              periodStart.getFullYear(),

            start:
              periodStart,

            end:
              periodEnd,
          });

          cursor.setMonth(
            cursor.getMonth() +
              1
          );
        }
      }

      // -------------------------------------------------
      // MERGE
      // -------------------------------------------------

      const result =
        periods.map(
          (periodItem) => {
            const foundActual =
              actualData.find(
                (item) => {
                  if (
                    groupBy ===
                    "quarter"
                  ) {
                    return (
                      item._id
                        .year ===
                        periodItem.year &&
                      item._id
                        .quarter ===
                        periodItem.quarter
                    );
                  }

                  return (
                    item._id
                      .year ===
                      periodItem.year &&
                    item._id
                      .month ===
                      periodItem.month
                  );
                }
              );

            const foundProjected =
              projectedData.find(
                (item) => {
                  if (
                    groupBy ===
                    "quarter"
                  ) {
                    return (
                      item._id
                        .year ===
                        periodItem.year &&
                      item._id
                        .quarter ===
                        periodItem.quarter
                    );
                  }

                  return (
                    item._id
                      .year ===
                      periodItem.year &&
                    item._id
                      .month ===
                      periodItem.month
                  );
                }
              );

            return {
              period:
                periodItem.label,

              month:
                periodItem.label,

              year:
                periodItem.year,

              quarter:
                periodItem.quarter ||
                null,

              actual:
                Number(
                  foundActual
                    ?.actual || 0
                ),

              projected:
                Number(
                  foundProjected
                    ?.projected || 0
                ),

              deals:
                Number(
                  foundActual
                    ?.deals || 0
                ),
            };
          }
        );

      return res.status(200).json({
        success: true,

        data: result,

        groupBy,

        period: {
          days,
          startDate,
          endDate,
        },

        scope:
          req.user.role ===
          "admin"
            ? "company"
            : "employee",
      });
    } catch (error) {
      console.error(
        "Sales Performance Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load sales performance.",
      });
    }
  };

// =====================================================
// DEAL PIPELINE
// =====================================================
//
// Admin:
// company-wide
//
// Employee:
// own deals
// =====================================================

const getDealPipeline =
  async (req, res) => {
    try {
      if (
        !checkAuthentication(
          req,
          res
        )
      ) {
        return;
      }

      const companyObjectId =
        getCompanyObjectId(
          req,
          res
        );

      if (!companyObjectId) {
        return;
      }

      const match =
        getScopedMatch(
          req,
          companyObjectId
        );

      const data =
        await Deal.aggregate([
          {
            $match: match,
          },

          {
            $group: {
              _id: "$stage",

              deals: {
                $sum: 1,
              },

              value: {
                $sum: "$value",
              },

              openDeals: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$status",
                        "Open",
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },

              wonDeals: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$status",
                        "Won",
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },

              lostDeals: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$status",
                        "Lost",
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },

          {
            $project: {
              _id: 0,

              stage: "$_id",

              deals: 1,

              value: 1,

              openDeals: 1,

              wonDeals: 1,

              lostDeals: 1,
            },
          },
        ]);

      const stages = [
        "Prospecting",
        "Qualification",
        "Proposal",
        "Negotiation",
        "Closed Won",
        "Closed Lost",
      ];

      const result =
        stages.map(
          (stage) => {
            const found =
              data.find(
                (item) =>
                  item.stage ===
                  stage
              );

            return {
              stage,

              deals:
                Number(
                  found?.deals ||
                    0
                ),

              value:
                Number(
                  found?.value ||
                    0
                ),

              openDeals:
                Number(
                  found?.openDeals ||
                    0
                ),

              wonDeals:
                Number(
                  found?.wonDeals ||
                    0
                ),

              lostDeals:
                Number(
                  found?.lostDeals ||
                    0
                ),
            };
          }
        );

      return res.status(200).json({
        success: true,

        data: result,

        scope:
          req.user.role ===
          "admin"
            ? "company"
            : "employee",
      });
    } catch (error) {
      console.error(
        "Deal Pipeline Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load deal pipeline.",
      });
    }
  };

// =====================================================
// LEAD CONVERSION FUNNEL
// =====================================================
//
// Admin:
// company-wide
//
// Employee:
// assigned leads
// =====================================================

const getLeadConversionFunnel =
  async (req, res) => {
    try {
      if (
        !checkAuthentication(
          req,
          res
        )
      ) {
        return;
      }

      const companyObjectId =
        getCompanyObjectId(
          req,
          res
        );

      if (!companyObjectId) {
        return;
      }

      const {
        startDate,
        endDate,
        days,
      } = getDateRange(
        req.query.period
      );

      const match =
        getScopedMatch(
          req,
          companyObjectId
        );

      match.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };

      const data =
        await Lead.aggregate([
          {
            $match: match,
          },

          {
            $group: {
              _id: "$status",

              count: {
                $sum: 1,
              },

              value: {
                $sum: "$value",
              },
            },
          },
        ]);

      const stages = [
        "New",
        "Contacted",
        "Qualified",
        "Proposal Sent",
        "Converted",
        "Lost",
      ];

      const result =
        stages.map(
          (stage) => {
            const found =
              data.find(
                (item) =>
                  item._id ===
                  stage
              );

            return {
              stage,

              count:
                found?.count ||
                0,

              value:
                Number(
                  found?.value ||
                    0
                ),
            };
          }
        );

      return res.status(200).json({
        success: true,

        data: result,

        period: {
          days,
          startDate,
          endDate,
        },

        scope:
          req.user.role ===
          "admin"
            ? "company"
            : "employee",
      });
    } catch (error) {
      console.error(
        "Lead Funnel Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load lead conversion funnel.",
      });
    }
  };

// =====================================================
// TEAM PERFORMANCE
// ADMIN ONLY
// =====================================================

const getTeamPerformance =
  async (req, res) => {
    try {
      if (
        !checkAdminAccess(
          req,
          res
        )
      ) {
        return;
      }

      const companyObjectId =
        getCompanyObjectId(
          req,
          res
        );

      if (!companyObjectId) {
        return;
      }

      const {
        startDate,
        endDate,
        days,
      } = getDateRange(
        req.query.period
      );

      const employees =
        await User.find({
          companyId:
            companyObjectId,

          role: "employee",
        })
          .select(
            "firstName lastName email jobTitle department isActive workStatus"
          )
          .lean();

      const leadPerformance =
        await Lead.aggregate([
          {
            $match: {
              companyId:
                companyObjectId,

              createdAt: {
                $gte: startDate,
                $lte: endDate,
              },
            },
          },

          {
            $group: {
              _id: "$assignedTo",

              leads: {
                $sum: 1,
              },

              qualifiedLeads: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$status",
                        "Qualified",
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },

              convertedLeads: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$status",
                        "Converted",
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },

              leadValue: {
                $sum: "$value",
              },
            },
          },
        ]);

      const dealPerformance =
        await Deal.aggregate([
          {
            $match: {
              companyId:
                companyObjectId,

              createdAt: {
                $gte: startDate,
                $lte: endDate,
              },
            },
          },

          {
            $group: {
              _id: "$assignedTo",

              deals: {
                $sum: 1,
              },

              wonDeals: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$status",
                        "Won",
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
                      $eq: [
                        "$status",
                        "Won",
                      ],
                    },
                    "$value",
                    0,
                  ],
                },
              },

              pipelineValue: {
                $sum: "$value",
              },
            },
          },
        ]);

      const result =
        employees.map(
          (employee) => {
            const employeeId =
              employee._id.toString();

            const leadData =
              leadPerformance.find(
                (item) =>
                  item._id
                    ?.toString() ===
                  employeeId
              );

            const dealData =
              dealPerformance.find(
                (item) =>
                  item._id
                    ?.toString() ===
                  employeeId
              );

            const leads =
              leadData?.leads ||
              0;

            const qualifiedLeads =
              leadData?.qualifiedLeads ||
              0;

            const convertedLeads =
              leadData?.convertedLeads ||
              0;

            const deals =
              dealData?.deals ||
              0;

            const wonDeals =
              dealData?.wonDeals ||
              0;

            const revenue =
              dealData?.revenue ||
              0;

            const conversionRate =
              calculateRate(
                convertedLeads,
                leads
              );

            const winRate =
              calculateRate(
                wonDeals,
                deals
              );

            return {
              employeeId:
                employee._id,

              firstName:
                employee.firstName,

              lastName:
                employee.lastName,

              name:
                `${employee.firstName} ${employee.lastName}`.trim(),

              email:
                employee.email,

              jobTitle:
                employee.jobTitle ||
                null,

              department:
                employee.department ||
                null,

              isActive:
                employee.isActive,

              workStatus:
                employee.workStatus,

              leads,

              qualifiedLeads,

              convertedLeads,

              deals,

              wonDeals,

              revenue,

              pipelineValue:
                dealData?.pipelineValue ||
                0,

              conversionRate,

              winRate,
            };
          }
        );

      result.sort(
        (a, b) =>
          b.revenue -
          a.revenue
      );

      return res.status(200).json({
        success: true,

        data: result,

        period: {
          days,
          startDate,
          endDate,
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
          "Unable to load team performance.",
      });
    }
  };

// =====================================================
// RECENT PERFORMANCE
// =====================================================
//
// Admin:
// latest company deals
//
// Employee:
// latest assigned deals
// =====================================================

const getRecentPerformance =
  async (req, res) => {
    try {
      if (
        !checkAuthentication(
          req,
          res
        )
      ) {
        return;
      }

      const companyObjectId =
        getCompanyObjectId(
          req,
          res
        );

      if (!companyObjectId) {
        return;
      }

      const match =
        getScopedMatch(
          req,
          companyObjectId
        );

      const limit = Math.min(
        Math.max(
          Number(
            req.query.limit || 10
          ),
          1
        ),
        50
      );

      const deals =
        await Deal.find(match)
          .sort({
            createdAt: -1,
          })
          .limit(limit)
          .select(
            "title value stage status assignedTo createdAt closedAt expectedCloseDate"
          )
          .populate(
            "assignedTo",
            "firstName lastName email jobTitle"
          )
          .lean();

      const data =
        deals.map(
          (deal) => ({
            ...deal,

            formattedValue:
              `$${Number(
                deal.value || 0
              ).toLocaleString()}`,

            assignedTo:
              deal.assignedTo
                ? {
                    _id:
                      deal
                        .assignedTo
                        ._id,

                    name:
                      `${deal.assignedTo.firstName || ""} ${
                        deal.assignedTo.lastName || ""
                      }`.trim(),

                    email:
                      deal.assignedTo
                        .email,

                    jobTitle:
                      deal.assignedTo
                        .jobTitle ||
                      null,
                  }
                : null,
          })
        );

      return res.status(200).json({
        success: true,

        data,

        scope:
          req.user.role ===
          "admin"
            ? "company"
            : "employee",
      });
    } catch (error) {
      console.error(
        "Recent Performance Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load recent performance.",
      });
    }
  };

// =====================================================
// AI PERFORMANCE ANALYSIS
// =====================================================
//
// This is currently rule-based analytics.
// It is NOT an external AI model yet.
//
// Admin:
// company metrics
//
// Employee:
// own metrics
// =====================================================

const getAIPerformanceAnalysis =
  async (req, res) => {
    try {
      if (
        !checkAuthentication(
          req,
          res
        )
      ) {
        return;
      }

      const companyObjectId =
        getCompanyObjectId(
          req,
          res
        );

      if (!companyObjectId) {
        return;
      }

      const {
        startDate,
        endDate,
        days,
      } = getDateRange(
        req.query.period
      );

      const dealBaseMatch =
        getScopedMatch(
          req,
          companyObjectId
        );

      const leadBaseMatch =
        getScopedMatch(
          req,
          companyObjectId
        );

      const totalDeals =
        await Deal.countDocuments({
          ...dealBaseMatch,

          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        });

      const wonDeals =
        await Deal.countDocuments({
          ...dealBaseMatch,

          status: "Won",

          closedAt: {
            $gte: startDate,
            $lte: endDate,
          },
        });

      const lostDeals =
        await Deal.countDocuments({
          ...dealBaseMatch,

          status: "Lost",

          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        });

      const totalLeads =
        await Lead.countDocuments({
          ...leadBaseMatch,

          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        });

      const convertedLeads =
        await Lead.countDocuments({
          ...leadBaseMatch,

          status: "Converted",

          convertedAt: {
            $gte: startDate,
            $lte: endDate,
          },
        });

      const revenueResult =
        await Deal.aggregate([
          {
            $match: {
              ...dealBaseMatch,

              status: "Won",

              closedAt: {
                $gte: startDate,
                $lte: endDate,
              },
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
        ]);

      const revenue =
        revenueResult[0]
          ?.revenue || 0;

      const conversionRate =
        calculateRate(
          convertedLeads,
          totalLeads
        );

      const winRate =
        calculateRate(
          wonDeals,
          totalDeals
        );

      const averageDealSize =
        wonDeals > 0
          ? revenue /
            wonDeals
          : 0;

      // -------------------------------------------------
      // INSIGHTS
      // -------------------------------------------------

      const insights = [];

      // -------------------------------------------------
      // REVENUE
      // -------------------------------------------------

      if (revenue > 0) {
        insights.push({
          type: "trend",

          title:
            "Positive Revenue Activity",

          description:
            `${wonDeals} deal${
              wonDeals === 1
                ? ""
                : "s"
            } were won during the selected period, generating $${Number(
              revenue
            ).toLocaleString()}.`,
        });
      } else {
        insights.push({
          type: "risk",

          title:
            "No Won Revenue",

          description:
            "No deals were marked as won during the selected period. Review active opportunities and follow-up activity.",
        });
      }

      // -------------------------------------------------
      // LEAD CONVERSION
      // -------------------------------------------------

      if (
        totalLeads ===
        0
      ) {
        insights.push({
          type: "risk",

          title:
            "No Lead Activity",

          description:
            "There are no leads in the selected reporting period.",
        });
      } else if (
        conversionRate >=
        20
      ) {
        insights.push({
          type: "opportunity",

          title:
            "Strong Lead Conversion",

          description:
            `Lead conversion is currently ${conversionRate.toFixed(
              1
            )}%, indicating healthy lead qualification and follow-up.`,
        });
      } else {
        insights.push({
          type: "risk",

          title:
            "Lead Conversion Needs Attention",

          description:
            `Lead conversion is currently ${conversionRate.toFixed(
              1
            )}%. Improving qualification and follow-up consistency may increase conversions.`,
        });
      }

      // -------------------------------------------------
      // WIN RATE
      // -------------------------------------------------

      if (
        totalDeals ===
        0
      ) {
        insights.push({
          type: "risk",

          title:
            "No Deal Activity",

          description:
            "There are no deals in the selected reporting period.",
        });
      } else if (
        winRate >= 25
      ) {
        insights.push({
          type: "performance",

          title:
            "Healthy Deal Win Rate",

          description:
            `Current deal win rate is ${winRate.toFixed(
              1
            )}%, showing positive sales performance.`,
        });
      } else {
        insights.push({
          type: "risk",

          title:
            "Deal Win Rate Needs Attention",

          description:
            `Current deal win rate is ${winRate.toFixed(
              1
            )}%. Review stalled, lost, and inactive opportunities.`,
        });
      }

      // -------------------------------------------------
      // AVERAGE DEAL SIZE
      // -------------------------------------------------

      if (
        averageDealSize >
        0
      ) {
        insights.push({
          type: "performance",

          title:
            "Average Deal Size",

          description:
            `Your average won deal size is $${Number(
              averageDealSize
            ).toLocaleString()}.`,
        });
      }

      // -------------------------------------------------
      // RECOMMENDATION
      // -------------------------------------------------

      if (
        winRate < 25 &&
        totalDeals > 0
      ) {
        insights.push({
          type: "recommendation",

          title:
            "Recommended Action",

          description:
            "Prioritize high-value open opportunities and review deals that have remained in the pipeline without progression.",
        });
      } else if (
        conversionRate < 20 &&
        totalLeads > 0
      ) {
        insights.push({
          type: "recommendation",

          title:
            "Recommended Action",

          description:
            "Focus on qualified leads and improve follow-up speed to increase lead-to-customer conversion.",
        });
      } else {
        insights.push({
          type: "recommendation",

          title:
            "Recommended Action",

          description:
            "Continue focusing on high-value opportunities while maintaining consistent lead follow-up and deal progression.",
        });
      }

      return res.status(200).json({
        success: true,

        data: {
          metrics: {
            totalDeals,

            wonDeals,

            lostDeals,

            totalLeads,

            convertedLeads,

            revenue,

            averageDealSize,

            conversionRate,

            winRate,
          },

          insights,

          period: {
            days,
            startDate,
            endDate,
          },

          scope:
            req.user.role ===
            "admin"
              ? "company"
              : "employee",
        },
      });
    } catch (error) {
      console.error(
        "AI Analytics Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to generate analytics insights.",
      });
    }
  };

// =====================================================
// EXPORT REPORT DATA
// =====================================================
//
// Admin:
// company-wide
//
// Employee:
// assigned deals/leads
// =====================================================

const exportReport =
  async (req, res) => {
    try {
      if (
        !checkAuthentication(
          req,
          res
        )
      ) {
        return;
      }

      const companyObjectId =
        getCompanyObjectId(
          req,
          res
        );

      if (!companyObjectId) {
        return;
      }

      const {
        startDate,
        endDate,
        days,
      } = getDateRange(
        req.query.period
      );

      const dealMatch =
        getScopedMatch(
          req,
          companyObjectId
        );

      dealMatch.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };

      const leadMatch =
        getScopedMatch(
          req,
          companyObjectId
        );

      leadMatch.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };

      const dealQuery =
        Deal.find(dealMatch)
          .select(
            "title value stage status assignedTo createdAt closedAt expectedCloseDate"
          )
          .populate(
            "assignedTo",
            "firstName lastName email jobTitle"
          )
          .lean();

      const leadQuery =
        Lead.find(leadMatch)
          .select(
            "firstName lastName email company value status source assignedTo createdAt convertedAt"
          )
          .populate(
            "assignedTo",
            "firstName lastName email"
          )
          .lean();

      const promises = [
        dealQuery,
        leadQuery,
      ];

      // Admin gets employee
      // data too.

      if (
        req.user.role ===
        "admin"
      ) {
        promises.push(
          User.find({
            companyId:
              companyObjectId,

            role: "employee",
          })
            .select(
              "firstName lastName email department jobTitle isActive workStatus createdAt"
            )
            .lean()
        );
      }

      const results =
        await Promise.all(
          promises
        );

      const deals =
        results[0] || [];

      const leads =
        results[1] || [];

      const employees =
        results[2] || [];

      return res.status(200).json({
        success: true,

        data: {
          period: {
            days,
            startDate,
            endDate,
          },

          deals,

          leads,

          employees,

          scope:
            req.user.role ===
            "admin"
              ? "company"
              : "employee",
        },
      });
    } catch (error) {
      console.error(
        "Export Report Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to export report data.",
      });
    }
  };

// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
  getReportSummary,
  getSalesPerformance,
  getDealPipeline,
  getLeadConversionFunnel,
  getTeamPerformance,
  getRecentPerformance,
  getAIPerformanceAnalysis,
  exportReport,
};