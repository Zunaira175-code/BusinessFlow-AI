import { useEffect, useMemo, useState } from "react";
import { MoreHorizontal } from "lucide-react";

import Card from "../common/Card";
import IconButton from "../common/IconButton";

const API_URL = "http://localhost:5000/api";

const SalesPipeline = () => {
  const [pipelineData, setPipelineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH PIPELINE DATA
  // =====================================================

  const fetchPipeline = async (signal) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("businessflow_token");

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_URL}/admin/dashboard/pipeline`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to load sales pipeline data."
        );
      }

      setPipelineData(result.data);
    } catch (err) {
      if (err.name === "AbortError") {
        return;
      }

      console.error(
        "Sales Pipeline Fetch Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load sales pipeline data."
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const controller = new AbortController();

    fetchPipeline(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  // =====================================================
  // CHART DATA
  // =====================================================

  const months = useMemo(() => {
    if (
      !pipelineData?.monthlyPipeline ||
      !Array.isArray(
        pipelineData.monthlyPipeline
      )
    ) {
      return [];
    }

    return pipelineData.monthlyPipeline;
  }, [pipelineData]);

  // =====================================================
  // MAX VALUE
  // =====================================================

  const maxValue = useMemo(() => {
    if (!months.length) {
      return 1500000;
    }

    const highestValue = Math.max(
      ...months.map(
        (item) => Number(item.value) || 0
      )
    );

    if (highestValue <= 0) {
      return 1500000;
    }

    // Give the chart some breathing room.
    // Round to a useful scale.
    const paddedValue =
      highestValue * 1.2;

    if (paddedValue <= 500000) {
      return 500000;
    }

    if (paddedValue <= 1000000) {
      return 1000000;
    }

    if (paddedValue <= 1500000) {
      return 1500000;
    }

    if (paddedValue <= 2000000) {
      return 2000000;
    }

    return Math.ceil(
      paddedValue / 500000
    ) * 500000;
  }, [months]);

  // =====================================================
  // ACTIVE MONTH
  // =====================================================

  const activeMonthIndex = useMemo(() => {
    if (!months.length) {
      return -1;
    }

    const actualIndexes = months
      .map((item, index) =>
        item.type === "actual"
          ? index
          : -1
      )
      .filter((index) => index !== -1);

    if (!actualIndexes.length) {
      return -1;
    }

    return actualIndexes[
      actualIndexes.length - 1
    ];
  }, [months]);

  // =====================================================
  // FORMAT AXIS VALUE
  // =====================================================

  const formatAxisValue = (value) => {
    const number = Number(value) || 0;

    if (number >= 1000000) {
      const millions =
        number / 1000000;

      return `$${millions
        .toFixed(millions % 1 === 0 ? 0 : 1)}M`;
    }

    if (number >= 1000) {
      const thousands =
        number / 1000;

      return `$${thousands
        .toFixed(thousands % 1 === 0 ? 0 : 1)}K`;
    }

    return `$${number}`;
  };

  // =====================================================
  // Y AXIS
  // =====================================================

  const yAxisValues = useMemo(() => {
    return [
      maxValue,
      maxValue * 0.6667,
      maxValue * 0.3333,
      0,
    ];
  }, [maxValue]);

  // =====================================================
  // BAR HEIGHT
  // =====================================================

  const getBarHeight = (value) => {
    const numericValue =
      Number(value) || 0;

    if (numericValue <= 0) {
      return "0px";
    }

    const percentage =
      (numericValue / maxValue) * 170;

    return `${Math.max(
      4,
      Math.min(170, percentage)
    )}px`;
  };

  // =====================================================
  // RETRY
  // =====================================================

  const handleRetry = () => {
    const controller =
      new AbortController();

    fetchPipeline(controller.signal);

    setTimeout(() => {
      controller.abort();
    }, 30000);
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="flex h-[62px] items-center justify-between border-b border-[#DDE5EC] px-[14px]">
          <div>
            <h2 className="text-[13px] font-bold text-[#102F4A]">
              Sales Pipeline Trend
            </h2>

            <p className="mt-[2px] text-[9px] font-medium text-[#8192A2]">
              Revenue forecasting across stages
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-[7px] w-[70px] animate-pulse rounded-full bg-[#EDF1F5]" />

            <IconButton
              icon={MoreHorizontal}
              label="More options"
              size={15}
              className="h-6 w-6 rounded-md"
            />
          </div>
        </div>

        {/* Loading Chart */}
        <div className="px-[16px] pb-[10px] pt-[14px]">
          <div className="relative h-[215px]">
            <div className="absolute left-0 top-0 flex h-[170px] w-[30px] flex-col justify-between">
              <span className="text-[8px] text-[#A1AFBB]">
                —
              </span>

              <span className="text-[8px] text-[#A1AFBB]">
                —
              </span>

              <span className="text-[8px] text-[#A1AFBB]">
                —
              </span>

              <span className="text-[8px] text-[#A1AFBB]">
                $0
              </span>
            </div>

            <div className="absolute left-[32px] right-0 top-0 h-[170px]">
              <div className="absolute inset-x-0 top-0 border-t border-[#EDF1F5]" />

              <div className="absolute inset-x-0 top-[35%] border-t border-[#EDF1F5]" />

              <div className="absolute inset-x-0 top-[70%] border-t border-[#EDF1F5]" />

              <div className="absolute inset-x-0 bottom-0 border-t border-[#EDF1F5]" />

              <div className="absolute inset-x-[18px] bottom-0 flex h-full items-end justify-between gap-[10px]">
                {[1, 2, 3, 4, 5, 6].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex h-full flex-1 items-end justify-center"
                    >
                      <div
                        className="w-full max-w-[60px] animate-pulse rounded-t-[2px] bg-[#EEF4FC]"
                        style={{
                          height: `${35 + item * 12}px`,
                        }}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {
    return (
      <Card className="overflow-hidden">
        <div className="flex h-[62px] items-center justify-between border-b border-[#DDE5EC] px-[14px]">
          <div>
            <h2 className="text-[13px] font-bold text-[#102F4A]">
              Sales Pipeline Trend
            </h2>

            <p className="mt-[2px] text-[9px] font-medium text-[#8192A2]">
              Revenue forecasting across stages
            </p>
          </div>

          <IconButton
            icon={MoreHorizontal}
            label="More options"
            size={15}
            className="h-6 w-6 rounded-md"
          />
        </div>

        <div className="flex h-[215px] flex-col items-center justify-center px-4 text-center">
          <p className="text-[11px] font-semibold text-[#102F4A]">
            Unable to load pipeline
          </p>

          <p className="mt-1 max-w-[320px] text-[9px] font-medium text-[#8192A2]">
            {error}
          </p>

          <button
            type="button"
            onClick={handleRetry}
            className="mt-3 rounded-md border border-[#C9D9E8] bg-white px-3 py-1.5 text-[9px] font-semibold text-[#0B3D6B] transition hover:bg-[#F5F9FD]"
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (!months.length) {
    return (
      <Card className="overflow-hidden">
        <div className="flex h-[62px] items-center justify-between border-b border-[#DDE5EC] px-[14px]">
          <div>
            <h2 className="text-[13px] font-bold text-[#102F4A]">
              Sales Pipeline Trend
            </h2>

            <p className="mt-[2px] text-[9px] font-medium text-[#8192A2]">
              Revenue forecasting across stages
            </p>
          </div>

          <div className="flex items-center gap-3">
            <IconButton
              icon={MoreHorizontal}
              label="More options"
              size={15}
              className="h-6 w-6 rounded-md"
            />
          </div>
        </div>

        <div className="flex h-[215px] items-center justify-center">
          <div className="text-center">
            <p className="text-[11px] font-semibold text-[#102F4A]">
              No pipeline data yet
            </p>

            <p className="mt-1 text-[9px] font-medium text-[#8192A2]">
              Create deals to see your sales pipeline trend.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex h-[62px] items-center justify-between border-b border-[#DDE5EC] px-[14px]">
        <div>
          <h2 className="text-[13px] font-bold text-[#102F4A]">
            Sales Pipeline Trend
          </h2>

          <p className="mt-[2px] text-[9px] font-medium text-[#8192A2]">
            Revenue forecasting across stages
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Actual */}
          <div className="flex items-center gap-1">
            <span className="h-[7px] w-[7px] rounded-full bg-[#0B3D6B]" />

            <span className="text-[9px] font-medium text-[#62778B]">
              Actual
            </span>
          </div>

          {/* Projected */}
          <div className="flex items-center gap-1">
            <span className="h-[7px] w-[7px] rounded-full border border-[#D5E0EB] bg-[#EFF4FB]" />

            <span className="text-[9px] font-medium text-[#8797A6]">
              Projected
            </span>
          </div>

          <IconButton
            icon={MoreHorizontal}
            label="More options"
            size={15}
            className="h-6 w-6 rounded-md"
          />
        </div>
      </div>

      {/* Chart */}
      <div className="px-[16px] pb-[10px] pt-[14px]">
        <div className="relative h-[215px]">
          {/* Y Axis */}
          <div className="absolute left-0 top-0 flex h-[170px] w-[30px] flex-col justify-between">
            {yAxisValues.map(
              (value, index) => (
                <span
                  key={`${value}-${index}`}
                  className="text-[8px] text-[#A1AFBB]"
                >
                  {formatAxisValue(value)}
                </span>
              )
            )}
          </div>

          {/* Chart */}
          <div className="absolute left-[32px] right-0 top-0 h-[170px]">
            {/* Grid */}
            <div className="absolute inset-x-0 top-0 border-t border-[#EDF1F5]" />

            <div className="absolute inset-x-0 top-[35%] border-t border-[#EDF1F5]" />

            <div className="absolute inset-x-0 top-[70%] border-t border-[#EDF1F5]" />

            <div className="absolute inset-x-0 bottom-0 border-t border-[#EDF1F5]" />

            {/* Bars */}
            <div className="absolute inset-x-[18px] bottom-0 flex h-full items-end justify-between gap-[10px]">
              {months.map(
                (item, index) => {
                  const projected =
                    item.type ===
                    "projected";

                  const active =
                    index ===
                    activeMonthIndex;

                  return (
                    <div
                      key={`${item.month}-${index}`}
                      className="flex h-full flex-1 items-end justify-center"
                    >
                      <div
                        title={`${item.month}: ${formatAxisValue(
                          item.value
                        )}`}
                        className={`
                          relative
                          w-full
                          max-w-[60px]
                          rounded-t-[2px]
                          border
                          transition-all
                          duration-300
                          ${
                            active
                              ? "border-[#0B3D6B] bg-[#0B3D6B]"
                              : projected
                                ? "border-[#DCE7F5] bg-[#EEF4FC]"
                                : "border-[#C6D9F1] bg-[#C6D9F1]"
                          }
                        `}
                        style={{
                          height:
                            getBarHeight(
                              item.value
                            ),
                        }}
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Month Labels */}
          <div className="absolute bottom-0 left-[45px] right-[5px] flex justify-between">
            {months.map(
              (item, index) => (
                <span
                  key={`${item.month}-${index}`}
                  className={
                    index ===
                    activeMonthIndex
                      ? "text-[9px] font-bold text-[#173B5C]"
                      : "text-[9px] font-medium text-[#718599]"
                  }
                >
                  {item.month}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SalesPipeline;