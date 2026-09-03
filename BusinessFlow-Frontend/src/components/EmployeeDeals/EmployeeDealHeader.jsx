import { Plus } from "lucide-react";

const EmployeeDealHeader = ({ onAddDeal }) => {
  return (
    <div className="flex w-full items-start justify-between">
      {/* Left */}
      <div>
        <h1 className="text-[24px] font-bold leading-tight text-[#071D35]">
          My Deals
        </h1>

        <p className="mt-1 text-[10px] text-[#60758A]">
          Track and manage the deals currently assigned to you.
        </p>
      </div>

      {/* Add Deal */}
      <button
        type="button"
        onClick={onAddDeal}
        className="
          flex
          h-[30px]
          items-center
          gap-1.5
          rounded-[6px]
          bg-[#0B3D6B]
          px-3
          text-[9px]
          font-semibold
          text-white
          transition-colors
          hover:bg-[#082F54]
        "
      >
        <Plus
          size={11}
          strokeWidth={2}
        />

        <span>New Deal</span>
      </button>
    </div>
  );
};

export default EmployeeDealHeader;