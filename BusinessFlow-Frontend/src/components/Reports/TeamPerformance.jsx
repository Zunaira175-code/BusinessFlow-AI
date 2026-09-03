const TeamPerformance = () => {
  const team = [
    {
      initials: "SJ",
      name: "Sarah Jenkins",
      role: "Senior AE",
      leads: 452,
      qualified: 128,
      dealsWon: 42,
      revenue: "$845k",
      conversion: "9.2%",
      avatar: "bg-[#E7EBEF] text-[#294057]",
      conversionColor: "text-[#16A05D]",
    },
    {
      initials: "MC",
      name: "Marcus Chen",
      role: "Account Executive",
      leads: 385,
      qualified: 95,
      dealsWon: 31,
      revenue: "$620k",
      conversion: "8.0%",
      avatar: "bg-[#E8EEF8] text-[#38628A]",
      conversionColor: "text-[#16A05D]",
    },
    {
      initials: "ER",
      name: "Elena Rodriguez",
      role: "Account Executive",
      leads: 310,
      qualified: 82,
      dealsWon: 28,
      revenue: "$580k",
      conversion: "9.0%",
      avatar: "bg-[#E4F5FB] text-[#168BD0]",
      conversionColor: "text-[#16A05D]",
    },
    {
      initials: "DJ",
      name: "David Jones",
      role: "SDR",
      leads: 620,
      qualified: 145,
      dealsWon: 15,
      revenue: "$210k",
      conversion: "2.4%",
      avatar: "bg-[#FFF0DC] text-[#E98A00]",
      conversionColor: "text-[#64798C]",
    },
    {
      initials: "AP",
      name: "Aisha Patel",
      role: "Senior AE",
      leads: 415,
      qualified: 110,
      dealsWon: 35,
      revenue: "$790k",
      conversion: "8.4%",
      avatar: "bg-[#E6F7EC] text-[#16A05D]",
      conversionColor: "text-[#16A05D]",
    },
    {
      initials: "RJ",
      name: "Robert Jones",
      role: "SDR",
      leads: 580,
      qualified: 130,
      dealsWon: 12,
      revenue: "$180k",
      conversion: "2.0%",
      avatar: "bg-[#FCE8E8] text-[#E35D68]",
      conversionColor: "text-[#64798C]",
    },
  ];

  return (
    <section className="w-full overflow-hidden rounded-[9px] border border-[#DCE5EF] bg-white">

      {/* Header */}
      <div className="flex h-[53px] items-center justify-between border-b border-[#DCE5EF] px-4">
        <h2 className="text-[14px] font-bold text-[#102A43]">
          Team Performance
        </h2>

        <button
          type="button"
          className="text-[9px] font-medium text-[#4D6880] hover:text-[#102A43]"
        >
          View All
        </button>
      </div>

      {/* Table Header */}
      <div className="grid h-[34px] grid-cols-[2.1fr_0.75fr_0.9fr_0.9fr_1fr_0.85fr] items-center border-b border-[#DCE5EF] bg-[#F8FAFC] px-3">
        <span className="text-[8px] font-medium uppercase tracking-[0.04em] text-[#71869A]">
          Employee
        </span>

        <span className="text-center text-[8px] font-medium uppercase tracking-[0.04em] text-[#71869A]">
          Leads
        </span>

        <span className="text-center text-[8px] font-medium uppercase tracking-[0.04em] text-[#71869A]">
          Qualified
        </span>

        <span className="text-center text-[8px] font-medium uppercase tracking-[0.04em] text-[#71869A]">
          Deals Won
        </span>

        <span className="text-center text-[8px] font-medium uppercase tracking-[0.04em] text-[#71869A]">
          Revenue
        </span>

        <span className="text-right text-[8px] font-medium uppercase tracking-[0.04em] text-[#71869A]">
          Conv. Rate
        </span>
      </div>

      {/* Rows */}
      {team.map((member) => (
        <div
          key={member.name}
          className="grid min-h-[48px] grid-cols-[2.1fr_0.75fr_0.9fr_0.9fr_1fr_0.85fr] items-center border-b border-[#E3EAF1] px-3 last:border-b-0"
        >
          {/* Employee */}
          <div className="flex min-w-0 items-center gap-2">
            <div
              className={`flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${member.avatar}`}
            >
              {member.initials}
            </div>

            <div className="min-w-0">
              <p className="truncate text-[9px] font-medium leading-[12px] text-[#172F46]">
                {member.name}
              </p>

              <p className="truncate text-[7px] leading-[10px] text-[#8192A2]">
                {member.role}
              </p>
            </div>
          </div>

          {/* Leads */}
          <span className="text-center text-[9px] text-[#17324D]">
            {member.leads}
          </span>

          {/* Qualified */}
          <span className="text-center text-[9px] text-[#17324D]">
            {member.qualified}
          </span>

          {/* Deals Won */}
          <span className="text-center text-[9px] text-[#17324D]">
            {member.dealsWon}
          </span>

          {/* Revenue */}
          <span className="text-center text-[9px] font-bold text-[#102A43]">
            {member.revenue}
          </span>

          {/* Conversion */}
          <span
            className={`text-right text-[9px] font-medium ${member.conversionColor}`}
          >
            {member.conversion}
          </span>
        </div>
      ))}
    </section>
  );
};

export default TeamPerformance;