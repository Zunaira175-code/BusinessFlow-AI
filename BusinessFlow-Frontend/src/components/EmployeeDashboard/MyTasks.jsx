import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

const API_URL = "http://localhost:5000/api";

const formatTaskDate = (dateValue) => {
  if (!dateValue) return "No due date";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "No due date";
  }

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const taskDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  if (taskDay.getTime() === today.getTime()) {
    return `Today, ${time}`;
  }

  if (taskDay.getTime() === tomorrow.getTime()) {
    return `Tomorrow, ${time}`;
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "2-digit",
  });
};

const getPriorityData = (priority) => {
  switch (priority) {
    case "HIGH":
      return {
        label: "High",
        className: "bg-[#FFF0F0] text-[#EF4444]",
      };

    case "LOW":
      return {
        label: "Low",
        className: "bg-[#EAF7FC] text-[#079BEA]",
      };

    case "MEDIUM":
    default:
      return {
        label: "Medium",
        className: "bg-[#FFF6E8] text-[#F59E0B]",
      };
  }
};

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completingTaskId, setCompletingTaskId] = useState(null);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("businessflow_token");

      if (!token) {
        setError("Authentication required.");
        return;
      }

      const response = await fetch(
        `${API_URL}/tasks?view=all&page=1&limit=3`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load your tasks."
        );
      }

      setTasks(result.data || []);
    } catch (err) {
      console.error("My Tasks Error:", err);
      setError(err.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleTask = async (task) => {
    if (task.status === "Completed") {
      return;
    }

    try {
      setCompletingTaskId(task._id);

      const token = localStorage.getItem("businessflow_token");

      if (!token) {
        setError("Authentication required.");
        return;
      }

      const response = await fetch(
        `${API_URL}/tasks/${task._id}/complete`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to complete task."
        );
      }

      const updatedTask = result.data;

      setTasks((prevTasks) =>
        prevTasks.map((item) =>
          item._id === task._id ? updatedTask : item
        )
      );
    } catch (err) {
      console.error("Complete Task Error:", err);
      setError(err.message || "Failed to complete task.");
    } finally {
      setCompletingTaskId(null);
    }
  };

  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        className="
          flex
          min-h-[64px]
          items-center
          justify-between
          border-b
          border-[#DCE5ED]
          px-4
          py-3
        "
      >
        {/* Left */}
        <div>
          <h2
            className="
              text-[13px]
              font-bold
              leading-[16px]
              text-[#17324D]
            "
          >
            My Tasks
          </h2>

          <p
            className="
              mt-1
              text-[8px]
              leading-[11px]
              text-[#8495A5]
            "
          >
            Tasks assigned to you
          </p>
        </div>

        {/* View All */}
        <button
          type="button"
          onClick={fetchTasks}
          className="
            text-[8px]
            font-semibold
            text-[#079BEA]
            transition-colors
            hover:text-[#0B3D6B]
          "
        >
          View All Tasks
        </button>
      </div>

      {/* =====================================================
          TASK LIST
      ====================================================== */}
      <div>
        {/* Loading */}
        {loading && (
          <div className="flex min-h-[171px] items-center justify-center">
            <p className="text-[9px] text-[#8495A5]">
              Loading tasks...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex min-h-[171px] items-center justify-center px-4">
            <div className="text-center">
              <p className="text-[9px] text-[#EF4444]">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchTasks}
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
          </div>
        )}

        {/* Empty */}
        {!loading && !error && tasks.length === 0 && (
          <div className="flex min-h-[171px] items-center justify-center">
            <p className="text-[9px] text-[#8495A5]">
              No tasks assigned to you.
            </p>
          </div>
        )}

        {/* Tasks */}
        {!loading &&
          !error &&
          tasks.length > 0 &&
          tasks.map((task, index) => {
            const completed = task.status === "Completed";
            const priority = getPriorityData(task.priority);
            const isCompleting = completingTaskId === task._id;

            return (
              <div
                key={task._id}
                className={`
                  flex
                  min-h-[57px]
                  items-center
                  gap-2.5
                  px-3
                  py-2.5
                  ${
                    index !== tasks.length - 1
                      ? "border-b border-[#E2E9EF]"
                      : ""
                  }
                `}
              >
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleTask(task)}
                  disabled={completed || isCompleting}
                  aria-label={`Mark ${task.title} as ${
                    completed ? "incomplete" : "complete"
                  }`}
                  className={`
                    flex
                    h-[13px]
                    w-[13px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[3px]
                    border
                    border-[#9AAAB8]
                    bg-white
                    transition-colors
                    ${
                      completed
                        ? "border-[#0B3D6B] bg-[#0B3D6B]"
                        : "hover:border-[#315D80]"
                    }
                    ${
                      isCompleting
                        ? "cursor-wait opacity-50"
                        : ""
                    }
                  `}
                >
                  {completed && (
                    <span
                      className="
                        text-[9px]
                        font-bold
                        leading-none
                        text-white
                      "
                    >
                      ✓
                    </span>
                  )}
                </button>

                {/* Task Information */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`
                      truncate
                      text-[10px]
                      font-semibold
                      leading-[13px]
                      ${
                        completed
                          ? "text-[#8A9AAA] line-through"
                          : "text-[#17324D]"
                      }
                    `}
                  >
                    {task.title}
                  </p>

                  <div
                    className="
                      mt-1
                      flex
                      items-center
                      gap-1
                      text-[7px]
                      leading-[10px]
                      text-[#8A9AAA]
                    "
                  >
                    <CalendarDays
                      size={8}
                      strokeWidth={1.7}
                    />

                    <span>
                      {formatTaskDate(task.dueAt)}
                    </span>
                  </div>
                </div>

                {/* Priority */}
                <span
                  className={`
                    shrink-0
                    rounded-[4px]
                    px-[6px]
                    py-[3px]
                    text-[7px]
                    font-semibold
                    leading-[9px]
                    ${priority.className}
                  `}
                >
                  {priority.label}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MyTasks;