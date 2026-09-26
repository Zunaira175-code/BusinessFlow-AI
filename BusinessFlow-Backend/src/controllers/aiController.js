const Lead = require("../models/Lead");
const Deal = require("../models/Deal");
const Task = require("../models/Task");

const {
  generateDashboardInsight,
  generateLeadInsights,
  generateDealInsights,
  generateReportInsights,
} = require("../services/ai/aiService");

// =====================================================
// GET COMPANY ID
// =====================================================

const getCompanyId = (req) => {
  if (!req.user || !req.user.companyId) {
    return null;
  }

  return req.user.companyId._id || req.user.companyId;
};

// =====================================================
// DASHBOARD AI INSIGHTS
// =====================================================

const getDashboardAIInsights = async (req, res) => {
  try {
    const companyId = getCompanyId(req);

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: "Company information is missing.",
      });
    }

    const [
      leads,
      deals,
      tasks,
      totalLeads,
      totalDeals,
      totalTasks,
      openDeals,
      wonDeals,
      lostDeals,
      activeTasks,
      overdueTasks,
    ] = await Promise.all([
      Lead.find({ companyId })
        .sort({ updatedAt: -1 })
        .limit(50)
        .lean(),

      Deal.find({ companyId })
        .sort({ updatedAt: -1 })
        .limit(50)
        .lean(),

      Task.find({ companyId })
        .sort({ updatedAt: -1 })
        .limit(50)
        .lean(),

      Lead.countDocuments({ companyId }),

      Deal.countDocuments({ companyId }),

      Task.countDocuments({ companyId }),

      Deal.countDocuments({
        companyId,
        status: "Open",
      }),

      Deal.countDocuments({
        companyId,
        status: "Won",
      }),

      Deal.countDocuments({
        companyId,
        status: "Lost",
      }),

      Task.countDocuments({
        companyId,
        status: {
          $in: ["Pending", "In Progress"],
        },
      }),

      Task.countDocuments({
        companyId,
        status: {
          $nin: ["Completed", "Cancelled"],
        },
        dueAt: {
          $lt: new Date(),
        },
      }),
    ]);

    // ===================================================
    // PREPARE LEADS FOR AI
    // ===================================================

    const aiLeads = leads.map((lead) => ({
      id: lead._id.toString(),

      name: `${lead.firstName || ""} ${
        lead.lastName || ""
      }`.trim(),

      company: lead.company || null,

      jobTitle: lead.jobTitle || null,

      value: lead.value || 0,

      status: lead.status,

      source: lead.source,

      lastActivityAt:
        lead.lastActivityAt || null,

      convertedAt:
        lead.convertedAt || null,

      createdAt:
        lead.createdAt || null,

      updatedAt:
        lead.updatedAt || null,
    }));

    // ===================================================
    // PREPARE DEALS FOR AI
    // ===================================================

    const aiDeals = deals.map((deal) => ({
      id: deal._id.toString(),

      title: deal.title,

      description:
        deal.description || null,

      leadId: deal.leadId
        ? deal.leadId.toString()
        : null,

      customerId: deal.customerId
        ? deal.customerId.toString()
        : null,

      value: deal.value || 0,

      stage: deal.stage,

      status: deal.status,

      expectedCloseDate:
        deal.expectedCloseDate || null,

      closedAt:
        deal.closedAt || null,

      lastActivityAt:
        deal.lastActivityAt || null,

      createdAt:
        deal.createdAt || null,

      updatedAt:
        deal.updatedAt || null,
    }));

    // ===================================================
    // PREPARE TASKS FOR AI
    // ===================================================

    const aiTasks = tasks.map((task) => ({
      id: task._id.toString(),

      title: task.title,

      description:
        task.description || null,

      customerId: task.customerId
        ? task.customerId.toString()
        : null,

      leadId: task.leadId
        ? task.leadId.toString()
        : null,

      dealId: task.dealId
        ? task.dealId.toString()
        : null,

      status: task.status,

      priority: task.priority,

      dueAt: task.dueAt,

      completedAt:
        task.completedAt || null,

      createdAt:
        task.createdAt || null,

      updatedAt:
        task.updatedAt || null,
    }));

    // ===================================================
    // DASHBOARD DATA FOR AI
    // ===================================================

    const dashboardData = {
      summary: {
        totalLeads,
        totalDeals,
        totalTasks,

        openDeals,
        wonDeals,
        lostDeals,

        activeTasks,
        overdueTasks,
      },

      recentLeads: aiLeads,

      recentDeals: aiDeals,

      recentTasks: aiTasks,
    };

    // ===================================================
    // SEND DATA TO AI SERVICE
    // ===================================================

    const aiResult =
      await generateDashboardInsight({
        dashboardData,
      });

    // ===================================================
    // RESPONSE
    // ===================================================

    return res.status(200).json({
      success: true,

      data: aiResult,

      meta: {
        companyScoped: true,

        recordsAnalyzed: {
          leads: aiLeads.length,
          deals: aiDeals.length,
          tasks: aiTasks.length,
        },

        totals: {
          leads: totalLeads,
          deals: totalDeals,
          tasks: totalTasks,
        },
      },
    });
  } catch (error) {
    console.error(
      "Dashboard AI Controller Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to generate AI dashboard insights.",
    });
  }
};

