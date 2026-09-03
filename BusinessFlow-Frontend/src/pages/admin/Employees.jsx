import EmployeesHeader from "../../components/Employees/EmployeesHeader";
import EmployeeStats from "../../components/Employees/EmployeeStats";
import AITeamIntelligence from "../../components/Employees/AITeamIntelligence";
import EmployeeDirectory from "../../components/Employees/EmployeeDirectory";

const Employees = () => {
  return (
    <main className="w-full">

      {/* 1. Employees Header */}
      <EmployeesHeader />

      {/* 2. Employee Stats */}
      <div className="mt-5">
        <EmployeeStats />
      </div>

      {/* 3. AI Team Intelligence */}
      <div className="mt-5">
        <AITeamIntelligence />
      </div>

      {/* 4. Employee Directory */}
      <div className="mt-5">
        <EmployeeDirectory />
      </div>

    </main>
  );
};

export default Employees;