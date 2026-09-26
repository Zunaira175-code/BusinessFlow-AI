const {
  generateAIResponse,
} = require("./geminiProvider");

// =====================================================
// DASHBOARD AI INSIGHTS
// =====================================================

const generateDashboardInsight = async ({
  dashboardData,
}) => {
  const systemInstruction = `
You are the AI business intelligence assistant for BusinessFlow AI CRM.

Your job is to analyze CRM data and provide concise, useful business insights.

Rules:
1. Only use the data provided in the prompt.
2. Do not invent customers, leads, deals, tasks, numbers, or events.
3. Clearly distinguish observations from recommendations.
4. Never modify CRM records.
5. Never recommend deleting, reassigning, closing, or materially changing CRM records automatically.
6. Keep the language professional and easy to understand.
7. Focus on priorities, opportunities, risks, follow-ups, and business activity.
8. Do not create an insight simply by repeating a dashboard metric.
9. Only create an insight when there is meaningful business context or an actionable condition.
10. Return valid JSON only.

Return this structure:

{
  "summary": "short overall summary",
  "insights": [
    {
      "type": "priority",
      "title": "short title",
      "summary": "what the data shows",
      "priority": "high",
      "recommendedAction": "optional recommended action",
      "sourceRecords": []
    }
  ]
}

Allowed insight types:
- priority
- opportunity
- risk
- follow_up
- summary

Allowed priority values:
- high
- medium
- low
`;

  const prompt = `
Analyze the following BusinessFlow AI CRM dashboard data.

CRM DATA:

${JSON.stringify(dashboardData, null, 2)}

Identify the most useful business insights for the authenticated company.

Prioritize:
- overdue tasks
- leads requiring attention
- meaningful sales opportunities
- deal risks
- inactive records
- follow-up opportunities
- unusual or important business conditions

Do not simply restate:
- total leads
- total deals
- total tasks
- open deal counts

unless the numbers reveal a meaningful business condition.

Do not use information that is not present in the CRM data.

Return JSON only.
`;

  const response = await generateAIResponse({
    systemInstruction,
    prompt,
  });

  try {
    const cleanedResponse = response
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleanedResponse);

    return {
      summary: parsed.summary || "",
      insights: Array.isArray(parsed.insights)
        ? parsed.insights
        : [],
    };
  } catch (error) {
    console.error("AI JSON Parse Error:", error);
    console.error("Raw AI Response:", response);

    return {
      summary:
        "AI generated a response that could not be parsed into structured insights.",
      insights: [],
    };
  }
};

// =====================================================
// LEADS AI INSIGHTS
// =====================================================

const generateLeadInsights = async ({
  leads,
}) => {
  const systemInstruction = `
You are the AI lead intelligence assistant for BusinessFlow AI CRM.

Your job is to analyze CRM lead data and provide concise, useful,
actionable lead intelligence for the authenticated company.

Rules:

1. Only use the lead data provided in the prompt.
2. Do not invent leads, values, statuses, activities, dates, or events.
3. Never modify CRM records.
4. Never automatically change lead status, owner, value, source, or any other field.
5. Recommendations must be assistive only.
6. Do not expose email addresses, phone numbers, passwords, tokens, or secrets.
7. Do not assume information that is not present.
8. Do not create generic insights simply because a lead exists.
9. Focus on meaningful sales intelligence.
10. Keep the language professional and easy to understand.
11. Every source record must reference an actual lead ID provided in the CRM data.
12. Return valid JSON only.

Focus on:

- High-priority leads
- Leads requiring follow-up
- New leads awaiting engagement
- Qualified leads needing attention
- Potential conversion signals
- Leads with meaningful business value
- Leads with missing information that affects qualification
- Leads that may be at risk of being neglected

Allowed insight types:

- priority
- opportunity
- risk
- follow_up
- summary

Allowed priority values:

- high
- medium
- low

Return exactly this structure:

{
  "summary": "short overall lead intelligence summary",
  "insights": [
    {
      "type": "priority",
      "title": "short insight title",
      "summary": "what the CRM data shows",
      "priority": "high",
      "recommendedAction": "recommended action for the sales team",
      "sourceRecords": [
        "LEAD_RECORD_ID"
      ]
    }
  ]
}

If there are no meaningful insights, return:

{
  "summary": "No significant lead intelligence was identified.",
  "insights": []
}
`;

  const prompt = `
Analyze the following BusinessFlow AI CRM lead data.

LEAD DATA:

${JSON.stringify(leads, null, 2)}

Identify only meaningful and actionable lead intelligence.

Pay particular attention to:

- New leads without meaningful engagement
- Leads that have not had recent activity
- Qualified leads that may require follow-up
- Leads with higher potential value
- Leads showing conversion signals
- Leads with missing information affecting qualification
- Leads that may be at risk of being neglected

Do not create an insight simply because a lead exists.

Do not simply restate the total number of leads.

Use only the CRM data provided.

Return JSON only.
`;

  const response = await generateAIResponse({
    systemInstruction,
    prompt,
  });

  try {
    const cleanedResponse = response
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleanedResponse);

    return {
      summary: parsed.summary || "",
      insights: Array.isArray(parsed.insights)
        ? parsed.insights
        : [],
    };
  } catch (error) {
    console.error("Lead AI JSON Parse Error:", error);
    console.error("Raw Lead AI Response:", response);

    return {
      summary:
        "AI generated a response that could not be parsed into structured lead insights.",
      insights: [],
    };
  }
};

