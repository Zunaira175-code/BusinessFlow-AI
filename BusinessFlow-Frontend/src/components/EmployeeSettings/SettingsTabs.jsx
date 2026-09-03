import { useState } from "react";

const tabs = [
  "General",
  "Account",
  "Notifications",
  "Security",
];

const SettingsTabs = () => {
  const [activeTab, setActiveTab] = useState("General");

  return (
    <div
      className="
        mt-3
        flex
        h-[36px]
        items-end
        gap-6
        border-b
        border-[#DCE5ED]
      "
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`
              relative
              h-[36px]
              text-[9px]
              font-medium
              transition-colors
              ${
                isActive
                  ? "text-[#071D35]"
                  : "text-[#60758A] hover:text-[#17324D]"
              }
            `}
          >
            {tab}

            {isActive && (
              <span
                className="
                  absolute
                  bottom-[-1px]
                  left-0
                  right-0
                  h-[2px]
                  bg-[#071D35]
                "
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SettingsTabs;