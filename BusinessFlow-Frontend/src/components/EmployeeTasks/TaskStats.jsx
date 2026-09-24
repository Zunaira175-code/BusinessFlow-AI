import { useEffect, useState } from "react";

const TaskStats = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    dueToday: 0,
    overdue: 0,
    highPriority: 0,
    highPriorityStuck: 0,
    completionPercentage: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH TASK STATS
  // =====================================================

  const fetchTaskStats = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("businessflow_token");

      if (!token) {
        setError("Authentication token not found.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/tasks/me/stats",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to fetch task statistics."
        );
      }

      setStats({
        totalTasks:
          result.data?.totalTasks || 0,

        pending:
          result.data?.pending || 0,

        inProgress:
          result.data?.inProgress || 0,

        completed:
          result.data?.completed || 0,

        cancelled:
          result.data?.cancelled || 0,

        dueToday:
          result.data?.dueToday || 0,

        overdue:
          result.data?.overdue || 0,

        highPriority:
          result.data?.highPriority || 0,

        highPriorityStuck:
          result.data?.highPriorityStuck || 0,

        completionPercentage:
          result.data?.completionPercentage || 0,
      });
    } catch (err) {
      console.error(
        "Task Stats Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load task statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {
    fetchTaskStats();
  }, []);

  // =====================================================
  // STATS DATA
  // =====================================================

  const taskStats = [
    {
      title: "Total Tasks",

      value: loading
        ? "..."
        : stats.totalTasks,

      badge: loading
        ? "Loading..."
        : `${stats.dueToday} due today`,

      badgeClass:
        "bg-[#FFF1D9] text-[#E87500]",

      valueClass:
        "text-[#0B2E50]",
    },

    {
      title: "In Progress",

      value: loading
        ? "..."
        : stats.inProgress,

      badge: loading
        ? "Loading..."
        : `${stats.highPriority} high priority`,

      badgeClass:
        "bg-[#FFE5E5] text-[#EF4444]",

      valueClass:
        "text-[#0B2E50]",
    },

    {
      title: "Completed",

      value: loading
        ? "..."
        : stats.completed,

      badge: loading
        ? "Loading..."
        : `${stats.completionPercentage}% completion`,

      badgeClass:
        "bg-[#E7F8ED] text-[#20A65A]",

      valueClass:
        "text-[#16A34A]",
    },

    {
      title: "Overdue",

      value: loading
        ? "..."
        : stats.overdue,

      badge: "Action req.",

      badgeClass:
        "bg-white text-[#EF4444]",

      valueClass:
        "text-[#EF2B2B]",

      overdue: true,
    },
  ];

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="w-full rounded-[9px] border border-[#DCE5ED] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <p className="text-[9px] font-medium text-[#EF4444]">
          {error}
        </p>

        <button
          type="button"
          onClick={fetchTaskStats}
          className="mt-2 rounded-[5px] bg-[#0B2E50] px-3 py-1.5 text-[7px] font-semibold text-white transition hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
      {taskStats.map((stat) => (
        <div
          key={stat.title}
          className={`
            relative
            min-h-[76px]
            rounded-[9px]
            border
            bg-white
            px-4
            py-3
            shadow-[0_1px_2px_rgba(15,23,42,0.03)]
            ${
              stat.overdue
                ? "border-[#FF4D4D] border-t-[3px]"
                : "border-[#DCE5ED]"
            }
          `}
        >
          {/* Title */}
          <p
            className="
              text-[7px]
              font-semibold
              capitalize
              text-[#60758A]
            "
          >
            {stat.title}
          </p>

          {/* Value */}
          <p
            className={`
              mt-1
              text-[21px]
              font-bold
              leading-none
              tracking-[-0.4px]
              ${stat.valueClass}
            `}
          >
            {stat.value}
          </p>

          {/* Badge */}
          <span
            className={`
              mt-2
              inline-flex
              rounded-[5px]
              px-2
              py-[3px]
              text-[6px]
              font-medium
              ${stat.badgeClass}
            `}
          >
            {stat.badge}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;