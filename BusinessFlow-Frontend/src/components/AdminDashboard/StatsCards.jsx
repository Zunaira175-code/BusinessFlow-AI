import { useCallback, useEffect, useState } from "react";

import {
  WalletCards,
  UserRoundPlus,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import Card from "../common/Card";
import IconButton from "../common/IconButton";
import Button from "../common/button";

// =====================================================
// API CONFIG
// =====================================================

const API_URL = "http://localhost:5000/api";

// =====================================================
// STATS CARDS
// =====================================================

const StatsCards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH DASHBOARD STATS
  // =====================================================

  const fetchStats = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError("");

      // -------------------------------------------------
      // GET AUTH TOKEN
      // -------------------------------------------------

      const token = localStorage.getItem(
        "businessflow_token"
      );

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      // -------------------------------------------------
      // API REQUEST
      // -------------------------------------------------

      const response = await fetch(
        `${API_URL}/admin/dashboard/stats`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal,
        }
      );

      // -------------------------------------------------
      // SAFE RESPONSE PARSING
      // -------------------------------------------------

      const contentType =
        response.headers.get("content-type") || "";

      let result = null;

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        result = await response.json();
      } else {
        const text = await response.text();

        throw new Error(
          text ||
            `Server returned an invalid response (${response.status}).`
        );
      }

      // -------------------------------------------------
      // HTTP ERROR
      // -------------------------------------------------

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Failed to fetch dashboard statistics (${response.status}).`
        );
      }

      // -------------------------------------------------
      // BACKEND SUCCESS VALIDATION
      // -------------------------------------------------

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "Unable to load dashboard statistics."
        );
      }

      if (!result?.data) {
        throw new Error(
          "Dashboard statistics data was not returned by the server."
        );
      }

      // -------------------------------------------------
      // SAVE STATS
      // -------------------------------------------------

      setStats(result.data);
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }

      console.error(
        "Stats Cards Error:",
        error
      );

      setError(
        error?.message ||
          "Unable to load dashboard statistics."
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const controller =
      new AbortController();

    fetchStats(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchStats]);

  // =====================================================
  // RETRY
  // =====================================================

  const handleRetry = () => {
    const controller =
      new AbortController();

    fetchStats(controller.signal);
  };

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (value = 0) => {
    const amount = Number(value) || 0;

    if (amount >= 1_000_000) {
      return `$${(
        amount / 1_000_000
      ).toFixed(1)}M`;
    }

    if (amount >= 1_000) {
      return `$${(
        amount / 1_000
      ).toFixed(1)}K`;
    }

    return `$${amount.toLocaleString()}`;
  };

  // =====================================================
  // FORMAT NUMBER
  // =====================================================

  const formatNumber = (value = 0) => {
    return (
      Number(value) || 0
    ).toLocaleString();
  };

  // =====================================================
  // FORMAT PERCENTAGE CHANGE
  // =====================================================

  const formatChange = (value = 0) => {
    const change = Number(value) || 0;

    return `${change >= 0 ? "+" : ""}${change}%`;
  };

  // =====================================================
  // GET TREND
  // =====================================================

  const getTrend = (trend) => {
    if (trend === "down") {
      return "down";
    }

    if (trend === "neutral") {
      return "neutral";
    }

    return "up";
  };

  // =====================================================
  // STATS CONFIG
  // =====================================================

  const statsConfig = stats
    ? [
        {
          id: "totalRevenue",
          title: "TOTAL REVENUE",

          value: formatCurrency(
            stats.totalRevenue?.value
          ),

          change: formatChange(
            stats.totalRevenue?.change
          ),

          description:
            "vs last month",

          trend: getTrend(
            stats.totalRevenue?.trend
          ),

          icon: WalletCards,
        },

        {
          id: "newLeads",
          title: "NEW LEADS",

          value: formatNumber(
            stats.newLeads?.value
          ),

          change: formatChange(
            stats.newLeads?.change
          ),

          description:
            "vs last month",

          trend: getTrend(
            stats.newLeads?.trend
          ),

          icon: UserRoundPlus,
        },

        {
          id: "activeDeals",
          title: "ACTIVE DEALS",

          value: formatNumber(
            stats.activeDeals?.value
          ),

          change: formatChange(
            stats.activeDeals?.change
          ),

          description:
            "vs last month",

          trend: getTrend(
            stats.activeDeals?.trend
          ),

          icon: BriefcaseBusiness,
        },

        {
          id: "conversionRate",
          title: "CONVERSION RATE",

          value: `${Number(
            stats.conversionRate?.value || 0
          ).toFixed(1)}%`,

          change: formatChange(
            stats.conversionRate?.change
          ),

          description:
            "vs last month",

          trend: getTrend(
            stats.conversionRate?.trend
          ),

          icon: ChartNoAxesCombined,
        },
      ]
    : [];

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <section className="w-full">
        <div className="grid w-full grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(
            (item) => (
              <Card
                key={item}
                className="
                  relative
                  h-[103px]
                  overflow-hidden
                  rounded-[9px]
                  border
                  border-[#DCE5EF]
                  bg-white
                  px-4
                  py-3
                "
              >
                <div className="animate-pulse">
                  {/* Title */}

                  <div className="h-[8px] w-[85px] rounded bg-[#E8EEF5]" />

                  {/* Value */}

                  <div className="mt-[9px] h-[25px] w-[75px] rounded bg-[#E8EEF5]" />

                  {/* Trend */}

                  <div className="mt-[9px] h-[8px] w-[115px] rounded bg-[#EEF2F6]" />

                  {/* Icon */}

                  <div className="absolute right-3 top-3 h-[24px] w-[24px] rounded-[4px] bg-[#EEF4FB]" />
                </div>
              </Card>
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
      <section className="w-full">
        <Card
          className="
            flex
            min-h-[103px]
            w-full
            items-center
            justify-center
            rounded-[9px]
            border
            border-[#F4D4D4]
            bg-white
            px-4
          "
        >
          <div className="flex flex-col items-center text-center">
            <div
              className="
                mb-2
                flex
                h-[28px]
                w-[28px]
                items-center
                justify-center
                rounded-full
                bg-[#FEF2F2]
                text-[#DC2626]
              "
            >
              <AlertCircle
                size={14}
                strokeWidth={2}
              />
            </div>

            <p
              className="
                max-w-[500px]
                text-[9px]
                font-semibold
                leading-4
                text-[#B42318]
              "
            >
              {error}
            </p>

            <Button
              type="button"
              variant="secondary"
              icon={RefreshCw}
              onClick={handleRetry}
              className="
                mt-2
                h-[28px]
                rounded-[6px]
                px-3
                text-[8px]
              "
            >
              Retry
            </Button>
          </div>
        </Card>
      </section>
    );
  }

  // =====================================================
  // STATS UI
  // =====================================================

  return (
    <section className="w-full">
      <div className="grid w-full grid-cols-4 gap-4">
        {statsConfig.map((stat) => {
          const Icon = stat.icon;

          const isPositive =
            stat.trend === "up";

          const isNegative =
            stat.trend === "down";

          const isNeutral =
            stat.trend === "neutral";

          return (
            <Card
              key={stat.id}
              className="
                relative
                h-[103px]
                overflow-hidden
                rounded-[9px]
                border
                border-[#DCE5EF]
                bg-white
                px-4
                py-3
                transition-all
                duration-200
                hover:border-[#CBD9E8]
                hover:shadow-[0_6px_18px_rgba(15,45,75,0.05)]
              "
            >
              {/* =================================================
                  LABEL
              ================================================== */}

              <p
                className="
                  pr-[35px]
                  text-[8px]
                  font-semibold
                  uppercase
                  leading-[14px]
                  tracking-[0.05em]
                  text-[#71869A]
                "
              >
                {stat.title}
              </p>

              {/* =================================================
                  VALUE
              ================================================== */}

              <p
                className="
                  mt-[5px]
                  text-[23px]
                  font-bold
                  leading-[27px]
                  tracking-[-0.4px]
                  text-[#071D35]
                "
              >
                {stat.value}
              </p>

              {/* =================================================
                  TREND
              ================================================== */}

              <div className="mt-[4px] flex items-center gap-1">
                {isPositive && (
                  <TrendingUp
                    size={10}
                    strokeWidth={2.2}
                    className="text-[#16A05D]"
                  />
                )}

                {isNegative && (
                  <TrendingDown
                    size={10}
                    strokeWidth={2.2}
                    className="text-[#DC4B4B]"
                  />
                )}

                {isNeutral && (
                  <span className="text-[10px] font-semibold text-[#8A99A8]">
                    →
                  </span>
                )}

                <span
                  className={`
                    text-[8px]
                    font-semibold
                    leading-[14px]
                    ${
                      isPositive
                        ? "text-[#16A05D]"
                        : isNegative
                          ? "text-[#DC4B4B]"
                          : "text-[#8A99A8]"
                    }
                  `}
                >
                  {stat.change}
                </span>

                <span
                  className="
                    text-[8px]
                    font-medium
                    leading-[14px]
                    text-[#6F8294]
                  "
                >
                  {stat.description}
                </span>
              </div>

              {/* =================================================
                  ICON
              ================================================== */}

              <div className="absolute right-3 top-3">
                <IconButton
                  icon={Icon}
                  label={stat.title}
                  variant="light"
                  size={14}
                  className="
                    h-[24px]
                    w-[24px]
                    rounded-[4px]
                    bg-[#EEF4FB]
                    text-[#173F66]
                    transition-colors
                    hover:bg-[#E5EEF8]
                  "
                />
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default StatsCards;