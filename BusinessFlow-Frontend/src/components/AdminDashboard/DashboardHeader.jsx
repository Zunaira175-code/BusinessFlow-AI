import { CalendarDays, Download } from "lucide-react";
import Button from "../common/button";

const DashboardHeader = () => {
  return (
    <section className="w-full">
      <div className="flex items-start justify-between gap-4">

        {/* Left Content */}
        <div>
          <h1
            className="
              text-[22px]
              font-bold
              leading-[27px]
              tracking-[-0.5px]
              text-[#102F4A]
            "
          >
            Admin Dashboard
          </h1>

          <p
            className="
              mt-1
              text-[10px]
              font-medium
              leading-[15px]
              text-[#718599]
            "
          >
            Overview of your sales pipeline and team activity.
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 pt-0.5">

          {/* Date Filter */}
          <div
            className="
              flex
              h-[35px]
              items-center
              rounded-[7px]
              border
              border-[#D8E2EA]
              bg-white
              p-[2px]
            "
          >

            {/* Last 7 Days */}
            <button
              type="button"
              className="
                h-[29px]
                rounded-[6px]
                px-[10px]
                text-[9px]
                font-medium
                text-[#30465C]
                transition-colors
                duration-200
                hover:bg-[#F5F8FA]
              "
            >
              Last 7 Days
            </button>

            {/* Divider */}
            <span className="h-[18px] w-px bg-[#E1E7ED]" />

            {/* This Month */}
            <button
              type="button"
              className="
                h-[29px]
                rounded-[6px]
                bg-[#EEF5FF]
                px-[10px]
                text-[9px]
                font-semibold
                text-[#193B5B]
              "
            >
              This Month
            </button>

            {/* Divider */}
            <span className="h-[18px] w-px bg-[#E1E7ED]" />

            {/* Custom */}
            <button
              type="button"
              className="
                flex
                h-[29px]
                items-center
                gap-1
                rounded-[6px]
                px-[9px]
                text-[9px]
                font-medium
                text-[#30465C]
                transition-colors
                duration-200
                hover:bg-[#F5F8FA]
              "
            >
              <CalendarDays
                size={12}
                strokeWidth={1.8}
              />

              <span>Custom</span>
            </button>

          </div>

          {/* Export */}
          <Button
            variant="secondary"
            icon={Download}
            className="
              h-[35px]
              rounded-[7px]
              px-[11px]
              text-[9px]
            "
          >
            Export
          </Button>

        </div>
      </div>
    </section>
  );
};

export default DashboardHeader;