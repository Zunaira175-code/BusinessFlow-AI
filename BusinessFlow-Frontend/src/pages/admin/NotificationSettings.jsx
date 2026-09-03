import SettingsHeader from "../../components/Settings/SettingsHeader";
import SettingsTabs from "../../components/Settings/SettingsTabs";

import EmailNotifications from "../../components/Settings/EmailNotifications";
const NotificationSettings = () => {
  return (
    <main className="w-full">
      {/* Header */}
      <SettingsHeader />

      {/* Tabs */}
      <SettingsTabs />

      {/* Content */}
      <div className="mt-4">
        <EmailNotifications />
      </div>

      {/* Actions */}
      <div
        className="
          mt-5
          flex
          justify-end
          gap-2
          border-t
          border-[#DCE5ED]
          pt-4
        "
      >
        <button
          type="button"
          className="
            h-[32px]
            rounded-[6px]
            border
            border-[#D8E2EA]
            bg-white
            px-4
            text-[10px]
            font-semibold
            text-[#29465F]
            hover:bg-[#F7F9FB]
          "
        >
          Cancel
        </button>

        <button
          type="button"
          className="
            h-[32px]
            rounded-[6px]
            bg-[#0B3D6B]
            px-4
            text-[10px]
            font-semibold
            text-white
            hover:bg-[#092F54]
          "
        >
          Save Changes
        </button>
      </div>
    </main>
  );
};

export default NotificationSettings;