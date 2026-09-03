const ReportsPageHeader = () => {
  return (
    <div className="flex w-full items-start justify-between">
      {/* Left */}
      <div>
        <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.6px] text-[#071D35]">
          Reports & Analytics
        </h1>

        <p className="mt-[3px] text-[10px] leading-[15px] text-[#60758A]">
          Performance insights, sales metrics, and AI-driven growth analysis.
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          className="
            h-[27px]
            rounded-[6px]
            border
            border-[#C9D8E5]
            bg-white
            px-3
            text-[8px]
            font-semibold
            text-[#17324D]
            transition
            hover:bg-[#F7F9FC]
          "
        >
          Export Report
        </button>

        <button
          type="button"
          className="
            h-[27px]
            rounded-[6px]
            border
            border-[#C9D8E5]
            bg-white
            px-3
            text-[8px]
            font-semibold
            text-[#17324D]
            transition
            hover:bg-[#F7F9FC]
          "
        >
          Share Dashboard
        </button>
      </div>
    </div>
  );
};

export default ReportsPageHeader;