import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

const ReportsStats = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    dealsWon: 0,
    newLeads: 0,
    conversionRate: 0,
  });

  const [changes, setChanges] = useState({
    totalRevenue: 0,
    dealsWon: 0,
    newLeads: 0,
    conversionRate: 0,
  });

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
      return `$${(amount / 1000).toFixed(1)}K`;
    }

    return `$${amount.toLocaleString()}`;
  };

  // =====================================================
  // FORMAT NUMBER
  // =====================================================

  const formatNumber = (value) => {
    return (Number(value) || 0).toLocaleString();
  };

  // =====================================================
  // FORMAT CHANGE
  // =====================================================

  const formatChange = (value) => {
    const number = Number(value) || 0;

    if (number > 0) {
      return `+${number}%`;
    }

    if (number < 0) {
      return `${number}%`;
    }

    return "0%";
  };

  // =====================================================
  // CHANGE COLOR
  // =====================================================

  const getChangeColor = (value) => {
    const number = Number(value) || 0;

    if (number > 0) {
      return {
        background: "bg-[#E8F7EF]",
        text: "text-[#16A05D]",
      };
    }

    if (number < 0) {
      return {
        background: "bg-[#FDECEC]",
        text: "text-[#B42318]",
      };
    }

    return {
      background: "bg-[#F3F6F9]",
      text: "text-[#64798C]",
    };
  };

  // =====================================================
  // FETCH REPORT SUMMARY
  // =====================================================

  useEffect(() => {
    const fetchReportSummary = async () => {
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
          `${API_URL}/reports/summary?period=30`,
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
              "Unable to load report statistics."
          );
        }

        const data = result?.data || {};

        setStats({
          totalRevenue:
            Number(data.totalRevenue) || 0,

          dealsWon:
            Number(data.dealsWon) || 0,

          newLeads:
            Number(data.newLeads) || 0,

          conversionRate:
            Number(data.conversionRate) || 0,
        });

        setChanges({
          totalRevenue:
            Number(data.changes?.totalRevenue) || 0,

          dealsWon:
            Number(data.changes?.dealsWon) || 0,

          newLeads:
            Number(data.changes?.newLeads) || 0,

          conversionRate:
            Number(data.changes?.conversionRate) || 0,
        });
      } catch (error) {
        console.error(
          "Reports Stats Error:",
          error
        );

        setError(
          error?.message ||
            "Unable to load report statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReportSummary();
  }, []);

  // =====================================================
  // STATS CONFIG
  // =====================================================

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(
        stats.totalRevenue
      ),
      change: changes.totalRevenue,
    },

    {
      title: "Deals Won",
      value: formatNumber(
        stats.dealsWon
      ),
      change: changes.dealsWon,
    },

    {
      title: "New Leads",
      value: formatNumber(
        stats.newLeads
      ),
      change: changes.newLeads,
    },

    {
      title: "Conversion Rate",
      value: `${Number(
        stats.conversionRate
      ).toFixed(1)}%`,
      change: changes.conversionRate,
    },
  ];

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <section className="grid w-full grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-[99px] rounded-[9px] border border-[#DCE5EF] bg-white px-4 py-3.5"
            >
              <div className="h-3 w-20 animate-pulse rounded bg-[#E8EEF4]" />

              <div className="mt-2 h-7 w-24 animate-pulse rounded bg-[#E8EEF4]" />

              <div className="mt-2 h-4 w-28 animate-pulse rounded bg-[#EEF2F5]" />
            </div>
          )
        )}
      </section>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {
    return (
      <section className="grid w-full grid-cols-4 gap-4">
        <div className="col-span-4 flex min-h-[99px] items-center justify-center rounded-[9px] border border-[#DCE5EF] bg-white">
          <div className="text-center">
            <p className="text-[10px] font-semibold text-[#B42318]">
              Unable to load report statistics
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
  // MAIN
  // =====================================================

  return (
    <section className="grid w-full grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const changeColors =
          getChangeColor(stat.change);

        const isPositive =
          Number(stat.change) > 0;

        return (
          <div
            key={stat.title}
            className="h-[99px] rounded-[9px] border border-[#DCE5EF] bg-white px-4 py-3.5"
          >
            {/* Title */}
            <p className="text-[9px] font-medium leading-[13px] text-[#64798C]">
              {stat.title}
            </p>

            {/* Value */}
            <p className="mt-[3px] text-[22px] font-bold leading-[27px] text-[#071D35]">
              {stat.value}
            </p>

            {/* Change */}
            <div
              className={`mt-[4px] inline-flex items-center rounded-[3px] px-[5px] py-[2px] ${changeColors.background}`}
            >
              <span
                className={`mr-[3px] text-[8px] font-bold ${changeColors.text}`}
              >
                {isPositive
                  ? "↗"
                  : Number(stat.change) < 0
                  ? "↘"
                  : "→"}
              </span>

              <span
                className={`text-[8px] font-semibold ${changeColors.text}`}
              >
                {formatChange(
                  stat.change
                )}{" "}
                vs previous period
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default ReportsStats;