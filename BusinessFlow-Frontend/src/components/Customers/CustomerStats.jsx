import {
  UsersRound,
  Settings2,
  CreditCard,
  DollarSign,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

import Card from "../common/Card";

const stats = [
  {
    title: "TOTAL CUSTOMERS",
    value: "1,240",
    change: "+12%",
    changeType: "positive",
    icon: UsersRound,
  },
  {
    title: "ACTIVE ACCOUNTS",
    value: "856",
    change: "+5%",
    changeType: "positive",
    icon: Settings2,
  },
  {
    title: "NEW THIS MONTH",
    value: "42",
    change: "0%",
    changeType: "neutral",
    icon: CreditCard,
  },
  {
    title: "AVG. ACCOUNT VALUE",
    value: "$12.5k",
    change: "+2.4%",
    changeType: "positive",
    icon: DollarSign,
  },
];

const CustomerStats = () => {
  return (
    <section className="mt-5 w-full">
      <div className="grid w-full grid-cols-4 gap-4">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.title}
              className="
                relative
                h-[110px]
                overflow-hidden
                rounded-[9px]
                border-[#DCE5ED]
                bg-white
                px-[15px]
                py-[13px]
              "
            >
              {/* =================================================
                  TOP RIGHT ICON
              ================================================== */}
              <div
                className="
                  absolute
                  right-[11px]
                  top-[11px]
                  flex
                  h-[32px]
                  w-[32px]
                  items-center
                  justify-center
                  rounded-[7px]
                  bg-[#EEF4FC]
                  text-[#173B5C]
                "
              >
                <Icon
                  size={15}
                  strokeWidth={1.8}
                />
              </div>

              {/* =================================================
                  TITLE
              ================================================== */}
              <p
                className="
                  max-w-[115px]
                  text-[9px]
                  font-semibold
                  leading-[12px]
                  tracking-[0.4px]
                  text-[#617589]
                "
              >
                {stat.title}
              </p>

              {/* =================================================
                  VALUE
              ================================================== */}
              <h2
                className="
                  mt-[12px]
                  text-[22px]
                  font-bold
                  leading-[25px]
                  tracking-[-0.5px]
                  text-[#102F4A]
                "
              >
                {stat.value}
              </h2>

              {/* =================================================
                  CHANGE
              ================================================== */}
              <div className="mt-[5px] flex items-center gap-[5px]">

                {stat.changeType === "positive" && (
                  <TrendingUp
                    size={10}
                    strokeWidth={2.5}
                    className="text-[#27AE60]"
                  />
                )}

                {stat.changeType === "neutral" && (
                  <ArrowRight
                    size={10}
                    strokeWidth={2.5}
                    className="text-[#F39C12]"
                  />
                )}

                <span
                  className={`
                    text-[8px]
                    font-semibold
                    ${
                      stat.changeType === "positive"
                        ? "text-[#27AE60]"
                        : "text-[#F39C12]"
                    }
                  `}
                >
                  {stat.change}
                </span>

                <span
                  className="
                    text-[8px]
                    font-medium
                    text-[#91A0AE]
                  "
                >
                  vs last month
                </span>

              </div>
            </Card>
          );
        })}

      </div>
    </section>
  );
};

export default CustomerStats;