// =====================================================
// LEADS AI INSIGHTS
// =====================================================

const getLeadAIInsights = async (req, res) => {
  try {
    const companyId = getCompanyId(req);

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: "Company information is missing.",
      });
    }

    const leads = await Lead.find({
      companyId,
    })
      .sort({
        updatedAt: -1,
      })
      .limit(100)
      .lean();

    // ===================================================
    // PREPARE LEADS FOR AI
    // ===================================================

    const aiLeads = leads.map((lead) => ({
      id: lead._id.toString(),

      name: `${lead.firstName || ""} ${
        lead.lastName || ""
      }`.trim(),

      company: lead.company || null,

      jobTitle: lead.jobTitle || null,

      value: lead.value || 0,

      status: lead.status || null,

      source: lead.source || null,

      assignedTo: lead.assignedTo
        ? lead.assignedTo.toString()
        : null,

      lastActivityAt:
        lead.lastActivityAt || null,

      convertedAt:
        lead.convertedAt || null,

      createdAt:
        lead.createdAt || null,

      updatedAt:
        lead.updatedAt || null,
    }));

    // ===================================================
    // LEAD SUMMARY
    // ===================================================

    const leadSummary = {
      totalLeads: aiLeads.length,

      newLeads: aiLeads.filter(
        (lead) => lead.status === "New"
      ).length,

      contactedLeads: aiLeads.filter(
        (lead) => lead.status === "Contacted"
      ).length,

      qualifiedLeads: aiLeads.filter(
        (lead) => lead.status === "Qualified"
      ).length,

      proposalLeads: aiLeads.filter(
        (lead) => lead.status === "Proposal Sent"
      ).length,

      convertedLeads: aiLeads.filter(
        (lead) => lead.status === "Converted"
      ).length,

      lostLeads: aiLeads.filter(
        (lead) => lead.status === "Lost"
      ).length,
    };

    // ===================================================
    // SEND DATA TO LEAD AI SERVICE
    // ===================================================

    const aiResult = await generateLeadInsights({
      leads: {
        summary: leadSummary,
        records: aiLeads,
      },
    });

    // ===================================================
    // RESPONSE
    // ===================================================

    return res.status(200).json({
      success: true,

      data: aiResult,

      meta: {
        companyScoped: true,

        recordsAnalyzed: aiLeads.length,

        totals: leadSummary,
      },
    });
  } catch (error) {
    console.error(
      "Lead AI Controller Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to generate AI lead insights.",
    });
  }
};

// =====================================================
// DEALS AI INSIGHTS
// =====================================================