// =====================================================
// DEALS AI INSIGHTS
// =====================================================

const generateDealInsights = async ({
  deals,
}) => {
  const systemInstruction = `
You are the AI deal intelligence assistant for BusinessFlow AI CRM.

Your job is to analyze CRM deal data and provide concise,
useful and actionable sales intelligence for the authenticated company.

Rules:

1. Only use the deal data provided in the prompt.
2. Do not invent deals, customers, values, stages, probabilities,
   activities, dates, owners, or events.
3. Never modify CRM records.
4. Never automatically change deal stage, value, probability,
   owner, status, close date, or any other CRM field.
5. Recommendations must be assistive only.
6. Do not expose email addresses, phone numbers, passwords,
   tokens, secrets, or unnecessary personal information.
7. Do not assume information that is not present.
8. Do not create generic insights simply because a deal exists.
9. Focus on meaningful sales and pipeline intelligence.
10. Keep the language professional and easy to understand.
11. Every source record must reference an actual deal ID provided
    in the CRM data.
12. Clearly distinguish CRM observations from recommended actions.
13. Return valid JSON only.

Focus on:

- High-value opportunities
- Deals at risk
- Stalled or inactive deals
- Deals requiring follow-up
- Deals approaching important stages
- Deals with meaningful probability/value combinations
- Pipeline concentration or unusual conditions
- Deals that may need sales attention
- Potential next actions based only on available CRM data

Important:

AI must NOT silently:
- change deal stage
- change deal value
- change probability
- reassign ownership
- close a deal
- delete a deal
- mark a deal as won or lost

Allowed insight types:

- priority
- opportunity
- risk
- follow_up
- summary

Allowed priority values:

- high
- medium
- low

Return exactly this structure:

{
  "summary": "short overall deal intelligence summary",
  "insights": [
    {
      "type": "opportunity",
      "title": "short insight title",
      "summary": "what the CRM data shows",
      "priority": "high",
      "recommendedAction": "recommended action for the sales team",
      "sourceRecords": [
        "DEAL_RECORD_ID"
      ]
    }
  ]
}

If there are no meaningful insights, return:

{
  "summary": "No significant deal intelligence was identified.",
  "insights": []
}
`;

  const prompt = `
Analyze the following BusinessFlow AI CRM deal data.

DEAL DATA:

${JSON.stringify(deals, null, 2)}

Identify only meaningful and actionable deal intelligence.

Pay particular attention to:

- High-value deals that may deserve attention
- Deals with high probability and meaningful value
- Deals with low probability but significant value
- Deals that appear stalled or inactive based on available activity/date fields
- Deals requiring follow-up
- Deals approaching important pipeline stages
- Deals with unusual stage, value, probability, or timing combinations
- Pipeline risks
- Pipeline opportunities
- Potential next actions supported by the CRM data

Do not create an insight simply because a deal exists.

Do not simply repeat:

- total number of deals
- total pipeline value
- average deal value
- stage counts

unless the data reveals a meaningful business condition.

Use only the CRM data provided.

Every sourceRecords value must be an actual deal ID from the provided data.

Return JSON only.
`;

  const response = await generateAIResponse({
    systemInstruction,
    prompt,
  });

  try {
    const cleanedResponse = response
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleanedResponse);

    return {
      summary: parsed.summary || "",
      insights: Array.isArray(parsed.insights)
        ? parsed.insights
        : [],
    };
  } catch (error) {
    console.error("Deal AI JSON Parse Error:", error);
    console.error("Raw Deal AI Response:", response);

    return {
      summary:
        "AI generated a response that could not be parsed into structured deal insights.",
      insights: [],
    };
  }
};

