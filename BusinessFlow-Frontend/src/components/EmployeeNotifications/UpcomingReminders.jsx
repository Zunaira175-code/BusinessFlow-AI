import { useCallback, useEffect, useState } from "react";
import { AlarmClock, AlertCircle } from "lucide-react";

// =====================================================
// API
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// =====================================================
// AUTH TOKEN
// =====================================================

const getAuthToken = () => {
  return localStorage.getItem("businessflow_token");
};

// =====================================================
// DOT COLORS
// =====================================================

const getReminderDot = (type) => {
  switch (String(type || "").toLowerCase()) {
    case "task":
      return "bg-[#F08A00]";

    case "meeting":
      return "bg-[#168AD0]";

    case "lead":
      return "bg-[#16A05D]";

    case "deal":
      return "bg-[#7B8D9D]";

    default:
      return "bg-[#60758A]";
  }
};

// =====================================================
// FORMAT DATE / TIME
// =====================================================

const formatReminderTime = (date) => {
  if (!date) {
    return "";
  }

  const reminderDate = new Date(date);

  if (Number.isNaN(reminderDate.getTime())) {
    return "";
  }

  const now = new Date();

  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  const reminderDay = new Date(
    reminderDate.getFullYear(),
    reminderDate.getMonth(),
    reminderDate.getDate()
  );

  const time = reminderDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  if (reminderDay.getTime() === todayStart.getTime()) {
    return time;
  }

  if (reminderDay.getTime() === tomorrowStart.getTime()) {
    return `Tomorrow • ${time}`;
  }

  return reminderDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

// =====================================================
// FORMAT REMINDER
// =====================================================

const formatReminder = (item) => {
  const type = String(item?.type || "").toLowerCase();

  return {
    ...item,

    title:
      item?.title ||
      item?.name ||
      "Reminder",

    company:
      item?.company ||
      item?.companyName ||
      item?.customerName ||
      "",

    time:
      item?.time ||
      formatReminderTime(
        item?.dueAt ||
          item?.startAt ||
          item?.date
      ),

    dot: getReminderDot(type),
  };
};

// =====================================================
// SKELETON
// =====================================================

const ReminderSkeleton = () => {
  return (
    <div className="flex items-start gap-2.5 py-1.5">
      <span
        className="
          mt-[4px]
          h-[5px]
          w-[5px]
          shrink-0
          animate-pulse
          rounded-full
          bg-[#DCE5ED]
        "
      />

      <div className="min-w-0 flex-1">
        <div className="h-[7px] w-[85px] animate-pulse rounded bg-[#E8EEF3]" />

        <div className="mt-[3px] h-[6px] w-[130px] animate-pulse rounded bg-[#EEF2F5]" />
      </div>
    </div>
  );
};

// =====================================================
// EMPTY STATE
// =====================================================

const EmptyReminders = () => {
  return (
    <div className="flex min-h-[100px] flex-col items-center justify-center px-4 text-center">
      <AlarmClock
        size={18}
        strokeWidth={1.7}
        className="text-[#9AAAB8]"
      />

      <p className="mt-2 text-[8px] font-semibold text-[#17324D]">
        No upcoming reminders
      </p>

      <p className="mt-1 text-[7px] text-[#7A8B9A]">
        You have no upcoming reminders right now.
      </p>
    </div>
  );
};

// =====================================================
// ERROR STATE
// =====================================================

const ErrorState = ({
  message,
  onRetry,
}) => {
  return (
    <div className="flex min-h-[100px] flex-col items-center justify-center px-4 text-center">
      <div
        className="
          flex
          h-[30px]
          w-[30px]
          items-center
          justify-center
          rounded-full
          bg-[#FFF1F1]
          text-[#D84A4A]
        "
      >
        <AlertCircle
          size={14}
          strokeWidth={1.8}
        />
      </div>

      <p className="mt-2 text-[8px] font-semibold text-[#17324D]">
        Unable to load reminders
      </p>

      <p className="mt-1 max-w-[190px] text-[7px] text-[#7A8B9A]">
        {message ||
          "Something went wrong while loading reminders."}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="
          mt-2
          rounded-[3px]
          border
          border-[#C9D8E5]
          bg-white
          px-3
          py-[4px]
          text-[7px]
          font-semibold
          text-[#17324D]
          hover:bg-[#F5F8FB]
        "
      >
        Try Again
      </button>
    </div>
  );
};

// =====================================================
// UPCOMING REMINDERS
// =====================================================

const UpcomingReminders = () => {
  const [reminders, setReminders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ===================================================
  // FETCH REMINDERS
  // ===================================================

  const fetchReminders = useCallback(async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/notifications/reminders`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to load upcoming reminders."
        );
      }

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "Unable to load upcoming reminders."
        );
      }

      const apiReminders = Array.isArray(
        result?.data
      )
        ? result.data
        : [];

      setReminders(
        apiReminders.map(formatReminder)
      );
    } catch (fetchError) {
      console.error(
        "Fetch Upcoming Reminders Error:",
        fetchError
      );

      setError(
        fetchError?.message ||
          "Unable to load upcoming reminders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  // ===================================================
  // VIEW CALENDAR
  // ===================================================

  const handleViewCalendar = () => {
    window.location.href = "/employee/calendar";
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <section
      className="
        overflow-hidden
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
      "
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          flex
          h-[52px]
          items-center
          gap-2
          border-b
          border-[#DCE5ED]
          px-4
        "
      >
        <AlarmClock
          size={14}
          strokeWidth={1.8}
          className="text-[#60758A]"
        />

        <h2 className="text-[13px] font-bold text-[#17324D]">
          Upcoming Reminders
        </h2>
      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="px-4 py-3">
          <ReminderSkeleton />
          <ReminderSkeleton />
          <ReminderSkeleton />
          <ReminderSkeleton />
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading && error && (
        <ErrorState
          message={error}
          onRetry={fetchReminders}
        />
      )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        !error &&
        reminders.length === 0 && (
          <EmptyReminders />
        )}

      {/* =================================================
          ITEMS
      ================================================= */}

      {!loading &&
        !error &&
        reminders.length > 0 && (
          <div className="px-4 py-3">
            {reminders.map(
              (item, index) => (
                <div
                  key={
                    item.id ||
                    item._id ||
                    `${item.title}-${index}`
                  }
                  className="
                    relative
                    flex
                    items-start
                    gap-2.5
                    py-1.5
                  "
                >
                  <span
                    className={`
                      mt-[4px]
                      h-[5px]
                      w-[5px]
                      shrink-0
                      rounded-full
                      ${item.dot}
                    `}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-[8px] font-semibold text-[#17324D]">
                      {item.title}
                    </p>

                    <p className="mt-[2px] text-[7px] text-[#718599]">
                      {item.company
                        ? `${item.company} • `
                        : ""}
                      {item.time}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}

      {/* =================================================
          FOOTER
      ================================================= */}

      <button
        type="button"
        onClick={handleViewCalendar}
        className="
          flex
          h-[32px]
          w-full
          items-center
          justify-center
          border-t
          border-[#DCE5ED]
          bg-[#FBFCFD]
          text-[8px]
          font-semibold
          text-[#17324D]
          hover:bg-[#F5F8FB]
        "
      >
        View My Calendar →
      </button>
    </section>
  );
};

export default UpcomingReminders;