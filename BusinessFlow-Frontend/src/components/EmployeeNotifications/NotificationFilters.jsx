import { Search, ChevronDown } from "lucide-react";

const NotificationFilters = () => {
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
      {/* Search */}
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
        "
      >
        <Search
          size={13}
          strokeWidth={1.7}
          className="text-[#708397]"
        />

        <input
          type="text"
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
      </div>

      {/* Filters */}
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          className="
            flex
            h-[27px]
            items-center
            gap-5
            rounded-[5px]
            border
            border-[#DCE5ED]
            bg-white
            px-2.5
            text-[7px]
            text-[#425B70]
          "
        >
          Type: All
          <ChevronDown size={10} />
        </button>

        <button
          type="button"
          className="
            flex
            h-[27px]
            items-center
            gap-4
            rounded-[5px]
            border
            border-[#DCE5ED]
            bg-white
            px-2.5
            text-[7px]
            text-[#425B70]
          "
        >
          Status: All
          <ChevronDown size={10} />
        </button>

        <button
          type="button"
          className="
            flex
            h-[27px]
            items-center
            gap-4
            rounded-[5px]
            border
            border-[#DCE5ED]
            bg-white
            px-2.5
            text-[7px]
            text-[#425B70]
          "
        >
          Date: This Week
          <ChevronDown size={10} />
        </button>
      </div>
    </section>
  );
};

export default NotificationFilters;