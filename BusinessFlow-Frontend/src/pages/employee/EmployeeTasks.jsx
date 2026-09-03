import EmployeeTaskHeader from "../../components/EmployeeTasks/EmployeeTaskHeader";
import TaskStats from "../../components/EmployeeTasks/TaskStats";
import AIFocusSuggestion from "../../components/EmployeeTasks/AIFocusSuggestion";
import TaskBacklog from "../../components/EmployeeTasks/TaskBacklog";
import QuickActions from "../../components/EmployeeTasks/QuickActions";
import UpcomingTasks from "../../components/EmployeeTasks/UpcomingTasks";

const EmployeeTasks = () => {
  return (
    <div className="w-full">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <EmployeeTaskHeader
        onAddTask={() => {
          console.log("Add Task clicked");
        }}
      />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className="
          mt-4
          grid
          w-full
          grid-cols-1
          gap-3
          lg:grid-cols-[minmax(0,1fr)_226px]
        "
      >
        {/* =================================================
            LEFT COLUMN
        ================================================== */}

        <div className="min-w-0">

          {/* Stats */}
          <TaskStats />

          {/* Task Backlog */}
          <div className="mt-4">
            <TaskBacklog />
          </div>

        </div>

        {/* =================================================
            RIGHT COLUMN
        ================================================== */}

        <div className="space-y-3">

          {/* AI Focus Suggestion */}
          <AIFocusSuggestion />

          {/* Quick Actions */}
          <QuickActions />

          {/* Upcoming */}
          <UpcomingTasks />

        </div>
      </div>

    </div>
  );
};

export default EmployeeTasks;