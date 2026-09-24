import { useEffect, useState } from "react";

import {
  UsersRound,
  Sparkles,
  BadgeCheck,
  CalendarCheck,
  TrendingUp,
  Clock3,
} from "lucide-react";

/* =========================================================
   API
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

/* =========================================================
   EMPLOYEE LEAD STATS
========================================================= */

const LeadStats = () => {
  const [stats, setStats] = useState({
    myLeads: {
      value: 0,
      newThisWeek: 0,
    },

    newLeads: {
      value: 0,
    },

    qualifiedLeads: {
      value: 0,
      percentage: 0,
    },

    followUpsDue: {
      value: 0,
      today: 0,
    },
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =========================================================
     FETCH STATS
  ========================================================= */

  useEffect(() => {
    let isMounted = true;

    const fetchLeadStats = async () => {
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

        const response =
          await fetch(
            `${API_BASE_URL}/api/leads/me/stats`,
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

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Unable to fetch lead statistics."
          );
        }

        if (
          !result?.success ||
          !result?.data
        ) {
          throw new Error(
            "Invalid lead statistics response."
          );
        }

        if (isMounted) {
          setStats(result.data);
        }
      } catch (err) {
        console.error(
          "Employee Lead Stats Error:",
          err
        );

        if (isMounted) {
          setError(
            err.message ||
              "Unable to load lead statistics."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLeadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =========================================================
     STAT CONFIG
  ========================================================= */

  const statCards = [
    {
      title: "MY LEADS",

      value:
        stats.myLeads?.value ?? 0,

      footer: `${
        stats.myLeads?.newThisWeek ?? 0
      } new this week`,

      footerType: "info",

      icon: UsersRound,
    },

    {
      title: "NEW LEADS",

      value:
        stats.newLeads?.value ?? 0,

      footer: "New this week",

      footerType: "success",

      icon: Sparkles,
    },

    {
      title: "QUALIFIED LEADS",

      value:
        stats.qualifiedLeads?.value ?? 0,

      footer: `${
        stats.qualifiedLeads?.percentage ?? 0
      }% conversion potential`,

      footerType: "default",

      icon: BadgeCheck,
    },

    {
      title: "FOLLOW-UPS DUE",

      value:
        stats.followUpsDue?.value ?? 0,

      footer: `${
        stats.followUpsDue?.today ?? 0
      } due today`,

      footerType: "danger",

      icon: CalendarCheck,
    },
  ];

  /* =========================================================
     LOADING VALUE
  ========================================================= */

  const displayValue = (value) => {
    if (loading) {
      return "—";
    }

    return value;
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className="
        grid
        w-full
        grid-cols-1
        gap-3
        sm:grid-cols-2
        lg:grid-cols-4
      "
    >
      {statCards.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
              relative
              min-h-[94px]
              overflow-hidden
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
                TOP
            ================================================== */}

            <div className="flex items-start justify-between">
              <p
                className="
                  text-[8px]
                  font-semibold
                  tracking-[0.35px]
                  text-[#718599]
                "
              >
                {stat.title}
              </p>

              {/* Background Icon */}

              <Icon
                size={31}
                strokeWidth={1.4}
                className={`
                  absolute
                  right-3
                  top-3
                  opacity-[0.10]

                  ${
                    stat.footerType ===
                    "danger"
                      ? "text-[#F59E0B]"
                      : stat.footerType ===
                        "success"
                      ? "text-[#20A65A]"
                      : "text-[#315D80]"
                  }
                `}
              />
            </div>

            {/* =================================================
                VALUE
            ================================================== */}

            <p
              className={`
                mt-2
                text-[25px]
                font-bold
                leading-none
                tracking-[-0.6px]

                ${
                  stat.footerType ===
                  "danger"
                    ? "text-[#EF4444]"
                    : "text-[#0B2947]"
                }
              `}
            >
              {displayValue(
                stat.value
              )}
            </p>

            {/* =================================================
                FOOTER
            ================================================== */}

            <div className="mt-2.5">
              {stat.footerType ===
                "info" && (
                <span
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    bg-[#E4EEFF]
                    px-1.5
                    py-[2px]
                    text-[7px]
                    font-semibold
                    text-[#245A9C]
                  "
                >
                  {stat.footer}
                </span>
              )}

              {stat.footerType ===
                "success" && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    text-[7px]
                    font-medium
                    text-[#20A65A]
                  "
                >
                  <TrendingUp
                    size={9}
                    strokeWidth={2}
                  />

                  {stat.footer}
                </span>
              )}

              {stat.footerType ===
                "default" && (
                <span
                  className="
                    text-[7px]
                    font-medium
                    text-[#718599]
                  "
                >
                  {stat.footer}
                </span>
              )}

              {stat.footerType ===
                "danger" && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-full
                    bg-[#FFE1E1]
                    px-1.5
                    py-[2px]
                    text-[7px]
                    font-semibold
                    text-[#DC2626]
                  "
                >
                  <Clock3
                    size={8}
                    strokeWidth={2}
                  />

                  {stat.footer}
                </span>
              )}
            </div>

            {/* =================================================
                ERROR
            ================================================== */}

            {error && (
              <div
                className="
                  absolute
                  bottom-1
                  right-3
                  text-[6px]
                  text-[#DC2626]
                "
              >
                Unable to load
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LeadStats;