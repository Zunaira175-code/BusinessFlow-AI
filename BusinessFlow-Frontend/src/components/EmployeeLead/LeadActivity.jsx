import { useEffect, useState } from "react";

import {
  CircleCheck,
  Phone,
  UserPlus,
  FileText,
} from "lucide-react";

/* =========================================================
   API
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

/* =========================================================
   ACTIVITY ICON
========================================================= */

const ActivityIcon = ({ type }) => {
  const config = {
    qualified: {
      icon: CircleCheck,
      wrapper: "bg-[#DCEAFF]",
      iconColor: "text-[#4B78B8]",
    },

    followup: {
      icon: Phone,
      wrapper: "bg-[#E4EEFF]",
      iconColor: "text-[#4B78B8]",
    },

    assigned: {
      icon: UserPlus,
      wrapper: "bg-[#DCEAFF]",
      iconColor: "text-[#4B78B8]",
    },

    proposal: {
      icon: FileText,
      wrapper: "bg-[#FFF0C7]",
      iconColor: "text-[#D18A00]",
    },
  };

  const current =
    config[type] ||
    config.qualified;

  const Icon = current.icon;

  return (
    <div
      className={`
        relative
        z-10
        flex
        h-[22px]
        w-[22px]
        shrink-0
        items-center
        justify-center
        rounded-full
        ${current.wrapper}
      `}
    >
      <Icon
        size={11}
        strokeWidth={1.8}
        className={current.iconColor}
      />
    </div>
  );
};

/* =========================================================
   FORMAT TIME
========================================================= */

const formatActivityTime = (
  dateValue
) => {
  if (!dateValue) {
    return "Recently";
  }

  const date = new Date(
    dateValue
  );

  if (
    Number.isNaN(date.getTime())
  ) {
    return "Recently";
  }

  const now = new Date();

  const diff =
    now.getTime() -
    date.getTime();

  const minute =
    60 * 1000;

  const hour =
    60 * minute;

  const day =
    24 * hour;

  if (diff < minute) {
    return "Just now";
  }

  if (diff < hour) {
    const minutes = Math.floor(
      diff / minute
    );

    return `${minutes} ${
      minutes === 1
        ? "minute"
        : "minutes"
    } ago`;
  }

  if (diff < day) {
    const hours = Math.floor(
      diff / hour
    );

    return `${hours} ${
      hours === 1
        ? "hour"
        : "hours"
    } ago`;
  }

  const yesterdayStart =
    new Date(now);

  yesterdayStart.setDate(
    now.getDate() - 1
  );

  yesterdayStart.setHours(
    0,
    0,
    0,
    0
  );

  const activityDate =
    new Date(date);

  if (
    activityDate >=
    yesterdayStart
  ) {
    return `Yesterday, ${activityDate.toLocaleTimeString(
      [],
      {
        hour: "numeric",
        minute: "2-digit",
      }
    )}`;
  }

  return activityDate.toLocaleDateString(
    [],
    {
      month: "short",
      day: "numeric",
      year:
        activityDate.getFullYear() !==
        now.getFullYear()
          ? "numeric"
          : undefined,
    }
  );
};

/* =========================================================
   LEAD ACTIVITY
========================================================= */

const LeadActivity = () => {
  const [activities, setActivities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =========================================================
     FETCH ACTIVITY
  ========================================================= */

  useEffect(() => {
    let isMounted = true;

    const fetchActivity =
      async () => {
        try {
          setLoading(true);
          setError("");

          const token =
            localStorage.getItem(
              "businessflow_token"
            );

          if (!token) {
            throw new Error(
              "Authentication token not found."
            );
          }

          const response =
            await fetch(
              `${API_BASE_URL}/api/leads/me/activity?limit=5`,
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

          if (!response.ok) {
            throw new Error(
              result?.message ||
                "Unable to fetch lead activity."
            );
          }

          if (
            !result?.success ||
            !result?.data
          ) {
            throw new Error(
              "Invalid lead activity response."
            );
          }

          const activityList =
            Array.isArray(
              result.data.activities
            )
              ? result.data.activities
              : [];

          if (isMounted) {
            setActivities(
              activityList
            );
          }
        } catch (err) {
          console.error(
            "Employee Lead Activity Error:",
            err
          );

          if (isMounted) {
            setError(
              err.message ||
                "Unable to load lead activity."
            );
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

    fetchActivity();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className="
        w-full
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
        px-4
        py-4
        shadow-[0_1px_2px_rgba(15,23,42,0.03)]
      "
    >
      {/* =================================================
          HEADER
      ================================================== */}

      <div>
        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          My Lead Activity
        </h2>

        <div
          className="
            mt-2
            h-px
            w-full
            bg-[#E2E9EF]
          "
        />
      </div>

      {/* =================================================
          TIMELINE
      ================================================== */}

      <div className="relative mt-3">
        {/* Timeline Line */}

        {!loading &&
          activities.length > 0 && (
            <div
              className="
                absolute
                bottom-[11px]
                left-[10px]
                top-[11px]
                w-px
                bg-[#C9DDF3]
              "
            />
          )}

        {/* =================================================
            LOADING
        ================================================== */}

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <div
                    className="
                      h-[22px]
                      w-[22px]
                      shrink-0
                      animate-pulse
                      rounded-full
                      bg-[#EAF1F7]
                    "
                  />

                  <div className="min-w-0 flex-1">
                    <div
                      className="
                        h-[9px]
                        w-[65%]
                        animate-pulse
                        rounded
                        bg-[#EAF1F7]
                      "
                    />

                    <div
                      className="
                        mt-2
                        h-[7px]
                        w-[30%]
                        animate-pulse
                        rounded
                        bg-[#F0F4F7]
                      "
                    />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================== */}

        {!loading &&
          error && (
            <div
              className="
                py-5
                text-center
                text-[8px]
                font-medium
                text-[#DC2626]
              "
            >
              Unable to load lead activity.
            </div>
          )}

        {/* =================================================
            EMPTY
        ================================================== */}

        {!loading &&
          !error &&
          activities.length ===
            0 && (
            <div
              className="
                py-6
                text-center
                text-[8px]
                font-medium
                text-[#718599]
              "
            >
              No lead activity yet.
            </div>
          )}

        {/* =================================================
            ACTIVITY ITEMS
        ================================================== */}

        {!loading &&
          !error &&
          activities.length >
            0 && (
            <div className="space-y-4">
              {activities.map(
                (
                  activity,
                  index
                ) => (
                  <div
                    key={
                      activity.id ||
                      index
                    }
                    className="
                      relative
                      flex
                      items-start
                      gap-3
                    "
                  >
                    {/* Icon */}

                    <ActivityIcon
                      type={
                        activity.type
                      }
                    />

                    {/* Content */}

                    <div className="min-w-0 flex-1 pt-[1px]">
                      <p
                        className="
                          text-[8px]
                          font-semibold
                          leading-[12px]
                          text-[#17324D]
                        "
                      >
                        {activity.title}
                      </p>

                      <p
                        className="
                          mt-[2px]
                          text-[7px]
                          leading-[10px]
                          text-[#718599]
                        "
                      >
                        {formatActivityTime(
                          activity.time
                        )}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default LeadActivity;