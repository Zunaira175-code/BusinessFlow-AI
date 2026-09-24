import { useEffect, useState } from "react";

import {
  ClipboardList,
  Clock3,
  RefreshCw,
  CircleCheck,
} from "lucide-react";

/* =========================================================
   API
========================================================= */

const API_URL =
  "http://localhost:5000/api/tasks/stats";

/* =========================================================
   TASK STATS
========================================================= */

const TaskStats = () => {
  const [stats, setStats] =
    useState({
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     FETCH STATS
  ======================================================= */

  const fetchStats = async () => {
    setLoading(true);
    setError("");

    try {
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
        await fetch(API_URL, {
          method: "GET",

          headers: {
            Accept:
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },
        });

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          "Unable to fetch task statistics."
        );
      }

      setStats({
        total:
          result.data?.total || 0,

        pending:
          result.data?.pending || 0,

        inProgress:
          result.data?.inProgress || 0,

        completed:
          result.data?.completed || 0,
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

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    fetchStats();
  }, []);

  /* =======================================================
     CALCULATIONS
  ======================================================= */

  const total =
    Number(stats.total) || 0;

  const pending =
    Number(stats.pending) || 0;

  const inProgress =
    Number(stats.inProgress) || 0;

  const completed =
    Number(stats.completed) || 0;

  const pendingPercentage =
    total > 0
      ? Math.round(
          (pending / total) * 100
        )
      : 0;

  const inProgressPercentage =
    total > 0
      ? Math.round(
          (inProgress / total) * 100
        )
      : 0;

  const completedPercentage =
    total > 0
      ? Math.round(
          (completed / total) * 100
        )
      : 0;

  /* =======================================================
     UI STATS
  ======================================================= */

  const cards = [
    {
      title: "TOTAL TASKS",

      value: total,

      bottom:
        "All tasks in your company",

      type: "success",

      icon: ClipboardList,

      iconClass:
        "text-[#DDEEF5]",
    },

    {
      title: "PENDING",

      value: pending,

      bottom:
        `${pendingPercentage}% of total tasks`,

      type: "normal",

      icon: Clock3,

      iconClass:
        "text-[#F7E6D2]",
    },

    {
      title: "IN PROGRESS",

      value: inProgress,

      bottom:
        `${inProgressPercentage}% of total tasks`,

      type: "normal",

      icon: RefreshCw,

      iconClass:
        "text-[#DDEEF5]",
    },

    {
      title: "COMPLETED",

      value: completed,

      bottom:
        `${completedPercentage}% of total tasks`,

      type: "info",

      icon: CircleCheck,

      iconClass:
        "text-[#DDF2E7]",
    },
  ];

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <section className="grid w-full grid-cols-4 gap-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            className="
              h-[103px]
              animate-pulse
              rounded-[9px]
              border
              border-[#DCE5EF]
              bg-white
              px-4
              py-3
            "
          >
            <div className="h-[8px] w-[70px] rounded bg-[#E8EEF3]" />

            <div className="mt-[8px] h-[25px] w-[45px] rounded bg-[#E8EEF3]" />

            <div className="mt-[8px] h-[10px] w-[95px] rounded bg-[#E8EEF3]" />
          </div>
        ))}
      </section>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <section className="grid w-full grid-cols-4 gap-4">
        <div
          className="
            col-span-4
            flex
            min-h-[103px]
            items-center
            justify-between
            rounded-[9px]
            border
            border-[#F1C9C9]
            bg-[#FFF7F7]
            px-4
          "
        >
          <span className="text-[10px] font-medium text-[#B42318]">
            {error}
          </span>

          <button
            type="button"
            onClick={fetchStats}
            className="
              rounded-[5px]
              bg-[#071D35]
              px-3
              py-1.5
              text-[9px]
              font-semibold
              text-white
              transition
              hover:bg-[#0B477A]
            "
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="grid w-full grid-cols-4 gap-4">
      {cards.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
              relative
              h-[103px]
              overflow-hidden
              rounded-[9px]
              border
              border-[#DCE5EF]
              bg-white
              px-4
              py-3
            "
          >
            {/* =================================================
                CONTENT
            ================================================== */}

            <div className="relative z-10">
              {/* Title */}

              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.05em]
                  text-[#71869A]
                "
              >
                {stat.title}
              </p>

              {/* Value */}

              <p
                className="
                  mt-[5px]
                  text-[23px]
                  font-bold
                  leading-[27px]
                  text-[#071D35]
                "
              >
                {stat.value}
              </p>

              {/* Footer */}

              <div className="mt-[4px]">
                {stat.type ===
                "success" ? (
                  <span
                    className="
                      inline-flex
                      items-center
                      rounded-[4px]
                      bg-[#E7F7EE]
                      px-[6px]
                      py-[3px]
                      text-[8px]
                      font-semibold
                      text-[#16A05D]
                    "
                  >
                    {stat.bottom}
                  </span>
                ) : stat.type ===
                  "info" ? (
                  <span
                    className="
                      inline-flex
                      items-center
                      rounded-[4px]
                      bg-[#E6F3FA]
                      px-[6px]
                      py-[3px]
                      text-[8px]
                      font-medium
                      text-[#1989C5]
                    "
                  >
                    {stat.bottom}
                  </span>
                ) : (
                  <span
                    className="
                      text-[8px]
                      text-[#6F8294]
                    "
                  >
                    {stat.bottom}
                  </span>
                )}
              </div>
            </div>

            {/* =================================================
                ICON
            ================================================== */}

            <div
              className={`
                absolute
                right-3
                top-3
                ${stat.iconClass}
              `}
            >
              <Icon
                size={24}
                strokeWidth={1.6}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default TaskStats;