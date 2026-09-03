const AIAnalyticsInsights = () => {
  const insights = [
    {
      type: "trend",
      title: "Key Trend: Q4 Enterprise Growth",
      description:
        "Enterprise deals have seen a 22% increase in closure rate over the last 45 days, largely driven by the new Q4 promotional pricing.",
    },
    {
      type: "risk",
      title: "Risk: Lead Response Time",
      description:
        "Average time to first response has slipped from 2.4 hours to 4.1 hours this week. Recommend immediate team review to prevent lead drop-off.",
    },
    {
      type: "opportunity",
      title: "Opportunity: Cross-sell Potential",
      description:
        "Analysis of recent won deals suggests a 35% probability of successful cross-sell to the 'Advanced Analytics' module within 30 days of initial purchase.",
    },
    {
      type: "action",
      title: "Recommended Action",
      description:
        "Prioritize leads in the 'Healthcare' sector. They currently hold the highest average deal value ($45k) and shortest sales cycle (14 days).",
    },
  ];

  const icons = {
    trend: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 15L9 10L13 14L20 7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 7H20V12"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),

    risk: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 4L21 19H3L12 4Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M12 9V13"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
      </svg>
    ),

    opportunity: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 18H15"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M10 21H14"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M8 14.5C6.8 13.5 6 12 6 10.3C6 7.2 8.7 5 12 5C15.3 5 18 7.2 18 10.3C18 12 17.2 13.5 16 14.5C15.2 15.2 15 16 15 17H9C9 16 8.8 15.2 8 14.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    ),

    action: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="8"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M8 12L10.5 14.5L16 9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  const iconStyles = {
    trend: "bg-[#E5F7EC] text-[#16A05D]",
    risk: "bg-[#FFF1DE] text-[#F28A00]",
    opportunity: "bg-[#E4F4FF] text-[#168BD0]",
    action: "bg-[#E8EDF2] text-[#24384B]",
  };

  return (
    <section className="w-full rounded-[9px] border border-[#CFE2FA] bg-[#EEF5FF] p-4">

      {/* Section Header */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[16px] leading-none text-[#008FD5]">
          ✦
        </span>

        <h2 className="text-[16px] font-bold leading-[20px] text-[#102A43]">
          AI Analytics Insights
        </h2>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-2 gap-3">
        {insights.map((insight) => (
          <div
            key={insight.title}
            className="flex min-h-[80px] items-start gap-3 rounded-[6px] border border-[#D9E4EF] bg-white px-3.5 py-3"
          >
            {/* Icon */}
            <div
              className={`mt-0.5 flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-full ${
                iconStyles[insight.type]
              }`}
            >
              {icons[insight.type]}
            </div>

            {/* Content */}
            <div className="min-w-0">
              <h3 className="text-[9px] font-bold leading-[13px] text-[#102A43]">
                {insight.title}
              </h3>

              <p className="mt-1 text-[8.5px] leading-[13px] text-[#60768A]">
                {insight.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AIAnalyticsInsights;