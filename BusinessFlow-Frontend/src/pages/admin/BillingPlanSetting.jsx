import SettingsHeader from "../../components/Settings/SettingsHeader";
import SettingsTabs from "../../components/Settings/SettingsTabs";

import BillingCurrentPlan from "../../components/Settings/BillingCurrentPlan";
import BillingUsageOverview from "../../components/Settings/BillingUsageOverview";
import AvailablePlans from "../../components/Settings/AvailablePlans";
import BillingInformation from "../../components/Settings/BillingInformation";
import BillingHistory from "../../components/Settings/BillingHistory";

const BillingPlan = () => {
  return (
    <main className="w-full">

      {/* Existing Settings Header */}
      <SettingsHeader />

      {/* Existing Settings Tabs */}
      <SettingsTabs />

      {/* Current Plan + Usage */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <BillingCurrentPlan />
        <BillingUsageOverview />
      </div>

      {/* Available Plans */}
      <AvailablePlans />

      {/* Billing Information + History */}
      <div className="mt-[18px] grid grid-cols-2 gap-4">
        <BillingInformation />
        <BillingHistory />
      </div>

    </main>
  );
};

export default BillingPlan;