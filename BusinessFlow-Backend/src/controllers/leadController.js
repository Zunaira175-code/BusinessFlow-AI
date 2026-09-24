const mongoose = require("mongoose");

const Lead = require("../models/Lead");
const User = require("../models/User");
const Task = require("../models/Task");

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
// VALID OBJECT ID
// =====================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// =====================================================
// ADMIN ACCESS
// =====================================================

const checkAdminAccess = (req, res) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
    });

    return false;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Only administrators can manage leads.",
    });

    return false;
  }

  return true;
};

// =====================================================
// COMPANY VALIDATION
// =====================================================

const getValidCompanyId = (req, res) => {
  const companyId = getCompanyId(req);

  if (!companyId) {
    res.status(400).json({
      success: false,
      message: "Company information is missing.",
    });

    return null;
  }

  if (!isValidObjectId(companyId)) {
    res.status(400).json({
      success: false,
      message: "Invalid company information.",
    });

    return null;
  }

  return companyId;
};

// =====================================================
// VALIDATE ASSIGNED EMPLOYEE
// =====================================================

const validateAssignedEmployee = async (
  assignedTo,
  companyId
) => {
  if (!assignedTo) {
    return null;
  }

  if (!isValidObjectId(assignedTo)) {
    throw new Error(
      "Invalid assigned employee."
    );
  }

  const employee = await User.findOne({
    _id: assignedTo,
    companyId,
    isActive: true,
  }).select("_id firstName lastName email role");

  if (!employee) {
    throw new Error(
      "Assigned employee does not belong to this company or is inactive."
    );
  }

  return employee;
};

// =====================================================
// NORMALIZE LEAD STATUS FOR UI
// =====================================================

const getDisplayStatus = (status) => {
  if (status === "Proposal Sent") {
    return "Proposal";
  }

  return status || "New";
};

// =====================================================
// BUILD LEAD NAME
// =====================================================

const getLeadName = (lead) => {
  return `${lead.firstName || ""} ${
    lead.lastName || ""
  }`.trim();
};

// =====================================================
// INITIALS
// =====================================================

const getInitials = (
  firstName,
  lastName
) => {
  const first =
    firstName?.trim()?.charAt(0) || "";

  const last =
    lastName?.trim()?.charAt(0) || "";

  const initials =
    `${first}${last}`.toUpperCase();

  return initials || "L";
};

// =====================================================
// =====================================================
// ADMIN LEAD STATS
// =====================================================
// GET /api/admin/leads/stats
// =====================================================