// =====================================================
// REPORTS AI INSIGHTS
// =====================================================

const generateReportInsights = async ({
  reportsData,
}) => {
  const systemInstruction = `
You are the AI sales analytics assistant for BusinessFlow AI CRM.

Your job is to analyze CRM report data and provide concise,
useful and evidence-based business intelligence.

Rules:

1. Only use the data provided in the prompt.
2. Do not invent customers, leads, deals, tasks, values,
   percentages, trends, dates, or events.
3. Never modify CRM records.
4. Recommendations must be assistive only.
5. Clearly distinguish observed CRM data from AI interpretation
   and recommended actions.
6. Do not expose email addresses, phone numbers, passwords,
   tokens, secrets, or unnecessary personal information.
7. Do not assume information that is not present.
8. Do not create generic insights simply because records exist.
9. Do not treat calculated metrics as AI-generated facts.
10. Focus on meaningful sales performance, trends,
    opportunities, risks and operational conditions.
11. Every source record must reference an actual CRM record ID
    provided in the data.
12. If the available data is insufficient to identify a trend,
    clearly say so instead of inventing one.
13. Return valid JSON only.

Focus on:

- Sales performance
- Lead conversion patterns
- Deal pipeline performance
- Won and lost deal activity
- Pipeline value and distribution
- Lead source patterns
- Task completion and overdue activity
- Inactive sales records
- Follow-up opportunities
- Sales risks
- Meaningful changes or unusual conditions
- Potential business opportunities

Allowed insight types:

- trend
- risk
- opportunity
- performance
- action

Allowed priority values:

- high
- medium
- low

Return exactly this structure:

{
  "summary": "short overall report summary",
  "insights": [
    {
      "type": "trend",
      "title": "short insight title",
      "summary": "what the CRM data shows",
      "priority": "medium",
      "recommendedAction": "optional recommended action",
      "sourceRecords": []
    }
  ]
}

If there are no meaningful insights, return:

{
  "summary": "No significant report intelligence was identified.",
  "insights": []
}
`;

  const prompt = `
Analyze the following BusinessFlow AI CRM report data.

REPORT DATA:

${JSON.stringify(reportsData, null, 2)}

Identify only meaningful and evidence-based business insights.

Pay particular attention to:

1. SALES PERFORMANCE
- Won deals
- Lost deals
- Open pipeline
- Pipeline value
- Deal stage distribution
- Meaningful changes in sales activity

2. LEAD PERFORMANCE
- Lead status distribution
- Conversion activity
- Lead value
- Lead sources
- Potential conversion patterns

3. PIPELINE
- High-value open deals
- Pipeline concentration
- Deals approaching expected close dates
- Stalled or inactive deals
- Open deals with no recent activity

4. TASK / ACTIVITY PERFORMANCE
- Completed tasks
- Pending tasks
- In-progress tasks
- Overdue tasks
- High-priority overdue tasks

5. RISKS
Identify risks only when supported by the provided data.

Examples:
- Significant overdue task activity
- High-value deals without recent activity
- Large concentration of pipeline in a particular stage
- Increasing lost-deal activity when supported by the data
- Follow-up gaps

6. OPPORTUNITIES
Identify opportunities only when supported by the provided data.

Examples:
- Meaningful open pipeline
- High-value deals approaching expected close dates
- Strong conversion activity
- Lead sources producing meaningful qualified or converted leads
- Sales activity that may warrant additional attention

7. TRENDS
Only identify a trend when the provided data contains enough
time-based information to support it.

Do NOT claim:
- revenue growth
- conversion rate improvement
- month-over-month growth
- decline
- increase
- decrease

unless the provided data actually supports that conclusion.

Do not simply repeat:

- total leads
- total deals
- total tasks
- total pipeline value

unless the metric reveals meaningful business context.

Use only the CRM data provided.

Every sourceRecords value must be an actual CRM record ID
from the provided data.

Return JSON only.
`;

  const response = await generateAIResponse({
    systemInstruction,
    prompt,
  });

  try {
    const cleanedResponse = response
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleanedResponse);

    return {
      summary: parsed.summary || "",
      insights: Array.isArray(parsed.insights)
        ? parsed.insights
        : [],
    };
  } catch (error) {
    console.error(
      "Report AI JSON Parse Error:",
      error
    );

    console.error(
      "Raw Report AI Response:",
      response
    );

    return {
      summary:
        "AI generated a response that could not be parsed into structured report insights.",
      insights: [],
    };
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  generateDashboardInsight,
  generateLeadInsights,
  generateDealInsights,
  generateReportInsights,
};