import { useState } from "react";
import {
  Zap,
  UserCheck,
  Mail,
  ShieldAlert,
  Lightbulb,
} from "lucide-react";

import Card from "../common/Card";

const automationItems = [
  {
    key: "leadQualification",
    title: "Lead Qualification",
    description:
      "Automatically score and categorize incoming leads based on historical data.",
    icon: UserCheck,
  },
  {
    key: "followUpSuggestions",
    title: "Follow-up Suggestions",
    description:
      "Draft contextual emails and reminders for stalled deals.",
    icon: Mail,
  },
  {
    key: "dealRiskDetection",
    title: "Deal Risk Detection",
    description:
      "Flag pipelines with low engagement or sentiment drops.",
    icon: ShieldAlert,
  },
  {
    key: "customerInsights",
    title: "Customer Insights",
    description:
      "Extract key talking points from call transcripts.",
    icon: Lightbulb,
  },
];

const AIAutomation = () => {
  const [automation, setAutomation] = useState({
    leadQualification: true,
    followUpSuggestions: true,
    dealRiskDetection: true,
    customerInsights: true,
  });

  const toggleAutomation = (key) => {
    setAutomation((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Card className="mt-4 w-full overflow-hidden">

      {/* =================================================
          HEADER
      ================================================== */}

      <div
        className="
          flex
          items-center
          gap-2
          border-b
          border-[#DCE5ED]
          px-4
          py-3
        "
      >
        <Zap
          size={14}
          strokeWidth={1.8}
          className="text-[#173B5C]"
        />

        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          AI Automation
        </h2>
      </div>


      {/* =================================================
          AUTOMATION GRID
      ================================================== */}

      <div className="grid grid-cols-2 gap-x-6 gap-y-1 px-4 py-3">

        {automationItems.map((item) => {
          const Icon = item.icon;
          const enabled = automation[item.key];

          return (
            <div
              key={item.key}
              className="
                flex
                min-h-[70px]
                items-start
                justify-between
                gap-4
                py-2
              "
            >

              {/* =================================================
                  LEFT CONTENT
              ================================================== */}

              <div className="flex min-w-0 gap-2">

                {/* Icon */}
                <div
                  className="
                    mt-0.5
                    flex
                    h-[25px]
                    w-[25px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[6px]
                    bg-[#F5F8FB]
                    text-[#315D80]
                  "
                >
                  <Icon
                    size={13}
                    strokeWidth={1.8}
                  />
                </div>

                {/* Text */}
                <div className="min-w-0">

                  <p
                    className="
                      text-[9px]
                      font-semibold
                      text-[#17324D]
                    "
                  >
                    {item.title}
                  </p>

                  <p
                    className="
                      mt-1
                      max-w-[250px]
                      text-[8px]
                      leading-[12px]
                      text-[#718599]
                    "
                  >
                    {item.description}
                  </p>

                </div>

              </div>


              {/* =================================================
                  TOGGLE
              ================================================== */}

              <button
                type="button"
                aria-label={`Toggle ${item.title}`}
                aria-pressed={enabled}
                onClick={() => toggleAutomation(item.key)}
                className={`
                  relative
                  mt-1
                  h-[18px]
                  w-[32px]
                  shrink-0
                  rounded-full
                  transition-colors
                  duration-200
                  ${
                    enabled
                      ? "bg-[#0B3D6B]"
                      : "bg-[#D5DEE7]"
                  }
                `}
              >
                <span
                  className={`
                    absolute
                    top-[2px]
                    flex
                    h-[14px]
                    w-[14px]
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    shadow-sm
                    transition-transform
                    duration-200
                    ${
                      enabled
                        ? "translate-x-[16px]"
                        : "translate-x-[2px]"
                    }
                  `}
                >
                  {enabled && (
                    <span
                      className="
                        text-[8px]
                        font-bold
                        text-[#2563EB]
                      "
                    >
                      ✓
                    </span>
                  )}
                </span>
              </button>

            </div>
          );
        })}

      </div>

    </Card>
  );
};

export default AIAutomation;