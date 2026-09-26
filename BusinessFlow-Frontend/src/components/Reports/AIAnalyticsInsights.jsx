import { useEffect, useState } from "react";
import { getReportAIInsights } from "../../services/aiService";

const AIAnalyticsInsights = () => {
  const [insights, setInsights] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadAIInsights = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getReportAIInsights();

        if (!mounted) return;

        const aiData = result?.data || {};

        setSummary(aiData?.summary || "");
        setInsights(
          Array.isArray(aiData?.insights)
            ? aiData.insights
            : []
        );
      } catch (err) {
        console.error("Reports AI Insights Error:", err);

        if (!mounted) return;

        setError(
          err?.message || "Unable to load AI report insights."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAIInsights();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-blue-100" />

          <div>
            <div className="h-3.5 w-36 animate-pulse rounded bg-slate-200" />
            <div className="mt-1.5 h-2.5 w-52 animate-pulse rounded bg-slate-100" />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="h-14 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-14 animate-pulse rounded-lg bg-slate-100" />
        </div>
      </section>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <section className="w-full rounded-xl border border-red-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-sm font-semibold text-red-600">
            !
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              AI Analytics
            </h3>

            <p className="mt-0.5 text-xs text-red-600">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // EMPTY
  // =====================================================

  if (!insights.length) {
    return (
      <section className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm text-blue-600">
            ✦
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              AI Analytics Insights
            </h3>

            <p className="mt-0.5 text-xs text-slate-500">
              {summary ||
                "No significant AI insights were identified."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // INSIGHTS
  // =====================================================

  return (
    <section className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

      {/* HEADER */}

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm text-blue-600">
            ✦
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              AI Analytics Insights
            </h3>

            <p className="text-[11px] text-slate-500">
              AI-powered CRM analysis
            </p>
          </div>
        </div>

        <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-600">
          Gemini AI
        </span>
      </div>

      {/* SUMMARY */}

      {summary && (
        <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
          <p className="text-xs leading-5 text-slate-700">
            {summary}
          </p>
        </div>
      )}

      {/* INSIGHTS */}

      <div className="mt-3 space-y-2">
        {insights.map((insight, index) => {
          const type = insight?.type || "performance";

          const title = insight?.title || "AI Insight";

          const description =
            insight?.summary ||
            insight?.description ||
            "No description available.";

          const priority = insight?.priority || "medium";

          return (
            <div
              key={`${title}-${index}`}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"
            >
              {/* TYPE + PRIORITY */}

              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium capitalize text-slate-600">
                  {type}
                </span>

                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium capitalize text-slate-500">
                  {priority}
                </span>
              </div>

              {/* TITLE */}

              <h4 className="mt-1.5 text-xs font-semibold text-slate-900">
                {title}
              </h4>

              {/* DESCRIPTION */}

              <p className="mt-0.5 text-xs leading-5 text-slate-600">
                {description}
              </p>

              {/* RECOMMENDED ACTION */}

              {insight?.recommendedAction && (
                <div className="mt-2 rounded-md border border-slate-200 bg-white px-2.5 py-2">
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                    Recommended Action
                  </p>

                  <p className="mt-0.5 text-[11px] leading-4 text-slate-600">
                    {insight.recommendedAction}
                  </p>
                </div>
              )}

              {/* SOURCES */}

              {Array.isArray(insight?.sourceRecords) &&
                insight.sourceRecords.length > 0 && (
                  <p className="mt-1.5 text-[10px] text-slate-400">
                    {insight.sourceRecords.length} CRM source
                    {insight.sourceRecords.length !== 1
                      ? "s"
                      : ""}
                  </p>
                )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AIAnalyticsInsights;