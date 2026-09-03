import SettingsHeader from "../../components/Settings/SettingsHeader";
import SettingsTabs from "../../components/Settings/SettingsTabs";

import ConnectedIntegrations from "../../components/Settings/ConnectedIntegrations";
import AvailableIntegrations from "../../components/Settings/AvailableIntegrations";
import ApiWebhooks from "../../components/Settings/ApiWebhooks";

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

        {/* API & Webhooks */}
        <ApiWebhooks />

      </div>
    </main>
  );
};

export default Integrations;