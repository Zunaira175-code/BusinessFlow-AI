import { useEffect, useMemo, useState } from "react";
import Card from "../common/Card";

const API_URL = "http://localhost:5000/api";

const STAGE_CONFIG = [
  {
    key: "appointmentscheduled",
    title: "DISCOVERY",
  },
  {
    key: "qualifiedtobuy",
    title: "QUALIFICATION",
  },
  {
    key: "presentationscheduled",
    title: "PROPOSAL",
  },
  {
    key: "decisionmakerboughtin",
    title: "NEGOTIATION",
  },
  {
    key: "closedwon",
    title: "CLOSED WON",
  },
  {
    key: "closedlost",
    title: "CLOSED LOST",
  },
];

const formatCurrency = (value) => {
  const amount = Number(value) || 0;

  return `$${amount.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;
};

const formatCloseDate = (date) => {
  if (!date) {
    return "No close date";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "No close date";
  }

  return `Close: ${parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;
};

const getDealDot = (deal) => {
  const stage = deal?.properties?.dealstage;

  if (stage === "closedwon") {
    return "bg-[#16A34A]";
  }

  if (stage === "closedlost") {
    return "bg-[#EF4444]";
  }

  if (stage === "decisionmakerboughtin") {
    return "bg-[#F59E0B]";
  }

  return "bg-[#3B82F6]";
};

const getDealName = (deal) => {
  return (
    deal?.properties?.dealname ||
    "Unnamed Deal"
  );
};

const getDealAmount = (deal) => {
  return Number(
    deal?.properties?.amount
  ) || 0;
};

const getDealStage = (deal) => {
  return (
    deal?.properties?.dealstage ||
    ""
  );
};

const getDealCloseDate = (deal) => {
  return (
    deal?.properties?.closedate ||
    null
  );
};

const DealsPipeline = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem(
    "businessflow_token"
  );

  // =====================================================
  // FETCH HUBSPOT DEALS
  // =====================================================

  useEffect(() => {
    const fetchPipelineData = async () => {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          throw new Error(
            "Authentication token not found."
          );
        }

        const response = await fetch(
          `${API_URL}/integrations/hubspot/deals?limit=100`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        let result;

        try {
          result = await response.json();
        } catch {
          throw new Error(
            "Invalid response received while fetching HubSpot deals."
          );
        }

        if (
          !response.ok ||
          !result?.success
        ) {
          throw new Error(
            result?.message ||
              "Unable to fetch HubSpot deals."
          );
        }

        setDeals(
          result?.data?.deals || []
        );
      } catch (err) {
        console.error(
          "HubSpot Deals Pipeline Error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load HubSpot deals. Please try again."
        );

        setDeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPipelineData();
  }, [token]);

  // =====================================================
  // CREATE PIPELINE COLUMNS
  // =====================================================

  const pipelineColumns = useMemo(() => {
    return STAGE_CONFIG.map((stage) => {
      const stageDeals = deals.filter(
        (deal) =>
          getDealStage(deal) === stage.key
      );

      const total = stageDeals.reduce(
        (sum, deal) =>
          sum + getDealAmount(deal),
        0
      );

      return {
        key: stage.key,
        title: stage.title,
        count: stageDeals.length,
        total,
        deals: stageDeals,
      };
    });
  }, [deals]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="mt-4 w-full">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {STAGE_CONFIG.slice(0, 3).map(
            (column) => (
              <Card
                key={column.key}
                className="
                  min-h-[365px]
                  rounded-[9px]
                  border
                  border-[#DCE5EE]
                  bg-[#F9FBFD]
                  p-[12px]
                  shadow-none
                "
              >
                <div className="animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-20 rounded bg-[#E5EDF5]" />

                    <div className="h-[22px] w-[22px] rounded-full bg-[#E5EDF5]" />
                  </div>

                  <div className="mt-[18px] h-3 w-24 rounded bg-[#E5EDF5]" />

                  <div className="mt-[18px] h-[105px] rounded-[6px] bg-white">
                    <div className="p-3">
                      <div className="h-3 w-40 rounded bg-[#E5EDF5]" />

                      <div className="mt-2 h-2.5 w-28 rounded bg-[#EDF2F7]" />

                      <div className="mt-4 h-3 w-20 rounded bg-[#E5EDF5]" />
                    </div>
                  </div>
                </div>
              </Card>
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
      <section className="mt-4 w-full">
        <Card
          className="
            rounded-[9px]
            border
            border-[#FECACA]
            bg-[#FEF2F2]
            p-4
            shadow-none
          "
        >
          <p className="text-[11px] font-medium text-[#B42318]">
            {error}
          </p>
        </Card>
      </section>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="mt-4 w-full">
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        {pipelineColumns
          .slice(0, 3)
          .map((column) => {
            const firstDeal =
              column.deals[0];

            return (
              <Card
                key={column.key}
                className="
                  min-h-[365px]
                  rounded-[9px]
                  border
                  border-[#DCE5EE]
                  bg-[#F9FBFD]
                  p-[12px]
                  shadow-none
                "
              >
                {/* =================================================
                    COLUMN HEADER
                ================================================= */}

                <div className="flex items-center justify-between">
                  <h3
                    className="
                      text-[12px]
                      font-medium
                      tracking-[0.3px]
                      text-[#183B5A]
                    "
                  >
                    {column.title}
                  </h3>

                  <span
                    className="
                      flex
                      h-[22px]
                      w-[22px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#DCEAFE]
                      text-[11px]
                      font-semibold
                      text-[#174A78]
                    "
                  >
                    {column.count}
                  </span>
                </div>

                {/* =================================================
                    PIPELINE TOTAL
                ================================================= */}

                <p
                  className="
                    mt-[18px]
                    text-[12px]
                    font-medium
                    text-[#61778B]
                  "
                >
                  {formatCurrency(
                    column.total
                  )}
                </p>

                {/* =================================================
                    DEAL CARD
                ================================================= */}

                {firstDeal ? (
                  <div
                    className="
                      relative
                      mt-[18px]
                      min-h-[105px]
                      rounded-[6px]
                      border
                      border-[#DCE5EE]
                      bg-white
                      px-[12px]
                      py-[11px]
                      shadow-[0_1px_3px_rgba(15,42,66,0.04)]
                    "
                  >
                    {/* Status Dot */}

                    <span
                      className={`
                        absolute
                        right-[-1px]
                        top-[-1px]
                        h-[7px]
                        w-[7px]
                        rounded-full
                        ${getDealDot(
                          firstDeal
                        )}
                      `}
                    />

                    {/* Deal Title */}

                    <h4
                      className="
                        pr-[10px]
                        text-[12px]
                        font-medium
                        leading-[16px]
                        text-[#173B5C]
                      "
                    >
                      {getDealName(
                        firstDeal
                      )}
                    </h4>

                    {/* HubSpot Deal ID */}

                    <p
                      className="
                        mt-[3px]
                        text-[10px]
                        font-medium
                        text-[#72879A]
                      "
                    >
                      HubSpot Deal #
                      {firstDeal.id}
                    </p>

                    {/* Value */}

                    <p
                      className="
                        mt-[10px]
                        text-[12px]
                        font-medium
                        text-[#183B5A]
                      "
                    >
                      {formatCurrency(
                        getDealAmount(
                          firstDeal
                        )
                      )}
                    </p>

                    {/* Bottom */}

                    <div className="mt-[2px] flex items-end justify-between">
                      <p
                        className="
                          text-[11px]
                          font-medium
                          text-[#7A8D9E]
                        "
                      >
                        {formatCloseDate(
                          getDealCloseDate(
                            firstDeal
                          )
                        )}
                      </p>

                      <span
                        className="
                          flex
                          h-[18px]
                          min-w-[18px]
                          items-center
                          justify-center
                          rounded-full
                          bg-[#DCE8FA]
                          px-1
                          text-[7px]
                          font-medium
                          text-[#7190B1]
                        "
                        title={
                          firstDeal
                            ?.properties
                            ?.hubspot_owner_id ||
                          "HubSpot"
                        }
                      >
                        HS
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    className="
                      mt-[18px]
                      flex
                      min-h-[105px]
                      items-center
                      justify-center
                      rounded-[6px]
                      border
                      border-dashed
                      border-[#DCE5EE]
                      bg-white
                    "
                  >
                    <p className="text-[10px] text-[#91A2B2]">
                      No deals in this stage
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
      </div>
    </section>
  );
};

export default DealsPipeline;