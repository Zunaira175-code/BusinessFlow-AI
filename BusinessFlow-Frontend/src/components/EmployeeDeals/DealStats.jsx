const stats = [
  {
    title: "MY DEALS",
    value: "16",
    description: "$84,500 total pipeline",
    descriptionColor: "text-[#718599]",
  },
  {
    title: "WON DEALS",
    value: "8",
    description: "$42,300 closed",
    descriptionColor: "text-[#20A65A]",
  },
  {
    title: "DEALS IN PROGRESS",
    value: "12",
    description: "$67,200 pipeline",
    descriptionColor: "text-[#718599]",
  },
  {
    title: "CLOSING THIS MONTH",
    value: "5",
    description: "$28,600 potential",
    descriptionColor: "text-[#E87500]",
  },
];

const DealStats = () => {
  return (
    <div
      className="
        grid
        w-full
        grid-cols-1
        gap-2.5
        sm:grid-cols-2
        lg:grid-cols-4
      "
    >
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="
            min-h-[76px]
            rounded-[9px]
            border
            border-[#DCE5ED]
            bg-white
            px-4
            py-3
            shadow-[0_1px_2px_rgba(15,23,42,0.03)]
          "
        >
          {/* Title */}
          <p
            className="
              text-[7px]
              font-semibold
              uppercase
              tracking-[0.5px]
              text-[#718599]
            "
          >
            {stat.title}
          </p>

          {/* Value */}
          <p
            className="
              mt-1
              text-[22px]
              font-bold
              leading-none
              tracking-[-0.5px]
              text-[#0B2E50]
            "
          >
            {stat.value}
          </p>

          {/* Description */}
          <p
            className={`
              mt-1.5
              text-[7px]
              font-medium
              ${stat.descriptionColor}
            `}
          >
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DealStats;