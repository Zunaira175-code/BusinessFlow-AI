import { Outlet } from "react-router-dom";
import Sidebar from "../layout/sidebar";
import Header from "../layout/header";
import PageContainer from "../layout/pagecontainer";
import Footer from "../layout/footer";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-[260px] min-h-screen">

        {/* Top Header */}
        <Header />

        {/* Page Content */}
        <PageContainer>
          <Outlet />
        </PageContainer>

        {/* Footer */}
        <Footer />

      </div>

    </div>
  );
};

export default AdminLayout;