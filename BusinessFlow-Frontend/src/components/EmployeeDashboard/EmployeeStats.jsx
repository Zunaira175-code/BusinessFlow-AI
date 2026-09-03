import {
  Clock3,
  TrendingUp,
  CircleDollarSign,
  UsersRound,
} from "lucide-react";

const stats = [
  {
    title: "My Tasks",
    value: "18",
    subtitle: "5 due today",
    icon: Clock3,
    subtitleClass: "text-[#F59E0B]",
    iconClass: "text-[#F59E0B]",
  },
  {
    title: "My Leads",
    value: "42",
    subtitle: "8 new this week",
    icon: TrendingUp,
    subtitleClass: "text-[#20A65A]",
    iconClass: "text-[#20A65A]",
  },
  {
    title: "My Deals",
    value: "$84,500",
    subtitle: "16 active deals",
    icon: CircleDollarSign,
    subtitleClass: "text-[#079BEA]",
    iconClass: "text-[#079BEA]",
  },
  {
    title: "My Customers",
    value: "126",
    subtitle: "12 active this week",
    icon: UsersRound,
    subtitleClass: "text-[#718599]",
    iconClass: "text-[#718599]",
  },
];

const EmployeeStats = () => {
  return (
    <div
      className="
        grid
        w-full
        grid-cols-1
        gap-2
        sm:grid-cols-2
        lg:grid-cols-4
      "
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
              min-h-[84px]
              rounded-[9px]
              border
              border-[#DCE5ED]
              bg-white
              px-3
              py-3
              transition-all
              duration-200
              hover:border-[#C8D8E6]
              hover:shadow-sm
            "
          >
            {/* Title */}
            <p
              className="
                text-[8px]
                font-medium
                leading-[11px]
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
                leading-[25px]
                tracking-[-0.4px]
                text-[#0B3155]
              "
            >
              {stat.value}
            </p>

            {/* Bottom Info */}
            <div
              className={`
                mt-2
                flex
                items-center
                gap-1
                text-[7px]
                font-medium
                ${stat.subtitleClass}
              `}
            >
              <Icon
                size={9}
                strokeWidth={2}
                className={stat.iconClass}
              />

              <span>{stat.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EmployeeStats;