import { useCallback, useEffect, useState } from "react";

import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
} from "lucide-react";

import Card from "../common/Card";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const CustomerHealthIntelligence = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Fetch Customer Health Intelligence
  |--------------------------------------------------------------------------
  */

  const fetchHealthInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem(
        "businessflow_token"
      );

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/customers/health`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to load customer health intelligence."
        );
      }

      setInsights(
        Array.isArray(result?.data)
          ? result.data
          : []
      );
    } catch (err) {
      console.error(
        "Customer Health Intelligence Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load customer health intelligence."
      );

      setInsights([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchHealthInsights();
  }, [fetchHealthInsights]);

  /*
  |--------------------------------------------------------------------------
  | Get Insight Type
  |--------------------------------------------------------------------------
  */

  const getInsightConfig = (healthStatus) => {
    if (healthStatus === "At Risk") {
      return {
        title: "High Attrition Risk",
        icon: AlertTriangle,
        iconColor: "text-[#EF4444]",
        titleColor: "text-[#EF4444]",
      };
    }

    if (
      healthStatus === "Expansion Opportunity"
    ) {
      return {
        title: "Expansion Opportunity",
        icon: Lightbulb,
        iconColor: "text-[#20A45A]",
        titleColor: "text-[#20A45A]",
      };
    }

    return {
      title: healthStatus || "Customer Insight",
      icon: Lightbulb,
      iconColor: "text-[#52708B]",
      titleColor: "text-[#52708B]",
    };
  };

  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <Card
        className="
          w-full
          overflow-hidden
          rounded-[9px]
          border-[#DCE5ED]
          bg-[#F8FAFF]
        "
      >
        {/* Header */}

        <div
          className="
            flex
            min-h-[69px]
            items-center
            gap-[9px]
            border-b
            border-[#DDE5EC]
            px-[13px]
          "
        >
          <div className="h-[27px] w-[27px] animate-pulse rounded-full bg-[#E8F0F8]" />

          <div>
            <div className="h-[8px] w-[85px] animate-pulse rounded bg-[#E5ECF3]" />
            <div className="mt-[4px] h-[8px] w-[70px] animate-pulse rounded bg-[#E5ECF3]" />
          </div>
        </div>

        {/* Skeleton */}

        <div className="space-y-[10px] px-[9px] py-[13px]">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="
                rounded-[6px]
                border
                border-[#DCE5ED]
                bg-white
                px-[10px]
                py-[10px]
              "
            >
              <div className="h-[8px] w-[100px] animate-pulse rounded bg-[#EDF2F7]" />

              <div className="mt-[8px] space-y-[4px]">
                <div className="h-[6px] w-full animate-pulse rounded bg-[#F1F5F9]" />
                <div className="h-[6px] w-[85%] animate-pulse rounded bg-[#F1F5F9]" />
              </div>

              <div className="mt-[8px] h-[24px] w-full animate-pulse rounded bg-[#F1F5F9]" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error State
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <Card
        className="
          w-full
          overflow-hidden
          rounded-[9px]
          border-[#DCE5ED]
          bg-[#F8FAFF]
        "
      >
        <div
          className="
            flex
            min-h-[69px]
            items-center
            gap-[9px]
            border-b
            border-[#DDE5EC]
            px-[13px]
          "
        >
          <div
            className="
              flex
              h-[27px]
              w-[27px]
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[#D9E5F2]
              bg-[#EEF4FC]
              text-[#0B3D6B]
            "
          >
            <Sparkles
              size={13}
              strokeWidth={2}
            />
          </div>

          <h2
            className="
              max-w-[125px]
              text-[12px]
              font-bold
              leading-[16px]
              text-[#102F4A]
            "
          >
            Customer Health
            <br />
            Intelligence
          </h2>
        </div>

        <div className="flex min-h-[130px] items-center justify-center px-[12px]">
          <div className="text-center">
            <p className="text-[9px] font-semibold text-[#C24141]">
              Unable to load insights
            </p>

            <p className="mt-1 text-[7px] text-[#8A9AA8]">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchHealthInsights}
              className="
                mt-3
                rounded-[5px]
                bg-[#0B3D6B]
                px-3
                py-1.5
                text-[7px]
                font-semibold
                text-white
              "
            >
              Try Again
            </button>
          </div>
        </div>
      </Card>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main UI
  |--------------------------------------------------------------------------
  */

  return (
    <Card
      className="
        w-full
        overflow-hidden
        rounded-[9px]
        border-[#DCE5ED]
        bg-[#F8FAFF]
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          min-h-[69px]
          items-center
          gap-[9px]
          border-b
          border-[#DDE5EC]
          px-[13px]
        "
      >
        {/* AI Icon */}

        <div
          className="
            flex
            h-[27px]
            w-[27px]
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-[#D9E5F2]
            bg-[#EEF4FC]
            text-[#0B3D6B]
          "
        >
          <Sparkles
            size={13}
            strokeWidth={2}
          />
        </div>

        <h2
          className="
            max-w-[125px]
            text-[12px]
            font-bold
            leading-[16px]
            text-[#102F4A]
          "
        >
          Customer Health
          <br />
          Intelligence
        </h2>
      </div>

      {/* =====================================================
          INSIGHTS
      ====================================================== */}

      <div className="space-y-[10px] px-[9px] py-[13px]">
        {insights.length === 0 ? (
          <>
            <div
              className="
                rounded-[6px]
                border
                border-[#DCE5ED]
                bg-white
                px-[10px]
                py-[14px]
                text-center
              "
            >
              <p className="text-[9px] font-semibold text-[#526A80]">
                No health insights available
              </p>

              <p className="mt-[4px] text-[7px] leading-[10px] text-[#91A0AE]">
                Customer health insights will appear
                here when available.
              </p>
            </div>
          </>
        ) : (
          insights.slice(0, 2).map((insight) => {
            const config = getInsightConfig(
              insight.healthStatus
            );

            const Icon = config.icon;

            const isExpansion =
              insight.healthStatus ===
              "Expansion Opportunity";

            return (
              <div
                key={insight.id}
                className="
                  rounded-[6px]
                  border
                  border-[#DCE5ED]
                  bg-white
                  px-[10px]
                  py-[10px]
                  shadow-[0_1px_2px_rgba(16,47,74,0.02)]
                "
              >
                {/* Insight heading */}

                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`flex ${
                      isExpansion
                        ? "items-start"
                        : "items-center"
                    } gap-[5px]`}
                  >
                    <Icon
                      size={11}
                      strokeWidth={2}
                      className={`${
                        config.iconColor
                      } ${
                        isExpansion
                          ? "mt-[1px]"
                          : ""
                      }`}
                    />

                    <span
                      className={`
                        max-w-[90px]
                        text-[9px]
                        font-semibold
                        leading-[12px]
                        ${config.titleColor}
                      `}
                    >
                      {config.title}
                    </span>
                  </div>

                  <span
                    className="
                      max-w-[65px]
                      text-right
                      text-[7px]
                      font-medium
                      leading-[9px]
                      text-[#718599]
                    "
                  >
                    {insight.companyName ||
                      insight.customerName ||
                      "Customer"}
                  </span>
                </div>

                {/* Description */}

                <p
                  className="
                    mt-[7px]
                    text-[8px]
                    font-medium
                    leading-[12px]
                    text-[#718599]
                  "
                >
                  {insight.message ||
                    "No additional health information available."}
                </p>

                {/* Action */}

                {isExpansion ? null : (
                  <button
                    type="button"
                    className="
                      mt-[8px]
                      flex
                      h-[24px]
                      w-full
                      items-center
                      justify-center
                      rounded-[5px]
                      border
                      border-[#D8E2EA]
                      bg-white
                      text-[7px]
                      font-semibold
                      text-[#173B5C]
                      transition-all
                      duration-200
                      hover:border-[#C5D3DF]
                      hover:bg-[#F7F9FC]
                    "
                  >
                    Schedule Review Call
                  </button>
                )}
              </div>
            );
          })
        )}

        {/* =================================================
            VIEW ALL INSIGHTS
        ================================================== */}

        {insights.length > 2 && (
          <button
            type="button"
            className="
              flex
              h-[25px]
              w-full
              items-center
              justify-center
              gap-[5px]
              rounded-[5px]
              border
              border-[#D8E2EA]
              bg-white
              text-[7px]
              font-semibold
              text-[#173B5C]
              shadow-[0_1px_2px_rgba(16,47,74,0.02)]
              transition-all
              duration-200
              hover:border-[#C5D3DF]
              hover:bg-[#F7F9FC]
            "
          >
            <ArrowUpRight
              size={10}
              strokeWidth={2}
            />

            View All Insights
          </button>
        )}
      </div>
    </Card>
  );
};

export default CustomerHealthIntelligence;