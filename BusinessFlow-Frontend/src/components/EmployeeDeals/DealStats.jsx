import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const DealStats = () => {
  const [stats, setStats] = useState({
    myDeals: {
      value: 0,
      pipelineValue: 0,
    },
    wonDeals: {
      value: 0,
      wonValue: 0,
    },
    dealsInProgress: {
      value: 0,
      pipelineValue: 0,
    },
    closingThisMonth: {
      value: 0,
      potentialValue: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (value) => {
    const amount = Number(value) || 0;

    return `$${amount.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    })}`;
  };

  // =====================================================
  // FETCH EMPLOYEE DEAL STATS
  // =====================================================

  useEffect(() => {
    let isMounted = true;

    const fetchDealStats = async () => {
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
          `${API_BASE_URL}/api/deals/me/stats`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Unable to fetch deal statistics."
          );
        }

        if (
          !result?.success ||
          !result?.data
        ) {
          throw new Error(
            "Invalid deal statistics response."
          );
        }

        if (isMounted) {
          setStats({
            myDeals: {
              value:
                Number(
                  result.data.myDeals?.value
                ) || 0,

              pipelineValue:
                Number(
                  result.data.myDeals
                    ?.pipelineValue
                ) || 0,
            },

            wonDeals: {
              value:
                Number(
                  result.data.wonDeals?.value
                ) || 0,

              wonValue:
                Number(
                  result.data.wonDeals
                    ?.wonValue
                ) || 0,
            },

            dealsInProgress: {
              value:
                Number(
                  result.data
                    .dealsInProgress?.value
                ) || 0,

              pipelineValue:
                Number(
                  result.data
                    .dealsInProgress
                    ?.pipelineValue
                ) || 0,
            },

            closingThisMonth: {
              value:
                Number(
                  result.data
                    .closingThisMonth?.value
                ) || 0,

              potentialValue:
                Number(
                  result.data
                    .closingThisMonth
                    ?.potentialValue
                ) || 0,
            },
          });
        }
      } catch (err) {
        console.error(
          "Employee Deal Stats Error:",
          err
        );

        if (isMounted) {
          setError(
            err.message ||
              "Unable to load deal statistics."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDealStats();

    return () => {
      isMounted = false;
    };
  }, []);

  // =====================================================
  // DISPLAY VALUE
  // =====================================================

  const displayNumber = (value) => {
    if (loading) {
      return "—";
    }

    return value;
  };

  // =====================================================
  // STATS CONFIG
  // =====================================================

  const statCards = [
    {
      title: "MY DEALS",

      value: displayNumber(
        stats.myDeals.value
      ),

      description: loading
        ? "Loading..."
        : `${formatCurrency(
            stats.myDeals.pipelineValue
          )} total pipeline`,

      descriptionColor:
        "text-[#718599]",
    },

    {
      title: "WON DEALS",

      value: displayNumber(
        stats.wonDeals.value
      ),

      description: loading
        ? "Loading..."
        : `${formatCurrency(
            stats.wonDeals.wonValue
          )} closed`,

      descriptionColor:
        "text-[#20A65A]",
    },

    {
      title: "DEALS IN PROGRESS",

      value: displayNumber(
        stats.dealsInProgress.value
      ),

      description: loading
        ? "Loading..."
        : `${formatCurrency(
            stats.dealsInProgress
              .pipelineValue
          )} pipeline`,

      descriptionColor:
        "text-[#718599]",
    },

    {
      title: "CLOSING THIS MONTH",

      value: displayNumber(
        stats.closingThisMonth.value
      ),

      description: loading
        ? "Loading..."
        : `${formatCurrency(
            stats.closingThisMonth
              .potentialValue
          )} potential`,

      descriptionColor:
        "text-[#E87500]",
    },
  ];

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="
        grid
        w-full
        grid-cols-1
        gap-2.5
        sm:grid-cols-2
        lg:grid-cols-4
      "
    >
      {statCards.map((stat) => (
        <div
          key={stat.title}
          className="
            min-h-[76px]
            rounded-[9px]
            border
            border-[#DCE5ED]
            bg-white
            px-4
            py-3
            shadow-[0_1px_2px_rgba(15,23,42,0.03)]
          "
        >
          {/* =================================================
              TITLE
          ================================================== */}

          <p
            className="
              text-[7px]
              font-semibold
              uppercase
              tracking-[0.5px]
              text-[#718599]
            "
          >
            {stat.title}
          </p>

          {/* =================================================
              VALUE
          ================================================== */}

          <p
            className="
              mt-1
              text-[22px]
              font-bold
              leading-none
              tracking-[-0.5px]
              text-[#0B2E50]
            "
          >
            {stat.value}
          </p>

          {/* =================================================
              DESCRIPTION
          ================================================== */}

          <p
            className={`
              mt-1.5
              text-[7px]
              font-medium
              ${stat.descriptionColor}
            `}
          >
            {stat.description}
          </p>
        </div>
      ))}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          className="
            col-span-full
            text-[7px]
            font-medium
            text-[#DC2626]
          "
        >
          Unable to load deal statistics.
        </div>
      )}
    </div>
  );
};

export default DealStats;