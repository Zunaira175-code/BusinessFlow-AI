import { useEffect, useState } from "react";

const SalesPerformance = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH SALES PERFORMANCE
  // =====================================================

  useEffect(() => {
    const fetchSalesPerformance = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem(
          "businessflow_token"
        );

        if (!token) {
          throw new Error(
            "Authentication token not found."
          );
        }

        const response = await fetch(
          "http://localhost:5000/api/reports/sales-performance?period=180",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Unable to load sales performance."
          );
        }

        setSalesData(result.data || []);
      } catch (err) {
        console.error(
          "Sales Performance Fetch Error:",
          err
        );

        setError(
          err.message ||
            "Unable to load sales performance."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSalesPerformance();
  }, []);

  // =====================================================
  // CHART DATA
  // =====================================================

  const months = salesData.map(
    (item) => item.month
  );

  const actual = salesData.map(
    (item) => Number(item.actual || 0) / 1000000
  );

  const projected = salesData.map(
    (item) =>
      Number(item.projected || 0) / 1000000
  );

  // =====================================================
  // MAX VALUE
  // =====================================================

  const highestValue = Math.max(
    ...actual,
    ...projected,
    5
  );

  const maxValue =
    Math.ceil(highestValue);

  // =====================================================
  // FORMAT VALUE
  // =====================================================

  const formatChartValue = (value) => {
    if (value >= 1) {
      return `$${value.toFixed(1)}M`;
    }

    if (value > 0) {
      return `$${(value * 1000).toFixed(0)}K`;
    }

    return "$0";
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <section className="w-full rounded-[9px] border border-[#DCE5EF] bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-[#102A43]">
            Sales Performance
          </h2>

          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded text-[#526B82] hover:bg-[#F3F6F9]"
            aria-label="More options"
          >
            <span className="text-[17px] leading-none">
              ⋮
            </span>
          </button>
        </div>

        <div className="mt-3 flex h-[176px] items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#DCE5EF] border-t-[#3B628F]" />
        </div>

        <div className="mt-3 flex items-center justify-center gap-4 opacity-50">
          <div className="h-[7px] w-16 rounded bg-[#E3EAF1]" />
          <div className="h-[7px] w-16 rounded bg-[#E3EAF1]" />
        </div>
      </section>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {
    return (
      <section className="w-full rounded-[9px] border border-[#DCE5EF] bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-[#102A43]">
            Sales Performance
          </h2>

          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded text-[#526B82] hover:bg-[#F3F6F9]"
            aria-label="More options"
          >
            <span className="text-[17px] leading-none">
              ⋮
            </span>
          </button>
        </div>

        <div className="flex h-[176px] items-center justify-center px-4 text-center">
          <p className="text-[10px] text-[#8293A3]">
            {error}
          </p>
        </div>
      </section>
    );
  }

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (!salesData.length) {
    return (
      <section className="w-full rounded-[9px] border border-[#DCE5EF] bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-[#102A43]">
            Sales Performance
          </h2>

          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded text-[#526B82] hover:bg-[#F3F6F9]"
            aria-label="More options"
          >
            <span className="text-[17px] leading-none">
              ⋮
            </span>
          </button>
        </div>

        <div className="flex h-[176px] items-center justify-center">
          <p className="text-[10px] text-[#8293A3]">
            No sales performance data available.
          </p>
        </div>
      </section>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <section className="w-full rounded-[9px] border border-[#DCE5EF] bg-white p-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-[#102A43]">
          Sales Performance
        </h2>

        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center rounded text-[#526B82] hover:bg-[#F3F6F9]"
          aria-label="More options"
        >
          <span className="text-[17px] leading-none">
            ⋮
          </span>
        </button>
      </div>

      {/* Chart */}
      <div className="mt-3 flex">

        {/* Y Axis */}
        <div className="flex h-[176px] w-[31px] shrink-0 flex-col justify-between pb-[20px] pt-[1px]">
          <span className="text-[8px] text-[#8293A3]">
            {formatChartValue(maxValue)}
          </span>

          <span className="text-[8px] text-[#8293A3]">
            {formatChartValue(maxValue * 0.8)}
          </span>

          <span className="text-[8px] text-[#8293A3]">
            {formatChartValue(maxValue * 0.6)}
          </span>

          <span className="text-[8px] text-[#8293A3]">
            {formatChartValue(maxValue * 0.4)}
          </span>

          <span className="text-[8px] text-[#8293A3]">
            {formatChartValue(maxValue * 0.2)}
          </span>

          <span className="text-[8px] text-[#8293A3]">
            0
          </span>
        </div>

        {/* Chart Area */}
        <div className="relative h-[176px] flex-1 border-b border-l border-[#DCE5EF]">

          {/* Grid Lines */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-[20px]">
            {[0, 1, 2, 3, 4, 5].map(
              (line) => (
                <div
                  key={line}
                  className="w-full border-t border-dashed border-[#E3EAF1]"
                />
              )
            )}
          </div>

          {/* Bars */}
          <div className="absolute inset-x-2 bottom-[20px] top-0 flex items-end justify-between">

            {salesData.map(
              (item, index) => {
                const actualHeight = `${
                  (actual[index] / maxValue) *
                  100
                }%`;

                const projectedHeight = `${
                  (projected[index] /
                    maxValue) *
                  100
                }%`;

                return (
                  <div
                    key={`${item.year}-${item.month}`}
                    className="flex h-full flex-1 flex-col justify-end"
                  >

                    {/* Bar Group */}
                    <div className="flex h-full items-end justify-center gap-[2px]">

                      {/* Actual */}
                      <div
                        className="w-[12px] rounded-t-[1px] bg-[#3B628F]"
                        style={{
                          height:
                            actualHeight,
                        }}
                        title={`Actual: ${formatChartValue(
                          actual[index]
                        )}`}
                      />

                      {/* Projected */}
                      <div
                        className="w-[12px] rounded-t-[1px] bg-[#AFC9ED]"
                        style={{
                          height:
                            projectedHeight,
                        }}
                        title={`Projected: ${formatChartValue(
                          projected[index]
                        )}`}
                      />
                    </div>

                    {/* Month */}
                    <div className="absolute bottom-[-17px] flex w-[30px] justify-center">
                      <span className="text-[8px] text-[#8293A3]">
                        {item.month}
                      </span>
                    </div>
                  </div>
                );
              }
            )}

          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-4">

        <div className="flex items-center gap-1">
          <span className="h-[7px] w-[7px] rounded-full bg-[#3B628F]" />

          <span className="text-[8px] text-[#8293A3]">
            Actual
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="h-[7px] w-[7px] rounded-full bg-[#AFC9ED]" />

          <span className="text-[8px] text-[#8293A3]">
            Projected
          </span>
        </div>

      </div>
    </section>
  );
};

export default SalesPerformance;