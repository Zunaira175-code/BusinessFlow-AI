import {
  UsersRound,
  Sparkles,
  BadgeCheck,
  CalendarCheck,
  TrendingUp,
  Clock3,
  CircleAlert,
} from "lucide-react";

/* =========================================================
   LEAD STATS DATA
========================================================= */

const stats = [
  {
    title: "MY LEADS",
    value: "42",
    footer: "8 new this week",
    footerType: "info",
    icon: UsersRound,
  },
  {
    title: "NEW LEADS",
    value: "8",
    footer: "+18% this month",
    footerType: "success",
    icon: Sparkles,
  },
  {
    title: "QUALIFIED LEADS",
    value: "24",
    footer: "57% conversion potential",
    footerType: "default",
    icon: BadgeCheck,
  },
  {
    title: "FOLLOW-UPS DUE",
    value: "9",
    footer: "4 due today",
    footerType: "danger",
    icon: CalendarCheck,
  },
];

/* =========================================================
   EMPLOYEE LEAD STATS
========================================================= */

const LeadStats = () => {
  return (
    <div
      className="
        grid
        w-full
        grid-cols-1
        gap-3
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
              relative
              min-h-[94px]
              overflow-hidden
              rounded-[9px]
              border
              border-[#DCE5ED]
              bg-white
              px-4
              py-3
              shadow-[0_1px_2px_rgba(15,23,42,0.03)]
            "
          >
            {/* =================================================
                TOP
            ================================================== */}

            <div className="flex items-start justify-between">
              <p
                className="
                  text-[8px]
                  font-semibold
                  tracking-[0.35px]
                  text-[#718599]
                "
              >
                {stat.title}
              </p>

              {/* Background Icon */}
              <Icon
                size={31}
                strokeWidth={1.4}
                className={`
                  absolute
                  right-3
                  top-3
                  opacity-[0.10]

                  ${
                    stat.footerType === "danger"
                      ? "text-[#F59E0B]"
                      : stat.footerType === "success"
                      ? "text-[#20A65A]"
                      : "text-[#315D80]"
                  }
                `}
              />
            </div>

            {/* =================================================
                VALUE
            ================================================== */}

            <p
              className={`
                mt-2
                text-[25px]
                font-bold
                leading-none
                tracking-[-0.6px]

                ${
                  stat.footerType === "danger"
                    ? "text-[#EF4444]"
                    : "text-[#0B2947]"
                }
              `}
            >
              {stat.value}
            </p>

            {/* =================================================
                FOOTER
            ================================================== */}

            <div className="mt-2.5">
              {stat.footerType === "info" && (
                <span
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    bg-[#E4EEFF]
                    px-1.5
                    py-[2px]
                    text-[7px]
                    font-semibold
                    text-[#245A9C]
                  "
                >
                  {stat.footer}
                </span>
              )}

              {stat.footerType === "success" && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    text-[7px]
                    font-medium
                    text-[#20A65A]
                  "
                >
                  <TrendingUp
                    size={9}
                    strokeWidth={2}
                  />

                  {stat.footer}
                </span>
              )}

              {stat.footerType === "default" && (
                <span
                  className="
                    text-[7px]
                    font-medium
                    text-[#718599]
                  "
                >
                  {stat.footer}
                </span>
              )}

              {stat.footerType === "danger" && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-full
                    bg-[#FFE1E1]
                    px-1.5
                    py-[2px]
                    text-[7px]
                    font-semibold
                    text-[#DC2626]
                  "
                >
                  <Clock3
                    size={8}
                    strokeWidth={2}
                  />

                  {stat.footer}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeadStats;