import NotificationsPageHeader from "../../components/EmployeeNotifications/NotificationsPageHeader";
import NotificationStats from "../../components/EmployeeNotifications/NotificationStats";
import NotificationFilters from "../../components/EmployeeNotifications/NotificationFilters";
import MyNotifications from "../../components/EmployeeNotifications/MyNotifications";
import UpcomingReminders from "../../components/EmployeeNotifications/UpcomingReminders";
import NotificationPreferences from "../../components/EmployeeNotifications/NotificationPreferences";

const EmployeeNotifications = () => {
  return (
    <div className="w-full">

      {/* =========================================
          PAGE HEADER
      ========================================= */}
      <NotificationsPageHeader
        onMarkAllRead={() => {
          console.log("All notifications marked as read");
        }}
      />

      {/* =========================================
          STATS
      ========================================= */}
      <div className="mt-4">
        <NotificationStats />
      </div>

      {/* =========================================
          MAIN CONTENT
      ========================================= */}
      <div
        className="
          mt-4
          grid
          w-full
          grid-cols-[1.65fr_0.75fr]
          gap-3
          items-start
        "
      >

        {/* LEFT */}
        <div className="min-w-0">
          <NotificationFilters />

          <div className="mt-4">
            <MyNotifications />
          </div>
        </div>

        {/* RIGHT */}
        <div className="min-w-0 space-y-4">
          <UpcomingReminders />

          <NotificationPreferences />
        </div>

      </div>

    </div>
  );
};

export default EmployeeNotifications;