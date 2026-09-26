import { useCallback, useEffect, useState } from "react";

import DealsHeader from "../../components/Deals/DealsHeader";
import DealsStats from "../../components/Deals/DealsStats";
import DealsToolbar from "../../components/Deals/DealsToolbar";
import DealsPipeline from "../../components/Deals/DealsPipeline";
import AIPipelineAnalytics from "../../components/Deals/AIPipelineAnalytics";
import AIDealIntelligence from "../../components/Deals/AIDealIntelligence";

import api from "../../services/api";

const Deals = () => {
  // =====================================================
  // STATS
  // =====================================================

  const [dealStats, setDealStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // =====================================================
  // DEALS
  // =====================================================

  const [deals, setDeals] = useState([]);
  const [dealsLoading, setDealsLoading] = useState(true);
  const [dealsError, setDealsError] = useState("");

  // =====================================================
  // VIEW
  // =====================================================

  const [view, setView] = useState("board");

  // =====================================================
  // FILTERS
  // =====================================================

  const [filters, setFilters] = useState({
    search: "",
    stage: "",
    status: "",
    assignedTo: "",
    leadId: "",
    customerId: "",
  });

  // =====================================================
  // PAGINATION
  // =====================================================

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // =====================================================
  // FETCH STATS
  // =====================================================

  const fetchDealStats = useCallback(async () => {
    try {
      setStatsLoading(true);

      const result = await api("/admin/deals/stats");

      setDealStats(result?.data || null);
    } catch (error) {
      console.error(
        "Failed to fetch deal statistics:",
        error
      );
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // =====================================================
  // FETCH DEALS
  // =====================================================
const fetchDeals = useCallback(async () => {
  try {
    setDealsLoading(true);
    setDealsError("");

    const params = new URLSearchParams();

    params.set(
      "limit",
      "100"
    );

    const result = await api(
      `/integrations/hubspot/deals?${params.toString()}`
    );

    const data = result?.data;

    setDeals(
      data?.deals || []
    );
  } catch (error) {
    console.error(
      "Failed to fetch HubSpot deals:",
      error
    );

    setDealsError(
      error?.message ||
        "Unable to fetch HubSpot deals."
    );

    setDeals([]);
  } finally {
    setDealsLoading(false);
  }
}, []);
useEffect(() => {
  fetchDeals();
}, [fetchDeals]);

  // =====================================================
  // INITIAL / FILTER FETCH
  // =====================================================

  useEffect(() => {
    fetchDealStats();
  }, [fetchDealStats]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // =====================================================
  // FILTER CHANGE
  // =====================================================

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  };

  // =====================================================
  // VIEW CHANGE
  // =====================================================

  const handleViewChange = (newView) => {
    setView(newView);
  };

  // =====================================================
  // PAGINATION
  // =====================================================

  const handlePageChange = (page) => {
    setPagination((previous) => ({
      ...previous,
      page,
    }));
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="w-full">
      <DealsHeader />

      <DealsStats
        stats={dealStats}
        loading={statsLoading}
      />

      <DealsToolbar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        view={view}
        onViewChange={handleViewChange}
      />

      <DealsPipeline
        deals={deals}
        loading={dealsLoading}
        error={dealsError}
        view={view}
      />

      {/* Pagination will be connected here later */}

    

      <div className="mt-5">
  <AIDealIntelligence />
</div>
    </div>
  );
};

export default Deals;