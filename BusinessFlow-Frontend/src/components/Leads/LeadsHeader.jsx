import { CalendarDays, Download } from "lucide-react";

const LeadsHeader = () => {
  return (
    <section className="flex w-full items-start justify-between">

      {/* Left Content */}
      <div>
        <h1
          className="
            text-[24px]
            font-bold
            leading-[30px]
            tracking-[-0.5px]
            text-[#102F4A]
          "
        >
          Leads
        </h1>

        <p
          className="
            mt-[3px]
            text-[11px]
            font-medium
            leading-[17px]
            text-[#62778B]
          "
        >
          Track, qualify and prioritize your sales opportunities.
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-[8px] pt-[5px]">

        {/* Date Range */}
        <button
          type="button"
          className="
            flex
            h-[28px]
            items-center
            gap-[6px]
            rounded-[6px]
            border
            border-[#D7E2EC]
            bg-white
            px-[10px]
            text-[10px]
            font-medium
            text-[#526B80]
            transition
            hover:bg-[#F7F9FC]
          "
        >
          <CalendarDays
            size={12}
            strokeWidth={1.8}
            className="text-[#526B80]"
          />

          <span>Last 30 Days</span>

          <span className="ml-[1px] text-[11px]">
           ⌄
          </span>
        </button>

        {/* Export */}
        <button
          type="button"
          className="
            flex
            h-[28px]
            items-center
            gap-[6px]
            rounded-[6px]
            border
            border-[#D7E2EC]
            bg-white
            px-[11px]
            text-[10px]
            font-semibold
            text-[#173B5C]
            transition
            hover:bg-[#F7F9FC]
          "
        >
          <Download
            size={12}
            strokeWidth={2}
          />

          <span>Export</span>
        </button>

      </div>
    </section>
  );
};

export default LeadsHeader;