const getLeadStats = async (req, res) => {
  try {
    if (!checkAdminAccess(req, res)) {
      return;
    }

    const companyId =
      getValidCompanyId(req, res);

    if (!companyId) {
      return;
    }

    // =================================================
    // DATE RANGES
    // =================================================

    const now = new Date();

    const currentMonthStart =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

    const previousMonthStart =
      new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

    const currentMonthEnd =
      new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
      );

    // =================================================
    // TOTAL LEADS
    // =================================================

    const totalLeads =
      await Lead.countDocuments({
        companyId,
      });

    // =================================================
    // NEW LEADS CURRENT MONTH
    // =================================================

    const newLeadsCurrentMonth =
      await Lead.countDocuments({
        companyId,
        status: "New",
        createdAt: {
          $gte: currentMonthStart,
          $lt: currentMonthEnd,
        },
      });

    // =================================================
    // NEW LEADS PREVIOUS MONTH
    // =================================================

    const newLeadsPreviousMonth =
      await Lead.countDocuments({
        companyId,
        status: "New",
        createdAt: {
          $gte: previousMonthStart,
          $lt: currentMonthStart,
        },
      });

    // =================================================
    // QUALIFIED
    // =================================================

    const qualifiedLeads =
      await Lead.countDocuments({
        companyId,
        status: "Qualified",
      });

    // =================================================
    // CONVERTED
    // =================================================

    const convertedLeads =
      await Lead.countDocuments({
        companyId,
        status: "Converted",
      });

    // =================================================
    // CONVERSION RATE
    // =================================================

    const conversionRate =
      totalLeads > 0
        ? Number(
            (
              (convertedLeads /
                totalLeads) *
              100
            ).toFixed(1)
          )
        : 0;

    // =================================================
    // MONTHLY CHANGE
    // =================================================

    let newLeadsChange = 0;

    if (
      newLeadsPreviousMonth === 0
    ) {
      newLeadsChange =
        newLeadsCurrentMonth > 0
          ? 100
          : 0;
    } else {
      newLeadsChange =
        Number(
          (
            ((newLeadsCurrentMonth -
              newLeadsPreviousMonth) /
              newLeadsPreviousMonth) *
            100
          ).toFixed(1)
        );
    }

    return res.status(200).json({
      success: true,
      data: {
        totalLeads: {
          value: totalLeads,
          change: 0,
          trend: "up",
        },

        newLeads: {
          value:
            newLeadsCurrentMonth,
          change:
            newLeadsChange,
          trend:
            newLeadsChange >= 0
              ? "up"
              : "down",
        },

        qualifiedLeads: {
          value:
            qualifiedLeads,
          change: 0,
          trend: "up",
        },

        conversionRate: {
          value:
            conversionRate,
          change: 0,
          trend: "up",
        },
      },
    });
  } catch (error) {
    console.error(
      "Get Lead Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch lead statistics.",
    });
  }
};

// =====================================================
// =====================================================
// EMPLOYEE MY LEAD STATS
// =====================================================
// GET /api/leads/me/stats
// =====================================================

const getMyLeadStats = async (
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

    const companyId =
      getValidCompanyId(req, res);

    if (!companyId) {
      return;
    }

    const userId =
      req.user._id;

    // =================================================
    // TODAY
    // =================================================

    const now = new Date();

    const startOfToday =
      new Date(now);

    startOfToday.setHours(
      0,
      0,
      0,
      0
    );

    const endOfToday =
      new Date(now);

    endOfToday.setHours(
      23,
      59,
      59,
      999
    );

    // =================================================
    // START OF WEEK - MONDAY
    // =================================================

    const startOfWeek =
      new Date(now);

    const day =
      startOfWeek.getDay();

    const daysFromMonday =
      day === 0 ? 6 : day - 1;

    startOfWeek.setDate(
      startOfWeek.getDate() -
        daysFromMonday
    );

    startOfWeek.setHours(
      0,
      0,
      0,
      0
    );

    // =================================================
    // MONTH
    // =================================================

    const startOfMonth =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

    const startOfPreviousMonth =
      new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

    const startOfNextMonth =
      new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
      );

    // =================================================
    // TOTAL ASSIGNED LEADS
    // =================================================

    const totalLeads =
      await Lead.countDocuments({
        companyId,
        assignedTo: userId,
      });

    // =================================================
    // NEW THIS WEEK
    // =================================================

    const newLeadsThisWeek =
      await Lead.countDocuments({
        companyId,
        assignedTo: userId,
        status: "New",
        createdAt: {
          $gte: startOfWeek,
        },
      });

    // =================================================
    // NEW THIS MONTH
    // =================================================

    const newLeadsThisMonth =
      await Lead.countDocuments({
        companyId,
        assignedTo: userId,
        status: "New",
        createdAt: {
          $gte: startOfMonth,
          $lt: startOfNextMonth,
        },
      });

    // =================================================
    // NEW PREVIOUS MONTH
    // =================================================

    const newLeadsPreviousMonth =
      await Lead.countDocuments({
        companyId,
        assignedTo: userId,
        status: "New",
        createdAt: {
          $gte:
            startOfPreviousMonth,
          $lt: startOfMonth,
        },
      });

    // =================================================
    // MONTHLY CHANGE
    // =================================================

    let monthlyChange = 0;

    if (
      newLeadsPreviousMonth ===
      0
    ) {
      monthlyChange =
        newLeadsThisMonth > 0
          ? 100
          : 0;
    } else {
      monthlyChange =
        Number(
          (
            ((newLeadsThisMonth -
              newLeadsPreviousMonth) /
              newLeadsPreviousMonth) *
            100
          ).toFixed(1)
        );
    }

    // =================================================
    // QUALIFIED LEADS
    // =================================================

    const qualifiedLeads =
      await Lead.countDocuments({
        companyId,
        assignedTo: userId,
        status: "Qualified",
      });

    const qualifiedPercentage =
      totalLeads > 0
        ? Number(
            (
              (qualifiedLeads /
                totalLeads) *
              100
            ).toFixed(1)
          )
        : 0;

    // =================================================
    // FOLLOW-UP TASKS
    // =================================================

    const followUpBaseQuery = {
      companyId,
      assignedTo: userId,
      leadId: {
        $ne: null,
      },
      status: {
        $in: [
          "Pending",
          "In Progress",
        ],
      },
    };

    const followUpsDue =
      await Task.countDocuments({
        ...followUpBaseQuery,
        dueAt: {
          $lte: now,
        },
      });

    const followUpsToday =
      await Task.countDocuments({
        ...followUpBaseQuery,
        dueAt: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      });

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "My lead statistics fetched successfully.",

      data: {
        myLeads: {
          value: totalLeads,
          newThisWeek:
            newLeadsThisWeek,
        },

        newLeads: {
          value:
            newLeadsThisWeek,
          monthlyChange,
          monthlyTrend:
            monthlyChange >= 0
              ? "up"
              : "down",
        },

        qualifiedLeads: {
          value:
            qualifiedLeads,
          percentage:
            qualifiedPercentage,
        },

        followUpsDue: {
          value:
            followUpsDue,
          today:
            followUpsToday,
        },
      },
    });
  } catch (error) {
    console.error(
      "Get My Lead Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch your lead statistics.",
    });
  }
};

