import { useCallback, useEffect, useState } from "react";
import {
  UserRoundPlus,
  Tag,
  CircleCheck,
  CalendarDays,
  Bell,
  AlertCircle,
} from "lucide-react";

// =====================================================
// API
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// =====================================================
// ICON CONFIG
// =====================================================

const notificationIconConfig = {
  lead: {
    icon: UserRoundPlus,
    iconClass: "bg-[#DCEAFF] text-[#3977B5]",
  },

  deal: {
    icon: Tag,
    iconClass: "bg-[#E3F3FF] text-[#168AD0]",
  },

  task: {
    icon: CircleCheck,
    iconClass: "bg-[#FFF0DA] text-[#F08A00]",
  },

  meeting: {
    icon: CalendarDays,
    iconClass: "bg-[#DCEAFF] text-[#5C7FA0]",
  },

  default: {
    icon: Bell,
    iconClass: "bg-[#DCEAFF] text-[#67829C]",
  },
};

// =====================================================
// GET AUTH TOKEN
// =====================================================

const getAuthToken = () => {
  return localStorage.getItem("businessflow_token");
};

// =====================================================
// TIME AGO
// =====================================================

const getTimeAgo = (date) => {
  if (!date) {
    return "";
  }

  const createdAt = new Date(date);

  if (Number.isNaN(createdAt.getTime())) {
    return "";
  }

  const now = new Date();

  const difference = now.getTime() - createdAt.getTime();

  const seconds = Math.floor(difference / 1000);

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  const weeks = Math.floor(days / 7);

  if (weeks < 4) {
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }

  return createdAt.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// =====================================================
// FORMAT NOTIFICATION
// =====================================================

const formatNotification = (notification) => {
  const type = String(notification?.type || "").toLowerCase();

  const config =
    notificationIconConfig[type] ||
    notificationIconConfig.default;

  return {
    ...notification,

    icon: config.icon,

    iconClass: config.iconClass,

    time: getTimeAgo(notification?.createdAt),

    description: notification?.message || "",
  };
};

// =====================================================
// SKELETON
// =====================================================

const NotificationSkeleton = () => {
  return (
    <div
      className="
        flex
        min-h-[55px]
        animate-pulse
        items-center
        border-t
        border-[#E2EAF0]
        px-3
        py-2.5
      "
    >
      <div
        className="
          ml-1
          h-[31px]
          w-[31px]
          shrink-0
          rounded-full
          bg-[#E8EEF3]
        "
      />

      <div className="ml-3 flex-1">
        <div className="h-[7px] w-[110px] rounded bg-[#E8EEF3]" />

        <div className="mt-2 h-[6px] w-[180px] rounded bg-[#EEF2F5]" />
      </div>

      <div className="h-[6px] w-[45px] rounded bg-[#EEF2F5]" />
    </div>
  );
};

// =====================================================
// EMPTY STATE
// =====================================================

const EmptyNotifications = () => {
  return (
    <div
      className="
        flex
        min-h-[150px]
        flex-col
        items-center
        justify-center
        border-t
        border-[#E2EAF0]
        px-4
        text-center
      "
    >
      <div
        className="
          flex
          h-[34px]
          w-[34px]
          items-center
          justify-center
          rounded-full
          bg-[#EDF5FB]
          text-[#3977B5]
        "
      >
        <Bell size={15} strokeWidth={1.8} />
      </div>

      <p
        className="
          mt-2
          text-[9px]
          font-semibold
          text-[#17324D]
        "
      >
        No notifications
      </p>

      <p
        className="
          mt-1
          max-w-[220px]
          text-[8px]
          text-[#7A8B9A]
        "
      >
        You don't have any notifications matching your current filters.
      </p>
    </div>
  );
};

// =====================================================
// ERROR STATE
// =====================================================

const ErrorState = ({ message, onRetry }) => {
  return (
    <div
      className="
        flex
        min-h-[150px]
        flex-col
        items-center
        justify-center
        border-t
        border-[#E2EAF0]
        px-4
        text-center
      "
    >
      <div
        className="
          flex
          h-[34px]
          w-[34px]
          items-center
          justify-center
          rounded-full
          bg-[#FFF1F1]
          text-[#D84A4A]
        "
      >
        <AlertCircle size={15} strokeWidth={1.8} />
      </div>

      <p
        className="
          mt-2
          text-[9px]
          font-semibold
          text-[#17324D]
        "
      >
        Unable to load notifications
      </p>

      <p
        className="
          mt-1
          max-w-[260px]
          text-[8px]
          text-[#7A8B9A]
        "
      >
        {message ||
          "Something went wrong while loading your notifications."}
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
// MY NOTIFICATIONS
// =====================================================

const MyNotifications = ({
  search = "",
  type = "all",
  status = "all",
  date = "week",
}) => {
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // ===================================================
  // BUILD QUERY STRING
  // ===================================================

  const buildQueryString = useCallback(
    (page = 1) => {
      const params = new URLSearchParams();

      params.set("page", page);
      params.set("limit", "20");

      // Search
      if (search?.trim()) {
        params.set("search", search.trim());
      }

      // Type
      if (type && type !== "all") {
        params.set("type", type);
      }

      // Status
      if (status && status !== "all") {
        params.set("status", status);
      }

      // Date
      if (date && date !== "all") {
        params.set("date", date);
      }

      return params.toString();
    },
    [search, type, status, date]
  );

  // ===================================================
  // FETCH NOTIFICATIONS
  // ===================================================

  const fetchNotifications = useCallback(
    async ({ page = 1, append = false } = {}) => {
      try {
        const token = getAuthToken();

        if (!token) {
          setError(
            "Authentication token not found. Please login again."
          );

          setLoading(false);
          setLoadingMore(false);

          return;
        }

        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        setError("");

        const queryString = buildQueryString(page);

        const response = await fetch(
          `${API_BASE_URL}/api/notifications?${queryString}`,
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
              "Unable to load notifications."
          );
        }

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Unable to load notifications."
          );
        }

        const apiNotifications = Array.isArray(result?.data)
          ? result.data
          : [];

        const formattedNotifications =
          apiNotifications.map(formatNotification);

        setNotifications((previous) =>
          append
            ? [...previous, ...formattedNotifications]
            : formattedNotifications
        );

        setPagination(
          result?.pagination || {
            page,
            limit: 20,
            total: formattedNotifications.length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: page > 1,
          }
        );
      } catch (fetchError) {
        console.error(
          "Fetch Notifications Error:",
          fetchError
        );

        setError(
          fetchError?.message ||
            "Unable to load notifications."
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [buildQueryString]
  );

  // ===================================================
  // INITIAL LOAD + FILTER CHANGE
  // ===================================================

  useEffect(() => {
    setNotifications([]);

    setPagination({
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });

    fetchNotifications({
      page: 1,
      append: false,
    });
  }, [
    search,
    type,
    status,
    date,
    fetchNotifications,
  ]);

  // ===================================================
  // MARK SINGLE NOTIFICATION AS READ
  // ===================================================

  const markAsRead = async (notification) => {
    if (
      !notification?.id ||
      notification.isRead
    ) {
      return true;
    }

    const token = getAuthToken();

    if (!token) {
      return false;
    }

    // -------------------------------------------------
    // Optimistic UI
    // -------------------------------------------------

    setNotifications((previous) =>
      previous.map((item) =>
        item.id === notification.id
          ? {
              ...item,
              isRead: true,
            }
          : item
      )
    );

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/${notification.id}/read`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ||
            "Unable to mark notification as read."
        );
      }

      return true;
    } catch (readError) {
      console.error(
        "Mark Notification Read Error:",
        readError
      );

      // ------------------------------------------------
      // Rollback optimistic update
      // ------------------------------------------------

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                isRead: false,
              }
            : item
        )
      );

      return false;
    }
  };

  // ===================================================
  // HANDLE NOTIFICATION CLICK
  // ===================================================

  const handleNotificationClick = async (notification) => {
    const markedSuccessfully =
      await markAsRead(notification);

    if (
      markedSuccessfully &&
      notification?.actionUrl
    ) {
      window.location.href =
        notification.actionUrl;
    }
  };

  // ===================================================
  // LOAD MORE
  // ===================================================

  const handleLoadMore = async () => {
    if (
      loadingMore ||
      !pagination.hasNextPage
    ) {
      return;
    }

    await fetchNotifications({
      page: pagination.page + 1,
      append: true,
    });
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

      <div className="px-4 pb-3 pt-4">
        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          My Notifications
        </h2>

        <p
          className="
            mt-1
            text-[8px]
            text-[#7A8B9A]
          "
        >
          Recent activity and updates related to your work.
        </p>
      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div>
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading && error && (
        <ErrorState
          message={error}
          onRetry={() =>
            fetchNotifications({
              page: 1,
              append: false,
            })
          }
        />
      )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        !error &&
        notifications.length === 0 && (
          <EmptyNotifications />
        )}

      {/* =================================================
          NOTIFICATION ROWS
      ================================================= */}

      {!loading &&
        !error &&
        notifications.length > 0 && (
          <div>
            {notifications.map(
              (notification, index) => {
                const Icon =
                  notification.icon;

                const hasAction =
                  Boolean(
                    notification.actionUrl
                  );

                return (
                  <div
                    key={
                      notification.id ||
                      `${notification.title}-${index}`
                    }
                    onClick={() =>
                      handleNotificationClick(
                        notification
                      )
                    }
                    className={`
                      relative
                      flex
                      min-h-[55px]
                      items-center
                      border-t
                      border-[#E2EAF0]
                      px-3
                      py-2.5
                      ${
                        notification.isRead
                          ? "bg-white"
                          : "bg-[#FBFDFF]"
                      }
                      ${
                        hasAction
                          ? "cursor-pointer hover:bg-[#F8FBFD]"
                          : "cursor-pointer hover:bg-[#FBFDFF]"
                      }
                    `}
                  >
                    {/* -----------------------------------
                        UNREAD INDICATOR
                    ----------------------------------- */}

                    {!notification.isRead && (
                      <div
                        className="
                          absolute
                          bottom-0
                          left-0
                          top-0
                          w-[2px]
                          bg-[#079BEA]
                        "
                      />
                    )}

                    {/* -----------------------------------
                        ICON
                    ----------------------------------- */}

                    <div
                      className={`
                        ml-1
                        flex
                        h-[31px]
                        w-[31px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        ${
                          notification.iconClass ||
                          "bg-[#DCEAFF] text-[#3977B5]"
                        }
                      `}
                    >
                      <Icon
                        size={14}
                        strokeWidth={1.8}
                      />
                    </div>

                    {/* -----------------------------------
                        CONTENT
                    ----------------------------------- */}

                    <div className="ml-3 min-w-0 flex-1">
                      <p
                        className={`
                          text-[8px]
                          font-semibold
                          ${
                            notification.isRead
                              ? "text-[#60758A]"
                              : "text-[#17324D]"
                          }
                        `}
                      >
                        {notification.title}
                      </p>

                      <p
                        className="
                          mt-[2px]
                          text-[8px]
                          text-[#718599]
                        "
                      >
                        {notification.description}
                      </p>

                      {/* ---------------------------------
                          ACTION BUTTON
                      --------------------------------- */}

                      {notification.actionLabel &&
                        notification.actionUrl && (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();

                              handleNotificationClick(
                                notification
                              );
                            }}
                            className="
                              mt-1
                              rounded-[3px]
                              border
                              border-[#C9D8E5]
                              bg-white
                              px-2
                              py-[3px]
                              text-[7px]
                              font-medium
                              text-[#17324D]
                              hover:bg-[#F5F8FB]
                            "
                          >
                            {notification.actionLabel}
                          </button>
                        )}
                    </div>

                    {/* -----------------------------------
                        TIME
                    ----------------------------------- */}

                    <span
                      className="
                        self-start
                        whitespace-nowrap
                        pt-[2px]
                        text-[7px]
                        text-[#8A9AA8]
                      "
                    >
                      {notification.time}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        )}

      {/* =================================================
          LOAD MORE
      ================================================= */}

      {!loading &&
        !error &&
        notifications.length > 0 &&
        pagination.hasNextPage && (
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="
              flex
              h-[36px]
              w-full
              items-center
              justify-center
              border-t
              border-[#E2EAF0]
              bg-[#FBFCFD]
              text-[8px]
              font-semibold
              text-[#17324D]
              hover:bg-[#F5F8FB]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loadingMore
              ? "Loading..."
              : "Load More Notifications"}
          </button>
        )}

      {/* =================================================
          ALL LOADED
      ================================================= */}

      {!loading &&
        !error &&
        notifications.length > 0 &&
        !pagination.hasNextPage && (
          <div
            className="
              flex
              h-[36px]
              w-full
              items-center
              justify-center
              border-t
              border-[#E2EAF0]
              bg-[#FBFCFD]
              text-[8px]
              font-medium
              text-[#8A9AA8]
            "
          >
            {pagination.total > 0
              ? "All notifications loaded"
              : ""}
          </div>
        )}
    </section>
  );
};

export default MyNotifications;