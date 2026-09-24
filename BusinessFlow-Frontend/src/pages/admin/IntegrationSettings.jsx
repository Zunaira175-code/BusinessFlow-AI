import SettingsHeader from "../../components/Settings/SettingsHeader";
import SettingsTabs from "../../components/Settings/SettingsTabs";

import ConnectedIntegrations from "../../components/Settings/ConnectedIntegrations";
import AvailableIntegrations from "../../components/Settings/AvailableIntegrations";


const Integrations = () => {
  return (
    <main className="w-full">

      {/* =========================================
          SETTINGS HEADER
      ========================================== */}
      <SettingsHeader />

      {/* =========================================
          SETTINGS TABS
      ========================================== */}
      <SettingsTabs />

      {/* =========================================
          INTEGRATIONS CONTENT
      ========================================== */}
      <div className="mt-4 space-y-4">

        {/* Connected Integrations */}
        <ConnectedIntegrations />

        {/* Available Integrations */}
        <AvailableIntegrations />

       

      </div>
    </main>
  );
};

export default Integrations;