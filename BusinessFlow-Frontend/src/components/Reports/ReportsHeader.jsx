const ReportsHeader = () => {
  return (
    <section className="w-full border-b border-[#DCE5EF] pb-4">
      <div className="flex items-start justify-between gap-6">

        {/* Left Content */}
        <div>
          <h1 className="text-[22px] font-bold leading-[28px] text-[#071D35]">
            Reports & Analytics
          </h1>

          <p className="mt-[3px] text-[10px] leading-[15px] text-[#61768A]">
            Understand performance, trends and opportunities across your CRM.
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Date */}
          <button
            type="button"
            className="flex h-[27px] items-center gap-2 rounded-[6px] border border-[#DCE5EF] bg-white px-3 text-[9px] font-medium text-[#17324D] transition hover:bg-[#F7F9FC]"
          >
            Last 30 Days

            <svg
              width="9"
              height="9"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Export */}
          <button
            type="button"
            className="flex h-[27px] items-center gap-2 rounded-[6px] bg-[#061C35] px-3 text-[9px] font-semibold text-white transition hover:bg-[#0B3155]"
          >
            Export Report

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
          </button>

        </div>
      </div>
    </section>
  );
};

export default ReportsHeader;