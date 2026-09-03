import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/PublicDashboard/PublicNavbar";
import Footer from "../layout/footer";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#EEF5FF] text-[#092D50]">
      <PublicNavbar />

      <main className="w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;