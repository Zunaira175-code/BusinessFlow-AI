import {
  MoreHorizontal,
  Eye,
  Pencil,
  UserRound,
  Trash2,
} from "lucide-react";

/* =========================================================
   TASK ROW
========================================================= */

const TaskRow = ({
  task,
  isOpen = false,
  onToggleActions,
  onView,
  onEdit,
  onReassign,
  onDelete,
}) => {
  return (
    <tr
      className="
        border-b
        border-[#E7EDF2]
        transition-colors
        duration-150
        last:border-b-0
        hover:bg-[#FBFCFE]
      "
    >
      {/* ===================================================
          CHECKBOX
      ==================================================== */}

      <td className="w-[50px] px-4 py-3 align-middle">
        <input
          type="checkbox"
          aria-label={`Select ${task.title}`}
          className="
            h-4
            w-4
            cursor-pointer
            rounded
            border-[#B8C8D6]
            accent-[#0B477A]
          "
        />
      </td>

      {/* ===================================================
          TASK TITLE
      ==================================================== */}

      <td className="max-w-[320px] px-4 py-3 align-middle">
        <div className="min-w-0">
          <p
            className="
              truncate
              text-[11px]
              font-semibold
              leading-[16px]
              text-[#173750]
            "
            title={task.title}
          >
            {task.title}
          </p>

          <p
            className="
              mt-1
              truncate
              text-[9px]
              font-medium
              leading-[14px]
              text-[#8293A2]
            "
            title={task.description}
          >
            {task.description}
          </p>
        </div>
      </td>

      {/* ===================================================
          ASSIGNED TO
      ==================================================== */}

      <td className="px-4 py-3 align-middle">
        <div className="flex items-center gap-2">
          <Avatar name={task.assignedTo} />

          <div className="min-w-0">
            <p
              className="
                max-w-[120px]
                truncate
                whitespace-nowrap
                text-[10px]
                font-semibold
                text-[#173750]
              "
              title={task.assignedTo}
            >
              {task.assignedTo || "Unassigned"}
            </p>
          </div>
        </div>
      </td>

      {/* ===================================================
          PRIORITY
      ==================================================== */}

      <td className="px-4 py-3 align-middle">
        <PriorityBadge
          priority={task.priority}
        />
      </td>

      {/* ===================================================
          DUE DATE
      ==================================================== */}

      <td className="px-4 py-3 align-middle">
        <div>
          <p
            className={`
              whitespace-nowrap
              text-[10px]
              font-semibold
              ${
                task.dueLabel === "Today"
                  ? "text-[#C94848]"
                  : "text-[#173750]"
              }
            `}
          >
            {task.dueDate || "—"}
          </p>

          {task.dueLabel && (
            <p
              className={`
                mt-0.5
                text-[8px]
                font-semibold
                ${
                  task.dueLabel === "Today"
                    ? "text-[#E04C4C]"
                    : "text-[#8192A1]"
                }
              `}
            >
              {task.dueLabel}
            </p>
          )}
        </div>
      </td>

      {/* ===================================================
          STATUS
      ==================================================== */}

      <td className="px-4 py-3 align-middle">
        <StatusBadge
          status={task.status}
        />
      </td>

      {/* ===================================================
          CREATED BY
      ==================================================== */}

      <td className="px-4 py-3 align-middle">
        <div className="flex items-center gap-2">
          <div
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#E5EBF0]
              text-[8px]
              font-bold
              text-[#526B7E]
            "
          >
            {getInitials(task.createdBy)}
          </div>

          <span
            className="
              whitespace-nowrap
              text-[10px]
              font-semibold
              text-[#173750]
            "
          >
            {task.createdBy || "Admin User"}
          </span>
        </div>
      </td>

      {/* ===================================================
          ACTIONS
      ==================================================== */}

      <td className="relative px-4 py-3 align-middle">
        <button
          type="button"
          onClick={onToggleActions}
          aria-label={`Actions for ${task.title}`}
          aria-expanded={isOpen}
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-md
            text-[#71869A]
            transition-all
            duration-200
            hover:bg-[#EDF3F7]
            hover:text-[#173750]
            active:scale-95
          "
        >
          <MoreHorizontal
            size={16}
            strokeWidth={2}
          />
        </button>

        {/* =================================================
            ACTION MENU
        ================================================== */}

        {isOpen && (
          <div
            className="
              absolute
              right-4
              top-[39px]
              z-50
              w-[145px]
              overflow-hidden
              rounded-[8px]
              border
              border-[#DCE5EE]
              bg-white
              py-1
              shadow-[0_10px_30px_rgba(15,45,70,0.15)]
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* View */}

            <ActionMenuItem
              icon={
                <Eye
                  size={13}
                  strokeWidth={1.8}
                />
              }
              label="View Task"
              onClick={onView}
            />

            {/* Edit */}

            <ActionMenuItem
              icon={
                <Pencil
                  size={13}
                  strokeWidth={1.8}
                />
              }
              label="Edit Task"
              onClick={onEdit}
            />

            {/* Reassign */}

            <ActionMenuItem
              icon={
                <UserRound
                  size={13}
                  strokeWidth={1.8}
                />
              }
              label="Reassign"
              onClick={onReassign}
            />

            <div className="my-1 border-t border-[#EDF1F4]" />

            {/* Delete */}

            <ActionMenuItem
              icon={
                <Trash2
                  size={13}
                  strokeWidth={1.8}
                />
              }
              label="Delete"
              danger
              onClick={onDelete}
            />
          </div>
        )}
      </td>
    </tr>
  );
};

/* =========================================================
   ACTION MENU ITEM
========================================================= */
const ActionMenuItem = ({
  icon,
  label,
  onClick,
  danger = false,
}) => {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      className={`
        flex
        w-full
        items-center
        gap-2.5
        px-3
        py-[7px]
        text-left
        text-[10px]
        font-semibold
        leading-[14px]
        transition-all
        duration-150
        ${
          danger
            ? `
              text-[#D94A4A]
              hover:bg-[#FFF5F5]
            `
            : `
              text-[#425C70]
              hover:bg-[#F4F8FB]
              hover:text-[#173750]
            `
        }
      `}
    >
      <span
        className={`
          flex
          h-4
          w-4
          shrink-0
          items-center
          justify-center
          ${
            danger
              ? "text-[#D94A4A]"
              : "text-[#71869A]"
          }
        `}
      >
        {icon}
      </span>

      <span className="truncate">
        {label}
      </span>
    </button>
  );
};

/* =========================================================
   AVATAR
========================================================= */

const Avatar = ({ name = "" }) => {
  const initials = getInitials(name);

  return (
    <div
      className="
        flex
        h-7
        w-7
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-[#E4F1FA]
        text-[8px]
        font-bold
        text-[#176B9E]
      "
    >
      {initials}
    </div>
  );
};

/* =========================================================
   PRIORITY BADGE
========================================================= */

const PriorityBadge = ({
  priority,
}) => {
  const styles = {
    High:
      "bg-[#FFF0F0] text-[#E04A4A]",
    Medium:
      "bg-[#FFF7E8] text-[#D99122]",
    Low:
      "bg-[#EAF6FF] text-[#168BCB]",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        rounded-[6px]
        px-2.5
        py-1.5
        text-[9px]
        font-semibold
        ${styles[priority] || styles.Low}
      `}
    >
      {priority || "Low"}
    </span>
  );
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({
  status,
}) => {
  const styles = {
    Pending:
      "bg-[#FFF7E8] text-[#D99122]",

    "In Progress":
      "bg-[#EAF6FF] text-[#168BCB]",

    "Not Started":
      "bg-[#EEF1F4] text-[#687D8E]",

    Completed:
      "bg-[#EFFBF5] text-[#20A866]",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        whitespace-nowrap
        rounded-[6px]
        px-2.5
        py-1.5
        text-[9px]
        font-semibold
        ${styles[status] || styles["Not Started"]}
      `}
    >
      {status || "Not Started"}
    </span>
  );
};

/* =========================================================
   INITIALS
========================================================= */

const getInitials = (
  name = ""
) => {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "—";
  }

  return words
    .map((word) =>
      word.charAt(0)
    )
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export default TaskRow;