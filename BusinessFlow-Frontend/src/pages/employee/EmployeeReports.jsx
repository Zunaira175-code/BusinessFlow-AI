import ReportsPageHeader from "../../components/EmployeeReports/ReportsPageHeader";
import ReportsStats from "../../components/EmployeeReports/ReportsStats";
import SalesPerformance from "../../components/EmployeeReports/SalesPerformance";
import AIPerformanceAnalysis from "../../components/EmployeeReports/AIPerformanceAnalysis";
import LeadConversionFunnel from "../../components/EmployeeReports/LeadConversionFunnel";
import RecentPerformance from "../../components/EmployeeReports/RecentPerformance";

const EmployeeReports = () => {
  return (
    <div className="w-full">

      {/* =========================================
          PAGE HEADER
      ========================================= */}
      <ReportsPageHeader />

      {/* =========================================
          STAT CARDS
      ========================================= */}
      <div className="mt-4">
        <ReportsStats />
      </div>

      {/* =========================================
          SALES PERFORMANCE + AI ANALYSIS
      ========================================= */}
      <div
        className="
          mt-4
          grid
          w-full
          grid-cols-[1.65fr_0.75fr]
          gap-3
        "
      >
        <SalesPerformance />

        <AIPerformanceAnalysis />
      </div>

      {/* =========================================
          FUNNEL + RECENT PERFORMANCE
      ========================================= */}
      <div
        className="
          mt-4
          grid
          w-full
          grid-cols-[0.7fr_1.5fr]
          gap-3
        "
      >
        <LeadConversionFunnel />

        <RecentPerformance />
      </div>

    </div>
  );
};

export default EmployeeReports;