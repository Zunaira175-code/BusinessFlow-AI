import { useEffect, useMemo, useState } from "react";

import TasksHeader from "../../components/Tasks/TasksHeader";
import TaskStats from "../../components/Tasks/TaskStats";
import TasksToolbar from "../../components/Tasks/TasksToolbar";
import TasksTable from "../../components/Tasks/TasksTable";
import CreateTaskModal from "../../components/Tasks/CreateTaskModal";
import ReassignTaskModal from "../../components/Tasks/ReassignTaskModal";
import ViewTaskModal from "../../components/Tasks/ViewTaskModal";

const API_BASE_URL = "http://localhost:5000/api";

/* =========================================================
   HELPERS
========================================================= */

const getToken = () => {
    return localStorage.getItem(
        "businessflow_token"
    );
};

const getUserName = (user) => {
    if (!user) {
        return "Unknown User";
    }

    return (
        user.name ||
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.email ||
        "Unknown User"
    );
};

const formatDate = (dateValue) => {
    if (!dateValue) {
        return "No due date";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "No due date";
    }

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    );
};

const normalizePriorityForUI = (
    priority
) => {
    if (!priority) {
        return "Medium";
    }

    const value =
        String(priority).toUpperCase();

    if (value === "HIGH") {
        return "High";
    }

    if (value === "LOW") {
        return "Low";
    }

    return "Medium";
};

const normalizePriorityForAPI = (
    priority
) => {
    if (!priority) {
        return "MEDIUM";
    }

    const value =
        String(priority).toUpperCase();

    if (
        ["HIGH", "MEDIUM", "LOW"].includes(
            value
        )
    ) {
        return value;
    }

    return "MEDIUM";
};

const normalizeStatusForUI = (
    status
) => {
    if (!status) {
        return "Pending";
    }

    return status;
};

const getRelatedName = (task) => {
    if (task.relatedTo) {
        return task.relatedTo;
    }

    if (
        task.customerId?.firstName ||
        task.customerId?.lastName
    ) {
        return `${task.customerId.firstName || ""} ${
            task.customerId.lastName || ""
        }`.trim();
    }

    if (
        task.leadId?.firstName ||
        task.leadId?.lastName
    ) {
        return `${task.leadId.firstName || ""} ${
            task.leadId.lastName || ""
        }`.trim();
    }

    if (task.dealId?.title) {
        return task.dealId.title;
    }

    return "—";
};

/* =========================================================
   API REQUEST
========================================================= */

const apiRequest = async (
    endpoint,
    options = {}
) => {
    const token = getToken();

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type":
                    "application/json",

                Accept:
                    "application/json",

                ...(token
                    ? {
                        Authorization:
                            `Bearer ${token}`,
                    }
                    : {}),

                ...(options.headers || {}),
            },
        }
    );

    const data =
        await response.json().catch(
            () => ({})
        );

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Something went wrong."
        );
    }

    return data;
};

/* =========================================================
   TRANSFORM API TASK → EXISTING TABLE FORMAT
========================================================= */

const transformTask = (task) => {
    return {
        id: task._id,

        _id: task._id,

        title:
            task.title || "Untitled Task",

        description:
            task.description || "",

        relatedType:
            task.relatedType || "Internal",

        relatedTo:
            getRelatedName(task),

        assignedTo:
            getUserName(
                task.assignedTo
            ),

        assignedToId:
            task.assignedTo?._id || null,

        assignedToEmail:
            task.assignedTo?.email || "",

        priority:
            normalizePriorityForUI(
                task.priority
            ),

        priorityApi:
            task.priority,

        dueDate:
            formatDate(task.dueAt),

        dueAt:
            task.dueAt || null,

        status:
            normalizeStatusForUI(
                task.status
            ),

        createdBy:
            getUserName(
                task.createdBy
            ),

        createdById:
            task.createdBy?._id || null,

        createdAt:
            formatDate(
                task.createdAt
            ),

        completedAt:
            task.completedAt || null,

        customerId:
            task.customerId?._id ||
            task.customerId ||
            null,

        leadId:
            task.leadId?._id ||
            task.leadId ||
            null,

        dealId:
            task.dealId?._id ||
            task.dealId ||
            null,

        notes:
            task.notes || "",
    };
};

/* =========================================================
   MAIN TASKS PAGE
========================================================= */

const Tasks = () => {
    /* -------------------------------------------------------
       TASK STATE
    ------------------------------------------------------- */

    const [tasks, setTasks] =
        useState([]);

    /* -------------------------------------------------------
       EMPLOYEE STATE
    ------------------------------------------------------- */

    const [employees, setEmployees] =
        useState([]);

    /* -------------------------------------------------------
       TASK STATS
    ------------------------------------------------------- */

    const [taskStats, setTaskStats] =
        useState({
            total: 0,
            pending: 0,
            inProgress: 0,
            completed: 0,
        });

    /* -------------------------------------------------------
       FILTER STATE
    ------------------------------------------------------- */

    const [search, setSearch] =
        useState("");

    const [assignee, setAssignee] =
        useState("");

    const [priority, setPriority] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [type, setType] =
        useState("");

    /* -------------------------------------------------------
       PAGINATION
    ------------------------------------------------------- */

    const [currentPage, setCurrentPage] =
        useState(1);

    const tasksPerPage = 7;

    /* -------------------------------------------------------
       SERVER PAGINATION
    ------------------------------------------------------- */

    const [pagination, setPagination] =
        useState({
            page: 1,
            limit: tasksPerPage,
            total: 0,
            totalPages: 1,
        });

    /* -------------------------------------------------------
       ACTION MENU
    ------------------------------------------------------- */

    const [openActionId, setOpenActionId] =
        useState(null);

    /* -------------------------------------------------------
       MODALS
    ------------------------------------------------------- */

    const [
        isCreateModalOpen,
        setIsCreateModalOpen,
    ] = useState(false);

    const [
        isViewModalOpen,
        setIsViewModalOpen,
    ] = useState(false);

    const [
        isReassignModalOpen,
        setIsReassignModalOpen,
    ] = useState(false);

    const [
        selectedTask,
        setSelectedTask,
    ] = useState(null);

    const [
        selectedEmployee,
        setSelectedEmployee,
    ] = useState("");

    /* -------------------------------------------------------
       LOADING STATES
    ------------------------------------------------------- */

    const [
        pageLoading,
        setPageLoading,
    ] = useState(true);

    const [
        employeesLoading,
        setEmployeesLoading,
    ] = useState(true);

    const [
        createLoading,
        setCreateLoading,
    ] = useState(false);

    const [
        reassignLoading,
        setReassignLoading,
    ] = useState(false);

    /* -------------------------------------------------------
       ERROR
    ------------------------------------------------------- */

    const [error, setError] =
        useState("");

    /* =======================================================
       FETCH TASKS
    ======================================================= */

    const fetchTasks = async (
        page = currentPage
    ) => {
        setPageLoading(true);
        setError("");

        try {
            const params =
                new URLSearchParams();

            params.set(
                "view",
                "all"
            );

            params.set(
                "page",
                page
            );

            params.set(
                "limit",
                tasksPerPage
            );

            if (search.trim()) {
                params.set(
                    "search",
                    search.trim()
                );
            }

            if (assignee) {
                const employee =
                    employees.find(
                        (item) =>
                            item.name ===
                            assignee
                    );

                if (
                    employee?._id
                ) {
                    params.set(
                        "assignedTo",
                        employee._id
                    );
                }
            }

            if (priority) {
                params.set(
                    "priority",
                    normalizePriorityForAPI(
                        priority
                    )
                );
            }

            if (status) {
                params.set(
                    "status",
                    status
                );
            }

            if (type) {
                params.set(
                    "type",
                    type
                );
            }

            const response =
                await apiRequest(
                    `/tasks?${params.toString()}`
                );

            const apiTasks =
                Array.isArray(
                    response.data
                )
                    ? response.data
                    : [];

            setTasks(
                apiTasks.map(
                    transformTask
                )
            );

            setPagination(
                response.pagination || {
                    page,
                    limit: tasksPerPage,
                    total:
                        apiTasks.length,
                    totalPages: 1,
                }
            );
        } catch (err) {
            console.error(
                "Fetch Tasks Error:",
                err
            );

            setError(
                err.message ||
                "Unable to load tasks."
            );
        } finally {
            setPageLoading(false);
        }
    };

    /* =======================================================
       FETCH TASK STATS
    ======================================================= */

    const fetchTaskStats =
        async () => {
            try {
                const response =
                    await apiRequest(
                        "/tasks/stats"
                    );

                setTaskStats(
                    response.data || {
                        total: 0,
                        pending: 0,
                        inProgress: 0,
                        completed: 0,
                    }
                );
            } catch (err) {
                console.error(
                    "Fetch Task Stats Error:",
                    err
                );
            }
        };

    /* =======================================================
       FETCH EMPLOYEES
    ======================================================= */

    const fetchEmployees =
        async () => {
            setEmployeesLoading(
                true
            );

            try {
                const response =
                    await apiRequest(
                        "/employees"
                    );

                const apiEmployees =
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : response.data?.employees ||
                          [];

                const formattedEmployees =
                    apiEmployees
                        .filter(
                            (employee) =>
                                employee.role ===
                                    "employee" ||
                                !employee.role
                        )
                        .filter(
                            (employee) =>
                                employee.isActive !==
                                    false
                        )
                        .map(
                            (employee) => ({
                                _id:
                                    employee._id,

                                name:
                                    getUserName(
                                        employee
                                    ),

                                email:
                                    employee.email ||
                                    "",
                            })
                        );

                setEmployees(
                    formattedEmployees
                );
            } catch (err) {
                console.error(
                    "Fetch Employees Error:",
                    err
                );

                /*
                 Employees API fail hone par
                 task page crash nahi karega.
                */
                setEmployees([]);
            } finally {
                setEmployeesLoading(
                    false
                );
            }
        };

    /* =======================================================
       INITIAL LOAD
    ======================================================= */

    useEffect(() => {
        fetchEmployees();
        fetchTaskStats();
    }, []);

    /* =======================================================
       LOAD TASKS AFTER EMPLOYEES
    ======================================================= */

    useEffect(() => {
        if (
            !employeesLoading
        ) {
            fetchTasks(
                currentPage
            );
        }
    }, [
        employeesLoading,
        currentPage,
        search,
        assignee,
        priority,
        status,
        type,
    ]);

    /* =======================================================
       FILTER HANDLERS
    ======================================================= */

    const handleSearchChange = (
        value
    ) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleAssigneeChange = (
        value
    ) => {
        setAssignee(value);
        setCurrentPage(1);
    };

    const handlePriorityChange = (
        value
    ) => {
        setPriority(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (
        value
    ) => {
        setStatus(value);
        setCurrentPage(1);
    };

    const handleTypeChange = (
        value
    ) => {
        setType(value);
        setCurrentPage(1);
    };

    const handleClearFilters =
        () => {
            setSearch("");
            setAssignee("");
            setPriority("");
            setStatus("");
            setType("");
            setCurrentPage(1);
        };

    /* =======================================================
       ACTION MENU
    ======================================================= */

    const handleToggleActions = (
        taskId
    ) => {
        setOpenActionId(
            (current) =>
                current === taskId
                    ? null
                    : taskId
        );
    };

    /* =======================================================
       VIEW TASK
    ======================================================= */

    const handleViewTask = (
        task
    ) => {
        setOpenActionId(null);
        setSelectedTask(task);
        setIsViewModalOpen(true);
    };

    /* =======================================================
       EDIT TASK
    ======================================================= */

    const handleEditTask = (
        task
    ) => {
        setOpenActionId(null);

        setSelectedTask(task);

        setIsViewModalOpen(
            false
        );

        setTimeout(() => {
            setIsCreateModalOpen(
                true
            );
        }, 150);
    };

    /* =======================================================
       REASSIGN TASK
    ======================================================= */

    const handleOpenReassign = (
        task
    ) => {
        setOpenActionId(null);

        setSelectedTask(task);

        const currentEmployee =
            employees.find(
                (employee) =>
                    employee._id ===
                    task.assignedToId
            );

        setSelectedEmployee(
            currentEmployee?.name ||
            ""
        );

        setIsReassignModalOpen(
            true
        );
    };

    const handleEmployeeChange = (
        employeeName
    ) => {
        setSelectedEmployee(
            employeeName
        );
    };

    /* =======================================================
       REASSIGN TASK API
    ======================================================= */

    const handleReassignTask =
        async () => {
            if (
                !selectedTask ||
                !selectedEmployee
            ) {
                return;
            }

            const employee =
                employees.find(
                    (item) =>
                        item.name ===
                        selectedEmployee
                );

            if (!employee?._id) {
                setError(
                    "Selected employee is invalid."
                );
                return;
            }

            if (
                employee._id ===
                selectedTask.assignedToId
            ) {
                return;
            }

            setReassignLoading(
                true
            );

            setError("");

            try {
                await apiRequest(
                    `/tasks/${selectedTask._id}/reassign`,
                    {
                        method:
                            "PATCH",

                        body: JSON.stringify(
                            {
                                assignedTo:
                                    employee._id,
                            }
                        ),
                    }
                );

                setIsReassignModalOpen(
                    false
                );

                setSelectedEmployee(
                    ""
                );

                setSelectedTask(
                    null
                );

                await fetchTasks(
                    currentPage
                );

                await fetchTaskStats();
            } catch (err) {
                console.error(
                    "Reassign Task Error:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to reassign task."
                );
            } finally {
                setReassignLoading(
                    false
                );
            }
        };

    /* =======================================================
       DELETE TASK API
    ======================================================= */

    const handleDeleteTask = async (
        task
    ) => {
        setOpenActionId(null);

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${task.title}"?`
            );

        if (!confirmed) {
            return;
        }

        setError("");

        try {
            await apiRequest(
                `/tasks/${task._id}`,
                {
                    method:
                        "DELETE",
                }
            );

            await fetchTasks(
                currentPage
            );

            await fetchTaskStats();
        } catch (err) {
            console.error(
                "Delete Task Error:",
                err
            );

            setError(
                err.message ||
                "Unable to delete task."
            );
        }
    };

    /* =======================================================
       CREATE TASK API
    ======================================================= */

    const handleCreateTask =
        async (formData) => {
            setCreateLoading(
                true
            );

            setError("");

            try {
                const selectedEmployeeData =
                    employees.find(
                        (employee) =>
                            employee.name ===
                            formData.assignedTo
                    );

                if (
                    !selectedEmployeeData?._id
                ) {
                    throw new Error(
                        "Please select a valid employee."
                    );
                }

                const payload = {
                    title:
                        formData.title?.trim(),

                    description:
                        formData.description?.trim() ||
                        null,

                    assignedTo:
                        selectedEmployeeData._id,

                    priority:
                        normalizePriorityForAPI(
                            formData.priority
                        ),

                    status:
                        "Pending",

                    dueAt:
                        formData.dueDate ||
                        null,

                    relatedType:
                        formData.relatedType ||
                        null,

                    relatedTo:
                        formData.relatedTo?.trim() ||
                        null,
                };

                /*
                 RelatedId abhi modal mein nahi aa raha,
                 isliye relatedTo display value bheji ja rahi hai.
                */

                await apiRequest(
                    "/tasks",
                    {
                        method:
                            "POST",

                        body: JSON.stringify(
                            payload
                        ),
                    }
                );

                setCurrentPage(1);

                setIsCreateModalOpen(
                    false
                );

                await fetchTasks(
                    1
                );

                await fetchTaskStats();
            } catch (err) {
                console.error(
                    "Create Task Error:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to create task."
                );
            } finally {
                setCreateLoading(
                    false
                );
            }
        };

    /* =======================================================
       PAGE CHANGE
    ======================================================= */

    const totalItems =
        pagination.total || 0;

    const totalPages =
        pagination.totalPages ||
        1;

    const safeCurrentPage =
        Math.min(
            currentPage,
            totalPages
        );

    const startItem =
        totalItems === 0
            ? 0
            : (safeCurrentPage - 1) *
                tasksPerPage +
              1;

    const endItem =
        totalItems === 0
            ? 0
            : Math.min(
                safeCurrentPage *
                    tasksPerPage,
                totalItems
            );

    const handlePageChange = (
        page
    ) => {
        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        setCurrentPage(page);

        setOpenActionId(null);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /* =======================================================
       EMPLOYEES FOR MODAL
    ======================================================= */

    const modalEmployees =
        useMemo(() => {
            return employees.map(
                (employee) => ({
                    _id:
                        employee._id,

                    name:
                        employee.name,

                    email:
                        employee.email,
                })
            );
        }, [employees]);

    /* =======================================================
       RENDER
    ======================================================= */

    return (
        <main className="w-full">
            {/* ===================================================
                HEADER
            ================================================== */}

            <TasksHeader
                dateLabel="All Tasks"
                onDateClick={() => {}}
                onCreateTask={() =>
                    setIsCreateModalOpen(
                        true
                    )
                }
            />

            {/* ===================================================
                ERROR
            ================================================== */}

            {error && (
                <div
                    className="
                        mt-4 rounded-[8px]
                        border border-[#F1C9C9]
                        bg-[#FFF7F7]
                        px-4 py-3
                        text-[11px]
                        font-medium
                        text-[#B42318]
                    "
                >
                    {error}
                </div>
            )}

            {/* ===================================================
                STATS
            ================================================== */}

            <section className="mt-5">
                <TaskStats
                    stats={taskStats}
                    loading={false}
                />
            </section>

            {/* ===================================================
                TOOLBAR
            ================================================== */}

            <section className="mt-5">
                <TasksToolbar
                    search={search}
                    onSearchChange={
                        handleSearchChange
                    }

                    assignee={assignee}
                    onAssigneeChange={
                        handleAssigneeChange
                    }

                    priority={priority}
                    onPriorityChange={
                        handlePriorityChange
                    }

                    status={status}
                    onStatusChange={
                        handleStatusChange
                    }

                    type={type}
                    onTypeChange={
                        handleTypeChange
                    }

                    onClearFilters={
                        handleClearFilters
                    }
                />
            </section>

            {/* ===================================================
                TASK TABLE
            ================================================== */}

            <section className="mt-4 pb-6">
                {pageLoading ? (
                    <div
                        className="
                            flex h-[220px]
                            items-center
                            justify-center
                            rounded-[9px]
                            border border-[#DCE5EF]
                            bg-white
                            text-[11px]
                            font-medium
                            text-[#71869A]
                        "
                    >
                        Loading tasks...
                    </div>
                ) : (
                    <TasksTable
                        tasks={tasks}

                        currentPage={
                            safeCurrentPage
                        }

                        totalPages={
                            totalPages
                        }

                        totalItems={
                            totalItems
                        }

                        startItem={
                            startItem
                        }

                        endItem={
                            endItem
                        }

                        openActionId={
                            openActionId
                        }

                        onToggleActions={
                            handleToggleActions
                        }

                        onViewTask={
                            handleViewTask
                        }

                        onEditTask={
                            handleEditTask
                        }

                        onReassignTask={
                            handleOpenReassign
                        }

                        onDeleteTask={
                            handleDeleteTask
                        }

                        onPageChange={
                            handlePageChange
                        }
                    />
                )}
            </section>

            {/* ===================================================
                CREATE / EDIT TASK MODAL
            ================================================== */}

            <CreateTaskModal
                isOpen={
                    isCreateModalOpen
                }

                onClose={() => {
                    setIsCreateModalOpen(
                        false
                    );
                    setSelectedTask(
                        null
                    );
                }}

                onSubmit={
                    handleCreateTask
                }

                employees={
                    modalEmployees
                }

                loading={
                    createLoading
                }
            />

            {/* ===================================================
                VIEW TASK MODAL
            ================================================== */}

            <ViewTaskModal
                isOpen={
                    isViewModalOpen
                }

                task={
                    selectedTask
                }

                onClose={() => {
                    setIsViewModalOpen(
                        false
                    );

                    setSelectedTask(
                        null
                    );
                }}

                onEdit={() => {
                    if (
                        !selectedTask
                    ) {
                        return;
                    }

                    handleEditTask(
                        selectedTask
                    );
                }}

                onReassign={() => {
                    if (
                        !selectedTask
                    ) {
                        return;
                    }

                    setIsViewModalOpen(
                        false
                    );

                    handleOpenReassign(
                        selectedTask
                    );
                }}
            />

            {/* ===================================================
                REASSIGN TASK MODAL
            ================================================== */}

            <ReassignTaskModal
                isOpen={
                    isReassignModalOpen
                }

                task={
                    selectedTask
                }

                employees={
                    modalEmployees
                }

                selectedEmployee={
                    selectedEmployee
                }

                onEmployeeChange={
                    handleEmployeeChange
                }

                onClose={() => {
                    setIsReassignModalOpen(
                        false
                    );

                    setSelectedEmployee(
                        ""
                    );

                    setSelectedTask(
                        null
                    );
                }}

                onReassign={
                    handleReassignTask
                }

                loading={
                    reassignLoading
                }
            />
        </main>
    );
};

export default Tasks;