import { Plus } from "lucide-react";

const EmployeeLeadHeader = ({
  onAddLead,
}) => {
  return (
    <div
      className="
        flex
        w-full
        items-start
        justify-between
        gap-4
      "
    >
      {/* =====================================================
          LEFT
      ====================================================== */}
      <div>
        <h1
          className="
            text-[24px]
            font-bold
            leading-[28px]
            tracking-[-0.5px]
            text-[#071D35]
          "
        >
          My Leads
        </h1>

        <p
          className="
            mt-1
            text-[10px]
            leading-[14px]
            text-[#718599]
          "
        >
          Manage and track the leads assigned to you.
        </p>
      </div>

      {/* =====================================================
          ADD LEAD BUTTON
      ====================================================== */}
      <button
        type="button"
        onClick={onAddLead}
        className="
          flex
          h-[30px]
          shrink-0
          items-center
          justify-center
          gap-1.5
          rounded-[6px]
          bg-[#0B3D6B]
          px-3
          text-[9px]
          font-semibold
          text-white
          shadow-sm
          transition-all
          duration-200
          hover:bg-[#092F54]
        "
      >
        <Plus
          size={11}
          strokeWidth={2.2}
        />

        <span>
          Add Lead
        </span>
      </button>
    </div>
  );
};

export default EmployeeLeadHeader;