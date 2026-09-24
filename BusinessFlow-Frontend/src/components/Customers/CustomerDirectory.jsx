import { useCallback, useEffect, useState } from "react";

import {
  Filter,
  MoreVertical,
} from "lucide-react";

import Card from "../common/Card";
import Badge from "../common/Badge";
import IconButton from "../common/IconButton";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const statusStyles = {
  Active:
    "bg-[#EAF8F0] text-[#20A45A] border-[#C9EED8]",

  Pending:
    "bg-[#FFF4E5] text-[#E58A13] border-[#F6D9AE]",

  Inactive:
    "bg-[#FFECEE] text-[#E34D59] border-[#F6C9CD]",
};

const CustomerDirectory = () => {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  /*
  |--------------------------------------------------------------------------
  | Fetch Customers
  |--------------------------------------------------------------------------
  */

  const fetchCustomers = useCallback(
    async (requestedPage = 1) => {
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

        const params = new URLSearchParams();

        params.set("page", requestedPage);
        params.set("limit", "6");

        const response = await fetch(
          `${API_BASE_URL}/api/customers?${params.toString()}`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to load customers."
          );
        }

        const data = Array.isArray(result?.data)
          ? result.data
          : [];

        setCustomers(data);

        setPagination(
          result?.pagination || {
            page: requestedPage,
            limit: 6,
            total: data.length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage:
              requestedPage > 1,
          }
        );

        setPage(requestedPage);
      } catch (err) {
        console.error(
          "Customer Directory Fetch Error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load customers."
        );

        setCustomers([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchCustomers(1);
  }, [fetchCustomers]);

  /*
  |--------------------------------------------------------------------------
  | Previous Page
  |--------------------------------------------------------------------------
  */

  const handlePrevious = () => {
    if (
      loading ||
      !pagination.hasPreviousPage
    ) {
      return;
    }

    fetchCustomers(page - 1);
  };

  /*
  |--------------------------------------------------------------------------
  | Next Page
  |--------------------------------------------------------------------------
  */

  const handleNext = () => {
    if (
      loading ||
      !pagination.hasNextPage
    ) {
      return;
    }

    fetchCustomers(page + 1);
  };

  /*
  |--------------------------------------------------------------------------
  | Format Revenue
  |--------------------------------------------------------------------------
  */

  const formatRevenue = (value) => {
    const amount = Number(value) || 0;

    return `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  /*
  |--------------------------------------------------------------------------
  | Company Logo
  |--------------------------------------------------------------------------
  |
  | Backend currently does not contain a logo field.
  | So we use company initials as fallback.
  |
  */

  const getInitials = (companyName) => {
    if (!companyName) {
      return "C";
    }

    const words = companyName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 1) {
      return words[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  };

  /*
  |--------------------------------------------------------------------------
  | Loading Skeleton
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <Card
        className="
          w-full
          overflow-hidden
          rounded-[9px]
          border-[#DCE5ED]
          bg-white
        "
      >
        {/* Header */}
        <div
          className="
            flex
            h-[48px]
            items-center
            justify-between
            border-b
            border-[#DDE5EC]
            px-[14px]
          "
        >
          <h2
            className="
              text-[12px]
              font-bold
              text-[#102F4A]
            "
          >
            Customer Directory
          </h2>

          <div className="flex items-center gap-[7px]">
            <IconButton
              icon={Filter}
              label="Filter customers"
              size={14}
              className="h-6 w-6 rounded-md"
            />

            <IconButton
              icon={MoreVertical}
              label="More options"
              size={14}
              className="h-6 w-6 rounded-md"
            />
          </div>
        </div>

        {/* Skeleton rows */}
        <div>
          {[1, 2, 3, 4, 5, 6].map(
            (item) => (
              <div
                key={item}
                className="
                  flex
                  h-[48px]
                  items-center
                  gap-4
                  border-b
                  border-[#E3E9EE]
                  px-[14px]
                "
              >
                <div className="flex w-[36%] items-center gap-[8px]">
                  <div className="h-[24px] w-[24px] animate-pulse rounded-[4px] bg-[#EDF2F7]" />

                  <div>
                    <div className="h-[8px] w-[90px] animate-pulse rounded bg-[#EDF2F7]" />

                    <div className="mt-[4px] h-[6px] w-[65px] animate-pulse rounded bg-[#F1F5F9]" />
                  </div>
                </div>

                <div className="w-[17%]">
                  <div className="h-[14px] w-[48px] animate-pulse rounded-full bg-[#EDF2F7]" />
                </div>

                <div className="w-[25%]">
                  <div className="h-[7px] w-[80px] animate-pulse rounded bg-[#F1F5F9]" />
                </div>

                <div className="w-[22%]">
                  <div className="h-[7px] w-[55px] animate-pulse rounded bg-[#F1F5F9]" />
                </div>
              </div>
            )
          )}
        </div>

        {/* Pagination skeleton */}
        <div className="flex h-[38px] items-center justify-between px-[10px]">
          <div className="h-[7px] w-[90px] animate-pulse rounded bg-[#F1F5F9]" />

          <div className="h-[19px] w-[100px] animate-pulse rounded bg-[#F1F5F9]" />
        </div>
      </Card>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error State
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <Card
        className="
          w-full
          overflow-hidden
          rounded-[9px]
          border-[#DCE5ED]
          bg-white
        "
      >
        <div
          className="
            flex
            h-[48px]
            items-center
            justify-between
            border-b
            border-[#DDE5EC]
            px-[14px]
          "
        >
          <h2
            className="
              text-[12px]
              font-bold
              text-[#102F4A]
            "
          >
            Customer Directory
          </h2>

          <div className="flex items-center gap-[7px]">
            <IconButton
              icon={Filter}
              label="Filter customers"
              size={14}
              className="h-6 w-6 rounded-md"
            />

            <IconButton
              icon={MoreVertical}
              label="More options"
              size={14}
              className="h-6 w-6 rounded-md"
            />
          </div>
        </div>

        <div className="flex min-h-[180px] items-center justify-center px-4">
          <div className="text-center">
            <p className="text-[11px] font-semibold text-[#C24141]">
              Unable to load customers
            </p>

            <p className="mt-1 text-[9px] text-[#8A9AA8]">
              {error}
            </p>

            <button
              type="button"
              onClick={() => fetchCustomers(page)}
              className="
                mt-3
                rounded-[5px]
                bg-[#0B3D6B]
                px-3
                py-1.5
                text-[8px]
                font-semibold
                text-white
                transition
                hover:bg-[#082F54]
              "
            >
              Try Again
            </button>
          </div>
        </div>
      </Card>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main UI
  |--------------------------------------------------------------------------
  */

  return (
    <Card
      className="
        w-full
        overflow-hidden
        rounded-[9px]
        border-[#DCE5ED]
        bg-white
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          h-[48px]
          items-center
          justify-between
          border-b
          border-[#DDE5EC]
          px-[14px]
        "
      >
        <h2
          className="
            text-[12px]
            font-bold
            text-[#102F4A]
          "
        >
          Customer Directory
        </h2>

        <div className="flex items-center gap-[7px]">
          <IconButton
            icon={Filter}
            label="Filter customers"
            size={14}
            className="h-6 w-6 rounded-md"
          />

          <IconButton
            icon={MoreVertical}
            label="More options"
            size={14}
            className="h-6 w-6 rounded-md"
          />
        </div>
      </div>

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {customers.length === 0 ? (
        <div className="flex min-h-[180px] items-center justify-center">
          <div className="text-center">
            <p className="text-[11px] font-semibold text-[#4D657A]">
              No customers found
            </p>

            <p className="mt-1 text-[9px] text-[#8A9AA8]">
              Add your first customer to see them here.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* =====================================================
              TABLE
          ====================================================== */}

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[560px] table-fixed border-collapse">

              {/* TABLE HEAD */}

              <thead>
                <tr className="h-[38px] border-b border-[#DDE5EC]">
                  <th
                    className="
                      w-[36%]
                      px-[14px]
                      text-left
                      align-middle
                      text-[8px]
                      font-bold
                      uppercase
                      leading-[11px]
                      tracking-[0.4px]
                      text-[#63788B]
                    "
                  >
                    Customer Name & Company
                  </th>

                  <th
                    className="
                      w-[17%]
                      px-[8px]
                      text-left
                      text-[8px]
                      font-bold
                      uppercase
                      tracking-[0.4px]
                      text-[#63788B]
                    "
                  >
                    Status
                  </th>

                  <th
                    className="
                      w-[25%]
                      px-[8px]
                      text-left
                      text-[8px]
                      font-bold
                      uppercase
                      leading-[11px]
                      tracking-[0.4px]
                      text-[#63788B]
                    "
                  >
                    Account
                    <br />
                    Manager
                  </th>

                  <th
                    className="
                      w-[22%]
                      px-[8px]
                      text-left
                      text-[8px]
                      font-bold
                      uppercase
                      leading-[11px]
                      tracking-[0.4px]
                      text-[#63788B]
                    "
                  >
                    Total
                    <br />
                    Revenue
                  </th>
                </tr>
              </thead>

              {/* TABLE BODY */}

              <tbody>
                {customers.map((customer) => {
                  const companyName =
                    customer.companyName ||
                    "Unnamed Company";

                  const manager =
                    customer.accountManager?.name ||
                    "Unassigned";

                  const status =
                    customer.status || "Pending";

                  return (
                    <tr
                      key={customer.id}
                      className="
                        h-[48px]
                        border-b
                        border-[#E3E9EE]
                        transition-colors
                        duration-150
                        hover:bg-[#FAFCFE]
                      "
                    >
                      {/* CUSTOMER */}

                      <td className="px-[14px]">
                        <div className="flex items-center gap-[8px]">

                          {/* Company Initials */}

                          <div
                            className="
                              flex
                              h-[24px]
                              w-[24px]
                              shrink-0
                              items-center
                              justify-center
                              overflow-hidden
                              rounded-[4px]
                              border
                              border-[#E1E8EE]
                              bg-[#F7F9FC]
                              text-[7px]
                              font-bold
                              text-[#52708B]
                            "
                          >
                            {getInitials(
                              companyName
                            )}
                          </div>

                          <div className="min-w-0">
                            <p
                              className="
                                truncate
                                text-[9px]
                                font-semibold
                                leading-[12px]
                                text-[#17324D]
                              "
                            >
                              {companyName}
                            </p>

                            <p
                              className="
                                mt-[1px]
                                truncate
                                text-[7px]
                                font-medium
                                leading-[10px]
                                text-[#8A9AA8]
                              "
                            >
                              {customer.industry ||
                                customer.jobTitle ||
                                "Customer"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* STATUS */}

                      <td className="px-[8px]">
                        <Badge
                          className={`
                            inline-flex
                            rounded-full
                            border
                            px-[7px]
                            py-[2px]
                            text-[7px]
                            font-semibold
                            leading-[10px]
                            ${
                              statusStyles[
                                status
                              ] ||
                              "bg-[#F3F6F9] text-[#63788B] border-[#DCE5ED]"
                            }
                          `}
                        >
                          {status}
                        </Badge>
                      </td>

                      {/* MANAGER */}

                      <td
                        className="
                          px-[8px]
                          text-[8px]
                          font-medium
                          text-[#63788B]
                        "
                      >
                        {manager}
                      </td>

                      {/* REVENUE */}

                      <td
                        className="
                          px-[8px]
                          text-[8px]
                          font-semibold
                          text-[#17324D]
                        "
                      >
                        {formatRevenue(
                          customer.totalRevenue
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* =====================================================
              PAGINATION
          ====================================================== */}

          <div
            className="
              flex
              h-[38px]
              items-center
              justify-between
              border-t
              border-[#DDE5EC]
              px-[10px]
            "
          >
            <span
              className="
                text-[7px]
                font-medium
                text-[#8A9AA8]
              "
            >
              Showing{" "}
              {pagination.total === 0
                ? 0
                : (page - 1) *
                    pagination.limit +
                  1}
              -
              {Math.min(
                page * pagination.limit,
                pagination.total
              )}{" "}
              of {pagination.total.toLocaleString("en-US")}
            </span>

            <div className="flex items-center gap-[5px]">

              {/* PREV */}

              <button
                type="button"
                onClick={handlePrevious}
                disabled={
                  loading ||
                  !pagination.hasPreviousPage
                }
                className={`
                  px-[5px]
                  text-[7px]
                  font-medium
                  transition
                  ${
                    !pagination.hasPreviousPage
                      ? "cursor-not-allowed text-[#C0C9D1]"
                      : "text-[#63788B] hover:text-[#173B5C]"
                  }
                `}
              >
                Prev
              </button>

              {/* CURRENT PAGE */}

              <button
                type="button"
                className="
                  flex
                  h-[19px]
                  w-[19px]
                  items-center
                  justify-center
                  rounded-[4px]
                  bg-[#0B3D6B]
                  text-[7px]
                  font-semibold
                  text-white
                "
              >
                {page}
              </button>

              {/* NEXT */}

              <button
                type="button"
                onClick={handleNext}
                disabled={
                  loading ||
                  !pagination.hasNextPage
                }
                className={`
                  px-[5px]
                  text-[7px]
                  font-medium
                  transition
                  ${
                    !pagination.hasNextPage
                      ? "cursor-not-allowed text-[#C0C9D1]"
                      : "text-[#63788B] hover:text-[#173B5C]"
                  }
                `}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default CustomerDirectory;