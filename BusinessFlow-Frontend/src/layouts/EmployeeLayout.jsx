import { Outlet } from "react-router-dom";

import EmployeeSidebar from "../layout/EmployeeSidebar";
import EmployeeHeader from "../layout/EmployeeHeader";
import Footer from "../layout/footer";

const EmployeeLayout = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">

      {/* Sidebar */}
      <EmployeeSidebar />

      {/* Main Area */}
      <div className="ml-[260px] min-h-screen">

        {/* Header */}
        <EmployeeHeader />

        {/* Page Content */}
        <main className="px-5 py-5">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />

      </div>
    </div>
  );
};

export default EmployeeLayout;