import { useEffect, useMemo, useState } from "react";

import {
  Search,
  Download,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

/* =========================================================
   API
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

/* =========================================================
   STATUS STYLES
========================================================= */

const getStatusClass = (status) => {
  switch (status) {
    case "Qualified":
      return "bg-[#DCEAFF] text-[#245A9C]";

    case "Contacted":
      return "bg-[#BFD6FA] text-[#245A9C]";

    case "New":
      return "bg-[#DCEAFF] text-[#315D80]";

    case "Proposal":
    case "Proposal Sent":
      return "bg-[#FFF0C7] text-[#A76A00]";

    case "Converted":
      return "bg-[#DDF6E7] text-[#25834D]";

    case "Lost":
      return "bg-[#FDE8E8] text-[#C24141]";

    default:
      return "bg-[#F1F5F9] text-[#64748B]";
  }
};

/* =========================================================
   AVATAR STYLES
========================================================= */

const avatarStyles = [
  "bg-[#BFD8FF] text-[#245A9C]",
  "bg-[#DCEAFF] text-[#315D80]",
  "bg-[#FFE9B8] text-[#A76A00]",
  "bg-[#D9F5E5] text-[#25834D]",
  "bg-[#E8DFFF] text-[#6D4BA8]",
];

/* =========================================================
   AVATAR CLASS
========================================================= */

const getAvatarClass = (index) => {
  return (
    avatarStyles[
      index %
        avatarStyles.length
    ] || avatarStyles[0]
  );
};

/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {
  const number =
    Number(value) || 0;

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }
  ).format(number);
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(
    dateValue
  );

  if (
    Number.isNaN(date.getTime())
  ) {
    return "—";
  }

  const now = new Date();

  const today = new Date(
    now
  );

  today.setHours(
    0,
    0,
    0,
    0
  );

  const target = new Date(
    date
  );

  target.setHours(
    0,
    0,
    0,
    0
  );

  const difference =
    today.getTime() -
    target.getTime();

  const oneDay =
    24 *
    60 *
    60 *
    1000;

  if (difference === 0) {
    return "Today";
  }

  if (difference === oneDay) {
    return "Yesterday";
  }

  if (difference === -oneDay) {
    return "Tomorrow";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }
  );
};

/* =========================================================
   FORMAT FOLLOW-UP
========================================================= */

const formatFollowUp = (
  followUp
) => {
  if (!followUp) {
    return {
      text: "—",
      type: "normal",
    };
  }

  const date = new Date(
    followUp.dueAt
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return {
      text: "—",
      type: "normal",
    };
  }

  const now = new Date();

  const today = new Date(
    now
  );

  today.setHours(
    0,
    0,
    0,
    0
  );

  const followUpDay =
    new Date(date);

  followUpDay.setHours(
    0,
    0,
    0,
    0
  );

  const diff =
    followUpDay.getTime() -
    today.getTime();

  const oneDay =
    24 *
    60 *
    60 *
    1000;

  const time =
    date.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );

  if (
    followUp.priority ===
      "HIGH" ||
    diff === 0
  ) {
    return {
      text:
        diff === 0
          ? `Today ${time}`
          : `${date.toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }
            )}`,
      type: "danger",
    };
  }

  if (diff === -oneDay) {
    return {
      text: `Yesterday ${time}`,
      type: "normal",
    };
  }

  if (diff === oneDay) {
    return {
      text: `Tomorrow ${time}`,
      type: "warning",
    };
  }

  return {
    text: `${date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    )}`,
    type: "normal",
  };
};

/* =========================================================
   MY LEADS
========================================================= */