const getDealAIInsights = async (req, res) => {
  try {
    // ===================================================
    // COMPANY
    // ===================================================

    const companyId = getCompanyId(req);

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: "Company information is missing.",
      });
    }

    // ===================================================
    // FETCH COMPANY DEALS
    // ===================================================

    const deals = await Deal.find({
      companyId,
    })
      .sort({
        updatedAt: -1,
      })
      .limit(100)
      .lean();

    // ===================================================
    // PREPARE DEALS FOR AI
    // ===================================================

    const aiDeals = deals.map((deal) => ({
      id: deal._id.toString(),

      title: deal.title || null,

      description:
        deal.description || null,

      leadId: deal.leadId
        ? deal.leadId.toString()
        : null,

      customerId: deal.customerId
        ? deal.customerId.toString()
        : null,

      value: deal.value || 0,

      stage: deal.stage || null,

      status: deal.status || null,

      probability:
        deal.probability ?? null,

      assignedTo: deal.assignedTo
        ? deal.assignedTo.toString()
        : null,

      expectedCloseDate:
        deal.expectedCloseDate || null,

      closedAt:
        deal.closedAt || null,

      lastActivityAt:
        deal.lastActivityAt || null,

      createdAt:
        deal.createdAt || null,

      updatedAt:
        deal.updatedAt || null,
    }));

    // ===================================================
    // DEAL SUMMARY
    // ===================================================

    const dealSummary = {
      totalDeals: aiDeals.length,

      openDeals: aiDeals.filter(
        (deal) => deal.status === "Open"
      ).length,

      wonDeals: aiDeals.filter(
        (deal) => deal.status === "Won"
      ).length,

      lostDeals: aiDeals.filter(
        (deal) => deal.status === "Lost"
      ).length,

      totalPipelineValue: aiDeals
        .filter((deal) => deal.status === "Open")
        .reduce(
          (total, deal) =>
            total + Number(deal.value || 0),
          0
        ),

      highValueDeals: aiDeals.filter(
        (deal) =>
          Number(deal.value || 0) > 0
      ).length,
    };

    // ===================================================
    // SEND DATA TO DEAL AI SERVICE
    // ===================================================

    const aiResult = await generateDealInsights({
      deals: {
        summary: dealSummary,
        records: aiDeals,
      },
    });

    // ===================================================
    // RESPONSE
    // ===================================================

    return res.status(200).json({
      success: true,

      data: aiResult,

      meta: {
        companyScoped: true,

        recordsAnalyzed: aiDeals.length,

        totals: dealSummary,
      },
    });
  } catch (error) {
    console.error(
      "Deal AI Controller Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to generate AI deal insights.",
    });
  }
};

// =====================================================
// REPORTS AI INSIGHTS
// =====================================================

