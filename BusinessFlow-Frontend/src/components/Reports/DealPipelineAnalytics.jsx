const DealPipelineAnalytics = () => {
  const stages = [
    {
      name: "Discovery",
      deals: "245 deals",
      value: "$1.2M",
      width: "100%",
      color: "bg-[#061C35]",
    },
    {
      name: "Qualification",
      deals: "180 deals",
      value: "$950k",
      width: "68%",
      color: "bg-[#3E628D]",
    },
    {
      name: "Proposal",
      deals: "120 deals",
      value: "$720k",
      width: "49%",
      color: "bg-[#0795D1]",
    },
    {
      name: "Negotiation",
      deals: "65 deals",
      value: "$410k",
      width: "25%",
      color: "bg-[#E88A08]",
    },
    {
      name: "Won",
      deals: "156 deals",
      value: "$1.8M",
      width: "64%",
      color: "bg-[#16A653]",
    },
    {
      name: "Lost",
      deals: "89 deals",
      value: "$340k",
      width: "38%",
      color: "bg-[#EB777C]",
    },
  ];

  return (
    <section className="w-full rounded-[9px] border border-[#DCE5EF] bg-white p-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-[#102A43]">
          Deal Pipeline Analytics
        </h2>

        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center rounded text-[#526B82] hover:bg-[#F3F6F9]"
          aria-label="More options"
        >
          <span className="text-[17px] leading-none">
            ⋮
          </span>
        </button>
      </div>

      {/* Pipeline */}
      <div className="mt-3 space-y-[7px]">
        {stages.map((stage) => (
          <div key={stage.name}>

            {/* Stage Header */}
            <div className="mb-[3px] flex items-center justify-between">
              <span className="text-[8px] font-semibold text-[#17324D]">
                {stage.name}
              </span>

              <span className="text-[8px] text-[#8293A3]">
                {stage.deals} ({stage.value})
              </span>
            </div>

            {/* Background Track */}
            <div className="h-[7px] w-full overflow-hidden rounded-full bg-[#F0F3F6]">
              {/* Progress */}
              <div
                className={`h-full rounded-full ${stage.color}`}
                style={{
                  width: stage.width,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DealPipelineAnalytics;