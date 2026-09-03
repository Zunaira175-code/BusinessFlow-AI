const EmployeeFilters = () => {
  return (
    <div className="grid grid-cols-[1fr_115px_115px_115px] gap-2">

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71869A]"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="11"
            cy="11"
            r="6.5"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M16 16L21 21"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>

        <input
          type="text"
          placeholder="Search by name, email, or role..."
          className="h-[29px] w-full rounded-[6px] border border-[#C9D9E8] bg-white pl-9 pr-3 text-[8px] text-[#17324D] outline-none placeholder:text-[#8192A2] focus:border-[#8DBBE3]"
        />
      </div>

      {/* Roles */}
      <button
        type="button"
        className="flex h-[29px] items-center justify-between rounded-[6px] border border-[#C9D9E8] bg-white px-3 text-[8px] text-[#17324D]"
      >
        <span>All Roles</span>

        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Departments */}
      <button
        type="button"
        className="flex h-[29px] items-center justify-between rounded-[6px] border border-[#C9D9E8] bg-white px-3 text-[8px] text-[#17324D]"
      >
        <span>All Departments</span>

        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Status */}
      <button
        type="button"
        className="flex h-[29px] items-center justify-between rounded-[6px] border border-[#C9D9E8] bg-white px-3 text-[8px] text-[#17324D]"
      >
        <span>All Statuses</span>

        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Performance */}
      <button
        type="button"
        className="col-start-2 flex h-[29px] items-center justify-between rounded-[6px] border border-[#C9D9E8] bg-white px-3 text-[8px] text-[#17324D]"
      >
        <span>Performance</span>

        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Filter Icon */}
      <button
        type="button"
        className="flex h-[29px] w-[29px] items-center justify-center text-[#71869A]"
        aria-label="Filter"
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M4 6H20"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M7 12H17"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M10 18H14"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M5 5L19 19"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default EmployeeFilters;