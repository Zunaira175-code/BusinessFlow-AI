import { ChevronDown } from "lucide-react";

const RegionalDisplay = () => {
  return (
    <section
      className="
        mt-6
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
        px-4
        pb-4
        pt-4
      "
    >
      {/* Header */}
      <div
        className="
          border-b
          border-[#DCE5ED]
          pb-3
        "
      >
        <h2
          className="
            text-[13px]
            font-bold
            text-[#17324D]
          "
        >
          Regional & Display
        </h2>
      </div>

      {/* Fields */}
      <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4">

        {/* Timezone */}
        <SelectField
          label="Timezone"
          value="UTC+05:00 (Yekaterinburg Time)"
        />

        {/* Language */}
        <SelectField
          label="Language"
          value="English (US)"
        />

        {/* Date Format */}
        <SelectField
          label="Date Format"
          value="MM/DD/YYYY"
        />

        {/* Theme */}
        <SelectField
          label="Theme"
          value="System Default"
        />

      </div>
    </section>
  );
};

const SelectField = ({ label, value }) => {
  return (
    <div>
      <label
        className="
          mb-1.5
          block
          text-[8px]
          font-semibold
          text-[#17324D]
        "
      >
        {label}
      </label>

      <button
        type="button"
        className="
          flex
          h-[33px]
          w-full
          items-center
          justify-between
          rounded-[6px]
          border
          border-[#DCE5ED]
          bg-white
          px-3
          text-left
          text-[9px]
          text-[#17324D]
          transition
          hover:border-[#B8C9D8]
        "
      >
        <span>{value}</span>

        <ChevronDown
          size={13}
          strokeWidth={1.6}
          className="text-[#60758A]"
        />
      </button>
    </div>
  );
};

export default RegionalDisplay;