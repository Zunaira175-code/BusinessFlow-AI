import {
  Search,
  CircleHelp,
  Bell,
  Plus,
} from "lucide-react";

const Header = () => {
  return (
    <header className="h-[68px] w-full border-b border-[#E6EBF0] bg-white">
      <div className="flex h-full items-center px-6">

        {/* Search */}
        <div className="relative w-[300px] shrink-0">
          <Search
            size={17}
            strokeWidth={1.8}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-[#64798D]
            "
          />

          <input
            type="text"
            placeholder="Search across workspace..."
            className="
              h-[44px]
              w-full
              rounded-[9px]
              border
              border-[#D9E2EA]
              bg-white
              pl-[45px]
              pr-4
              text-[13px]
              font-medium
              text-[#193B5B]
              outline-none
              placeholder:text-[#93A2B0]
              transition
              focus:border-[#AFC3D5]
              focus:ring-2
              focus:ring-[#0B3D6B]/5
            "
          />
        </div>

        {/* Navigation */}
        <nav className="ml-[85px] flex items-center gap-[58px]">

          <button
            type="button"
            className="
              whitespace-nowrap
              text-[13px]
              font-medium
              text-[#193B5B]
              transition
              hover:text-[#0B3D6B]
            "
          >
            Direct Messages
          </button>

          <button
            type="button"
            className="
              whitespace-nowrap
              text-[13px]
              font-medium
              text-[#193B5B]
              transition
              hover:text-[#0B3D6B]
            "
          >
            Reports
          </button>

        </nav>

        {/* Right Actions */}
        <div className="ml-auto flex items-center">

          {/* Import */}
          <button
            type="button"
            className="
              flex
              h-[40px]
              min-w-[82px]
              items-center
              justify-center
              rounded-[9px]
              border
              border-[#D8E1E9]
              bg-white
              px-4
              text-[13px]
              font-medium
              text-[#193B5B]
              transition
              hover:bg-[#F8FAFC]
            "
          >
            Import
          </button>

          {/* New Lead */}
          <button
            type="button"
            className="
              ml-3
              flex
              h-[40px]
              min-w-[132px]
              items-center
              justify-center
              gap-2
              rounded-[9px]
              bg-[#0B3D6B]
              px-4
              text-[13px]
              font-semibold
              text-white
              transition
              hover:bg-[#09365F]
              active:scale-[0.98]
            "
          >
            <Plus
              size={15}
              strokeWidth={2.4}
            />

            <span className="whitespace-nowrap">
              New Lead
            </span>
          </button>

          {/* Divider */}
          <div className="mx-5 h-[32px] w-px bg-[#E5EAF0]" />

          {/* Help */}
          <button
            type="button"
            aria-label="Help"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-[#304B64]
              transition
              hover:bg-[#F4F7FA]
            "
          >
            <CircleHelp
              size={21}
              strokeWidth={1.7}
            />
          </button>

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            className="
              relative
              ml-3
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-[#304B64]
              transition
              hover:bg-[#F4F7FA]
            "
          >
            <Bell
              size={21}
              strokeWidth={1.7}
            />

            <span
              className="
                absolute
                right-[4px]
                top-[3px]
                h-[6px]
                w-[6px]
                rounded-full
                bg-[#EF4444]
                ring-2
                ring-white
              "
            />
          </button>

          {/* Profile */}
          <button
            type="button"
            aria-label="Profile"
            className="
              ml-4
              flex
              h-[36px]
              w-[36px]
              items-center
              justify-center
              rounded-full
              border
              border-[#D8E1E9]
              bg-[#EAF0F5]
              text-[11px]
              font-semibold
              text-[#24445F]
            "
          >
            AU
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;