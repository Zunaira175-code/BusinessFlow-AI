const stats = [
  {
    title: "TOTAL LEADS",
    value: "2,451",
    change: "+12.5%",
    changeText: "vs last month",
    positive: true,
  },
  {
    title: "NEW LEADS",
    value: "384",
    change: "+8.2%",
    changeText: "vs last month",
    positive: true,
  },
  {
    title: "QUALIFIED LEADS",
    value: "142",
    change: "-2.4%",
    changeText: "vs last month",
    positive: false,
  },
  {
    title: "CONVERSION RATE",
    value: "18.4%",
    change: "+4.1%",
    changeText: "vs last month",
    positive: true,
  },
];

const LeadsStats = () => {
  return (
    <section className="mt-[20px] grid w-full grid-cols-1 gap-[12px] sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="
            h-[101px]
            rounded-[8px]
            border
            border-[#DCE5EE]
            bg-white
            px-[14px]
            py-[13px]
          "
        >
          {/* Title */}
          <p
            className="
              text-[9px]
              font-semibold
              leading-[12px]
              tracking-[0.4px]
              text-[#5D7184]
            "
          >
            {stat.title}
          </p>

          {/* Value */}
          <h2
            className="
              mt-[8px]
              text-[24px]
              font-bold
              leading-[27px]
              tracking-[-0.5px]
              text-[#102F4A]
            "
          >
            {stat.value}
          </h2>

          {/* Change */}
          <div className="mt-[5px] flex items-center gap-[4px]">
            <span
              className={`
                text-[10px]
                font-semibold
                leading-[14px]
                ${stat.positive ? "text-[#16A05D]" : "text-[#FF3B3B]"}
              `}
            >
              {stat.positive ? "⌁" : "⌁"} {stat.change}
            </span>

            <span
              className="
                text-[9px]
                font-medium
                leading-[14px]
                text-[#8292A0]
              "
            >
              {stat.changeText}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default LeadsStats;