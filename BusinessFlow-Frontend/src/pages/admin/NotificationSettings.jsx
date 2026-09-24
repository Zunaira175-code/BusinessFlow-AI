import { useRef, useState } from "react";
import SettingsHeader from "../../components/Settings/SettingsHeader";
import SettingsTabs from "../../components/Settings/SettingsTabs";

import EmailNotifications from "../../components/Settings/EmailNotifications";

const NotificationSettings = () => {
  const notificationRef = useRef(null);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!notificationRef.current) return;

    setSaving(true);

    try {
      await notificationRef.current.saveSettings();
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!notificationRef.current) return;

    notificationRef.current.cancelSettings();
  };

  return (
    <main className="w-full pb-8">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <SettingsHeader />

      {/* =====================================================
          TABS
      ====================================================== */}

      <SettingsTabs />

      {/* =====================================================
          NOTIFICATION CONTENT
      ====================================================== */}

      <div className="mt-4">
        <EmailNotifications ref={notificationRef} />
      </div>

      {/* =====================================================
          ACTIONS
      ====================================================== */}

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
        {/* CANCEL */}

        <button
          type="button"
          onClick={handleCancel}
          disabled={saving}
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
            transition-colors
            hover:bg-[#F7F9FB]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          Cancel
        </button>

        {/* SAVE */}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="
            h-[32px]
            rounded-[6px]
            bg-[#0B3D6B]
            px-4
            text-[10px]
            font-semibold
            text-white
            transition-colors
            hover:bg-[#092F54]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </main>
  );
};

export default NotificationSettings;