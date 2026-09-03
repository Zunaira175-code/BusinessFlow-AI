import SettingsHeader from "../../components/Settings/SettingsHeader";
import SettingsTabs from "../../components/Settings/SettingsTabs";

import TeamMembers from "../../components/Settings/TeamMembers";
import RolesPermissions from "../../components/Settings/RolesPermissions";

const TeamSettings = () => {
  return (
    <main className="w-full">

      {/* Existing Header */}
      <SettingsHeader />

      {/* Existing Tabs */}
      <SettingsTabs />

      {/* Team Members */}
      <div className="mt-4">
        <TeamMembers />
      </div>

      {/* Roles & Permissions */}
      <RolesPermissions />

    </main>
  );
};

export default TeamSettings;