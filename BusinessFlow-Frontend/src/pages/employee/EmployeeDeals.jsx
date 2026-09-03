import EmployeeDealHeader from "../../components/EmployeeDeals/EmployeeDealHeader";
import DealStats from "../../components/EmployeeDeals/DealStats";
import DealFilters from "../../components/EmployeeDeals/DealFilters";
import DealList from "../../components/EmployeeDeals/DealList";

const EmployeeDeals = () => {
  return (
    <div className="w-full">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <EmployeeDealHeader
        onAddDeal={() => {
          console.log("New Deal clicked");
        }}
      />

      {/* =====================================================
          DEAL STATS
      ====================================================== */}

      <div className="mt-4">
        <DealStats />
      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <DealFilters />

      {/* =====================================================
          DEAL LIST
      ====================================================== */}

      <DealList />

    </div>
  );
};

export default EmployeeDeals;