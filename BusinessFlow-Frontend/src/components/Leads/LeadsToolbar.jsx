import {
  Search,
  ChevronDown,
  List,
  Grid2X2,
} from "lucide-react";

const LeadsToolbar = () => {
  return (
    <section
      className="
        mt-[24px]
        flex
        h-[54px]
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
      {/* Left Controls */}
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
            className="text-[#60778B]"
          />

          <input
            type="text"
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
        </div>

        {/* Status */}
        <button
          type="button"
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
          "
        >
          Status
          <ChevronDown size={10} strokeWidth={1.8} />
        </button>

        {/* Score */}
        <button
          type="button"
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
          "
        >
          Score
          <ChevronDown size={10} strokeWidth={1.8} />
        </button>

        {/* Source */}
        <button
          type="button"
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
          "
        >
          Source
          <ChevronDown size={10} strokeWidth={1.8} />
        </button>

        {/* More Filters */}
        <button
          type="button"
          className="
            ml-[2px]
            text-[9px]
            font-semibold
            text-[#173B5C]
          "
        >
          More Filters
        </button>
      </div>

      {/* Right View Controls */}
      <div className="flex items-center gap-[6px]">

        {/* List View */}
        <button
          type="button"
          className="
            flex
            h-[28px]
            w-[28px]
            items-center
            justify-center
            rounded-[6px]
            border
            border-[#D8E2EC]
            bg-[#F8FAFD]
            text-[#526B80]
          "
          aria-label="List view"
        >
          <List size={13} strokeWidth={1.8} />
        </button>

        {/* Grid View */}
        <button
          type="button"
          className="
            flex
            h-[28px]
            w-[28px]
            items-center
            justify-center
            rounded-[6px]
            border
            border-[#D8E2EC]
            bg-white
            text-[#526B80]
          "
          aria-label="Grid view"
        >
          <Grid2X2 size={13} strokeWidth={1.8} />
        </button>

      </div>
    </section>
  );
};

export default LeadsToolbar;