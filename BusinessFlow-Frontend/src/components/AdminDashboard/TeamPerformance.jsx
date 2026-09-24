import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Card from "../common/Card";
import Avatar from "../common/Avatar";

const API_URL = "http://localhost:5000/api";

// =====================================================
// HELPERS
// =====================================================

const formatRevenue = (value) => {
  const amount = Number(value) || 0;

  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }

  if (amount >= 1000) {
    return `$${Math.round(amount / 1000)}k`;
  }

  return `$${amount.toLocaleString()}`;
};

const getInitials = (name) => {
  if (!name) {
    return "U";
  }

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
};

// =====================================================
// TEAM PERFORMANCE
// =====================================================

const TeamPerformance = () => {
  const [team, setTeam] = useState([]);
  const [period, setPeriod] = useState("This Month");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH TEAM PERFORMANCE
  // =====================================================

  const fetchTeamPerformance = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem(
          "businessflow_token"
        );

        if (!token) {
          throw new Error(
            "Authentication required. Please login again."
          );
        }

        const response = await fetch(
          `${API_URL}/admin/dashboard/team-performance`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let result = null;

        try {
          result = await response.json();
        } catch {
          result = null;
        }

        if (!response.ok) {
          throw new Error(
            result?.message ||
              `Request failed with status ${response.status}`
          );
        }

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Unable to load team performance."
          );
        }

        const teamData = result?.data?.team;

        setTeam(
          Array.isArray(teamData)
            ? teamData
            : []
        );

        setPeriod(
          result?.data?.period ||
            "This Month"
        );
      } catch (err) {
        console.error(
          "Team Performance Error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load team performance."
        );

        setTeam([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchTeamPerformance();
  }, [fetchTeamPerformance]);

  // =====================================================
  // VISIBLE TEAM MEMBERS
  // =====================================================

  const visibleTeam = team.slice(0, 5);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Card className="h-[330px] overflow-hidden">

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          flex
          h-[55px]
          items-center
          justify-between
          border-b
          border-[#DCE5ED]
          px-[14px]
        "
      >
        <h2
          className="
            text-[13px]
            font-bold
            tracking-[-0.1px]
            text-[#102F4A]
          "
        >
          Team Performance
        </h2>

        <span
          className="
            rounded-[5px]
            bg-[#F6F8FA]
            px-[7px]
            py-[5px]
            text-[8px]
            font-medium
            text-[#6E8091]
          "
        >
          {period}
        </span>
      </div>

      {/* =================================================
          TABLE HEADER
      ================================================= */}

      <div
        className="
          grid
          grid-cols-[1.3fr_0.8fr_0.8fr]
          items-center
          border-b
          border-[#DCE5ED]
          px-[12px]
          py-[8px]
        "
      >
        <span
          className="
            text-[8px]
            font-semibold
            tracking-[0.4px]
            text-[#65798B]
          "
        >
          REP
        </span>

        <span
          className="
            text-right
            text-[8px]
            font-semibold
            tracking-[0.4px]
            text-[#65798B]
          "
        >
          REV
        </span>

        <span
          className="
            text-right
            text-[8px]
            font-semibold
            tracking-[0.4px]
            text-[#65798B]
          "
        >
          CONV.
        </span>
      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div>
          {Array.from({ length: 5 }).map(
            (_, index) => (
              <div
                key={index}
                className="
                  grid
                  h-[43px]
                  animate-pulse
                  grid-cols-[1.3fr_0.8fr_0.8fr]
                  items-center
                  border-b
                  border-[#E3E9EE]
                  px-[12px]
                "
              >
                {/* User Skeleton */}

                <div className="flex items-center gap-2">
                  <div
                    className="
                      h-[27px]
                      w-[27px]
                      rounded-full
                      bg-[#EEF2F6]
                    "
                  />

                  <div>
                    <div
                      className="
                        h-[8px]
                        w-[65px]
                        rounded
                        bg-[#EEF2F6]
                      "
                    />

                    <div
                      className="
                        mt-[5px]
                        h-[6px]
                        w-[42px]
                        rounded
                        bg-[#F2F5F8]
                      "
                    />
                  </div>
                </div>

                {/* Revenue Skeleton */}

                <div className="flex justify-end">
                  <div
                    className="
                      h-[8px]
                      w-[35px]
                      rounded
                      bg-[#EEF2F6]
                    "
                  />
                </div>

                {/* Conversion Skeleton */}

                <div className="flex justify-end">
                  <div
                    className="
                      h-[8px]
                      w-[25px]
                      rounded
                      bg-[#EEF2F6]
                    "
                  />
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading && error && (
        <div
          className="
            flex
            h-[274px]
            flex-col
            items-center
            justify-center
            px-4
            text-center
          "
        >
          <p
            className="
              text-[11px]
              font-semibold
              text-[#102F4A]
            "
          >
            Unable to load team
          </p>

          <p
            className="
              mt-1
              max-w-[220px]
              text-[9px]
              font-medium
              text-[#8A99A7]
            "
          >
            {error}
          </p>

          <button
            type="button"
            onClick={fetchTeamPerformance}
            className="
              mt-3
              rounded-[7px]
              border
              border-[#D8E4EF]
              px-3
              py-2
              text-[9px]
              font-semibold
              text-[#315D80]
              transition
              hover:bg-[#F4F7FA]
            "
          >
            Retry
          </button>
        </div>
      )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        !error &&
        team.length === 0 && (
          <div
            className="
              flex
              h-[274px]
              items-center
              justify-center
              px-4
              text-center
            "
          >
            <div>
              <p
                className="
                  text-[11px]
                  font-semibold
                  text-[#102F4A]
                "
              >
                No team performance
              </p>

              <p
                className="
                  mt-1
                  text-[9px]
                  font-medium
                  text-[#8A99A7]
                "
              >
                Team sales activity will
                appear here.
              </p>
            </div>
          </div>
        )}

      {/* =================================================
          TEAM ROWS
      ================================================= */}

      {!loading &&
        !error &&
        visibleTeam.length > 0 && (
          <div>
            {visibleTeam.map(
              (member, index) => {
                const deals =
                  Number(member.deals) || 0;

                const revenue =
                  Number(member.revenue) || 0;

                const conversion =
                  Number(
                    member.conversion
                  ) || 0;

                const progress =
                  Math.min(
                    Number(
                      member.progress
                    ) || 0,
                    100
                  );

                return (
                  <div
                    key={
                      member.id ||
                      member.email ||
                      member.name
                    }
                    className={`
                      grid
                      h-[43px]
                      grid-cols-[1.3fr_0.8fr_0.8fr]
                      items-center
                      px-[12px]
                      ${
                        index !==
                        visibleTeam.length - 1
                          ? "border-b border-[#E3E9EE]"
                          : ""
                      }
                    `}
                  >

                    {/* =====================================
                        REP
                    ===================================== */}

                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-2
                      "
                    >
                      {member.avatar ? (
                        <Avatar
                          src={member.avatar}
                          alt={
                            member.name ||
                            "User"
                          }
                          size="sm"
                        />
                      ) : (
                        <div
                          className="
                            flex
                            h-[27px]
                            w-[27px]
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-[#D8E4EF]
                            bg-[#EEF4FA]
                            text-[8px]
                            font-bold
                            text-[#315D80]
                          "
                        >
                          {getInitials(
                            member.name
                          )}
                        </div>
                      )}

                      <div className="min-w-0">

                        <p
                          className="
                            truncate
                            text-[9px]
                            font-bold
                            leading-[11px]
                            text-[#29445C]
                          "
                        >
                          {member.name ||
                            "Unknown User"}
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[7px]
                            font-medium
                            leading-[9px]
                            text-[#8493A1]
                          "
                        >
                          {deals}{" "}
                          {deals === 1
                            ? "Deal"
                            : "Deals"}
                        </p>

                      </div>
                    </div>

                    {/* =====================================
                        REVENUE
                    ===================================== */}

                    <div className="text-right">
                      <span
                        className="
                          text-[9px]
                          font-bold
                          text-[#29445C]
                        "
                      >
                        {formatRevenue(
                          revenue
                        )}
                      </span>
                    </div>

                    {/* =====================================
                        CONVERSION
                    ===================================== */}

                    <div className="pl-2">

                      <div className="flex items-center justify-end">
                        <span
                          className="
                            text-[8px]
                            font-semibold
                            text-[#6E8192]
                          "
                        >
                          {conversion}%
                        </span>
                      </div>

                      <div
                        className="
                          mt-1
                          ml-auto
                          h-[4px]
                          w-[38px]
                          overflow-hidden
                          rounded-full
                          bg-[#E8EEF3]
                        "
                      >
                        <div
                          className={`
                            h-full
                            rounded-full
                            ${
                              progress >= 25
                                ? "bg-[#18A957]"
                                : progress >= 15
                                  ? "bg-[#E88918]"
                                  : "bg-[#EF4444]"
                            }
                          `}
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>

                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
    </Card>
  );
};

export default TeamPerformance;