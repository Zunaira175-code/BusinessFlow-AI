import { useEffect, useState } from "react";

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
  // FETCH EMPLOYEE DASHBOARD STATS
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
          "Employee Dashboard Stats - Token Found:",
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
        // HANDLE API ERROR
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
          "Employee Dashboard Stats Error:",
          error
        );

        setError(
          error?.message ||
            "Unable to fetch dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeStats();
  }, []);

  // =====================================================
  // STAT CARDS
  // =====================================================

  const statCards = [
    {
      title: "MY TASKS",
      value: stats.myTasks.value,
      bottom:
        stats.myTasks.value > 0
          ? `${stats.myTasks.completionPercentage}% completed`
          : "No tasks assigned",
      type: "success",

      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.6"
          />

          <path
            d="M8 12L10.5 14.5L16 9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),

      iconClass: "text-[#E1E5E9]",
    },

    {
      title: "MY LEADS",
      value: stats.myLeads.value,
      bottom:
        stats.myLeads.value > 0
          ? "Assigned leads"
          : "No leads assigned",
      type: "normal",

      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="9"
            cy="8"
            r="3"
            stroke="currentColor"
            strokeWidth="1.6"
          />

          <path
            d="M3.5 19C3.5 15.96 5.96 13.5 9 13.5C12.04 13.5 14.5 15.96 14.5 19"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          <path
            d="M16 12V18"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          <path
            d="M13 15H19"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ),

      iconClass: "text-[#DDF2E7]",
    },

    {
      title: "MY DEALS",
      value: stats.myDeals.value,
      bottom:
        stats.myDeals.value > 0
          ? `${stats.myDeals.won} won`
          : "No deals assigned",
      type: "normal",

      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <rect
            x="3.5"
            y="6"
            width="17"
            height="13"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.6"
          />

          <path
            d="M8 6V4.5C8 3.67 8.67 3 9.5 3H14.5C15.33 3 16 3.67 16 4.5V6"
            stroke="currentColor"
            strokeWidth="1.6"
          />

          <path
            d="M8 12H16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          <path
            d="M12 9V15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),

      iconClass: "text-[#F7E6D2]",
    },

    {
      title: "MY REVENUE",
      value: stats.myRevenue.formatted,
      bottom:
        stats.myDeals.won > 0
          ? `${stats.myDeals.won} won deals`
          : "No won deals yet",
      type: "info",

      icon: (
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
        >
          <circle
            cx="12.5"
            cy="12"
            r="8"
            stroke="currentColor"
            strokeWidth="1.5"
          />

          <path
            d="M12.5 7V17"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          <path
            d="M15 9.5C15 8.67 13.88 8 12.5 8C11.12 8 10 8.67 10 9.5C10 10.33 11.12 11 12.5 11C13.88 11 15 11.67 15 12.5C15 13.33 13.88 14 12.5 14C11.12 14 10 13.33 10 12.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),

      iconClass: "text-[#DDEEF5]",
    },
  ];

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="grid w-full grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="h-[103px] animate-pulse rounded-[9px] border border-[#DCE5EF] bg-white px-4 py-3"
          >
            <div className="h-2 w-24 rounded bg-[#E8EEF4]" />

            <div className="mt-4 h-7 w-14 rounded bg-[#E8EEF4]" />

            <div className="mt-3 h-3 w-28 rounded bg-[#E8EEF4]" />
          </div>
        ))}
      </section>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="w-full rounded-[9px] border border-red-200 bg-white px-5 py-6">
        <p className="text-sm font-medium text-red-500">
          {error}
        </p>
      </div>
    );
  }

  // =====================================================
  // STATS UI
  // =====================================================

  return (
    <section className="grid w-full grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <div
          key={stat.title}
          className="relative h-[103px] overflow-hidden rounded-[9px] border border-[#DCE5EF] bg-white px-4 py-3"
        >
          <div className="relative z-10">
            <p className="text-[8px] font-semibold uppercase tracking-[0.05em] text-[#71869A]">
              {stat.title}
            </p>

            <p className="mt-[5px] text-[23px] font-bold leading-[27px] text-[#071D35]">
              {stat.value}
            </p>

            <div className="mt-[4px]">
              {stat.type === "success" ? (
                <span className="inline-flex items-center rounded-[4px] bg-[#E7F7EE] px-[6px] py-[3px] text-[8px] font-semibold text-[#16A05D]">
                  ↗ {stat.bottom}
                </span>
              ) : stat.type === "info" ? (
                <span className="inline-flex items-center rounded-[4px] bg-[#E6F3FA] px-[6px] py-[3px] text-[8px] font-medium text-[#1989C5]">
                  {stat.bottom}
                </span>
              ) : (
                <span className="text-[8px] text-[#6F8294]">
                  {stat.bottom}
                </span>
              )}
            </div>
          </div>

          <div
            className={`absolute right-3 top-3 ${stat.iconClass}`}
          >
            {stat.icon}
          </div>
        </div>
      ))}
    </section>
  );
};

export default EmployeeStats;