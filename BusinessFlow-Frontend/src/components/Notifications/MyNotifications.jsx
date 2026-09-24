import { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const MyNotifications = ({ filters = {} }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [markingId, setMarkingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  /*
   * ----------------------------------------------------
   * GET AUTH TOKEN
   * ----------------------------------------------------
   */
  const getToken = () => {
    return localStorage.getItem("businessflow_token");
  };

  /*
   * ----------------------------------------------------
   * ICONS
   * ----------------------------------------------------
   */
  const getIcon = (type) => {
    switch (type) {
      case "lead":
        return (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <circle
              cx="9"
              cy="8"
              r="4"
              stroke="currentColor"
              strokeWidth="1.7"
            />

            <path
              d="M2.5 20C2.5 16.7 5.4 14.5 9 14.5C11.1 14.5 12.9 15.2 14.2 16.4"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />

            <path
              d="M17 12V18M14 15H20"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        );

      case "deal":
        return (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 12.5L12.5 20L4 11.5V5H10.5L20 12.5Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />

            <circle
              cx="8"
              cy="8"
              r="1.2"
              fill="currentColor"
            />

            <path
              d="M12 9L15 12"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        );

      case "task":
        return (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="8"
              stroke="currentColor"
              strokeWidth="1.7"
            />

            <path
              d="M8 12L10.5 14.5L16 9"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      case "meeting":
        return (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <rect
              x="4"
              y="5"
              width="16"
              height="15"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.7"
            />

            <path
              d="M8 3V7M16 3V7M4 10H20"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        );

      default:
        return (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <rect
              x="4"
              y="5"
              width="16"
              height="14"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.7"
            />

            <path
              d="M7 9H17M7 13H14"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        );
    }
  };

  /*
   * ----------------------------------------------------
   * ICON STYLES
   * ----------------------------------------------------
   */
  const iconStyles = {
    lead: "bg-[#E0ECFF] text-[#3478C8]",
    deal: "bg-[#E2F3FF] text-[#1593D1]",
    task: "bg-[#FFF0D9] text-[#F28A00]",
    meeting: "bg-[#DDEBFF] text-[#7690AE]",
  };

  /*
   * ----------------------------------------------------
   * FORMAT TIME
   * ----------------------------------------------------
   */
  const formatTime = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) {
      return "Just now";
    }

    if (diffMinutes < 60) {
      return `${diffMinutes} ${
        diffMinutes === 1 ? "min" : "mins"
      } ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
      return `${diffHours} ${
        diffHours === 1 ? "hour" : "hours"
      } ago`;
    }

    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 1) {
      return "Yesterday";
    }

    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !== now.getFullYear()
          ? "numeric"
          : undefined,
    });
  };

  /*
   * ----------------------------------------------------
   * GET NOTIFICATIONS
   * ----------------------------------------------------
   */
  const fetchNotifications = useCallback(
    async ({ requestedPage = 1, append = false } = {}) => {
      const token = getToken();

      if (!token) {
        setError("Authentication required. Please login again.");
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        setError("");

        const params = new URLSearchParams();

        params.set("page", requestedPage);
        params.set("limit", "10");

        if (filters?.type && filters.type !== "all") {
          params.set("type", filters.type);
        }

        if (filters?.status && filters.status !== "all") {
          params.set("status", filters.status);
        }

        if (filters?.date && filters.date !== "all") {
          params.set("date", filters.date);
        }

        /*
         * NOTE:
         * Backend currently does not support search.
         * So search is intentionally not sent here.
         */

        const response = await fetch(
          `${API_BASE_URL}/api/notifications?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message || "Failed to load notifications."
          );
        }

        const data = Array.isArray(result?.data)
          ? result.data
          : [];

        setNotifications((previous) =>
          append ? [...previous, ...data] : data
        );

        setPagination(result?.pagination || null);
        setPage(requestedPage);
      } catch (err) {
        console.error("Notifications Fetch Error:", err);

        setError(
          err?.message || "Unable to load notifications."
        );

        if (!append) {
          setNotifications([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filters?.type, filters?.status, filters?.date]
  );

  /*
   * ----------------------------------------------------
   * FETCH WHEN FILTER CHANGES
   * ----------------------------------------------------
   */
  useEffect(() => {
    fetchNotifications({
      requestedPage: 1,
      append: false,
    });
  }, [fetchNotifications]);

  /*
   * ----------------------------------------------------
   * MARK SINGLE NOTIFICATION AS READ
   * ----------------------------------------------------
   */
  const markAsRead = async (notificationId) => {
    if (!notificationId) return;

    const notification = notifications.find(
      (item) => item.id === notificationId
    );

    if (!notification || notification.isRead) {
      return;
    }

    const token = getToken();

    if (!token) {
      setError("Authentication required. Please login again.");
      return;
    }

    try {
      setMarkingId(notificationId);

      const response = await fetch(
        `${API_BASE_URL}/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to mark notification as read."
        );
      }

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notificationId
            ? {
                ...item,
                isRead: true,
                readAt:
                  result?.data?.readAt ||
                  new Date().toISOString(),
              }
            : item
        )
      );
    } catch (err) {
      console.error("Mark Notification Read Error:", err);

      setError(
        err?.message ||
          "Unable to mark notification as read."
      );
    } finally {
      setMarkingId(null);
    }
  };

  /*
   * ----------------------------------------------------
   * MARK ALL AS READ
   * ----------------------------------------------------
   */
  const markAllAsRead = async () => {
    const unreadExists = notifications.some(
      (item) => !item.isRead
    );

    if (!unreadExists) return;

    const token = getToken();

    if (!token) {
      setError("Authentication required. Please login again.");
      return;
    }

    try {
      setMarkingAll(true);

      const response = await fetch(
        `${API_BASE_URL}/api/notifications/read-all`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to mark all notifications as read."
        );
      }

      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          isRead: true,
          readAt:
            item.readAt || new Date().toISOString(),
        }))
      );
    } catch (err) {
      console.error(
        "Mark All Notifications Read Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to mark all notifications as read."
      );
    } finally {
      setMarkingAll(false);
    }
  };

  /*
   * ----------------------------------------------------
   * LOAD MORE
   * ----------------------------------------------------
   */
  const handleLoadMore = () => {
    if (loadingMore) return;

    if (!pagination?.hasNextPage) return;

    fetchNotifications({
      requestedPage: page + 1,
      append: true,
    });
  };

  /*
   * ----------------------------------------------------
   * FRONTEND SEARCH
   *
   * Backend search isn't implemented yet.
   * This filters currently loaded notifications only.
   * ----------------------------------------------------
   */
  const displayedNotifications = useMemo(() => {
    const search = String(filters?.search || "")
      .trim()
      .toLowerCase();

    if (!search) {
      return notifications;
    }

    return notifications.filter((notification) => {
      const title = String(
        notification?.title || ""
      ).toLowerCase();

      const message = String(
        notification?.message || ""
      ).toLowerCase();

      return (
        title.includes(search) ||
        message.includes(search)
      );
    });
  }, [notifications, filters?.search]);

  /*
   * --------------
   * EMPTY STATE
   * --------------
   */
  const isEmpty =
    !loading && displayedNotifications.length === 0;

  /*
   * ----------------------------------------------------
   * RENDER
   * ----------------------------------------------------
   */
  return (
    <section className="w-full overflow-hidden rounded-[10px] border border-[#DCE5EF] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E1E8EF] px-4 py-3.5">
        <div>
          <h2 className="text-[14px] font-bold text-[#102A43]">
            My Notifications
          </h2>

          <p className="mt-1 text-[9px] text-[#71869A]">
            Recent activity and updates related to your work.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllAsRead}
          disabled={
            markingAll ||
            !notifications.some(
              (notification) => !notification.isRead
            )
          }
          className={`rounded-[5px] border border-[#D8E2EC] bg-white px-2.5 py-1.5 text-[8px] font-semibold text-[#173B5C] transition ${
            markingAll ||
            !notifications.some(
              (notification) => !notification.isRead
            )
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-[#F5F9FC]"
          }`}
        >
          {markingAll ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="border-b border-[#F3D3D3] bg-[#FFF7F7] px-4 py-2.5">
          <p className="text-[9px] text-[#C24141]">
            {error}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-0">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex min-h-[62px] items-center gap-3 border-b border-[#E1E8EF] px-4 py-2.5"
            >
              <div className="h-[30px] w-[30px] shrink-0 animate-pulse rounded-full bg-[#EDF3F8]" />

              <div className="min-w-0 flex-1">
                <div className="h-[9px] w-[130px] animate-pulse rounded bg-[#EDF3F8]" />

                <div className="mt-2 h-[8px] w-[210px] max-w-full animate-pulse rounded bg-[#F1F5F9]" />
              </div>

              <div className="h-[7px] w-[45px] animate-pulse rounded bg-[#F1F5F9]" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {isEmpty && !error && (
        <div className="flex min-h-[180px] items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#EEF5FA] text-[#6C87A5]">
              {getIcon("default")}
            </div>

            <p className="mt-2 text-[11px] font-semibold text-[#4C647A]">
              No notifications found
            </p>

            <p className="mt-1 text-[9px] text-[#8A9AAA]">
              There are no notifications matching your filters.
            </p>
          </div>
        </div>
      )}

      {/* Notifications */}
      {!loading && displayedNotifications.length > 0 && (
        <div>
          {displayedNotifications.map(
            (notification, index) => {
              const type =
                notification?.type || "default";

              const isUnread =
                notification?.isRead === false;

              const description =
                notification?.message || "";

              const iconStyle =
                iconStyles[type] ||
                "bg-[#DDEBFF] text-[#6C87A5]";

              return (
                <div
                  key={
                    notification?.id ||
                    `${notification?.title}-${index}`
                  }
                  className={`relative flex min-h-[62px] items-center gap-3 border-b border-[#E1E8EF] px-4 py-2.5 ${
                    isUnread
                      ? "before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-[#0794D8]"
                      : ""
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full ${iconStyle}`}
                  >
                    {getIcon(type)}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[10px] font-semibold ${
                        isUnread
                          ? "text-[#172F46]"
                          : "text-[#667C91]"
                      }`}
                    >
                      {notification?.title}
                    </p>

                    <p
                      className={`mt-[2px] truncate text-[9px] ${
                        isUnread
                          ? "text-[#61768A]"
                          : "text-[#8293A3]"
                      }`}
                    >
                      {description}
                    </p>

                    {/* Action */}
                    {notification?.actionLabel && (
                      <button
                        type="button"
                        onClick={() =>
                          markAsRead(notification.id)
                        }
                        disabled={
                          markingId === notification.id
                        }
                        className="mt-1 rounded-[4px] border border-[#D8E2EC] bg-white px-2 py-[2px] text-[8px] font-semibold text-[#173B5C] transition hover:bg-[#F5F9FC] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {notification.actionLabel}
                      </button>
                    )}

                    {/* Read button for unread notification */}
                    {!notification?.actionLabel &&
                      isUnread && (
                        <button
                          type="button"
                          onClick={() =>
                            markAsRead(notification.id)
                          }
                          disabled={
                            markingId === notification.id
                          }
                          className="mt-1 rounded-[4px] border border-[#D8E2EC] bg-white px-2 py-[2px] text-[8px] font-semibold text-[#173B5C] transition hover:bg-[#F5F9FC] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {markingId === notification.id
                            ? "Marking..."
                            : "Mark as read"}
                        </button>
                      )}
                  </div>

                  {/* Time */}
                  <span className="self-start whitespace-nowrap pt-1 text-[8px] text-[#8495A5]">
                    {formatTime(notification?.createdAt)}
                  </span>
                </div>
              );
            }
          )}
        </div>
      )}

      {/* Load More */}
      {!loading &&
        displayedNotifications.length > 0 &&
        pagination?.hasNextPage && (
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="flex h-[34px] w-full items-center justify-center bg-[#F8FAFC] text-[9px] font-semibold text-[#173B5C] transition hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingMore
              ? "Loading..."
              : "Load More Notifications"}
          </button>
        )}

      {/* No more notifications */}
      {!loading &&
        displayedNotifications.length > 0 &&
        pagination &&
        !pagination.hasNextPage && (
          <div className="flex h-[34px] w-full items-center justify-center bg-[#F8FAFC]">
            <span className="text-[9px] text-[#8495A5]">
              No more notifications
            </span>
          </div>
        )}
    </section>
  );
};

export default MyNotifications;