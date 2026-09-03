import SettingsHeader from "../../components/Settings/SettingsHeader";
import SettingsTabs from "../../components/Settings/SettingsTabs";

import AIAssistant from "../../components/Settings/AIAssistant";
import AIBehavior from "../../components/Settings/AIBehavior";
import AIAutomation from "../../components/Settings/AIAutomation";
import AIDataPrivacy from "../../components/Settings/AIDataPrivacy";

const AIPreferences = () => {
  return (
    <main className="w-full pb-8">

      {/* =================================================
          SETTINGS HEADER
      ================================================== */}

      <SettingsHeader />


      {/* =================================================
          SETTINGS TABS
      ================================================== */}

      <SettingsTabs />


      {/* =================================================
          AI PREFERENCES CONTENT
      ================================================== */}

      <div className="mt-4 space-y-4">

        {/* =================================================
            AI ASSISTANT
        ================================================== */}

        <AIAssistant />


        {/* =================================================
            AI BEHAVIOR
        ================================================== */}

        <AIBehavior />


        {/* =================================================
            AI AUTOMATION
        ================================================== */}

        <AIAutomation />


        {/* =================================================
            AI DATA & PRIVACY
        ================================================== */}

        <AIDataPrivacy />

      </div>

    </main>
  );
};

export default AIPreferences;