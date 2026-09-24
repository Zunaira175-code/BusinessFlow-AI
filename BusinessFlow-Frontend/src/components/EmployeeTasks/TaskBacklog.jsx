import { useEffect, useState } from "react";

import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  Link2,
  Circle,
  CheckCircle2,
  Building2,
  UserRound,
  ChevronLeft,
  ChevronRight,
  BriefcaseBusiness,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000";

const TaskBacklog = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [tasks, setTasks] = useState([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [priority, setPriority] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [completingTaskId, setCompletingTaskId] =
    useState(null);

  // =====================================================
  // FETCH TASKS
  // =====================================================

  const fetchTasks = async () => {
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

        setLoading(false);

        return;
      }

      const params =
        new URLSearchParams();

      params.set("view", "all");

      params.set(
        "page",
        String(page)
      );

      params.set("limit", "5");

      if (search.trim()) {
        params.set(
          "search",
          search.trim()
        );
      }

      if (status) {
        params.set(
          "status",
          status
        );
      }

      if (priority) {
        params.set(
          "priority",
          priority
        );
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/tasks?${params.toString()}`,
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
            "Failed to fetch tasks."
        );
      }

      setTasks(
        Array.isArray(
          result.data
        )
          ? result.data
          : []
      );

      setPagination({
        page:
          result.pagination?.page ||
          page,

        limit:
          result.pagination?.limit ||
          5,

        total:
          result.pagination?.total ||
          0,

        totalPages:
          result.pagination
            ?.totalPages || 1,
      });
    } catch (err) {
      console.error(
        "Task Backlog Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load tasks."
      );

      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD TASKS
  // =====================================================

  useEffect(() => {
    fetchTasks();
  }, [page, status, priority, search]);

  // =====================================================
  // FILTER HANDLERS
  // =====================================================

  const handleStatusChange = (
    event
  ) => {
    setStatus(
      event.target.value
    );

    setPage(1);
  };

  const handlePriorityChange = (
    event
  ) => {
    setPriority(
      event.target.value
    );

    setPage(1);
  };

  const handleSearchChange = (
    event
  ) => {
    setSearch(
      event.target.value
    );

    setPage(1);
  };

  // =====================================================
  // COMPLETE TASK
  // =====================================================

  const handleCompleteTask = async (
    taskId,
    currentStatus
  ) => {
    if (
      currentStatus ===
        "Completed" ||
      completingTaskId === taskId
    ) {
      return;
    }

    try {
      setCompletingTaskId(
        taskId
      );

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
          `${API_BASE_URL}/api/tasks/${taskId}/complete`,
          {
            method: "PATCH",

            headers: {
              Authorization: `Bearer ${token}`,
              Accept:
                "application/json",
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
            "Failed to complete task."
        );
      }

      // Refresh backlog
      await fetchTasks();

      // Tell TaskStats to refresh
      window.dispatchEvent(
        new Event(
          "businessflow-task-updated"
        )
      );
    } catch (err) {
      console.error(
        "Complete Task Error:",
        err
      );

      setError(
        err.message ||
          "Unable to complete task."
      );
    } finally {
      setCompletingTaskId(
        null
      );
    }
  };

  // =====================================================
  // PAGINATION
  // =====================================================

  const handlePreviousPage = () => {
    if (
      page <= 1 ||
      loading
    ) {
      return;
    }

    setPage(
      (currentPage) =>
        currentPage - 1
    );
  };

  const handleNextPage = () => {
    if (
      page >=
        pagination.totalPages ||
      loading
    ) {
      return;
    }

    setPage(
      (currentPage) =>
        currentPage + 1
    );
  };

  // =====================================================
  // PAGINATION TEXT
  // =====================================================

  const getShowingText = () => {
    if (pagination.total === 0) {
      return "Showing 0 tasks";
    }

    const start =
      (page - 1) *
        pagination.limit +
      1;

    const end = Math.min(
      page * pagination.limit,
      pagination.total
    );

    return `Showing ${start}-${end} of ${pagination.total} tasks`;
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
        shadow-[0_1px_2px_rgba(15,23,42,0.03)]
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between px-4 py-3">
        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          Task Backlog
        </h2>

        <button
          type="button"
          className="
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-md
            text-[#60758A]
            hover:bg-[#F3F6F9]
          "
          aria-label="Task options"
        >
          <span className="text-[14px] leading-none">
            •••
          </span>
        </button>
      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <div
        className="
          flex
          flex-col
          gap-2
          border-b
          border-[#DCE5ED]
          px-4
          pb-3
          sm:flex-row
          sm:items-center
        "
      >
        {/* Search */}

        <div className="relative min-w-0 flex-1">
          <Search
            size={13}
            strokeWidth={1.7}
            className="
              absolute
              left-2.5
              top-1/2
              -translate-y-1/2
              text-[#718599]
            "
          />

          <input
            type="text"
            value={search}
            onChange={
              handleSearchChange
            }
            placeholder="Search tasks..."
            className="
              h-[28px]
              w-full
              rounded-[5px]
              border
              border-[#DCE5ED]
              bg-white
              pl-8
              pr-2
              text-[7px]
              text-[#17324D]
              outline-none
              placeholder:text-[#8A9AAA]
              focus:border-[#9BBFDF]
            "
          />
        </div>

        {/* Status */}

        <div className="relative shrink-0">
          <select
            value={status}
            onChange={
              handleStatusChange
            }
            className="
              h-[28px]
              min-w-[94px]
              appearance-none
              rounded-[5px]
              border
              border-[#DCE5ED]
              bg-white
              px-2.5
              pr-7
              text-[7px]
              font-medium
              text-[#60758A]
              outline-none
              focus:border-[#9BBFDF]
            "
          >
            <option value="">
              Status: All
            </option>

            <option value="Pending">
              Status: To Do
            </option>

            <option value="In Progress">
              Status: In Progress
            </option>

            <option value="Completed">
              Status: Completed
            </option>

            <option value="Cancelled">
              Status: Cancelled
            </option>
          </select>

          <ChevronDown
            size={10}
            strokeWidth={1.7}
            className="
              pointer-events-none
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              text-[#60758A]
            "
          />
        </div>

        {/* Priority */}

        <div className="relative shrink-0">
          <select
            value={priority}
            onChange={
              handlePriorityChange
            }
            className="
              h-[28px]
              min-w-[101px]
              appearance-none
              rounded-[5px]
              border
              border-[#DCE5ED]
              bg-white
              px-2.5
              pr-7
              text-[7px]
              font-medium
              text-[#60758A]
              outline-none
              focus:border-[#9BBFDF]
            "
          >
            <option value="">
              Priority: All
            </option>

            <option value="HIGH">
              Priority: High
            </option>

            <option value="MEDIUM">
              Priority: Medium
            </option>

            <option value="LOW">
              Priority: Low
            </option>
          </select>

          <ChevronDown
            size={10}
            strokeWidth={1.7}
            className="
              pointer-events-none
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              text-[#60758A]
            "
          />
        </div>

        {/* More */}

        <button
          type="button"
          className="
            flex
            h-[28px]
            shrink-0
            items-center
            gap-1
            rounded-[5px]
            border
            border-[#DCE5ED]
            bg-white
            px-2.5
            text-[7px]
            font-medium
            text-[#60758A]
            hover:bg-[#F8FAFC]
          "
        >
          <SlidersHorizontal
            size={10}
            strokeWidth={1.7}
          />

          More
        </button>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          className="
            border-b
            border-[#DCE5ED]
            bg-[#FFF8F8]
            px-4
            py-2
          "
        >
          <div className="flex items-center justify-between gap-3">
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
                fetchTasks
              }
              className="
                shrink-0
                rounded-[4px]
                bg-[#0B2E50]
                px-2.5
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
        </div>
      )}

      {/* =====================================================
          TABLE
      ====================================================== */}

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="border-b border-[#DCE5ED] bg-[#FBFCFD]">
              <th className="w-[35px] px-3 py-2"></th>

              <th className={headerClass}>
                Task
              </th>

              <th className={headerClass}>
                Related To
              </th>

              <th className={headerClass}>
                Priority
              </th>

              <th className={headerClass}>
                Status
              </th>

              <th className={headerClass}>
                Due Date
              </th>
            </tr>
          </thead>

          <tbody>
            {/* =================================================
                LOADING
            ================================================== */}

            {loading &&
              Array.from({
                length: 5,
              }).map(
                (_, index) => (
                  <LoadingRow
                    key={
                      `loading-${index}`
                    }
                  />
                )
              )}

            {/* =================================================
                EMPTY
            ================================================== */}

            {!loading &&
              !error &&
              tasks.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="
                      px-4
                      py-10
                      text-center
                    "
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div
                        className="
                          mb-2
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          bg-[#F3F6F9]
                        "
                      >
                        <BriefcaseBusiness
                          size={14}
                          strokeWidth={1.6}
                          className="text-[#718599]"
                        />
                      </div>

                      <p
                        className="
                          text-[8px]
                          font-semibold
                          text-[#17324D]
                        "
                      >
                        No tasks found
                      </p>

                      <p
                        className="
                          mt-1
                          text-[7px]
                          text-[#8A9AAA]
                        "
                      >
                        Try changing your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}

            {/* =================================================
                TASKS
            ================================================== */}

            {!loading &&
              tasks.map(
                (task) => (
                  <TaskRow
                    key={
                      task._id
                    }
                    task={task}
                    completingTaskId={
                      completingTaskId
                    }
                    onComplete={
                      handleCompleteTask
                    }
                  />
                )
              )}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          FOOTER / PAGINATION
      ====================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          border-t
          border-[#DCE5ED]
          px-3
          py-2
        "
      >
        <p
          className="
            text-[7px]
            text-[#60758A]
          "
        >
          {getShowingText()}
        </p>

        <div className="flex items-center gap-1">
          {/* Previous */}

          <button
            type="button"
            onClick={
              handlePreviousPage
            }
            disabled={
              page <= 1 ||
              loading
            }
            className={`
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-[4px]
              border
              border-[#DCE5ED]
              transition
              ${
                page <= 1 ||
                loading
                  ? "cursor-not-allowed text-[#C5CED6]"
                  : "text-[#60758A] hover:bg-[#F5F8FA]"
              }
            `}
            aria-label="Previous page"
          >
            <ChevronLeft
              size={10}
            />
          </button>

          {/* Next */}

          <button
            type="button"
            onClick={
              handleNextPage
            }
            disabled={
              page >=
                pagination.totalPages ||
              loading
            }
            className={`
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-[4px]
              border
              border-[#DCE5ED]
              transition
              ${
                page >=
                  pagination.totalPages ||
                loading
                  ? "cursor-not-allowed text-[#C5CED6]"
                  : "text-[#60758A] hover:bg-[#F5F8FA]"
              }
            `}
            aria-label="Next page"
          >
            <ChevronRight
              size={10}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================
// TASK ROW
// =========================================================

const TaskRow = ({
  task,
  completingTaskId,
  onComplete,
}) => {
  const isCompleted =
    task.status ===
    "Completed";

  const isCompleting =
    completingTaskId ===
    task._id;

  // =======================================================
  // RELATED RECORD
  // =======================================================

  const related = getRelatedRecord(
    task
  );

  // =======================================================
  // STATUS
  // =======================================================

  const statusInfo =
    getStatusInfo(
      task.status
    );

  // =======================================================
  // PRIORITY
  // =======================================================

  const priorityInfo =
    getPriorityInfo(
      task.priority
    );

  // =======================================================
  // DUE DATE
  // =======================================================

  const dueInfo =
    getDueDateInfo(
      task.dueAt,
      task.status
    );

  return (
    <tr
      className={`
        border-b
        border-[#E5EBF0]
        last:border-b-0
        ${
          isCompleted
            ? "text-[#9AA8B5]"
            : "text-[#17324D]"
        }
      `}
    >
      {/* ===================================================
          CHECKBOX
      ==================================================== */}

      <td className="px-3 py-2.5 align-middle">
        <button
          type="button"
          onClick={() =>
            onComplete(
              task._id,
              task.status
            )
          }
          disabled={
            isCompleted ||
            isCompleting
          }
          aria-label={
            isCompleted
              ? "Task completed"
              : "Mark task complete"
          }
          className={`
            flex
            items-center
            justify-center
            ${
              isCompleting
                ? "cursor-wait opacity-50"
                : ""
            }
          `}
        >
          {isCompleted ? (
            <CheckCircle2
              size={13}
              strokeWidth={2}
              className="text-[#20A65A]"
            />
          ) : (
            <span
              className="
                h-[13px]
                w-[13px]
                rounded-[3px]
                border
                border-[#C9D4DE]
                transition
                hover:border-[#0784C7]
                hover:bg-[#F5FAFD]
              "
            />
          )}
        </button>
      </td>

      {/* ===================================================
          TASK
      ==================================================== */}

      <td className="max-w-[130px] px-3 py-2.5 align-middle">
        <p
          className={`
            text-[7px]
            font-semibold
            leading-[10px]
            ${
              isCompleted
                ? "line-through text-[#9AA8B5]"
                : "text-[#17324D]"
            }
          `}
          title={
            task.title
          }
        >
          {task.title ||
            "Untitled Task"}
        </p>
      </td>

      {/* ===================================================
          RELATED TO
      ==================================================== */}

      <td className="px-3 py-2.5 align-middle">
        <div className="flex items-center gap-1.5">
          <related.Icon
            size={10}
            strokeWidth={1.6}
            className="shrink-0 text-[#718599]"
          />

          <span
            className="
              max-w-[100px]
              truncate
              text-[7px]
              leading-[9px]
              text-[#60758A]
            "
            title={
              related.name
            }
          >
            {related.name}
          </span>
        </div>
      </td>

      {/* ===================================================
          PRIORITY
      ==================================================== */}

      <td className="px-3 py-2.5 align-middle">
        <span
          className={`
            inline-flex
            rounded-[4px]
            px-1.5
            py-1
            text-[6px]
            font-semibold
            ${priorityInfo.className}
          `}
        >
          {priorityInfo.label}
        </span>
      </td>

      {/* ===================================================
          STATUS
      ==================================================== */}

      <td className="px-3 py-2.5 align-middle">
        <div className="flex items-center gap-1">
          {statusInfo.type ===
            "progress" && (
            <Link2
              size={10}
              strokeWidth={1.8}
              className="text-[#0784C7]"
            />
          )}

          {statusInfo.type ===
            "todo" && (
            <Circle
              size={9}
              strokeWidth={1.5}
              className="text-[#718599]"
            />
          )}

          {statusInfo.type ===
            "completed" && (
            <CheckCircle2
              size={10}
              strokeWidth={1.8}
              className="text-[#20A65A]"
            />
          )}

          {statusInfo.type ===
            "cancelled" && (
            <Circle
              size={9}
              strokeWidth={1.5}
              className="text-[#EF4444]"
            />
          )}

          <span
            className={`
              text-[7px]
              font-medium
              ${statusInfo.className}
            `}
          >
            {statusInfo.label}
          </span>
        </div>
      </td>

      {/* ===================================================
          DUE DATE
      ==================================================== */}

      <td className="px-3 py-2.5 align-middle">
        <span
          className={`
            text-[7px]
            leading-[10px]
            ${dueInfo.className}
          `}
        >
          {dueInfo.label}
        </span>
      </td>
    </tr>
  );
};

// =========================================================
// LOADING ROW
// =========================================================

const LoadingRow = () => {
  return (
    <tr className="border-b border-[#E5EBF0]">
      <td className="px-3 py-3">
        <div className="h-[13px] w-[13px] animate-pulse rounded-[3px] bg-[#EDF2F6]" />
      </td>

      <td className="px-3 py-3">
        <div className="h-2 w-28 animate-pulse rounded bg-[#EDF2F6]" />
      </td>

      <td className="px-3 py-3">
        <div className="h-2 w-20 animate-pulse rounded bg-[#EDF2F6]" />
      </td>

      <td className="px-3 py-3">
        <div className="h-4 w-10 animate-pulse rounded bg-[#EDF2F6]" />
      </td>

      <td className="px-3 py-3">
        <div className="h-2 w-16 animate-pulse rounded bg-[#EDF2F6]" />
      </td>

      <td className="px-3 py-3">
        <div className="h-2 w-20 animate-pulse rounded bg-[#EDF2F6]" />
      </td>
    </tr>
  );
};

// =========================================================
// RELATED RECORD HELPER
// =========================================================

const getRelatedRecord = (
  task
) => {
  // Customer

  if (task.customerId) {
    const customer =
      task.customerId;

    const customerName =
      `${customer.firstName || ""} ${
        customer.lastName || ""
      }`.trim();

    return {
      name:
        customer.companyName ||
        customerName ||
        "Customer",

      Icon: Building2,
    };
  }

  // Lead

  if (task.leadId) {
    const lead =
      task.leadId;

    const leadName =
      `${lead.firstName || ""} ${
        lead.lastName || ""
      }`.trim();

    return {
      name:
        lead.company ||
        leadName ||
        "Lead",

      Icon: UserRound,
    };
  }

  // Deal

  if (task.dealId) {
    const deal =
      task.dealId;

    return {
      name:
        deal.title ||
        "Deal",

      Icon: BriefcaseBusiness,
    };
  }

  // Internal task

  return {
    name: "Internal",

    Icon: UserRound,
  };
};

// =========================================================
// STATUS HELPER
// =========================================================

const getStatusInfo = (
  status
) => {
  switch (status) {
    case "In Progress":
      return {
        label:
          "In Progress",

        className:
          "text-[#0784C7]",

        type:
          "progress",
      };

    case "Completed":
      return {
        label:
          "Completed",

        className:
          "text-[#20A65A]",

        type:
          "completed",
      };

    case "Cancelled":
      return {
        label:
          "Cancelled",

        className:
          "text-[#EF4444]",

        type:
          "cancelled",
      };

    case "Pending":
    default:
      return {
        label:
          "To Do",

        className:
          "text-[#60758A]",

        type:
          "todo",
      };
  }
};

// =========================================================
// PRIORITY HELPER
// =========================================================

const getPriorityInfo = (
  priority
) => {
  switch (priority) {
    case "HIGH":
      return {
        label:
          "High",

        className:
          "bg-[#FFE5E5] text-[#EF4444]",
      };

    case "LOW":
      return {
        label:
          "Low",

        className:
          "bg-[#E5EFFB] text-[#607EA1]",
      };

    case "MEDIUM":
    default:
      return {
        label:
          "Medium",

        className:
          "bg-[#FFF0DD] text-[#E87500]",
      };
  }
};

// =========================================================
// DUE DATE HELPER
// =========================================================

const getDueDateInfo = (
  dueAt,
  status
) => {
  if (!dueAt) {
    return {
      label:
        "No due date",

      className:
        "text-[#8A9AAA]",
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
      label:
        "Invalid date",

      className:
        "text-[#EF4444]",
    };
  }

  const now =
    new Date();

  const todayStart =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

  const tomorrowStart =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

  const taskDayStart =
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

  const isToday =
    taskDayStart.getTime() ===
    todayStart.getTime();

  const isTomorrow =
    taskDayStart.getTime() ===
    tomorrowStart.getTime();

  const isOverdue =
    date < now &&
    !isToday &&
    status !==
      "Completed";

  // Today

  if (isToday) {
    const time =
      date.toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
        }
      );

    return {
      label:
        `Today, ${time}`,

      className:
        "font-medium text-[#E87500]",
    };
  }

  // Tomorrow

  if (isTomorrow) {
    const time =
      date.toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
        }
      );

    return {
      label:
        `Tomorrow, ${time}`,

      className:
        "text-[#60758A]",
    };
  }

  // Overdue

  if (isOverdue) {
    return {
      label:
        date.toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }
        ),

      className:
        "font-medium text-[#EF4444]",
    };
  }

  // Normal future/completed date

  return {
    label:
      date.toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }
      ),

    className:
      status ===
      "Completed"
        ? "text-[#60758A]"
        : "text-[#60758A]",
  };
};

// =========================================================
// HEADER CLASS
// =========================================================

const headerClass = `
  px-3
  py-2
  text-left
  text-[7px]
  font-semibold
  text-[#60758A]
`;

export default TaskBacklog;