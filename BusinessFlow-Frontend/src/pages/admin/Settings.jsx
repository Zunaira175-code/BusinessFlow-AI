import SettingsHeader from "../../components/Settings/SettingsHeader";
import SettingsTabs from "../../components/Settings/SettingsTabs";
import GeneralSettingsForm from "../../components/Settings/GeneralSettingsForm";
import BillingPlan from "../../components/Settings/BillingPlan";

const Settings = () => {
  return (
    <main className="w-full">

      {/* Page Header */}
      <SettingsHeader />

      {/* Settings Tabs */}
      <SettingsTabs />

      {/* General Settings */}
      <GeneralSettingsForm />

      {/* Billing & Plan */}
      <div className="mt-5">
        <BillingPlan />
      </div>

    </main>
  );
};

export default Settings;