// =====================================================
// =====================================================
// EMPLOYEE MY LEAD PIPELINE
// =====================================================
// GET /api/leads/me/pipeline
// =====================================================

const getMyLeadPipeline = async (
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

    const companyId =
      getValidCompanyId(req, res);

    if (!companyId) {
      return;
    }

    const userId =
      req.user._id;

    // =================================================
    // PIPELINE STATUS COUNTS
    // =================================================

    const pipelineData =
      await Lead.aggregate([
        {
          $match: {
            companyId:
              new mongoose.Types.ObjectId(
                companyId
              ),

            assignedTo:
              new mongoose.Types.ObjectId(
                userId
              ),
          },
        },

        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    const countMap = {};

    pipelineData.forEach(
      (item) => {
        countMap[item._id] =
          item.count;
      }
    );

    // =================================================
    // RESPONSE STAGES
    // =================================================

    const stages = [
      {
        name: "New",
        count:
          countMap["New"] || 0,
      },

      {
        name: "Contacted",
        count:
          countMap["Contacted"] ||
          0,
      },

      {
        name: "Qualified",
        count:
          countMap["Qualified"] ||
          0,
      },

      {
        name: "Proposal",
        count:
          countMap[
            "Proposal Sent"
          ] || 0,
      },

      {
        name: "Converted",
        count:
          countMap["Converted"] ||
          0,
      },
    ];

    return res.status(200).json({
      success: true,

      message:
        "My lead pipeline fetched successfully.",

      data: {
        stages,
      },
    });
  } catch (error) {
    console.error(
      "Get My Lead Pipeline Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch your lead pipeline.",
    });
  }
};

// =====================================================
// =====================================================
// EMPLOYEE MY LEADS
// =====================================================
// GET /api/leads/me
// =====================================================

