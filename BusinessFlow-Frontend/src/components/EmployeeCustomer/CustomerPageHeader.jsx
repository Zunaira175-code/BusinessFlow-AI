import { Plus } from "lucide-react";

const CustomerPageHeader = ({ onAddCustomer }) => {
  return (
    <div className="flex w-full items-start justify-between gap-4">
      {/* Left */}
      <div>
        <h1 className="text-[24px] font-bold leading-tight tracking-[-0.5px] text-[#071D35]">
          My Customers
        </h1>

        <p className="mt-1 text-[11px] text-[#60758A]">
          Manage and track the customers assigned to you.
        </p>
      </div>

      {/* Add Customer */}
      <button
        type="button"
        onClick={onAddCustomer}
        className="
          flex
          h-[30px]
          shrink-0
          items-center
          gap-1.5
          rounded-[6px]
          bg-[#0B3D6B]
          px-3
          text-[9px]
          font-semibold
          text-white
          shadow-sm
          transition-colors
          duration-200
          hover:bg-[#092F54]
        "
      >
        <Plus
          size={12}
          strokeWidth={2}
        />

        <span>Add Customer</span>
      </button>
    </div>
  );
};

export default CustomerPageHeader;