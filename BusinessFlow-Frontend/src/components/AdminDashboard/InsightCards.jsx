import { useCallback, useEffect, useState } from "react";

import {
  CircleAlert,
  CircleCheck,
  Info,
} from "lucide-react";

import Card from "../common/Card";

// =====================================================
// API
// =====================================================

const API_URL = "http://localhost:5000/api";

// =====================================================
// ICON MAP
// =====================================================

const iconMap = {
  info: Info,
  warning: CircleAlert,
  success: CircleCheck,
};

// =====================================================
// STYLES
// =====================================================

const styles = {
  info: {
    border: "border-t-[#8BC9F4]",
    iconBg: "bg-[#EAF6FF]",
    iconBorder: "border-[#B9E1FA]",
    iconColor: "text-[#1592D0]",
    actionColor: "text-[#1592D0]",
  },

  warning: {
    border: "border-t-[#E9C17D]",
    iconBg: "bg-[#FFF8EC]",
    iconBorder: "border-[#F2D8AC]",
    iconColor: "text-[#D99022]",
    actionColor: "text-[#D99022]",
  },

  success: {
    border: "border-t-[#81D4AE]",
    iconBg: "bg-[#EFFBF5]",
    iconBorder: "border-[#BCE8D2]",
    iconColor: "text-[#22A866]",
    actionColor: "text-[#22A866]",
  },
};

// =====================================================
// COMPONENT
// =====================================================

const InsightCards = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH INSIGHTS
  // =====================================================

  const fetchInsights = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem(
            "businessflow_token"
          );

        if (!token) {
          throw new Error(
            "Authentication token is missing. Please login again."
          );
        }

        const response = await fetch(
          `${API_URL}/admin/dashboard/insights`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

        const result =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to fetch dashboard insights."
          );
        }

        setInsights(
          Array.isArray(
            result.data?.insights
          )
            ? result.data.insights
            : []
        );
      } catch (err) {
        console.error(
          "Insight Cards Error:",
          err
        );

        setError(
          err.message ||
            "Unable to load dashboard insights."
        );

        setInsights([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Card
            key={item}
            className="
              h-[210px]
              animate-pulse
              overflow-hidden
              rounded-[10px]
              border-t-[3px]
              border-t-[#DCEAF5]
              bg-[#FAFCFF]
              px-[22px]
              py-[20px]
            "
          >
            {/* Header Skeleton */}
            <div className="flex items-center gap-3">
              <div className="h-[36px] w-[36px] rounded-full bg-[#EAF1F6]" />

              <div className="h-[15px] w-[130px] rounded bg-[#EAF1F6]" />
            </div>

            {/* Description Skeleton */}
            <div className="mt-[16px] space-y-2">
              <div className="h-[10px] w-full rounded bg-[#EAF1F6]" />
              <div className="h-[10px] w-[90%] rounded bg-[#EAF1F6]" />
              <div className="h-[10px] w-[75%] rounded bg-[#EAF1F6]" />
            </div>

            {/* Button Skeleton */}
            <div className="mt-[18px] h-[12px] w-[100px] rounded bg-[#EAF1F6]" />
          </Card>
        ))}
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
            rounded-[10px]
            border-t-[3px]
            border-t-[#E9C17D]
            bg-[#FAFCFF]
            px-[22px]
            py-[20px]
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-[36px]
                w-[36px]
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-[#F2D8AC]
                bg-[#FFF8EC]
                text-[#D99022]
              "
            >
              <CircleAlert
                size={17}
                strokeWidth={2}
              />
            </div>

            <h3
              className="
                text-[15px]
                font-semibold
                text-[#173750]
              "
            >
              Unable to load insights
            </h3>
          </div>

          <p
            className="
              mt-[13px]
              text-[12px]
              font-medium
              leading-[19px]
              text-[#63788B]
            "
          >
            {error}
          </p>

          <button
            type="button"
            onClick={fetchInsights}
            className="
              mt-[16px]
              text-[11px]
              font-bold
              text-[#1592D0]
              transition-opacity
              hover:opacity-70
            "
          >
            Try again →
          </button>
        </Card>
      </section>
    );
  }

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (insights.length === 0) {
    return (
      <section className="w-full">
        <Card
          className="
            rounded-[10px]
            border-t-[3px]
            border-t-[#8BC9F4]
            bg-[#FAFCFF]
            px-[22px]
            py-[20px]
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-[36px]
                w-[36px]
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-[#B9E1FA]
                bg-[#EAF6FF]
                text-[#1592D0]
              "
            >
              <Info
                size={17}
                strokeWidth={2}
              />
            </div>

            <h3
              className="
                text-[15px]
                font-semibold
                text-[#173750]
              "
            >
              No insights available
            </h3>
          </div>

          <p
            className="
              mt-[13px]
              text-[12px]
              font-medium
              leading-[19px]
              text-[#63788B]
            "
          >
            There are no dashboard insights
            available right now.
          </p>
        </Card>
      </section>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {insights.map((item, index) => {
        const type =
          styles[item.type]
            ? item.type
            : "info";

        const Icon =
          iconMap[type] || Info;

        const style =
          styles[type];

        return (
          <Card
            key={
              item.id ||
              `${item.title}-${index}`
            }
            className={`
              h-[210px]
              overflow-hidden
              rounded-[10px]
              border-t-[3px]
              ${style.border}
              bg-[#FAFCFF]
              px-[22px]
              py-[20px]
            `}
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <div
                className={`
                  flex
                  h-[36px]
                  w-[36px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  ${style.iconBg}
                  ${style.iconBorder}
                  ${style.iconColor}
                `}
              >
                <Icon
                  size={17}
                  strokeWidth={2}
                />
              </div>

              <h3
                className="
                  text-[15px]
                  font-semibold
                  tracking-[-0.1px]
                  text-[#173750]
                "
              >
                {item.title}
              </h3>
            </div>

            {/* Description */}
            <p
              className="
                mt-[13px]
                max-w-[290px]
                text-[12px]
                font-medium
                leading-[19px]
                text-[#63788B]
              "
            >
              {item.description}
            </p>

            {/* Action */}
            <button
              type="button"
              onClick={() => {
                console.log(
                  "Insight action:",
                  item.action,
                  item
                );
              }}
              className={`
                mt-[16px]
                text-[11px]
                font-bold
                transition-opacity
                hover:opacity-70
                ${style.actionColor}
              `}
            >
              {item.action} →
            </button>
          </Card>
        );
      })}
    </section>
  );
};

export default InsightCards;