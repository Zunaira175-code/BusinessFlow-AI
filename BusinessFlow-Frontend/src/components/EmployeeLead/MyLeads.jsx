import { useState } from "react";
import {
  Search,
  Download,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

/* =========================================================
   LEADS DATA
========================================================= */

const leadsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    initials: "SJ",
    avatar: null,
    avatarClass: "bg-[#BFD8FF] text-[#245A9C]",
    company: "Acme Corporation",
    status: "Qualified",
    source: "Website",
    value: "$12,500",
    lastContact: "Today",
    nextFollowUp: "Tomorrow",
    followUpType: "warning",
  },
  {
    id: 2,
    name: "Michael Davis",
    initials: "MD",
    avatar: "https://i.pravatar.cc/100?img=12",
    avatarClass: "",
    company: "TechNova",
    status: "Contacted",
    source: "LinkedIn",
    value: "$8,400",
    lastContact: "Yesterday",
    nextFollowUp: "Sep 02, 2026",
    followUpType: "normal",
  },
  {
    id: 3,
    name: "Emma Wilson",
    initials: "EW",
    avatar: null,
    avatarClass: "bg-[#DCEAFF] text-[#315D80]",
    company: "Bright Systems",
    status: "New",
    source: "Referral",
    value: "$5,200",
    lastContact: "Aug 29, 2026",
    nextFollowUp: "Today",
    followUpType: "danger",
  },
  {
    id: 4,
    name: "Daniel Brown",
    initials: "DB",
    avatar: null,
    avatarClass: "bg-[#FFE9B8] text-[#A76A00]",
    company: "NovaTech",
    status: "Proposal",
    source: "Campaign",
    value: "$18,600",
    lastContact: "Aug 28, 2026",
    nextFollowUp: "Sep 03, 2026",
    followUpType: "normal",
  },
  {
    id: 5,
    name: "Olivia Taylor",
    initials: "OT",
    avatar: null,
    avatarClass: "bg-[#D9F5E5] text-[#25834D]",
    company: "Vertex Solutions",
    status: "Converted",
    source: "Website",
    value: "$21,400",
    lastContact: "Aug 27, 2026",
    nextFollowUp: "—",
    followUpType: "normal",
  },
];

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
      return "bg-[#FFF0C7] text-[#A76A00]";

    case "Converted":
      return "bg-[#DDF6E7] text-[#25834D]";

    default:
      return "bg-[#F1F5F9] text-[#64748B]";
  }
};

/* =========================================================
   MY LEADS
========================================================= */

const MyLeads = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Lead Status");
  const [source, setSource] = useState("Lead Source");
  const [sort, setSort] = useState("Recently Updated");
  const [currentPage, setCurrentPage] = useState(1);

  /* =======================================================
     SEARCH
  ======================================================== */

  const filteredLeads = leadsData.filter((lead) => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return true;
    }

    return (
      lead.name.toLowerCase().includes(searchValue) ||
      lead.company.toLowerCase().includes(searchValue) ||
      lead.source.toLowerCase().includes(searchValue)
    );
  });

  /* =======================================================
     HANDLERS
  ======================================================== */

  const handleDownload = () => {
    console.log("Download leads");
  };

  const handleFilter = () => {
    console.log("Open advanced filters");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
            Leads currently assigned to you
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleDownload}
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
            onClick={handleFilter}
            aria-label="Filter leads"
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
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
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
          onChange={setStatus}
          options={[
            "Lead Status",
            "New",
            "Contacted",
            "Qualified",
            "Proposal",
            "Converted",
          ]}
        />

        {/* Lead Source */}
        <FilterSelect
          value={source}
          onChange={setSource}
          options={[
            "Lead Source",
            "Website",
            "LinkedIn",
            "Referral",
            "Campaign",
          ]}
        />

        {/* Sort */}
        <FilterSelect
          value={sort}
          onChange={setSort}
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
            {filteredLeads.map((lead) => (
              <tr
                key={lead.id}
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
                    {lead.avatar ? (
                      <img
                        src={lead.avatar}
                        alt={lead.name}
                        className="
                          h-[22px]
                          w-[22px]
                          shrink-0
                          rounded-full
                          object-cover
                        "
                      />
                    ) : (
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
                          ${lead.avatarClass}
                        `}
                      >
                        {lead.initials}
                      </div>
                    )}

                    <span
                      className="
                        truncate
                        text-[8px]
                        font-semibold
                        text-[#17324D]
                      "
                    >
                      {lead.name}
                    </span>
                  </div>
                </td>

                {/* Company */}
                <td className="px-2 py-2.5">
                  <span className="text-[8px] text-[#29465F]">
                    {lead.company}
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
                      ${getStatusClass(lead.status)}
                    `}
                  >
                    {lead.status}
                  </span>
                </td>

                {/* Source */}
                <td className="px-2 py-2.5">
                  <span className="text-[8px] text-[#718599]">
                    {lead.source}
                  </span>
                </td>

                {/* Value */}
                <td className="px-2 py-2.5">
                  <span className="text-[8px] font-semibold text-[#17324D]">
                    {lead.value}
                  </span>
                </td>

                {/* Last Contact */}
                <td className="px-2 py-2.5">
                  <span className="text-[8px] text-[#718599]">
                    {lead.lastContact}
                  </span>
                </td>

                {/* Next Follow-up */}
                <td className="px-2 py-2.5">
                  <span
                    className={`
                      text-[8px]
                      ${
                        lead.followUpType === "danger"
                          ? "font-medium text-[#EF4444]"
                          : lead.followUpType === "warning"
                          ? "font-medium text-[#D97706]"
                          : "text-[#718599]"
                      }
                    `}
                  >
                    {lead.nextFollowUp}

                    {lead.followUpType === "danger" && (
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
                      console.log("Open lead:", lead.name)
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {filteredLeads.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="
                    px-4
                    py-8
                    text-center
                    text-[8px]
                    text-[#8495A5]
                  "
                >
                  No leads found.
                </td>
              </tr>
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
          Showing 1 to {filteredLeads.length} of 42 leads
        </p>

        <div className="flex items-center gap-1">
          {/* Previous */}
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() =>
              handlePageChange(
                Math.max(1, currentPage - 1)
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

          {/* Page 1 */}
          <button
            type="button"
            onClick={() => handlePageChange(1)}
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
                currentPage === 1
                  ? "border-[#A9CFFF] bg-[#A9CFFF] text-[#17324D]"
                  : "border-[#DCE5ED] bg-white text-[#60758A]"
              }
            `}
          >
            1
          </button>

          {/* Page 2 */}
          <button
            type="button"
            onClick={() => handlePageChange(2)}
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
                currentPage === 2
                  ? "border-[#A9CFFF] bg-[#A9CFFF] text-[#17324D]"
                  : "border-[#DCE5ED] bg-white text-[#60758A]"
              }
            `}
          >
            2
          </button>

          {/* Page 3 */}
          <button
            type="button"
            onClick={() => handlePageChange(3)}
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
                currentPage === 3
                  ? "border-[#A9CFFF] bg-[#A9CFFF] text-[#17324D]"
                  : "border-[#DCE5ED] bg-white text-[#60758A]"
              }
            `}
          >
            3
          </button>

          {/* Dots */}
          <span
            className="
              px-1
              text-[8px]
              text-[#8A9AAA]
            "
          >
            ...
          </span>

          {/* Next */}
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
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
        onChange={(e) => onChange(e.target.value)}
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
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
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