const getReportAIInsights = async (req, res) => {
  try {
    // ===================================================
    // COMPANY
    // ===================================================

    const companyId = getCompanyId(req);

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: "Company information is missing.",
      });
    }

    // ===================================================
    // FETCH REPORT DATA
    // ===================================================

    const [
      leads,
      deals,
      tasks,
    ] = await Promise.all([
      Lead.find({
        companyId,
      })
        .sort({
          updatedAt: -1,
        })
        .limit(100)
        .lean(),

      Deal.find({
        companyId,
      })
        .sort({
          updatedAt: -1,
        })
        .limit(100)
        .lean(),

      Task.find({
        companyId,
      })
        .sort({
          updatedAt: -1,
        })
        .limit(100)
        .lean(),
    ]);

    // ===================================================
    // PREPARE LEADS
    // ===================================================

    const aiLeads = leads.map((lead) => ({
      id: lead._id.toString(),

      name: `${lead.firstName || ""} ${
        lead.lastName || ""
      }`.trim(),

      company: lead.company || null,

      jobTitle: lead.jobTitle || null,

      value: Number(lead.value || 0),

      status: lead.status || null,

      source: lead.source || null,

      assignedTo: lead.assignedTo
        ? lead.assignedTo.toString()
        : null,

      lastActivityAt:
        lead.lastActivityAt || null,

      convertedAt:
        lead.convertedAt || null,

      createdAt:
        lead.createdAt || null,

      updatedAt:
        lead.updatedAt || null,
    }));

    // ===================================================
    // PREPARE DEALS
    // ===================================================

    const aiDeals = deals.map((deal) => ({
      id: deal._id.toString(),

      title: deal.title || null,

      value: Number(deal.value || 0),

      stage: deal.stage || null,

      status: deal.status || null,

      assignedTo: deal.assignedTo
        ? deal.assignedTo.toString()
        : null,

      expectedCloseDate:
        deal.expectedCloseDate || null,

      closedAt:
        deal.closedAt || null,

      lastActivityAt:
        deal.lastActivityAt || null,

      createdAt:
        deal.createdAt || null,

      updatedAt:
        deal.updatedAt || null,
    }));

    // ===================================================
    // PREPARE TASKS
    // ===================================================

    const aiTasks = tasks.map((task) => ({
      id: task._id.toString(),

      title: task.title || null,

      leadId: task.leadId
        ? task.leadId.toString()
        : null,

      dealId: task.dealId
        ? task.dealId.toString()
        : null,

      assignedTo: task.assignedTo
        ? task.assignedTo.toString()
        : null,

      status: task.status || null,

      priority: task.priority || null,

      dueAt: task.dueAt || null,

      completedAt:
        task.completedAt || null,

      createdAt:
        task.createdAt || null,

      updatedAt:
        task.updatedAt || null,
    }));

    // ===================================================
    // CALCULATED REPORT METRICS
    // ===================================================
    //
    // These are calculated facts.
    // AI should interpret them, not invent them.
    //
    // ===================================================

    const totalLeads = aiLeads.length;

    const newLeads = aiLeads.filter(
      (lead) => lead.status === "New"
    ).length;

    const contactedLeads = aiLeads.filter(
      (lead) => lead.status === "Contacted"
    ).length;

    const qualifiedLeads = aiLeads.filter(
      (lead) => lead.status === "Qualified"
    ).length;

    const proposalLeads = aiLeads.filter(
      (lead) => lead.status === "Proposal Sent"
    ).length;

    const convertedLeads = aiLeads.filter(
      (lead) => lead.status === "Converted"
    ).length;

    const lostLeads = aiLeads.filter(
      (lead) => lead.status === "Lost"
    ).length;

    const totalDeals = aiDeals.length;

    const openDeals = aiDeals.filter(
      (deal) => deal.status === "Open"
    );

    const wonDeals = aiDeals.filter(
      (deal) => deal.status === "Won"
    );

    const lostDeals = aiDeals.filter(
      (deal) => deal.status === "Lost"
    );

    const openPipelineValue = openDeals.reduce(
      (total, deal) =>
        total + Number(deal.value || 0),
      0
    );

    const wonDealValue = wonDeals.reduce(
      (total, deal) =>
        total + Number(deal.value || 0),
      0
    );

    const lostDealValue = lostDeals.reduce(
      (total, deal) =>
        total + Number(deal.value || 0),
      0
    );

    const totalTasks = aiTasks.length;

    const completedTasks = aiTasks.filter(
      (task) => task.status === "Completed"
    ).length;

    const pendingTasks = aiTasks.filter(
      (task) => task.status === "Pending"
    ).length;

    const inProgressTasks = aiTasks.filter(
      (task) => task.status === "In Progress"
    ).length;

    const cancelledTasks = aiTasks.filter(
      (task) => task.status === "Cancelled"
    ).length;

    const now = new Date();

    const overdueTasks = aiTasks.filter(
      (task) =>
        task.dueAt &&
        new Date(task.dueAt) < now &&
        !["Completed", "Cancelled"].includes(
          task.status
        )
    );

    const highPriorityOverdueTasks =
      overdueTasks.filter(
        (task) => task.priority === "HIGH"
      );

    // ===================================================
    // DEAL STAGE DISTRIBUTION
    // ===================================================

    const dealStageDistribution = {};

    aiDeals.forEach((deal) => {
      const stage = deal.stage || "Unknown";

      dealStageDistribution[stage] =
        (dealStageDistribution[stage] || 0) + 1;
    });

    // ===================================================
    // LEAD SOURCE DISTRIBUTION
    // ===================================================

    const leadSourceDistribution = {};

    aiLeads.forEach((lead) => {
      const source = lead.source || "Unknown";

      leadSourceDistribution[source] =
        (leadSourceDistribution[source] || 0) + 1;
    });

    // ===================================================
    // REPORT DATA
    // ===================================================

    const reportsData = {
      calculatedMetrics: {
        leads: {
          total: totalLeads,
          new: newLeads,
          contacted: contactedLeads,
          qualified: qualifiedLeads,
          proposalSent: proposalLeads,
          converted: convertedLeads,
          lost: lostLeads,
        },

        deals: {
          total: totalDeals,
          open: openDeals.length,
          won: wonDeals.length,
          lost: lostDeals.length,
          openPipelineValue,
          wonDealValue,
          lostDealValue,
        },

        tasks: {
          total: totalTasks,
          completed: completedTasks,
          pending: pendingTasks,
          inProgress: inProgressTasks,
          cancelled: cancelledTasks,
          overdue: overdueTasks.length,
          highPriorityOverdue:
            highPriorityOverdueTasks.length,
        },

        dealStageDistribution,

        leadSourceDistribution,
      },

      records: {
        leads: aiLeads,
        deals: aiDeals,
        tasks: aiTasks,
      },
    };

    // ===================================================
    // SEND TO AI
    // ===================================================

    const aiResult =
      await generateReportInsights({
        reportsData,
      });

    // ===================================================
    // RESPONSE
    // ===================================================

    return res.status(200).json({
      success: true,

      data: aiResult,

      meta: {
        companyScoped: true,

        recordsAnalyzed: {
          leads: aiLeads.length,
          deals: aiDeals.length,
          tasks: aiTasks.length,
        },

        calculatedMetrics:
          reportsData.calculatedMetrics,
      },
    });
  } catch (error) {
    console.error(
      "Report AI Controller Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to generate AI report insights.",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getDashboardAIInsights,
  getLeadAIInsights,
  getDealAIInsights,
  getReportAIInsights,
};