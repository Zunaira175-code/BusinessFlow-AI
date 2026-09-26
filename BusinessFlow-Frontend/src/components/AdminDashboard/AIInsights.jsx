import { useCallback, useEffect, useState } from "react";
import { getDashboardAIInsights } from "../../services/aiService";

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

const AIInsights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===================================================
  // LOAD AI INSIGHTS
  // ===================================================

  const loadAIInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDashboardAIInsights();

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to load AI insights."
        );
      }

      setData(response.data || null);
    } catch (err) {
      console.error(
        "Dashboard AI Insights Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load AI insights. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    loadAIInsights();
  }, [loadAIInsights]);

  // ===================================================
  // MAIN UI
  // ===================================================

  return (
    <section className="w-full min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">

        {/* LEFT */}

        <div className="flex min-w-0 items-center gap-2.5">

          {/* AI ICON */}

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <span className="text-sm font-bold">
              ✦
            </span>
          </div>

          {/* TITLE */}

          <div className="min-w-0">

            <div className="flex items-center gap-1.5">

              <h2 className="truncate text-sm font-semibold text-slate-900">
                AI Business Insights
              </h2>

              <span className="shrink-0 rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-blue-600">
                AI
              </span>

            </div>

            <p className="truncate text-[11px] text-slate-500">
              AI-generated insights from your CRM activity
            </p>

          </div>
        </div>

        {/* REFRESH */}

        <button
          type="button"
          onClick={loadAIInsights}
          disabled={loading}
          className="shrink-0 rounded-md border border-slate-200 px-2.5 py-1.5 text-[10px] font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Refresh AI"}
        </button>

      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="w-full space-y-3 p-4">

          {/* SUMMARY SKELETON */}

          <div className="animate-pulse">

            <div className="h-3 w-28 rounded bg-slate-200" />

            <div className="mt-2 h-2.5 w-full rounded bg-slate-100" />

          </div>

          {/* CARD SKELETONS */}

          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="min-w-0 animate-pulse rounded-xl border border-slate-100 p-4"
              >

                <div className="h-8 w-8 rounded-lg bg-slate-200" />

                <div className="mt-3 h-3 w-3/4 rounded bg-slate-200" />

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
        <div className="w-full p-4">

          <div className="flex items-center gap-2.5 rounded-lg border border-red-100 bg-red-50 p-3">

            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-red-100 text-xs font-semibold text-red-600">
              !
            </div>

            <div className="min-w-0 flex-1">

              <h3 className="text-xs font-semibold text-red-800">
                AI insights unavailable
              </h3>

              <p className="mt-0.5 truncate text-[11px] text-red-700">
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={loadAIInsights}
              className="shrink-0 rounded-md bg-red-600 px-2.5 py-1.5 text-[10px] font-semibold text-white transition hover:bg-red-700"
            >
              Retry
            </button>

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
          <div className="w-full p-4">

            <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center">

              <div className="text-xs font-medium text-slate-700">
                No AI insights available
              </div>

              <p className="mt-1 text-[11px] text-slate-500">
                There is not enough CRM activity for AI analysis yet.
              </p>

            </div>

          </div>
        )}

      {/* =================================================
          AI DATA
      ================================================= */}

      {!loading && !error && data && (
        <div className="w-full p-4">

          {/* =================================================
              SUMMARY
          ================================================= */}

          {data.summary && (
            <div className="mb-3 w-full rounded-lg bg-slate-50 px-3 py-2.5">

              <div className="flex items-center gap-2">

                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-100 text-[9px] font-bold text-blue-600">
                  AI
                </div>

                <div className="min-w-0">

                  <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                    AI Summary
                  </p>

                  <p className="truncate text-[11px] text-slate-600">
                    {data.summary}
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* =================================================
              INSIGHT CARDS
              1 MOBILE
              2 TABLET
              3 DESKTOP
          ================================================= */}

          {Array.isArray(data.insights) &&
          data.insights.length > 0 ? (

            <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">

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
                        "insight"
                      }-${index}`}
                      className="w-full min-w-0 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
                    >

                      {/* =========================
                          CARD HEADER
                      ========================= */}

                      <div className="flex items-start justify-between gap-2">

                        <div className="flex min-w-0 items-center gap-2.5">

                          {/* ICON */}

                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${type.iconBg}`}
                          >
                            {type.icon}
                          </div>

                          {/* TYPE + TITLE */}

                          <div className="min-w-0">

                            <span
                              className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold ${type.badge}`}
                            >
                              {type.label}
                            </span>

                            <h3 className="mt-1.5 truncate text-sm font-semibold text-slate-900">
                              {insight?.title ||
                                "AI Insight"}
                            </h3>

                          </div>

                        </div>

                        {/* PRIORITY */}

                        {insight?.priority && (
                          <span
                            className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-semibold uppercase ${priority}`}
                          >
                            {insight.priority}
                          </span>
                        )}

                      </div>

                      {/* =========================
                          SUMMARY
                      ========================= */}

                      {insight?.summary && (
                        <p className="mt-3 line-clamp-3 text-xs leading-5 text-slate-600">
                          {insight.summary}
                        </p>
                      )}

                      {/* =========================
                          ACTION
                      ========================= */}

                      {insight?.recommendedAction && (
                        <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2">

                          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                            Recommended Action
                          </p>

                          <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-600">
                            {insight.recommendedAction}
                          </p>

                        </div>
                      )}

                      {/* =========================
                          SOURCES
                      ========================= */}

                      {Array.isArray(
                        insight?.sourceRecords
                      ) &&
                        insight.sourceRecords.length >
                          0 && (
                          <div className="mt-3 flex items-center justify-between gap-2">

                            <span className="truncate text-[9px] text-slate-400">
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
                                ? "record"
                                : "records"}
                            </span>

                            <span className="shrink-0 text-[9px] font-medium text-blue-500">
                              AI
                            </span>

                          </div>
                        )}

                    </article>
                  );
                }
              )}

            </div>

          ) : (

            /* =================================================
               NO INSIGHTS
            ================================================= */

            <div className="w-full rounded-lg border border-dashed border-slate-200 p-4 text-center">

              <p className="text-xs font-medium text-slate-700">
                No actionable AI insights right now
              </p>

              <p className="mt-1 text-[10px] leading-4 text-slate-500">
                AI will surface priorities, opportunities,
                risks and follow-up recommendations as CRM
                activity grows.
              </p>

            </div>

          )}

        </div>
      )}

    </section>
  );
};

export default AIInsights;