import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5000";

const UpcomingTasks = () => {
  const [upcomingTasks, setUpcomingTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // FETCH UPCOMING TASKS
  // =====================================================

  const fetchUpcomingTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "businessflow_token"
        );

      if (!token) {
        setError(
          "Authentication token not found."
        );

        return;
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/tasks/me/upcoming?limit=5`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              Accept:
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
            "Failed to fetch upcoming tasks."
        );
      }

      setUpcomingTasks(
        Array.isArray(
          result.data
        )
          ? result.data
          : []
      );
    } catch (err) {
      console.error(
        "Upcoming Tasks Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load upcoming tasks."
      );

      setUpcomingTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {
    fetchUpcomingTasks();

    const handleTaskUpdated =
      () => {
        fetchUpcomingTasks();
      };

    window.addEventListener(
      "businessflow-task-updated",
      handleTaskUpdated
    );

    return () => {
      window.removeEventListener(
        "businessflow-task-updated",
        handleTaskUpdated
      );
    };
  }, []);

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
        p-3
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between">
        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          Upcoming
        </h2>

        <button
          type="button"
          onClick={
            fetchUpcomingTasks
          }
          className="
            text-[7px]
            font-medium
            text-[#60758A]
            underline
            underline-offset-2
            hover:text-[#17324D]
          "
        >
          View all
        </button>
      </div>

      {/* =================================================
          LOADING
      ================================================== */}

      {loading && (
        <div className="mt-3">
          {[1, 2].map(
            (item) => (
              <div
                key={item}
                className={`
                  flex
                  items-start
                  gap-3
                  py-2.5
                  ${
                    item !== 2
                      ? "border-b border-[#E3EAF0]"
                      : ""
                  }
                `}
              >
                {/* Date skeleton */}

                <div className="w-[30px] shrink-0 text-center">
                  <div className="mx-auto h-2 w-5 animate-pulse rounded bg-[#EDF2F6]" />

                  <div className="mx-auto mt-1 h-4 w-5 animate-pulse rounded bg-[#EDF2F6]" />
                </div>

                {/* Line */}

                <div className="h-[32px] w-px bg-[#E5EBF0]" />

                {/* Content */}

                <div className="min-w-0 flex-1">
                  <div className="h-2 w-28 animate-pulse rounded bg-[#EDF2F6]" />

                  <div className="mt-1.5 h-1.5 w-16 animate-pulse rounded bg-[#F1F4F7]" />
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
          <div className="mt-3 rounded-[6px] bg-[#FFF8F8] px-2.5 py-2">
            <p
              className="
                text-[7px]
                font-medium
                text-[#EF4444]
              "
            >
              {error}
            </p>

            <button
              type="button"
              onClick={
                fetchUpcomingTasks
              }
              className="
                mt-1.5
                rounded-[4px]
                bg-[#0B2E50]
                px-2
                py-1
                text-[6px]
                font-semibold
                text-white
                hover:opacity-90
              "
            >
              Retry
            </button>
          </div>
        )}

      {/* =================================================
          EMPTY
      ================================================== */}

      {!loading &&
        !error &&
        upcomingTasks.length ===
          0 && (
          <div className="py-6 text-center">
            <p
              className="
                text-[8px]
                font-semibold
                text-[#17324D]
              "
            >
              No upcoming tasks
            </p>

            <p
              className="
                mt-1
                text-[6px]
                text-[#718599]
              "
            >
              You have no active tasks scheduled for the next 31 days.
            </p>
          </div>
        )}

      {/* =================================================
          ITEMS
      ================================================== */}

      {!loading &&
        !error &&
        upcomingTasks.length >
          0 && (
          <div className="mt-3">
            {upcomingTasks.map(
              (item, index) => (
                <UpcomingTaskItem
                  key={
                    item._id ||
                    item.title
                  }
                  task={item}
                  isLast={
                    index ===
                    upcomingTasks.length -
                      1
                  }
                />
              )
            )}
          </div>
        )}
    </div>
  );
};

// =========================================================
// UPCOMING TASK ITEM
// =========================================================

const UpcomingTaskItem = ({
  task,
  isLast,
}) => {
  const dateInfo =
    getDateInfo(
      task.dueAt
    );

  const relatedName =
    getRelatedName(
      task
    );

  return (
    <div
      className={`
        flex
        items-start
        gap-3
        py-2.5
        ${
          !isLast
            ? "border-b border-[#E3EAF0]"
            : ""
        }
      `}
    >
      {/* =================================================
          DATE
      ================================================== */}

      <div className="w-[30px] shrink-0 text-center">
        <p
          className="
            text-[7px]
            font-semibold
            uppercase
            text-[#17324D]
          "
        >
          {dateInfo.month}
        </p>

        <p
          className="
            mt-0.5
            text-[13px]
            font-bold
            leading-none
            text-[#17324D]
          "
        >
          {dateInfo.day}
        </p>
      </div>

      {/* =================================================
          VERTICAL LINE
      ================================================== */}

      <div
        className="
          h-[32px]
          w-px
          bg-[#0784C7]
        "
      />

      {/* =================================================
          CONTENT
      ================================================== */}

      <div className="min-w-0 flex-1">
        <p
          className="
            truncate
            text-[7px]
            font-bold
            text-[#17324D]
          "
          title={
            task.title
          }
        >
          {task.title ||
            "Untitled Task"}
        </p>

        <p
          className="
            mt-1
            truncate
            text-[6px]
            text-[#718599]
          "
          title={
            relatedName
          }
        >
          {relatedName}
        </p>
      </div>
    </div>
  );
};

// =========================================================
// DATE FORMATTER
// =========================================================

const getDateInfo = (
  dueAt
) => {
  if (!dueAt) {
    return {
      month: "--",
      day: "--",
    };
  }

  const date =
    new Date(dueAt);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return {
      month: "--",
      day: "--",
    };
  }

  return {
    month:
      date.toLocaleDateString(
        "en-US",
        {
          month: "short",
        }
      ),

    day:
      date.toLocaleDateString(
        "en-US",
        {
          day: "2-digit",
        }
      ),
  };
};

// =========================================================
// RELATED RECORD NAME
// =========================================================

const getRelatedName = (
  task
) => {
  // Customer

  if (task.customerId) {
    const customer =
      task.customerId;

    if (
      customer.companyName
    ) {
      return customer.companyName;
    }

    const name =
      `${customer.firstName || ""} ${
        customer.lastName || ""
      }`.trim();

    return name ||
      "Customer";
  }

  // Lead

  if (task.leadId) {
    const lead =
      task.leadId;

    if (lead.company) {
      return lead.company;
    }

    const name =
      `${lead.firstName || ""} ${
        lead.lastName || ""
      }`.trim();

    return name ||
      "Lead";
  }

  // Deal

  if (task.dealId) {
    return (
      task.dealId.title ||
      "Deal"
    );
  }

  // Internal

  return "Internal";
};

export default UpcomingTasks;