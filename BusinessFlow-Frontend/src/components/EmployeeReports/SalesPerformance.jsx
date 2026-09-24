import { useEffect, useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";

const SalesPerformance = () => {
  const [period, setPeriod] = useState("monthly");

  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH SALES PERFORMANCE
  // =====================================================

  const fetchSalesPerformance = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
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
            Accept: "application/json",
          },
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Unable to load sales performance."
        );
      }

      setSalesData(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (err) {
      console.error(
        "Sales Performance Error:",
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

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchSalesPerformance();
  }, []);

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (value) => {
    const amount = Number(
      value || 0
    );

    if (amount >= 1000000) {
      return `$${(
        amount / 1000000
      ).toFixed(1)}M`;
    }

    if (amount >= 1000) {
      return `$${(
        amount / 1000
      ).toFixed(0)}k`;
    }

    return `$${amount.toLocaleString(
      "en-US"
    )}`;
  };

  // =====================================================
  // FORMAT FULL CURRENCY
  // =====================================================

  const formatFullCurrency = (
    value
  ) => {
    return `$${Number(
      value || 0
    ).toLocaleString("en-US", {
      maximumFractionDigits: 0,
    })}`;
  };

  // =====================================================
  // QUARTERLY DATA
  // =====================================================

  const quarterlyData = useMemo(() => {
    if (!salesData.length) {
      return [];
    }

    const quarters = {};

    salesData.forEach((item) => {
      const monthIndex =
        new Date(
          `${item.month} 1, ${item.year}`
        ).getMonth();

      const quarter =
        Math.floor(
          monthIndex / 3
        ) + 1;

      const key = `${item.year}-Q${quarter}`;

      if (!quarters[key]) {
        quarters[key] = {
          month: `Q${quarter}`,
          year: item.year,
          actual: 0,
          projected: 0,
        };
      }

      quarters[key].actual += Number(
        item.actual || 0
      );

      quarters[key].projected +=
        Number(
          item.projected || 0
        );
    });

    return Object.values(
      quarters
    ).sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }

      return (
        Number(
          a.month.replace("Q", "")
        ) -
        Number(
          b.month.replace("Q", "")
        )
      );
    });
  }, [salesData]);

  // =====================================================
  // ACTIVE DATASET
  // =====================================================

  const chartData =
    period === "quarterly"
      ? quarterlyData
      : salesData;

  // =====================================================
  // MAX VALUE
  // =====================================================

  const maxValue = useMemo(() => {
    const values =
      chartData.flatMap(
        (item) => [
          Number(
            item.actual || 0
          ),
          Number(
            item.projected || 0
          ),
        ]
      );

    return Math.max(
      ...values,
      1
    );
  }, [chartData]);

  // =====================================================
  // TOTALS
  // =====================================================

  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, item) => {
        acc.actual += Number(
          item.actual || 0
        );

        acc.projected += Number(
          item.projected || 0
        );

        return acc;
      },
      {
        actual: 0,
        projected: 0,
      }
    );
  }, [chartData]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section
        className="
          h-[300px]
          rounded-[9px]
          border
          border-[#DCE5ED]
          bg-white
          p-4
        "
      >
        <div className="flex items-center justify-between">
          <div className="h-3 w-28 animate-pulse rounded bg-[#E8EEF3]" />

          <div className="h-5 w-28 animate-pulse rounded bg-[#E8EEF3]" />
        </div>

        <div
          className="
            mt-3
            flex
            h-[228px]
            items-end
            justify-center
            gap-3
            rounded-[5px]
            border
            border-dashed
            border-[#D5E0E8]
            bg-[#FCFDFE]
            px-5
            pb-6
          "
        >
          {[45, 65, 35, 80, 55, 70].map(
            (height, index) => (
              <div
                key={index}
                className="
                  w-5
                  animate-pulse
                  rounded-t-[3px]
                  bg-[#E8EEF3]
                "
                style={{
                  height: `${height}%`,
                }}
              />
            )
          )}
        </div>
      </section>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <section
        className="
          h-[300px]
          rounded-[9px]
          border
          border-[#DCE5ED]
          bg-white
          p-4
        "
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-[#17324D]">
            Sales Performance
          </h2>
        </div>

        <div className="flex h-[250px] flex-col items-center justify-center gap-2">
          <BarChart3
            size={24}
            strokeWidth={1.8}
            className="text-[#A0ADBA]"
          />

          <p className="text-center text-[8px] text-[#D64545]">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchSalesPerformance}
            className="
              rounded-[5px]
              bg-[#0B3D6B]
              px-3
              py-1.5
              text-[7px]
              font-semibold
              text-white
              hover:bg-[#082F54]
            "
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // =====================================================
  // EMPTY
  // =====================================================

  if (!salesData.length) {
    return (
      <section
        className="
          h-[300px]
          rounded-[9px]
          border
          border-[#DCE5ED]
          bg-white
          p-4
        "
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-[#17324D]">
            Sales Performance
          </h2>

          <div
            className="
              flex
              h-[20px]
              overflow-hidden
              rounded-[4px]
              border
              border-[#DCE5ED]
            "
          >
            <button
              type="button"
              onClick={() =>
                setPeriod("monthly")
              }
              className={`
                px-[9px]
                text-[7px]
                font-medium
                ${
                  period === "monthly"
                    ? "bg-[#F5F8FB] text-[#60758A]"
                    : "text-[#7A8B9A]"
                }
              `}
            >
              Monthly
            </button>

            <button
              type="button"
              onClick={() =>
                setPeriod("quarterly")
              }
              className={`
                px-[9px]
                text-[7px]
                ${
                  period === "quarterly"
                    ? "bg-[#F5F8FB] text-[#60758A]"
                    : "text-[#7A8B9A]"
                }
              `}
            >
              Quarterly
            </button>
          </div>
        </div>

        <div
          className="
            mt-3
            flex
            h-[228px]
            flex-col
            items-center
            justify-center
            rounded-[5px]
            border
            border-dashed
            border-[#D5E0E8]
            bg-[#FCFDFE]
          "
        >
          <BarChart3
            size={21}
            strokeWidth={2}
            className="text-[#8293A2]"
          />

          <p className="mt-1 text-[8px] text-[#8293A2]">
            No sales performance data available
          </p>
        </div>
      </section>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <section
      className="
        h-[300px]
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
        p-4
      "
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between">
        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          Sales Performance
        </h2>

        {/* Period Switcher */}
        <div
          className="
            flex
            h-[20px]
            overflow-hidden
            rounded-[4px]
            border
            border-[#DCE5ED]
          "
        >
          <button
            type="button"
            onClick={() =>
              setPeriod("monthly")
            }
            className={`
              px-[9px]
              text-[7px]
              font-medium
              transition-colors
              ${
                period === "monthly"
                  ? "bg-[#F5F8FB] text-[#60758A]"
                  : "text-[#7A8B9A] hover:bg-[#F7F9FB]"
              }
            `}
          >
            Monthly
          </button>

          <button
            type="button"
            onClick={() =>
              setPeriod("quarterly")
            }
            className={`
              px-[9px]
              text-[7px]
              transition-colors
              ${
                period === "quarterly"
                  ? "bg-[#F5F8FB] text-[#60758A]"
                  : "text-[#7A8B9A] hover:bg-[#F7F9FB]"
              }
            `}
          >
            Quarterly
          </button>
        </div>
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="mt-2 flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="h-[6px] w-[6px] rounded-full bg-[#0B3D6B]" />

          <span className="text-[6px] text-[#60758A]">
            Actual
          </span>

          <span className="text-[7px] font-semibold text-[#17324D]">
            {formatFullCurrency(
              totals.actual
            )}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="h-[6px] w-[6px] rounded-full bg-[#B8C8D6]" />

          <span className="text-[6px] text-[#60758A]">
            Projected
          </span>

          <span className="text-[7px] font-semibold text-[#17324D]">
            {formatFullCurrency(
              totals.projected
            )}
          </span>
        </div>
      </div>

      {/* =================================================
          CHART
      ================================================= */}

      <div
        className="
          mt-2
          h-[205px]
          rounded-[5px]
          border
          border-dashed
          border-[#D5E0E8]
          bg-[#FCFDFE]
          px-3
          pb-2
          pt-3
        "
      >
        <div className="flex h-full min-w-0">
          {/* Y AXIS */}
          <div className="flex w-[32px] shrink-0 flex-col justify-between pb-[17px]">
            <span className="text-right text-[6px] text-[#8293A2]">
              {formatCurrency(
                maxValue
              )}
            </span>

            <span className="text-right text-[6px] text-[#8293A2]">
              {formatCurrency(
                maxValue * 0.75
              )}
            </span>

            <span className="text-right text-[6px] text-[#8293A2]">
              {formatCurrency(
                maxValue * 0.5
              )}
            </span>

            <span className="text-right text-[6px] text-[#8293A2]">
              {formatCurrency(
                maxValue * 0.25
              )}
            </span>

            <span className="text-right text-[6px] text-[#8293A2]">
              $0
            </span>
          </div>

          {/* GRAPH */}
          <div className="relative min-w-0 flex-1">
            {/* Grid */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-[18px]">
              {[1, 2, 3, 4, 5].map(
                (line) => (
                  <div
                    key={line}
                    className="w-full border-t border-[#E9EEF2]"
                  />
                )
              )}
            </div>

            {/* Bars */}
            <div className="relative z-10 flex h-full items-end gap-2 overflow-x-auto pb-[18px]">
              {chartData.map(
                (
                  item,
                  index
                ) => {
                  const actual =
                    Number(
                      item.actual ||
                        0
                    );

                  const projected =
                    Number(
                      item.projected ||
                        0
                    );

                  const actualHeight =
                    Math.max(
                      (actual /
                        maxValue) *
                        100,
                      actual > 0
                        ? 2
                        : 0
                    );

                  const projectedHeight =
                    Math.max(
                      (projected /
                        maxValue) *
                        100,
                      projected > 0
                        ? 2
                        : 0
                    );

                  return (
                    <div
                      key={`${item.year}-${item.month}-${index}`}
                      className="
                        flex
                        min-w-[34px]
                        flex-1
                        flex-col
                        items-center
                        justify-end
                        gap-1
                      "
                    >
                      {/* Bars */}
                      <div
                        className="
                          flex
                          h-[145px]
                          w-full
                          max-w-[30px]
                          items-end
                          justify-center
                          gap-[2px]
                        "
                      >
                        {/* Actual */}
                        <div
                          className="
                            w-[9px]
                            min-h-0
                            rounded-t-[2px]
                            bg-[#0B3D6B]
                            transition-all
                            duration-300
                          "
                          style={{
                            height: `${actualHeight}%`,
                          }}
                          title={`Actual: ${formatFullCurrency(
                            actual
                          )}`}
                        />

                        {/* Projected */}
                        <div
                          className="
                            w-[9px]
                            min-h-0
                            rounded-t-[2px]
                            bg-[#B8C8D6]
                            transition-all
                            duration-300
                          "
                          style={{
                            height: `${projectedHeight}%`,
                          }}
                          title={`Projected: ${formatFullCurrency(
                            projected
                          )}`}
                        />
                      </div>

                      {/* X AXIS */}
                      <span
                        className="
                          block
                          max-w-[34px]
                          truncate
                          text-center
                          text-[6px]
                          text-[#60758A]
                        "
                      >
                        {period ===
                        "quarterly"
                          ? `${item.month} ${String(
                              item.year
                            ).slice(
                              -2
                            )}`
                          : item.month}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesPerformance;