import {
  Search,
  ChevronDown,
} from "lucide-react";

const DealFilters = () => {
  return (
    <div
      className="
        mt-4
        flex
        w-full
        flex-col
        gap-2
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
        p-3
        sm:flex-row
        sm:items-center
      "
    >
      {/* Search */}
      <div className="relative min-w-0 flex-1">
        <Search
          size={14}
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
          placeholder="Search deals..."
          className="
            h-[28px]
            w-full
            rounded-[5px]
            border
            border-[#DCE5ED]
            bg-white
            pl-8
            pr-3
            text-[8px]
            text-[#17324D]
            outline-none
            placeholder:text-[#8A9AAA]
            focus:border-[#8DB9E8]
            focus:ring-1
            focus:ring-[#DCEAFF]
          "
        />
      </div>

      {/* Stage */}
      <FilterButton label="Stage: All" />

      {/* Deal Value */}
      <FilterButton label="Deal Value" />

      {/* Close Date */}
      <FilterButton label="Close Date" />

      {/* Sort */}
      <FilterButton
        label="Sort By: Newest"
        className="sm:min-w-[88px]"
      />
    </div>
  );
};

const FilterButton = ({ label, className = "" }) => {
  return (
    <button
      type="button"
      className={`
        flex
        h-[28px]
        shrink-0
        items-center
        justify-between
        gap-2
        rounded-[5px]
        border
        border-[#DCE5ED]
        bg-white
        px-2.5
        text-[7px]
        font-medium
        text-[#315D80]
        transition-colors
        hover:bg-[#F8FAFC]
        ${className}
      `}
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

export default DealFilters;