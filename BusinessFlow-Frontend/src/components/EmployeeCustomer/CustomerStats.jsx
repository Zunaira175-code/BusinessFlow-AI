import { useEffect, useState } from "react";
import {
  UsersRound,
  UserCheck,
  Clock3,
  CircleAlert,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

const CustomerStats = () => {
  const [stats, setStats] = useState({
    myCustomers: 0,
    activeCustomers: 0,
    followUpsDue: 0,
    followUpsToday: 0,
    atRisk: 0,
    newThisMonth: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem(
        "businessflow_token"
      );

      if (!token) {
        setError("Authentication required.");
        return;
      }

      const response = await fetch(
        `${API_URL}/customers/me/stats`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to fetch customer stats."
        );
      }

      setStats({
        myCustomers:
          Number(result.data?.myCustomers) || 0,

        activeCustomers:
          Number(result.data?.activeCustomers) || 0,

        followUpsDue:
          Number(result.data?.followUpsDue) || 0,

        followUpsToday:
          Number(result.data?.followUpsToday) || 0,

        atRisk:
          Number(result.data?.atRisk) || 0,

        newThisMonth:
          Number(result.data?.newThisMonth) || 0,
      });
    } catch (err) {
      console.error(
        "Customer Stats Error:",
        err
      );

      setError(
        err.message ||
          "Failed to fetch customer stats."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const activePercentage =
    stats.myCustomers > 0
      ? Math.round(
          (stats.activeCustomers /
            stats.myCustomers) *
            100
        )
      : 0;

  const statsData = [
    {
      label: "MY CUSTOMERS",
      value: stats.myCustomers,
      description:
        stats.newThisMonth > 0
          ? `${stats.newThisMonth} new this month`
          : "No new this month",
      icon: UsersRound,
      type: "positive",
    },
    {
      label: "ACTIVE CUSTOMERS",
      value: stats.activeCustomers,
      description: `${activePercentage}% of total`,
      icon: UserCheck,
      type: "neutral",
    },
    {
      label: "FOLLOW-UPS DUE",
      value: stats.followUpsDue,
      description:
        stats.followUpsToday > 0
          ? `${stats.followUpsToday} due today`
          : "Nothing due today",
      icon: Clock3,
      type: "warning",
    },
    {
      label: "AT RISK",
      value: stats.atRisk,
      description:
        stats.atRisk > 0
          ? "Requires attention"
          : "No customers at risk",
      icon: CircleAlert,
      type: "danger",
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {statsData.map((stat) => {
        const Icon = stat.icon;

        const descriptionClass =
          stat.type === "positive"
            ? "text-[#20A65A]"
            : stat.type === "warning"
              ? "text-[#E88700]"
              : stat.type === "danger"
                ? "text-[#EF4444]"
                : "text-[#8495A5]";

        const iconClass =
          stat.type === "positive"
            ? "text-[#20A65A]"
            : stat.type === "warning"
              ? "text-[#E88700]"
              : stat.type === "danger"
                ? "text-[#EF4444]"
                : "text-[#60758A]";

        return (
          <div
            key={stat.label}
            className="
              min-h-[78px]
              rounded-[8px]
              border
              border-[#DCE5ED]
              bg-white
              px-4
              py-3
              shadow-[0_1px_2px_rgba(7,29,53,0.03)]
            "
          >
            <p
              className="
                text-[8px]
                font-semibold
                tracking-[0.2px]
                text-[#60758A]
              "
            >
              {stat.label}
            </p>

            <div className="mt-1 flex items-center">
              <p
                className={`
                  text-[25px]
                  font-bold
                  leading-none
                  tracking-[-0.5px]
                  ${
                    stat.type === "warning"
                      ? "text-[#D97706]"
                      : stat.type === "danger"
                        ? "text-[#DC2626]"
                        : "text-[#0B2F50]"
                  }
                `}
              >
                {loading ? "—" : stat.value}
              </p>
            </div>

            <div className="mt-1.5 flex items-center gap-1">
              <Icon
                size={9}
                strokeWidth={2}
                className={iconClass}
              />

              <span
                className={`
                  text-[7px]
                  font-medium
                  ${descriptionClass}
                `}
              >
                {loading
                  ? "Loading..."
                  : error
                    ? "Unable to load"
                    : stat.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomerStats;