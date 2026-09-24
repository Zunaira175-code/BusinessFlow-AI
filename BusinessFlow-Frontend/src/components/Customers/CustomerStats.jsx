import { useEffect, useState } from "react";

import {
  UsersRound,
  UserCheck,
  Clock3,
  CircleAlert,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";

import Card from "../common/Card";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const CustomerStats = () => {
  const [stats, setStats] = useState({
    myCustomers: 0,
    activeCustomers: 0,
    followUpsDue: 0,
    atRisk: 0,
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // FETCH MY CUSTOMER STATS
  // =====================================================

  useEffect(() => {
    const fetchCustomerStats =
      async () => {
        try {
          setLoading(true);
          setError("");

          const token =
            localStorage.getItem(
              "businessflow_token"
            ) ||
            sessionStorage.getItem(
              "businessflow_token"
            );

          if (!token) {
            throw new Error(
              "Authentication required. Please login again."
            );
          }

          const response =
            await fetch(
              `${API_BASE_URL}/api/customers/stats`,
              {
                method: "GET",

                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept:
                    "application/json",
                },
              }
            );

          const result =
            await response.json();

          if (!response.ok) {
            throw new Error(
              result?.message ||
                "Failed to load customer statistics."
            );
          }

          // =================================================
          // BACKEND RESPONSE
          // =================================================
          //
          // {
          //   myCustomers,
          //   activeCustomers,
          //   followUpsDue,
          //   followUpsToday,
          //   atRisk
          // }
          //
          // =================================================

          setStats({
            myCustomers:
              result?.data
                ?.myCustomers ??
              0,

            activeCustomers:
              result?.data
                ?.activeCustomers ??
              0,

            followUpsDue:
              result?.data
                ?.followUpsDue ??
              0,

            atRisk:
              result?.data
                ?.atRisk ??
              0,
          });
        } catch (err) {
          console.error(
            "Customer Stats Fetch Error:",
            err
          );

          setError(
            err?.message ||
              "Unable to load customer statistics."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchCustomerStats();
  }, []);

  // =====================================================
  // FORMAT NUMBER
  // =====================================================

  const formatNumber = (
    value
  ) => {
    return new Intl.NumberFormat(
      "en-US"
    ).format(
      Number(value) || 0
    );
  };

  // =====================================================
  // STATS CONFIGURATION
  // =====================================================

  const statsCards = [
    {
      title: "MY CUSTOMERS",

      value: formatNumber(
        stats.myCustomers
      ),

      subtitle:
        stats.myCustomers > 0
          ? "Customers assigned to you"
          : "No customers assigned",

      icon: UsersRound,

      iconClass:
        "text-[#2E7D52]",

      iconBg:
        "bg-[#EAF7F0]",

      changeType:
        stats.myCustomers > 0
          ? "positive"
          : "neutral",
    },

    {
      title: "ACTIVE CUSTOMERS",

      value: formatNumber(
        stats.activeCustomers
      ),

      subtitle:
        stats.myCustomers > 0
          ? `${Math.round(
              (stats.activeCustomers /
                stats.myCustomers) *
                100
            )}% of total`
          : "0% of total",

      icon: UserCheck,

      iconClass:
        "text-[#526F8A]",

      iconBg:
        "bg-[#EEF4FC]",

      changeType:
        "neutral",
    },

    {
      title: "FOLLOW-UPS DUE",

      value: formatNumber(
        stats.followUpsDue
      ),

      subtitle:
        stats.followUpsDue > 0
          ? "Action required"
          : "Nothing due today",

      icon: Clock3,

      iconClass:
        "text-[#D98600]",

      iconBg:
        "bg-[#FFF5E6]",

      changeType:
        stats.followUpsDue > 0
          ? "warning"
          : "neutral",
    },

    {
      title: "AT RISK",

      value: formatNumber(
        stats.atRisk
      ),

      subtitle:
        stats.atRisk > 0
          ? "Needs attention"
          : "No customers at risk",

      icon: CircleAlert,

      iconClass:
        "text-[#D93636]",

      iconBg:
        "bg-[#FFF0F0]",

      changeType:
        stats.atRisk > 0
          ? "negative"
          : "neutral",
    },
  ];

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="mt-5 w-full">
        <div className="grid w-full grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(
            (item) => (
              <Card
                key={item}
                className="
                  relative
                  h-[110px]
                  overflow-hidden
                  rounded-[9px]
                  border
                  border-[#DCE5ED]
                  bg-white
                  px-[15px]
                  py-[13px]
                "
              >
                <div
                  className="
                    absolute
                    right-[11px]
                    top-[11px]
                    h-[32px]
                    w-[32px]
                    animate-pulse
                    rounded-[7px]
                    bg-[#EEF4FC]
                  "
                />

                <div
                  className="
                    h-[10px]
                    w-[90px]
                    animate-pulse
                    rounded
                    bg-[#EDF2F7]
                  "
                />

                <div
                  className="
                    mt-[14px]
                    h-[24px]
                    w-[70px]
                    animate-pulse
                    rounded
                    bg-[#EDF2F7]
                  "
                />

                <div
                  className="
                    mt-[7px]
                    h-[8px]
                    w-[120px]
                    animate-pulse
                    rounded
                    bg-[#F1F5F9]
                  "
                />
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
      <section className="mt-5 w-full">
        <Card
          className="
            flex
            min-h-[110px]
            items-center
            justify-center
            rounded-[9px]
            border
            border-[#F0D6D6]
            bg-[#FFF9F9]
            px-4
          "
        >
          <p className="text-[10px] font-medium text-[#C24141]">
            {error}
          </p>
        </Card>
      </section>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <section className="mt-5 w-full">
      <div className="grid w-full grid-cols-4 gap-4">
        {statsCards.map(
          (stat) => {
            const Icon =
              stat.icon;

            const isPositive =
              stat.changeType ===
              "positive";

            const isWarning =
              stat.changeType ===
              "warning";

            const isNegative =
              stat.changeType ===
              "negative";

            return (
              <Card
                key={stat.title}
                className="
                  relative
                  h-[110px]
                  overflow-hidden
                  rounded-[9px]
                  border
                  border-[#DCE5ED]
                  bg-white
                  px-[15px]
                  py-[13px]
                "
              >
                {/* =================================================
                    ICON
                ================================================== */}

                <div
                  className={`
                    absolute
                    right-[11px]
                    top-[11px]
                    flex
                    h-[32px]
                    w-[32px]
                    items-center
                    justify-center
                    rounded-[7px]
                    ${stat.iconBg}
                  `}
                >
                  <Icon
                    size={15}
                    strokeWidth={1.8}
                    className={
                      stat.iconClass
                    }
                  />
                </div>

                {/* =================================================
                    TITLE
                ================================================== */}

                <p
                  className="
                    max-w-[125px]
                    text-[9px]
                    font-semibold
                    leading-[12px]
                    tracking-[0.4px]
                    text-[#617589]
                  "
                >
                  {stat.title}
                </p>

                {/* =================================================
                    VALUE
                ================================================== */}

                <h2
                  className="
                    mt-[12px]
                    text-[22px]
                    font-bold
                    leading-[25px]
                    tracking-[-0.5px]
                    text-[#102F4A]
                  "
                >
                  {stat.value}
                </h2>

                {/* =================================================
                    SUBTITLE
                ================================================== */}

                <div className="mt-[5px] flex items-center gap-[5px]">
                  {isPositive && (
                    <ArrowUpRight
                      size={10}
                      strokeWidth={2.5}
                      className="text-[#27AE60]"
                    />
                  )}

                  {isWarning && (
                    <Clock3
                      size={10}
                      strokeWidth={2.5}
                      className="text-[#F39C12]"
                    />
                  )}

                  {isNegative && (
                    <CircleAlert
                      size={10}
                      strokeWidth={2.5}
                      className="text-[#DC3838]"
                    />
                  )}

                  {!isPositive &&
                    !isWarning &&
                    !isNegative && (
                      <ArrowRight
                        size={10}
                        strokeWidth={2.5}
                        className="text-[#91A0AE]"
                      />
                    )}

                  <span
                    className={`
                      text-[8px]
                      font-semibold
                      ${
                        isPositive
                          ? "text-[#27AE60]"
                          : isWarning
                          ? "text-[#F39C12]"
                          : isNegative
                          ? "text-[#DC3838]"
                          : "text-[#91A0AE]"
                      }
                    `}
                  >
                    {stat.subtitle}
                  </span>
                </div>
              </Card>
            );
          }
        )}
      </div>
    </section>
  );
};

export default CustomerStats;