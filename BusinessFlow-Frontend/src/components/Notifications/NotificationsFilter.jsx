import { useEffect, useState } from "react";

// =====================================================
// FILTER OPTIONS
// =====================================================

const TYPE_OPTIONS = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "lead",
    label: "Leads",
  },
  {
    value: "deal",
    label: "Deals",
  },
  {
    value: "task",
    label: "Tasks",
  },
  {
    value: "meeting",
    label: "Meetings",
  },
];

const STATUS_OPTIONS = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "unread",
    label: "Unread",
  },
  {
    value: "read",
    label: "Read",
  },
];

const DATE_OPTIONS = [
  {
    value: "all",
    label: "All Time",
  },
  {
    value: "today",
    label: "Today",
  },
  {
    value: "week",
    label: "This Week",
  },
  {
    value: "month",
    label: "This Month",
  },
];

// =====================================================
// DROPDOWN
// =====================================================

const FilterDropdown = ({
  label,
  value,
  options,
  onChange,
  open,
  setOpen,
  type,
}) => {
  const selectedOption =
    options.find(
      (option) =>
        option.value === value
    ) || options[0];

  const dropdownId =
    `notification-filter-${type}`;

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={dropdownId}
        onClick={() =>
          setOpen(
            open ? null : type
          )
        }
        className="
          flex
          h-[27px]
          items-center
          gap-4
          rounded-[6px]
          border
          border-[#DCE5EF]
          bg-white
          px-2.5
          text-[9px]
          text-[#50677D]
          transition
          hover:bg-[#F8FAFC]
        "
      >
        <span>
          {label}:{" "}
          {selectedOption.label}
        </span>

        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          className={`
            transition-transform
            ${open ? "rotate-180" : ""}
          `}
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          id={dropdownId}
          className="
            absolute
            left-0
            top-[31px]
            z-50
            min-w-full
            overflow-hidden
            rounded-[7px]
            border
            border-[#DCE5EF]
            bg-white
            py-1
            shadow-[0_8px_20px_rgba(15,35,55,0.10)]
          "
        >
          {options.map(
            (option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(
                    option.value
                  );

                  setOpen(null);
                }}
                className={`
                  flex
                  w-full
                  items-center
                  px-2.5
                  py-1.5
                  text-left
                  text-[9px]
                  transition
                  ${
                    option.value ===
                    value
                      ? "bg-[#F0F7FD] font-semibold text-[#1686C4]"
                      : "text-[#50677D] hover:bg-[#F8FAFC]"
                  }
                `}
              >
                {option.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

// =====================================================
// NOTIFICATION FILTERS
// =====================================================

const NotificationFilters = ({
  onFiltersChange,
}) => {
  const [search, setSearch] =
    useState("");

  const [type, setType] =
    useState("all");

  const [status, setStatus] =
    useState("all");

  const [date, setDate] =
    useState("week");

  const [openDropdown, setOpenDropdown] =
    useState(null);

  // ===================================================
  // SEND FILTERS TO PARENT
  // ===================================================

  useEffect(() => {
    if (
      typeof onFiltersChange !==
      "function"
    ) {
      return;
    }

    onFiltersChange({
      search: search.trim(),
      type,
      status,
      date,
    });
  }, [
    search,
    type,
    status,
    date,
    onFiltersChange,
  ]);

  // ===================================================
  // CLOSE DROPDOWN OUTSIDE
  // ===================================================

  useEffect(() => {
    const handleOutsideClick = (
      event
    ) => {
      if (
        !event.target.closest(
          "[data-notification-filter]"
        )
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  return (
    <section
      data-notification-filter
      className="
        w-full
        rounded-[10px]
        border
        border-[#DCE5EF]
        bg-white
        p-2.5
        shadow-[0_1px_2px_rgba(15,35,55,0.03)]
      "
    >
      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <div className="relative">
        <svg
          className="
            absolute
            left-2.5
            top-1/2
            -translate-y-1/2
            text-[#71869A]
          "
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="11"
            cy="11"
            r="7"
            stroke="currentColor"
            strokeWidth="1.8"
          />

          <path
            d="M16.5 16.5L21 21"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search notifications..."
          className="
            h-[27px]
            w-full
            rounded-[6px]
            border
            border-[#DCE5EF]
            bg-white
            pl-8
            pr-3
            text-[9px]
            text-[#17324D]
            outline-none
            placeholder:text-[#8193A5]
            focus:border-[#9BBFE3]
          "
        />
      </div>

      {/* ================================================= */}
      {/* FILTERS */}
      {/* ================================================= */}

      <div className="mt-2 flex items-center gap-2">
        {/* TYPE */}

        <div data-notification-filter>
          <FilterDropdown
            label="Type"
            value={type}
            options={TYPE_OPTIONS}
            onChange={setType}
            open={
              openDropdown ===
              "type"
            }
            setOpen={
              setOpenDropdown
            }
            type="type"
          />
        </div>

        {/* STATUS */}

        <div data-notification-filter>
          <FilterDropdown
            label="Status"
            value={status}
            options={STATUS_OPTIONS}
            onChange={setStatus}
            open={
              openDropdown ===
              "status"
            }
            setOpen={
              setOpenDropdown
            }
            type="status"
          />
        </div>

        {/* DATE */}

        <div data-notification-filter>
          <FilterDropdown
            label="Date"
            value={date}
            options={DATE_OPTIONS}
            onChange={setDate}
            open={
              openDropdown ===
              "date"
            }
            setOpen={
              setOpenDropdown
            }
            type="date"
          />
        </div>
      </div>
    </section>
  );
};

export default NotificationFilters;