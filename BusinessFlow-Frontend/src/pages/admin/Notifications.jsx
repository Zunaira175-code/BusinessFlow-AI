import NotificationsHeader from "../../components/Notifications/NotificationsHeader";
import NotificationStats from "../../components/Notifications/NotificationStats";
import NotificationFilters from "../../components/Notifications/NotificationsFilter";
import UpcomingReminders from "../../components/Notifications/UpcomingReminders";
import MyNotifications from "../../components/Notifications/MyNotifications";
import NotificationPreferences from "../../components/Notifications/NotificationsPreferences";

const Notifications = () => {
  return (
    <main className="w-full">

      <NotificationsHeader />

      <div className="mt-5">
        <NotificationStats />
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_230px] gap-4">

        {/* LEFT COLUMN */}
        <div className="min-w-0">
          <NotificationFilters />

          <div className="mt-4">
            <MyNotifications />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          <UpcomingReminders />
          <NotificationPreferences />
        </div>

      </div>

    </main>
  );
};

export default Notifications;