const getMyLeads = async (
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

    const companyId =
      getValidCompanyId(req, res);

    if (!companyId) {
      return;
    }

    const userId =
      req.user._id;

    // =================================================
    // QUERY PARAMS
    // =================================================

    const {
      search = "",
      status = "",
      source = "",
      page = 1,
      limit = 5,
      sort = "recent",
    } = req.query;

    const pageNumber =
      Math.max(
        Number(page) || 1,
        1
      );

    const limitNumber =
      Math.min(
        Math.max(
          Number(limit) || 5,
          1
        ),
        100
      );

    const skip =
      (pageNumber - 1) *
      limitNumber;

    // =================================================
    // BASE QUERY
    // =================================================

    const query = {
      companyId,
      assignedTo: userId,
    };

    // =================================================
    // SEARCH
    // =================================================

    if (search.trim()) {
      const searchRegex =
        new RegExp(
          search.trim().replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          ),
          "i"
        );

      query.$or = [
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
        {
          company:
            searchRegex,
        },
        {
          source:
            searchRegex,
        },
      ];
    }

    // =================================================
    // STATUS
    // =================================================

    if (status) {
      if (
        status === "Proposal"
      ) {
        query.status =
          "Proposal Sent";
      } else {
        query.status =
          status;
      }
    }

    // =================================================
    // SOURCE
    // =================================================

    if (source) {
      query.source =
        source;
    }

    // =================================================
    // SORT
    // =================================================

    let sortQuery = {
      updatedAt: -1,
    };

    switch (sort) {
      case "name":
        sortQuery = {
          firstName: 1,
          lastName: 1,
        };
        break;

      case "value":
      case "value-high":
        sortQuery = {
          value: -1,
        };
        break;

      case "value-low":
        sortQuery = {
          value: 1,
        };
        break;

      case "last-contact":
        sortQuery = {
          lastActivityAt: -1,
        };
        break;

      case "oldest":
        sortQuery = {
          createdAt: 1,
        };
        break;

      case "recent":
      case "newest":
      default:
        sortQuery = {
          updatedAt: -1,
        };
        break;
    }

    // =================================================
    // TOTAL
    // =================================================

    const totalLeads =
      await Lead.countDocuments(
        query
      );

    // =================================================
    // FETCH LEADS
    // =================================================

    const leads =
      await Lead.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNumber)
        .lean();

    // =================================================
    // LEAD IDS
    // =================================================

    const leadIds =
      leads.map(
        (lead) => lead._id
      );

    // =================================================
    // FETCH NEXT FOLLOW-UPS
    // =================================================

    let followUpTasks = [];

    if (leadIds.length > 0) {
      followUpTasks =
        await Task.find({
          companyId,
          assignedTo: userId,
          leadId: {
            $in: leadIds,
          },
          status: {
            $in: [
              "Pending",
              "In Progress",
            ],
          },
        })
          .sort({
            dueAt: 1,
          })
          .lean();
    }

    // =================================================
    // CREATE NEXT FOLLOW-UP MAP
    // =================================================

    const nextFollowUpMap =
      new Map();

    followUpTasks.forEach(
      (task) => {
        const key =
          String(task.leadId);

        if (
          !nextFollowUpMap.has(
            key
          )
        ) {
          nextFollowUpMap.set(
            key,
            {
              id: task._id,
              dueAt:
                task.dueAt,
              priority:
                task.priority,
              status:
                task.status,
              title:
                task.title,
            }
          );
        }
      }
    );

    // =================================================
    // FORMAT LEADS FOR FRONTEND
    // =================================================

    const formattedLeads =
      leads.map(
        (lead) => {
          const name =
            getLeadName(
              lead
            );

          const nextFollowUp =
            nextFollowUpMap.get(
              String(lead._id)
            ) || null;

          return {
            id: lead._id,

            _id: lead._id,

            firstName:
              lead.firstName,

            lastName:
              lead.lastName,

            name,

            initials:
              getInitials(
                lead.firstName,
                lead.lastName
              ),

            email:
              lead.email,

            phone:
              lead.phone,

            company:
              lead.company ||
              "—",

            jobTitle:
              lead.jobTitle,

            status:
              lead.status,

            displayStatus:
              getDisplayStatus(
                lead.status
              ),

            source:
              lead.source,

            value:
              Number(
                lead.value
              ) || 0,

            lastActivityAt:
              lead.lastActivityAt ||
              lead.updatedAt ||
              lead.createdAt,

            createdAt:
              lead.createdAt,

            updatedAt:
              lead.updatedAt,

            nextFollowUp,
          };
        }
      );

    // =================================================
    // PAGINATION
    // =================================================

    const totalPages =
      Math.max(
        Math.ceil(
          totalLeads /
            limitNumber
        ),
        1
      );

    return res.status(200).json({
      success: true,

      message:
        "My leads fetched successfully.",

      data: {
        leads:
          formattedLeads,

        pagination: {
          currentPage:
            pageNumber,

          totalPages,

          totalLeads,

          limit:
            limitNumber,

          hasNextPage:
            pageNumber <
            totalPages,

          hasPreviousPage:
            pageNumber > 1,
        },
      },
    });
  } catch (error) {
    console.error(
      "Get My Leads Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch your leads.",
    });
  }
};

