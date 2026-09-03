import { useState } from "react";
import { Brain, ChevronDown } from "lucide-react";

import Card from "../common/Card";

const AIBehavior = () => {
  const [settings, setSettings] = useState({
    responseStyle: "Professional",
    responseLanguage: "English (US)",
    creativity: 50,
  });

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
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
        <Brain
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
          AI Behavior
        </h2>
      </div>


      {/* =================================================
          CONTENT
      ================================================== */}

      <div className="px-4 pb-4 pt-3">

        {/* =================================================
            RESPONSE STYLE + LANGUAGE
        ================================================== */}

        <div className="grid grid-cols-2 gap-4">

          {/* Response Style */}
          <div>

            <label
              className="
                mb-1.5
                block
                text-[9px]
                font-semibold
                text-[#17324D]
              "
            >
              Response Style
            </label>

            <div className="relative">

              <select
                value={settings.responseStyle}
                onChange={(e) =>
                  handleChange(
                    "responseStyle",
                    e.target.value
                  )
                }
                className="
                  h-[32px]
                  w-full
                  appearance-none
                  rounded-[6px]
                  border
                  border-[#DCE5ED]
                  bg-white
                  px-3
                  pr-8
                  text-[9px]
                  text-[#29465F]
                  outline-none
                  focus:border-[#8DA9C0]
                "
              >
                <option>Professional</option>
                <option>Friendly</option>
                <option>Concise</option>
                <option>Detailed</option>
              </select>

              <ChevronDown
                size={12}
                strokeWidth={1.8}
                className="
                  pointer-events-none
                  absolute
                  right-2.5
                  top-1/2
                  -translate-y-1/2
                  text-[#657C90]
                "
              />

            </div>

          </div>


          {/* Response Language */}
          <div>

            <label
              className="
                mb-1.5
                block
                text-[9px]
                font-semibold
                text-[#17324D]
              "
            >
              Response Language
            </label>

            <div className="relative">

              <select
                value={settings.responseLanguage}
                onChange={(e) =>
                  handleChange(
                    "responseLanguage",
                    e.target.value
                  )
                }
                className="
                  h-[32px]
                  w-full
                  appearance-none
                  rounded-[6px]
                  border
                  border-[#DCE5ED]
                  bg-white
                  px-3
                  pr-8
                  text-[9px]
                  text-[#29465F]
                  outline-none
                  focus:border-[#8DA9C0]
                "
              >
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>

              <ChevronDown
                size={12}
                strokeWidth={1.8}
                className="
                  pointer-events-none
                  absolute
                  right-2.5
                  top-1/2
                  -translate-y-1/2
                  text-[#657C90]
                "
              />

            </div>

          </div>

        </div>


        {/* =================================================
            AI CREATIVITY
        ================================================== */}

        <div className="mt-4">

          <div className="flex items-center justify-between">

            <label
              className="
                text-[9px]
                font-semibold
                text-[#17324D]
              "
            >
              AI Creativity
            </label>

            <span
              className="
                rounded-[4px]
                border
                border-[#DCE5ED]
                bg-[#F7F9FC]
                px-2
                py-1
                text-[8px]
                font-medium
                text-[#60758A]
              "
            >
              Balanced
            </span>

          </div>


          {/* Slider */}
          <div className="relative mt-3">

            <input
              type="range"
              min="0"
              max="100"
              value={settings.creativity}
              onChange={(e) =>
                handleChange(
                  "creativity",
                  Number(e.target.value)
                )
              }
              className="
                h-[3px]
                w-full
                cursor-pointer
                appearance-none
                rounded-full
                bg-[#DCE5ED]
                accent-[#0B3D6B]
              "
            />

          </div>


          {/* Slider Labels */}
          <div
            className="
              mt-1
              flex
              items-center
              justify-between
              text-[8px]
              text-[#718599]
            "
          >
            <span>
              Precise / Factual
            </span>

            <span>
              Creative / Expansive
            </span>
          </div>

        </div>

      </div>

    </Card>
  );
};

export default AIBehavior;