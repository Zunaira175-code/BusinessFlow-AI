import {
  WalletCards,
  UserRoundPlus,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import Card from "../common/Card";
import IconButton from "../common/IconButton";

const stats = [
  {
    title: "TOTAL REVENUE",
    value: "$1.2M",
    change: "+12%",
    description: "vs last month",
    trend: "up",
    icon: WalletCards,
  },
  {
    title: "NEW LEADS",
    value: "450",
    change: "+5%",
    description: "vs last month",
    trend: "up",
    icon: UserRoundPlus,
  },
  {
    title: "ACTIVE DEALS",
    value: "82",
    change: "-2%",
    description: "vs last month",
    trend: "down",
    icon: BriefcaseBusiness,
  },
  {
    title: "CONVERSION RATE",
    value: "24%",
    change: "+3%",
    description: "vs last month",
    trend: "up",
    icon: ChartNoAxesCombined,
  },
];

const StatsCards = () => {
  return (
    <section className="grid w-full grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isPositive = stat.trend === "up";

        return (
          <Card
            key={stat.title}
            className="
              relative
              h-[112px]
              overflow-hidden
              px-[14px]
              py-[12px]
            "
          >
            {/* Decorative Corner */}
            <div
              className="
                pointer-events-none
                absolute
                right-0
                top-0
                h-[42px]
                w-[42px]
                bg-[#F5F8FC]
              "
              style={{
                clipPath: "polygon(32% 0, 100% 0, 100% 100%)",
              }}
            />

            {/* Top Row */}
            <div className="relative flex items-start justify-between">
              <h3
                className="
                  pt-[2px]
                  text-[8px]
                  font-semibold
                  tracking-[0.3px]
                  text-[#52697D]
                "
              >
                {stat.title}
              </h3>

              <IconButton
                icon={Icon}
                label={stat.title}
                variant="light"
                size={14}
                className="
                  h-[28px]
                  w-[28px]
                  rounded-[6px]
                  bg-[#EEF4FB]
                  text-[#173F66]
                  hover:bg-[#E5EEF8]
                "
              />
            </div>

            {/* Value */}
            <div
              className="
                mt-[10px]
                text-[24px]
                font-bold
                leading-none
                tracking-[-0.6px]
                text-[#102F4A]
              "
            >
              {stat.value}
            </div>

            {/* Trend */}
            <div className="mt-[9px] flex items-center gap-1">
              {isPositive ? (
                <TrendingUp
                  size={10}
                  strokeWidth={2.3}
                  className="text-[#22B573]"
                />
              ) : (
                <TrendingDown
                  size={10}
                  strokeWidth={2.3}
                  className="text-[#EF6464]"
                />
              )}

              <span
                className={`
                  text-[9px]
                  font-semibold
                  ${isPositive ? "text-[#22B573]" : "text-[#EF6464]"}
                `}
              >
                {stat.change}
              </span>

              <span className="text-[9px] font-medium text-[#8998A7]">
                {stat.description}
              </span>
            </div>
          </Card>
        );
      })}
    </section>
  );
};

export default StatsCards;