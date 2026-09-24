import SettingsHeader from "../../components/Settings/SettingsHeader";
import SettingsTabs from "../../components/Settings/SettingsTabs";
import GeneralSettingsForm from "../../components/Settings/GeneralSettingsForm";


const Settings = () => {
  return (
    <main className="w-full">

      {/* Page Header */}
      <SettingsHeader />

      {/* Settings Tabs */}
      <SettingsTabs />

      {/* General Settings */}
      <GeneralSettingsForm />

      

    </main>
  );
};

export default Settings;