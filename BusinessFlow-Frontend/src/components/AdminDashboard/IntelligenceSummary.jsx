import { Sparkles, TrendingUp } from "lucide-react";

import Card from "../common/Card";
import Button from "../common/button";


const insights = [
  {
    score: "92%",
    title: "Global Dynamics Contract",
    description: "High engagement signals detected in recent email threads.",
    type: "success",
  },
  {
    score: "85%",
    title: "TechFlow Expansion",
    description: "Decision maker viewed pricing page 4 times today.",
    type: "success",
  },
  {
    score: "78%",
    title: "Acme Corp Renewal",
    description: "Renewal opportunity showing positive engagement.",
    type: "warning",
  },
];

const IntelligenceSummary = () => {
  return (
    <Card
      className="
        relative
        flex
        h-full
        min-h-[330px]
        flex-col
        overflow-hidden
        border-[#CFE2FA]
        bg-[#F8FAFF]
      "
    >
      {/* Top Blue Border */}
      <div className="absolute left-0 right-0 top-0 h-[3px] bg-[#A8D5FF]" />

      {/* Header */}
      <div className="px-[14px] pt-[14px]">

        <div className="flex items-center gap-2">

          <div
            className="
              flex
              h-[28px]
              w-[28px]
              items-center
              justify-center
              rounded-full
              bg-[#EDF5FF]
              text-[#0B3D6B]
            "
          >
            <Sparkles
              size={14}
              strokeWidth={2}
            />
          </div>

          <h2 className="text-[13px] font-bold text-[#102F4A]">
            Intelligence Summary
          </h2>

        </div>

        <p className="mt-2 text-[9px] font-medium leading-[14px] text-[#718599]">
          AI has analyzed your pipeline and identified 3 high probability
          conversions for this week.
        </p>

      </div>

      {/* Insights */}
      <div className="flex-1 space-y-2 overflow-hidden px-[14px] pb-[58px] pt-[14px]">

        {insights.map((item) => (
          <div
            key={item.title}
            className="
              flex
              min-h-[64px]
              items-start
              gap-2
              rounded-[7px]
              border
              border-[#DCE5EE]
              bg-white
              px-2.5
              py-2.5
              shadow-[0_1px_2px_rgba(16,47,74,0.03)]
            "
          >

            {/* Score */}
            <div
              className={`
                flex
                h-[32px]
                w-[32px]
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                text-[9px]
                font-bold
                ${
                  item.type === "warning"
                    ? "border-[#F5D7A6] bg-[#FFF8EA] text-[#E59A19]"
                    : "border-[#BFE8D0] bg-[#F0FBF5] text-[#20A65A]"
                }
              `}
            >
              {item.score}
            </div>

            {/* Content */}
            <div className="min-w-0">

              <h3 className="text-[10px] font-bold leading-[13px] text-[#17324D]">
                {item.title}
              </h3>

              <p className="mt-[2px] text-[8px] leading-[12px] text-[#8192A2]">
                {item.description}
              </p>

            </div>

          </div>
        ))}

      </div>

      {/* Bottom Button */}
      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          border-t
          border-[#DDE5EC]
          bg-[#F8FAFF]
          px-[12px]
          py-[10px]
        "
      >

        <Button
          type="button"
          className="
            flex
            h-[32px]
            w-full
            items-center
            justify-center
            gap-1.5
            rounded-[7px]
            border
            border-[#D7E1EA]
            bg-white
            text-[9px]
            font-semibold
            text-[#17324D]
            hover:bg-[#F5F8FB]
          "
        >
          <TrendingUp
            size={12}
            strokeWidth={2}
          />

          View Full AI Analysis
        </Button>

      </div>

    </Card>
  );
};

export default IntelligenceSummary;