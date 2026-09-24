import { useEffect, useState } from "react";

import {
  BadgeDollarSign,
  BriefcaseBusiness,
  Trophy,
  CircleDollarSign,
  Loader2,
  AlertCircle,
} from "lucide-react";

import Card from "../common/Card";
import api from "../../services/api";

const DealsStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH DEAL STATS
  // =====================================================

  const fetchDealStats = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await api("/admin/deals/stats");

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "Unable to fetch deal statistics."
        );
      }

      setStats(result?.data || null);
    } catch (error) {
      console.error(
        "Deal Stats Error:",
        error
      );

      setError(
        error?.message ||
          "Unable to fetch deal statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealStats();
  }, []);

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (value) => {
    const amount = Number(value || 0);

    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }

    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`;
    }

    return `$${amount.toLocaleString()}`;
  };

  // =====================================================
  // FORMAT PERCENTAGE
  // =====================================================

  const formatPercentage = (value) => {
    const number = Number(value || 0);

    return Number.isInteger(number)
      ? `${number}%`
      : `${number.toFixed(1)}%`;
  };

  // =====================================================
  // FORMAT CHANGE
  // =====================================================

  const formatChange = (value) => {
    const number = Number(value || 0);

    if (number === 0) {
      return "No change";
    }

    const formatted = Number.isInteger(
      number
    )
      ? number
      : number.toFixed(1);

    return `${
      number > 0 ? "+" : ""
    }${formatted}% vs last quarter`;
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="w-full">
        <div className="grid w-full grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
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
              <div className="flex h-full items-center justify-center">
                <Loader2
                  size={17}
                  className="animate-spin text-[#527895]"
                />
              </div>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <section className="w-full">
        <div
          className="
            flex
            min-h-[80px]
            items-center
            gap-2
            rounded-[9px]
            border
            border-[#FECACA]
            bg-[#FEF2F2]
            px-4
            text-[#B42318]
          "
        >
          <AlertCircle size={15} />

          <p className="text-[11px] font-medium">
            {error}
          </p>
        </div>
      </section>
    );
  }

  if (!stats) {
    return null;
  }

  // =====================================================
  // BACKEND DATA → FRONTEND STATS
  // =====================================================

  const statsCards = [
    {
      title: "PIPELINE VALUE",

      value: formatCurrency(
        stats.pipelineValue?.value
      ),

      change: formatChange(
        stats.pipelineValue?.change
      ),

      trend:
        stats.pipelineValue?.trend ||
        "neutral",

      icon: BadgeDollarSign,

      iconClass:
        "text-[#DDEEF5]",
    },

    {
      title: "ACTIVE DEALS",

      value:
        stats.activeDeals?.value ?? 0,

      change: formatChange(
        stats.activeDeals?.change
      ),

      trend:
        stats.activeDeals?.trend ||
        "neutral",

      icon: BriefcaseBusiness,

      iconClass:
        "text-[#DDEEF5]",
    },

    {
      title: "WIN RATE",

      value: formatPercentage(
        stats.winRate?.value
      ),

      change: formatChange(
        stats.winRate?.change
      ),

      trend:
        stats.winRate?.trend ||
        "neutral",

      icon: Trophy,

      iconClass:
        "text-[#DDF2E7]",
    },

    {
      title: "AVG. DEAL SIZE",

      value: formatCurrency(
        stats.avgDealSize?.value
      ),

      change: formatChange(
        stats.avgDealSize?.change
      ),

      trend:
        stats.avgDealSize?.trend ||
        "neutral",

      icon: CircleDollarSign,

      iconClass:
        "text-[#F7E6D2]",
    },
  ];

  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="w-full">
      <div className="grid w-full grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;

          const isPositive =
            stat.trend === "up";

          const isNegative =
            stat.trend === "down";

          const isNeutral =
            stat.trend === "neutral";

          return (
            <Card
              key={stat.title}
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
              {/* =================================================
                  CONTENT
              ================================================== */}

              <div className="relative z-10">
                {/* Label */}

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

                {/* Value */}

                <p
                  className="
                    mt-[5px]
                    text-[23px]
                    font-bold
                    leading-[27px]
                    tracking-[-0.3px]
                    text-[#071D35]
                  "
                >
                  {stat.value}
                </p>

                {/* Change */}

                <div className="mt-[4px]">
                  {isPositive && (
                    <span
                      className="
                        inline-flex
                        items-center
                        rounded-[4px]
                        bg-[#E7F7EE]
                        px-[6px]
                        py-[3px]
                        text-[8px]
                        font-semibold
                        text-[#16A05D]
                      "
                    >
                      ↗ {stat.change}
                    </span>
                  )}

                  {isNegative && (
                    <span
                      className="
                        inline-flex
                        items-center
                        rounded-[4px]
                        bg-[#FDECEC]
                        px-[6px]
                        py-[3px]
                        text-[8px]
                        font-semibold
                        text-[#DC4B4B]
                      "
                    >
                      ↘ {stat.change}
                    </span>
                  )}

                  {isNeutral && (
                    <span
                      className="
                        inline-flex
                        items-center
                        rounded-[4px]
                        bg-[#F0F3F6]
                        px-[6px]
                        py-[3px]
                        text-[8px]
                        font-medium
                        text-[#6F8294]
                      "
                    >
                      → {stat.change}
                    </span>
                  )}
                </div>
              </div>

              {/* =================================================
                  ICON
              ================================================== */}

              <div
                className={`
                  absolute
                  right-3
                  top-3
                  ${stat.iconClass}
                `}
              >
                <Icon
                  size={24}
                  strokeWidth={1.6}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default DealsStats;