import {
  Search,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

const CustomerFilters = ({
  search,
  setSearch,
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
      {/* Search */}
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
          onChange={(e) => setSearch(e.target.value)}
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
      </div>

      {/* Filters */}
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <FilterButton label="Status: All" />

        <FilterButton label="Type: All" />

        <FilterButton label="Sort by: Recently Updated" />

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

const FilterButton = ({ label }) => {
  return (
    <button
      type="button"
      className="
        flex
        h-[30px]
        items-center
        gap-1
        rounded-[6px]
        border
        border-[#DCE5ED]
        bg-white
        px-2.5
        text-[8px]
        font-medium
        text-[#29465F]
        transition-colors
        hover:bg-[#F5F8FB]
      "
    >
      <span>{label}</span>

      <ChevronDown
        size={10}
        strokeWidth={1.8}
        className="text-[#718599]"
      />
    </button>
  );
};

export default CustomerFilters;