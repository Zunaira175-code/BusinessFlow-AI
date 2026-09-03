import SettingsPageHeader from "../../components/EmployeeSettings/SettingsPageHeader";
import SettingsTabs from "../../components/EmployeeSettings/SettingsTabs";
import PersonalInformation from "../../components/EmployeeSettings/PersonalInformation";
import RegionalDisplay from "../../components/EmployeeSettings/RegionalDisplay";

const EmployeeSettings = () => {
  const handleSignOut = () => {
    console.log("Sign out clicked");
  };

  return (
    <div className="w-full">

      {/* =========================================
          HEADER
      ========================================= */}
      <SettingsPageHeader />

      {/* =========================================
          TABS
      ========================================= */}
      <SettingsTabs />

      {/* =========================================
          PERSONAL INFORMATION
      ========================================= */}
      <PersonalInformation />

      {/* =========================================
          REGIONAL & DISPLAY
      ========================================= */}
      <RegionalDisplay />

      {/* =========================================
          SIGN OUT
      ========================================= */}
      <div className="flex justify-center py-7">
        <button
          type="button"
          onClick={handleSignOut}
          className="
            text-[9px]
            font-medium
            text-[#E53935]
            transition
            hover:text-[#C62828]
          "
        >
          ⇥ Sign Out
        </button>
      </div>

    </div>
  );
};

export default EmployeeSettings;