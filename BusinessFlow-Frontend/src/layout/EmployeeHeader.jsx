import {
  CircleHelp,
  Grid3X3,
} from "lucide-react";

const EmployeeHeader = () => {
  return (
    <header
      className="
        flex
        h-[48px]
        w-full
        items-center
        justify-end
        border-b
        border-[#DCE5ED]
        bg-white
        px-5
      "
    >
      <div className="flex items-center">

        {/* Help */}
        <button
          type="button"
          aria-label="Help"
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-md
            text-[#60758A]
            transition-colors
            hover:bg-[#F3F6F9]
            hover:text-[#17324D]
          "
        >
          <CircleHelp
            size={14}
            strokeWidth={1.7}
          />
        </button>

        {/* Apps */}
        <button
          type="button"
          aria-label="Apps"
          className="
            ml-1
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-md
            text-[#60758A]
            transition-colors
            hover:bg-[#F3F6F9]
            hover:text-[#17324D]
          "
        >
          <Grid3X3
            size={13}
            strokeWidth={1.7}
          />
        </button>

        {/* Divider */}
        <div
          className="
            mx-3
            h-6
            w-px
            bg-[#DCE5ED]
          "
        />

        {/* Profile */}
        <button
          type="button"
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            overflow-hidden
            rounded-full
            border
            border-[#DCE5ED]
            bg-[#F3F6F9]
          "
          aria-label="Profile"
        >
          <img
            src="https://i.pravatar.cc/100?img=12"
            alt="Alex Rivers"
            className="h-full w-full object-cover"
          />
        </button>

      </div>
    </header>
  );
};

export default EmployeeHeader;