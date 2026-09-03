const DealsToolbar = () => {
  return (
    <section className="mt-5 w-full">
      <div
        className="
          flex
          min-h-[62px]
          w-full
          items-center
          justify-between
          rounded-[8px]
          border
          border-[#DCE5EE]
          bg-white
          px-[12px]
          shadow-[0_1px_2px_rgba(15,42,66,0.03)]
        "
      >
        {/* Left Controls */}
        <div className="flex items-center gap-[8px]">

          {/* Board / List */}
          <div
            className="
              flex
              h-[34px]
              items-center
              rounded-[5px]
              border
              border-[#DDE6EF]
              bg-[#F8FAFD]
              p-[3px]
            "
          >
            <button
              type="button"
              className="
                flex
                h-[28px]
                items-center
                gap-[5px]
                rounded-[4px]
                bg-white
                px-[9px]
                text-[11px]
                font-medium
                text-[#183B5A]
                shadow-[0_1px_2px_rgba(15,42,66,0.05)]
              "
            >
              <span className="text-[11px]">▣</span>
              Board
            </button>

            <button
              type="button"
              className="
                flex
                h-[28px]
                items-center
                gap-[5px]
                rounded-[4px]
                px-[9px]
                text-[11px]
                font-medium
                text-[#687C8F]
              "
            >
              <span className="text-[10px]">☷</span>
              List
            </button>
          </div>

          {/* Divider */}
          <div className="mx-[5px] h-[30px] w-px bg-[#E1E8EF]" />

          {/* Owner */}
          <button
            type="button"
            className="
              flex
              h-[34px]
              items-center
              gap-[7px]
              rounded-[5px]
              border
              border-[#DCE5EE]
              bg-[#F8FAFD]
              px-[10px]
              text-[11px]
              font-medium
              text-[#60758A]
            "
          >
            Owner
            <span className="text-[9px]">▼</span>
          </button>

          {/* Value */}
          <button
            type="button"
            className="
              flex
              h-[34px]
              items-center
              gap-[7px]
              rounded-[5px]
              border
              border-[#DCE5EE]
              bg-[#F8FAFD]
              px-[10px]
              text-[11px]
              font-medium
              text-[#60758A]
            "
          >
            Value
            <span className="text-[9px]">▼</span>
          </button>

          {/* Close Date */}
          <button
            type="button"
            className="
              flex
              h-[34px]
              items-center
              gap-[7px]
              rounded-[5px]
              border
              border-[#DCE5EE]
              bg-[#F8FAFD]
              px-[10px]
              text-[11px]
              font-medium
              text-[#60758A]
            "
          >
            Close Date
            <span className="text-[9px]">▼</span>
          </button>
        </div>

        {/* More Filters */}
        <button
          type="button"
          className="
            flex
            items-center
            gap-[5px]
            px-[8px]
            text-[11px]
            font-medium
            text-[#60758A]
            transition-colors
            hover:text-[#0B3D6B]
          "
        >
          <span className="text-[12px]">≡</span>
          More Filters
        </button>
      </div>
    </section>
  );
};

export default DealsToolbar;