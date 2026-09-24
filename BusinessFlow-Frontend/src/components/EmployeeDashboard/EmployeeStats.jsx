import { useEffect, useState } from "react";
import {
  Clock3,
  TrendingUp,
  CircleDollarSign,
  UsersRound,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

const EmployeeStats = () => {
  const [stats, setStats] = useState({
    myTasks: {
      value: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      completionPercentage: 0,
    },

    myLeads: {
      value: 0,
    },

    myDeals: {
      value: 0,
      won: 0,
    },

    myRevenue: {
      value: 0,
      formatted: "$0",
    },

    myCustomers: {
      value: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH MY DASHBOARD STATS
  // =====================================================

  useEffect(() => {
    const fetchEmployeeStats = async () => {
      try {
        setLoading(true);
        setError("");

        // =================================================
        // GET AUTH TOKEN
        // =================================================

        const token = localStorage.getItem("businessflow_token");

        console.log(
          "Employee Stats - Token Found:",
          Boolean(token)
        );

        if (!token) {
          throw new Error(
            "Authentication token not found. Please login again."
          );
        }

        // =================================================
        // API REQUEST
        // =================================================

        const response = await fetch(
          `${API_URL}/employees/me/stats`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // =================================================
        // PARSE RESPONSE
        // =================================================

        const result = await response.json();

        console.log(
          "Employee Dashboard Stats API Response:",
          result
        );

        // =================================================
        // HANDLE ERROR
        // =================================================

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              result?.message ||
                "Your session has expired. Please login again."
            );
          }

          if (response.status === 403) {
            throw new Error(
              result?.message ||
                "You do not have permission to view dashboard statistics."
            );
          }

          throw new Error(
            result?.message ||
              "Unable to fetch dashboard statistics."
          );
        }

        // =================================================
        // GET DATA
        // =================================================

        const data = result?.data;

        // =================================================
        // UPDATE STATE
        // =================================================

        setStats({
          myTasks: {
            value: data?.myTasks?.value || 0,
            pending: data?.myTasks?.pending || 0,
            inProgress: data?.myTasks?.inProgress || 0,
            completed: data?.myTasks?.completed || 0,
            completionPercentage:
              data?.myTasks?.completionPercentage || 0,
          },

          myLeads: {
            value: data?.myLeads?.value || 0,
          },

          myDeals: {
            value: data?.myDeals?.value || 0,
            won: data?.myDeals?.won || 0,
          },

          myRevenue: {
            value: data?.myRevenue?.value || 0,
            formatted:
              data?.myRevenue?.formatted || "$0",
          },

          myCustomers: {
            value: data?.myCustomers?.value || 0,
          },
        });
      } catch (error) {
        console.error(
          "Employee Stats Error:",
          error
        );

        setError(
          error?.message ||
            "Unable to fetch employee statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeStats();
  }, []);

  // =====================================================
  // DYNAMIC STAT CARDS
  // =====================================================

  const statCards = [
    {
      title: "My Tasks",
      value: stats.myTasks.value,

      subtitle:
        stats.myTasks.value > 0
          ? `${stats.myTasks.pending} pending`
          : "No tasks assigned",

      icon: Clock3,
      subtitleClass: "text-[#F59E0B]",
      iconClass: "text-[#F59E0B]",
    },

    {
      title: "My Leads",
      value: stats.myLeads.value,

      subtitle:
        stats.myLeads.value > 0
          ? "Assigned leads"
          : "No leads assigned",

      icon: TrendingUp,
      subtitleClass: "text-[#20A65A]",
      iconClass: "text-[#20A65A]",
    },

    {
      title: "My Deals",

      value: stats.myRevenue.formatted,

      subtitle:
        stats.myDeals.value > 0
          ? `${stats.myDeals.value} active deals`
          : "No active deals",

      icon: CircleDollarSign,
      subtitleClass: "text-[#079BEA]",
      iconClass: "text-[#079BEA]",
    },

    {
      title: "My Customers",

      value: stats.myCustomers.value,

      subtitle:
        stats.myCustomers.value > 0
          ? "Assigned customers"
          : "No customers assigned",

      icon: UsersRound,
      subtitleClass: "text-[#718599]",
      iconClass: "text-[#718599]",
    },
  ];

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div
        className="
          grid
          w-full
          grid-cols-1
          gap-2
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="
              min-h-[84px]
              animate-pulse
              rounded-[9px]
              border
              border-[#DCE5ED]
              bg-white
              px-3
              py-3
            "
          >
            <div className="h-[11px] w-16 rounded bg-[#E8EEF4]" />

            <div className="mt-2 h-[25px] w-20 rounded bg-[#E8EEF4]" />

            <div className="mt-3 h-[9px] w-24 rounded bg-[#E8EEF4]" />
          </div>
        ))}
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div
        className="
          w-full
          rounded-[9px]
          border
          border-red-200
          bg-white
          px-4
          py-4
        "
      >
        <p className="text-[10px] font-medium text-red-500">
          {error}
        </p>
      </div>
    );
  }

  // =====================================================
  // STATS UI
  // =====================================================

  return (
    <div
      className="
        grid
        w-full
        grid-cols-1
        gap-2
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
              min-h-[84px]
              rounded-[9px]
              border
              border-[#DCE5ED]
              bg-white
              px-3
              py-3
              transition-all
              duration-200
              hover:border-[#C8D8E6]
              hover:shadow-sm
            "
          >
            {/* Title */}
            <p
              className="
                text-[8px]
                font-medium
                leading-[11px]
                text-[#718599]
              "
            >
              {stat.title}
            </p>

            {/* Value */}
            <p
              className="
                mt-1
                text-[22px]
                font-bold
                leading-[25px]
                tracking-[-0.4px]
                text-[#0B3155]
              "
            >
              {stat.value}
            </p>

            {/* Bottom Info */}
            <div
              className={`
                mt-2
                flex
                items-center
                gap-1
                text-[7px]
                font-medium
                ${stat.subtitleClass}
              `}
            >
              <Icon
                size={9}
                strokeWidth={2}
                className={stat.iconClass}
              />

              <span>{stat.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EmployeeStats;