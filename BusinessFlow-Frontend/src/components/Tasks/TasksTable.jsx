import {
  ClipboardList,
  CheckSquare,
} from "lucide-react";

import TaskRow from "./TaskRow";
import TaskPagination from "./TaskPagination";

/* =========================================================
   TASKS TABLE
========================================================= */

const TasksTable = ({
  tasks = [],
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  startItem = 0,
  endItem = 0,

  openActionId = null,

  onToggleActions,
  onViewTask,
  onEditTask,
  onReassignTask,
  onDeleteTask,
  onPageChange,
}) => {
  return (
    <section
      className="
        w-full
        overflow-visible
        rounded-[8px]
        border
        border-[#DCE5EE]
        bg-white
      "
    >
      {/* =====================================================
          TABLE WRAPPER
      ====================================================== */}

      <div className="overflow-x-auto">
        <table
          className="
            w-full
            min-w-[900px]
            border-collapse
          "
        >
          {/* =================================================
              TABLE HEADER
          ================================================== */}

          <thead>
            <tr
              className="
                border-b
                border-[#E1E8EF]
                bg-white
              "
            >
              {/* =================================================
                  SELECT
              ================================================== */}

              <th
                className="
                  w-[48px]
                  px-4
                  py-2.5
                  text-left
                "
              >
                <input
                  type="checkbox"
                  aria-label="Select all tasks"
                  className="
                    h-4
                    w-4
                    cursor-pointer
                    rounded
                    border-[#B8C8D6]
                    accent-[#0B477A]
                  "
                />
              </th>

              {/* =================================================
                  TASK TITLE
              ================================================== */}

              <TableHeader label="Task Title" />

              {/* =================================================
                  ASSIGNED TO
              ================================================== */}

              <TableHeader label="Assigned To" />

              {/* =================================================
                  PRIORITY
              ================================================== */}

              <TableHeader label="Priority" />

              {/* =================================================
                  DUE DATE
              ================================================== */}

              <TableHeader
                label="Due Date"
                sortable
              />

              {/* =================================================
                  STATUS
              ================================================== */}

              <TableHeader label="Status" />

              {/* =================================================
                  CREATED BY
              ================================================== */}

              <TableHeader label="Created By" />

              {/* =================================================
                  ACTIONS
              ================================================== */}

              <TableHeader label="Actions" />
            </tr>
          </thead>

          {/* =================================================
              TABLE BODY
          ================================================= */}

          {tasks.length > 0 && (
            <tbody>
              {tasks.map((task) => {
                const taskId =
                  task.id || task._id;

                return (
                  <TaskRow
                    key={taskId}
                    task={task}
                    isOpen={
                      openActionId === taskId
                    }
                    onToggleActions={(event) =>
                      onToggleActions?.(
                        event,
                        task
                      )
                    }
                    onView={() =>
                      onViewTask?.(task)
                    }
                    onEdit={() =>
                      onEditTask?.(task)
                    }
                    onReassign={() =>
                      onReassignTask?.(task)
                    }
                    onDelete={() =>
                      onDeleteTask?.(task)
                    }
                  />
                );
              })}
            </tbody>
          )}
        </table>
      </div>

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {tasks.length === 0 && (
        <EmptyTasksState />
      )}

      {/* =====================================================
          PAGINATION
      ====================================================== */}

      {tasks.length > 0 && (
        <TaskPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          startItem={startItem}
          endItem={endItem}
          onPageChange={onPageChange}
        />
      )}
    </section>
  );
};

/* =========================================================
   TABLE HEADER
========================================================= */

const TableHeader = ({
  label,
  sortable = false,
}) => {
  return (
    <th
      className="
        whitespace-nowrap
        px-4
        py-2.5
        text-left
        text-[9px]
        font-semibold
        leading-[13px]
        text-[#526B7E]
      "
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>

        {sortable && (
          <span
            className="
              text-[8px]
              font-normal
              text-[#91A2B1]
            "
            aria-hidden="true"
          >
            ↕
          </span>
        )}
      </div>
    </th>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyTasksState = () => {
  return (
    <div
      className="
        flex
        min-h-[210px]
        flex-col
        items-center
        justify-center
        px-5
        py-8
        text-center
      "
    >
      {/* Icon */}

      <div
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-[#EDF7FF]
          text-[#1592D0]
        "
      >
        <ClipboardList
          size={19}
          strokeWidth={1.8}
        />
      </div>

      {/* Title */}

      <h3
        className="
          mt-2.5
          text-[13px]
          font-semibold
          text-[#173750]
        "
      >
        No tasks found
      </h3>

      {/* Description */}

      <p
        className="
          mt-1
          max-w-[260px]
          text-[10px]
          font-medium
          leading-[15px]
          text-[#8293A2]
        "
      >
        There are no tasks matching your current
        search or filters.
      </p>

      {/* Helper */}

      <div
        className="
          mt-3
          flex
          items-center
          gap-1.5
          text-[8px]
          font-semibold
          text-[#91A2B1]
        "
      >
        <CheckSquare
          size={11}
          strokeWidth={1.8}
        />

        Try changing your filters.
      </div>
    </div>
  );
};

export default TasksTable;