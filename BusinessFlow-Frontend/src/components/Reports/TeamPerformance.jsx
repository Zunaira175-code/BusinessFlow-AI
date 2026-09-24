import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

const TeamPerformance = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET AUTH TOKEN
  // =====================================================

  const getToken = () => {
    return (
      localStorage.getItem("businessflow_token") ||
      sessionStorage.getItem("businessflow_token")
    );
  };

  // =====================================================
  // AVATAR STYLES
  // =====================================================

  const avatarStyles = [
    "bg-[#E7EBEF] text-[#294057]",
    "bg-[#E8EEF8] text-[#38628A]",
    "bg-[#E4F5FB] text-[#168BD0]",
    "bg-[#FFF0DC] text-[#E98A00]",
    "bg-[#E6F7EC] text-[#16A05D]",
    "bg-[#FCE8E8] text-[#E35D68]",
  ];

  // =====================================================
  // GET AVATAR STYLE
  // =====================================================

  const getAvatarStyle = (index) => {
    return avatarStyles[
      index % avatarStyles.length
    ];
  };

  // =====================================================
  // GET INITIALS
  // =====================================================

  const getInitials = (firstName, lastName, name) => {
    if (firstName || lastName) {
      return `${firstName?.[0] || ""}${
        lastName?.[0] || ""
      }`.toUpperCase();
    }

    if (name) {
      return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
    }

    return "NA";
  };

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (value) => {
    const amount = Number(value) || 0;

    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }

    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`;
    }

    return `$${amount.toLocaleString()}`;
  };

  // =====================================================
  // FORMAT NUMBER
  // =====================================================

  const formatNumber = (value) => {
    return (Number(value) || 0).toLocaleString();
  };

  // =====================================================
  // FORMAT CONVERSION RATE
  // =====================================================

  const formatConversionRate = (value) => {
    return `${Number(value || 0).toFixed(1)}%`;
  };

  // =====================================================
  // CONVERSION COLOR
  // =====================================================

  const getConversionColor = (value) => {
    const rate = Number(value) || 0;

    if (rate >= 8) {
      return "text-[#16A05D]";
    }

    return "text-[#64798C]";
  };

  // =====================================================
  // FETCH TEAM PERFORMANCE
  // =====================================================

  useEffect(() => {
    const fetchTeamPerformance = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          throw new Error(
            "Authentication token not found. Please login again."
          );
        }

        const response = await fetch(
          `${API_URL}/reports/team-performance?period=30`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let result;

        try {
          result = await response.json();
        } catch {
          throw new Error(
            "The server returned an invalid response."
          );
        }

        if (!response.ok || !result?.success) {
          throw new Error(
            result?.message ||
              "Unable to load team performance."
          );
        }

        const data = Array.isArray(result?.data)
          ? result.data
          : [];

        setTeam(data);
      } catch (error) {
        console.error(
          "Team Performance Error:",
          error
        );

        setError(
          error?.message ||
            "Unable to load team performance."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeamPerformance();
  }, []);

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <section className="w-full overflow-hidden rounded-[9px] border border-[#DCE5EF] bg-white">
        {/* Header */}
        <div className="flex h-[53px] items-center justify-between border-b border-[#DCE5EF] px-4">
          <h2 className="text-[14px] font-bold text-[#102A43]">
            Team Performance
          </h2>

          <button
            type="button"
            className="text-[9px] font-medium text-[#4D6880]"
          >
            View All
          </button>
        </div>

        {/* Table Header */}
        <div className="grid h-[34px] grid-cols-[2.1fr_0.75fr_0.9fr_0.9fr_1fr_0.85fr] items-center border-b border-[#DCE5EF] bg-[#F8FAFC] px-3">
          <span className="text-[8px] font-medium uppercase tracking-[0.04em] text-[#71869A]">
            Employee
          </span>

          <span className="text-center text-[8px] font-medium uppercase tracking-[0.04em] text-[#71869A]">
            Leads
          </span>

          <span className="text-center text-[8px] font-medium uppercase tracking-[0.04em] text-[#71869A]">
            Qualified
          </span>

          <span className="text-center text-[8px] font-medium uppercase tracking-[0.04em] text-[#71869A]">
            Deals Won
          </span>

          <span className="text-center text-[8px] font-medium uppercase tracking-[0.04em] text-[#71869A]">
            Revenue
          </span>

          <span className="text-right text-[8px] font-medium uppercase tracking-[0.04em] text-[#71869A]">
            Conv. Rate
          </span>
        </div>

        {/* Skeleton Rows */}
        {Array.from({ length: 6 }).map(
          (_, index) => (
            <div
              key={index}
              className="grid min-h-[48px] grid-cols-[2.1fr_0.75fr_0.9fr_0.9fr_1fr_0.85fr] items-center border-b border-[#E3EAF1] px-3 last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <div className="h-[23px] w-[23px] animate-pulse rounded-full bg-[#E8EEF4]" />

                <div>
                  <div className="h-[8px] w-24 animate-pulse rounded bg-[#E8EEF4]" />

                  <div className="mt-1 h-[6px] w-16 animate-pulse rounded bg-[#EEF2F5]" />
                </div>
              </div>

              <div className="mx-auto h-[8px] w-8 animate-pulse rounded bg-[#EEF2F5]" />

              <div className="mx-auto h-[8px] w-8 animate-pulse rounded bg-[#EEF2F5]" />

              <div className="mx-auto h-[8px] w-8 animate-pulse rounded bg-[#EEF2F5]" />

              <div className="mx-auto h-[8px] w-12 animate-pulse rounded bg-[#EEF2F5]" />

              <div className="ml-auto h-[8px] w-10 animate-pulse rounded bg-[#EEF2F5]" />
            </div>
          )
        )}
      </section>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {
    return (
      <section className="w-full overflow-hidden rounded-[9px] border border-[#DCE5EF] bg-white">
        {/* Header */}
        <div className="flex h-[53px] items-center justify-between border-b border-[#DCE5EF] px-4">
          <h2 className="text-[14px] font-bold text-[#102A43]">
            Team Performance
          </h2>

          <button
            type="button"
            className="text-[9px] font-medium text-[#4D6880]"
          >
            View All
          </button>
        </div>

        <div className="flex min-h-[180px] items-center justify-center px-4 text-center">
          <div>
            <p className="text-[10px] font-semibold text-[#B42318]">
              Unable to load team performance
            </p>

            <p className="mt-1 text-[8px] text-[#71869A]">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (!team.length) {
    return (
      <section className="w-full overflow-hidden rounded-[9px] border border-[#DCE5EF] bg-white">
        {/* Header */}
        <div className="flex h-[53px] items-center justify-between border-b border-[#DCE5EF] px-4">
          <h2 className="text-[14px] font-bold text-[#102A43]">
            Team Performance
          </h2>

          <button
            type="button"
            className="text-[9px] font-medium text-[#4D6880]"
          >
            View All
          </button>
        </div>

        <div className="flex min-h-[180px] items-center justify-center">
          <p className="text-[10px] text-[#8293A3]">
            No team performance data available.
          </p>
        </div>
      </section>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <section className="w-full overflow-hidden rounded-[9px] border border-[#DCE5EF] bg-white">
      {/* Header */}
      <div className="flex h-[53px] items-center justify-between border-b border-[#DCE5EF] px-4">
        <h2 className="text-[14px] font-bold text-[#102A43]">
          Team Performance
        </h2>

        <button
          type="button"
          className="text-[9px] font-medium text-[#4D6880] hover:text-[#102A43]"
        >
          View All
        </button>
      </div>

      {/* Table Header */}
      <div className="grid h-[34px] grid-cols-[2.1fr_0.75fr_0.9fr_0.9fr_1fr_0.85fr] items-center border-b border-[#DCE5EF] bg-[#F8FAFC] px-3">
        <span className="text-[8px] font-medium uppercase tracking-[0.04em] text-[#71869A]">
          Employee
        </span>

        <span className="text-center text-[8px] font-medium uppercase tracking-[0.04em] text-[#71869A]">
          Leads
        </span>

        <span className="text-center text-[8px] font-medium uppercase tracking-[0.04em] text-[#71869A]">
          Qualified
        </span>

        <span className="text-center text-[8px] font-medium uppercase tracking-[0.04em] text-[#71869A]">
          Deals Won
        </span>

        <span className="text-center text-[8px] font-medium uppercase tracking-[0.04em] text-[#71869A]">
          Revenue
        </span>

        <span className="text-right text-[8px] font-medium uppercase tracking-[0.04em] text-[#71869A]">
          Conv. Rate
        </span>
      </div>

      {/* Rows */}
      {team.map((member, index) => {
        const name =
          member.name ||
          `${member.firstName || ""} ${
            member.lastName || ""
          }`.trim() ||
          "Unknown Employee";

        const role =
          member.jobTitle ||
          member.department ||
          "Employee";

        const initials = getInitials(
          member.firstName,
          member.lastName,
          name
        );

        return (
          <div
            key={
              member.employeeId ||
              member._id ||
              name
            }
            className="grid min-h-[48px] grid-cols-[2.1fr_0.75fr_0.9fr_0.9fr_1fr_0.85fr] items-center border-b border-[#E3EAF1] px-3 last:border-b-0"
          >
            {/* Employee */}
            <div className="flex min-w-0 items-center gap-2">
              <div
                className={`flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${getAvatarStyle(
                  index
                )}`}
              >
                {initials}
              </div>

              <div className="min-w-0">
                <p className="truncate text-[9px] font-medium leading-[12px] text-[#172F46]">
                  {name}
                </p>

                <p className="truncate text-[7px] leading-[10px] text-[#8192A2]">
                  {role}
                </p>
              </div>
            </div>

            {/* Leads */}
            <span className="text-center text-[9px] text-[#17324D]">
              {formatNumber(member.leads)}
            </span>

            {/* Qualified */}
            <span className="text-center text-[9px] text-[#17324D]">
              {formatNumber(
                member.qualifiedLeads
              )}
            </span>

            {/* Deals Won */}
            <span className="text-center text-[9px] text-[#17324D]">
              {formatNumber(
                member.wonDeals
              )}
            </span>

            {/* Revenue */}
            <span className="text-center text-[9px] font-bold text-[#102A43]">
              {formatCurrency(
                member.revenue
              )}
            </span>

            {/* Conversion */}
            <span
              className={`text-right text-[9px] font-medium ${getConversionColor(
                member.conversionRate
              )}`}
            >
              {formatConversionRate(
                member.conversionRate
              )}
            </span>
          </div>
        );
      })}
    </section>
  );
};

export default TeamPerformance;