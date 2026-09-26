import { useCallback, useEffect, useState } from "react";
import { getDealAIInsights } from "../../services/aiService";

// =====================================================
// INSIGHT STYLES
// =====================================================

const insightStyles = {
  risk: {
    icon: "⚠",
    label: "Risk",
    badge: "bg-red-50 text-red-700 border-red-200",
    iconBg: "bg-red-100 text-red-600",
  },

  opportunity: {
    icon: "✦",
    label: "Opportunity",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    iconBg: "bg-amber-100 text-amber-600",
  },

  priority: {
    icon: "!",
    label: "Priority",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    iconBg: "bg-blue-100 text-blue-600",
  },

  follow_up: {
    icon: "↗",
    label: "Follow-up",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
    iconBg: "bg-violet-100 text-violet-600",
  },

  summary: {
    icon: "i",
    label: "Summary",
    badge: "bg-slate-50 text-slate-700 border-slate-200",
    iconBg: "bg-slate-100 text-slate-600",
  },
};

// =====================================================
// PRIORITY STYLES
// =====================================================

const priorityStyles = {
  high: "bg-red-50 text-red-700",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-emerald-50 text-emerald-700",
};

// =====================================================
// COMPONENT
// =====================================================

const AIDealIntelligence = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===================================================
  // LOAD DEAL AI
  // ===================================================

  const loadDealAI = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDealAIInsights();

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Unable to load AI deal insights."
        );
      }

      setData(response.data || null);
    } catch (err) {
      console.error("Deal AI Insights Error:", err);

      setError(
        err?.message ||
          "Unable to load AI deal insights. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    loadDealAI();
  }, [loadDealAI]);

  // ===================================================
  // UI
  // ===================================================

  return (
    <section className="w-full rounded-xl border border-slate-200 bg-white shadow-sm">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-2.5 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">

          {/* AI ICON */}

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <span className="text-sm font-bold">
              ✦
            </span>
          </div>

          {/* TITLE */}

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-semibold text-slate-900">
                AI Deal Intelligence
              </h2>

              <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-blue-600">
                AI
              </span>
            </div>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Deal opportunities, risks & next actions
            </p>
          </div>
        </div>

        {/* REFRESH */}

        <button
          type="button"
          onClick={loadDealAI}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md border border-slate-200 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Refresh AI"}
        </button>
      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="space-y-3 p-4">

          {/* SUMMARY SKELETON */}

          <div className="animate-pulse">
            <div className="h-3 w-28 rounded bg-slate-200" />

            <div className="mt-2 h-2.5 w-full rounded bg-slate-100" />

            <div className="mt-1.5 h-2.5 w-4/5 rounded bg-slate-100" />
          </div>

          {/* INSIGHT SKELETONS */}

          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-lg border border-slate-100 p-3"
              >
                <div className="h-7 w-7 rounded-md bg-slate-200" />

                <div className="mt-2.5 h-3 w-3/4 rounded bg-slate-200" />

                <div className="mt-2 h-2.5 w-full rounded bg-slate-100" />

                <div className="mt-1.5 h-2.5 w-5/6 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading && error && (
        <div className="p-4">
          <div className="rounded-lg border border-red-100 bg-red-50 p-3">
            <div className="flex items-start gap-2.5">

              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-red-100 text-xs font-semibold text-red-600">
                !
              </div>

              <div className="flex-1">
                <h3 className="text-xs font-semibold text-red-800">
                  AI deal insights unavailable
                </h3>

                <p className="mt-0.5 text-[11px] leading-4 text-red-700">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={loadDealAI}
                  className="mt-2 rounded-md bg-red-600 px-2.5 py-1.5 text-[10px] font-semibold text-white transition hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        !error &&
        (!data ||
          !Array.isArray(data.insights)) && (
          <div className="p-4">
            <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center">
              <div className="text-xs font-medium text-slate-700">
                No AI deal insights available
              </div>

              <p className="mt-1 text-[11px] text-slate-500">
                Not enough deal activity for AI analysis yet.
              </p>
            </div>
          </div>
        )}

      {/* =================================================
          AI DATA
      ================================================= */}

      {!loading && !error && data && (
        <div className="p-4">

          {/* =================================================
              SUMMARY
          ================================================= */}

          {data.summary && (
            <div className="mb-3 rounded-lg bg-slate-50 px-3 py-2.5">
              <div className="flex items-start gap-2">

                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-100 text-[10px] font-bold text-blue-600">
                  AI
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                    AI Deal Summary
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-slate-700">
                    {data.summary}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              INSIGHTS
          ================================================= */}

          {Array.isArray(data.insights) &&
          data.insights.length > 0 ? (
            <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">

              {data.insights.map(
                (insight, index) => {
                  const type =
                    insightStyles[
                      insight?.type
                    ] ||
                    insightStyles.summary;

                  const priority =
                    priorityStyles[
                      insight?.priority
                    ] ||
                    priorityStyles.low;

                  return (
                    <article
                      key={`${
                        insight?.title ||
                        "deal-insight"
                      }-${index}`}
                      className="rounded-lg border border-slate-200 bg-white p-3 transition hover:border-slate-300 hover:shadow-sm"
                    >

                      {/* TOP */}

                      <div className="flex items-start justify-between gap-2">

                        <div className="flex items-start gap-2">

                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${type.iconBg}`}
                          >
                            {type.icon}
                          </div>

                          <div>
                            <span
                              className={`inline-flex rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${type.badge}`}
                            >
                              {type.label}
                            </span>

                            <h3 className="mt-1 text-xs font-semibold text-slate-900">
                              {insight?.title ||
                                "AI Deal Insight"}
                            </h3>
                          </div>
                        </div>

                        {/* PRIORITY */}

                        {insight?.priority && (
                          <span
                            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase ${priority}`}
                          >
                            {insight.priority}
                          </span>
                        )}
                      </div>

                      {/* SUMMARY */}

                      {insight?.summary && (
                        <p className="mt-2.5 text-[11px] leading-4 text-slate-600">
                          {insight.summary}
                        </p>
                      )}

                      {/* RECOMMENDED ACTION */}

                      {insight?.recommendedAction && (
                        <div className="mt-2.5 rounded-md border border-slate-100 bg-slate-50 px-2.5 py-2">
                          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                            Recommended Action
                          </p>

                          <p className="mt-0.5 text-[11px] leading-4 text-slate-700">
                            {insight.recommendedAction}
                          </p>
                        </div>
                      )}

                      {/* SOURCE RECORDS */}

                      {Array.isArray(
                        insight?.sourceRecords
                      ) &&
                        insight.sourceRecords
                          .length > 0 && (
                          <div className="mt-2 flex items-center justify-between">

                            <span className="text-[9px] font-medium text-slate-400">
                              Based on{" "}
                              {
                                insight
                                  .sourceRecords
                                  .length
                              }{" "}
                              CRM{" "}
                              {insight
                                .sourceRecords
                                .length ===
                              1
                                ? "deal"
                                : "deals"}
                            </span>

                            <span className="text-[9px] font-medium text-blue-500">
                              AI generated
                            </span>
                          </div>
                        )}
                    </article>
                  );
                }
              )}
            </div>
          ) : (
            /* NO ACTIONABLE INSIGHTS */

            <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center">
              <p className="text-xs font-medium text-slate-700">
                No actionable deal insights right now
              </p>

              <p className="mt-1 text-[11px] leading-4 text-slate-500">
                AI will surface opportunities, risks and
                follow-up recommendations as activity
                becomes available.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default AIDealIntelligence;