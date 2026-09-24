import { Search, ChevronDown } from "lucide-react";

// =====================================================
// NOTIFICATION FILTERS
// =====================================================

const NotificationFilters = ({
  search = "",
  setSearch,
  type = "all",
  setType,
  status = "all",
  setStatus,
  date = "week",
  setDate,
}) => {
  // ===================================================
  // SEARCH
  // ===================================================

  const handleSearchChange = (event) => {
    const value = event.target.value;

    if (setSearch) {
      setSearch(value);
    }
  };

  // ===================================================
  // TYPE
  // ===================================================

  const handleTypeChange = (event) => {
    const value = event.target.value;

    if (setType) {
      setType(value);
    }
  };

  // ===================================================
  // STATUS
  // ===================================================

  const handleStatusChange = (event) => {
    const value = event.target.value;

    if (setStatus) {
      setStatus(value);
    }
  };

  // ===================================================
  // DATE
  // ===================================================

  const handleDateChange = (event) => {
    const value = event.target.value;

    if (setDate) {
      setDate(value);
    }
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <section
      className="
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
        p-2.5
      "
    >
      {/* =================================================
          SEARCH
      ================================================== */}

      <div
        className="
          flex
          h-[28px]
          items-center
          rounded-[5px]
          border
          border-[#DCE5ED]
          bg-[#FBFCFD]
          px-2.5
          transition-colors
          focus-within:border-[#9BBFDF]
        "
      >
        <Search
          size={13}
          strokeWidth={1.7}
          className="shrink-0 text-[#708397]"
        />

        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search notifications..."
          className="
            ml-2
            w-full
            bg-transparent
            text-[8px]
            text-[#17324D]
            outline-none
            placeholder:text-[#8B9BAA]
          "
        />

        {/* Clear Search */}

        {search && (
          <button
            type="button"
            onClick={() => {
              if (setSearch) {
                setSearch("");
              }
            }}
            className="
              ml-1
              shrink-0
              text-[9px]
              font-medium
              text-[#8A9AAA]
              hover:text-[#17324D]
            "
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* =================================================
          FILTERS
      ================================================== */}

      <div
        className="
          mt-2
          flex
          flex-wrap
          items-center
          gap-2
        "
      >
        {/* =================================================
            TYPE
        ================================================= */}

        <div className="relative">
          <select
            value={type}
            onChange={handleTypeChange}
            className="
              h-[27px]
              min-w-[92px]
              appearance-none
              rounded-[5px]
              border
              border-[#DCE5ED]
              bg-white
              px-2.5
              pr-7
              text-[7px]
              font-medium
              text-[#425B70]
              outline-none
              transition-colors
              hover:bg-[#F8FAFC]
              focus:border-[#9BBFDF]
            "
          >
            <option value="all">
              Type: All
            </option>

            <option value="lead">
              Type: Leads
            </option>

            <option value="deal">
              Type: Deals
            </option>

            <option value="task">
              Type: Tasks
            </option>

            <option value="meeting">
              Type: Meetings
            </option>
          </select>

          <ChevronDown
            size={10}
            strokeWidth={1.7}
            className="
              pointer-events-none
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              text-[#60758A]
            "
          />
        </div>

        {/* =================================================
            STATUS
        ================================================== */}

        <div className="relative">
          <select
            value={status}
            onChange={handleStatusChange}
            className="
              h-[27px]
              min-w-[98px]
              appearance-none
              rounded-[5px]
              border
              border-[#DCE5ED]
              bg-white
              px-2.5
              pr-7
              text-[7px]
              font-medium
              text-[#425B70]
              outline-none
              transition-colors
              hover:bg-[#F8FAFC]
              focus:border-[#9BBFDF]
            "
          >
            <option value="all">
              Status: All
            </option>

            <option value="unread">
              Status: Unread
            </option>

            <option value="read">
              Status: Read
            </option>
          </select>

          <ChevronDown
            size={10}
            strokeWidth={1.7}
            className="
              pointer-events-none
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              text-[#60758A]
            "
          />
        </div>

        {/* =================================================
            DATE
        ================================================== */}

        <div className="relative">
          <select
            value={date}
            onChange={handleDateChange}
            className="
              h-[27px]
              min-w-[110px]
              appearance-none
              rounded-[5px]
              border
              border-[#DCE5ED]
              bg-white
              px-2.5
              pr-7
              text-[7px]
              font-medium
              text-[#425B70]
              outline-none
              transition-colors
              hover:bg-[#F8FAFC]
              focus:border-[#9BBFDF]
            "
          >
            <option value="all">
              Date: All
            </option>

            <option value="today">
              Date: Today
            </option>

            <option value="week">
              Date: This Week
            </option>

            <option value="month">
              Date: This Month
            </option>
          </select>

          <ChevronDown
            size={10}
            strokeWidth={1.7}
            className="
              pointer-events-none
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              text-[#60758A]
            "
          />
        </div>
      </div>
    </section>
  );
};

export default NotificationFilters;