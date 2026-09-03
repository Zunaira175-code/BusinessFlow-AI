import ReportsHeader from "../../components/Reports/ReportsHeader";
import ReportsStats from "../../components/Reports/ReportsStats";
import AIAnalyticsInsights from "../../components/Reports/AIAnalyticsInsights";
import SalesPerformance from "../../components/Reports/SalesPerformance";
import DealPipelineAnalytics from "../../components/Reports/DealPipelineAnalytics";
import TeamPerformance from "../../components/Reports/TeamPerformance";

const Reports = () => {
  return (
    <main className="w-full">

      {/* 1. Header */}
      <ReportsHeader />

      {/* 2. Stats */}
      <div className="mt-5">
        <ReportsStats />
      </div>

      {/* 3. AI Insights */}
      <div className="mt-5">
        <AIAnalyticsInsights />
      </div>

      {/* 4. Charts */}
      <div className="mt-5 grid grid-cols-2 gap-4">
        <SalesPerformance />
        <DealPipelineAnalytics />
      </div>

      {/* 5. Team Performance */}
      <div className="mt-5">
        <TeamPerformance />
      </div>

    </main>
  );
};

export default Reports;