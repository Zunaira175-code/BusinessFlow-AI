import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react";

// =====================================================
// API
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// =====================================================
// TOKEN HELPER
// =====================================================

const getToken = () => {
  const token =
    localStorage.getItem("businessflow_token") ||
    sessionStorage.getItem("businessflow_token");

  if (!token || token === "null" || token === "undefined") {
    return null;
  }

  return token.replace(/^Bearer\s+/i, "").trim();
};

// =====================================================
// COMPONENT
// =====================================================

const LeadsStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===================================================
  // FETCH STATS
  // ===================================================

  const fetchStats = async (signal) => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      // IMPORTANT:
      // Backend route is /api/leads/stats
      const response = await fetch(
        `${API_BASE_URL}/api/leads/stats`,
        {
          method: "GET",

          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },

          signal,
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

      // =================================================
      // HTTP / API ERROR
      // =================================================

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ||
            "Failed to fetch lead statistics."
        );
      }

      // =================================================
      // DATA VALIDATION
      // =================================================

      if (!result?.data) {
        throw new Error(
          "Lead statistics data was not returned."
        );
      }

      setStats(result.data);
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      console.error(
        "Leads Stats Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load lead statistics."
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    const controller = new AbortController();

    fetchStats(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  // ===================================================
  // RETRY
  // ===================================================

  const handleRetry = () => {
    fetchStats();
  };

  // ===================================================
  // FORMAT NUMBER
  // ===================================================

  const formatNumber = (value = 0) => {
    return (Number(value) || 0).toLocaleString();
  };

  // ===================================================
  // FORMAT PERCENTAGE
  // ===================================================

  const formatPercentage = (value = 0) => {
    return `${Number(value || 0).toFixed(1)}%`;
  };

  // ===================================================
  // FORMAT CHANGE
  // ===================================================

  const formatChange = (value = 0) => {
    const change = Number(value) || 0;

    return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  // ===================================================
  // STATS CONFIG
  // ===================================================

  const statsConfig = stats
    ? [
        {
          title: "TOTAL LEADS",

          value: formatNumber(
            stats.totalLeads?.value
          ),

          change: formatChange(
            stats.totalLeads?.change
          ),

          changeText: "vs last month",

          positive:
            stats.totalLeads?.trend !== "down",
        },

        {
          title: "NEW LEADS",

          value: formatNumber(
            stats.newLeads?.value
          ),

          change: formatChange(
            stats.newLeads?.change
          ),

          changeText: "vs last month",

          positive:
            stats.newLeads?.trend !== "down",
        },

        {
          title: "QUALIFIED LEADS",

          value: formatNumber(
            stats.qualifiedLeads?.value
          ),

          change: formatChange(
            stats.qualifiedLeads?.change
          ),

          changeText: "vs last month",

          positive:
            stats.qualifiedLeads?.trend !== "down",
        },

        {
          title: "CONVERSION RATE",

          value: formatPercentage(
            stats.conversionRate?.value
          ),

          change: formatChange(
            stats.conversionRate?.change
          ),

          changeText: "vs last month",

          positive:
            stats.conversionRate?.trend !== "down",
        },
      ]
    : [];

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <section className="mt-[20px] grid w-full grid-cols-1 gap-[12px] sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="
              h-[101px]
              animate-pulse
              rounded-[8px]
              border
              border-[#DCE5EE]
              bg-white
              px-[14px]
              py-[13px]
            "
          >
            <div className="h-[9px] w-[80px] rounded bg-[#E9EFF5]" />

            <div className="mt-[10px] h-[26px] w-[75px] rounded bg-[#E9EFF5]" />

            <div className="mt-[7px] h-[10px] w-[125px] rounded bg-[#E9EFF5]" />
          </div>
        ))}
      </section>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error) {
    return (
      <section className="mt-[20px] w-full">
        <div
          className="
            flex
            min-h-[101px]
            items-center
            justify-center
            rounded-[8px]
            border
            border-[#DCE5EE]
            bg-white
          "
        >
          <div className="text-center">
            <p className="text-[10px] font-semibold text-[#EF4444]">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="
                mt-[8px]
                inline-flex
                h-[28px]
                items-center
                gap-[5px]
                rounded-[6px]
                border
                border-[#D7E2EC]
                bg-white
                px-[10px]
                text-[9px]
                font-semibold
                text-[#173B5C]
                transition
                hover:bg-[#F7F9FC]
              "
            >
              <RefreshCw
                size={11}
                strokeWidth={2}
              />

              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ===================================================
  // STATS
  // ===================================================

  return (
    <section className="mt-[20px] grid w-full grid-cols-1 gap-[12px] sm:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat) => (
        <div
          key={stat.title}
          className="
            h-[101px]
            rounded-[8px]
            border
            border-[#DCE5EE]
            bg-white
            px-[14px]
            py-[13px]
          "
        >
          {/* Title */}

          <p
            className="
              text-[9px]
              font-semibold
              leading-[12px]
              tracking-[0.4px]
              text-[#5D7184]
            "
          >
            {stat.title}
          </p>

          {/* Value */}

          <h2
            className="
              mt-[8px]
              text-[24px]
              font-bold
              leading-[27px]
              tracking-[-0.5px]
              text-[#102F4A]
            "
          >
            {stat.value}
          </h2>

          {/* Change */}

          <div className="mt-[5px] flex items-center gap-[4px]">
            {stat.positive ? (
              <TrendingUp
                size={11}
                strokeWidth={2}
                className="text-[#16A05D]"
              />
            ) : (
              <TrendingDown
                size={11}
                strokeWidth={2}
                className="text-[#FF3B3B]"
              />
            )}

            <span
              className={`
                text-[10px]
                font-semibold
                leading-[14px]
                ${
                  stat.positive
                    ? "text-[#16A05D]"
                    : "text-[#FF3B3B]"
                }
              `}
            >
              {stat.change}
            </span>

            <span
              className="
                text-[9px]
                font-medium
                leading-[14px]
                text-[#8292A0]
              "
            >
              {stat.changeText}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default LeadsStats;