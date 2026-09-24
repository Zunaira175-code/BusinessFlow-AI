import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    X,
    ChevronDown,
    ChevronUp,
    CheckSquare,
    CalendarDays,
    UserRound,
    Flag,
    Link2,
    FileText,
    AlignLeft,
} from "lucide-react";

/* =========================================================
   EMPLOYEE OPTIONS
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
   CREATE TASK MODAL
========================================================= */

const CreateTaskModal = ({
    isOpen = false,
    onClose,
    onSubmit,
    employees = defaultEmployees,
    loading = false,
}) => {
    if (!isOpen) {
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
        px-3
        py-4
        backdrop-blur-[2px]
      "
            onClick={onClose}
        >
            <CreateTaskForm
                employees={employees}
                onClose={onClose}
                onSubmit={onSubmit}
                loading={loading}
            />
        </div>
    );
};

/* =========================================================
   CREATE TASK FORM
========================================================= */

const CreateTaskForm = ({
    employees,
    onClose,
    onSubmit,
    loading,
}) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assignedTo: "",
        priority: "Medium",
        dueDate: "",
        relatedType: "",
        relatedTo: "",
    });

    const [employeeOpen, setEmployeeOpen] =
        useState(false);

    const employeeDropdownRef = useRef(null);

    /* =======================================================
       CLOSE EMPLOYEE DROPDOWN
    ======================================================= */

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                employeeDropdownRef.current &&
                !employeeDropdownRef.current.contains(
                    event.target
                )
            ) {
                setEmployeeOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    /* =======================================================
       FORM CHANGE
    ======================================================= */

    const handleChange = (
        field,
        value
    ) => {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));
    };

    /* =======================================================
       SUBMIT
    ======================================================= */

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.title.trim()) {
            return;
        }

        if (!formData.assignedTo) {
            return;
        }

        if (!formData.dueDate) {
            return;
        }

        onSubmit?.({
            ...formData,
            title: formData.title.trim(),
            description:
                formData.description.trim(),
            relatedTo:
                formData.relatedTo.trim(),
        });
    };

    /* =======================================================
       SELECT EMPLOYEE
    ======================================================= */

    const handleEmployeeSelect = (
        employee
    ) => {
        handleChange(
            "assignedTo",
            employee.name
        );

        setEmployeeOpen(false);
    };

    const selectedEmployee =
        employees.find(
            (employee) =>
                employee.name ===
                formData.assignedTo
        );

    return (
        <form
            onSubmit={handleSubmit}
            onClick={(event) =>
                event.stopPropagation()
            }
            className="
        flex
        max-h-[calc(100vh-28px)]
        w-full
        max-w-[700px]
        flex-col
        overflow-hidden
        rounded-[11px]
        border
        border-[#D3DFE9]
        bg-white
        shadow-[0_20px_60px_rgba(7,29,53,0.20)]
      "
        >
            {/* ===================================================
          HEADER
      ==================================================== */}

            <div
                className="
          flex
          shrink-0
          items-center
          justify-between
          border-b
          border-[#E3EAF0]
          px-5
          py-3
        "
            >
                <div className="flex items-center gap-2.5">
                    {/* Icon */}

                    <div
                        className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-[8px]
              bg-[#EAF6FF]
              text-[#168BCB]
            "
                    >
                        <CheckSquare
                            size={17}
                            strokeWidth={1.8}
                        />
                    </div>

                    {/* Heading */}

                    <div>
                        <h2
                            className="
                text-[16px]
                font-bold
                leading-[20px]
                tracking-[-0.2px]
                text-[#102B45]
              "
                        >
                            Create New Task
                        </h2>

                        <p
                            className="
                mt-0.5
                text-[9px]
                font-medium
                leading-[13px]
                text-[#7890A4]
              "
                        >
                            Assign a task to your team member
                        </p>
                    </div>
                </div>

                {/* Close */}

                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    aria-label="Close modal"
                    className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-[6px]
            text-[#60798D]
            transition
            hover:bg-[#F3F6F9]
            hover:text-[#173750]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
                >
                    <X
                        size={17}
                        strokeWidth={1.8}
                    />
                </button>
            </div>

            {/* ===================================================
          BODY
      ==================================================== */}

            <div
                className="
          overflow-y-auto
          px-5
          py-3.5
        "
            >
                <div className="space-y-3">

                    {/* =================================================
              TASK TITLE
          ================================================== */}

                    <FormField
    label="Task Title"
    required
>
    <div className="relative w-full">
        <FileText
            size={14}
            strokeWidth={1.7}
            className="
                pointer-events-none
                absolute
                left-2.5
                top-1/2
                -translate-y-1/2
                text-[#71869A]
            "
        />

        <input
            type="text"
            value={formData.title}
            onChange={(event) =>
                handleChange(
                    "title",
                    event.target.value
                )
            }
            placeholder="e.g. Finalize TechNova Proposal"
            className="
                task-form-input
                block
                w-full
                h-[37px]
                pl-8
                pr-3
                text-[11px]
                font-medium
                text-[#173750]
                placeholder:text-[#8A9BAB]
                outline-none
                focus:border-[#9AA9B6]
                focus:ring-1
                focus:ring-[#9AA9B6]/20
            "
            required
            autoFocus
        />
    </div>
</FormField>

                    {/* =================================================
              DESCRIPTION
          ================================================== */}

                    <FormField label="Description">
                        <div className="relative w-full">
                            <AlignLeft
                                size={14}
                                strokeWidth={1.7}
                                className="
                pointer-events-none
                absolute
                left-2.5
                top-2.5
                text-[#71869A]
            "
                            />

                            <textarea
                                value={formData.description}
                                onChange={(event) =>
                                    handleChange(
                                        "description",
                                        event.target.value
                                    )
                                }
                                placeholder="Add task description..."
                                maxLength={500}
                                rows={3}
                                className="
                task-form-input
                block
                w-full
                h-[70px]
                resize-none
                px-8
                py-2
                text-[11px]
                font-medium
                leading-[16px]
                text-[#173750]
                placeholder:text-[#8A9BAB]
                outline-none
                focus:border-[#9AA9B6]
                focus:ring-1
                focus:ring-[#9AA9B6]/20
            "
                            />

                            <span
                                className="
                pointer-events-none
                absolute
                bottom-1.5
                right-2.5
                text-[7px]
                font-medium
                text-[#9AA9B6]
            "
                            >
                                {formData.description.length}/500
                            </span>
                        </div>
                    </FormField>

                    {/* =================================================
              ASSIGN / PRIORITY / DUE DATE
          ================================================== */}

                    <div
                        className="
              grid
              grid-cols-1
              gap-3
              md:grid-cols-3
            "
                    >
                        {/* =================================================
                ASSIGN TO
            ================================================== */}

                        <FormField
                            label="Assign To"
                            required
                        >
                            <div
                                ref={employeeDropdownRef}
                                className="relative"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setEmployeeOpen(
                                            (current) =>
                                                !current
                                        )
                                    }
                                    className={`
                    flex
                    h-[37px]
                    w-full
                    items-center
                    justify-between
                    rounded-[6px]
                    border
                    bg-white
                    px-2.5
                    text-left
                    transition
                    ${employeeOpen
                                            ? "border-[#168BCB] ring-1 ring-[#168BCB]/15"
                                            : "border-[#D5E0E9] hover:border-[#B8CBD9]"
                                        }
                  `}
                                >
                                    <span className="flex min-w-0 items-center gap-1.5">
                                        <UserRound
                                            size={13}
                                            strokeWidth={1.7}
                                            className="shrink-0 text-[#71869A]"
                                        />

                                        <span
                                            className={`
                        truncate
                        text-[10px]
                        font-medium
                        ${selectedEmployee
                                                    ? "text-[#173750]"
                                                    : "text-[#8B9DAC]"
                                                }
                      `}
                                        >
                                            {selectedEmployee?.name ||
                                                "Select Employee"}
                                        </span>
                                    </span>

                                    {employeeOpen ? (
                                        <ChevronUp
                                            size={13}
                                            strokeWidth={1.8}
                                            className="shrink-0 text-[#71869A]"
                                        />
                                    ) : (
                                        <ChevronDown
                                            size={13}
                                            strokeWidth={1.8}
                                            className="shrink-0 text-[#71869A]"
                                        />
                                    )}
                                </button>

                                {/* =================================================
                    EMPLOYEE DROPDOWN
                ================================================== */}

                                {employeeOpen && (
                                    <div
                                        className="
                      absolute
                      left-0
                      right-0
                      top-[41px]
                      z-[200]
                      overflow-hidden
                      rounded-[7px]
                      border
                      border-[#D7E2EB]
                      bg-white
                      shadow-[0_12px_30px_rgba(15,45,70,0.18)]
                    "
                                    >
                                        <div
                                            className="
                        max-h-[185px]
                        overflow-y-auto
                        py-1
                      "
                                        >
                                            {employees.map(
                                                (employee) => {
                                                    const initials =
                                                        employee.name
                                                            .split(" ")
                                                            .map(
                                                                (part) =>
                                                                    part[0]
                                                            )
                                                            .join("")
                                                            .slice(0, 2)
                                                            .toUpperCase();

                                                    const isSelected =
                                                        employee.name ===
                                                        formData.assignedTo;

                                                    return (
                                                        <button
                                                            key={
                                                                employee.name
                                                            }
                                                            type="button"
                                                            onClick={() =>
                                                                handleEmployeeSelect(
                                                                    employee
                                                                )
                                                            }
                                                            className={`
                                flex
                                w-full
                                items-center
                                gap-2
                                px-2.5
                                py-1.5
                                text-left
                                transition
                                ${isSelected
                                                                    ? "bg-[#EDF7FF]"
                                                                    : "hover:bg-[#F5F9FC]"
                                                                }
                              `}
                                                        >
                                                            {/* Avatar */}

                                                            <div
                                                                className="
                                  flex
                                  h-6
                                  w-6
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-full
                                  bg-[#E3F0F8]
                                  text-[7px]
                                  font-bold
                                  text-[#176B9E]
                                "
                                                            >
                                                                {initials}
                                                            </div>

                                                            {/* Employee Info */}

                                                            <div className="min-w-0">
                                                                <p
                                                                    className="
                                    truncate
                                    text-[9px]
                                    font-bold
                                    leading-[12px]
                                    text-[#173750]
                                  "
                                                                >
                                                                    {
                                                                        employee.name
                                                                    }
                                                                </p>

                                                                <p
                                                                    className="
                                    truncate
                                    text-[7px]
                                    font-medium
                                    leading-[10px]
                                    text-[#7890A4]
                                  "
                                                                >
                                                                    {
                                                                        employee.email
                                                                    }
                                                                </p>
                                                            </div>
                                                        </button>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </FormField>

                        {/* =================================================
                PRIORITY
            ================================================== */}

                        <FormField
                            label="Priority"
                            required
                        >
                            <div className="relative">
                                <Flag
                                    size={13}
                                    strokeWidth={1.7}
                                    className="
                    pointer-events-none
                    absolute
                    left-2.5
                    top-1/2
                    z-10
                    -translate-y-1/2
                    text-[#E5A323]
                  "
                                />

                                <select
                                    value={formData.priority}
                                    onChange={(event) =>
                                        handleChange(
                                            "priority",
                                            event.target.value
                                        )
                                    }
                                    className="
                    task-form-input
                    h-[37px]
                    appearance-none
                    pl-8
                    pr-8
                    text-[11px]
                    font-medium
                  "
                                    required
                                >
                                    <option value="High">
                                        High
                                    </option>

                                    <option value="Medium">
                                        Medium
                                    </option>

                                    <option value="Low">
                                        Low
                                    </option>
                                </select>

                                <ChevronDown
                                    size={13}
                                    strokeWidth={1.8}
                                    className="
                    pointer-events-none
                    absolute
                    right-2.5
                    top-1/2
                    -translate-y-1/2
                    text-[#71869A]
                  "
                                />
                            </div>
                        </FormField>

                        {/* =================================================
                DUE DATE
            ================================================== */}

                        <FormField
                            label="Due Date"
                            required
                        >
                            <div className="relative">
                                <CalendarDays
                                    size={13}
                                    strokeWidth={1.7}
                                    className="
                    pointer-events-none
                    absolute
                    left-2.5
                    top-1/2
                    -translate-y-1/2
                    text-[#71869A]
                  "
                                />

                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(event) =>
                                        handleChange(
                                            "dueDate",
                                            event.target.value
                                        )
                                    }
                                    className="
                    task-form-input
                    h-[37px]
                    pl-8
                    pr-2
                    text-[10px]
                    font-medium
                  "
                                    required
                                />
                            </div>
                        </FormField>
                    </div>

                </div>
            </div>

            {/* ===================================================
          FOOTER
      ==================================================== */}

            <div
                className="
          flex
          shrink-0
          items-center
          justify-end
          gap-2
          border-t
          border-[#E3EAF0]
          px-5
          py-3
        "
            >
                {/* Cancel */}

                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="
            h-[32px]
            min-w-[82px]
            rounded-[6px]
            border
            border-[#D5E0E9]
            bg-white
            px-3.5
            text-[10px]
            font-bold
            text-[#536B7E]
            transition
            hover:bg-[#F6F9FC]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
                >
                    Cancel
                </button>

                {/* Create Task */}

                <button
                    type="submit"
                    disabled={
                        loading ||
                        !formData.title.trim() ||
                        !formData.assignedTo ||
                        !formData.dueDate
                    }
                    className="
            flex
            h-[32px]
            min-w-[122px]
            items-center
            justify-center
            gap-1.5
            rounded-[6px]
            bg-[#0B477A]
            px-4
            text-[10px]
            font-bold
            text-white
            shadow-[0_3px_8px_rgba(11,71,122,0.16)]
            transition
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
                  h-2.5
                  w-2.5
                  animate-spin
                  rounded-full
                  border-2
                  border-white/30
                  border-t-white
                "
                            />

                            Creating...
                        </>
                    ) : (
                        <>
                            <CheckSquare
                                size={12}
                                strokeWidth={2}
                            />

                            Create Task
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

/* =========================================================
   FORM FIELD
========================================================= */

const FormField = ({
    label,
    required = false,
    children,
}) => {
    return (
        <label className="block">
            <span
                className="
          mb-1
          block
          text-[10px]
          font-bold
          leading-[13px]
          text-[#173750]
        "
            >
                {label}

                {required && (
                    <span className="ml-0.5 text-[#D84B4B]">
                        *
                    </span>
                )}
            </span>

            {children}
        </label>
    );
};

export default CreateTaskModal;