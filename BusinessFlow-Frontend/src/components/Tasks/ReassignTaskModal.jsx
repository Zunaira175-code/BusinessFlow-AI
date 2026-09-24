import {
  X,
  UserRound,
  ChevronDown,
  Check,
} from "lucide-react";

/* =========================================================
   DEFAULT EMPLOYEES
   Later API se actual employees aayenge.
========================================================= */

const defaultEmployees = [
  {
    name: "Alex Rivers",
    email: "alex@businessflow.ai",
  },
  {
    name: "Sarah Khan",
    email: "sarah@businessflow.ai",
  },
  {
    name: "John Smith",
    email: "john@businessflow.ai",
  },
  {
    name: "Emily Davis",
    email: "emily@businessflow.ai",
  },
  {
    name: "Michael Chen",
    email: "michael@businessflow.ai",
  },
  {
    name: "Lisa Park",
    email: "lisa@businessflow.ai",
  },
  {
    name: "David Wilson",
    email: "david@businessflow.ai",
  },
];

/* =========================================================
   REASSIGN TASK MODAL
========================================================= */

const ReassignTaskModal = ({
  isOpen = false,
  task = null,
  employees = defaultEmployees,
  selectedEmployee = "",
  onEmployeeChange,
  onClose,
  onReassign,
  loading = false,
}) => {
  if (!isOpen || !task) {
    return null;
  }

  const currentEmployee = employees.find(
    (employee) =>
      employee.name === task.assignedTo
  );

  const initials = getInitials(
    task.assignedTo
  );

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
        py-6
        backdrop-blur-[2px]
      "
      onClick={onClose}
    >
      <div
        className="
          w-full
          max-w-[500px]
          overflow-hidden
          rounded-[12px]
          border
          border-[#DCE5EE]
          bg-white
          shadow-[0_24px_70px_rgba(15,45,70,0.22)]
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
            px-6
            py-4
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-[8px]
                bg-[#EDF7FF]
                text-[#1592D0]
              "
            >
              <UserRound
                size={17}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <h2
                className="
                  text-[17px]
                  font-bold
                  tracking-[-0.2px]
                  text-[#173750]
                "
              >
                Reassign Task
              </h2>

              <p
                className="
                  mt-1
                  text-[10px]
                  font-medium
                  text-[#7A8D9D]
                "
              >
                Change the employee assigned to this task.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close modal"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-[6px]
              text-[#7890A4]
              transition-all
              hover:bg-[#F1F5F8]
              hover:text-[#173750]
              disabled:opacity-50
            "
          >
            <X
              size={17}
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* =================================================
            BODY
        ================================================== */}

        <div className="px-6 py-5">
          {/* Task Information */}
          <div
            className="
              rounded-[8px]
              border
              border-[#D9EAF7]
              bg-[#F3F9FE]
              px-4
              py-3
            "
          >
            <p
              className="
                text-[12px]
                font-bold
                text-[#173750]
              "
            >
              {task.title}
            </p>

            {task.description && (
              <p
                className="
                  mt-1
                  line-clamp-2
                  text-[10px]
                  font-medium
                  leading-[17px]
                  text-[#71869A]
                "
              >
                {task.description}
              </p>
            )}
          </div>

          {/* Current + New Assignee */}
          <div
            className="
              mt-5
              space-y-5
            "
          >
            {/* Current Assignee */}

            <div>
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.5px]
                  text-[#8495A4]
                "
              >
                Current Assignee
              </p>

              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-3
                  rounded-[8px]
                  border
                  border-[#E0E7ED]
                  bg-[#FAFCFE]
                  px-3
                  py-2.5
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#E4F1FA]
                    text-[9px]
                    font-bold
                    text-[#176B9E]
                  "
                >
                  {initials}
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      text-[10px]
                      font-semibold
                      text-[#173750]
                    "
                  >
                    {task.assignedTo ||
                      "Unassigned"}
                  </p>

                  <p
                    className="
                      mt-0.5
                      truncate
                      text-[9px]
                      font-medium
                      text-[#8495A4]
                    "
                  >
                    {currentEmployee?.email ||
                      "No employee email"}
                  </p>
                </div>
              </div>
            </div>

            {/* New Assignee */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-[10px]
                  font-semibold
                  text-[#526B7E]
                "
              >
                New Assignee
                <span className="ml-0.5 text-[#D84B4B]">
                  *
                </span>
              </label>

              <div className="relative">
                <select
                  value={selectedEmployee}
                  onChange={(event) =>
                    onEmployeeChange?.(
                      event.target.value
                    )
                  }
                  disabled={loading}
                  required
                  className="
                    h-10
                    w-full
                    appearance-none
                    rounded-[7px]
                    border
                    border-[#D7E2EC]
                    bg-white
                    px-3
                    pr-9
                    text-[11px]
                    font-medium
                    text-[#173750]
                    outline-none
                    transition-all
                    focus:border-[#72B8E8]
                    focus:ring-2
                    focus:ring-[#E9F6FF]
                    disabled:cursor-not-allowed
                    disabled:bg-[#F5F7F9]
                  "
                >
                  <option value="">
                    Select Employee
                  </option>

                  {employees.map(
                    (employee) => (
                      <option
                        key={employee.name}
                        value={employee.name}
                      >
                        {employee.name}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={13}
                  strokeWidth={1.8}
                  className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-[#7890A4]
                  "
                />
              </div>
            </div>
          </div>

          {/* New Assignee Preview */}

          {selectedEmployee &&
            selectedEmployee !==
              task.assignedTo && (
              <div
                className="
                  mt-4
                  flex
                  items-center
                  gap-2.5
                  rounded-[8px]
                  border
                  border-[#D9EAF7]
                  bg-[#F3F9FE]
                  px-3
                  py-2.5
                "
              >
                <Check
                  size={14}
                  strokeWidth={2}
                  className="text-[#1592D0]"
                />

                <p
                  className="
                    text-[10px]
                    font-semibold
                    text-[#37657F]
                  "
                >
                  This task will be reassigned to{" "}
                  <span className="text-[#173750]">
                    {selectedEmployee}
                  </span>
                </p>
              </div>
            )}
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
            px-6
            py-4
          "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              h-9
              rounded-[7px]
              border
              border-[#D5E0E9]
              bg-white
              px-4
              text-[11px]
              font-semibold
              text-[#536B7E]
              transition-all
              hover:bg-[#F7F9FC]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onReassign}
            disabled={
              loading ||
              !selectedEmployee ||
              selectedEmployee ===
                task.assignedTo
            }
            className="
              flex
              h-9
              items-center
              justify-center
              gap-1.5
              rounded-[7px]
              bg-[#0B477A]
              px-5
              text-[11px]
              font-semibold
              text-white
              shadow-[0_3px_8px_rgba(11,71,122,0.14)]
              transition-all
              hover:bg-[#0A3D69]
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? (
              <>
                <span
                  className="
                    h-3
                    w-3
                    animate-spin
                    rounded-full
                    border-2
                    border-white/30
                    border-t-white
                  "
                />

                Reassigning...
              </>
            ) : (
              <>
                <UserRound
                  size={13}
                  strokeWidth={1.9}
                />

                Reassign Task
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   INITIALS
========================================================= */

const getInitials = (name = "") => {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "—";
  }

  return words
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export default ReassignTaskModal;