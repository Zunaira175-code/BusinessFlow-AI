import { useEffect, useRef, useState } from "react";
import {
  Search,
  ChevronDown,
  List,
  Grid2X2,
  X,
} from "lucide-react";

const LeadsToolbar = ({
  onFilterChange = () => {},
  onViewChange = () => {},
}) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [score, setScore] = useState("");
  const [source, setSource] = useState("");

  const [openDropdown, setOpenDropdown] = useState(null);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [view, setView] = useState("list");

  const dropdownRef = useRef(null);

  // =====================================================
  // STATUS OPTIONS
  // =====================================================

  const statusOptions = [
    "All Status",
    "New",
    "Contacted",
    "Qualified",
    "Proposal Sent",
    "Converted",
    "Lost",
  ];

  // =====================================================
  // SCORE OPTIONS
  // =====================================================

  const scoreOptions = [
    "All Scores",
    "High",
    "Medium",
    "Low",
  ];

  // =====================================================
  // SOURCE OPTIONS
  // =====================================================

  const sourceOptions = [
    "All Sources",
    "Website",
    "Referral",
    "LinkedIn",
    "Facebook",
    "Instagram",
    "Google",
    "Email",
    "Cold Call",
    "Other",
  ];

  // =====================================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
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

  // =====================================================
  // SEND FILTERS TO PARENT
  // =====================================================

  useEffect(() => {
    onFilterChange({
      search: search.trim(),
      status,
      score,
      source,
    });
  }, [
    search,
    status,
    score,
    source,
    onFilterChange,
  ]);

  // =====================================================
  // SELECT FILTER
  // =====================================================

  const handleSelect = (type, value) => {
    const normalizedValue =
      value.startsWith("All ") ? "" : value;

    if (type === "status") {
      setStatus(normalizedValue);
    }

    if (type === "score") {
      setScore(normalizedValue);
    }

    if (type === "source") {
      setSource(normalizedValue);
    }

    setOpenDropdown(null);
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setScore("");
    setSource("");

    setOpenDropdown(null);
  };

  // =====================================================
  // VIEW CHANGE
  // =====================================================

  const handleViewChange = (nextView) => {
    setView(nextView);
    onViewChange(nextView);
  };

  // =====================================================
  // DROPDOWN COMPONENT
  // =====================================================

  const FilterDropdown = ({
    type,
    label,
    value,
    options,
  }) => {
    const isOpen = openDropdown === type;

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() =>
            setOpenDropdown(
              isOpen ? null : type
            )
          }
          className="
            flex
            h-[28px]
            items-center
            gap-[5px]
            rounded-[6px]
            border
            border-[#D8E2EC]
            bg-white
            px-[10px]
            text-[9px]
            font-medium
            text-[#526B80]
            transition-colors
            hover:bg-[#F8FAFD]
          "
        >
          {value || label}

          <ChevronDown
            size={10}
            strokeWidth={1.8}
            className={
              isOpen
                ? "rotate-180 transition-transform"
                : "transition-transform"
            }
          />
        </button>

        {isOpen && (
          <div
            className="
              absolute
              left-0
              top-[34px]
              z-50
              min-w-[145px]
              overflow-hidden
              rounded-[7px]
              border
              border-[#DCE5EE]
              bg-white
              shadow-[0_8px_24px_rgba(23,59,92,0.12)]
            "
          >
            {options.map((option) => {
              const selected =
                value === option ||
                (!value &&
                  option.startsWith("All "));

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    handleSelect(
                      type,
                      option
                    )
                  }
                  className={`
                    flex
                    w-full
                    items-center
                    px-[11px]
                    py-[7px]
                    text-left
                    text-[9px]
                    font-medium
                    transition-colors
                    ${
                      selected
                        ? "bg-[#EEF5FF] text-[#173B5C]"
                        : "text-[#526B80] hover:bg-[#F8FAFD]"
                    }
                  `}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // =====================================================
  // ACTIVE FILTER CHECK
  // =====================================================

  const hasFilters =
    search ||
    status ||
    score ||
    source;

  return (
    <section
      ref={dropdownRef}
      className="
        relative
        mt-[24px]
        flex
        min-h-[54px]
        w-full
        items-center
        justify-between
        rounded-[8px]
        border
        border-[#DCE5EE]
        bg-white
        px-[12px]
      "
    >
      {/* =================================================
          LEFT CONTROLS
      ================================================= */}

      <div className="flex items-center gap-[10px]">

        {/* Search */}
        <div
          className="
            flex
            h-[28px]
            w-[228px]
            items-center
            rounded-[6px]
            border
            border-[#D8E2EC]
            bg-white
            px-[9px]
          "
        >
          <Search
            size={13}
            strokeWidth={1.8}
            className="shrink-0 text-[#60778B]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search in leads..."
            className="
              ml-[8px]
              w-full
              bg-transparent
              text-[9px]
              font-medium
              text-[#40586D]
              outline-none
              placeholder:text-[#91A0AD]
            "
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-[#91A0AD] hover:text-[#526B80]"
              aria-label="Clear search"
            >
              <X
                size={11}
                strokeWidth={2}
              />
            </button>
          )}
        </div>

        {/* Status */}
        <FilterDropdown
          type="status"
          label="Status"
          value={status}
          options={statusOptions}
        />

        {/* Score */}
        <FilterDropdown
          type="score"
          label="Score"
          value={score}
          options={scoreOptions}
        />

        {/* Source */}
        <FilterDropdown
          type="source"
          label="Source"
          value={source}
          options={sourceOptions}
        />

        {/* More Filters */}
        <button
          type="button"
          onClick={() =>
            setShowMoreFilters(
              !showMoreFilters
            )
          }
          className="
            ml-[2px]
            text-[9px]
            font-semibold
            text-[#173B5C]
            transition-colors
            hover:text-[#0F6CBD]
          "
        >
          More Filters
        </button>

        {/* Clear */}
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="
              text-[9px]
              font-semibold
              text-[#7A8B99]
              hover:text-[#173B5C]
            "
          >
            Clear
          </button>
        )}
      </div>

      {/* =================================================
          RIGHT VIEW CONTROLS
      ================================================= */}

      <div className="flex items-center gap-[6px]">

        {/* List View */}
        <button
          type="button"
          onClick={() =>
            handleViewChange("list")
          }
          className={`
            flex
            h-[28px]
            w-[28px]
            items-center
            justify-center
            rounded-[6px]
            border
            border-[#D8E2EC]
            ${
              view === "list"
                ? "bg-[#F8FAFD] text-[#173B5C]"
                : "bg-white text-[#526B80]"
            }
          `}
          aria-label="List view"
        >
          <List
            size={13}
            strokeWidth={1.8}
          />
        </button>

        {/* Grid View */}
        <button
          type="button"
          onClick={() =>
            handleViewChange("grid")
          }
          className={`
            flex
            h-[28px]
            w-[28px]
            items-center
            justify-center
            rounded-[6px]
            border
            border-[#D8E2EC]
            ${
              view === "grid"
                ? "bg-[#F8FAFD] text-[#173B5C]"
                : "bg-white text-[#526B80]"
            }
          `}
          aria-label="Grid view"
        >
          <Grid2X2
            size={13}
            strokeWidth={1.8}
          />
        </button>
      </div>

      {/* =================================================
          MORE FILTERS PANEL
      ================================================= */}

      {showMoreFilters && (
        <div
          className="
            absolute
            left-[12px]
            top-[62px]
            z-40
            w-[310px]
            rounded-[8px]
            border
            border-[#DCE5EE]
            bg-white
            p-[12px]
            shadow-[0_8px_24px_rgba(23,59,92,0.10)]
          "
        >
          <div className="mb-[8px] flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[#173B5C]">
              More Filters
            </span>

            <button
              type="button"
              onClick={() =>
                setShowMoreFilters(false)
              }
              className="text-[#91A0AD] hover:text-[#526B80]"
            >
              <X size={12} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-[8px]">
            <div>
              <label className="mb-[4px] block text-[8px] font-medium text-[#7A8B99]">
                Lead Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="
                  h-[28px]
                  w-full
                  rounded-[6px]
                  border
                  border-[#D8E2EC]
                  bg-white
                  px-[7px]
                  text-[9px]
                  text-[#526B80]
                  outline-none
                "
              >
                <option value="">
                  All Status
                </option>

                {statusOptions
                  .filter(
                    (item) =>
                      !item.startsWith("All ")
                  )
                  .map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-[4px] block text-[8px] font-medium text-[#7A8B99]">
                Lead Source
              </label>

              <select
                value={source}
                onChange={(event) =>
                  setSource(event.target.value)
                }
                className="
                  h-[28px]
                  w-full
                  rounded-[6px]
                  border
                  border-[#D8E2EC]
                  bg-white
                  px-[7px]
                  text-[9px]
                  text-[#526B80]
                  outline-none
                "
              >
                <option value="">
                  All Sources
                </option>

                {sourceOptions
                  .filter(
                    (item) =>
                      !item.startsWith("All ")
                  )
                  .map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LeadsToolbar;