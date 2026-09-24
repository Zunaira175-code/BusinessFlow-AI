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
// DEFAULT DATA
// =====================================================

const DEFAULT_STATS = {
  allNotifications: {
    total: 0,
    unread: 0,
  },

  leads: {
    total: 0,
    unread: 0,
  },

  deals: {
    total: 0,
    unread: 0,
  },

  tasksAndMeetings: {
    total: 0,
    unread: 0,
  },
};

// =====================================================
// SAFE NUMBER
// =====================================================

const safeNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};

// =====================================================
// NOTIFICATION STATS
// =====================================================

const NotificationStats = () => {
  const [statsData, setStatsData] =
    useState(DEFAULT_STATS);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ===================================================
  // FETCH STATS
  // ===================================================

  const fetchNotificationStats =
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
            `${API_BASE_URL}/api/notifications/stats`,
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
              "Unable to load notification statistics."
          );
        }

        const data =
          result?.data || {};

        setStatsData({
          allNotifications: {
            total: safeNumber(
              data?.allNotifications?.total
            ),

            unread: safeNumber(
              data?.allNotifications?.unread
            ),
          },

          leads: {
            total: safeNumber(
              data?.leads?.total
            ),

            unread: safeNumber(
              data?.leads?.unread
            ),
          },

          deals: {
            total: safeNumber(
              data?.deals?.total
            ),

            unread: safeNumber(
              data?.deals?.unread
            ),
          },

          tasksAndMeetings: {
            total: safeNumber(
              data?.tasksAndMeetings?.total
            ),

            unread: safeNumber(
              data?.tasksAndMeetings?.unread
            ),
          },
        });
      } catch (error) {
        console.error(
          "Notification Stats Error:",
          error
        );

        setError(
          error?.message ||
            "Unable to load notification statistics."
        );

        setStatsData(
          DEFAULT_STATS
        );
      } finally {
        setLoading(false);
      }
    }, []);

  // ===================================================
  // LOAD
  // ===================================================

  useEffect(() => {
    fetchNotificationStats();
  }, [fetchNotificationStats]);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <section
        className="
          grid
          w-full
          grid-cols-4
          gap-3
        "
      >
        {[1, 2, 3, 4].map(
          (item) => (
            <div
              key={item}
              className="
                relative
                min-h-[100px]
                animate-pulse
                rounded-[10px]
                border
                border-[#DCE5EF]
                bg-white
                px-3.5
                py-3
              "
            >
              <div
                className="
                  h-[8px]
                  w-[100px]
                  rounded
                  bg-[#E8EEF3]
                "
              />

              <div
                className="
                  mt-4
                  h-[22px]
                  w-[32px]
                  rounded
                  bg-[#E8EEF3]
                "
              />

              <div
                className="
                  mt-2
                  h-[14px]
                  w-[55px]
                  rounded-full
                  bg-[#EEF2F5]
                "
              />

              <div
                className="
                  absolute
                  right-3
                  top-3
                  h-6
                  w-6
                  rounded-[6px]
                  bg-[#E8EEF3]
                "
              />
            </div>
          )
        )}
      </section>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error) {
    return (
      <section
        className="
          flex
          min-h-[100px]
          w-full
          items-center
          justify-between
          rounded-[10px]
          border
          border-[#DCE5EF]
          bg-white
          px-4
        "
      >
        <div>
          <p
            className="
              text-[10px]
              font-semibold
              text-[#0B2239]
            "
          >
            Unable to load notification statistics
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
        </div>

        <button
          type="button"
          onClick={
            fetchNotificationStats
          }
          className="
            rounded-[5px]
            border
            border-[#C9D8E5]
            bg-white
            px-3
            py-1.5
            text-[8px]
            font-semibold
            text-[#17324D]
            hover:bg-[#F5F8FB]
          "
        >
          Retry
        </button>
      </section>
    );
  }

  // ===================================================
  // STATS
  // ===================================================

  const stats = [
    {
      title:
        "ALL NOTIFICATIONS",

      value:
        statsData
          .allNotifications
          .total,

      unread:
        statsData
          .allNotifications
          .unread,

      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 8A6 6 0 0 0 6 8C6 15 3 15 3 17H21C21 15 18 15 18 8Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M10 21H14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),

      badgeClass:
        "bg-[#FFD9D9] text-[#E53935]",
    },

    {
      title: "LEADS",

      value:
        statsData
          .leads
          .total,

      unread:
        statsData
          .leads
          .unread,

      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 21V19C16 16.8 14.2 15 12 15H6C3.8 15 2 16.8 2 19V21"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          <circle
            cx="9"
            cy="7"
            r="4"
            stroke="currentColor"
            strokeWidth="1.8"
          />

          <path
            d="M19 8V14M16 11H22"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),

      badgeClass:
        "bg-[#FFE8C7] text-[#D97706]",
    },

    {
      title: "DEALS",

      value:
        statsData
          .deals
          .total,

      unread:
        statsData
          .deals
          .unread,

      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.5 13.5L13.5 20.5C12.7 21.3 11.3 21.3 10.5 20.5L3.5 13.5C2.7 12.7 2.7 11.3 3.5 10.5L10.5 3.5C11.3 2.7 12.7 2.7 13.5 3.5L20.5 10.5C21.3 11.3 21.3 12.7 20.5 13.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          <path
            d="M9 9L15 15"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          <circle
            cx="9"
            cy="9"
            r="1"
            fill="currentColor"
          />

          <circle
            cx="15"
            cy="15"
            r="1"
            fill="currentColor"
          />
        </svg>
      ),

      badgeClass:
        "bg-[#DDF3FF] text-[#1686C4]",
    },

    {
      title:
        "TASKS & MEETINGS",

      value:
        statsData
          .tasksAndMeetings
          .total,

      unread:
        statsData
          .tasksAndMeetings
          .unread,

      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />

          <path
            d="M8 3V7M16 3V7M3 10H21"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          <path
            d="M8 14H10M14 14H16M8 17H10"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),

      badgeClass:
        "bg-[#FFD9D9] text-[#E53935]",
    },
  ];

  // ===================================================
  // UI
  // ===================================================

  return (
    <section
      className="
        grid
        w-full
        grid-cols-4
        gap-3
      "
    >
      {stats.map(
        (stat) => (
          <div
            key={stat.title}
            className="
              relative
              min-h-[100px]
              rounded-[10px]
              border
              border-[#DCE5EF]
              bg-white
              px-3.5
              py-3
              shadow-[0_1px_2px_rgba(15,35,55,0.03)]
            "
          >
            {/* Icon */}

            <div
              className="
                absolute
                right-3
                top-3
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-[6px]
                bg-[#E4F0FF]
                text-[#174A78]
              "
            >
              {stat.icon}
            </div>

            {/* Title */}

            <p
              className="
                pr-8
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.04em]
                text-[#5F7488]
              "
            >
              {stat.title}
            </p>

            {/* REAL VALUE */}

            <p
              className="
                mt-4
                text-[21px]
                font-bold
                leading-none
                text-[#0B2239]
              "
            >
              {stat.value}
            </p>

            {/* REAL UNREAD */}

            <span
              className={`
                mt-2
                inline-flex
                items-center
                rounded-full
                px-2
                py-[2px]
                text-[8px]
                font-semibold
                ${stat.badgeClass}
              `}
            >
              {stat.unread} unread
            </span>
          </div>
        )
      )}
    </section>
  );
};

export default NotificationStats;