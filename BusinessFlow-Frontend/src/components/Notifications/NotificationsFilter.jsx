const NotificationFilters = () => {
  return (
    <section className="w-full rounded-[10px] border border-[#DCE5EF] bg-white p-2.5 shadow-[0_1px_2px_rgba(15,35,55,0.03)]">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#71869A]"
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
          placeholder="Search notifications..."
          className="h-[27px] w-full rounded-[6px] border border-[#DCE5EF] bg-white pl-8 pr-3 text-[9px] text-[#17324D] outline-none placeholder:text-[#8193A5] focus:border-[#9BBFE3]"
        />
      </div>

      {/* Filters */}
      <div className="mt-2 flex items-center gap-2">
        {/* Type */}
        <button
          type="button"
          className="flex h-[27px] items-center gap-5 rounded-[6px] border border-[#DCE5EF] bg-white px-2.5 text-[9px] text-[#50677D]"
        >
          <span>Type: All</span>

          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
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

        {/* Status */}
        <button
          type="button"
          className="flex h-[27px] items-center gap-4 rounded-[6px] border border-[#DCE5EF] bg-white px-2.5 text-[9px] text-[#50677D]"
        >
          <span>Status: All</span>

          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
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

        {/* Date */}
        <button
          type="button"
          className="flex h-[27px] items-center gap-4 rounded-[6px] border border-[#DCE5EF] bg-white px-2.5 text-[9px] text-[#50677D]"
        >
          <span>Date: This Week</span>

          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
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
      </div>
    </section>
  );
};

export default NotificationFilters;