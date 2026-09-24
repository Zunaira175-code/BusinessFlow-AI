import { useEffect, useMemo, useState } from "react";

const LeadConversionFunnel = () => {
  const [funnelData, setFunnelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH LEAD FUNNEL
  // =====================================================

  const fetchLeadFunnel = async () => {
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
        "http://localhost:5000/api/reports/lead-funnel?period=30",
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
            "Unable to load lead conversion funnel."
        );
      }

      setFunnelData(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (err) {
      console.error(
        "Lead Conversion Funnel Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load lead conversion funnel."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchLeadFunnel();
  }, []);

  // =====================================================
  // FUNNEL DISPLAY DATA
  // =====================================================

  const funnel = useMemo(() => {
    const stageOrder = [
      {
        apiStage: "New",
        label: "New",
        className: "bg-[#0B3155]",
      },
      {
        apiStage: "Contacted",
        label: "Contacted",
        className: "bg-[#234D76]",
      },
      {
        apiStage: "Qualified",
        label: "Qualified",
        className: "bg-[#496984]",
      },
      {
        apiStage: "Proposal Sent",
        label: "Proposal",
        className: "bg-[#607990]",
      },
      {
        apiStage: "Converted",
        label: "Won",
        className: "bg-[#71879B]",
      },
    ];

    const values =
      stageOrder.map(
        (stage) => {
          const found =
            funnelData.find(
              (item) =>
                item.stage ===
                stage.apiStage
            );

          return {
            ...stage,
            value: Number(
              found?.count || 0
            ),
            revenue: Number(
              found?.value || 0
            ),
          };
        }
      );

    const maxValue =
      Math.max(
        ...values.map(
          (item) => item.value
        ),
        1
      );

    return values.map(
      (item, index) => {
        const calculatedWidth =
          index === 0
            ? 100
            : Math.max(
                (item.value /
                  maxValue) *
                  100,
                20
              );

        return {
          ...item,
          width: `${calculatedWidth}%`,
        };
      }
    );
  }, [funnelData]);

  // =====================================================
  // CONVERSION RATE
  // =====================================================

  const conversionRate =
    useMemo(() => {
      const newLeads =
        funnelData.find(
          (item) =>
            item.stage === "New"
        )?.count || 0;

      const convertedLeads =
        funnelData.find(
          (item) =>
            item.stage ===
            "Converted"
        )?.count || 0;

      if (!newLeads) {
        return 0;
      }

      return (
        (convertedLeads /
          newLeads) *
        100
      ).toFixed(1);
    }, [funnelData]);

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <section
        className="
          h-[238px]
          rounded-[9px]
          border
          border-[#DCE5ED]
          bg-white
          p-4
        "
      >
        <div className="h-3 w-32 animate-pulse rounded bg-[#E8EEF3]" />

        <div className="mt-4 flex flex-col items-center gap-[3px]">
          {[100, 88, 72, 60, 48].map(
            (width, index) => (
              <div
                key={index}
                className="
                  h-[25px]
                  animate-pulse
                  rounded-[4px]
                  bg-[#E8EEF3]
                "
                style={{
                  width: `${width}%`,
                }}
              />
            )
          )}
        </div>

        <div className="mt-[7px] border-t border-[#DCE5ED] pt-3">
          <div className="mx-auto h-2 w-32 animate-pulse rounded bg-[#E8EEF3]" />
        </div>
      </section>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {
    return (
      <section
        className="
          h-[238px]
          rounded-[9px]
          border
          border-[#DCE5ED]
          bg-white
          p-4
        "
      >
        <h2 className="text-[13px] font-bold text-[#17324D]">
          Lead Conversion Funnel
        </h2>

        <div className="flex h-[175px] flex-col items-center justify-center gap-2">
          <p className="text-center text-[8px] text-[#D64545]">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchLeadFunnel}
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
  // EMPTY STATE
  // =====================================================

  if (!funnelData.length) {
    return (
      <section
        className="
          h-[238px]
          rounded-[9px]
          border
          border-[#DCE5ED]
          bg-white
          p-4
        "
      >
        <h2 className="text-[13px] font-bold text-[#17324D]">
          Lead Conversion Funnel
        </h2>

        <div className="flex h-[175px] items-center justify-center">
          <p className="text-[8px] text-[#7A8B9A]">
            No lead funnel data available.
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
        h-[238px]
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

      <h2 className="text-[13px] font-bold text-[#17324D]">
        Lead Conversion Funnel
      </h2>

      {/* =================================================
          FUNNEL
      ================================================= */}

      <div className="mt-4 flex flex-col items-center gap-[3px]">
        {funnel.map((item) => (
          <div
            key={item.apiStage}
            className={`
              flex
              h-[25px]
              items-center
              justify-between
              rounded-[4px]
              px-3
              text-[8px]
              font-semibold
              text-white
              transition-all
              duration-300
              ${item.className}
            `}
            style={{
              width: item.width,
            }}
            title={`${item.label}: ${item.value} leads`}
          >
            <span>
              {item.label}
            </span>

            <span>
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="mt-[7px] border-t border-[#DCE5ED] pt-3 text-center">
        <p className="text-[7px] text-[#7A8B9A]">
          Lead conversion rate:{" "}
          <span className="font-semibold text-[#17324D]">
            {conversionRate}%
          </span>
        </p>
      </div>
    </section>
  );
};

export default LeadConversionFunnel;