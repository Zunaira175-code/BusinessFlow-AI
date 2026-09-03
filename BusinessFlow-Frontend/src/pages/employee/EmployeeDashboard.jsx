import EmployeeDashboardHeader from "../../components/EmployeeDashboard/EmployeeDashboardHeader";
import EmployeeStats from "../../components/EmployeeDashboard/EmployeeStats";
import MyTasks from "../../components/EmployeeDashboard/MyTasks";
import Upcoming from "../../components/EmployeeDashboard/Upcoming";

const EmployeeDashboard = () => {
  return (
    <div className="w-full">

      {/* =========================================
          DASHBOARD HEADER
      ========================================= */}
      <EmployeeDashboardHeader
        employeeName="Alex"
        onAddTask={() => {
          console.log("Add Task clicked");
        }}
      />

      {/* =========================================
          STATS
      ========================================= */}
      <div className="mt-4">
        <EmployeeStats />
      </div>

      {/* =========================================
          MY TASKS + UPCOMING
      ========================================= */}
      <div
        className="
          mt-4
          grid
          w-full
          grid-cols-1
          gap-3
          lg:grid-cols-[1.2fr_1fr]
        "
      >
        <MyTasks />
        <Upcoming />
      </div>

    </div>
  );
};

export default EmployeeDashboard;