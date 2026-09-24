import { useEffect, useState } from "react";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

const formatCurrency = (value) => {
  const amount = Number(value) || 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const customerDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (
    customerDate.getTime() ===
    today.getTime()
  ) {
    return "Today";
  }

  if (
    customerDate.getTime() ===
    yesterday.getTime()
  ) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const formatFollowUp = (followUp) => {
  if (!followUp?.dueAt) {
    return "—";
  }

  const date = new Date(followUp.dueAt);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const followUpDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (
    followUpDate.getTime() ===
    today.getTime()
  ) {
    return "Today ⚠";
  }

  if (
    followUpDate.getTime() ===
    tomorrow.getTime()
  ) {
    return "Tomorrow";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const CustomerList = ({
  search = "",
  status = "",
  sort = "recent",
  onCustomerClick,
}) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] =
    useState([]);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH CUSTOMERS
  // =====================================================

  const fetchCustomers = async () => {
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

      const params = new URLSearchParams();

      params.set("page", page);
      params.set("limit", 5);

      if (search.trim()) {
        params.set(
          "search",
          search.trim()
        );
      }

      if (status) {
        params.set("status", status);
      }

      if (sort) {
        params.set("sort", sort);
      }

      const response = await fetch(
        `${API_URL}/customers/me?${params.toString()}`,
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
            "Failed to fetch customers."
        );
      }

      setCustomers(result.data || []);

      setPagination(
        result.pagination || {
          page,
          limit: 5,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      );

      // Remove selections that are no longer on page
      setSelectedCustomers([]);
    } catch (err) {
      console.error(
        "Customer List Error:",
        err
      );

      setError(
        err.message ||
          "Failed to fetch customers."
      );

      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH WHEN PAGE / FILTERS CHANGE
  // =====================================================

  useEffect(() => {
    fetchCustomers();
  }, [page, search, status, sort]);

  // =====================================================
  // RESET PAGE WHEN SEARCH / FILTER CHANGES
  // =====================================================

  useEffect(() => {
    setPage(1);
  }, [search, status, sort]);

  // =====================================================
  // SELECT CUSTOMER
  // =====================================================

  const toggleCustomer = (id) => {
    setSelectedCustomers((prev) =>
      prev.includes(id)
        ? prev.filter(
            (item) => item !== id
          )
        : [...prev, id]
    );
  };

  // =====================================================
  // SELECT ALL
  // =====================================================

  const toggleAll = () => {
    if (
      customers.length > 0 &&
      selectedCustomers.length ===
        customers.length
    ) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(
        customers.map(
          (customer) =>
            customer.id ||
            customer._id
        )
      );
    }
  };

  // =====================================================
  // PAGINATION
  // =====================================================

  const goToPreviousPage = () => {
    if (pagination.hasPreviousPage) {
      setPage((prev) =>
        Math.max(prev - 1, 1)
      );
    }
  };

  const goToNextPage = () => {
    if (pagination.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <=
        pagination.totalPages
    ) {
      setPage(pageNumber);
    }
  };

  // =====================================================
  // PAGE NUMBERS
  // =====================================================

  const getPageNumbers = () => {
    const totalPages =
      pagination.totalPages;

    if (!totalPages) {
      return [];
    }

    if (totalPages <= 3) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (page <= 2) {
      return [1, 2, 3];
    }

    if (page >= totalPages - 1) {
      return [
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      page - 1,
      page,
      page + 1,
    ];
  };

  const pageNumbers =
    getPageNumbers();

  // =====================================================
  // SHOWING TEXT
  // =====================================================

  const showingFrom =
    pagination.total === 0
      ? 0
      : (pagination.page - 1) *
          pagination.limit +
        1;

  const showingTo =
    pagination.total === 0
      ? 0
      : Math.min(
          pagination.page *
            pagination.limit,
          pagination.total
        );

  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
        shadow-[0_1px_2px_rgba(7,29,53,0.03)]
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          h-[45px]
          items-center
          justify-between
          border-b
          border-[#DCE5ED]
          px-3
        "
      >
        <h2
          className="
            text-[13px]
            font-bold
            text-[#102F4A]
          "
        >
          Customer List
        </h2>

        <button
          type="button"
          onClick={() => setPage(1)}
          className="
            text-[8px]
            font-semibold
            text-[#315D80]
            transition-colors
            hover:text-[#0B3D6B]
          "
        >
          View All
        </button>
      </div>

      {/* =====================================================
          TABLE
      ====================================================== */}

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr
              className="
                h-[32px]
                border-b
                border-[#DCE5ED]
                bg-[#F8FAFC]
              "
            >
              {/* Checkbox */}

              <th className="w-[38px] px-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    customers.length > 0 &&
                    selectedCustomers.length ===
                      customers.length
                  }
                  onChange={toggleAll}
                  disabled={
                    customers.length === 0
                  }
                  className="
                    h-[11px]
                    w-[11px]
                    cursor-pointer
                    rounded-[2px]
                    border-[#D4DEE7]
                    accent-[#0B3D6B]
                  "
                />
              </th>

              <TableHeader>
                Customer
              </TableHeader>

              <TableHeader>
                Company
              </TableHeader>

              <TableHeader>
                Status
              </TableHeader>

              <TableHeader>
                Last Contact
              </TableHeader>

              <TableHeader>
                Next Follow-up
              </TableHeader>

              <TableHeader>
                Value
              </TableHeader>

              <th
                className="
                  px-2
                  text-left
                  text-[8px]
                  font-semibold
                  text-[#60758A]
                "
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {/* =================================================
                LOADING
            ================================================== */}

            {loading && (
              <tr>
                <td
                  colSpan="8"
                  className="h-[210px] text-center"
                >
                  <span className="text-[9px] text-[#8495A5]">
                    Loading customers...
                  </span>
                </td>
              </tr>
            )}

            {/* =================================================
                ERROR
            ================================================== */}

            {!loading && error && (
              <tr>
                <td
                  colSpan="8"
                  className="h-[210px] text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-[9px] text-[#EF4444]">
                      {error}
                    </p>

                    <button
                      type="button"
                      onClick={fetchCustomers}
                      className="
                        mt-2
                        text-[8px]
                        font-semibold
                        text-[#079BEA]
                        hover:text-[#0B3D6B]
                      "
                    >
                      Try Again
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {/* =================================================
                EMPTY
            ================================================== */}

            {!loading &&
              !error &&
              customers.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="h-[210px] text-center"
                  >
                    <p className="text-[9px] text-[#8495A5]">
                      No customers found.
                    </p>
                  </td>
                </tr>
              )}

            {/* =================================================
                CUSTOMER ROWS
            ================================================== */}

            {!loading &&
              !error &&
              customers.map(
                (customer) => {
                  const customerId =
                    customer.id ||
                    customer._id;

                  const selected =
                    selectedCustomers.includes(
                      customerId
                    );

                  const isAtRisk =
                    customer.status ===
                      "At Risk" ||
                    customer.healthStatus ===
                      "At Risk";

                  const initials =
                    customer.initials ||
                    `${customer.firstName?.[0] || ""}${
                      customer.lastName?.[0] || ""
                    }`.toUpperCase();

                  return (
                    <tr
                      key={customerId}
                      onClick={() =>
                        onCustomerClick?.(
                          customer
                        )
                      }
                      className={`
                        h-[42px]
                        border-b
                        border-[#E2E9EF]
                        transition-colors
                        ${
                          isAtRisk
                            ? "bg-[#FFF8F8]"
                            : "bg-white hover:bg-[#FAFCFE]"
                        }
                        ${
                          onCustomerClick
                            ? "cursor-pointer"
                            : ""
                        }
                      `}
                    >
                      {/* Checkbox */}

                      <td
                        className="px-3"
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() =>
                            toggleCustomer(
                              customerId
                            )
                          }
                          className="
                            h-[11px]
                            w-[11px]
                            cursor-pointer
                            rounded-[2px]
                            border-[#D4DEE7]
                            accent-[#0B3D6B]
                          "
                        />
                      </td>

                      {/* Customer */}

                      <td className="px-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`
                              flex
                              h-[24px]
                              w-[24px]
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              text-[7px]
                              font-semibold
                              ${
                                isAtRisk
                                  ? "bg-[#FFE1C7] text-[#D97706]"
                                  : customer.status ===
                                      "Inactive"
                                    ? "bg-[#E7E9ED] text-[#737B86]"
                                    : "bg-[#BBD6FF] text-[#315D80]"
                              }
                            `}
                          >
                            {initials}
                          </div>

                          <span
                            className="
                              whitespace-nowrap
                              text-[9px]
                              font-semibold
                              text-[#17324D]
                            "
                          >
                            {customer.name}
                          </span>
                        </div>
                      </td>

                      {/* Company */}

                      <td
                        className="
                          whitespace-nowrap
                          px-2
                          text-[8px]
                          text-[#60758A]
                        "
                      >
                        {customer.companyName ||
                          "—"}
                      </td>

                      {/* Status */}

                      <td className="px-2">
                        <StatusBadge
                          status={
                            customer.status
                          }
                        />
                      </td>

                      {/* Last Contact */}

                      <td
                        className="
                          whitespace-nowrap
                          px-2
                          text-[8px]
                          text-[#60758A]
                        "
                      >
                        {formatDate(
                          customer.lastContact ||
                            customer.lastActivityAt
                        )}
                      </td>

                      {/* Next Follow-up */}

                      <td
                        className={`
                          whitespace-nowrap
                          px-2
                          text-[8px]
                          ${
                            isAtRisk &&
                            customer.nextFollowUp
                              ? "font-semibold text-[#EF4444]"
                              : customer.nextFollowUp
                                  ? "font-semibold text-[#17324D]"
                                  : "text-[#60758A]"
                          }
                        `}
                      >
                        {formatFollowUp(
                          customer.nextFollowUp
                        )}
                      </td>

                      {/* Value */}

                      <td
                        className="
                          whitespace-nowrap
                          px-2
                          text-[9px]
                          font-semibold
                          text-[#17324D]
                        "
                      >
                        {formatCurrency(
                          customer.accountValue
                        )}
                      </td>

                      {/* Actions */}

                      <td
                        className="px-2"
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >
                        <button
                          type="button"
                          aria-label={`Actions for ${
                            customer.name
                          }`}
                          className="
                            flex
                            h-6
                            w-6
                            items-center
                            justify-center
                            rounded-[4px]
                            text-[#718599]
                            transition-colors
                            hover:bg-[#F1F5F8]
                            hover:text-[#17324D]
                          "
                        >
                          <MoreHorizontal
                            size={13}
                            strokeWidth={1.8}
                          />
                        </button>
                      </td>
                    </tr>
                  );
                }
              )}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          FOOTER / PAGINATION
      ====================================================== */}

      <div
        className="
          flex
          min-h-[40px]
          items-center
          justify-between
          gap-3
          px-3
          py-2
        "
      >
        {/* Showing */}

        <p
          className="
            text-[8px]
            text-[#60758A]
          "
        >
          Showing {showingFrom} to{" "}
          {showingTo} of{" "}
          {pagination.total} entries
        </p>

        {/* Pagination */}

        <div className="flex items-center gap-1">
          {/* Previous */}

          <button
            type="button"
            disabled={
              !pagination.hasPreviousPage ||
              loading
            }
            onClick={
              goToPreviousPage
            }
            className={`
              flex
              h-[23px]
              min-w-[30px]
              items-center
              justify-center
              rounded-[4px]
              border
              border-[#E2E9EF]
              bg-white
              px-2
              text-[7px]
              font-medium
              ${
                pagination.hasPreviousPage
                  ? "cursor-pointer text-[#60758A] hover:bg-[#F3F6F9]"
                  : "cursor-not-allowed text-[#A7B3BE]"
              }
            `}
          >
            <ChevronLeft size={10} />

            <span>
              Prev
            </span>
          </button>

          {/* Page Numbers */}

          {pageNumbers.map(
            (pageNumber) => (
              <PaginationButton
                key={pageNumber}
                active={
                  pageNumber === page
                }
                onClick={() =>
                  goToPage(
                    pageNumber
                  )
                }
              >
                {pageNumber}
              </PaginationButton>
            )
          )}

          {/* Ellipsis */}

          {pagination.totalPages >
            3 &&
            page <
              pagination.totalPages -
                1 && (
              <span
                className="
                  px-1
                  text-[8px]
                  text-[#8495A5]
                "
              >
                ...
              </span>
            )}

          {/* Next */}

          <button
            type="button"
            disabled={
              !pagination.hasNextPage ||
              loading
            }
            onClick={goToNextPage}
            className={`
              flex
              h-[23px]
              min-w-[30px]
              items-center
              justify-center
              gap-0.5
              rounded-[4px]
              border
              border-[#DCE5ED]
              bg-white
              px-2
              text-[7px]
              font-medium
              ${
                pagination.hasNextPage
                  ? "cursor-pointer text-[#60758A] hover:bg-[#F3F6F9]"
                  : "cursor-not-allowed text-[#A7B3BE]"
              }
            `}
          >
            <span>
              Next
            </span>

            <ChevronRight
              size={10}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   TABLE HEADER
========================================================= */

const TableHeader = ({
  children,
}) => {
  return (
    <th
      className="
        px-2
        text-left
        text-[8px]
        font-semibold
        text-[#60758A]
      "
    >
      {children}
    </th>
  );
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({
  status,
}) => {
  const styles = {
    Active:
      "bg-[#E8F8EF] text-[#20A65A] border-[#CBEED9]",

    "At Risk":
      "bg-[#FFE9E9] text-[#EF4444] border-[#FFD0D0]",

    Inactive:
      "bg-[#F1F3F5] text-[#84909C] border-[#E2E5E8]",

    Pending:
      "bg-[#FFF6E8] text-[#E88700] border-[#FFE3B8]",
  };

  const statusClass =
    styles[status] ||
    "bg-[#F1F3F5] text-[#84909C] border-[#E2E5E8]";

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-2
        py-[2px]
        text-[7px]
        font-semibold
        ${statusClass}
      `}
    >
      {status || "Unknown"}
    </span>
  );
};

/* =========================================================
   PAGINATION BUTTON
========================================================= */

const PaginationButton = ({
  children,
  active = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        h-[23px]
        min-w-[23px]
        items-center
        justify-center
        rounded-[4px]
        border
        px-1.5
        text-[7px]
        font-medium
        transition-colors
        ${
          active
            ? "border-[#A9D1FF] bg-[#A9D1FF] text-[#173B5C]"
            : "border-[#DCE5ED] bg-white text-[#60758A] hover:bg-[#F3F6F9]"
        }
      `}
    >
      {children}
    </button>
  );
};

export default CustomerList;