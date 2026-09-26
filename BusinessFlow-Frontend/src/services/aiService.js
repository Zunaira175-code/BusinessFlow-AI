import api from "./api";

/**
 * Get AI-powered dashboard insights
 */
export const getDashboardAIInsights = async () => {
  return api("/ai/dashboard-insights", {
    method: "POST",
  });
};

/**
 * Get AI-powered lead insights
 */
export const getLeadAIInsights = async () => {
  return api("/ai/leads-insights", {
    method: "POST",
  });
};

export const getDealAIInsights = async () => {
  return api("/ai/deals-insights", {
    method: "POST",
  });
};

/**
 * Get AI-powered report insights
 */
export const getReportAIInsights = async () => {
  return api("/ai/reports-insights", {
    method: "POST",
  });
};