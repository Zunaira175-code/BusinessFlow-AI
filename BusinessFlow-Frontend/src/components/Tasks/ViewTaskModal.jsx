import {
  X,
  CheckSquare,
  UserRound,
  CalendarDays,
  Building2,
  FileText,
  BriefcaseBusiness,
  UsersRound,
} from "lucide-react";

/* =========================================================
   VIEW TASK MODAL
========================================================= */

const ViewTaskModal = ({
  isOpen = false,
  task = null,
  onClose,
  onEdit,
  onReassign,
}) => {
  if (!isOpen || !task) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-[#071D35]/35
        px-4
        py-5
        backdrop-blur-[2px]
      "
      onClick={onClose}
    >
      <div
        className="
          w-full
          max-w-[520px]
          overflow-hidden
          rounded-[10px]
          border
          border-[#DCE5EE]
          bg-white
          shadow-[0_20px_55px_rgba(15,45,70,0.20)]
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* =================================================
            HEADER
        ================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-[#E3EAF0]
            px-5
            py-3
          "
        >
          <div className="flex items-center gap-2.5">
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-[7px]
                bg-[#EDF7FF]
                text-[#1592D0]
              "
            >
              <CheckSquare
                size={15}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <h2
                className="
                  text-[15px]
                  font-bold
                  leading-[19px]
                  tracking-[-0.15px]
                  text-[#173750]
                "
              >
                Task Details
              </h2>

              <p
                className="
                  mt-0.5
                  text-[9px]
                  font-medium
                  leading-[13px]
                  text-[#7A8D9D]
                "
              >
                Review task information and assignment.
              </p>
            </div>
          </div>

          {/* Close */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-[6px]
              text-[#7890A4]
              transition-all
              hover:bg-[#F1F5F8]
              hover:text-[#173750]
            "
          >
            <X
              size={15}
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* =================================================
            BODY
        ================================================== */}

        <div className="px-5 py-4">
          {/* Task Title */}

          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3
                  className="
                    text-[14px]
                    font-bold
                    leading-[19px]
                    text-[#173750]
                  "
                >
                  {task.title}
                </h3>

                {task.description && (
                  <p
                    className="
                      mt-1
                      text-[10px]
                      font-medium
                      leading-[15px]
                      text-[#71869A]
                    "
                  >
                    {task.description}
                  </p>
                )}
              </div>

              <StatusBadge
                status={task.status}
              />
            </div>
          </div>

          {/* Divider */}

          <div className="my-4 border-t border-[#E8EEF3]" />

          {/* =================================================
              TASK DETAILS GRID
          ================================================== */}

          <div
            className="
              grid
              grid-cols-1
              gap-x-7
              gap-y-4
              sm:grid-cols-2
            "
          >
            {/* Assigned To */}

            <DetailBlock
              icon={
                <UserRound
                  size={12}
                  strokeWidth={1.8}
                />
              }
              label="Assigned To"
              value={
                task.assignedTo ||
                "Unassigned"
              }
            />

            {/* Priority */}

            <DetailBlock
              icon={<FlagIcon />}
              label="Priority"
              value={
                <PriorityBadge
                  priority={task.priority}
                />
              }
            />

            {/* Due Date */}

            <DetailBlock
              icon={
                <CalendarDays
                  size={12}
                  strokeWidth={1.8}
                />
              }
              label="Due Date"
              value={
                task.dueDate ||
                "No due date"
              }
            />

            {/* Related */}

            <DetailBlock
              icon={
                <RelatedIcon
                  type={task.relatedType}
                />
              }
              label="Related To"
              value={
                task.relatedTo ||
                "No related record"
              }
            />

            {/* Created By */}

            <DetailBlock
              icon={
                <UsersRound
                  size={12}
                  strokeWidth={1.8}
                />
              }
              label="Created By"
              value={
                task.createdBy ||
                "Admin User"
              }
            />

            {/* Created Date */}

            <DetailBlock
              icon={
                <CalendarDays
                  size={12}
                  strokeWidth={1.8}
                />
              }
              label="Created"
              value={
                task.createdAt ||
                "—"
              }
            />
          </div>

          {/* =================================================
              ASSIGNEE CARD
          ================================================== */}

          <div
            className="
              mt-4
              rounded-[7px]
              border
              border-[#D9EAF7]
              bg-[#F3F9FE]
              px-3
              py-2.5
            "
          >
            <div className="flex items-center gap-2.5">
              <Avatar
                name={
                  task.assignedTo ||
                  "Unassigned"
                }
              />

              <div className="min-w-0 flex-1">
                <p
                  className="
                    text-[9px]
                    font-semibold
                    leading-[13px]
                    text-[#526B7E]
                  "
                >
                  Assigned team member
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-[10px]
                    font-bold
                    leading-[14px]
                    text-[#173750]
                  "
                >
                  {task.assignedTo ||
                    "Unassigned"}
                </p>
              </div>

              <button
                type="button"
                onClick={onReassign}
                className="
                  h-7
                  rounded-[5px]
                  border
                  border-[#C9DFEF]
                  bg-white
                  px-2.5
                  text-[9px]
                  font-semibold
                  text-[#176B9E]
                  transition-all
                  hover:bg-[#EAF6FF]
                "
              >
                Reassign
              </button>
            </div>
          </div>
        </div>

        {/* =================================================
            FOOTER
        ================================================== */}

        <div
          className="
            flex
            items-center
            justify-end
            gap-2
            border-t
            border-[#E3EAF0]
            px-5
            py-3
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              h-8
              rounded-[6px]
              border
              border-[#D5E0E9]
              bg-white
              px-3.5
              text-[10px]
              font-semibold
              text-[#536B7E]
              transition-all
              hover:bg-[#F7F9FC]
            "
          >
            Close
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="
              h-8
              rounded-[6px]
              bg-[#0B477A]
              px-4
              text-[10px]
              font-semibold
              text-white
              shadow-[0_3px_8px_rgba(11,71,122,0.14)]
              transition-all
              hover:bg-[#0A3D69]
              active:scale-[0.98]
            "
          >
            Edit Task
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   DETAIL BLOCK
========================================================= */

const DetailBlock = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[#7890A4]">
        {icon}

        <p
          className="
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.4px]
          "
        >
          {label}
        </p>
      </div>

      <div
        className="
          mt-1
          min-h-[18px]
          truncate
          text-[10px]
          font-semibold
          text-[#173750]
        "
      >
        {value}
      </div>
    </div>
  );
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ status }) => {
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
        shrink-0
        whitespace-nowrap
        rounded-[5px]
        px-2
        py-1
        text-[8px]
        font-semibold
        ${styles[status] || styles["Not Started"]}
      `}
    >
      {status || "Not Started"}
    </span>
  );
};

/* =========================================================
   PRIORITY BADGE
========================================================= */

const PriorityBadge = ({ priority }) => {
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
        rounded-[5px]
        px-2
        py-1
        text-[8px]
        font-semibold
        ${styles[priority] || styles.Low}
      `}
    >
      {priority || "Low"}
    </span>
  );
};

/* =========================================================
   RELATED ICON
========================================================= */

const RelatedIcon = ({ type }) => {
  switch (type) {
    case "Customer":
      return (
        <Building2
          size={12}
          strokeWidth={1.8}
        />
      );

    case "Lead":
      return (
        <FileText
          size={12}
          strokeWidth={1.8}
        />
      );

    case "Deal":
      return (
        <BriefcaseBusiness
          size={12}
          strokeWidth={1.8}
        />
      );

    default:
      return (
        <UsersRound
          size={12}
          strokeWidth={1.8}
        />
      );
  }
};

/* =========================================================
   AVATAR
========================================================= */

const Avatar = ({ name = "" }) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
      {initials || "—"}
    </div>
  );
};

/* =========================================================
   SIMPLE FLAG ICON
========================================================= */

const FlagIcon = () => {
  return (
    <span
      className="
        block
        h-[11px]
        w-[11px]
        rounded-[2px]
        border
        border-current
      "
    />
  );
};

export default ViewTaskModal;