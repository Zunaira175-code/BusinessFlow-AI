import { Bot, AlertTriangle, GitBranch, Target } from "lucide-react";

import Card from "../common/Card";

const analytics = [
  {
    title: "Deals at Risk",
    heading: "1 Deal Needs Attention",
    description:
      "Cyberdyne Systems has stalled in Proposal phase for 14 days. Probability dropped by 12%.",
    icon: AlertTriangle,
    iconClass:
      "bg-[#FFE9E9] text-[#FF3B30] border border-[#FFD1D1]",
    iconSize: 17,
  },
  {
    title: "Top Conversion Path",
    heading: "Inbound > Webinar",
    description:
      "Leads originating from technical webinars close 24% faster this quarter.",
    icon: GitBranch,
    iconClass:
      "bg-[#E5F0FF] text-[#174A78] border border-[#D4E5FA]",
    iconSize: 17,
  },
  {
    title: "Forecast Accuracy",
    heading: "92% Confidence",
    description:
      "AI predicts you will hit $1.2M closed-won by end of Q3 based on current velocity.",
    icon: Target,
    iconClass:
      "bg-[#E5F0FF] text-[#174A78] border border-[#D4E5FA]",
    iconSize: 17,
  },
];

const AIPipelineAnalytics = () => {
  return (
    <section className="mt-[45px] w-full">

      {/* Section Heading */}
      <div className="mb-[16px] flex items-center gap-[7px]">
        <Bot
          size={16}
          strokeWidth={2}
          className="text-[#0B3D6B]"
        />

        <h2
          className="
            text-[14px]
            font-semibold
            leading-[20px]
            text-[#102F4A]
          "
        >
          AI Pipeline Analytics
        </h2>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-3">

        {analytics.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="
                relative
                min-h-[137px]
                overflow-hidden
                rounded-[8px]
                border
                border-[#CFE1F2]
                border-l-[3px]
                border-l-[#009FE3]
                bg-white
                px-[12px]
                py-[13px]
                shadow-none
              "
            >
              {/* Card Title */}
              <p
                className="
                  text-[12px]
                  font-medium
                  leading-[17px]
                  text-[#62788D]
                "
              >
                {item.title}
              </p>

              {/* Content */}
              <div className="mt-[10px] flex items-start gap-[12px]">

                {/* Icon */}
                <div
                  className={`
                    mt-[3px]
                    flex
                    h-[33px]
                    w-[22px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[11px]
                    ${item.iconClass}
                  `}
                >
                  <Icon
                    size={item.iconSize}
                    strokeWidth={1.8}
                  />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <h3
                    className="
                      text-[12px]
                      font-medium
                      leading-[17px]
                      text-[#173B5C]
                    "
                  >
                    {item.heading}
                  </h3>

                  <p
                    className="
                      mt-[2px]
                      text-[12px]
                      font-medium
                      leading-[17px]
                      text-[#5F7488]
                    "
                  >
                    {item.description}
                  </p>
                </div>

              </div>
            </Card>
          );
        })}

      </div>
    </section>
  );
};

export default AIPipelineAnalytics;