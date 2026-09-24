import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

const API_URL = "http://localhost:5000/api";

const EmployeeDashboardHeader = ({
  employeeName = "",
  onAddTask,
}) => {
  const [name, setName] = useState(employeeName || "Employee");
  const [loading, setLoading] = useState(true);

  // =====================================================
  // GET LOGGED-IN USER
  // =====================================================

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("businessflow_token");

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_URL}/auth/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        console.log(
          "Employee Dashboard User Response:",
          result
        );

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Unable to fetch current user."
          );
        }

        const user = result?.data?.user;

        // =================================================
        // GET FIRST NAME
        // =================================================

        const firstName =
          user?.firstName ||
          user?.name?.split(" ")?.[0] ||
          employeeName ||
          "Employee";

        setName(firstName);
      } catch (error) {
        console.error(
          "Employee Dashboard User Error:",
          error
        );

        // Fallback
        setName(
          employeeName || "Employee"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [employeeName]);

  return (
    <div className="flex w-full items-start justify-between">
      {/* Left Content */}
      <div className="min-w-0">
        <h1
          className="
            text-[24px]
            font-bold
            leading-[30px]
            tracking-[-0.4px]
            text-[#071D35]
          "
        >
          Good morning,{" "}
          {loading ? "..." : name}
        </h1>

        <p
          className="
            mt-1
            text-[11px]
            leading-[16px]
            text-[#718599]
          "
        >
          Here's what's happening with your work today.
        </p>
      </div>

      {/* Add Task Button */}
      <button
        type="button"
        onClick={onAddTask}
        className="
          flex
          h-[26px]
          shrink-0
          items-center
          gap-1.5
          rounded-[6px]
          bg-[#0B3D6B]
          px-3
          text-[9px]
          font-semibold
          text-white
          shadow-sm
          transition-colors
          duration-200
          hover:bg-[#092F54]
          focus:outline-none
          focus:ring-2
          focus:ring-[#0B3D6B]/20
        "
      >
        <Plus
          size={11}
          strokeWidth={2}
        />

        <span>Add Task</span>
      </button>
    </div>
  );
};

export default EmployeeDashboardHeader;