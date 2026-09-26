import { useCallback, useState } from "react";

import LeadsHeader from "../../components/Leads/LeadsHeader";
import LeadsStats from "../../components/Leads/LeadsStats";
import LeadsToolbar from "../../components/Leads/LeadsToolbar";
import LeadsTable from "../../components/Leads/LeadsTable";
import AILeadIntelligence from "../../components/Leads/AILeadIntelligence";

const Leads = () => {
  // =====================================================
  // LEADS FILTERS
  // =====================================================

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    score: "",
    source: "",
  });

  // =====================================================
  // FILTER CHANGE
  // =====================================================

  const handleFilterChange = useCallback(
    (nextFilters) => {
      setFilters({
        search: nextFilters?.search || "",
        status: nextFilters?.status || "",
        score: nextFilters?.score || "",
        source: nextFilters?.source || "",
      });
    },
    []
  );

  // =====================================================
  // VIEW MODE
  // =====================================================

  const [view, setView] = useState("list");

  const handleViewChange = useCallback(
    (nextView) => {
      setView(nextView);
    },
    []
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="w-full">
      {/* =================================================
          HEADER
      ================================================= */}

      <LeadsHeader />

      {/* =================================================
          STATS
      ================================================= */}

      <LeadsStats />

      {/* =================================================
          AI LEAD INTELLIGENCE
      ================================================= */}

      <div className="mt-6">
        <AILeadIntelligence />
      </div>

      {/* =================================================
          TOOLBAR
          Sends filters to parent
      ================================================= */}

      <LeadsToolbar
        onFilterChange={handleFilterChange}
        onViewChange={handleViewChange}
      />

      {/* =================================================
          TABLE
          Receives filters from parent
      ================================================= */}

      <LeadsTable
        filters={filters}
        view={view}
      />
    </div>
  );
};

export default Leads;