const Footer = () => {
  return (
    <footer className="w-full bg-[#071D35]">
      <div
        className="
          flex
          h-[80px]
          w-full
          items-center
          justify-between
          px-[20px]
          sm:px-[24px]
          md:px-[26px]
        "
      >
        {/* ================================================
            LEFT — LOGO
        ================================================= */}

        <div className="flex items-center gap-[8px]">
          {/* BusinessFlow Mark */}
          <div
            className="
              relative
              h-[21px]
              w-[21px]
              shrink-0
            "
          >
            {/* Center */}
            <span
              className="
                absolute
                left-1/2
                top-1/2
                h-[6px]
                w-[6px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-white
              "
            />

            {/* Top */}
            <span
              className="
                absolute
                left-1/2
                top-0
                h-[6px]
                w-[6px]
                -translate-x-1/2
                rounded-full
                bg-white
              "
            />

            {/* Bottom */}
            <span
              className="
                absolute
                bottom-0
                left-1/2
                h-[6px]
                w-[6px]
                -translate-x-1/2
                rounded-full
                bg-white
              "
            />

            {/* Left */}
            <span
              className="
                absolute
                left-0
                top-1/2
                h-[6px]
                w-[6px]
                -translate-y-1/2
                rounded-full
                bg-white
              "
            />

            {/* Right */}
            <span
              className="
                absolute
                right-0
                top-1/2
                h-[6px]
                w-[6px]
                -translate-y-1/2
                rounded-full
                bg-white
              "
            />

            {/* Diagonal connectors */}
            <span
              className="
                absolute
                left-[5px]
                top-[5px]
                h-[11px]
                w-[11px]
                rotate-45
                border-l
                border-t
                border-white
                opacity-90
              "
            />
          </div>

          <span
            className="
              text-[18px]
              font-semibold
              leading-none
              tracking-[-0.35px]
              text-white
            "
          >
            BusinessFlow AI
          </span>
        </div>

        {/* ================================================
            RIGHT — COPYRIGHT
        ================================================= */}

        <p
          className="
            text-[12px]
            font-normal
            leading-none
            tracking-[0.05px]
            text-[#AFC1D2]
          "
        >
          © 2026 BusinessFlow AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;