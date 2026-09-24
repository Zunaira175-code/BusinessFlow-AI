import { useEffect, useState } from "react";

const RecentPerformance = () => {
  const [summary, setSummary] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH REPORT DATA
  // =====================================================

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "businessflow_token"
        );

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      };

      const [
        summaryResponse,
        analysisResponse,
      ] = await Promise.all([
        fetch(
          "http://localhost:5000/api/reports/summary?period=30",
          {
            method: "GET",
            headers,
          }
        ),

        fetch(
          "http://localhost:5000/api/reports/ai-analysis?period=30",
          {
            method: "GET",
            headers,
          }
        ),
      ]);

      const summaryResult =
        await summaryResponse.json();

      const analysisResult =
        await analysisResponse.json();

      if (
        !summaryResponse.ok ||
        !summaryResult.success
      ) {
        throw new Error(
          summaryResult.message ||
            "Unable to load report summary."
        );
      }

      if (
        !analysisResponse.ok ||
        !analysisResult.success
      ) {
        throw new Error(
          analysisResult.message ||
            "Unable to load performance analysis."
        );
      }

      setSummary(
        summaryResult.data
      );

      setAnalysis(
        analysisResult.data
      );
    } catch (err) {
      console.error(
        "Recent Performance Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load performance breakdown."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchPerformance();
  }, []);

  // =====================================================
  // HELPERS
  // =====================================================

  const formatCurrency = (value) => {
    return `$${Number(
      value || 0
    ).toLocaleString("en-US", {
      maximumFractionDigits: 0,
    })}`;
  };

  const formatPercentage = (
    value
  ) => {
    return `${Number(
      value || 0
    ).toFixed(1)}%`;
  };

  const formatChange = (
    value
  ) => {
    const change = Number(
      value || 0
    );

    if (change > 0) {
      return `+${change}%`;
    }

    if (change < 0) {
      return `${change}%`;
    }

    return "0%";
  };

  const getChangeClass = (
    value
  ) => {
    const change = Number(
      value || 0
    );

    if (change > 0) {
      return "text-[#16A05D]";
    }

    if (change < 0) {
      return "text-[#E58A00]";
    }

    return "text-[#60758A]";
  };

  const getStatus = (
    value,
    type
  ) => {
    const number = Number(
      value || 0
    );

    if (type === "revenue") {
      if (number >= 10) {
        return {
          label: "Excellent",
          className:
            "bg-[#E8F7EF] text-[#16A05D]",
        };
      }

      if (number >= 0) {
        return {
          label: "Good",
          className:
            "bg-[#E8F7EF] text-[#16A05D]",
        };
      }

      return {
        label: "Monitor",
        className:
          "bg-[#FFF1DF] text-[#E58A00]",
      };
    }

    if (type === "conversion") {
      if (number >= 20) {
        return {
          label: "Excellent",
          className:
            "bg-[#E8F7EF] text-[#16A05D]",
        };
      }

      if (number >= 10) {
        return {
          label: "Good",
          className:
            "bg-[#E8F7EF] text-[#16A05D]",
        };
      }

      return {
        label: "Monitor",
        className:
          "bg-[#FFF1DF] text-[#E58A00]",
      };
    }

    if (type === "winRate") {
      if (number >= 25) {
        return {
          label: "Excellent",
          className:
            "bg-[#E8F7EF] text-[#16A05D]",
        };
      }

      if (number >= 15) {
        return {
          label: "Good",
          className:
            "bg-[#E8F7EF] text-[#16A05D]",
        };
      }

      return {
        label: "Monitor",
        className:
          "bg-[#FFF1DF] text-[#E58A00]",
      };
    }

    if (type === "deals") {
      if (number >= 10) {
        return {
          label: "Excellent",
          className:
            "bg-[#E8F7EF] text-[#16A05D]",
        };
      }

      if (number > 0) {
        return {
          label: "Good",
          className:
            "bg-[#E8F7EF] text-[#16A05D]",
        };
      }

      return {
        label: "Monitor",
        className:
          "bg-[#FFF1DF] text-[#E58A00]",
      };
    }

    return {
      label: "Monitor",
      className:
        "bg-[#FFF1DF] text-[#E58A00]",
    };
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section
        className="
          h-[238px]
          overflow-hidden
          rounded-[9px]
          border
          border-[#DCE5ED]
          bg-white
        "
      >
        {/* Header */}
        <div className="h-[52px] border-b border-[#DCE5ED] px-4 py-4">
          <div className="h-3 w-40 animate-pulse rounded bg-[#E8EEF3]" />
        </div>

        {/* Skeleton */}
        <div className="space-y-2 px-3 py-3">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="
                  grid
                  h-[38px]
                  grid-cols-5
                  items-center
                  gap-2
                  border-t
                  border-[#E4EBF1]
                "
              >
                <div className="h-2 w-16 animate-pulse rounded bg-[#E8EEF3]" />
                <div className="h-2 w-20 animate-pulse rounded bg-[#E8EEF3]" />
                <div className="h-2 w-20 animate-pulse rounded bg-[#E8EEF3]" />
                <div className="h-2 w-10 animate-pulse rounded bg-[#E8EEF3]" />
                <div className="h-4 w-14 animate-pulse rounded bg-[#E8EEF3]" />
              </div>
            )
          )}
        </div>
      </section>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <section
        className="
          h-[238px]
          overflow-hidden
          rounded-[9px]
          border
          border-[#DCE5ED]
          bg-white
        "
      >
        <div className="h-[52px] border-b border-[#DCE5ED] px-4 py-4">
          <h2 className="text-[13px] font-bold text-[#17324D]">
            Recent Performance Breakdowns
          </h2>
        </div>

        <div className="flex h-[185px] flex-col items-center justify-center gap-2">
          <p className="text-[8px] text-[#D64545]">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchPerformance}
            className="
              rounded-[5px]
              bg-[#0B3D6B]
              px-3
              py-1.5
              text-[7px]
              font-semibold
              text-white
              hover:bg-[#082F54]
            "
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // =====================================================
  // BACKEND DATA
  // =====================================================

  const currentRevenue =
    summary?.totalRevenue || 0;

  const revenueChange =
    summary?.changes?.totalRevenue ||
    0;

  const currentConversion =
    analysis?.metrics?.conversionRate ||
    summary?.conversionRate ||
    0;

  const currentWinRate =
    analysis?.metrics?.winRate || 0;

  const dealsWon =
    analysis?.metrics?.wonDeals ||
    summary?.dealsWon ||
    0;

  const previousRevenue =
    revenueChange !== 0
      ? currentRevenue /
        (1 + revenueChange / 100)
      : currentRevenue;

  const previousConversion =
    summary?.changes?.conversionRate !==
    undefined
      ? currentConversion -
        Number(
          summary.changes
            .conversionRate || 0
        )
      : currentConversion;

  const previousDealsWon =
    summary?.changes?.dealsWon !==
    undefined
      ? dealsWon /
        (1 +
          Number(
            summary.changes
              .dealsWon || 0
          ) /
            100)
      : dealsWon;

  // =====================================================
  // ROWS
  // =====================================================

  const revenueStatus =
    getStatus(
      revenueChange,
      "revenue"
    );

  const conversionStatus =
    getStatus(
      currentConversion,
      "conversion"
    );

  const winRateStatus =
    getStatus(
      currentWinRate,
      "winRate"
    );

  const dealsStatus =
    getStatus(
      dealsWon,
      "deals"
    );

  const rows = [
    {
      metric: "Revenue",

      current:
        formatCurrency(
          currentRevenue
        ),

      previous:
        formatCurrency(
          previousRevenue
        ),

      change:
        formatChange(
          revenueChange
        ),

      changeClass:
        getChangeClass(
          revenueChange
        ),

      status:
        revenueStatus.label,

      statusClass:
        revenueStatus.className,
    },

    {
      metric: "Lead Conversion",

      current:
        formatPercentage(
          currentConversion
        ),

      previous:
        formatPercentage(
          previousConversion
        ),

      change:
        formatChange(
          summary?.changes
            ?.conversionRate || 0
        ),

      changeClass:
        getChangeClass(
          summary?.changes
            ?.conversionRate || 0
        ),

      status:
        conversionStatus.label,

      statusClass:
        conversionStatus.className,
    },

    {
      metric: "Deal Win Rate",

      current:
        formatPercentage(
          currentWinRate
        ),

      previous:
        "—",

      change:
        "—",

      changeClass:
        "text-[#60758A]",

      status:
        winRateStatus.label,

      statusClass:
        winRateStatus.className,
    },

    {
      metric: "Deals Won",

      current:
        `${dealsWon} Deal${
          dealsWon === 1
            ? ""
            : "s"
        }`,

      previous:
        `${Math.round(
          previousDealsWon
        )} Deal${
          Math.round(
            previousDealsWon
          ) === 1
            ? ""
            : "s"
        }`,

      change:
        formatChange(
          summary?.changes
            ?.dealsWon || 0
        ),

      changeClass:
        getChangeClass(
          summary?.changes
            ?.dealsWon || 0
        ),

      status:
        dealsStatus.label,

      statusClass:
        dealsStatus.className,
    },
  ];

  // =====================================================
  // UI
  // =====================================================

  return (
    <section
      className="
        h-[238px]
        overflow-hidden
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
      "
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="h-[52px] border-b border-[#DCE5ED] px-4 py-4">
        <h2 className="text-[13px] font-bold text-[#17324D]">
          Recent Performance Breakdowns
        </h2>
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="h-[31px] bg-[#F7F9FB]">
              <th className="px-3 text-left text-[7px] font-semibold text-[#60758A]">
                Metric
              </th>

              <th className="px-2 text-left text-[7px] font-semibold text-[#60758A]">
                Current Period
              </th>

              <th className="px-2 text-left text-[7px] font-semibold text-[#60758A]">
                Previous Period
              </th>

              <th className="px-2 text-left text-[7px] font-semibold text-[#60758A]">
                Change
              </th>

              <th className="px-2 text-left text-[7px] font-semibold text-[#60758A]">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.metric}
                className="
                  h-[38px]
                  border-t
                  border-[#E4EBF1]
                "
              >
                {/* Metric */}
                <td className="whitespace-nowrap px-3 text-[7px] font-medium text-[#17324D]">
                  {row.metric}
                </td>

                {/* Current */}
                <td className="whitespace-nowrap px-2 text-[7px] text-[#425B70]">
                  {row.current}
                </td>

                {/* Previous */}
                <td className="whitespace-nowrap px-2 text-[7px] text-[#60758A]">
                  {row.previous}
                </td>

                {/* Change */}
                <td
                  className={`
                    whitespace-nowrap
                    px-2
                    text-[7px]
                    font-semibold
                    ${row.changeClass}
                  `}
                >
                  {row.change}
                </td>

                {/* Status */}
                <td className="px-2">
                  <span
                    className={`
                      inline-flex
                      rounded-[4px]
                      px-[7px]
                      py-[3px]
                      text-[6px]
                      font-semibold
                      ${row.statusClass}
                    `}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentPerformance;