const ReportsStats = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "$4.2M",
      change: "+12% vs last month",
    },
    {
      title: "Deals Won",
      value: "156",
      change: "+8% vs last month",
    },
    {
      title: "New Leads",
      value: "2,481",
      change: "+5% vs last month",
    },
    {
      title: "Conversion Rate",
      value: "18.4%",
      change: "+2.1% vs last month",
    },
  ];

  return (
    <section className="grid w-full grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="h-[99px] rounded-[9px] border border-[#DCE5EF] bg-white px-4 py-3.5"
        >
          {/* Title */}
          <p className="text-[9px] font-medium leading-[13px] text-[#64798C]">
            {stat.title}
          </p>

          {/* Value */}
          <p className="mt-[3px] text-[22px] font-bold leading-[27px] text-[#071D35]">
            {stat.value}
          </p>

          {/* Change */}
          <div className="mt-[4px] inline-flex items-center rounded-[3px] bg-[#E8F7EF] px-[5px] py-[2px]">
            <span className="mr-[3px] text-[8px] font-bold text-[#16A05D]">
              ↗
            </span>

            <span className="text-[8px] font-semibold text-[#16A05D]">
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ReportsStats;