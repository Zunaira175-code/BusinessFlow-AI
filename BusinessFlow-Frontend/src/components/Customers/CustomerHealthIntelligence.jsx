import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
} from "lucide-react";

import Card from "../common/Card";

const CustomerHealthIntelligence = () => {
  return (
    <Card
      className="
        w-full
        overflow-hidden
        rounded-[9px]
        border-[#DCE5ED]
        bg-[#F8FAFF]
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        className="
          flex
          min-h-[69px]
          items-center
          gap-[9px]
          border-b
          border-[#DDE5EC]
          px-[13px]
        "
      >
        {/* AI Icon */}
        <div
          className="
            flex
            h-[27px]
            w-[27px]
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-[#D9E5F2]
            bg-[#EEF4FC]
            text-[#0B3D6B]
          "
        >
          <Sparkles
            size={13}
            strokeWidth={2}
          />
        </div>

        <h2
          className="
            max-w-[125px]
            text-[12px]
            font-bold
            leading-[16px]
            text-[#102F4A]
          "
        >
          Customer Health
          <br />
          Intelligence
        </h2>
      </div>

      {/* =====================================================
          INSIGHTS
      ====================================================== */}
      <div className="space-y-[10px] px-[9px] py-[13px]">

        {/* =================================================
            HIGH ATTRITION RISK
        ================================================== */}
        <div
          className="
            rounded-[6px]
            border
            border-[#DCE5ED]
            bg-white
            px-[10px]
            py-[10px]
            shadow-[0_1px_2px_rgba(16,47,74,0.02)]
          "
        >
          {/* Insight heading */}
          <div className="flex items-start justify-between gap-2">

            <div className="flex items-center gap-[5px]">
              <AlertTriangle
                size={11}
                strokeWidth={2}
                className="text-[#EF4444]"
              />

              <span
                className="
                  text-[9px]
                  font-semibold
                  text-[#EF4444]
                "
              >
                High Attrition Risk
              </span>
            </div>

            <span
              className="
                max-w-[48px]
                text-right
                text-[7px]
                font-medium
                leading-[9px]
                text-[#718599]
              "
            >
              Acme Corp
            </span>
          </div>

          {/* Description */}
          <p
            className="
              mt-[7px]
              text-[8px]
              font-medium
              leading-[12px]
              text-[#718599]
            "
          >
            Usage has dropped by 45% in the last
            30 days. No logins from admin account
            since last week.
          </p>

          {/* Action */}
          <button
            type="button"
            className="
              mt-[8px]
              flex
              h-[24px]
              w-full
              items-center
              justify-center
              rounded-[5px]
              border
              border-[#D8E2EA]
              bg-white
              text-[7px]
              font-semibold
              text-[#173B5C]
              transition-all
              duration-200
              hover:bg-[#F7F9FC]
              hover:border-[#C5D3DF]
            "
          >
            Schedule Review Call
          </button>
        </div>

        {/* =================================================
            EXPANSION OPPORTUNITY
        ================================================== */}
        <div
          className="
            rounded-[6px]
            border
            border-[#DCE5ED]
            bg-white
            px-[10px]
            py-[10px]
            shadow-[0_1px_2px_rgba(16,47,74,0.02)]
          "
        >
          {/* Insight heading */}
          <div className="flex items-start justify-between gap-2">

            <div className="flex items-start gap-[5px]">

              <Lightbulb
                size={11}
                strokeWidth={2}
                className="mt-[1px] text-[#20A45A]"
              />

              <span
                className="
                  max-w-[80px]
                  text-[9px]
                  font-semibold
                  leading-[12px]
                  text-[#20A45A]
                "
              >
                Expansion
                <br />
                Opportunity
              </span>

            </div>

            <span
              className="
                max-w-[45px]
                text-right
                text-[7px]
                font-medium
                leading-[9px]
                text-[#718599]
              "
            >
              TechFlow
              <br />
              Inc
            </span>
          </div>

          {/* Description */}
          <p
            className="
              mt-[7px]
              text-[8px]
              font-medium
              leading-[12px]
              text-[#718599]
            "
          >
            Approaching API limits. Predictive
            model suggests 85% probability of
            upgrading if pitched now.
          </p>
        </div>

        {/* =================================================
            VIEW ALL INSIGHTS
        ================================================== */}
        <button
          type="button"
          className="
            flex
            h-[25px]
            w-full
            items-center
            justify-center
            gap-[5px]
            rounded-[5px]
            border
            border-[#D8E2EA]
            bg-white
            text-[7px]
            font-semibold
            text-[#173B5C]
            shadow-[0_1px_2px_rgba(16,47,74,0.02)]
            transition-all
            duration-200
            hover:bg-[#F7F9FC]
            hover:border-[#C5D3DF]
          "
        >
          <ArrowUpRight
            size={10}
            strokeWidth={2}
          />

          View All Insights
        </button>

      </div>
    </Card>
  );
};

export default CustomerHealthIntelligence;