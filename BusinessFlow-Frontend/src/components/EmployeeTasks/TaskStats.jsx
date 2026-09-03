const taskStats = [
  {
    title: "Total Tasks",
    value: "18",
    badge: "5 due today",
    badgeClass: "bg-[#FFF1D9] text-[#E87500]",
    valueClass: "text-[#0B2E50]",
  },
  {
    title: "In Progress",
    value: "7",
    badge: "3 high priority",
    badgeClass: "bg-[#FFE5E5] text-[#EF4444]",
    valueClass: "text-[#0B2E50]",
  },
  {
    title: "Completed",
    value: "42",
    badge: "87% completion",
    badgeClass: "bg-[#E7F8ED] text-[#20A65A]",
    valueClass: "text-[#16A34A]",
  },
  {
    title: "Overdue",
    value: "2",
    badge: "Action req.",
    badgeClass: "bg-white text-[#EF4444]",
    valueClass: "text-[#EF2B2B]",
    overdue: true,
  },
];

const TaskStats = () => {
  return (
    <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
      {taskStats.map((stat) => (
        <div
          key={stat.title}
          className={`
            relative
            min-h-[76px]
            rounded-[9px]
            border
            bg-white
            px-4
            py-3
            shadow-[0_1px_2px_rgba(15,23,42,0.03)]
            ${
              stat.overdue
                ? "border-[#FF4D4D] border-t-[3px]"
                : "border-[#DCE5ED]"
            }
          `}
        >
          {/* Title */}
          <p
            className="
              text-[7px]
              font-semibold
              capitalize
              text-[#60758A]
            "
          >
            {stat.title}
          </p>

          {/* Value */}
          <p
            className={`
              mt-1
              text-[21px]
              font-bold
              leading-none
              tracking-[-0.4px]
              ${stat.valueClass}
            `}
          >
            {stat.value}
          </p>

          {/* Badge */}
          <span
            className={`
              mt-2
              inline-flex
              rounded-[5px]
              px-2
              py-[3px]
              text-[6px]
              font-medium
              ${stat.badgeClass}
            `}
          >
            {stat.badge}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;