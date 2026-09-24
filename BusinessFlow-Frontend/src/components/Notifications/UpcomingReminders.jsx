import { useCallback, useEffect, useState } from "react";

// =====================================================
// API CONFIG
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// =====================================================
// AUTH TOKEN
// =====================================================

const getAuthToken = () => {
  return (
    localStorage.getItem("businessflow_token") ||
    sessionStorage.getItem("businessflow_token") ||
    null
  );
};

// =====================================================
// FORMAT DATE / TIME
// =====================================================

const formatReminderTime = (dueAt) => {
  if (!dueAt) {
    return "";
  }

  const date = new Date(dueAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(
    tomorrowStart.getDate() + 1
  );

  const reminderDay = new Date(date);
  reminderDay.setHours(0, 0, 0, 0);

  const time = date.toLocaleTimeString(
    [],
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );

  // Today
  if (
    reminderDay.getTime() ===
    todayStart.getTime()
  ) {
    return time;
  }

  // Tomorrow
  if (
    reminderDay.getTime() ===
    tomorrowStart.getTime()
  ) {
    return `Tomorrow • ${time}`;
  }

  // Other date
  const dateText =
    date.toLocaleDateString(
      [],
      {
        month: "short",
        day: "numeric",
      }
    );

  return `${dateText} • ${time}`;
};

// =====================================================
// DOT COLOR
// =====================================================

const getDotClass = (type) => {
  if (type === "task") {
    return "bg-[#F59E0B]";
  }

  if (type === "meeting") {
    return "bg-[#168BE0]";
  }

  return "bg-[#8493A3]";
};

// =====================================================
// GET COMPANY / DESCRIPTION
// =====================================================

const getReminderCompany = (
  reminder
) => {
  // Backend can provide company in metadata
  if (
    reminder?.metadata?.company
  ) {
    return reminder.metadata.company;
  }

  if (
    reminder?.metadata?.companyName
  ) {
    return reminder.metadata.companyName;
  }

  // Fallback to message
  if (reminder?.message) {
    return reminder.message;
  }

  return "BusinessFlow AI";
};

// =====================================================
// UPCOMING REMINDERS
// =====================================================

const UpcomingReminders = () => {
  const [reminders, setReminders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ===================================================
  // FETCH REMINDERS
  // ===================================================

  const fetchReminders =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          getAuthToken();

        if (!token) {
          throw new Error(
            "Please login again."
          );
        }

        const response =
          await fetch(
            `${API_BASE_URL}/api/notifications/reminders`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },
            }
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result?.success
        ) {
          throw new Error(
            result?.message ||
              "Unable to load upcoming reminders."
          );
        }

        const data =
          Array.isArray(
            result?.data
          )
            ? result.data
            : [];

        setReminders(data);
      } catch (fetchError) {
        console.error(
          "Upcoming Reminders Error:",
          fetchError
        );

        setError(
          fetchError?.message ||
            "Unable to load upcoming reminders."
        );

        setReminders([]);
      } finally {
        setLoading(false);
      }
    }, []);

  // ===================================================
  // INITIAL FETCH
  // ===================================================

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  // ===================================================
  // LOADING STATE
  // ===================================================

  if (loading) {
    return (
      <section
        className="
          w-full
          overflow-hidden
          rounded-[10px]
          border
          border-[#DCE5EF]
          bg-white
        "
      >
        {/* Header */}

        <div
          className="
            flex
            h-[48px]
            items-center
            border-b
            border-[#E3EAF1]
            px-4
          "
        >
          <div className="flex items-center gap-2">
            {/* Clock Icon */}

            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[#516B82]"
            >
              <circle
                cx="12"
                cy="12"
                r="8"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <path
                d="M12 8V12L15 14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <h2
              className="
                text-[14px]
                font-bold
                text-[#102A43]
              "
            >
              Upcoming Reminders
            </h2>
          </div>
        </div>

        {/* Skeleton */}

        <div className="px-4 py-3">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="
                  flex
                  items-start
                  gap-2.5
                  py-2
                "
              >
                <span
                  className="
                    mt-[5px]
                    h-[5px]
                    w-[5px]
                    shrink-0
                    animate-pulse
                    rounded-full
                    bg-[#DCE5EF]
                  "
                />

                <div className="min-w-0 flex-1">
                  <div
                    className="
                      h-[10px]
                      w-[85px]
                      animate-pulse
                      rounded
                      bg-[#E8EEF3]
                    "
                  />

                  <div
                    className="
                      mt-1.5
                      h-[9px]
                      w-[125px]
                      animate-pulse
                      rounded
                      bg-[#EEF2F5]
                    "
                  />
                </div>
              </div>
            )
          )}
        </div>

        <div
          className="
            h-[31px]
            border-t
            border-[#E3EAF1]
            bg-[#F8FAFC]
          "
        />
      </section>
    );
  }

  // ===================================================
  // ERROR STATE
  // ===================================================

  if (error) {
    return (
      <section
        className="
          w-full
          overflow-hidden
          rounded-[10px]
          border
          border-[#DCE5EF]
          bg-white
        "
      >
        {/* Header */}

        <div
          className="
            flex
            h-[48px]
            items-center
            border-b
            border-[#E3EAF1]
            px-4
          "
        >
          <h2
            className="
              text-[14px]
              font-bold
              text-[#102A43]
            "
          >
            Upcoming Reminders
          </h2>
        </div>

        <div
          className="
            px-4
            py-5
          "
        >
          <p
            className="
              text-[9px]
              font-semibold
              text-[#17324D]
            "
          >
            Unable to load reminders
          </p>

          <p
            className="
              mt-1
              text-[8px]
              text-[#7A8B9A]
            "
          >
            {error}
          </p>

          <button
            type="button"
            onClick={
              fetchReminders
            }
            className="
              mt-3
              rounded-[5px]
              border
              border-[#C9D8E5]
              bg-white
              px-3
              py-1.5
              text-[8px]
              font-semibold
              text-[#173B5C]
              hover:bg-[#F1F5F9]
            "
          >
            Retry
          </button>
        </div>

        <button
          type="button"
          className="
            flex
            h-[31px]
            w-full
            items-center
            justify-center
            border-t
            border-[#E3EAF1]
            bg-[#F8FAFC]
            text-[9px]
            font-semibold
            text-[#173B5C]
          "
        >
          View My Calendar
          <span className="ml-1 text-[12px]">
            →
          </span>
        </button>
      </section>
    );
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <section
      className="
        w-full
        overflow-hidden
        rounded-[10px]
        border
        border-[#DCE5EF]
        bg-white
      "
    >
      {/* Header */}

      <div
        className="
          flex
          h-[48px]
          items-center
          border-b
          border-[#E3EAF1]
          px-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          {/* Clock Icon */}

          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#516B82]"
          >
            <circle
              cx="12"
              cy="12"
              r="8"
              stroke="currentColor"
              strokeWidth="1.8"
            />

            <path
              d="M12 8V12L15 14"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M5 4L3.5 5.5M19 4L20.5 5.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          <h2
            className="
              text-[14px]
              font-bold
              text-[#102A43]
            "
          >
            Upcoming Reminders
          </h2>
        </div>
      </div>

      {/* Reminder List */}

      <div className="px-4 py-2.5">
        {reminders.length === 0 ? (
          <div
            className="
              py-6
              text-center
            "
          >
            <p
              className="
                text-[9px]
                font-semibold
                text-[#516B82]
              "
            >
              No upcoming reminders
            </p>

            <p
              className="
                mt-1
                text-[8px]
                text-[#8A9AA8]
              "
            >
              Your upcoming tasks and meetings
              will appear here.
            </p>
          </div>
        ) : (
          reminders.map(
            (reminder, index) => (
              <div
                key={
                  reminder.id ||
                  reminder._id ||
                  `${reminder.type}-${index}`
                }
                className="
                  flex
                  items-start
                  gap-2.5
                  py-2
                "
              >
                {/* Dot */}

                <span
                  className={`
                    mt-[5px]
                    h-[5px]
                    w-[5px]
                    shrink-0
                    rounded-full
                    ${getDotClass(
                      reminder.type
                    )}
                  `}
                />

                {/* Content */}

                <div
                  className="
                    min-w-0
                  "
                >
                  <p
                    className="
                      text-[10px]
                      font-bold
                      leading-[13px]
                      text-[#172F46]
                    "
                  >
                    {reminder.title ||
                      "Reminder"}
                  </p>

                  <p
                    className="
                      mt-[1px]
                      text-[9px]
                      leading-[13px]
                      text-[#71869A]
                    "
                  >
                    {getReminderCompany(
                      reminder
                    )}

                    {" • "}

                    {formatReminderTime(
                      reminder.dueAt
                    )}
                  </p>
                </div>
              </div>
            )
          )
        )}
      </div>

      {/* Calendar Button */}

      <button
        type="button"
        className="
          flex
          h-[31px]
          w-full
          items-center
          justify-center
          border-t
          border-[#E3EAF1]
          bg-[#F8FAFC]
          text-[9px]
          font-semibold
          text-[#173B5C]
          transition
          hover:bg-[#F1F5F9]
        "
      >
        View My Calendar

        <span className="ml-1 text-[12px]">
          →
        </span>
      </button>
    </section>
  );
};

export default UpcomingReminders;