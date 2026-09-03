import { useState } from "react";
import { Bot, Check } from "lucide-react";

import Card from "../common/Card";

/* =========================================================
   AI ASSISTANT
========================================================= */

const AIAssistant = () => {
  const [settings, setSettings] = useState({
    aiAssistant: true,
    smartSuggestions: true,
    automaticInsights: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const items = [
    {
      key: "aiAssistant",
      title: "AI Assistant",
      description:
        "Enable the core AI assistant across the workspace.",
    },
    {
      key: "smartSuggestions",
      title: "Smart Suggestions",
      description:
        "Receive proactive workflow and content suggestions.",
    },
    {
      key: "automaticInsights",
      title: "Automatic Insights",
      description:
        "Generate summaries and insights on record views.",
    },
  ];

  return (
    <Card className="w-full overflow-hidden">

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
        <Bot
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
          AI Assistant
        </h2>
      </div>


      {/* =================================================
          SETTINGS
      ================================================== */}

      <div className="px-4">

        {items.map((item, index) => {
          const enabled = settings[item.key];

          return (
            <div
              key={item.key}
              className={`
                flex
                min-h-[60px]
                items-center
                justify-between
                gap-4
                py-3
                ${
                  index !== items.length - 1
                    ? "border-b border-[#E2E9EF]"
                    : ""
                }
              `}
            >

              {/* =================================================
                  TEXT
              ================================================== */}

              <div className="min-w-0">

                <h3
                  className="
                    text-[9px]
                    font-semibold
                    text-[#17324D]
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-1
                    text-[8px]
                    leading-[12px]
                    text-[#60758A]
                  "
                >
                  {item.description}
                </p>

              </div>


              {/* =================================================
                  TOGGLE
              ================================================== */}

              <button
                type="button"
                aria-label={`Toggle ${item.title}`}
                aria-pressed={enabled}
                onClick={() =>
                  toggleSetting(item.key)
                }
                className={`
                  relative
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
                    <Check
                      size={9}
                      strokeWidth={3}
                      className="text-[#2563EB]"
                    />
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

export default AIAssistant;