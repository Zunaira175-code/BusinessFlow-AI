import { useState } from "react";

import NotificationsPageHeader from "../../components/EmployeeNotifications/NotificationsPageHeader";
import NotificationStats from "../../components/EmployeeNotifications/NotificationStats";
import NotificationFilters from "../../components/EmployeeNotifications/NotificationFilters";
import MyNotifications from "../../components/EmployeeNotifications/MyNotifications";
import UpcomingReminders from "../../components/EmployeeNotifications/UpcomingReminders";
import NotificationPreferences from "../../components/EmployeeNotifications/NotificationPreferences";

const EmployeeNotifications = () => {
  // ===================================================
  // FILTER STATE
  // ===================================================

  const [search, setSearch] = useState("");

  const [type, setType] = useState("all");

  const [status, setStatus] = useState("all");

  const [date, setDate] = useState("week");

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="w-full">
      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <NotificationsPageHeader
        onMarkAllRead={() => {
          console.log(
            "All notifications marked as read"
          );
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
          grid-cols-1
          items-start
          gap-3
          xl:grid-cols-[1.65fr_0.75fr]
        "
      >
        {/* =======================================
            LEFT
        ======================================== */}

        <div className="min-w-0">
          <NotificationFilters
            search={search}
            setSearch={setSearch}
            type={type}
            setType={setType}
            status={status}
            setStatus={setStatus}
            date={date}
            setDate={setDate}
          />

          <div className="mt-4">
            <MyNotifications
              search={search}
              type={type}
              status={status}
              date={date}
            />
          </div>
        </div>

        {/* =======================================
            RIGHT
        ======================================== */}

        <div className="min-w-0 space-y-4">
          <UpcomingReminders />

          <NotificationPreferences />
        </div>
      </div>
    </div>
  );
};

export default EmployeeNotifications;