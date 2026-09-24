import SettingsHeader from "../../components/Settings/SettingsHeader";
import SettingsTabs from "../../components/Settings/SettingsTabs";

import ProfileInformation from "../../components/Settings/ProfileInformation";

const AccountSettings = () => {
  return (
    <main className="w-full pb-8">
      <SettingsHeader />

      <SettingsTabs />

      <div className="mt-4">
        <ProfileInformation />
      </div>
    </main>
  );
};

export default AccountSettings;