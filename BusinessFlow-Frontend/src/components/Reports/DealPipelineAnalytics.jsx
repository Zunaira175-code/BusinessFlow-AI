import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

const DealPipelineAnalytics = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET AUTH TOKEN
  // =====================================================

  const getToken = () => {
    return (
      localStorage.getItem("businessflow_token") ||
      sessionStorage.getItem("businessflow_token")
    );
  };

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (value) => {
    const amount = Number(value) || 0;

    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }

    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`;
    }

    return `$${amount.toLocaleString()}`;
  };

  // =====================================================
  // DISPLAY STAGE NAME
  // =====================================================

  const getStageName = (stage) => {
    switch (stage) {
      case "Prospecting":
        return "Discovery";

      case "Closed Won":
        return "Won";

      case "Closed Lost":
        return "Lost";

      default:
        return stage;
    }
  };

  // =====================================================
  // STAGE COLORS
  // =====================================================

  const getStageColor = (stage) => {
    switch (stage) {
      case "Prospecting":
        return "bg-[#061C35]";

      case "Qualification":
        return "bg-[#3E628D]";

      case "Proposal":
        return "bg-[#0795D1]";

      case "Negotiation":
        return "bg-[#E88A08]";

      case "Closed Won":
        return "bg-[#16A653]";

      case "Closed Lost":
        return "bg-[#EB777C]";

      default:
        return "bg-[#3E628D]";
    }
  };

  // =====================================================
  // FETCH DEAL PIPELINE
  // =====================================================

  useEffect(() => {
    const fetchDealPipeline = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          throw new Error(
            "Authentication token not found. Please login again."
          );
        }

        const response = await fetch(
          `${API_URL}/reports/deal-pipeline`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let result;

        try {
          result = await response.json();
        } catch {
          throw new Error(
            "The server returned an invalid response."
          );
        }

        if (!response.ok || !result?.success) {
          throw new Error(
            result?.message ||
              "Unable to load deal pipeline."
          );
        }

        const data = Array.isArray(result?.data)
          ? result.data
          : [];

        setStages(data);
      } catch (error) {
        console.error(
          "Deal Pipeline Error:",
          error
        );

        setError(
          error?.message ||
            "Unable to load deal pipeline."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDealPipeline();
  }, []);

  // =====================================================
  // FIND MAX VALUE
  // =====================================================

  const maxValue = Math.max(
    ...stages.map(
      (stage) => Number(stage.value) || 0
    ),
    1
  );

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <section className="w-full rounded-[9px] border border-[#DCE5EF] bg-white p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-[#102A43]">
            Deal Pipeline Analytics
          </h2>

          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded text-[#526B82] hover:bg-[#F3F6F9]"
            aria-label="More options"
          >
            <span className="text-[17px] leading-none">
              ⋮
            </span>
          </button>
        </div>

        {/* Skeleton */}
        <div className="mt-3 space-y-[7px]">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div key={index}>
                <div className="mb-[3px] flex items-center justify-between">
                  <div className="h-[8px] w-20 animate-pulse rounded bg-[#E8EEF4]" />

                  <div className="h-[8px] w-24 animate-pulse rounded bg-[#EEF2F5]" />
                </div>

                <div className="h-[7px] w-full overflow-hidden rounded-full bg-[#F0F3F6]">
                  <div
                    className="h-full animate-pulse rounded-full bg-[#DCE5EF]"
                    style={{
                      width: `${70 - index * 7}%`,
                    }}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </section>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {
    return (
      <section className="w-full rounded-[9px] border border-[#DCE5EF] bg-white p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-[#102A43]">
            Deal Pipeline Analytics
          </h2>

          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded text-[#526B82] hover:bg-[#F3F6F9]"
            aria-label="More options"
          >
            <span className="text-[17px] leading-none">
              ⋮
            </span>
          </button>
        </div>

        <div className="flex min-h-[150px] items-center justify-center text-center">
          <div>
            <p className="text-[10px] font-semibold text-[#B42318]">
              Unable to load deal pipeline
            </p>

            <p className="mt-1 text-[8px] text-[#71869A]">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (!stages.length) {
    return (
      <section className="w-full rounded-[9px] border border-[#DCE5EF] bg-white p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-[#102A43]">
            Deal Pipeline Analytics
          </h2>

          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded text-[#526B82] hover:bg-[#F3F6F9]"
            aria-label="More options"
          >
            <span className="text-[17px] leading-none">
              ⋮
            </span>
          </button>
        </div>

        <div className="flex min-h-[150px] items-center justify-center">
          <p className="text-[10px] text-[#8293A3]">
            No deal pipeline data available.
          </p>
        </div>
      </section>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <section className="w-full rounded-[9px] border border-[#DCE5EF] bg-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-[#102A43]">
          Deal Pipeline Analytics
        </h2>

        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center rounded text-[#526B82] hover:bg-[#F3F6F9]"
          aria-label="More options"
        >
          <span className="text-[17px] leading-none">
            ⋮
          </span>
        </button>
      </div>

      {/* Pipeline */}
      <div className="mt-3 space-y-[7px]">
        {stages.map((stage) => {
          const value = Number(stage.value) || 0;
          const deals = Number(stage.deals) || 0;

          const width =
            maxValue > 0
              ? `${Math.max(
                  2,
                  (value / maxValue) * 100
                )}%`
              : "0%";

          return (
            <div key={stage.stage}>
              {/* Stage Header */}
              <div className="mb-[3px] flex items-center justify-between">
                <span className="text-[8px] font-semibold text-[#17324D]">
                  {getStageName(stage.stage)}
                </span>

                <span className="text-[8px] text-[#8293A3]">
                  {deals.toLocaleString()}{" "}
                  {deals === 1
                    ? "deal"
                    : "deals"}{" "}
                  ({formatCurrency(value)})
                </span>
              </div>

              {/* Background Track */}
              <div className="h-[7px] w-full overflow-hidden rounded-full bg-[#F0F3F6]">
                {/* Progress */}
                <div
                  className={`h-full rounded-full ${getStageColor(
                    stage.stage
                  )}`}
                  style={{
                    width,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DealPipelineAnalytics;