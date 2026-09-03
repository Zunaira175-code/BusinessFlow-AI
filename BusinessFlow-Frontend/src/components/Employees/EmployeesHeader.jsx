const EmployeesHeader = () => {
  return (
    <section className="w-full">
      <div className="flex items-start justify-between gap-6">
        {/* Left */}
        <div>
          <h1 className="text-[22px] font-bold leading-[28px] text-[#071D35]">
            Employees
          </h1>

          <p className="mt-[3px] text-[10px] leading-[15px] text-[#64798C]">
            Manage your sales team, employee access and performance.
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-2 pt-[2px]">
          {/* Export */}
          <button
            type="button"
            className="flex h-[27px] items-center gap-2 rounded-[6px] border border-[#CFE0F1] bg-white px-3 text-[9px] font-semibold text-[#17324D] transition hover:bg-[#F5F8FC]"
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 3V15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              <path
                d="M8 11L12 15L16 11"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M5 20H19"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>

            Export
          </button>

          {/* Add Employee */}
          <button
            type="button"
            className="flex h-[27px] items-center gap-2 rounded-[6px] bg-[#061C35] px-3 text-[9px] font-semibold text-white transition hover:bg-[#0B3155]"
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M15 20V18C15 16.34 13.66 15 12 15H7C5.34 15 4 16.34 4 18V20"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />

              <circle
                cx="9.5"
                cy="8"
                r="3"
                stroke="currentColor"
                strokeWidth="1.7"
              />

              <path
                d="M19 8V14"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />

              <path
                d="M16 11H22"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>

            Add Employee
          </button>
        </div>
      </div>
    </section>
  );
};

export default EmployeesHeader;