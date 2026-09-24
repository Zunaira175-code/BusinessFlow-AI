import { useEffect, useState } from "react";
import { MoreHorizontal, Loader2 } from "lucide-react";

// =====================================================
// API
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// =====================================================
// STAGE STYLES
// =====================================================

const getStageClass = (stage) => {
  switch (stage) {
    case "Negotiation":
      return "bg-[#FFF0DE] text-[#E87500]";

    case "Proposal":
      return "bg-[#DDF2FF] text-[#0784C7]";

    case "Qualification":
      return "bg-[#E7EEF7] text-[#47709A]";

    case "Prospecting":
      return "bg-[#EEF2F5] text-[#60758A]";

    case "Closed Won":
      return "bg-[#E1F6E9] text-[#20A65A]";

    case "Closed Lost":
      return "bg-[#FDE8E8] text-[#D64545]";

    default:
      return "bg-[#EEF2F5] text-[#60758A]";
  }
};

// =====================================================
// PROBABILITY COLOR
// =====================================================

const getProbabilityClass = (probability) => {
  if (probability >= 75) {
    return "bg-[#20A65A]";
  }

  if (probability >= 50) {
    return "bg-[#E87500]";
  }

  if (probability >= 25) {
    return "bg-[#0784C7]";
  }

  return "bg-[#60758A]";
};

// =====================================================
// FORMAT CURRENCY
// =====================================================

const formatCurrency = (value) => {
  const numericValue = Number(value) || 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numericValue);
};

// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

// =====================================================
// FORMAT LAST ACTIVITY
// =====================================================

