import { ChevronLeft, ChevronRight } from "lucide-react";

const LeadsTable = () => {
  return (
    <section
      className="
        mt-[24px]
        w-full
        overflow-hidden
        rounded-[8px]
        border
        border-[#DCE5EE]
        bg-white
      "
    >
      {/* =========================
          TABLE HEADER
      ========================== */}
      <div
        className="
          grid
          h-[36px]
          grid-cols-[45px_1.25fr_1.2fr_0.7fr_0.75fr_0.95fr_0.85fr]
          items-center
          border-b
          border-[#DCE5EE]
          bg-[#F8FAFC]
          px-[12px]
        "
      >
        {/* Checkbox */}
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            className="h-[11px] w-[11px] accent-[#0B3D6B]"
          />
        </div>

        <TableHeader text="LEAD" />
        <TableHeader text="COMPANY" />
        <TableHeader text="SCORE" />
        <TableHeader text="STATUS" />
        <TableHeader text="ASSIGNED TO" />
        <TableHeader text="EST. VALUE" align="right" />
      </div>

      {/* =========================
          LEAD ROW
      ========================== */}
      <div
        className="
          grid
          h-[47px]
          grid-cols-[45px_1.25fr_1.2fr_0.7fr_0.75fr_0.95fr_0.85fr]
          items-center
          border-b
          border-[#E3EAF1]
          px-[12px]
        "
      >
        {/* Checkbox */}
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            className="h-[11px] w-[11px] accent-[#0B3D6B]"
          />
        </div>

        {/* Lead */}
        <div className="flex items-center gap-[8px]">
          <div
            className="
              flex
              h-[24px]
              w-[24px]
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#D9E8FF]
              text-[9px]
              font-semibold
              text-[#24598A]
            "
          >
            EL
          </div>

          <div className="min-w-0">
            <p
              className="
                truncate
                text-[9px]
                font-semibold
                leading-[13px]
                text-[#173B5C]
              "
            >
              Elena Rodriguez
            </p>

            <p
              className="
                truncate
                text-[8px]
                font-medium
                leading-[11px]
                text-[#8292A0]
              "
            >
              elena.r@techcorp.io
            </p>
          </div>
        </div>

        {/* Company */}
        <div>
          <span
            className="
              text-[9px]
              font-medium
              text-[#526B80]
            "
          >
            TechCorp Solutions
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-[5px]">
          <span
            className="
              h-[6px]
              w-[6px]
              rounded-full
              bg-[#16A05D]
            "
          />

          <span
            className="
              text-[9px]
              font-semibold
              text-[#16A05D]
            "
          >
            92
          </span>

          <span
            className="
              text-[8px]
              font-medium
              text-[#8292A0]
            "
          >
            (High)
          </span>
        </div>

        {/* Status */}
        <div>
          <span
            className="
              inline-flex
              rounded-[5px]
              bg-[#DCEAFF]
              px-[8px]
              py-[4px]
              text-[8px]
              font-semibold
              text-[#24598A]
            "
          >
            Qualified
          </span>
        </div>

        {/* Assigned To */}
        <div className="flex items-center gap-[7px]">
          <div
            className="
              flex
              h-[18px]
              w-[18px]
              items-center
              justify-center
              rounded-full
              bg-[#DCE5ED]
              text-[7px]
              font-semibold
              text-[#526B80]
            "
          >
            MD
          </div>

          <span
            className="
              text-[9px]
              font-medium
              text-[#526B80]
            "
          >
            Mark D.
          </span>
        </div>

        {/* Estimated Value */}
        <div className="text-right">
          <span
            className="
              text-[9px]
              font-semibold
              text-[#173B5C]
            "
          >
            $45,000
          </span>
        </div>
      </div>

      {/* =========================
          PAGINATION
      ========================== */}
      <div
        className="
          flex
          h-[46px]
          items-center
          justify-between
          px-[17px]
        "
      >
        {/* Entries */}
        <p
          className="
            text-[8px]
            font-medium
            text-[#667B8E]
          "
        >
          Showing 1 to 10 of{" "}
          <span className="font-semibold text-[#173B5C]">
            2,451
          </span>{" "}
          entries
        </p>

        {/* Pagination */}
        <div className="flex items-center gap-[7px]">

          {/* Previous */}
          <button
            type="button"
            className="
              flex
              h-[25px]
              w-[25px]
              items-center
              justify-center
              text-[#A0ADB8]
            "
          >
            <ChevronLeft size={12} />
          </button>

          {/* Page 1 */}
          <button
            type="button"
            className="
              flex
              h-[25px]
              w-[25px]
              items-center
              justify-center
              rounded-[4px]
              bg-[#0B3D6B]
              text-[9px]
              font-semibold
              text-white
            "
          >
            1
          </button>

          {/* Page 2 */}
          <button
            type="button"
            className="
              flex
              h-[25px]
              w-[25px]
              items-center
              justify-center
              text-[9px]
              font-medium
              text-[#526B80]
            "
          >
            2
          </button>

          {/* Page 3 */}
          <button
            type="button"
            className="
              flex
              h-[25px]
              w-[25px]
              items-center
              justify-center
              text-[9px]
              font-medium
              text-[#526B80]
            "
          >
            3
          </button>

          {/* Dots */}
          <span
            className="
              px-[2px]
              text-[9px]
              text-[#8292A0]
            "
          >
            ...
          </span>

          {/* Page 245 */}
          <button
            type="button"
            className="
              flex
              h-[25px]
              min-w-[25px]
              items-center
              justify-center
              text-[9px]
              font-medium
              text-[#526B80]
            "
          >
            245
          </button>

          {/* Next */}
          <button
            type="button"
            className="
              flex
              h-[25px]
              w-[25px]
              items-center
              justify-center
              text-[#526B80]
            "
          >
            <ChevronRight size={12} />
          </button>

        </div>
      </div>
    </section>
  );
};

/* =========================
   TABLE HEADER COMPONENT
========================= */

const TableHeader = ({ text, align = "left" }) => {
  return (
    <div
      className={`
        text-[8px]
        font-semibold
        tracking-[0.3px]
        text-[#62778B]
        ${align === "right" ? "text-right" : "text-left"}
      `}
    >
      {text}
    </div>
  );
};

export default LeadsTable;