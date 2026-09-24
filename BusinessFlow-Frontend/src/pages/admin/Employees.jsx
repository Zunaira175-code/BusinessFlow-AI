import EmployeesHeader from "../../components/Employees/EmployeesHeader";
import EmployeeDirectory from "../../components/Employees/EmployeeDirectory";

const Employees = () => {
  return (
    <main className="w-full">

      {/* 1. Employees Header */}
      <EmployeesHeader />

    

      

      {/* 4. Employee Directory */}
      <div className="mt-5">
        <EmployeeDirectory />
      </div>

    </main>
  );
};

export default Employees;