const formatLastActivity = (dateValue) => {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startOfYesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );

  const activityDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (activityDate.getTime() === startOfToday.getTime()) {
    return "Today";
  }

  if (
    activityDate.getTime() ===
    startOfYesterday.getTime()
  ) {
    return "Yesterday";
  }

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(
    diffMs / (1000 * 60)
  );

  if (
    diffMinutes >= 0 &&
    diffMinutes < 60
  ) {
    return `${Math.max(diffMinutes, 1)} min ago`;
  }

  const diffHours = Math.floor(
    diffMinutes / 60
  );

  if (
    diffHours >= 1 &&
    diffHours < 24
  ) {
    return `${diffHours}h ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

// =====================================================
// FORMAT DEAL
// =====================================================

const formatDealForUI = (deal) => {
  const probability =
    Number(deal?.probability) || 0;

  return {
    id: deal?.id || deal?._id,

    deal:
      deal?.title ||
      deal?.name ||
      "Untitled Deal",

    company:
      deal?.company ||
      deal?.customerName ||
      "—",

    stage:
      deal?.stage ||
      "Prospecting",

    stageClass:
      getStageClass(deal?.stage),

    value:
      formatCurrency(deal?.value),

    probability,

    probabilityClass:
      getProbabilityClass(probability),

    expectedClose:
      formatDate(
        deal?.expectedCloseDate
      ),

    lastActivity:
      formatLastActivity(
        deal?.lastActivityAt
      ),
  };
};

// =====================================================
// DEAL LIST
// =====================================================

const DealList = ({
  search = "",
  stage = "",
  value = "",
  closeDate = "",
  sort = "newest",
}) => {
  const [deals, setDeals] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ===================================================
  // FETCH MY DEALS
  // ===================================================

  useEffect(() => {
    let isMounted = true;

    const fetchDeals = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem(
            "businessflow_token"
          );

        if (!token) {
          if (isMounted) {
            setError(
              "Authentication required."
            );
            setLoading(false);
          }

          return;
        }

        // =============================================
        // QUERY PARAMS
        // =============================================

        const params =
          new URLSearchParams();

        params.set("page", "1");
        params.set("limit", "5");

        if (
          typeof search === "string" &&
          search.trim()
        ) {
          params.set(
            "search",
            search.trim()
          );
        }

        if (stage) {
          params.set("stage", stage);
        }

        if (value) {
          params.set("value", value);
        }

        if (closeDate) {
          params.set(
            "closeDate",
            closeDate
          );
        }

        if (sort) {
          params.set("sort", sort);
        }

        // =============================================
        // API REQUEST
        // =============================================

        const response = await fetch(
          `${API_BASE_URL}/api/deals/me?${params.toString()}`,
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

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Unable to load deals."
          );
        }

        const backendDeals =
          result?.data?.deals;

        if (
          !Array.isArray(
            backendDeals
          )
        ) {
          throw new Error(
            "Invalid deals response from server."
          );
        }

        const formattedDeals =
          backendDeals.map(
            formatDealForUI
          );

        if (isMounted) {
          setDeals(
            formattedDeals
          );
        }
      } catch (err) {
        console.error(
          "Employee Deal List Error:",
          err
        );

        if (isMounted) {
          setDeals([]);
          setError(
            err?.message ||
              "Unable to load deals."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDeals();

    return () => {
      isMounted = false;
    };
  }, [
    search,
    stage,
    value,
    closeDate,
    sort,
  ]);

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div
      className="
        mt-4
        w-full
        overflow-hidden
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
        shadow-[0_1px_2px_rgba(15,23,42,0.03)]
      "
    >
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="border-b border-[#DCE5ED] px-4 py-4">
        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          My Deals
        </h2>

        <p
          className="
            mt-1
            text-[7px]
            text-[#718599]
          "
        >
          Deals currently assigned to you
        </p>
      </div>

      {/* =================================================
          LOADING
      ================================================== */}

      {loading && (
        <div
          className="
            flex
            min-h-[180px]
            w-full
            items-center
            justify-center
          "
        >
          <div className="flex items-center gap-2">
            <Loader2
              size={14}
              className="animate-spin text-[#0B3D6B]"
            />

            <span
              className="
                text-[8px]
                font-medium
                text-[#718599]
              "
            >
              Loading deals...
            </span>
          </div>
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================== */}

      {!loading && error && (
        <div
          className="
            flex
            min-h-[180px]
            w-full
            items-center
            justify-center
            px-4
          "
        >
          <p
            className="
              text-center
              text-[8px]
              font-medium
              text-[#D64545]
            "
          >
            {error}
          </p>
        </div>
      )}

      {/* =================================================
          EMPTY
      ================================================== */}

      {!loading &&
        !error &&
        deals.length === 0 && (
          <div
            className="
              flex
              min-h-[180px]
              w-full
              items-center
              justify-center
              px-4
            "
          >
            <div className="text-center">
              <p
                className="
                  text-[9px]
                  font-semibold
                  text-[#17324D]
                "
              >
                No deals found
              </p>

              <p
                className="
                  mt-1
                  text-[7px]
                  text-[#718599]
                "
              >
                No deals are currently assigned
                to you.
              </p>
            </div>
          </div>
        )}

      {/* =================================================
          TABLE
      ================================================== */}

      {!loading &&
        !error &&
        deals.length > 0 && (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              {/* Table Head */}

              <thead>
                <tr className="border-b border-[#DCE5ED] bg-[#FBFCFD]">
                  <th className={headerClass}>
                    Deal
                  </th>

                  <th className={headerClass}>
                    Company
                  </th>

                  <th className={headerClass}>
                    Stage
                  </th>

                  <th
                    className={`${headerClass} text-right`}
                  >
                    Value
                  </th>

                  <th
                    className={`${headerClass} text-center`}
                  >
                    Probability
                  </th>

                  <th className={headerClass}>
                    Expected Close
                  </th>

                  <th className={headerClass}>
                    Last Activity
                  </th>

                  <th
                    className={`${headerClass} text-center`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}

              <tbody>
                {deals.map((deal) => (
                  <DealRow
                    key={deal.id}
                    deal={deal}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

// =====================================================
// DEAL ROW
// =====================================================

const DealRow = ({ deal }) => {
  return (
    <tr
      className="
        border-b
        border-[#E2E9EF]
        last:border-b-0
        hover:bg-[#FAFCFE]
      "
    >
      {/* Deal */}

      <td className={cellClass}>
        <span
          className="
            text-[8px]
            font-semibold
            text-[#17324D]
          "
        >
          {deal.deal}
        </span>
      </td>

      {/* Company */}

      <td className={cellClass}>
        <span
          className="
            text-[7px]
            text-[#60758A]
          "
        >
          {deal.company}
        </span>
      </td>

      {/* Stage */}

      <td className={cellClass}>
        <span
          className={`
            inline-flex
            rounded-[5px]
            px-2
            py-1
            text-[6px]
            font-semibold
            ${deal.stageClass}
          `}
        >
          {deal.stage}
        </span>
      </td>

      {/* Value */}

      <td
        className={`
          ${cellClass}
          text-right
        `}
      >
        <span
          className="
            text-[8px]
            font-bold
            text-[#17324D]
          "
        >
          {deal.value}
        </span>
      </td>

      {/* Probability */}

      <td className={cellClass}>
        <div className="flex flex-col items-center">
          <div
            className="
              h-[4px]
              w-[45px]
              overflow-hidden
              rounded-full
              bg-[#DDE9F5]
            "
          >
            <div
              className={`
                h-full
                rounded-full
                ${deal.probabilityClass}
              `}
              style={{
                width: `${Math.min(
                  Math.max(
                    deal.probability,
                    0
                  ),
                  100
                )}%`,
              }}
            />
          </div>

          <span
            className="
              mt-1
              text-[6px]
              text-[#718599]
            "
          >
            {deal.probability}%
          </span>
        </div>
      </td>

      {/* Expected Close */}

      <td className={cellClass}>
        <span
          className="
            text-[7px]
            text-[#60758A]
          "
        >
          {deal.expectedClose}
        </span>
      </td>

      {/* Last Activity */}

      <td className={cellClass}>
        <span
          className="
            text-[7px]
            text-[#60758A]
          "
        >
          {deal.lastActivity}
        </span>
      </td>

      {/* Actions */}

      <td
        className={`
          ${cellClass}
          text-center
        `}
      >
        <button
          type="button"
          aria-label={`Actions for ${deal.deal}`}
          className="
            inline-flex
            h-6
            w-6
            items-center
            justify-center
            rounded-md
            text-[#718599]
            hover:bg-[#F1F5F9]
            hover:text-[#17324D]
          "
        >
          <MoreHorizontal
            size={13}
            strokeWidth={1.8}
          />
        </button>
      </td>
    </tr>
  );
};

// =====================================================
// TABLE STYLES
// =====================================================

const headerClass = `
  px-3
  py-2.5
  text-left
  text-[7px]
  font-semibold
  capitalize
  text-[#60758A]
`;

const cellClass = `
  px-3
  py-2.5
  align-middle
`;

export default DealList;