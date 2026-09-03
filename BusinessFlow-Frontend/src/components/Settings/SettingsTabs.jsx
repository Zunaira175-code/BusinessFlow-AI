import { NavLink } from "react-router-dom";

const tabs = [
  {
    label: "General",
    path: "/admin/settings",
  },
  {
    label: "Account",
    path: "/admin/settings/account",
  },
  {
    label: "Team",
    path: "/admin/settings/team",
  },
  {
    label: "Notifications",
    path: "/admin/settings/notifications",
  },
  {
    label: "Security",
    path: "/admin/settings/security",
  },
  {
    label: "Integrations",
    path: "/admin/settings/integrations",
  },
  {
    label: "AI Preferences",
    path: "/admin/settings/ai-preferences",
  },
  {
    label: "Billing",
    path: "/admin/settings/billing",
  },
];

const SettingsTabs = () => {
  return (
    <div className="mt-6 flex h-[42px] w-full items-end border-b border-[#DCE5EF]">
      {tabs.map((tab) => (
        <NavLink
          key={tab.label}
          to={tab.path}
          end={tab.path === "/admin/settings"}
          className={({ isActive }) =>
            `relative flex h-[42px] items-center px-4 text-[14px] font-medium transition-colors ${
              isActive
                ? "font-semibold text-[#071D35]"
                : "text-[#60758A] hover:text-[#071D35]"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {tab.label === "AI Preferences" && (
                <span className="mr-1 text-[#8BCBFF]">
                  ✦
                </span>
              )}

              {tab.label}

              {/* Active underline */}
              {isActive && (
                <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#071D35]" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default SettingsTabs;