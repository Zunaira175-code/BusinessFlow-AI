const AITeamIntelligence = () => {
  const insights = [
    {
      type: "performer",
      title: "Top Performer Identified",
      text: (
        <>
          <strong>Sarah Jenkins</strong> has exceeded Q3 targets by 142%.
          Consider her for the upcoming Regional Director role.
        </>
      ),
      action: "View Profile →",
    },
    {
      type: "workload",
      title: "Workload Imbalance Alert",
      text: (
        <>
          The <strong>Enterprise Sales Team</strong> is operating at 115%
          capacity. Risk of burnout detected in 3 key members.
        </>
      ),
      action: "Reassign Leads →",
    },
    {
      type: "opportunity",
      title: "Performance Opportunity",
      text: (
        <>
          Junior SDRs show a 20% drop in conversion rates this month.
          Recommended action: Assign specific objection handling training
          module.
        </>
      ),
      action: "Assign Training →",
    },
  ];

  const icons = {
    performer: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M8 4H16V8H20V20H4V8H8V4Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M8 8H16"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M9 13L11 15L15 11"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),

    workload: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
      >
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
        <circle
          cx="12"
          cy="16"
          r="1"
          fill="currentColor"
        />
      </svg>
    ),

    opportunity: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
      >
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
  };

  const iconStyles = {
    performer: "bg-[#E6F7EC] text-[#16A05D]",
    workload: "bg-[#FFF0DE] text-[#F28A00]",
    opportunity: "bg-[#E5F4FB] text-[#168BD0]",
  };

  return (
    <section className="w-full overflow-hidden rounded-[9px] border border-[#CFE2FA] bg-[#EEF5FF]">

      {/* Section Header */}
      <div className="flex h-[42px] items-center gap-2 border-b border-[#CFE2FA] px-4">
        <span className="text-[15px] font-bold leading-none text-[#071D35]">
          ✦
        </span>

        <h2 className="text-[10px] font-bold uppercase tracking-[0.04em] text-[#102A43]">
          AI Team Intelligence
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-3 p-3">
        {insights.map((insight) => (
          <div
            key={insight.title}
            className="min-h-[113px] rounded-[6px] border border-[#D7E3EF] bg-white px-3 py-3"
          >
            <div className="flex items-start gap-2">

              {/* Icon */}
              <div
                className={`flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-full ${iconStyles[insight.type]}`}
              >
                {icons[insight.type]}
              </div>

              {/* Content */}
              <div className="min-w-0">
                <h3 className="text-[8.5px] font-bold leading-[12px] text-[#102A43]">
                  {insight.title}
                </h3>

                <p className="mt-[2px] text-[8px] leading-[12px] text-[#5F7488]">
                  {insight.text}
                </p>

                <button
                  type="button"
                  className="mt-[5px] text-[8px] font-semibold text-[#0088CE] hover:text-[#006FA8]"
                >
                  {insight.action}
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AITeamIntelligence;