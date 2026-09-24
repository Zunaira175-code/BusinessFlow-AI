import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import Card from "../common/Card";
import Button from "../common/button";
import Badge from "../common/Badge";

const API_URL = "http://localhost:5000/api";

// =====================================================
// FORMAT DUE TIME
// =====================================================

const formatDueTime = (dateValue) => {
  if (!dateValue) {
    return "No due date";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "No due date";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

// =====================================================
// GET TASK COMPANY / RELATED NAME
// =====================================================

const getTaskRelatedName = (task) => {
  if (task.customer?.name) {
    return task.customer.name;
  }

  if (task.customer?.companyName) {
    return task.customer.companyName;
  }

  if (task.lead?.name) {
    return task.lead.name;
  }

  if (task.lead?.company) {
    return task.lead.company;
  }

  if (task.deal?.title) {
    return task.deal.title;
  }

  return "General Task";
};

// =====================================================
// TASK ITEM
// =====================================================

const TaskItem = ({
  task,
  overdue = false,
  onComplete,
}) => {
  const isCompleted =
    task.status === "Completed";

  const handleComplete = () => {
    if (isCompleted) {
      return;
    }

    onComplete?.(task);
  };

  return (
    <div
      className={`
        flex
        min-h-[58px]
        items-center
        gap-2
        rounded-[7px]
        border
        bg-white
        px-2.5
        py-2
        ${
          overdue
            ? "border-[#F3CACA]"
            : "border-[#DCE5ED]"
        }
      `}
    >
      {/* Checkbox */}

      <button
        type="button"
        aria-label={`Complete ${task.title}`}
        onClick={handleComplete}
        disabled={isCompleted}
        className={`
          flex
          h-[15px]
          w-[15px]
          shrink-0
          items-center
          justify-center
          rounded-[3px]
          border
          transition-colors
          ${
            isCompleted
              ? "border-[#0B3D6B] bg-[#0B3D6B]"
              : "border-[#C9D6E1] bg-white hover:border-[#0B3D6B] hover:bg-[#F5F9FC]"
          }
        `}
      >
        {isCompleted && (
          <span className="text-[9px] font-bold text-white">
            ✓
          </span>
        )}
      </button>

      {/* Content */}

      <div className="min-w-0 flex-1">
        <p
          className={`
            truncate
            text-[9px]
            font-semibold
            leading-[12px]
            ${
              isCompleted
                ? "text-[#8A99A6] line-through"
                : "text-[#29445C]"
            }
          `}
        >
          {task.title}
        </p>

        <p
          className="
            mt-[2px]
            truncate
            text-[8px]
            font-medium
            leading-[11px]
            text-[#8393A2]
          "
        >
          {getTaskRelatedName(task)}

          <span className="mx-1">
            •
          </span>

          <span
            className={
              overdue
                ? "text-[#EF4444]"
                : "text-[#8292A0]"
            }
          >
            {overdue
              ? "Overdue"
              : formatDueTime(
                  task.dueAt
                )}
          </span>
        </p>
      </div>

      {/* Priority */}

      {task.priority === "HIGH" && (
        <Badge
          variant="warning"
          className="text-[7px]"
        >
          HIGH
        </Badge>
      )}
    </div>
  );
};

// =====================================================
// TASK UPCOMING
// =====================================================

const TaskUpcoming = ({
  onAddTask,
}) => {
  const [activeTab, setActiveTab] =
    useState("today");

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [completingTaskId, setCompletingTaskId] =
    useState(null);

  // ===================================================
  // FETCH TASKS
  // ===================================================

  const fetchTasks = async (
    view,
    signal
  ) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem(
        "businessflow_token"
      );

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const params =
        new URLSearchParams();

      params.set(
        "view",
        view
      );

      params.set(
        "limit",
        "10"
      );

      const response = await fetch(
        `${API_URL}/tasks?${params.toString()}`,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          signal,
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
            "Unable to load tasks."
        );
      }

      const taskList =
        Array.isArray(
          result.data
        )
          ? result.data
          : [];

      setTasks(taskList);
    } catch (err) {
      if (
        err.name === "AbortError"
      ) {
        return;
      }

      console.error(
        "Task Fetch Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load tasks."
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  // ===================================================
  // LOAD WHEN TAB CHANGES
  // ===================================================

  useEffect(() => {
    const controller =
      new AbortController();

    fetchTasks(
      activeTab,
      controller.signal
    );

    return () => {
      controller.abort();
    };
  }, [activeTab]);

  // ===================================================
  // COMPLETE TASK
  // ===================================================

  const handleComplete = async (
    task
  ) => {
    if (!task?._id) {
      return;
    }

    try {
      setCompletingTaskId(
        task._id
      );

      const token = localStorage.getItem(
        "businessflow_token"
      );

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_URL}/tasks/${task._id}/complete`,
        {
          method: "PATCH",

          headers: {
            Accept:
              "application/json",

            Authorization: `Bearer ${token}`,
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
            "Unable to complete task."
        );
      }

      // Remove completed task from
      // current dashboard tab.

      setTasks((currentTasks) =>
        currentTasks.filter(
          (item) =>
            item._id !==
            task._id
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
      setCompletingTaskId(null);
    }
  };

  // ===================================================
  // RETRY
  // ===================================================

  const handleRetry = () => {
    const controller =
      new AbortController();

    fetchTasks(
      activeTab,
      controller.signal
    );
  };

  // ===================================================
  // TAB CHANGE
  // ===================================================

  const handleTabChange = (
    tab
  ) => {
    setActiveTab(tab);
  };

  // ===================================================
  // HEADER
  // ===================================================

  return (
    <Card className="h-[330px] overflow-hidden">
      {/* Header */}

      <div
        className="
          flex
          h-[55px]
          items-center
          justify-between
          px-[14px]
        "
      >
        <h2
          className="
            text-[13px]
            font-bold
            tracking-[-0.1px]
            text-[#102F4A]
          "
        >
          Tasks &amp; Upcoming
        </h2>

        <Button
          type="button"
          variant="secondary"
          icon={Plus}
          onClick={() =>
            onAddTask?.()
          }
          className="
            h-[27px]
            rounded-[6px]
            border-[#D8E2EA]
            px-2.5
            text-[9px]
            font-semibold
            text-[#24435D]
          "
        >
          Task
        </Button>
      </div>

      {/* Tabs */}

      <div
        className="
          border-b
          border-[#DCE5ED]
          px-[14px]
          pb-[10px]
        "
      >
        <div className="flex h-[27px] rounded-[6px] bg-[#F8FAFC] p-[3px]">
          {/* Today */}

          <button
            type="button"
            onClick={() =>
              handleTabChange(
                "today"
              )
            }
            className={`
              flex-1
              rounded-[5px]
              text-[9px]
              ${
                activeTab ===
                "today"
                  ? "bg-white font-semibold text-[#29445C] shadow-[0_1px_3px_rgba(16,47,74,0.08)]"
                  : "font-medium text-[#718395]"
              }
            `}
          >
            Today
          </button>

          {/* Upcoming */}

          <button
            type="button"
            onClick={() =>
              handleTabChange(
                "upcoming"
              )
            }
            className={`
              flex-1
              rounded-[5px]
              text-[9px]
              ${
                activeTab ===
                "upcoming"
                  ? "bg-white font-semibold text-[#29445C] shadow-[0_1px_3px_rgba(16,47,74,0.08)]"
                  : "font-medium text-[#718395]"
              }
            `}
          >
            Upcoming
          </button>

          {/* Overdue */}

          <button
            type="button"
            onClick={() =>
              handleTabChange(
                "overdue"
              )
            }
            className={`
              flex-1
              rounded-[5px]
              text-[9px]
              ${
                activeTab ===
                "overdue"
                  ? "bg-white font-semibold text-[#EF4444] shadow-[0_1px_3px_rgba(16,47,74,0.08)]"
                  : "font-medium text-[#EF4444]"
              }
            `}
          >
            Overdue
          </button>
        </div>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="overflow-hidden px-[14px] py-[12px]">
        {/* Loading */}

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="
                    flex
                    min-h-[58px]
                    items-center
                    gap-2
                    rounded-[7px]
                    border
                    border-[#DCE5ED]
                    bg-white
                    px-2.5
                    py-2
                  "
                >
                  <div className="h-[15px] w-[15px] animate-pulse rounded-[3px] bg-[#EDF2F6]" />

                  <div className="flex-1">
                    <div className="h-2.5 w-[55%] animate-pulse rounded bg-[#EDF2F6]" />

                    <div className="mt-2 h-2 w-[40%] animate-pulse rounded bg-[#F1F4F7]" />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="flex min-h-[190px] flex-col items-center justify-center text-center">
            <p className="text-[10px] font-semibold text-[#102F4A]">
              Unable to load tasks
            </p>

            <p className="mt-1 max-w-[260px] text-[8px] font-medium text-[#8192A2]">
              {error}
            </p>

            <button
              type="button"
              onClick={
                handleRetry
              }
              className="
                mt-3
                rounded-[6px]
                border
                border-[#D8E2EA]
                bg-white
                px-3
                py-1.5
                text-[8px]
                font-semibold
                text-[#24435D]
                hover:bg-[#F7F9FB]
              "
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          tasks.length === 0 && (
            <div className="flex min-h-[190px] items-center justify-center text-center">
              <div>
                <p className="text-[10px] font-semibold text-[#102F4A]">
                  No tasks
                </p>

                <p className="mt-1 text-[8px] font-medium text-[#8192A2]">
                  {activeTab ===
                  "today"
                    ? "You have no tasks scheduled for today."
                    : activeTab ===
                        "upcoming"
                      ? "No upcoming tasks found."
                      : "You have no overdue tasks."}
                </p>
              </div>
            </div>
          )}

        {/* Tasks */}

        {!loading &&
          !error &&
          tasks.length > 0 && (
            <div className="space-y-3">
              {/* Section Label */}

              <div>
                <div className="mb-2 flex items-center gap-1.5">
                  <span
                    className={`
                      h-[6px]
                      w-[6px]
                      rounded-full
                      ${
                        activeTab ===
                        "overdue"
                          ? "bg-[#EF4444]"
                          : "bg-[#1592D0]"
                      }
                    `}
                  />

                  <span
                    className={`
                      text-[8px]
                      font-bold
                      uppercase
                      tracking-[0.4px]
                      ${
                        activeTab ===
                        "overdue"
                          ? "text-[#EF4444]"
                          : "text-[#587086]"
                      }
                    `}
                  >
                    {activeTab ===
                    "today"
                      ? "Today"
                      : activeTab ===
                          "upcoming"
                        ? "Upcoming"
                        : "Overdue"}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {tasks.map(
                    (task) => (
                      <div
                        key={
                          task._id
                        }
                        className={
                          completingTaskId ===
                          task._id
                            ? "pointer-events-none opacity-60"
                            : ""
                        }
                      >
                        <TaskItem
                          task={
                            task
                          }
                          overdue={
                            activeTab ===
                            "overdue"
                          }
                          onComplete={
                            handleComplete
                          }
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
      </div>
    </Card>
  );
};

export default TaskUpcoming;