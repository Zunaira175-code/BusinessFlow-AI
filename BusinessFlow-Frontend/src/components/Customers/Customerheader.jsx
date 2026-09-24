import {
  CalendarDays,
  Download,
  UserPlus,
} from "lucide-react";

const CustomersHeader = ({
  onAddCustomer,
  onExport,
  dateFilter = "month",
  onDateFilterChange,
}) => {
  const handleDateFilter = (value) => {
    if (onDateFilterChange) {
      onDateFilterChange(value);
    }
  };

  return (
    <section className="w-full">
      <div className="flex w-full items-start justify-between">

        {/* =====================================================
            LEFT — TITLE & DESCRIPTION
        ====================================================== */}

        <div>
          <h1
            className="
              text-[25px]
              font-bold
              leading-[30px]
              tracking-[-0.5px]
              text-[#102F4A]
            "
          >
            Customers
          </h1>

          <p
            className="
              mt-[5px]
              max-w-[300px]
              text-[11px]
              font-medium
              leading-[17px]
              text-[#718599]
            "
          >
            Manage and track your customer relationships and
            account health.
          </p>
        </div>

        {/* =====================================================
            RIGHT — FILTERS & ACTIONS
        ====================================================== */}

        <div className="flex items-center gap-[7px] pt-[3px]">

          {/* =================================================
              DATE FILTER
          ================================================== */}

          <div
            className="
              flex
              h-[35px]
              items-center
              overflow-hidden
              rounded-[7px]
              border
              border-[#DCE5ED]
              bg-white
            "
          >

            {/* Last 7 Days */}

            <button
              type="button"
              onClick={() =>
                handleDateFilter("7days")
              }
              className={`
                h-full
                whitespace-nowrap
                px-[12px]
                text-[9px]
                font-medium
                transition-colors
                ${
                  dateFilter === "7days"
                    ? "bg-[#EEF4FC] font-semibold text-[#173B5C]"
                    : "text-[#526A80] hover:bg-[#F7F9FC]"
                }
              `}
            >
              Last 7 Days
            </button>

            {/* Divider */}

            <span className="h-[19px] w-px bg-[#E1E7ED]" />

            {/* This Month */}

            <button
              type="button"
              onClick={() =>
                handleDateFilter("month")
              }
              className={`
                h-[27px]
                whitespace-nowrap
                rounded-[5px]
                px-[12px]
                text-[9px]
                transition-colors
                ${
                  dateFilter === "month"
                    ? "bg-[#EEF4FC] font-semibold text-[#173B5C]"
                    : "font-medium text-[#526A80] hover:bg-[#F7F9FC]"
                }
              `}
            >
              This Month
            </button>

            {/* Divider */}

            <span className="h-[19px] w-px bg-[#E1E7ED]" />

            {/* Custom */}

            <button
              type="button"
              onClick={() =>
                handleDateFilter("custom")
              }
              className={`
                flex
                h-full
                items-center
                gap-[5px]
                whitespace-nowrap
                px-[11px]
                text-[9px]
                transition-colors
                ${
                  dateFilter === "custom"
                    ? "bg-[#EEF4FC] font-semibold text-[#173B5C]"
                    : "font-medium text-[#526A80] hover:bg-[#F7F9FC]"
                }
              `}
            >
              <CalendarDays
                size={11}
                strokeWidth={1.8}
              />

              <span>Custom</span>
            </button>
          </div>

          {/* =================================================
              EXPORT
          ================================================== */}

          <button
            type="button"
            onClick={onExport}
            className="
              flex
              h-[35px]
              items-center
              gap-[5px]
              rounded-[7px]
              border
              border-[#DCE5ED]
              bg-white
              px-[12px]
              text-[9px]
              font-semibold
              text-[#173B5C]
              shadow-[0_1px_2px_rgba(16,47,74,0.03)]
              transition-all
              duration-200
              hover:border-[#C9D6E2]
              hover:bg-[#F7F9FC]
            "
          >
            <Download
              size={11}
              strokeWidth={2}
            />

            <span>Export</span>
          </button>

          {/* =================================================
              ADD CUSTOMER
          ================================================== */}

          <button
            type="button"
            onClick={onAddCustomer}
            className="
              flex
              h-[35px]
              items-center
              gap-[5px]
              rounded-[7px]
              bg-[#0B3D6B]
              px-[13px]
              text-[9px]
              font-semibold
              text-white
              shadow-[0_2px_5px_rgba(11,61,107,0.16)]
              transition-all
              duration-200
              hover:bg-[#092F53]
              active:scale-[0.98]
            "
          >
            <UserPlus
              size={11}
              strokeWidth={2}
            />

            <span>Add Customer</span>
          </button>

        </div>
      </div>
    </section>
  );
};

export default CustomersHeader;