// =====================================================
// =====================================================
// EMPLOYEE LEAD ACTIVITY
// =====================================================
// GET /api/leads/me/activity
// =====================================================

const getMyLeadActivity = async (
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

    const companyId =
      getValidCompanyId(req, res);

    if (!companyId) {
      return;
    }

    const userId =
      req.user._id;

    const limit = Math.min(
      Math.max(
        Number(
          req.query.limit
        ) || 5,
        1
      ),
      50
    );

    // =================================================
    // GET RECENT ASSIGNED LEADS
    // =================================================

    const leads =
      await Lead.find({
        companyId,
        assignedTo: userId,
      })
        .sort({
          lastActivityAt: -1,
          updatedAt: -1,
        })
        .limit(limit)
        .lean();

    // =================================================
    // FORMAT ACTIVITY
    // =================================================

    const activities =
      leads.map(
        (lead) => {
          let type =
            "Lead Updated";

          let action =
            "updated";

          if (
            lead.lastActivityAt &&
            lead.createdAt &&
            new Date(
              lead.lastActivityAt
            ).getTime() ===
              new Date(
                lead.createdAt
              ).getTime()
          ) {
            type =
              "Lead Created";

            action =
              "created";
          }

          return {
            id: lead._id,

            leadId:
              lead._id,

            type,

            action,

            title:
              getLeadName(
                lead
              ),

            leadName:
              getLeadName(
                lead
              ),

            company:
              lead.company ||
              "—",

            status:
              lead.status,

            displayStatus:
              getDisplayStatus(
                lead.status
              ),

            source:
              lead.source,

            value:
              Number(
                lead.value
              ) || 0,

            timestamp:
              lead.lastActivityAt ||
              lead.updatedAt ||
              lead.createdAt,

            createdAt:
              lead.createdAt,

            updatedAt:
              lead.updatedAt,
          };
        }
      );

    return res.status(200).json({
      success: true,

      message:
        "My lead activity fetched successfully.",

      data: {
        activities,
      },
    });
  } catch (error) {
    console.error(
      "Get My Lead Activity Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch your lead activity.",
    });
  }
};

// =====================================================
// =====================================================
// ADMIN GET ALL LEADS
// =====================================================
// GET /api/admin/leads
// =====================================================

