import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
} from "lucide-react";

const CustomerFilters = ({
  search = "",
  setSearch,
  status = "",
  setStatus,
  sort = "recent",
  setSort,
}) => {
  return (
    <div
      className="
        flex
        w-full
        flex-wrap
        items-center
        justify-between
        gap-2
        rounded-[8px]
        border
        border-[#DCE5ED]
        bg-white
        px-3
        py-3
      "
    >
      {/* =====================================================
          SEARCH
      ====================================================== */}

      <div
        className="
          flex
          h-[30px]
          min-w-[200px]
          flex-1
          items-center
          gap-2
          rounded-[6px]
          border
          border-[#DCE5ED]
          bg-[#F8FAFC]
          px-2.5
        "
      >
        <Search
          size={14}
          strokeWidth={1.7}
          className="shrink-0 text-[#60758A]"
        />

        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch?.(e.target.value)
          }
          placeholder="Search customers..."
          className="
            w-full
            bg-transparent
            text-[9px]
            text-[#29465F]
            outline-none
            placeholder:text-[#8495A5]
          "
        />

        {search && (
          <button
            type="button"
            onClick={() =>
              setSearch?.("")
            }
            className="
              flex
              h-4
              w-4
              shrink-0
              items-center
              justify-center
              rounded-full
              text-[#8495A5]
              hover:bg-[#EAF0F5]
              hover:text-[#17324D]
            "
            aria-label="Clear search"
          >
            <X
              size={10}
              strokeWidth={2}
            />
          </button>
        )}
      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {/* STATUS */}

        <FilterButton
          label={
            status
              ? `Status: ${status}`
              : "Status: All"
          }
          value={status}
          options={[
            {
              label: "All",
              value: "",
            },
            {
              label: "Active",
              value: "Active",
            },
            {
              label: "Pending",
              value: "Pending",
            },
            {
              label: "Inactive",
              value: "Inactive",
            },
          ]}
          onChange={setStatus}
        />

        {/* TYPE */}

        <FilterButton
          label="Type: All"
          value=""
          options={[
            {
              label: "All",
              value: "",
            },
          ]}
          onChange={() => {}}
        />

        {/* SORT */}

        <FilterButton
          label={
            sort === "oldest"
              ? "Sort by: Oldest"
              : sort === "value-high"
                ? "Sort by: Highest Value"
                : sort === "value-low"
                  ? "Sort by: Lowest Value"
                  : "Sort by: Recently Updated"
          }
          value={sort}
          options={[
            {
              label:
                "Recently Updated",
              value: "recent",
            },
            {
              label: "Newest",
              value: "newest",
            },
            {
              label: "Oldest",
              value: "oldest",
            },
            {
              label: "Highest Value",
              value: "value-high",
            },
            {
              label: "Lowest Value",
              value: "value-low",
            },
          ]}
          onChange={setSort}
        />

        {/* MORE FILTERS */}

        <button
          type="button"
          aria-label="More filters"
          className="
            flex
            h-[30px]
            w-[30px]
            items-center
            justify-center
            rounded-[6px]
            border
            border-[#DCE5ED]
            bg-white
            text-[#60758A]
            transition-colors
            hover:bg-[#F3F6F9]
          "
        >
          <SlidersHorizontal
            size={13}
            strokeWidth={1.7}
          />
        </button>
      </div>
    </div>
  );
};

// =========================================================
// FILTER BUTTON
// =========================================================

const FilterButton = ({
  label,
  options = [],
  value,
  onChange,
}) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) =>
          onChange?.(e.target.value)
        }
        className="
          h-[30px]
          appearance-none
          rounded-[6px]
          border
          border-[#DCE5ED]
          bg-white
          px-2.5
          pr-6
          text-[8px]
          font-medium
          text-[#29465F]
          outline-none
          transition-colors
          hover:bg-[#F5F8FB]
          focus:border-[#A9D1FF]
        "
      >
        {options.map((option) => (
          <option
            key={`${option.value}-${option.label}`}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={10}
        strokeWidth={1.8}
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

export default CustomerFilters;