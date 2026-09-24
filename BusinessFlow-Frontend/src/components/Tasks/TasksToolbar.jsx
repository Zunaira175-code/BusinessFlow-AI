import { useMemo } from "react";

/* =========================================================
   TASKS TOOLBAR
========================================================= */

const TasksToolbar = ({
  search = "",
  onSearchChange,
  assignee = "All Assignees",
  onAssigneeChange,
  priority = "All Priorities",
  onPriorityChange,
  status = "All Statuses",
  onStatusChange,
  type = "All Types",
  onTypeChange,
  onClearFilters,
}) => {
  // =======================================================
  // FILTER OPTIONS
  // =======================================================

  const assignees = useMemo(
    () => [
      "All Assignees",
      "Alex Rivers",
      "Sarah Khan",
      "John Smith",
      "Emily Davis",
      "Michael Chen",
      "Lisa Park",
      "David Wilson",
    ],
    []
  );

  const priorities = useMemo(
    () => [
      "All Priorities",
      "High",
      "Medium",
      "Low",
    ],
    []
  );

  const statuses = useMemo(
    () => [
      "All Statuses",
      "Pending",
      "In Progress",
      "Not Started",
      "Completed",
    ],
    []
  );

  const types = useMemo(
    () => [
      "All Types",
      "Customer",
      "Lead",
      "Deal",
      "Internal",
      "Multiple",
    ],
    []
  );

  // =======================================================
  // ACTIVE FILTERS
  // =======================================================

  const hasActiveFilters =
    search ||
    assignee !== "All Assignees" ||
    priority !== "All Priorities" ||
    status !== "All Statuses" ||
    type !== "All Types";

  // =======================================================
  // CLEAR FILTERS
  // =======================================================

  const clearFilters = () => {
    onSearchChange?.("");
    onAssigneeChange?.("All Assignees");
    onPriorityChange?.("All Priorities");
    onStatusChange?.("All Statuses");
    onTypeChange?.("All Types");

    onClearFilters?.();
  };

  // =======================================================
  // UI
  // =======================================================

  return (
    <div
      className="
        grid
        grid-cols-[minmax(0,1fr)_115px_115px_115px_115px_29px]
        gap-2
      "
    >
      {/* =================================================
          SEARCH
      ================================================== */}

      <div className="relative">
        {/* Search Icon */}

        <svg
          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-[#71869A]
          "
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="11"
            cy="11"
            r="6.5"
            stroke="currentColor"
            strokeWidth="1.7"
          />

          <path
            d="M16 16L21 21"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>

        <input
          type="text"
          value={search}
          onChange={(e) =>
            onSearchChange?.(
              e.target.value
            )
          }
          placeholder="Search by task title, description, or assignee..."
          className="
            h-[29px]
            w-full
            rounded-[6px]
            border
            border-[#C9D9E8]
            bg-white
            pl-9
            pr-3
            text-[8px]
            text-[#17324D]
            outline-none
            placeholder:text-[#8192A2]
            focus:border-[#8DBBE3]
            focus:ring-2
            focus:ring-[#E4F0FA]
          "
        />
      </div>

      {/* =================================================
          ASSIGNEE
      ================================================== */}

      <ToolbarSelect
        value={assignee}
        onChange={onAssigneeChange}
        options={assignees}
        ariaLabel="Filter by assignee"
      />

      {/* =================================================
          PRIORITY
      ================================================== */}

      <ToolbarSelect
        value={priority}
        onChange={onPriorityChange}
        options={priorities}
        ariaLabel="Filter by priority"
      />

      {/* =================================================
          STATUS
      ================================================== */}

      <ToolbarSelect
        value={status}
        onChange={onStatusChange}
        options={statuses}
        ariaLabel="Filter by status"
      />

      {/* =================================================
          TYPE
      ================================================== */}

      <ToolbarSelect
        value={type}
        onChange={onTypeChange}
        options={types}
        ariaLabel="Filter by task type"
      />

      {/* =================================================
          FILTER / CLEAR BUTTON
      ================================================== */}

      <button
        type="button"
        onClick={clearFilters}
        className={`
          flex
          h-[29px]
          w-[29px]
          items-center
          justify-center
          rounded-[6px]
          transition-colors
          ${
            hasActiveFilters
              ? "text-[#0B5A96] hover:bg-[#EAF4FC]"
              : "text-[#71869A] hover:bg-[#F3F6F9]"
          }
        `}
        aria-label={
          hasActiveFilters
            ? "Clear filters"
            : "Filter"
        }
        title={
          hasActiveFilters
            ? "Clear filters"
            : "Filter"
        }
      >
        {hasActiveFilters ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M6 6L18 18"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />

            <path
              d="M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M4 6H20"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />

            <path
              d="M7 12H17"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />

            <path
              d="M10 18H14"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

/* =========================================================
   TOOLBAR SELECT
========================================================= */

const ToolbarSelect = ({
  value,
  onChange,
  options,
  ariaLabel,
}) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) =>
          onChange?.(
            e.target.value
          )
        }
        aria-label={ariaLabel}
        className="
          h-[29px]
          w-full
          cursor-pointer
          appearance-none
          rounded-[6px]
          border
          border-[#C9D9E8]
          bg-white
          px-3
          pr-7
          text-[8px]
          text-[#17324D]
          outline-none
          focus:border-[#8DBBE3]
          focus:ring-2
          focus:ring-[#E4F0FA]
        "
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

      {/* Chevron */}

      <svg
        className="
          pointer-events-none
          absolute
          right-2.5
          top-1/2
          -translate-y-1/2
          text-[#71869A]
        "
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M6 9L12 15L18 9"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default TasksToolbar;