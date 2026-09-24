import { Plus } from "lucide-react";

const EmployeeTaskHeader = ({
  onAddTask,
}) => {
  const handleAddTask = () => {
    if (typeof onAddTask === "function") {
      onAddTask();
      return;
    }

    // Fallback event for global task modal handling
    window.dispatchEvent(
      new Event(
        "businessflow-open-create-task"
      )
    );
  };

  return (
    <div className="flex w-full items-start justify-between">
      {/* =====================================================
          LEFT CONTENT
      ====================================================== */}

      <div>
        <h1
          className="
            text-[24px]
            font-bold
            leading-tight
            tracking-[-0.5px]
            text-[#071D35]
          "
        >
          My Tasks
        </h1>

        <p
          className="
            mt-1
            text-[10px]
            leading-[14px]
            text-[#60758A]
          "
        >
          Manage your assigned tasks, deadlines, priorities, and daily work.
        </p>
      </div>

      {/* =====================================================
          ADD TASK BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={handleAddTask}
        className="
          flex
          h-[30px]
          shrink-0
          items-center
          gap-1.5
          rounded-[6px]
          bg-[#0B3D6B]
          px-3
          text-[9px]
          font-semibold
          text-white
          transition-colors
          duration-200
          hover:bg-[#082F54]
          active:scale-[0.98]
        "
      >
        <Plus
          size={11}
          strokeWidth={2}
        />

        <span>
          Add Task
        </span>
      </button>
    </div>
  );
};

export default EmployeeTaskHeader;