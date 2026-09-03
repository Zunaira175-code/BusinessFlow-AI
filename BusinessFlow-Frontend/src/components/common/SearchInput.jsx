import { Search, X } from "lucide-react";

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  showClear = false,
  onClear,
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <Search
        size={17}
        strokeWidth={1.8}
        className="
          pointer-events-none
          absolute
          left-3.5
          top-1/2
          -translate-y-1/2
          text-[#718599]
        "
      />

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          h-[40px]
          w-full
          rounded-[9px]
          border
          border-[#D9E2EA]
          bg-white
          pl-[42px]
          pr-10
          text-[13px]
          font-medium
          text-[#193B5B]
          outline-none
          placeholder:text-[#93A2B0]
          transition-all
          duration-200
          focus:border-[#AFC3D5]
          focus:ring-2
          focus:ring-[#0B3D6B]/5
        "
      />

      {/* Clear Button */}
      {showClear && value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="
            absolute
            right-3
            top-1/2
            flex
            h-6
            w-6
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            text-[#718599]
            transition
            hover:bg-[#F1F5F8]
            hover:text-[#334B61]
          "
        >
          <X size={14} strokeWidth={2} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;