const getLeads = async (
  req,
  res
) => {
  try {
    if (!checkAdminAccess(req, res)) {
      return;
    }

    const companyId =
      getValidCompanyId(req, res);

    if (!companyId) {
      return;
    }

    const {
      search = "",
      status = "",
      source = "",
      assignedTo = "",
      page = 1,
      limit = 20,
      sort = "recent",
    } = req.query;

    const pageNumber =
      Math.max(
        Number(page) || 1,
        1
      );

    const limitNumber =
      Math.min(
        Math.max(
          Number(limit) || 20,
          1
        ),
        100
      );

    const skip =
      (pageNumber - 1) *
      limitNumber;

    // =================================================
    // QUERY
    // =================================================

    const query = {
      companyId,
    };

    // =================================================
    // SEARCH
    // =================================================

    if (search.trim()) {
      const regex =
        new RegExp(
          search.trim().replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          ),
          "i"
        );

      query.$or = [
        {
          firstName: regex,
        },
        {
          lastName: regex,
        },
        {
          email: regex,
        },
        {
          company: regex,
        },
        {
          source: regex,
        },
      ];
    }

    // =================================================
    // STATUS
    // =================================================

    if (status) {
      query.status =
        status === "Proposal"
          ? "Proposal Sent"
          : status;
    }

    // =================================================
    // SOURCE
    // =================================================

    if (source) {
      query.source =
        source;
    }

    // =================================================
    // ASSIGNED TO
    // =================================================

    if (assignedTo) {
      if (
        !isValidObjectId(
          assignedTo
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid assigned employee.",
        });
      }

      query.assignedTo =
        assignedTo;
    }

    // =================================================
    // SORT
    // =================================================

    let sortQuery = {
      updatedAt: -1,
    };

    switch (sort) {
      case "name":
        sortQuery = {
          firstName: 1,
          lastName: 1,
        };
        break;

      case "value":
      case "value-high":
        sortQuery = {
          value: -1,
        };
        break;

      case "value-low":
        sortQuery = {
          value: 1,
        };
        break;

      case "oldest":
        sortQuery = {
          createdAt: 1,
        };
        break;

      case "recent":
      case "newest":
      default:
        sortQuery = {
          updatedAt: -1,
        };
        break;
    }

    // =================================================
    // TOTAL
    // =================================================

    const totalLeads =
      await Lead.countDocuments(
        query
      );

    // =================================================
    // FETCH
    // =================================================

    const leads =
      await Lead.find(query)
        .populate(
          "assignedTo",
          "firstName lastName email role"
        )
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNumber)
        .lean();

    // =================================================
    // FORMAT
    // =================================================

    const formattedLeads =
      leads.map(
        (lead) => ({
          id: lead._id,

          _id: lead._id,

          firstName:
            lead.firstName,

          lastName:
            lead.lastName,

          name:
            getLeadName(
              lead
            ),

          initials:
            getInitials(
              lead.firstName,
              lead.lastName
            ),

          email:
            lead.email,

          phone:
            lead.phone,

          company:
            lead.company,

          jobTitle:
            lead.jobTitle,

          status:
            lead.status,

          displayStatus:
            getDisplayStatus(
              lead.status
            ),

          source:
            lead.source,

          value:
            Number(
              lead.value
            ) || 0,

          assignedTo:
            lead.assignedTo,

          lastActivityAt:
            lead.lastActivityAt ||
            lead.updatedAt ||
            lead.createdAt,

          createdAt:
            lead.createdAt,

          updatedAt:
            lead.updatedAt,
        })
      );

    const totalPages =
      Math.max(
        Math.ceil(
          totalLeads /
            limitNumber
        ),
        1
      );

    return res.status(200).json({
      success: true,

      message:
        "Leads fetched successfully.",

      data: {
        leads:
          formattedLeads,

        pagination: {
          currentPage:
            pageNumber,

          totalPages,

          totalLeads,

          limit:
            limitNumber,

          hasNextPage:
            pageNumber <
            totalPages,

          hasPreviousPage:
            pageNumber > 1,
        },
      },
    });
  } catch (error) {
    console.error(
      "Get Leads Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch leads.",
    });
  }
};

// =====================================================
// =====================================================
// GET SINGLE LEAD
// =====================================================
// GET /api/admin/leads/:id
// =====================================================

