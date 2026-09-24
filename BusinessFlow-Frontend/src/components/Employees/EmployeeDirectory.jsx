import { useEffect, useMemo, useState } from "react";
import EmployeeFilters from "./EmployeeFilters";

const API_URL = "http://localhost:5000/api";
const EMPLOYEES_PER_PAGE = 10;

const EmployeeDirectory = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalEmployees, setTotalEmployees] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  // =====================================================
  // FILTER STATE
  // =====================================================

  const [searchTerm, setSearchTerm] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("all");

  const [departmentFilter, setDepartmentFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [performanceFilter, setPerformanceFilter] =
    useState("all");

  // =====================================================
  // GET AUTH TOKEN
  // =====================================================

  const getToken = () => {
    return (
      localStorage.getItem(
        "businessflow_token"
      ) ||
      sessionStorage.getItem(
        "businessflow_token"
      )
    );
  };

  // =====================================================
  // FETCH EMPLOYEES
  // =====================================================

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      // =================================================
      // QUERY PARAMETERS
      // =================================================

      const params = new URLSearchParams();

      params.set(
        "page",
        String(currentPage)
      );

      params.set(
        "limit",
        String(EMPLOYEES_PER_PAGE)
      );

      if (searchTerm.trim()) {
        params.set(
          "search",
          searchTerm.trim()
        );
      }

      if (roleFilter !== "all") {
        params.set(
          "role",
          roleFilter
        );
      }

      if (
        departmentFilter !==
        "all"
      ) {
        params.set(
          "department",
          departmentFilter
        );
      }

      if (statusFilter !== "all") {
        params.set(
          "status",
          statusFilter
        );
      }

      if (
        performanceFilter !==
        "all"
      ) {
        params.set(
          "performance",
          performanceFilter
        );
      }

      // =================================================
      // API REQUEST
      // =================================================

      const response = await fetch(
        `${API_URL}/employees?${params.toString()}`,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      // =================================================
      // PARSE RESPONSE
      // =================================================

      let result;

      try {
        result =
          await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      // =================================================
      // HANDLE API ERROR
      // =================================================

      if (
        !response.ok ||
        !result?.success
      ) {
        if (
          response.status ===
          401
        ) {
          throw new Error(
            result?.message ||
              "Your session has expired. Please login again."
          );
        }

        if (
          response.status ===
          403
        ) {
          throw new Error(
            result?.message ||
              "You do not have permission to view employees."
          );
        }

        throw new Error(
          result?.message ||
            "Unable to fetch employees."
        );
      }

      // =================================================
      // GET EMPLOYEE DATA
      // =================================================

      const employeeData =
        result?.data
          ?.employees || [];

      if (
        !Array.isArray(
          employeeData
        )
      ) {
        throw new Error(
          "Invalid employee data received from server."
        );
      }

      // =================================================
      // UPDATE STATE
      // =================================================

      setEmployees(
        employeeData
      );

      setTotalEmployees(
        Number(
          result?.data?.total
        ) || 0
      );

      setTotalPages(
        Math.max(
          Number(
            result?.data
              ?.totalPages
          ) || 1,
          1
        )
      );
    } catch (error) {
      console.error(
        "Employee Directory Error:",
        error
      );

      setError(
        error?.message ||
          "Unable to fetch employees. Please try again."
      );

      setEmployees([]);
      setTotalEmployees(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH WHEN PAGE / FILTER CHANGES
  // =====================================================

  useEffect(() => {
    fetchEmployees();
  }, [
    currentPage,
    searchTerm,
    roleFilter,
    departmentFilter,
    statusFilter,
    performanceFilter,
  ]);

  // =====================================================
  // FORMAT EMPLOYEES
  // =====================================================

  const formattedEmployees =
    useMemo(() => {
      return employees.map(
        (employee) => {
          const firstName =
            employee.firstName ||
            "";

          const lastName =
            employee.lastName ||
            "";

          const initials =
            `${firstName.charAt(
              0
            )}${lastName.charAt(
              0
            )}`.toUpperCase();

          const fullName =
            `${firstName} ${lastName}`.trim() ||
            "Unnamed Employee";

          const isActive =
            employee.isActive ===
              true &&
            employee.workStatus ===
              "active";

          const isOnLeave =
            employee.workStatus ===
            "on_leave";

          return {
            id:
              employee._id ||
              employee.id,

            initials,

            name:
              fullName,

            email:
              employee.email ||
              "—",

            role:
              employee.jobTitle ||
              employee.role ||
              "Employee",

            department:
              employee.department ||
              "—",

            leads:
              employee.leads ??
              0,

            deals:
              employee.deals ??
              0,

            revenue:
              employee.revenueFormatted ??
              "$0",

            performance:
              employee.performance ||
              "average",

            status:
              isOnLeave
                ? "On Leave"
                : isActive
                ? "Active"
                : "Inactive",

            avatar:
              isOnLeave
                ? "bg-[#DCE8F8]"
                : "bg-[#EEF2F5]",

            dot:
              isOnLeave
                ? "bg-[#F28A00]"
                : isActive
                ? "bg-[#16A05D]"
                : "bg-[#9AAABA]",

            statusClass:
              isOnLeave
                ? "bg-[#FFF0DF] text-[#F28A00]"
                : isActive
                ? "bg-[#E5F6EC] text-[#16A05D]"
                : "bg-[#EEF2F5] text-[#71869A]",
          };
        }
      );
    }, [employees]);

  // =====================================================
  // PAGE INFORMATION
  // =====================================================

  const startItem =
    totalEmployees === 0
      ? 0
      : (currentPage - 1) *
          EMPLOYEES_PER_PAGE +
        1;

  const endItem =
    totalEmployees === 0
      ? 0
      : Math.min(
          currentPage *
            EMPLOYEES_PER_PAGE,
          totalEmployees
        );

  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const handlePageChange = (
    page
  ) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    setCurrentPage(page);
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const handleClearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setDepartmentFilter("all");
    setStatusFilter("all");
    setPerformanceFilter("all");
    setCurrentPage(1);
  };

  // =====================================================
  // RETRY
  // =====================================================

  const handleRetry = () => {
    fetchEmployees();
  };

  // =====================================================
  // TABLE HEADER
  // =====================================================

  const renderTableHeader =
    () => (
      <div className="grid h-[35px] grid-cols-[2.2fr_1.55fr_0.75fr_0.85fr_1fr_0.85fr_0.55fr] items-center border-b border-[#E2E9F0] bg-[#F8FAFC] px-3">

        <span className="text-[8px] font-medium text-[#71869A]">
          Employee
        </span>

        <span className="text-[8px] font-medium text-[#71869A]">
          Role & Dept
        </span>

        <span className="text-center text-[8px] font-medium text-[#71869A]">
          Leads
        </span>

        <span className="text-center text-[8px] font-medium text-[#71869A]">
          Active Deals
        </span>

        <span className="text-center text-[8px] font-medium text-[#71869A]">
          YTD Revenue
        </span>

        <span className="text-center text-[8px] font-medium text-[#71869A]">
          Status
        </span>

        <span className="text-right text-[8px] font-medium text-[#71869A]">
          Actions
        </span>
      </div>
    );

  // =====================================================
  // FILTER COMPONENT
  // =====================================================

  const renderFilters = () => (
    <div className="border-b border-[#DCE5EF] bg-[#F9FBFD] p-3">
      <EmployeeFilters
        employees={employees}
        searchTerm={searchTerm}
        setSearchTerm={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        roleFilter={roleFilter}
        setRoleFilter={(value) => {
          setRoleFilter(value);
          setCurrentPage(1);
        }}
        departmentFilter={
          departmentFilter
        }
        setDepartmentFilter={(value) => {
          setDepartmentFilter(value);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        setStatusFilter={(value) => {
          setStatusFilter(value);
          setCurrentPage(1);
        }}
        performanceFilter={
          performanceFilter
        }
        setPerformanceFilter={(value) => {
          setPerformanceFilter(value);
          setCurrentPage(1);
        }}
      />
    </div>
  );

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <section className="w-full overflow-hidden rounded-[9px] border border-[#DCE5EF] bg-white">

        {renderFilters()}

        {renderTableHeader()}

        {Array.from({
          length: 5,
        }).map((_, index) => (
          <div
            key={index}
            className="grid min-h-[52px] grid-cols-[2.2fr_1.55fr_0.75fr_0.85fr_1fr_0.85fr_0.55fr] items-center border-b border-[#E2E9F0] px-3"
          >
            <div className="flex items-center gap-2">
              <div className="h-[28px] w-[28px] animate-pulse rounded-full bg-[#E8EEF4]" />

              <div className="space-y-1.5">
                <div className="h-2 w-24 animate-pulse rounded bg-[#E8EEF4]" />

                <div className="h-1.5 w-32 animate-pulse rounded bg-[#EEF2F5]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="h-2 w-20 animate-pulse rounded bg-[#E8EEF4]" />

              <div className="h-1.5 w-24 animate-pulse rounded bg-[#EEF2F5]" />
            </div>

            <div className="mx-auto h-2 w-5 animate-pulse rounded bg-[#E8EEF4]" />

            <div className="mx-auto h-2 w-5 animate-pulse rounded bg-[#E8EEF4]" />

            <div className="mx-auto h-2 w-12 animate-pulse rounded bg-[#E8EEF4]" />

            <div className="mx-auto h-5 w-14 animate-pulse rounded bg-[#E8EEF4]" />

            <div className="ml-auto h-4 w-3 animate-pulse rounded bg-[#E8EEF4]" />
          </div>
        ))}

        <div className="flex h-[44px] items-center justify-between px-3">
          <div className="h-2 w-36 animate-pulse rounded bg-[#E8EEF4]" />

          <div className="h-6 w-32 animate-pulse rounded bg-[#E8EEF4]" />
        </div>
      </section>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {
    return (
      <section className="w-full overflow-hidden rounded-[9px] border border-[#DCE5EF] bg-white">

        {renderFilters()}

        {renderTableHeader()}

        <div className="flex min-h-[180px] items-center justify-center px-5">
          <div className="text-center">

            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#FEF2F2]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="#DC2626"
                  strokeWidth="1.7"
                />

                <path
                  d="M12 8V12"
                  stroke="#DC2626"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

                <circle
                  cx="12"
                  cy="16"
                  r="1"
                  fill="#DC2626"
                />
              </svg>
            </div>

            <p className="mt-3 text-[10px] font-semibold text-[#B42318]">
              Unable to load employees
            </p>

            <p className="mt-1 max-w-[300px] text-[8px] leading-4 text-[#71869A]">
              {error}
            </p>

            <button
              type="button"
              onClick={
                handleRetry
              }
              className="mt-3 rounded-[5px] bg-[#0B3D6B] px-4 py-2 text-[8px] font-semibold text-white transition hover:bg-[#0A3156]"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // MAIN DIRECTORY
  // =====================================================

  return (
    <section className="w-full overflow-hidden rounded-[9px] border border-[#DCE5EF] bg-white">

      {/* =================================================
          FILTERS
      ================================================= */}

      {renderFilters()}

      {/* =================================================
          TABLE HEADER
      ================================================= */}

      {renderTableHeader()}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {formattedEmployees.length ===
      0 ? (
        <div className="flex min-h-[150px] items-center justify-center">
          <div className="text-center">

            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF4FA]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="9"
                  cy="8"
                  r="3"
                  stroke="#7890A5"
                  strokeWidth="1.5"
                />

                <circle
                  cx="17"
                  cy="9"
                  r="2.5"
                  stroke="#7890A5"
                  strokeWidth="1.5"
                />

                <path
                  d="M3.5 19C3.5 15.96 5.96 13.5 9 13.5C12.04 13.5 14.5 15.96 14.5 19"
                  stroke="#7890A5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                <path
                  d="M15 14.5C17.76 14.5 20 16.74 20 19"
                  stroke="#7890A5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <p className="mt-2 text-[9px] font-semibold text-[#17324D]">
              No employees found
            </p>

            <p className="mt-1 text-[7px] text-[#8192A2]">
              Try changing your search or filters.
            </p>

            {(searchTerm ||
              roleFilter !==
                "all" ||
              departmentFilter !==
                "all" ||
              statusFilter !==
                "all" ||
              performanceFilter !==
                "all") && (
              <button
                type="button"
                onClick={
                  handleClearFilters
                }
                className="mt-3 rounded-[5px] bg-[#071D35] px-3 py-1.5 text-[8px] font-semibold text-white hover:bg-[#0B477A]"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* =================================================
              EMPLOYEES
          ================================================= */}

          {formattedEmployees.map(
            (employee) => (
              <div
                key={
                  employee.id ||
                  employee.email
                }
                className="grid min-h-[52px] grid-cols-[2.2fr_1.55fr_0.75fr_0.85fr_1fr_0.85fr_0.55fr] items-center border-b border-[#E2E9F0] px-3 transition-colors hover:bg-[#FBFCFE]"
              >

                {/* =========================================
                    EMPLOYEE
                ========================================= */}

                <div className="flex items-center gap-2">

                  <div
                    className={`relative flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-[9px] font-semibold text-[#31506C] ${employee.avatar}`}
                  >
                    {employee.initials ? (
                      employee.initials
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-[#C5CED6]"
                      >
                        <circle
                          cx="12"
                          cy="8"
                          r="3.5"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />

                        <path
                          d="M5 20C5 16.7 8.1 14 12 14C15.9 14 19 16.7 19 20"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}

                    <span
                      className={`absolute bottom-0 right-0 h-[7px] w-[7px] rounded-full border border-white ${employee.dot}`}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[9px] font-semibold leading-[12px] text-[#17324D]">
                      {employee.name}
                    </p>

                    <p className="truncate text-[7px] leading-[10px] text-[#8192A2]">
                      {employee.email}
                    </p>
                  </div>
                </div>

                {/* =========================================
                    ROLE & DEPARTMENT
                ========================================= */}

                <div className="min-w-0">
                  <p className="truncate text-[8px] leading-[11px] text-[#17324D]">
                    {employee.role}
                  </p>

                  <p className="truncate text-[7px] leading-[10px] text-[#8192A2]">
                    {employee.department}
                  </p>
                </div>

                {/* =========================================
                    LEADS
                ========================================= */}

                <span className="text-center text-[8px] text-[#17324D]">
                  {employee.leads}
                </span>

                {/* =========================================
                    DEALS
                ========================================= */}

                <span className="text-center text-[8px] text-[#17324D]">
                  {employee.deals}
                </span>

                {/* =========================================
                    REVENUE
                ========================================= */}

                <span className="text-center text-[8px] font-semibold text-[#17324D]">
                  {employee.revenue}
                </span>

                {/* =========================================
                    STATUS
                ========================================= */}

                <div className="flex justify-center">
                  <span
                    className={`rounded-[4px] px-[7px] py-[3px] text-[7px] font-semibold ${employee.statusClass}`}
                  >
                    {employee.status}
                  </span>
                </div>

                {/* =========================================
                    ACTIONS
                ========================================= */}

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="flex h-6 w-6 items-center justify-center rounded text-[13px] leading-none text-[#71869A] transition hover:bg-[#F3F6F9] hover:text-[#17324D]"
                    aria-label={`Actions for ${employee.name}`}
                    onClick={() => {
                      console.log(
                        "Employee actions:",
                        employee
                      );
                    }}
                  >
                    ⋮
                  </button>
                </div>
              </div>
            )
          )}
        </>
      )}

      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="flex h-[44px] items-center justify-between px-3">

        <p className="text-[8px] text-[#71869A]">
          Showing{" "}
          <span className="font-semibold text-[#17324D]">
            {startItem}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-[#17324D]">
            {endItem}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[#17324D]">
            {totalEmployees}
          </span>{" "}
          employees
        </p>

        {/* =================================================
            PAGINATION
        ================================================= */}

        <div className="flex items-center gap-2">

          {/* Previous */}

          <button
            type="button"
            disabled={
              currentPage ===
                1 ||
              totalEmployees ===
                0
            }
            onClick={() =>
              handlePageChange(
                currentPage - 1
              )
            }
            className="flex h-[22px] w-[22px] items-center justify-center rounded text-[14px] text-[#71869A] transition hover:bg-[#F3F6F9] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            ‹
          </button>

          {/* Page Numbers */}

          {Array.from(
            {
              length:
                totalPages,
            },
            (_, index) =>
              index + 1
          )
            .filter((page) => {
              if (
                totalPages <=
                5
              ) {
                return true;
              }

              if (
                page === 1
              ) {
                return true;
              }

              if (
                page ===
                totalPages
              ) {
                return true;
              }

              return (
                page >=
                  currentPage -
                    1 &&
                page <=
                  currentPage +
                    1
              );
            })
            .map(
              (
                page,
                index,
                array
              ) => {
                const previousPage =
                  array[
                    index - 1
                  ];

                const showDots =
                  previousPage &&
                  page -
                    previousPage >
                    1;

                return (
                  <span
                    key={page}
                    className="flex items-center gap-2"
                  >
                    {showDots && (
                      <span className="text-[8px] text-[#71869A]">
                        ...
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        handlePageChange(
                          page
                        )
                      }
                      className={`flex h-[23px] w-[23px] items-center justify-center rounded-[4px] text-[8px] font-semibold transition ${
                        currentPage ===
                        page
                          ? "bg-[#061C35] text-white"
                          : "text-[#64798C] hover:bg-[#F3F6F9]"
                      }`}
                    >
                      {page}
                    </button>
                  </span>
                );
              }
            )}

          {/* Next */}

          <button
            type="button"
            disabled={
              currentPage ===
                totalPages ||
              totalEmployees ===
                0
            }
            onClick={() =>
              handlePageChange(
                currentPage + 1
              )
            }
            className="flex h-[22px] w-[22px] items-center justify-center rounded text-[14px] text-[#71869A] transition hover:bg-[#F3F6F9] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
};

export default EmployeeDirectory;