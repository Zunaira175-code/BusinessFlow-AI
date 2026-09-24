import { useCallback, useEffect, useState } from "react";
import {
  Bell,
  UserRoundPlus,
  Tag,
  CalendarDays,
  AlertCircle,
} from "lucide-react";

// =====================================================
// API CONFIG
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// =====================================================
// GET AUTH TOKEN
// =====================================================

const getAuthToken = () => {
  return (
    localStorage.getItem("businessflow_token") ||
    sessionStorage.getItem("businessflow_token") ||
    null
  );
};

// =====================================================
// DEFAULT STATS
// =====================================================

const DEFAULT_STATS = {
  allNotifications: {
    total: 0,
    unread: 0,
    read: 0,
  },

  leads: {
    total: 0,
    unread: 0,
    read: 0,
  },

  deals: {
    total: 0,
    unread: 0,
    read: 0,
  },

  tasksAndMeetings: {
    total: 0,
    unread: 0,
    read: 0,
    tasks: 0,
    taskUnread: 0,
    meetings: 0,
    meetingUnread: 0,
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
// STAT SKELETON
// =====================================================

const StatSkeleton = () => {
  return (
    <div
      className="
        relative
        h-[99px]
        animate-pulse
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
        px-4
        py-3
      "
    >
      <div className="h-[7px] w-[85px] rounded bg-[#E8EEF3]" />

      <div className="mt-[13px] h-[20px] w-[30px] rounded bg-[#E8EEF3]" />

      <div className="mt-[8px] h-[14px] w-[50px] rounded-full bg-[#EEF2F5]" />

      <div
        className="
          absolute
          right-3
          top-3
          h-[25px]
          w-[25px]
          rounded-[6px]
          bg-[#E8EEF3]
        "
      />
    </div>
  );
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
  // FETCH NOTIFICATION STATS
  // ===================================================

  const fetchNotificationStats =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const token = getAuthToken();

        // -----------------------------------------------
        // TOKEN CHECK
        // -----------------------------------------------

        if (!token) {
          throw new Error(
            "Authentication token not found. Please login again."
          );
        }

        // -----------------------------------------------
        // API REQUEST
        // -----------------------------------------------

        const response = await fetch(
          `${API_BASE_URL}/api/notifications/stats`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        // -----------------------------------------------
        // PARSE RESPONSE
        // -----------------------------------------------

        const result = await response.json();

        // -----------------------------------------------
        // API ERROR
        // -----------------------------------------------

        if (
          !response.ok ||
          !result?.success
        ) {
          throw new Error(
            result?.message ||
              "Unable to load notification statistics."
          );
        }

        // -----------------------------------------------
        // BACKEND DATA
        // -----------------------------------------------

        const data = result?.data || {};

        // -----------------------------------------------
        // SET REAL DATA
        // -----------------------------------------------

        setStatsData({
          allNotifications: {
            total: safeNumber(
              data?.allNotifications?.total
            ),

            unread: safeNumber(
              data?.allNotifications?.unread
            ),

            read: safeNumber(
              data?.allNotifications?.read
            ),
          },

          leads: {
            total: safeNumber(
              data?.leads?.total
            ),

            unread: safeNumber(
              data?.leads?.unread
            ),

            read: safeNumber(
              data?.leads?.read
            ),
          },

          deals: {
            total: safeNumber(
              data?.deals?.total
            ),

            unread: safeNumber(
              data?.deals?.unread
            ),

            read: safeNumber(
              data?.deals?.read
            ),
          },

          tasksAndMeetings: {
            total: safeNumber(
              data?.tasksAndMeetings?.total
            ),

            unread: safeNumber(
              data?.tasksAndMeetings?.unread
            ),

            read: safeNumber(
              data?.tasksAndMeetings?.read
            ),

            tasks: safeNumber(
              data?.tasksAndMeetings?.tasks
            ),

            taskUnread: safeNumber(
              data?.tasksAndMeetings?.taskUnread
            ),

            meetings: safeNumber(
              data?.tasksAndMeetings?.meetings
            ),

            meetingUnread: safeNumber(
              data?.tasksAndMeetings?.meetingUnread
            ),
          },
        });
      } catch (fetchError) {
        console.error(
          "Notification Stats Error:",
          fetchError
        );

        setError(
          fetchError?.message ||
            "Unable to load notification statistics."
        );

        setStatsData(DEFAULT_STATS);
      } finally {
        setLoading(false);
      }
    }, []);

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    fetchNotificationStats();
  }, [fetchNotificationStats]);

  // ===================================================
  // STAT CARDS
  // ===================================================

  const stats = [
    {
      title: "ALL NOTIFICATIONS",

      value:
        statsData.allNotifications.total,

      unread:
        statsData.allNotifications.unread,

      icon: Bell,

      iconClass:
        "bg-[#DCEAFF] text-[#2F6FAE]",

      unreadClass:
        "bg-[#FFD9D9] text-[#E53935]",
    },

    {
      title: "LEADS",

      value:
        statsData.leads.total,

      unread:
        statsData.leads.unread,

      icon: UserRoundPlus,

      iconClass:
        "bg-[#E0EDFF] text-[#3779B8]",

      unreadClass:
        "bg-[#FFF0D8] text-[#E58A00]",
    },

    {
      title: "DEALS",

      value:
        statsData.deals.total,

      unread:
        statsData.deals.unread,

      icon: Tag,

      iconClass:
        "border border-[#A9D7F5] bg-white text-[#168AD0]",

      unreadClass:
        "bg-[#DFF3FF] text-[#168AD0]",
    },

    {
      title: "TASKS & MEETINGS",

      value:
        statsData.tasksAndMeetings.total,

      unread:
        statsData.tasksAndMeetings.unread,

      icon: CalendarDays,

      iconClass:
        "bg-[#DCEAFF] text-[#2F6FAE]",

      unreadClass:
        "bg-[#FFD9D9] text-[#E53935]",
    },
  ];

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div
        className="
          grid
          w-full
          grid-cols-1
          gap-3
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error) {
    return (
      <div
        className="
          flex
          min-h-[99px]
          w-full
          items-center
          justify-between
          gap-4
          rounded-[9px]
          border
          border-[#F0D7D7]
          bg-white
          px-4
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >
          <div
            className="
              flex
              h-[30px]
              w-[30px]
              shrink-0
              items-center
              justify-center
              rounded-[6px]
              bg-[#FFF1F1]
              text-[#D84A4A]
            "
          >
            <AlertCircle
              size={14}
              strokeWidth={1.8}
            />
          </div>

          <div className="min-w-0">
            <p
              className="
                text-[9px]
                font-semibold
                text-[#17324D]
              "
            >
              Unable to load notification stats
            </p>

            <p
              className="
                mt-1
                truncate
                text-[8px]
                text-[#7A8B9A]
              "
            >
              {error}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchNotificationStats}
          className="
            shrink-0
            rounded-[4px]
            border
            border-[#C9D8E5]
            bg-white
            px-3
            py-[5px]
            text-[8px]
            font-semibold
            text-[#17324D]
            transition-colors
            hover:bg-[#F5F8FB]
          "
        >
          Try Again
        </button>
      </div>
    );
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div
      className="
        grid
        w-full
        grid-cols-1
        gap-3
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
              relative
              h-[99px]
              rounded-[9px]
              border
              border-[#DCE5ED]
              bg-white
              px-4
              py-3
            "
          >
            {/* TITLE */}

            <p
              className="
                text-[8px]
                font-semibold
                text-[#60758A]
              "
            >
              {stat.title}
            </p>

            {/* TOTAL */}

            <p
              className="
                mt-[11px]
                text-[22px]
                font-bold
                leading-none
                tracking-[-0.5px]
                text-[#071D35]
              "
            >
              {stat.value}
            </p>

            {/* UNREAD */}

            <span
              className={`
                mt-[7px]
                inline-flex
                rounded-full
                px-2
                py-[3px]
                text-[7px]
                font-semibold
                ${stat.unreadClass}
              `}
            >
              {stat.unread} unread
            </span>

            {/* ICON */}

            <div
              className={`
                absolute
                right-3
                top-3
                flex
                h-[25px]
                w-[25px]
                items-center
                justify-center
                rounded-[6px]
                ${stat.iconClass}
              `}
            >
              <Icon
                size={13}
                strokeWidth={1.8}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationStats;