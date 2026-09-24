import { useMemo } from "react";

const EmployeeFilters = ({
  employees = [],
  searchTerm = "",
  setSearchTerm,
  roleFilter = "all",
  setRoleFilter,
  departmentFilter = "all",
  setDepartmentFilter,
  statusFilter = "all",
  setStatusFilter,
  performanceFilter = "all",
  setPerformanceFilter,
}) => {
  // =====================================================
  // UNIQUE ROLES
  // =====================================================

  const roles = useMemo(() => {
    const values = employees
      .map((employee) => employee.role)
      .filter(Boolean);

    return ["all", ...new Set(values)];
  }, [employees]);

  // =====================================================
  // UNIQUE DEPARTMENTS
  // =====================================================

  const departments = useMemo(() => {
    const values = employees
      .map((employee) => employee.department)
      .filter(Boolean);

    return ["all", ...new Set(values)];
  }, [employees]);

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearchTerm?.("");
    setRoleFilter?.("all");
    setDepartmentFilter?.("all");
    setStatusFilter?.("all");
    setPerformanceFilter?.("all");
  };

  const hasActiveFilters =
    searchTerm ||
    roleFilter !== "all" ||
    departmentFilter !== "all" ||
    statusFilter !== "all" ||
    performanceFilter !== "all";

  return (
    <div className="grid grid-cols-[1fr_115px_115px_115px] gap-2">

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71869A]"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="11"
            cy="11"
            r="6.5"
            stroke="currentColor"
            strokeWidth="1.7"
          />

          <path
            d="M16 16L21 21"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm?.(e.target.value)
          }
          placeholder="Search by name, email, or role..."
          className="
            h-[29px]
            w-full
            rounded-[6px]
            border
            border-[#C9D9E8]
            bg-white
            pl-9
            pr-3
            text-[8px]
            text-[#17324D]
            outline-none
            placeholder:text-[#8192A2]
            focus:border-[#8DBBE3]
            focus:ring-2
            focus:ring-[#E4F0FA]
          "
        />
      </div>

      {/* =================================================
          ROLES
      ================================================= */}

      <select
        value={roleFilter}
        onChange={(e) =>
          setRoleFilter?.(e.target.value)
        }
        className="
          h-[29px]
          w-full
          cursor-pointer
          appearance-none
          rounded-[6px]
          border
          border-[#C9D9E8]
          bg-white
          px-3
          text-[8px]
          text-[#17324D]
          outline-none
          focus:border-[#8DBBE3]
          focus:ring-2
          focus:ring-[#E4F0FA]
        "
        aria-label="Filter by role"
      >
        <option value="all">
          All Roles
        </option>

        {roles
          .filter((role) => role !== "all")
          .map((role) => (
            <option
              key={role}
              value={role}
            >
              {role}
            </option>
          ))}
      </select>

      {/* =================================================
          DEPARTMENTS
      ================================================= */}

      <select
        value={departmentFilter}
        onChange={(e) =>
          setDepartmentFilter?.(e.target.value)
        }
        className="
          h-[29px]
          w-full
          cursor-pointer
          appearance-none
          rounded-[6px]
          border
          border-[#C9D9E8]
          bg-white
          px-3
          text-[8px]
          text-[#17324D]
          outline-none
          focus:border-[#8DBBE3]
          focus:ring-2
          focus:ring-[#E4F0FA]
        "
        aria-label="Filter by department"
      >
        <option value="all">
          All Departments
        </option>

        {departments
          .filter(
            (department) =>
              department !== "all"
          )
          .map((department) => (
            <option
              key={department}
              value={department}
            >
              {department}
            </option>
          ))}
      </select>

      {/* =================================================
          STATUS
      ================================================= */}

      <select
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter?.(e.target.value)
        }
        className="
          h-[29px]
          w-full
          cursor-pointer
          appearance-none
          rounded-[6px]
          border
          border-[#C9D9E8]
          bg-white
          px-3
          text-[8px]
          text-[#17324D]
          outline-none
          focus:border-[#8DBBE3]
          focus:ring-2
          focus:ring-[#E4F0FA]
        "
        aria-label="Filter by status"
      >
        <option value="all">
          All Statuses
        </option>

        <option value="active">
          Active
        </option>

        <option value="on_leave">
          On Leave
        </option>

        <option value="inactive">
          Inactive
        </option>
      </select>

      {/* =================================================
          PERFORMANCE
      ================================================= */}

      <select
        value={performanceFilter}
        onChange={(e) =>
          setPerformanceFilter?.(
            e.target.value
          )
        }
        className="
          col-start-2
          h-[29px]
          w-full
          cursor-pointer
          appearance-none
          rounded-[6px]
          border
          border-[#C9D9E8]
          bg-white
          px-3
          text-[8px]
          text-[#17324D]
          outline-none
          focus:border-[#8DBBE3]
          focus:ring-2
          focus:ring-[#E4F0FA]
        "
        aria-label="Filter by performance"
      >
        <option value="all">
          Performance
        </option>

        <option value="top">
          Top Performers
        </option>

        <option value="average">
          Average
        </option>

        <option value="low">
          Needs Attention
        </option>
      </select>

      {/* =================================================
          FILTER / CLEAR BUTTON
      ================================================= */}

      <button
        type="button"
        onClick={clearFilters}
        className={`
          flex
          h-[29px]
          w-[29px]
          items-center
          justify-center
          rounded-[6px]
          transition-colors
          ${
            hasActiveFilters
              ? "text-[#0B5A96] hover:bg-[#EAF4FC]"
              : "text-[#71869A] hover:bg-[#F3F6F9]"
          }
        `}
        aria-label="Clear filters"
        title={
          hasActiveFilters
            ? "Clear filters"
            : "Filter"
        }
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M4 6H20"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />

          <path
            d="M7 12H17"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />

          <path
            d="M10 18H14"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default EmployeeFilters;