const getLeadById = async (
  req,
  res
) => {
  try {
    if (!checkAdminAccess(req, res)) {
      return;
    }

    const companyId =
      getValidCompanyId(req, res);

    if (!companyId) {
      return;
    }

    const { id } =
      req.params;

    if (
      !isValidObjectId(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid lead ID.",
      });
    }

    const lead =
      await Lead.findOne({
        _id: id,
        companyId,
      })
        .populate(
          "assignedTo",
          "firstName lastName email role"
        )
        .lean();

    if (!lead) {
      return res.status(404).json({
        success: false,
        message:
          "Lead not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Lead fetched successfully.",

      data: {
        lead: {
          ...lead,

          id: lead._id,

          name:
            getLeadName(
              lead
            ),

          initials:
            getInitials(
              lead.firstName,
              lead.lastName
            ),

          displayStatus:
            getDisplayStatus(
              lead.status
            ),
        },
      },
    });
  } catch (error) {
    console.error(
      "Get Lead By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch lead.",
    });
  }
};

// =====================================================
// =====================================================
// CREATE LEAD
// =====================================================
// POST /api/admin/leads
// =====================================================

const createLead = async (
  req,
  res
) => {
  try {
    if (!checkAdminAccess(req, res)) {
      return;
    }

    const companyId =
      getValidCompanyId(req, res);

    if (!companyId) {
      return;
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      jobTitle,
      value,
      status,
      source,
      assignedTo,
      notes,
    } = req.body;

    // =================================================
    // REQUIRED FIELDS
    // =================================================

    if (
      !firstName ||
      !firstName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "First name is required.",
      });
    }

    if (
      !lastName ||
      !lastName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Last name is required.",
      });
    }

    if (
      !email ||
      !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email is required.",
      });
    }

    // =================================================
    // VALIDATE EMPLOYEE
    // =================================================

    try {
      await validateAssignedEmployee(
        assignedTo,
        companyId
      );
    } catch (employeeError) {
      return res.status(400).json({
        success: false,
        message:
          employeeError.message,
      });
    }

    // =================================================
    // CREATE
    // =================================================

    const lead =
      await Lead.create({
        companyId,

        firstName:
          firstName.trim(),

        lastName:
          lastName.trim(),

        email:
          email.trim().toLowerCase(),

        phone:
          phone?.trim() || null,

        company:
          company?.trim() || null,

        jobTitle:
          jobTitle?.trim() || null,

        value:
          Number(value) || 0,

        status:
          status || "New",

        source:
          source || "Other",

        assignedTo:
          assignedTo || null,

        notes:
          notes?.trim() || null,

        lastActivityAt:
          new Date(),
      });

    // =================================================
    // RESPONSE
    // =================================================

    const responseLead =
      lead.toObject();

    return res.status(201).json({
      success: true,

      message:
        "Lead created successfully.",

      data: {
        lead: {
          ...responseLead,

          id:
            responseLead._id,

          name:
            getLeadName(
              responseLead
            ),

          initials:
            getInitials(
              responseLead.firstName,
              responseLead.lastName
            ),

          displayStatus:
            getDisplayStatus(
              responseLead.status
            ),
        },
      },
    });
  } catch (error) {
    console.error(
      "Create Lead Error:",
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
        "Unable to create lead.",
    });
  }
};

// =====================================================
// =====================================================
// UPDATE LEAD
// =====================================================
// PUT /api/admin/leads/:id
// =====================================================

