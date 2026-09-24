import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

const AIAnalyticsInsights = () => {
  const [insights, setInsights] = useState([]);
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
  // FETCH AI ANALYTICS
  // =====================================================

  useEffect(() => {
    const fetchAIAnalysis = async () => {
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
          `${API_URL}/reports/ai-analysis?period=30`,
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
              "Unable to load AI analytics insights."
          );
        }

        const insightData = result?.data?.insights || [];

        if (!Array.isArray(insightData)) {
          throw new Error(
            "Invalid AI analytics data received from server."
          );
        }

        setInsights(insightData);
      } catch (error) {
        console.error(
          "AI Analytics Insights Error:",
          error
        );

        setError(
          error?.message ||
            "Unable to load AI analytics insights."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAIAnalysis();
  }, []);

  // =====================================================
  // ICONS
  // =====================================================

  const icons = {
    trend: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M4 15L9 10L13 14L20 7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M15 7H20V12"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),

    risk: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 4L21 19H3L12 4Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />

        <path
          d="M12 9V13"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />

        <circle
          cx="12"
          cy="16"
          r="1"
          fill="currentColor"
        />
      </svg>
    ),

    opportunity: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M9 18H15"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />

        <path
          d="M10 21H14"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />

        <path
          d="M8 14.5C6.8 13.5 6 12 6 10.3C6 7.2 8.7 5 12 5C15.3 5 18 7.2 18 10.3C18 12 17.2 13.5 16 14.5C15.2 15.2 15 16 15 17H9C9 16 8.8 15.2 8 14.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    ),

    performance: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="8"
          stroke="currentColor"
          strokeWidth="1.7"
        />

        <path
          d="M8 12L10.5 14.5L16 9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),

    action: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="8"
          stroke="currentColor"
          strokeWidth="1.7"
        />

        <path
          d="M8 12L10.5 14.5L16 9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  // =====================================================
  // ICON STYLES
  // =====================================================

  const iconStyles = {
    trend: "bg-[#E5F7EC] text-[#16A05D]",
    risk: "bg-[#FFF1DE] text-[#F28A00]",
    opportunity: "bg-[#E4F4FF] text-[#168BD0]",
    performance: "bg-[#E8EDF2] text-[#24384B]",
    action: "bg-[#E8EDF2] text-[#24384B]",
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <section className="w-full rounded-[9px] border border-[#CFE2FA] bg-[#EEF5FF] p-4">

        {/* Header */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[16px] leading-none text-[#008FD5]">
            ✦
          </span>

          <h2 className="text-[16px] font-bold leading-[20px] text-[#102A43]">
            AI Analytics Insights
          </h2>
        </div>

        {/* Skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex min-h-[80px] items-start gap-3 rounded-[6px] border border-[#D9E4EF] bg-white px-3.5 py-3"
            >
              <div className="h-[25px] w-[25px] shrink-0 animate-pulse rounded-full bg-[#E8EEF4]" />

              <div className="min-w-0 flex-1">
                <div className="h-2.5 w-40 animate-pulse rounded bg-[#E8EEF4]" />

                <div className="mt-2 h-2 w-full animate-pulse rounded bg-[#EEF2F5]" />

                <div className="mt-1 h-2 w-4/5 animate-pulse rounded bg-[#EEF2F5]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {
    return (
      <section className="w-full rounded-[9px] border border-[#CFE2FA] bg-[#EEF5FF] p-4">

        <div className="mb-3 flex items-center gap-2">
          <span className="text-[16px] leading-none text-[#008FD5]">
            ✦
          </span>

          <h2 className="text-[16px] font-bold leading-[20px] text-[#102A43]">
            AI Analytics Insights
          </h2>
        </div>

        <div className="flex min-h-[80px] items-center justify-center rounded-[6px] border border-[#D9E4EF] bg-white">
          <div className="text-center">
            <p className="text-[10px] font-semibold text-[#B42318]">
              Unable to load AI insights
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
    <section className="w-full rounded-[9px] border border-[#CFE2FA] bg-[#EEF5FF] p-4">

      {/* Section Header */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[16px] leading-none text-[#008FD5]">
          ✦
        </span>

        <h2 className="text-[16px] font-bold leading-[20px] text-[#102A43]">
          AI Analytics Insights
        </h2>
      </div>

      {/* No Insights */}
      {insights.length === 0 ? (
        <div className="flex min-h-[80px] items-center justify-center rounded-[6px] border border-[#D9E4EF] bg-white">
          <p className="text-[9px] text-[#71869A]">
            No analytics insights available for this period.
          </p>
        </div>
      ) : (
        /* Insight Cards */
        <div className="grid grid-cols-2 gap-3">
          {insights.map((insight, index) => {
            const type = insight.type || "action";

            return (
              <div
                key={`${insight.title}-${index}`}
                className="flex min-h-[80px] items-start gap-3 rounded-[6px] border border-[#D9E4EF] bg-white px-3.5 py-3"
              >
                {/* Icon */}
                <div
                  className={`mt-0.5 flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-full ${
                    iconStyles[type] ||
                    iconStyles.action
                  }`}
                >
                  {icons[type] || icons.action}
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <h3 className="text-[9px] font-bold leading-[13px] text-[#102A43]">
                    {insight.title || "Analytics Insight"}
                  </h3>

                  <p className="mt-1 text-[8.5px] leading-[13px] text-[#60768A]">
                    {insight.description ||
                      "No description available."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AIAnalyticsInsights;