const MyLeads = () => {
  const [leads, setLeads] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("Lead Status");

  const [source, setSource] =
    useState("Lead Source");

  const [sort, setSort] =
    useState("Recently Updated");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [pagination, setPagination] =
    useState({
      currentPage: 1,
      totalPages: 1,
      totalLeads: 0,
      limit: 5,
      hasNextPage: false,
      hasPreviousPage: false,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =========================================================
     FETCH LEADS
  ========================================================= */

  useEffect(() => {
    let isMounted = true;

    const fetchLeads =
      async () => {
        try {
          setLoading(true);
          setError("");

          const token =
            localStorage.getItem(
              "businessflow_token"
            );

          if (!token) {
            throw new Error(
              "Authentication token not found."
            );
          }

          const params =
            new URLSearchParams();

          if (
            search.trim()
          ) {
            params.set(
              "search",
              search.trim()
            );
          }

          if (
            status !==
            "Lead Status"
          ) {
            params.set(
              "status",
              status
            );
          }

          if (
            source !==
            "Lead Source"
          ) {
            params.set(
              "source",
              source
            );
          }

          let sortValue =
            "recent";

          if (
            sort === "Name"
          ) {
            sortValue = "name";
          } else if (
            sort === "Value"
          ) {
            sortValue = "value";
          } else if (
            sort ===
            "Last Contact"
          ) {
            sortValue =
              "last-contact";
          }

          params.set(
            "sort",
            sortValue
          );

          params.set(
            "page",
            String(
              currentPage
            )
          );

          params.set(
            "limit",
            "5"
          );

          const response =
            await fetch(
              `${API_BASE_URL}/api/leads/me?${params.toString()}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type":
                    "application/json",
                },
              }
            );

          const result =
            await response.json();

          if (!response.ok) {
            throw new Error(
              result?.message ||
                "Unable to fetch leads."
            );
          }

          if (
            !result?.success ||
            !result?.data
          ) {
            throw new Error(
              "Invalid leads response."
            );
          }

          if (isMounted) {
            setLeads(
              Array.isArray(
                result.data.leads
              )
                ? result.data.leads
                : []
            );

            setPagination(
              result.data.pagination ||
                {
                  currentPage,
                  totalPages: 1,
                  totalLeads: 0,
                  limit: 5,
                  hasNextPage:
                    false,
                  hasPreviousPage:
                    false,
                }
            );
          }
        } catch (err) {
          console.error(
            "My Leads Error:",
            err
          );

          if (isMounted) {
            setError(
              err.message ||
                "Unable to load leads."
            );

            setLeads([]);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

    fetchLeads();

    return () => {
      isMounted = false;
    };
  }, [
    search,
    status,
    source,
    sort,
    currentPage,
  ]);

  /* =========================================================
     RESET PAGE WHEN FILTER CHANGES
  ========================================================= */

  const handleSearchChange = (
    value
  ) => {
    setSearch(value);

    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const handleStatusChange = (
    value
  ) => {
    setStatus(value);

    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const handleSourceChange = (
    value
  ) => {
    setSource(value);

    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const handleSortChange = (
    value
  ) => {
    setSort(value);

    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  /* =========================================================
     DOWNLOAD
  ========================================================= */

  const handleDownload = () => {
    if (
      !leads.length
    ) {
      return;
    }

    const headers = [
      "Lead",
      "Company",
      "Status",
      "Source",
      "Value",
      "Last Contact",
      "Next Follow-up",
    ];

    const rows =
      leads.map(
        (lead) => {
          const followUp =
            formatFollowUp(
              lead.nextFollowUp
            );

          return [
            lead.name,
            lead.company,
            lead.displayStatus ||
              lead.status,
            lead.source,
            lead.value,
            formatDate(
              lead.lastActivityAt
            ),
            followUp.text,
          ];
        }
      );

    const csv = [
      headers,
      ...rows,
    ]
      .map(
        (row) =>
          row
            .map(
              (value) =>
                `"${String(
                  value ?? ""
                ).replace(
                  /"/g,
                  '""'
                )}"`
            )
            .join(",")
      )
      .join("\n");

    const blob =
      new Blob(
        [csv],
        {
          type: "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      "my-leads.csv";

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(
      url
    );
  };

  /* =========================================================
     ADVANCED FILTER
  ========================================================= */

  const handleFilter = () => {
    setSearch("");
    setStatus("Lead Status");
    setSource("Lead Source");
    setSort(
      "Recently Updated"
    );
    setCurrentPage(1);
  };

  /* =========================================================
     PAGE CHANGE
  ========================================================= */

  const handlePageChange = (
    page
  ) => {
    if (
      page < 1 ||
      page >
        pagination.totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  };

  /* =========================================================
     PAGE NUMBERS
  ========================================================= */

  const pageNumbers =
    useMemo(() => {
      const total =
        pagination.totalPages;

      if (total <= 1) {
        return [1];
      }

      if (total <= 5) {
        return Array.from(
          {
            length: total,
          },
          (_, index) =>
            index + 1
        );
      }

      if (
        currentPage <= 3
      ) {
        return [
          1,
          2,
          3,
          "...",
          total,
        ];
      }

      if (
        currentPage >=
        total - 2
      ) {
        return [
          1,
          "...",
          total - 2,
          total - 1,
          total,
        ];
      }

      return [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        total,
      ];
    }, [
      currentPage,
      pagination.totalPages,
    ]);

  /* =========================================================
     SHOWING RANGE
  ========================================================= */

  const showingFrom =
    pagination.totalLeads ===
    0
      ? 0
      : (currentPage - 1) *
          pagination.limit +
        1;

  const showingTo =
    Math.min(
      currentPage *
        pagination.limit,
      pagination.totalLeads
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
        shadow-[0_1px_2px_rgba(15,23,42,0.03)]
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          min-h-[56px]
          items-center
          justify-between
          gap-3
          border-b
          border-[#DCE5ED]
          px-4
          py-2.5
        "
      >
        <div>
          <h2
            className="
              text-[13px]
              font-bold
              text-[#17324D]
            "
          >
            My Leads
          </h2>

          <p
            className="
              mt-1
              text-[8px]
              leading-[11px]
              text-[#8495A5]
            "
          >
            Leads currently assigned
            to you
          </p>
        </div>

        {/* Header Actions */}

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={
              handleDownload
            }
            aria-label="Download leads"
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-[5px]
              border
              border-[#DCE5ED]
              bg-white
              text-[#60758A]
              transition-colors
              hover:bg-[#F3F6F9]
              hover:text-[#17324D]
            "
          >
            <Download
              size={12}
              strokeWidth={1.7}
            />
          </button>

          <button
            type="button"
            onClick={
              handleFilter
            }
            aria-label="Reset filters"
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-[5px]
              border
              border-[#DCE5ED]
              bg-white
              text-[#60758A]
              transition-colors
              hover:bg-[#F3F6F9]
              hover:text-[#17324D]
            "
          >
            <SlidersHorizontal
              size={12}
              strokeWidth={1.7}
            />
          </button>
        </div>
      </div>

      {/* =====================================================
          FILTER BAR
      ====================================================== */}

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-2
          border-b
          border-[#DCE5ED]
          px-4
          py-2.5
        "
      >
        {/* Search */}

        <div
          className="
            relative
            min-w-[180px]
            flex-1
          "
        >
          <Search
            size={13}
            strokeWidth={1.7}
            className="
              pointer-events-none
              absolute
              left-2.5
              top-1/2
              -translate-y-1/2
              text-[#718599]
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              handleSearchChange(
                e.target.value
              )
            }
            placeholder="Search leads..."
            className="
              h-[29px]
              w-full
              rounded-[5px]
              border
              border-[#DCE5ED]
              bg-white
              pl-8
              pr-2.5
              text-[8px]
              text-[#29465F]
              outline-none
              placeholder:text-[#8A9AAA]
              focus:border-[#8DA9C0]
            "
          />
        </div>

        {/* Lead Status */}

        <FilterSelect
          value={status}
          onChange={
            handleStatusChange
          }
          options={[
            "Lead Status",
            "New",
            "Contacted",
            "Qualified",
            "Proposal",
            "Converted",
            "Lost",
          ]}
        />

        {/* Lead Source */}

        <FilterSelect
          value={source}
          onChange={
            handleSourceChange
          }
          options={[
            "Lead Source",
            "Website",
            "LinkedIn",
            "Referral",
            "Facebook",
            "Instagram",
            "Google",
            "Email",
            "Cold Call",
            "Other",
          ]}
        />

        {/* Sort */}

        <FilterSelect
          value={sort}
          onChange={
            handleSortChange
          }
          options={[
            "Recently Updated",
            "Name",
            "Value",
            "Last Contact",
          ]}
          className="min-w-[125px]"
        />
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          className="
            border-b
            border-[#F5D4D4]
            bg-[#FFF8F8]
            px-4
            py-2
            text-[8px]
            font-medium
            text-[#DC2626]
          "
        >
          Unable to load leads.
        </div>
      )}

      {/* =====================================================
          TABLE
      ====================================================== */}

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="border-b border-[#DCE5ED] bg-[#FBFCFD]">
              <th className="w-[22%] px-3 py-2 text-left text-[7px] font-semibold text-[#60758A]">
                Lead
              </th>

              <th className="w-[17%] px-2 py-2 text-left text-[7px] font-semibold text-[#60758A]">
                Company
              </th>

              <th className="w-[12%] px-2 py-2 text-left text-[7px] font-semibold text-[#60758A]">
                Status
              </th>

              <th className="w-[11%] px-2 py-2 text-left text-[7px] font-semibold text-[#60758A]">
                Source
              </th>

              <th className="w-[11%] px-2 py-2 text-left text-[7px] font-semibold text-[#60758A]">
                Value
              </th>

              <th className="w-[13%] px-2 py-2 text-left text-[7px] font-semibold text-[#60758A]">
                Last Contact
              </th>

              <th className="w-[14%] px-2 py-2 text-left text-[7px] font-semibold text-[#60758A]">
                Next Follow-up
              </th>

              <th className="w-[7%] px-2 py-2 text-left text-[7px] font-semibold text-[#60758A]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {/* =================================================
                LOADING
            ================================================== */}

            {loading &&
              [1, 2, 3, 4, 5].map(
                (item) => (
                  <tr
                    key={item}
                    className="
                      border-b
                      border-[#E2E9EF]
                    "
                  >
                    <td
                      colSpan={8}
                      className="px-3 py-3"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="
                            h-[22px]
                            w-[22px]
                            shrink-0
                            animate-pulse
                            rounded-full
                            bg-[#EAF1F7]
                          "
                        />

                        <div
                          className="
                            h-[8px]
                            w-[120px]
                            animate-pulse
                            rounded
                            bg-[#EAF1F7]
                          "
                        />
                      </div>
                    </td>
                  </tr>
                )
              )}

            {/* =================================================
                EMPTY
            ================================================== */}

            {!loading &&
              !error &&
              leads.length ===
                0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="
                      px-4
                      py-10
                      text-center
                      text-[8px]
                      text-[#8495A5]
                    "
                  >
                    No leads found.
                  </td>
                </tr>
              )}

            {/* =================================================
                LEADS
            ================================================== */}

            {!loading &&
              !error &&
              leads.map(
                (
                  lead,
                  index
                ) => {
                  const followUp =
                    formatFollowUp(
                      lead.nextFollowUp
                    );

                  return (
                    <tr
                      key={
                        lead.id
                      }
                      className="
                        border-b
                        border-[#E2E9EF]
                        transition-colors
                        hover:bg-[#FAFCFE]
                      "
                    >
                      {/* Lead */}

                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`
                              flex
                              h-[22px]
                              w-[22px]
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              text-[7px]
                              font-semibold
                              ${getAvatarClass(
                                index
                              )}
                            `}
                          >
                            {
                              lead.initials
                            }
                          </div>

                          <span
                            className="
                              truncate
                              text-[8px]
                              font-semibold
                              text-[#17324D]
                            "
                          >
                            {
                              lead.name
                            }
                          </span>
                        </div>
                      </td>

                      {/* Company */}

                      <td className="px-2 py-2.5">
                        <span className="text-[8px] text-[#29465F]">
                          {
                            lead.company
                          }
                        </span>
                      </td>

                      {/* Status */}

                      <td className="px-2 py-2.5">
                        <span
                          className={`
                            inline-flex
                            rounded-[4px]
                            px-1.5
                            py-[3px]
                            text-[7px]
                            font-semibold
                            ${getStatusClass(
                              lead.displayStatus ||
                                lead.status
                            )}
                          `}
                        >
                          {
                            lead.displayStatus ||
                              lead.status
                          }
                        </span>
                      </td>

                      {/* Source */}

                      <td className="px-2 py-2.5">
                        <span className="text-[8px] text-[#718599]">
                          {
                            lead.source
                          }
                        </span>
                      </td>

                      {/* Value */}

                      <td className="px-2 py-2.5">
                        <span className="text-[8px] font-semibold text-[#17324D]">
                          {formatCurrency(
                            lead.value
                          )}
                        </span>
                      </td>

                      {/* Last Contact */}

                      <td className="px-2 py-2.5">
                        <span className="text-[8px] text-[#718599]">
                          {formatDate(
                            lead.lastActivityAt
                          )}
                        </span>
                      </td>

                      {/* Next Follow-up */}

                      <td className="px-2 py-2.5">
                        <span
                          className={`
                            text-[8px]
                            ${
                              followUp.type ===
                              "danger"
                                ? "font-medium text-[#EF4444]"
                                : followUp.type ===
                                  "warning"
                                ? "font-medium text-[#D97706]"
                                : "text-[#718599]"
                            }
                          `}
                        >
                          {
                            followUp.text
                          }

                          {followUp.type ===
                            "danger" && (
                            <span className="ml-1">
                              △
                            </span>
                          )}
                        </span>
                      </td>

                      {/* Actions */}

                      <td className="px-2 py-2.5">
                        <button
                          type="button"
                          aria-label={`Open ${lead.name}`}
                          className="
                            text-[8px]
                            font-semibold
                            text-[#079BEA]
                            transition-colors
                            hover:text-[#0B3D6B]
                          "
                          onClick={() =>
                            console.log(
                              "Open lead:",
                              lead.id
                            )
                          }
                        >
                          View
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
          min-h-[39px]
          items-center
          justify-between
          gap-3
          px-3
          py-2
        "
      >
        <p
          className="
            text-[7px]
            text-[#718599]
          "
        >
          Showing{" "}
          {showingFrom} to{" "}
          {showingTo} of{" "}
          {pagination.totalLeads}{" "}
          leads
        </p>

        <div className="flex items-center gap-1">
          {/* Previous */}

          <button
            type="button"
            disabled={
              !pagination.hasPreviousPage
            }
            onClick={() =>
              handlePageChange(
                currentPage - 1
              )
            }
            className="
              flex
              h-[24px]
              min-w-[30px]
              items-center
              justify-center
              rounded-[4px]
              border
              border-[#DCE5ED]
              bg-white
              px-1.5
              text-[7px]
              text-[#8A9AAA]
              disabled:cursor-not-allowed
              disabled:opacity-50
              hover:bg-[#F7F9FC]
            "
          >
            Prev
          </button>

          {/* Pages */}

          {pageNumbers.map(
            (page, index) => {
              if (
                page ===
                "..."
              ) {
                return (
                  <span
                    key={`dots-${index}`}
                    className="
                      px-1
                      text-[8px]
                      text-[#8A9AAA]
                    "
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    handlePageChange(
                      page
                    )
                  }
                  className={`
                    flex
                    h-[24px]
                    w-[24px]
                    items-center
                    justify-center
                    rounded-[4px]
                    border
                    text-[7px]
                    font-semibold

                    ${
                      currentPage ===
                      page
                        ? "border-[#A9CFFF] bg-[#A9CFFF] text-[#17324D]"
                        : "border-[#DCE5ED] bg-white text-[#60758A]"
                    }
                  `}
                >
                  {page}
                </button>
              );
            }
          )}

          {/* Next */}

          <button
            type="button"
            disabled={
              !pagination.hasNextPage
            }
            onClick={() =>
              handlePageChange(
                currentPage + 1
              )
            }
            className="
              flex
              h-[24px]
              min-w-[30px]
              items-center
              justify-center
              rounded-[4px]
              border
              border-[#DCE5ED]
              bg-white
              px-1.5
              text-[7px]
              text-[#60758A]
              disabled:cursor-not-allowed
              disabled:opacity-50
              hover:bg-[#F7F9FC]
            "
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   FILTER SELECT
========================================================= */

const FilterSelect = ({
  value,
  onChange,
  options,
  className = "",
}) => {
  return (
    <div
      className={`
        relative
        min-w-[105px]
        ${className}
      `}
    >
      <select
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="
          h-[29px]
          w-full
          appearance-none
          rounded-[5px]
          border
          border-[#DCE5ED]
          bg-white
          px-2.5
          pr-7
          text-[7px]
          text-[#29465F]
          outline-none
          focus:border-[#8DA9C0]
        "
      >
        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}
      </select>

      <ChevronDown
        size={11}
        strokeWidth={1.7}
        className="
          pointer-events-none
          absolute
          right-2
          top-1/2
          -translate-y-1/2
          text-[#718599]
        "
      />
    </div>
  );
};

export default MyLeads;