const updateLead = async (
  req,
  res
) => {
  try {
    if (!checkAdminAccess(req, res)) {
      return;
    }

    const companyId =
      getValidCompanyId(req, res);

    if (!companyId) {
      return;
    }

    const { id } =
      req.params;

    if (
      !isValidObjectId(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid lead ID.",
      });
    }

    const existingLead =
      await Lead.findOne({
        _id: id,
        companyId,
      });

    if (!existingLead) {
      return res.status(404).json({
        success: false,
        message:
          "Lead not found.",
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      jobTitle,
      value,
      status,
      source,
      assignedTo,
      notes,
    } = req.body;

    // =================================================
    // VALIDATE ASSIGNED EMPLOYEE
    // =================================================

    if (
      assignedTo !==
      undefined
    ) {
      try {
        await validateAssignedEmployee(
          assignedTo,
          companyId
        );
      } catch (employeeError) {
        return res.status(400).json({
          success: false,
          message:
            employeeError.message,
        });
      }
    }

    // =================================================
    // UPDATE FIELDS
    // =================================================

    if (
      firstName !==
      undefined
    ) {
      existingLead.firstName =
        firstName.trim();
    }

    if (
      lastName !==
      undefined
    ) {
      existingLead.lastName =
        lastName.trim();
    }

    if (
      email !==
      undefined
    ) {
      existingLead.email =
        email
          .trim()
          .toLowerCase();
    }

    if (
      phone !==
      undefined
    ) {
      existingLead.phone =
        phone?.trim() ||
        null;
    }

    if (
      company !==
      undefined
    ) {
      existingLead.company =
        company?.trim() ||
        null;
    }

    if (
      jobTitle !==
      undefined
    ) {
      existingLead.jobTitle =
        jobTitle?.trim() ||
        null;
    }

    if (
      value !==
      undefined
    ) {
      existingLead.value =
        Number(value) || 0;
    }

    if (
      status !==
      undefined
    ) {
      existingLead.status =
        status;
    }

    if (
      source !==
      undefined
    ) {
      existingLead.source =
        source;
    }

    if (
      assignedTo !==
      undefined
    ) {
      existingLead.assignedTo =
        assignedTo || null;
    }

    if (
      notes !==
      undefined
    ) {
      existingLead.notes =
        notes?.trim() ||
        null;
    }

    existingLead.lastActivityAt =
      new Date();

    // =================================================
    // CONVERSION
    // =================================================

    if (
      status ===
      "Converted" &&
      !existingLead.convertedAt
    ) {
      existingLead.convertedAt =
        new Date();
    }

    if (
      status &&
      status !==
        "Converted"
    ) {
      existingLead.convertedAt =
        null;
    }

    // =================================================
    // SAVE
    // =================================================

    await existingLead.save();

    const responseLead =
      existingLead.toObject();

    return res.status(200).json({
      success: true,

      message:
        "Lead updated successfully.",

      data: {
        lead: {
          ...responseLead,

          id:
            responseLead._id,

          name:
            getLeadName(
              responseLead
            ),

          initials:
            getInitials(
              responseLead.firstName,
              responseLead.lastName
            ),

          displayStatus:
            getDisplayStatus(
              responseLead.status
            ),
        },
      },
    });
  } catch (error) {
    console.error(
      "Update Lead Error:",
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
        "Unable to update lead.",
    });
  }
};

// =====================================================
// =====================================================
// DELETE LEAD
// =====================================================
// DELETE /api/admin/leads/:id
// =====================================================

const deleteLead = async (
  req,
  res
) => {
  try {
    if (!checkAdminAccess(req, res)) {
      return;
    }

    const companyId =
      getValidCompanyId(req, res);

    if (!companyId) {
      return;
    }

    const { id } =
      req.params;

    if (
      !isValidObjectId(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid lead ID.",
      });
    }

    const lead =
      await Lead.findOne({
        _id: id,
        companyId,
      });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message:
          "Lead not found.",
      });
    }

    await Lead.deleteOne({
      _id: id,
      companyId,
    });

    // =================================================
    // REMOVE RELATED TASKS
    // =================================================

    await Task.deleteMany({
      companyId,
      leadId: id,
    });

    return res.status(200).json({
      success: true,

      message:
        "Lead deleted successfully.",

      data: {
        leadId: id,
      },
    });
  } catch (error) {
    console.error(
      "Delete Lead Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete lead.",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  // Admin
  getLeadStats,
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,

  // Employee
  getMyLeads,
  getMyLeadStats,
  getMyLeadPipeline,
  getMyLeadActivity,
};