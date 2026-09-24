import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import Card from "../common/Card";
import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import IconButton from "../common/IconButton";
import SearchInput from "../common/SearchInput";

const API_URL = "http://localhost:5000/api";

// =====================================================
// HELPERS
// =====================================================

const getBadgeVariant = (status) => {
  switch (status) {
    case "New":
      return "info";

    case "Contacted":
      return "warning";

    case "Qualified":
      return "success";

    case "Proposal Sent":
      return "primary";

    case "Converted":
      return "success";

    case "Lost":
      return "danger";

    default:
      return "default";
  }
};

const formatCurrency = (value) => {
  const amount = Number(value) || 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatActivityTime = (dateValue) => {
  if (!dateValue) {
    return "No activity";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "No activity";
  }

  const now = new Date();

  const difference =
    now.getTime() - date.getTime();

  const seconds = Math.floor(
    difference / 1000
  );

  const minutes = Math.floor(
    seconds / 60
  );

  const hours = Math.floor(
    minutes / 60
  );

  const days = Math.floor(
    hours / 24
  );

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} ${
      minutes === 1 ? "minute" : "minutes"
    } ago`;
  }

  if (hours < 24) {
    return `${hours} ${
      hours === 1 ? "hour" : "hours"
    } ago`;
  }

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !==
        now.getFullYear()
          ? "numeric"
          : undefined,
    }
  );
};

const getLeadAvatar = (lead) => {
  if (lead.avatar) {
    return lead.avatar;
  }

  if (lead.profileImage) {
    return lead.profileImage;
  }

  return null;
};

// =====================================================
// COMPONENT
// =====================================================

const RecentLeads = () => {
  const [leads, setLeads] = useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ===================================================
  // FETCH LEADS
  // ===================================================

  const fetchLeads = async (
    searchValue = "",
    signal
  ) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem(
        "businessflow_token"
      );

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const params =
        new URLSearchParams();

      params.set("page", "1");
      params.set("limit", "6");

      if (searchValue.trim()) {
        params.set(
          "search",
          searchValue.trim()
        );
      }

      const response = await fetch(
        `${API_URL}/admin/leads?${params.toString()}`,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          signal,
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Unable to load recent leads."
        );
      }

      // =================================================
      // HANDLE DIFFERENT POSSIBLE RESPONSE SHAPES
      // =================================================

      const responseData =
        result.data;

      let leadList = [];

      if (
        Array.isArray(responseData)
      ) {
        leadList = responseData;
      } else if (
        Array.isArray(
          responseData?.leads
        )
      ) {
        leadList =
          responseData.leads;
      } else if (
        Array.isArray(
          responseData?.data
        )
      ) {
        leadList =
          responseData.data;
      }

      setLeads(leadList);
    } catch (err) {
      if (
        err.name === "AbortError"
      ) {
        return;
      }

      console.error(
        "Recent Leads Fetch Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load recent leads."
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    const controller =
      new AbortController();

    fetchLeads(
      "",
      controller.signal
    );

    return () => {
      controller.abort();
    };
  }, []);

  // ===================================================
  // SEARCH
  // ===================================================

  useEffect(() => {
    const controller =
      new AbortController();

    const timeout =
      setTimeout(() => {
        fetchLeads(
          search,
          controller.signal
        );
      }, 350);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search]);

  // ===================================================
  // RETRY
  // ===================================================

  const handleRetry = () => {
    const controller =
      new AbortController();

    fetchLeads(
      search,
      controller.signal
    );
  };

  // ===================================================
  // VIEW ALL
  // ===================================================

  const handleViewAll = () => {
    // Keep navigation logic ready.
    // Add your leads route here when needed.
    console.log(
      "Navigate to all leads"
    );
  };

  // ===================================================
  // OPEN LEAD
  // ===================================================

  const handleOpenLead = (lead) => {
    console.log(
      "Open lead:",
      lead
    );
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <Card className="w-full overflow-hidden">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          h-[60px]
          items-center
          justify-between
          border-b
          border-[#DCE5ED]
          px-[14px]
        "
      >
        {/* Title */}

        <h2
          className="
            text-[13px]
            font-bold
            tracking-[-0.1px]
            text-[#102F4A]
          "
        >
          Recent Leads
        </h2>

        {/* Actions */}

        <div className="flex items-center gap-2">
          <SearchInput
            placeholder="Search leads..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            className="w-[200px]"
          />

          <IconButton
            icon={SlidersHorizontal}
            label="Filter leads"
            size={14}
            className="
              h-[30px]
              w-[30px]
              rounded-[6px]
              border
              border-[#D8E2EA]
              bg-white
              text-[#526B80]
              hover:bg-[#F5F8FB]
            "
          />

          <button
            type="button"
            onClick={handleViewAll}
            className="
              ml-0.5
              whitespace-nowrap
              text-[9px]
              font-semibold
              text-[#193B5B]
              transition-colors
              hover:text-[#0B3D6B]
            "
          >
            View All
          </button>
        </div>
      </div>

      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr
                className="
                  h-[36px]
                  border-b
                  border-[#DCE5ED]
                  bg-[#FCFDFE]
                "
              >
                <th className="w-[27%] px-[14px] text-left">
                  <span className="text-[8px] font-semibold tracking-[0.5px] text-[#657A8D]">
                    NAME &amp; COMPANY
                  </span>
                </th>

                <th className="w-[16%] px-2 text-left">
                  <span className="text-[8px] font-semibold tracking-[0.5px] text-[#657A8D]">
                    VALUE
                  </span>
                </th>

                <th className="w-[16%] px-2 text-left">
                  <span className="text-[8px] font-semibold tracking-[0.5px] text-[#657A8D]">
                    STATUS
                  </span>
                </th>

                <th className="w-[17%] px-2 text-left">
                  <span className="text-[8px] font-semibold tracking-[0.5px] text-[#657A8D]">
                    ASSIGNED TO
                  </span>
                </th>

                <th className="w-[17%] px-2 text-left">
                  <span className="text-[8px] font-semibold tracking-[0.5px] text-[#657A8D]">
                    LAST ACTIVITY
                  </span>
                </th>

                <th className="w-[7%] px-2 text-left">
                  <span className="text-[8px] font-semibold tracking-[0.5px] text-[#657A8D]">
                    ACTION
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3, 4, 5, 6].map(
                (item) => (
                  <tr
                    key={item}
                    className="
                      h-[52px]
                      border-b
                      border-[#E2E9EF]
                    "
                  >
                    <td className="px-[14px]">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 animate-pulse rounded-full bg-[#EDF2F6]" />

                        <div>
                          <div className="h-2.5 w-[90px] animate-pulse rounded bg-[#EDF2F6]" />

                          <div className="mt-1.5 h-2 w-[65px] animate-pulse rounded bg-[#F1F4F7]" />
                        </div>
                      </div>
                    </td>

                    <td className="px-2">
                      <div className="h-2.5 w-[55px] animate-pulse rounded bg-[#EDF2F6]" />
                    </td>

                    <td className="px-2">
                      <div className="h-4 w-[45px] animate-pulse rounded-full bg-[#EDF2F6]" />
                    </td>

                    <td className="px-2">
                      <div className="h-2.5 w-[60px] animate-pulse rounded bg-[#EDF2F6]" />
                    </td>

                    <td className="px-2">
                      <div className="h-2.5 w-[65px] animate-pulse rounded bg-[#EDF2F6]" />
                    </td>

                    <td className="px-2">
                      <div className="h-2.5 w-[18px] animate-pulse rounded bg-[#EDF2F6]" />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* =====================================================
          ERROR
      ====================================================== */}

      {!loading && error && (
        <div className="flex min-h-[250px] flex-col items-center justify-center px-4 text-center">
          <p className="text-[11px] font-semibold text-[#102F4A]">
            Unable to load leads
          </p>

          <p className="mt-1 max-w-[350px] text-[9px] font-medium text-[#8192A2]">
            {error}
          </p>

          <button
            type="button"
            onClick={handleRetry}
            className="
              mt-3
              rounded-md
              border
              border-[#C9D9E8]
              bg-white
              px-3
              py-1.5
              text-[9px]
              font-semibold
              text-[#0B3D6B]
              transition
              hover:bg-[#F5F9FD]
            "
          >
            Retry
          </button>
        </div>
      )}

      {/* =====================================================
          EMPTY
      ====================================================== */}

      {!loading &&
        !error &&
        leads.length === 0 && (
          <div className="flex min-h-[250px] flex-col items-center justify-center px-4 text-center">
            <p className="text-[11px] font-semibold text-[#102F4A]">
              No leads found
            </p>

            <p className="mt-1 text-[9px] font-medium text-[#8192A2]">
              {search
                ? "Try a different search."
                : "Create your first lead to see it here."}
            </p>
          </div>
        )}

      {/* =====================================================
          TABLE
      ====================================================== */}

      {!loading &&
        !error &&
        leads.length > 0 && (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              {/* Table Header */}

              <thead>
                <tr
                  className="
                    h-[36px]
                    border-b
                    border-[#DCE5ED]
                    bg-[#FCFDFE]
                  "
                >
                  <th className="w-[27%] px-[14px] text-left">
                    <span className="text-[8px] font-semibold tracking-[0.5px] text-[#657A8D]">
                      NAME &amp; COMPANY
                    </span>
                  </th>

                  <th className="w-[16%] px-2 text-left">
                    <span className="text-[8px] font-semibold tracking-[0.5px] text-[#657A8D]">
                      VALUE
                    </span>
                  </th>

                  <th className="w-[16%] px-2 text-left">
                    <span className="text-[8px] font-semibold tracking-[0.5px] text-[#657A8D]">
                      STATUS
                    </span>
                  </th>

                  <th className="w-[17%] px-2 text-left">
                    <span className="text-[8px] font-semibold tracking-[0.5px] text-[#657A8D]">
                      ASSIGNED TO
                    </span>
                  </th>

                  <th className="w-[17%] px-2 text-left">
                    <span className="text-[8px] font-semibold tracking-[0.5px] text-[#657A8D]">
                      LAST ACTIVITY
                    </span>
                  </th>

                  <th className="w-[7%] px-2 text-left">
                    <span className="text-[8px] font-semibold tracking-[0.5px] text-[#657A8D]">
                      ACTION
                    </span>
                  </th>
                </tr>
              </thead>

              {/* Table Body */}

              <tbody>
                {leads.map(
                  (lead, index) => {
                    const firstName =
                      lead.firstName ||
                      "";

                    const lastName =
                      lead.lastName ||
                      "";

                    const fullName =
                      `${firstName} ${lastName}`.trim() ||
                      lead.name ||
                      "Unnamed Lead";

                    const assignedName =
                      lead.assignedTo
                        ?.firstName
                        ? `${lead.assignedTo.firstName} ${
                            lead.assignedTo.lastName ||
                            ""
                          }`.trim()
                        : lead.assignedTo
                          ?.name ||
                          "Unassigned";

                    const avatar =
                      getLeadAvatar(
                        lead
                      );

                    const activityDate =
                      lead.lastActivityAt ||
                      lead.updatedAt ||
                      lead.createdAt;

                    return (
                      <tr
                        key={
                          lead._id ||
                          lead.id ||
                          `${fullName}-${index}`
                        }
                        className="
                          h-[52px]
                          border-b
                          border-[#E2E9EF]
                          transition-colors
                          duration-150
                          last:border-b-0
                          hover:bg-[#FAFCFE]
                        "
                      >
                        {/* Name & Company */}

                        <td className="px-[14px]">
                          <div className="flex items-center gap-2">
                            <Avatar
                              src={avatar}
                              alt={fullName}
                              size="sm"
                            />

                            <div className="min-w-0">
                              <p
                                className="
                                  truncate
                                  text-[9px]
                                  font-semibold
                                  leading-[12px]
                                  text-[#173750]
                                "
                              >
                                {fullName}
                              </p>

                              <p
                                className="
                                  mt-[2px]
                                  truncate
                                  text-[8px]
                                  font-medium
                                  leading-[10px]
                                  text-[#8292A1]
                                "
                              >
                                {lead.company ||
                                  "No company"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Value */}

                        <td className="px-2">
                          <span
                            className="
                              text-[9px]
                              font-semibold
                              text-[#173750]
                            "
                          >
                            {formatCurrency(
                              lead.value
                            )}
                          </span>
                        </td>

                        {/* Status */}

                        <td className="px-2">
                          <Badge
                            variant={getBadgeVariant(
                              lead.status
                            )}
                            className="text-[7px]"
                          >
                            {lead.status ||
                              "New"}
                          </Badge>
                        </td>

                        {/* Assigned To */}

                        <td className="px-2">
                          <span
                            className="
                              text-[8px]
                              font-medium
                              text-[#6F8294]
                            "
                          >
                            {assignedName}
                          </span>
                        </td>

                        {/* Last Activity */}

                        <td className="px-2">
                          <span
                            className="
                              whitespace-nowrap
                              text-[8px]
                              font-medium
                              text-[#6F8294]
                            "
                          >
                            {formatActivityTime(
                              activityDate
                            )}
                          </span>
                        </td>

                        {/* Action */}

                        <td className="px-2">
                          <button
                            type="button"
                            aria-label={`Open ${fullName}`}
                            onClick={() =>
                              handleOpenLead(
                                lead
                              )
                            }
                            className="
                              text-[10px]
                              font-medium
                              text-[#6F8294]
                              transition-colors
                              hover:text-[#0B3D6B]
                            "
                          >
                            •••
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
    </Card>
  );
};

export default RecentLeads;