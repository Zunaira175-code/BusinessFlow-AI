import { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  Clock3,
} from "lucide-react";

/* =========================================================
   API
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

/* =========================================================
   DATE HELPERS
========================================================= */

const getStartOfToday = () => {
  const date = new Date();

  date.setHours(
    0,
    0,
    0,
    0
  );

  return date;
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (dateValue) => {
  if (!dateValue) {
    return {
      month: "—",
      day: "—",
    };
  }

  const date = new Date(
    dateValue
  );

  if (
    Number.isNaN(date.getTime())
  ) {
    return {
      month: "—",
      day: "—",
    };
  }

  return {
    month: date
      .toLocaleDateString(
        "en-US",
        {
          month: "short",
        }
      )
      .toUpperCase(),

    day: date
      .toLocaleDateString(
        "en-US",
        {
          day: "2-digit",
        }
      ),
  };
};

/* =========================================================
   FORMAT TIME
========================================================= */

const formatTime = (dateValue) => {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(
    dateValue
  );

  if (
    Number.isNaN(date.getTime())
  ) {
    return "—";
  }

  return date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
};

/* =========================================================
   FORMAT DESCRIPTION
========================================================= */

const getTaskDescription = (task) => {
  if (task?.description) {
    return task.description;
  }

  if (task?.notes) {
    return task.notes;
  }

  return "Lead follow-up";
};

/* =========================================================
   GET LEAD NAME
========================================================= */

const getLeadName = (task) => {
  const lead = task?.leadId;

  if (
    lead &&
    typeof lead === "object"
  ) {
    const firstName =
      lead.firstName || "";

    const lastName =
      lead.lastName || "";

    const fullName =
      `${firstName} ${lastName}`.trim();

    if (fullName) {
      return fullName;
    }

    if (lead.name) {
      return lead.name;
    }

    if (lead.companyName) {
      return lead.companyName;
    }
  }

  if (
    task?.leadName
  ) {
    return task.leadName;
  }

  return "Lead";
};

/* =========================================================
   GET COMPANY NAME
========================================================= */

const getCompanyName = (task) => {
  const lead = task?.leadId;

  if (
    lead &&
    typeof lead === "object"
  ) {
    return (
      lead.company ||
      lead.companyName ||
      ""
    );
  }

  return (
    task?.company ||
    task?.companyName ||
    ""
  );
};

/* =========================================================
   UPCOMING LEAD FOLLOW-UPS
========================================================= */

const UpcomingLeadFollowUps = () => {
  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =========================================================
     FETCH EMPLOYEE TASKS
  ========================================================= */

  useEffect(() => {
    let isMounted = true;

    const fetchFollowUps =
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

          /*
            We fetch the employee's tasks.

            The backend employee task API already scopes
            tasks to the logged-in employee.

            Then on the frontend we keep only:
            - tasks linked to a lead
            - Pending / In Progress tasks
            - today and future tasks
          */

          const response =
            await fetch(
              `${API_BASE_URL}/api/tasks?view=all&page=1&limit=20`,
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
                "Unable to fetch follow-ups."
            );
          }

          if (
            !result?.success ||
            !result?.data
          ) {
            throw new Error(
              "Invalid follow-up response."
            );
          }

          const taskList =
            Array.isArray(
              result.data.tasks
            )
              ? result.data.tasks
              : [];

          const today =
            getStartOfToday();

          const upcoming =
            taskList
              .filter(
                (task) => {
                  /*
                    Only lead-related tasks
                  */

                  const hasLead =
                    Boolean(
                      task?.leadId
                    );

                  /*
                    Only active follow-ups
                  */

                  const activeStatus =
                    task?.status ===
                      "Pending" ||
                    task?.status ===
                      "In Progress";

                  /*
                    Today or future
                  */

                  const dueDate =
                    task?.dueAt
                      ? new Date(
                          task.dueAt
                        )
                      : null;

                  const validDate =
                    dueDate &&
                    !Number.isNaN(
                      dueDate.getTime()
                    );

                  const upcomingDate =
                    validDate &&
                    dueDate >= today;

                  return (
                    hasLead &&
                    activeStatus &&
                    upcomingDate
                  );
                }
              )
              .sort(
                (a, b) => {
                  return (
                    new Date(
                      a.dueAt
                    ).getTime() -
                    new Date(
                      b.dueAt
                    ).getTime()
                  );
                }
              )
              .slice(0, 3);

          if (isMounted) {
            setTasks(upcoming);
          }
        } catch (err) {
          console.error(
            "Employee Lead Follow-ups Error:",
            err
          );

          if (isMounted) {
            setError(
              err.message ||
                "Unable to load follow-ups."
            );
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

    fetchFollowUps();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =========================================================
     FORMAT FOLLOW-UP DATA
  ========================================================= */

  const followUps =
    useMemo(() => {
      return tasks.map(
        (task) => {
          const date =
            formatDate(
              task.dueAt
            );

          const dueDate =
            new Date(
              task.dueAt
            );

          const now =
            new Date();

          const isToday =
            dueDate
              .getFullYear() ===
              now.getFullYear() &&
            dueDate.getMonth() ===
              now.getMonth() &&
            dueDate.getDate() ===
              now.getDate();

          const isUrgent =
            task.priority ===
              "HIGH" ||
            isToday;

          return {
            id:
              task._id ||
              task.id,

            month:
              date.month,

            day:
              date.day,

            customer:
              getLeadName(task),

            company:
              getCompanyName(task),

            description:
              getTaskDescription(
                task
              ),

            time:
              formatTime(
                task.dueAt
              ),

            urgent:
              isUrgent,

            priority:
              task.priority,

            dueAt:
              task.dueAt,
          };
        }
      );
    }, [tasks]);

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

      <div className="flex items-center justify-between gap-3">
        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          Upcoming Follow-ups
        </h2>

        <button
          type="button"
          className="
            text-[8px]
            font-semibold
            text-[#079BEA]
            transition-colors
            hover:text-[#0B3D6B]
          "
          onClick={() => {
            console.log(
              "View Calendar clicked"
            );
          }}
        >
          View Calendar
        </button>
      </div>

      {/* Divider */}

      <div
        className="
          mt-2
          h-px
          w-full
          bg-[#E2E9EF]
        "
      />

      {/* =================================================
          LOADING
      ================================================== */}

      {loading && (
        <div className="mt-3 space-y-2.5">
          {[1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="
                  flex
                  min-h-[60px]
                  items-center
                  gap-2.5
                  rounded-[6px]
                  border
                  border-[#DCE5ED]
                  px-2.5
                  py-2
                "
              >
                {/* Date Skeleton */}

                <div
                  className="
                    h-[40px]
                    w-[40px]
                    shrink-0
                    animate-pulse
                    rounded-[5px]
                    bg-[#EAF1F7]
                  "
                />

                {/* Content Skeleton */}

                <div className="min-w-0 flex-1">
                  <div
                    className="
                      h-[8px]
                      w-[45%]
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

                  <div
                    className="
                      mt-2
                      h-[7px]
                      w-[70%]
                      animate-pulse
                      rounded
                      bg-[#F0F4F7]
                    "
                  />
                </div>

                {/* Time Skeleton */}

                <div
                  className="
                    h-[12px]
                    w-[48px]
                    animate-pulse
                    rounded
                    bg-[#F0F4F7]
                  "
                />
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
              py-7
              text-center
              text-[8px]
              font-medium
              text-[#DC2626]
            "
          >
            Unable to load follow-ups.
          </div>
        )}

      {/* =================================================
          EMPTY
      ================================================== */}

      {!loading &&
        !error &&
        followUps.length ===
          0 && (
          <div
            className="
              py-7
              text-center
              text-[8px]
              font-medium
              text-[#718599]
            "
          >
            No upcoming lead follow-ups.
          </div>
        )}

      {/* =================================================
          FOLLOW-UP ITEMS
      ================================================== */}

      {!loading &&
        !error &&
        followUps.length >
          0 && (
          <div className="mt-3 space-y-2.5">
            {followUps.map(
              (item) => (
                <div
                  key={item.id}
                  className="
                    flex
                    min-h-[60px]
                    items-center
                    gap-2.5
                    rounded-[6px]
                    border
                    border-[#DCE5ED]
                    bg-white
                    px-2.5
                    py-2
                    transition-colors
                    hover:bg-[#FAFCFE]
                  "
                >
                  {/* =================================================
                      DATE
                  ================================================= */}

                  <div
                    className="
                      flex
                      h-[40px]
                      w-[40px]
                      shrink-0
                      flex-col
                      items-center
                      justify-center
                      rounded-[5px]
                      bg-[#E8F1FF]
                    "
                  >
                    <span
                      className="
                        text-[6px]
                        font-semibold
                        uppercase
                        leading-none
                        text-[#718599]
                      "
                    >
                      {item.month}
                    </span>

                    <span
                      className="
                        mt-[2px]
                        text-[13px]
                        font-bold
                        leading-none
                        text-[#17324D]
                      "
                    >
                      {item.day}
                    </span>
                  </div>

                  {/* =================================================
                      DETAILS
                  ================================================= */}

                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        truncate
                        text-[8px]
                        font-bold
                        text-[#17324D]
                      "
                    >
                      {item.customer}
                    </p>

                    {item.company && (
                      <p
                        className="
                          truncate
                          text-[7px]
                          text-[#8495A5]
                        "
                      >
                        {item.company}
                      </p>
                    )}

                    <p
                      className="
                        mt-[2px]
                        line-clamp-1
                        text-[7px]
                        leading-[10px]
                        text-[#718599]
                      "
                    >
                      {item.description}
                    </p>
                  </div>

                  {/* =================================================
                      TIME
                  ================================================= */}

                  <div className="shrink-0 text-right">
                    {item.urgent ? (
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1
                          rounded-[4px]
                          bg-[#FFF0E5]
                          px-1.5
                          py-[3px]
                          text-[6px]
                          font-semibold
                          text-[#E87500]
                        "
                      >
                        <Clock3
                          size={8}
                          strokeWidth={2}
                        />

                        {item.time}
                      </span>
                    ) : (
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1
                          text-[7px]
                          font-medium
                          text-[#718599]
                        "
                      >
                        <Clock3
                          size={8}
                          strokeWidth={1.8}
                        />

                        {item.time}
                      </span>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}

      {/* =================================================
          CALENDAR BUTTON
      ================================================== */}

      <button
        type="button"
        className="
          mt-3
          flex
          h-[28px]
          w-full
          items-center
          justify-center
          gap-1.5
          rounded-[5px]
          border
          border-[#DCE5ED]
          bg-[#F8FAFC]
          text-[8px]
          font-semibold
          text-[#315D80]
          transition-colors
          hover:bg-[#EEF4FC]
        "
        onClick={() => {
          console.log(
            "Open Calendar"
          );
        }}
      >
        <CalendarDays
          size={11}
          strokeWidth={1.8}
        />

        View All Follow-ups
      </button>
    </div>
  );
};

export default UpcomingLeadFollowUps;