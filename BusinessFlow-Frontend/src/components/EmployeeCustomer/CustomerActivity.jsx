import { useEffect, useState } from "react";
import {
  CheckCircle2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import Card from "../common/Card";

const API_URL = "http://localhost:5000/api";

// =====================================================
// TIME FORMATTER
// =====================================================

const formatRelativeTime = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  const difference =
    now.getTime() - date.getTime();

  const seconds = Math.floor(
    difference / 1000
  );

  const minutes = Math.floor(
    seconds / 60
  );

  const hours = Math.floor(
    minutes / 60
  );

  const days = Math.floor(
    hours / 24
  );

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} ${
      minutes === 1
        ? "minute"
        : "minutes"
    } ago`;
  }

  if (hours < 24) {
    return `${hours} ${
      hours === 1
        ? "hour"
        : "hours"
    } ago`;
  }

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );
};

// =====================================================
// ACTIVITY TYPE
// =====================================================

const getActivityType = (
  activity
) => {
  const type =
    String(activity?.type || "")
      .toLowerCase();

  const title =
    String(activity?.title || "")
      .toLowerCase();

  const description =
    String(
      activity?.description || ""
    ).toLowerCase();

  const combined = `${type} ${title} ${description}`;

  if (
    combined.includes("risk") ||
    combined.includes("danger") ||
    combined.includes("alert") ||
    combined.includes("overdue")
  ) {
    return "danger";
  }

  if (
    combined.includes("created") ||
    combined.includes("added") ||
    combined.includes("completed") ||
    combined.includes("renewed") ||
    combined.includes("updated") ||
    combined.includes("follow")
  ) {
    return "success";
  }

  return "neutral";
};

// =====================================================
// ICON
// =====================================================

const ActivityIcon = ({
  type,
}) => {
  if (type === "danger") {
    return (
      <AlertCircle
        size={6}
        strokeWidth={2.5}
        className="text-white"
      />
    );
  }

  if (type === "neutral") {
    return (
      <RefreshCw
        size={6}
        strokeWidth={2.5}
        className="text-white"
      />
    );
  }

  return (
    <CheckCircle2
      size={6}
      strokeWidth={2.5}
      className="text-white"
    />
  );
};

// =====================================================
// COMPONENT
// =====================================================

const CustomerActivity = () => {
  const [activities, setActivities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ===================================================
  // FETCH ACTIVITY
  // ===================================================

  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "businessflow_token"
        );

      if (!token) {
        setError(
          "Authentication required."
        );
        return;
      }

      const response =
        await fetch(
          `${API_URL}/customers/me/activity?limit=5`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to fetch customer activity."
        );
      }

      setActivities(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (err) {
      console.error(
        "Customer Activity Error:",
        err
      );

      setError(
        err.message ||
          "Failed to fetch customer activity."
      );

      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    fetchActivity();
  }, []);

  return (
    <Card className="w-full overflow-hidden">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="px-4 pt-4">
        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          My Customer Activity
        </h2>

        <div className="mt-2 h-px w-full bg-[#DCE5ED]" />
      </div>

      {/* =====================================================
          ACTIVITY LIST
      ====================================================== */}

      <div className="px-4 pb-4 pt-3">
        {/* ===================================================
            LOADING
        ==================================================== */}

        {loading && (
          <div className="flex min-h-[170px] items-center justify-center">
            <p className="text-[9px] text-[#8495A5]">
              Loading activity...
            </p>
          </div>
        )}

        {/* ===================================================
            ERROR
        ==================================================== */}

        {!loading && error && (
          <div className="flex min-h-[170px] flex-col items-center justify-center">
            <p className="text-[9px] text-[#EF4444]">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchActivity}
              className="
                mt-2
                text-[8px]
                font-semibold
                text-[#079BEA]
                hover:text-[#0B3D6B]
              "
            >
              Try Again
            </button>
          </div>
        )}

        {/* ===================================================
            EMPTY
        ==================================================== */}

        {!loading &&
          !error &&
          activities.length === 0 && (
            <div className="flex min-h-[170px] items-center justify-center">
              <p className="text-[9px] text-[#8495A5]">
                No customer activity yet.
              </p>
            </div>
          )}

        {/* ===================================================
            TIMELINE
        ==================================================== */}

        {!loading &&
          !error &&
          activities.length > 0 && (
            <div className="relative">
              {/* Vertical Timeline */}

              <div
                className="
                  absolute
                  bottom-[7px]
                  left-[4px]
                  top-[7px]
                  w-px
                  bg-[#D7E4EF]
                "
              />

              <div className="space-y-4">
                {activities.map(
                  (
                    activity,
                    index
                  ) => {
                    const activityType =
                      getActivityType(
                        activity
                      );

                    const isDanger =
                      activityType ===
                      "danger";

                    return (
                      <div
                        key={
                          activity.id ||
                          `${activity.createdAt}-${index}`
                        }
                        className="relative flex gap-3"
                      >
                        {/* =================================================
                            TIMELINE DOT
                        ================================================== */}

                        <div
                          className={`
                            relative
                            z-10
                            mt-[3px]
                            flex
                            h-[9px]
                            w-[9px]
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border-2
                            border-white
                            ${
                              isDanger
                                ? "bg-[#EF4444]"
                                : activityType ===
                                    "neutral"
                                  ? "bg-[#079BEA]"
                                  : "bg-[#20A65A]"
                            }
                          `}
                        >
                          <ActivityIcon
                            type={
                              activityType
                            }
                          />
                        </div>

                        {/* =================================================
                            CONTENT
                        ================================================== */}

                        <div className="min-w-0 flex-1">
                          {/* Time */}

                          <p
                            className="
                              text-[8px]
                              font-medium
                              text-[#718599]
                            "
                          >
                            {formatRelativeTime(
                              activity.createdAt
                            )}
                          </p>

                          {/* Main title */}

                          <p
                            className="
                              mt-[4px]
                              text-[9px]
                              font-semibold
                              leading-[14px]
                              text-[#17324D]
                            "
                          >
                            {activity.title ||
                              "Customer activity"}
                          </p>

                          {/* Description */}

                          {activity.description && (
                            <p
                              className="
                                text-[9px]
                                leading-[14px]
                                text-[#17324D]
                              "
                            >
                              {
                                activity.description
                              }
                            </p>
                          )}

                          {/* Customer name */}

                          {activity.customer
                            ?.name && (
                            <p
                              className="
                                mt-[2px]
                                text-[8px]
                                font-medium
                                text-[#718599]
                              "
                            >
                              {
                                activity
                                  .customer
                                  .name
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
      </div>
    </Card>
  );
};

export default CustomerActivity;