import SettingsHeader from "../../components/Settings/SettingsHeader";
import SettingsTabs from "../../components/Settings/SettingsTabs";

import ProfileInformation from "../../components/Settings/ProfileInformation";
import ProfilePreferences from "../../components/Settings/ProfilePreferences";

const AccountSettings = () => {
  return (
    <main className="w-full pb-8">

      {/* Settings Header */}
      <SettingsHeader />

      {/* Settings Navigation */}
      <SettingsTabs />

      {/* Account Content */}
      <div className="mt-4">

        {/* Profile Information */}
        <ProfileInformation />

        {/* Profile Preferences */}
        <ProfilePreferences />

      </div>

    </main>
  );
};

export default AccountSettings;