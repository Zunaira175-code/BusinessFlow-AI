import { useEffect, useState } from "react";
import {
  ArrowRight,
} from "lucide-react";

/* =========================================================
   API
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

/* =========================================================
   PIPELINE DESIGN
========================================================= */

const pipelineConfig = [
  {
    name: "New",
    className: "bg-[#DCEAFF] text-[#17324D]",
    countClassName:
      "bg-white text-[#17324D]",
  },
  {
    name: "Contacted",
    className: "bg-[#BFD6FA] text-[#17324D]",
    countClassName:
      "bg-white text-[#17324D]",
  },
  {
    name: "Qualified",
    className: "bg-[#A9CFFF] text-[#17324D]",
    countClassName:
      "bg-white text-[#17324D]",
  },
  {
    name: "Proposal",
    className: "bg-[#FFE18A] text-[#8A5600]",
    countClassName:
      "bg-white text-[#8A5600]",
  },
  {
    name: "Converted",
    className: "bg-[#B8F0D0] text-[#187A43]",
    countClassName:
      "bg-white text-[#187A43]",
  },
];

/* =========================================================
   LEAD PIPELINE
========================================================= */

const LeadPipeline = () => {
  const [pipelineStages, setPipelineStages] =
    useState(
      pipelineConfig.map((stage) => ({
        ...stage,
        count: 0,
      }))
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =========================================================
     FETCH PIPELINE
  ========================================================= */

  useEffect(() => {
    let isMounted = true;

    const fetchPipeline = async () => {
      try {
        setLoading(true);
        setError("");

        /* =====================================================
           AUTH TOKEN
        ===================================================== */

        const token =
          localStorage.getItem(
            "businessflow_token"
          );

        if (!token) {
          throw new Error(
            "Authentication token not found."
          );
        }

        /* =====================================================
           API REQUEST
        ===================================================== */

        const response =
          await fetch(
            `${API_BASE_URL}/api/leads/me/pipeline`,
            {
              method: "GET",

              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type":
                  "application/json",
              },
            }
          );

        const result =
          await response.json();

        /* =====================================================
           API ERROR
        ===================================================== */

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Unable to fetch lead pipeline."
          );
        }

        if (
          !result?.success ||
          !result?.data
        ) {
          throw new Error(
            "Invalid lead pipeline response."
          );
        }

        /* =====================================================
           BACKEND STAGES
        ===================================================== */

        const backendStages =
          Array.isArray(
            result.data.stages
          )
            ? result.data.stages
            : [];

        /* =====================================================
           MERGE API DATA WITH DESIGN
        ===================================================== */

        const mergedStages =
          pipelineConfig.map(
            (configStage) => {
              const backendStage =
                backendStages.find(
                  (stage) =>
                    stage.name ===
                    configStage.name
                );

              return {
                ...configStage,

                count:
                  Number(
                    backendStage?.count
                  ) || 0,
              };
            }
          );

        if (isMounted) {
          setPipelineStages(
            mergedStages
          );
        }
      } catch (err) {
        console.error(
          "Employee Lead Pipeline Error:",
          err
        );

        if (isMounted) {
          setError(
            err.message ||
              "Unable to load pipeline."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPipeline();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =========================================================
     DISPLAY COUNT
  ========================================================= */

  const displayCount = (count) => {
    if (loading) {
      return "—";
    }

    return count;
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className="
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

      <div
        className="
          px-4
          pb-3
          pt-3
        "
      >
        <div className="flex items-center justify-between">
          <h2
            className="
              text-[13px]
              font-bold
              text-[#17324D]
            "
          >
            My Lead Pipeline
          </h2>

          {/* Small loading indicator */}

          {loading && (
            <span
              className="
                h-3
                w-3
                animate-spin
                rounded-full
                border
                border-[#BFD6FA]
                border-t-[#315D80]
              "
            />
          )}
        </div>
      </div>

      {/* =================================================
          PIPELINE
      ================================================== */}

      <div
        className="
          flex
          items-center
          gap-1
          overflow-x-auto
          px-4
          pb-4
        "
      >
        {pipelineStages.map(
          (stage, index) => (
            <div
              key={stage.name}
              className="
                flex
                min-w-0
                flex-1
                items-center
              "
            >
              {/* =================================================
                  STAGE
              ================================================== */}

              <div
                className={`
                  flex
                  h-[36px]
                  min-w-0
                  flex-1
                  items-center
                  justify-between
                  gap-2
                  rounded-[6px]
                  px-3
                  ${stage.className}
                `}
              >
                <span
                  className="
                    truncate
                    text-[8px]
                    font-semibold
                  "
                >
                  {stage.name}
                </span>

                {/* =================================================
                    COUNT
                ================================================== */}

                <span
                  className={`
                    flex
                    h-[19px]
                    min-w-[19px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[5px]
                    px-1
                    text-[7px]
                    font-bold
                    ${stage.countClassName}
                  `}
                >
                  {displayCount(
                    stage.count
                  )}
                </span>
              </div>

              {/* =================================================
                  ARROW
              ================================================== */}

              {index <
                pipelineStages.length -
                  1 && (
                <ArrowRight
                  size={18}
                  strokeWidth={1.5}
                  className="
                    mx-1
                    shrink-0
                    text-[#AFC7DE]
                  "
                />
              )}
            </div>
          )
        )}
      </div>

      {/* =================================================
          ERROR MESSAGE
      ================================================== */}

      {error && (
        <div
          className="
            px-4
            pb-3
            text-[7px]
            font-medium
            text-[#DC2626]
          "
        >
          Unable to load lead pipeline.
        </div>
      )}
    </div>
  );
};

export default LeadPipeline;