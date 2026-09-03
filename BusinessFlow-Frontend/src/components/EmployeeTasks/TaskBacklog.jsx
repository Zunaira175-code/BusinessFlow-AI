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
} from "lucide-react";

const tasks = [
  {
    task: "Follow up with Acme Corporation",
    relatedTo: "Acme Corporation",
    priority: "High",
    priorityClass: "bg-[#FFE5E5] text-[#EF4444]",
    status: "In Progress",
    statusClass: "text-[#0784C7]",
    dueDate: "Today, 2:00 PM",
    relatedIcon: "company",
    statusType: "progress",
  },
  {
    task: "Prepare proposal for TechFlow Inc.",
    relatedTo: "TechFlow Inc.",
    priority: "High",
    priorityClass: "bg-[#FFE5E5] text-[#EF4444]",
    status: "To Do",
    statusClass: "text-[#60758A]",
    dueDate: "Tomorrow, 11:00 AM",
    relatedIcon: "company",
    statusType: "todo",
  },
  {
    task: "Update Global Dynamics record",
    relatedTo: "Global Dynamics",
    priority: "Medium",
    priorityClass: "bg-[#FFF0DD] text-[#E87500]",
    status: "In Progress",
    statusClass: "text-[#0784C7]",
    dueDate: "Aug 30, 2026",
    relatedIcon: "company",
    statusType: "progress",
  },
  {
    task: "Review Nexa Solutions lead",
    relatedTo: "Nexa Solutions",
    priority: "Medium",
    priorityClass: "bg-[#FFF0DD] text-[#E87500]",
    status: "To Do",
    statusClass: "text-[#60758A]",
    dueDate: "Sep 01, 2026",
    relatedIcon: "person",
    statusType: "todo",
  },
  {
    task: "Schedule BrightPath Ltd. demo",
    relatedTo: "BrightPath Ltd.",
    priority: "Low",
    priorityClass: "bg-[#E5EFFB] text-[#607EA1]",
    status: "Completed",
    statusClass: "text-[#20A65A]",
    dueDate: "Aug 28, 2026",
    relatedIcon: "company",
    statusType: "completed",
    completed: true,
  },
];

const TaskBacklog = () => {
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
          <span className="text-[14px] leading-none">•••</span>
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
        <FilterButton label="Status: All" />

        {/* Priority */}
        <FilterButton label="Priority: All" />

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
            {tasks.map((task, index) => (
              <TaskRow
                key={index}
                task={task}
              />
            ))}
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
          Showing 1-5 of 18 tasks
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-[4px]
              border
              border-[#DCE5ED]
              text-[#8A9AAA]
              hover:bg-[#F5F8FA]
            "
          >
            <ChevronLeft size={10} />
          </button>

          <button
            type="button"
            className="
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-[4px]
              border
              border-[#DCE5ED]
              text-[#60758A]
              hover:bg-[#F5F8FA]
            "
          >
            <ChevronRight size={10} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   TASK ROW
========================================================= */

const TaskRow = ({ task }) => {
  const RelatedIcon =
    task.relatedIcon === "person" ? UserRound : Building2;

  return (
    <tr
      className={`
        border-b
        border-[#E5EBF0]
        last:border-b-0
        ${
          task.completed
            ? "text-[#9AA8B5]"
            : "text-[#17324D]"
        }
      `}
    >
      {/* Checkbox */}
      <td className="px-3 py-2.5 align-middle">
        <button
          type="button"
          aria-label={`Mark ${task.task} complete`}
          className="flex items-center justify-center"
        >
          {task.completed ? (
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
              "
            />
          )}
        </button>
      </td>

      {/* Task */}
      <td className="max-w-[130px] px-3 py-2.5 align-middle">
        <p
          className={`
            text-[7px]
            font-semibold
            leading-[10px]
            ${
              task.completed
                ? "line-through text-[#9AA8B5]"
                : "text-[#17324D]"
            }
          `}
        >
          {task.task}
        </p>
      </td>

      {/* Related To */}
      <td className="px-3 py-2.5 align-middle">
        <div className="flex items-center gap-1.5">
          <RelatedIcon
            size={10}
            strokeWidth={1.6}
            className="shrink-0 text-[#718599]"
          />

          <span
            className="
              max-w-[80px]
              text-[7px]
              leading-[9px]
              text-[#60758A]
            "
          >
            {task.relatedTo}
          </span>
        </div>
      </td>

      {/* Priority */}
      <td className="px-3 py-2.5 align-middle">
        <span
          className={`
            inline-flex
            rounded-[4px]
            px-1.5
            py-1
            text-[6px]
            font-semibold
            ${task.priorityClass}
          `}
        >
          {task.priority}
        </span>
      </td>

      {/* Status */}
      <td className="px-3 py-2.5 align-middle">
        <div className="flex items-center gap-1">
          {task.statusType === "progress" && (
            <Link2
              size={10}
              strokeWidth={1.8}
              className="text-[#0784C7]"
            />
          )}

          {task.statusType === "todo" && (
            <Circle
              size={9}
              strokeWidth={1.5}
              className="text-[#718599]"
            />
          )}

          {task.statusType === "completed" && (
            <CheckCircle2
              size={10}
              strokeWidth={1.8}
              className="text-[#20A65A]"
            />
          )}

          <span
            className={`
              text-[7px]
              font-medium
              ${task.statusClass}
            `}
          >
            {task.status}
          </span>
        </div>
      </td>

      {/* Due Date */}
      <td className="px-3 py-2.5 align-middle">
        <span
          className={`
            text-[7px]
            leading-[10px]
            ${
              task.dueDate.includes("Today")
                ? "font-medium text-[#E87500]"
                : "text-[#60758A]"
            }
          `}
        >
          {task.dueDate}
        </span>
      </td>
    </tr>
  );
};

/* =========================================================
   FILTER BUTTON
========================================================= */

const FilterButton = ({ label }) => {
  return (
    <button
      type="button"
      className="
        flex
        h-[28px]
        shrink-0
        items-center
        justify-between
        gap-2
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
      <span>{label}</span>

      <ChevronDown
        size={10}
        strokeWidth={1.7}
      />
    </button>
  );
};

const headerClass = `
  px-3
  py-2
  text-left
  text-[7px]
  font-semibold
  text-[#60758A]
`;

export default TaskBacklog;