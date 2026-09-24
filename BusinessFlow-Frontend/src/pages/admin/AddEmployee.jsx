import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import EmployeeInformation from "../../components/AddEmployee/EmployeeInformation";
import HowItWorks from "../../components/AddEmployee/HowItWorks";
import RolePermissions from "../../components/AddEmployee/RolePermissions";

const AddEmployee = () => {
  return (
    <main className="min-h-full bg-[#F7FAFD]">
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-3 pb-5 sm:px-5 lg:px-6">

        {/* PAGE HEADER */}
        <div className="mb-4">
          <Link
            to="/admin/employees"
            className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#193B5B] transition hover:text-[#0B3D6B]"
          >
            <ArrowLeft size={14} strokeWidth={1.8} />
            Back to Employees
          </Link>

          <h1 className="text-[23px] font-bold leading-[29px] tracking-[-0.3px] text-[#092D50]">
            Add Employee
          </h1>

          <p className="mt-0.5 text-[11px] leading-[17px] text-[#71869A]">
            Create a new team member and send them an invitation to join your
            workspace.
          </p>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_350px]">

          {/* LEFT */}
          <div className="min-w-0">
            <EmployeeInformation />
          </div>

          {/* RIGHT */}
          <aside className="flex min-w-0 flex-col gap-4">
            <HowItWorks />
            <RolePermissions />
          </aside>

        </div>
      </div>
    </main>
  );
};

export default AddEmployee;