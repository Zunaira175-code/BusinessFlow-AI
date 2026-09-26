import DashboardHeader from "../../components/AdminDashboard/DashboardHeader";
import StatsCards from "../../components/AdminDashboard/StatsCards";
import SalesPipeline from "../../components/AdminDashboard/StatsPipeline";
import IntelligenceSummary from "../../components/AdminDashboard/IntelligenceSummary";
import RecentLeads from "../../components/AdminDashboard/RecentLeads";
import QuickActions from "../../components/AdminDashboard/QuickActions";
import InsightCards from "../../components/AdminDashboard/InsightCards";
import ActivityFeed from "../../components/AdminDashboard/ActivityFeed";
import TaskUpcoming from "../../components/AdminDashboard/TaskUpcoming";
import TeamPerformance from "../../components/AdminDashboard/TeamPerformance";
import AIInsights from "../../components/AdminDashboard/AIInsights";

const Dashboard = () => {
  return (
    <main className="w-full">

      {/* =====================================================
          1. DASHBOARD HEADER
      ====================================================== */}
      <DashboardHeader />


      {/* =====================================================
          2. STATS CARDS
          Total Revenue | New Leads | Active Deals | Conversion
      ====================================================== */}
      <section className="mt-5">
        <StatsCards />
      </section>


      {/* =====================================================
          3. SALES PIPELINE + INTELLIGENCE SUMMARY
      ====================================================== */}
      <section className="mt-4">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,0.72fr)]">

          <SalesPipeline />

          <IntelligenceSummary />

        </div>
      </section>

    


      {/* =====================================================
          4. RECENT LEADS
      ====================================================== */}
      <section className="mt-4">
        <RecentLeads />
      </section>


      {/* =====================================================
          5. QUICK ACTIONS
      ====================================================== */}
      <section className="mt-4">
        <QuickActions />
      </section>


      {/* =====================================================
    3. AI BUSINESS INSIGHTS
====================================================== */}
      <section className="mt-4">
        <AIInsights />
      </section>



      {/* =====================================================
          7. BOTTOM THREE CARDS
          Activity Feed | Tasks | Team Performance
      ====================================================== */}
      <section className="mt-4 pb-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

          <ActivityFeed />

          <TaskUpcoming />

          <TeamPerformance />

        </div>
      </section>

    </main>
  );
};

export default Dashboard;