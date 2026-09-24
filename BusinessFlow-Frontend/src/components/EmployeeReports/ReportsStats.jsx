import { useEffect, useState } from "react";

const ReportsStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH REPORT SUMMARY
  // =====================================================

  const fetchReportSummary = async () => {
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

      const response = await fetch(
        "http://localhost:5000/api/reports/summary?period=30",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to load report statistics."
        );
      }

      setStats(result.data);
    } catch (err) {
      console.error(
        "Reports Stats Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load report statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchReportSummary();
  }, []);

  // =====================================================
  // HELPERS
  // =====================================================

  const formatCurrency = (value) => {
    const number = Number(value || 0);

    return `$${number.toLocaleString(
      "en-US",
      {
        maximumFractionDigits: 0,
      }
    )}`;
  };

  const formatPercentage = (value) => {
    return `${Number(
      value || 0
    ).toFixed(1)}%`;
  };

  const getChangeText = (
    value,
    suffix = ""
  ) => {
    const change = Number(
      value || 0
    );

    if (change > 0) {
      return `↑ ${change}%${suffix}`;
    }

    if (change < 0) {
      return `↓ ${Math.abs(
        change
      )}%${suffix}`;
    }

    return `— 0%${suffix}`;
  };

  const getChangeClass = (
    value
  ) => {
    const change = Number(
      value || 0
    );

    if (change > 0) {
      return "bg-[#E8F7EF] text-[#16A05D]";
    }

    if (change < 0) {
      return "bg-[#FDECEC] text-[#D64545]";
    }

    return "border border-[#DCE5ED] text-[#60758A]";
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="grid w-full grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(
          (item) => (
            <div
              key={item}
              className="
                h-[106px]
                animate-pulse
                rounded-[9px]
                border
                border-[#DCE5ED]
                bg-white
                px-4
                py-3
              "
            >
              <div className="h-2 w-20 rounded bg-[#E8EEF3]" />

              <div className="mt-3 h-7 w-28 rounded bg-[#E8EEF3]" />

              <div className="mt-3 h-4 w-20 rounded-full bg-[#E8EEF3]" />
            </div>
          )
        )}
      </div>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {
    return (
      <div
        className="
          rounded-[9px]
          border
          border-[#F0CACA]
          bg-white
          px-4
          py-3
        "
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-[9px] font-medium text-[#D64545]">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchReportSummary}
            className="
              rounded-[5px]
              bg-[#0B3D6B]
              px-3
              py-1.5
              text-[8px]
              font-semibold
              text-white
              transition-colors
              hover:bg-[#082F54]
            "
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const totalRevenue =
    stats?.totalRevenue || 0;

  const quotaAttainment =
    stats?.quotaAttainment;

  const quotaTarget =
    stats?.quotaTarget;

  const winRate =
    stats?.winRate || 0;

  const averageDealSize =
    stats?.averageDealSize || 0;

  const revenueChange =
    stats?.changes?.totalRevenue || 0;

  const winRateChange =
    stats?.changes?.winRate || 0;

  const averageDealSizeChange =
    stats?.changes?.averageDealSize ||
    0;

  // =====================================================
  // CARD DATA
  // =====================================================

  const cards = [
    {
      title: "TOTAL REVENUE",

      value:
        formatCurrency(
          totalRevenue
        ),

      bottom:
        getChangeText(
          revenueChange,
          " vs last month"
        ),

      bottomClass:
        getChangeClass(
          revenueChange
        ),
    },

    {
      title: "QUOTA ATTAINMENT",

      value:
        quotaAttainment !== null &&
        quotaAttainment !==
          undefined
          ? formatPercentage(
              quotaAttainment
            )
          : "—",

      bottom:
        quotaTarget !== null &&
        quotaTarget !==
          undefined
          ? `Target: ${formatCurrency(
              quotaTarget
            )}`
          : "Quota not configured",

      bottomClass:
        "text-[#7A8B9A]",
    },

    {
      title: "WIN RATE",

      value:
        formatPercentage(
          winRate
        ),

      bottom:
        winRateChange > 0
          ? `↗ +${winRateChange}% trend`
          : winRateChange < 0
          ? `↘ ${Math.abs(
              winRateChange
            )}% trend`
          : "— Stable",

      bottomClass:
        getChangeClass(
          winRateChange
        ),
    },

    {
      title: "AVG. DEAL SIZE",

      value:
        formatCurrency(
          averageDealSize
        ),

      bottom:
        averageDealSizeChange >
        0
          ? `↑ ${averageDealSizeChange}% vs previous`
          : averageDealSizeChange <
            0
          ? `↓ ${Math.abs(
              averageDealSizeChange
            )}% vs previous`
          : "— Stable",

      bottomClass:
        averageDealSizeChange !==
        0
          ? getChangeClass(
              averageDealSizeChange
            )
          : "border border-[#DCE5ED] text-[#60758A]",
    },
  ];

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="grid w-full grid-cols-4 gap-3">
      {cards.map((stat) => (
        <div
          key={stat.title}
          className="
            h-[106px]
            rounded-[9px]
            border
            border-[#DCE5ED]
            bg-white
            px-4
            py-3
          "
        >
          {/* TITLE */}
          <p
            className="
              text-[8px]
              font-semibold
              tracking-[0.35px]
              text-[#60758A]
            "
          >
            {stat.title}
          </p>

          {/* VALUE */}
          <p
            className="
              mt-[8px]
              text-[24px]
              font-bold
              leading-[27px]
              tracking-[-0.6px]
              text-[#071D35]
            "
          >
            {stat.value}
          </p>

          {/* BOTTOM */}
          <div className="mt-[7px]">
            <span
              className={`
                inline-flex
                items-center
                rounded-full
                px-[7px]
                py-[3px]
                text-[7px]
                font-medium
                ${stat.bottomClass}
              `}
            >
              {stat.bottom}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportsStats;