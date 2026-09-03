import {
  GitBranch,
  Share2,
  Mail,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#071D35] text-white">

      {/* =====================================================
          FOOTER MAIN
      ====================================================== */}
      <div className="px-5 py-7">

        <div
          className="
            grid
            grid-cols-1
            gap-6
            sm:grid-cols-2
            lg:grid-cols-[1.8fr_1fr_1fr_1fr]
          "
        >

          {/* =================================================
              BRAND
          ================================================= */}
          <div>

            <div className="flex items-center gap-2.5">

              {/* Logo */}
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-[6px]
                  bg-white
                  text-[#0B3F70]
                "
              >
                <span className="text-[13px] font-bold">
                  ▣
                </span>
              </div>

              {/* Brand Name */}
              <h2
                className="
                  text-[15px]
                  font-semibold
                  tracking-[-0.2px]
                "
              >
                BusinessFlow AI
              </h2>

            </div>

            {/* Description */}
            <p
              className="
                mt-3
                max-w-[250px]
                text-[10px]
                leading-4
                text-[#8EABC5]
              "
            >
              AI-powered CRM for modern sales teams.
            </p>

            {/* Social Icons */}
            <div className="mt-4 flex items-center gap-2">

              <SocialButton>
                <GitBranch
                  size={12}
                  strokeWidth={1.8}
                />
              </SocialButton>

              <SocialButton>
                <Share2
                  size={12}
                  strokeWidth={1.8}
                />
              </SocialButton>

              <SocialButton>
                <Mail
                  size={12}
                  strokeWidth={1.8}
                />
              </SocialButton>

            </div>

          </div>


          {/* =================================================
              PRODUCT
          ================================================== */}
          <FooterColumn
            title="PRODUCT"
            links={[
              "Features",
              "Pricing",
              "Integrations",
              "Updates",
            ]}
          />


          {/* =================================================
              RESOURCES
          ================================================== */}
          <FooterColumn
            title="RESOURCES"
            links={[
              "Help Center",
              "Documentation",
              "Guides",
              "API Reference",
            ]}
          />


          {/* =================================================
              COMPANY
          ================================================== */}
          <FooterColumn
            title="COMPANY"
            links={[
              "About Us",
              "Careers",
              "Contact Us",
              "Privacy Policy",
            ]}
          />

        </div>

      </div>


      {/* =====================================================
          DIVIDER
      ====================================================== */}
      <div className="mx-5 border-t border-white/[0.08]" />


      {/* =====================================================
          NEWSLETTER
      ====================================================== */}
      <div
        className="
          flex
          flex-col
          gap-3
          px-5
          py-5
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        {/* Newsletter Text */}
        <div>

          <h3
            className="
              text-[12px]
              font-semibold
              text-white
            "
          >
            Stay Updated
          </h3>

          <p
            className="
              mt-1
              text-[9px]
              text-[#8EABC5]
            "
          >
            Subscribe for product updates and insights.
          </p>

        </div>


        {/* Newsletter Form */}
        <div className="flex items-center gap-2">

          <input
            type="email"
            placeholder="Enter your email"
            className="
              h-[32px]
              w-[210px]
              rounded-[5px]
              border
              border-white/[0.12]
              bg-white/[0.05]
              px-3
              text-[9px]
              text-white
              outline-none
              placeholder:text-[#7292AE]
              focus:border-white/25
              focus:bg-white/[0.07]
            "
          />

          <button
            type="button"
            className="
              h-[32px]
              rounded-[5px]
              bg-[#BBDCF8]
              px-4
              text-[9px]
              font-semibold
              text-[#123C61]
              transition-all
              duration-200
              hover:bg-white
              active:scale-[0.98]
            "
          >
            Subscribe
          </button>

        </div>

      </div>


      {/* =====================================================
          BOTTOM DIVIDER
      ====================================================== */}
      <div className="mx-5 border-t border-white/[0.08]" />


      {/* =====================================================
          COPYRIGHT / LEGAL
      ====================================================== */}
      <div
        className="
          flex
          min-h-[42px]
          flex-col
          justify-center
          gap-2
          px-5
          py-2
          text-[8px]
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        {/* Copyright */}
        <p className="text-[8px] text-[#7897B3]">
          © 2026 BusinessFlow AI. All rights reserved.
        </p>


        {/* Legal Links */}
        <div
          className="
            flex
            items-center
            gap-4
            text-[8px]
            text-[#7897B3]
          "
        >

          <a
            href="#"
            className="
              transition-colors
              hover:text-white
            "
          >
            Privacy
          </a>

          <a
            href="#"
            className="
              transition-colors
              hover:text-white
            "
          >
            Terms
          </a>

          <a
            href="#"
            className="
              transition-colors
              hover:text-white
            "
          >
            Help Center
          </a>

        </div>

      </div>

    </footer>
  );
};


/* =========================================================
   FOOTER COLUMN
========================================================= */

const FooterColumn = ({ title, links }) => {
  return (
    <div>

      {/* Column Heading */}
      <h3
        className="
          text-[10px]
          font-semibold
          tracking-[0.5px]
          text-white
        "
      >
        {title}
      </h3>


      {/* Links */}
      <ul className="mt-3 space-y-2">

        {links.map((link) => (
          <li key={link}>

            <a
              href="#"
              className="
                text-[9px]
                text-[#8EABC5]
                transition-colors
                duration-200
                hover:text-white
              "
            >
              {link}
            </a>

          </li>
        ))}

      </ul>

    </div>
  );
};


/* =========================================================
   SOCIAL BUTTON
========================================================= */

const SocialButton = ({ children }) => {
  return (
    <a
      href="#"
      aria-label="Social media"
      className="
        flex
        h-[26px]
        w-[26px]
        items-center
        justify-center
        rounded-full
        bg-white/[0.10]
        text-white
        transition-all
        duration-200
        hover:-translate-y-[1px]
        hover:bg-white/[0.18]
      "
    >
      {children}
    </a>
  );
};


export default Footer;