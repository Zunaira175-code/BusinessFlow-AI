import SettingsHeader from "../../components/Settings/SettingsHeader";
import SettingsTabs from "../../components/Settings/SettingsTabs";
import SecuritySettings from "../../components/Settings/SecuritySettings";

const SecuritySettingsPage = () => {
  return (
    <main className="w-full">
      <SettingsHeader />

      <SettingsTabs />

      <SecuritySettings />
    </main>
  );
};

export default SecuritySettingsPage;