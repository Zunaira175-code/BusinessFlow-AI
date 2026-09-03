const stats = [
  {
    title: "TOTAL REVENUE",
    value: "$142,500",
    bottom: "↑ 12% vs last month",
    bottomClass:
      "bg-[#E8F7EF] text-[#16A05D]",
  },
  {
    title: "QUOTA ATTAINMENT",
    value: "85%",
    bottom: "Target: $165k",
    bottomClass:
      "text-[#7A8B9A]",
  },
  {
    title: "WIN RATE",
    value: "24%",
    bottom: "↗ +3% trend",
    bottomClass:
      "bg-[#E8F7EF] text-[#16A05D]",
  },
  {
    title: "AVG. DEAL SIZE",
    value: "$18,400",
    bottom: "— Stable",
    bottomClass:
      "border border-[#DCE5ED] text-[#60758A]",
  },
];

const ReportsStats = () => {
  return (
    <div className="grid w-full grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="
            h-[106px]
            rounded-[9px]
            border
            border-[#DCE5ED]
            bg-white
            px-4
            py-3
          "
        >
          <p
            className="
              text-[8px]
              font-semibold
              tracking-[0.35px]
              text-[#60758A]
            "
          >
            {stat.title}
          </p>

          <p
            className="
              mt-[8px]
              text-[24px]
              font-bold
              leading-[27px]
              tracking-[-0.6px]
              text-[#071D35]
            "
          >
            {stat.value}
          </p>

          <div className="mt-[7px]">
            <span
              className={`
                inline-flex
                items-center
                rounded-full
                px-[7px]
                py-[3px]
                text-[7px]
                font-medium
                ${stat.bottomClass}
              `}
            >
              {stat.bottom}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportsStats;