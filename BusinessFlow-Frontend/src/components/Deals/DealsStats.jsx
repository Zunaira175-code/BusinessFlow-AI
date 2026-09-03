import {
  BadgeDollarSign,
  BriefcaseBusiness,
  Trophy,
  CircleDollarSign,
} from "lucide-react";

import Card from "../common/Card";

const stats = [
  {
    label: "Pipeline Value",
    value: "$2.4M",
    change: "+12.5% vs last quarter",
    positive: true,
    icon: BadgeDollarSign,
  },
  {
    label: "Active Deals",
    value: "42",
    change: "No change",
    neutral: true,
    icon: BriefcaseBusiness,
  },
  {
    label: "Win Rate",
    value: "38%",
    change: "+2.1% vs last quarter",
    positive: true,
    icon: Trophy,
  },
  {
    label: "Avg. Deal Size",
    value: "$57k",
    change: "-4.2% vs last quarter",
    negative: true,
    icon: CircleDollarSign,
  },
];

const DealsStats = () => {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.label}
              className="
                relative
                min-h-[126px]
                overflow-hidden
                rounded-[9px]
                border
                border-[#DCE5EE]
                bg-white
                px-[15px]
                py-[14px]
                shadow-[0_1px_2px_rgba(15,42,66,0.03)]
              "
            >
              {/* Top Right Icon */}
              <div
                className="
                  absolute
                  right-[10px]
                  top-[13px]
                  flex
                  h-[24px]
                  w-[24px]
                  items-center
                  justify-center
                  rounded-[4px]
                  bg-[#EAF2FC]
                  text-[#173E63]
                "
              >
                <Icon size={13} strokeWidth={1.8} />
              </div>

              {/* Label */}
              <p
                className="
                  pr-[35px]
                  text-[10px]
                  font-medium
                  uppercase
                  leading-[14px]
                  tracking-[0.2px]
                  text-[#63788C]
                "
              >
                {stat.label}
              </p>

              {/* Value */}
              <p
                className="
                  mt-[10px]
                  text-[20px]
                  font-bold
                  leading-[24px]
                  tracking-[-0.3px]
                  text-[#0B2942]
                "
              >
                {stat.value}
              </p>

              {/* Change */}
              <div className="mt-[6px] flex items-start gap-[3px]">
                {!stat.neutral && (
                  <span
                    className={`
                      mt-[1px]
                      text-[11px]
                      font-medium
                      leading-[15px]
                      ${
                        stat.positive
                          ? "text-[#16A34A]"
                          : "text-[#EF4444]"
                      }
                    `}
                  >
                    {stat.positive ? "⌁" : "⌁"}
                  </span>
                )}

                {stat.neutral && (
                  <span className="text-[11px] font-medium leading-[15px] text-[#8A99A8]">
                    →
                  </span>
                )}

                <span
                  className={`
                    text-[11px]
                    font-medium
                    leading-[15px]
                    ${
                      stat.positive
                        ? "text-[#16A34A]"
                        : stat.negative
                          ? "text-[#EF4444]"
                          : "text-[#8A99A8]"
                    }
                  `}
                >
                  {stat.change}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default DealsStats;