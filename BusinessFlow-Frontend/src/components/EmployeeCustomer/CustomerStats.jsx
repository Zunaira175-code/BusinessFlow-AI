import {
  UsersRound,
  UserCheck,
  Clock3,
  CircleAlert,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    label: "MY CUSTOMERS",
    value: "126",
    description: "12 new this month",
    icon: UsersRound,
    type: "positive",
  },
  {
    label: "ACTIVE CUSTOMERS",
    value: "98",
    description: "78% of total",
    icon: UserCheck,
    type: "neutral",
  },
  {
    label: "FOLLOW-UPS DUE",
    value: "14",
    description: "5 due today",
    icon: Clock3,
    type: "warning",
  },
  {
    label: "AT RISK",
    value: "7",
    description: "Requires attention",
    icon: CircleAlert,
    type: "danger",
  },
];

const CustomerStats = () => {
  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        const descriptionClass =
          stat.type === "positive"
            ? "text-[#20A65A]"
            : stat.type === "warning"
              ? "text-[#E88700]"
              : stat.type === "danger"
                ? "text-[#EF4444]"
                : "text-[#8495A5]";

        const iconClass =
          stat.type === "positive"
            ? "text-[#20A65A]"
            : stat.type === "warning"
              ? "text-[#E88700]"
              : stat.type === "danger"
                ? "text-[#EF4444]"
                : "text-[#60758A]";

        return (
          <div
            key={stat.label}
            className="
              min-h-[78px]
              rounded-[8px]
              border
              border-[#DCE5ED]
              bg-white
              px-4
              py-3
              shadow-[0_1px_2px_rgba(7,29,53,0.03)]
            "
          >
            <p className="text-[8px] font-semibold tracking-[0.2px] text-[#60758A]">
              {stat.label}
            </p>

            <div className="mt-1 flex items-center">
              <p
                className={`
                  text-[25px]
                  font-bold
                  leading-none
                  tracking-[-0.5px]
                  ${
                    stat.type === "warning"
                      ? "text-[#D97706]"
                      : stat.type === "danger"
                        ? "text-[#DC2626]"
                        : "text-[#0B2F50]"
                  }
                `}
              >
                {stat.value}
              </p>
            </div>

            <div className="mt-1.5 flex items-center gap-1">
              <Icon
                size={9}
                strokeWidth={2}
                className={iconClass}
              />

              <span
                className={`text-[7px] font-medium ${descriptionClass}`}
              >
                {stat.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomerStats;