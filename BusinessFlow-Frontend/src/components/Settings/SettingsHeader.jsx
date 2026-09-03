import { useLocation } from "react-router-dom";

const settingsPages = {
  "/admin/settings": {
    title: "General Settings",
    description:
      "Manage your workspace information and default preferences.",
  },

  "/admin/settings/account": {
    title: "Account Settings",
    description:
      "Manage your account information and preferences.",
  },

  "/admin/settings/team": {
    title: "Team Settings",
    description:
      "Manage your team members and access.",
  },

  "/admin/settings/notifications": {
    title: "Notification Settings",
    description:
      "Manage your notification preferences and alerts.",
  },

  "/admin/settings/security": {
    title: "Security Settings",
    description:
      "Manage your workspace security and authentication.",
  },

  "/admin/settings/integrations": {
    title: "Integration Settings",
    description:
      "Manage your connected applications and integrations.",
  },

  "/admin/settings/ai-preferences": {
    title: "AI Preferences",
    description:
      "Manage your AI preferences and workspace intelligence.",
  },

  "/admin/settings/billing": {
    title: "Billing Settings",
    description:
      "Manage your subscription, billing information, and usage.",
  },
};

const SettingsHeader = () => {
  const location = useLocation();

  const currentPage =
    settingsPages[location.pathname] || settingsPages["/admin/settings"];

  return (
    <section className="w-full">
      <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.5px] text-[#071D35]">
        {currentPage.title}
      </h1>

      <p className="mt-[4px] text-[11px] leading-[17px] text-[#60758A]">
        {currentPage.description}
      </p>
    </section>
  );
};

export default SettingsHeader;