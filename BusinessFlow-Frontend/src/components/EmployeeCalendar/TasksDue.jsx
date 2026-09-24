import { useEffect, useState } from "react";
import { ClipboardCheck } from "lucide-react";

const API_BASE_URL =
  "http://localhost:5000";

const TasksDue = () => {
  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [completingTaskId, setCompletingTaskId] =
    useState(null);

  // =====================================================
  // FETCH MY UPCOMING TASKS
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

        setTasks([]);

        return;
      }

      const params =
        new URLSearchParams();

      params.set(
        "view",
        "upcoming"
      );

      params.set(
        "page",
        "1"
      );

      params.set(
        "limit",
        "5"
      );

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

      const fetchedTasks =
        Array.isArray(
          result.data
        )
          ? result.data
          : [];

      setTasks(
        fetchedTasks
      );
    } catch (err) {
      console.error(
        "Tasks Due Error:",
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
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchTasks();

    const handleTaskUpdated =
      () => {
        fetchTasks();
      };

    const handleCalendarUpdated =
      () => {
        fetchTasks();
      };

    window.addEventListener(
      "businessflow-task-updated",
      handleTaskUpdated
    );

    window.addEventListener(
      "businessflow-calendar-updated",
      handleCalendarUpdated
    );

    return () => {
      window.removeEventListener(
        "businessflow-task-updated",
        handleTaskUpdated
      );

      window.removeEventListener(
        "businessflow-calendar-updated",
        handleCalendarUpdated
      );
    };
  }, []);

  // =====================================================
  // COMPLETE TASK
  // =====================================================

  const handleCompleteTask =
    async (taskId) => {
      try {
        if (!taskId) {
          return;
        }

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

        // Remove completed task
        // from upcoming list

        setTasks(
          (previousTasks) =>
            previousTasks.filter(
              (task) =>
                task._id !==
                taskId
            )
        );

        // Notify other task components

        window.dispatchEvent(
          new CustomEvent(
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
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="flex items-center gap-2">
        <ClipboardCheck
          size={15}
          strokeWidth={1.8}
          className="text-[#E87500]"
        />

        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          My Tasks Due
        </h2>
      </div>

      {/* =================================================
          LOADING
      ================================================== */}

      {loading && (
        <div className="mt-3 space-y-3">
          {[1, 2].map(
            (item) => (
              <div
                key={item}
                className="
                  flex
                  items-start
                  gap-2
                "
              >
                <div className="mt-[1px] h-[12px] w-[12px] animate-pulse rounded-[3px] bg-[#EDF2F6]" />

                <div className="flex-1">
                  <div className="h-2 w-32 animate-pulse rounded bg-[#EDF2F6]" />

                  <div className="mt-1 h-2 w-12 animate-pulse rounded bg-[#F1F4F7]" />
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
                fetchTasks
              }
              className="
                mt-1.5
                rounded-[4px]
                bg-[#0B3D6B]
                px-2.5
                py-1
                text-[6px]
                font-semibold
                text-white
                hover:bg-[#082F54]
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
        tasks.length ===
          0 && (
          <div
            className="
              mt-3
              rounded-[6px]
              bg-[#F8FAFC]
              px-2.5
              py-4
              text-center
            "
          >
            <p
              className="
                text-[8px]
                font-semibold
                text-[#17324D]
              "
            >
              No tasks due
            </p>

            <p
              className="
                mt-1
                text-[6px]
                text-[#718599]
              "
            >
              You don't have any upcoming tasks.
            </p>
          </div>
        )}

      {/* =================================================
          TASKS
      ================================================== */}

      {!loading &&
        !error &&
        tasks.length >
          0 && (
          <div className="mt-3 space-y-3">
            {tasks.map(
              (task) => (
                <TaskItem
                  key={
                    task._id
                  }
                  task={task}
                  completing={
                    completingTaskId ===
                    task._id
                  }
                  onComplete={
                    handleCompleteTask
                  }
                />
              )
            )}
          </div>
        )}

      {/* =================================================
          VIEW MY TASKS
      ================================================== */}

      <button
        type="button"
        className="
          mt-4
          text-[7px]
          font-semibold
          text-[#0089D6]
          hover:underline
        "
      >
        View My Tasks
      </button>
    </div>
  );
};

// =========================================================
// TASK ITEM
// =========================================================

const TaskItem = ({
  task,
  completing,
  onComplete,
}) => {
  const title =
    task.title ||
    "Untitled Task";

  const dueDate =
    formatTaskDate(
      task.dueAt
    );

  return (
    <label
      className={`
        flex
        cursor-pointer
        items-start
        gap-2
        ${
          completing
            ? "opacity-60"
            : ""
        }
      `}
    >
      {/* Checkbox */}

      <input
        type="checkbox"
        disabled={
          completing ||
          task.status ===
            "Completed"
        }
        checked={
          task.status ===
          "Completed"
        }
        onChange={() => {
          if (
            task.status !==
            "Completed"
          ) {
            onComplete(
              task._id
            );
          }
        }}
        className="
          mt-[1px]
          h-[12px]
          w-[12px]
          rounded-[3px]
          border-[#C9D4DE]
          accent-[#0B3D6B]
        "
      />

      {/* Task Content */}

      <div className="min-w-0">
        <p
          className="
            text-[7px]
            font-semibold
            leading-[10px]
            text-[#17324D]
          "
        >
          {title}
        </p>

        <p
          className={`
            mt-0.5
            text-[6px]
            ${
              isToday(
                task.dueAt
              )
                ? "font-medium text-[#E87500]"
                : "text-[#718599]"
            }
          `}
        >
          {dueDate}
        </p>
      </div>
    </label>
  );
};

// =========================================================
// FORMAT TASK DATE
// =========================================================

const formatTaskDate = (
  value
) => {
  if (!value) {
    return "--";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "--";
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

  const taskDateStart =
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

  // Today

  if (
    taskDateStart.getTime() ===
    todayStart.getTime()
  ) {
    return `Today, ${date.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    )}`;
  }

  // Tomorrow

  if (
    taskDateStart.getTime() ===
    tomorrowStart.getTime()
  ) {
    return `Tomorrow, ${date.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    )}`;
  }

  // Other date

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );
};

// =========================================================
// IS TODAY
// =========================================================

const isToday = (
  value
) => {
  if (!value) {
    return false;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return false;
  }

  const now =
    new Date();

  return (
    date.getFullYear() ===
      now.getFullYear() &&
    date.getMonth() ===
      now.getMonth() &&
    date.getDate() ===
      now.getDate()
  );
};

export default TasksDue;