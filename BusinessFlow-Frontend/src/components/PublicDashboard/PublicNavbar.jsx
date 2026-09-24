import { Menu, X, Zap } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logoBlue from "../../assets/logos/Logo-b.png";


const PublicNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const location = useLocation();
  const navigate = useNavigate();

  /* =====================================================
     NAV ITEMS
     Pricing removed
  ====================================================== */

  const navItems = [
    {
      id: "features",
      label: "Features",
    },
    {
      id: "solutions",
      label: "Solutions",
    },
    {
      id: "ai",
      label: "AI Capabilities",
    },
    {
      id: "contact",
      label: "Contact",
    },
  ];

  /* =====================================================
     ACTIVE SECTION DETECTION
  ====================================================== */

  useEffect(() => {
    // Contact page
    if (location.pathname === "/contact") {
      setActiveSection("contact");
      return;
    }

    // Other pages
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sections = [
      "home",
      "features",
      "solutions",
      "ai",
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;

      let currentSection = "home";

      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);

        if (
          section &&
          section.offsetTop <= scrollPosition
        ) {
          currentSection = sectionId;
        }
      });

      setActiveSection(currentSection);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  /* =====================================================
     CLOSE MOBILE MENU
  ====================================================== */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* =====================================================
     HOME SECTION SCROLL
  ====================================================== */

  const handleSectionClick = (sectionId) => {
    closeMenu();

    // Contact is a separate page
    if (sectionId === "contact") {
      navigate("/contact");
      return;
    }

    // If not on homepage, go home first
    if (location.pathname !== "/") {
      navigate("/");

      // Wait for homepage to render
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);

      return;
    }

    scrollToSection(sectionId);
  };

  /* =====================================================
     SCROLL TO SECTION
  ====================================================== */

  const scrollToSection = (sectionId) => {
    if (sectionId === "home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setActiveSection("home");
      return;
    }

    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    const navbarHeight = 64;

    const top =
      section.getBoundingClientRect().top +
      window.scrollY -
      navbarHeight;

    window.scrollTo({
      top,
      behavior: "smooth",
    });

    setActiveSection(sectionId);
  };

  /* =====================================================
     NAV LINK CLASS
  ====================================================== */

  const getNavClass = (isActive) => `
    relative
    rounded-[7px]
    px-3.5
    py-2
    text-[13px]
    font-medium
    transition-all
    duration-300

    ${
      isActive
        ? `
          bg-[#E8F2FF]
          text-[#0B5A96]
          shadow-[0_3px_12px_rgba(40,121,215,0.08)]
        `
        : `
          text-[#30465B]
          hover:bg-[#F0F5FA]
          hover:text-[#0B5A96]
        `
    }
  `;

  /* =====================================================
     ACTIVE INDICATOR
  ====================================================== */

  const ActiveIndicator = () => (
    <span
      className="
        absolute
        bottom-[3px]
        left-1/2
        h-[2px]
        w-[16px]
        -translate-x-1/2
        rounded-full
        bg-[#2879D7]
      "
    />
  );

  return (
    <header
      className="
        sticky
        top-0
        z-50
        h-[64px]
        border-b
        border-[#DCE5EF]
        bg-[#F8F9FD]/95
        backdrop-blur-xl
      "
    >
      {/* =================================================
          NAVBAR CONTAINER
      ================================================== */}

      <div
        className="
          mx-auto
          flex
          h-full
          w-full
          max-w-[1320px]
          items-center
          justify-between
          px-5
          sm:px-8
          lg:px-10
          xl:px-12
        "
      >
        {/* =================================================
            LOGO
        ================================================== */}

        <Link
          to="/"
          onClick={() => {
            closeMenu();
            setActiveSection("home");
          }}
          className="
            flex
            shrink-0
            items-center
            gap-2
          "
        >
          <img
  src={logoBlue}
  alt="BusinessFlow AI"
  className="
    h-[48px]
    w-auto
    max-w-[240px]
    object-contain
    object-left
  "
/>
        </Link>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================== */}

        <nav
          className="
            hidden
            items-center
            gap-1
            md:flex
          "
        >
          {navItems.map((item) => {
            const isActive =
              activeSection === item.id;

            /* ---------------------------------------------
               CONTACT
            --------------------------------------------- */

            if (item.id === "contact") {
              return (
                <Link
                  key={item.id}
                  to="/contact"
                  onClick={closeMenu}
                  className={getNavClass(isActive)}
                >
                  {item.label}

                  {isActive && <ActiveIndicator />}
                </Link>
              );
            }

            /* ---------------------------------------------
               HOME SECTIONS
            --------------------------------------------- */

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  handleSectionClick(item.id)
                }
                className={getNavClass(isActive)}
              >
                {item.label}

                {isActive && <ActiveIndicator />}
              </button>
            );
          })}
        </nav>

        {/* =================================================
            DESKTOP ACTIONS
        ================================================== */}

        <div
          className="
            hidden
            items-center
            gap-2
            md:flex
          "
        >
          <Link
            to="/login"
            className="
              flex
              h-[36px]
              items-center
              justify-center
              rounded-[7px]
              border
              border-[#AABBCD]
              bg-white
              px-4
              text-[12px]
              font-semibold
              text-[#173B5C]
              transition-all
              duration-300
              hover:-translate-y-[1px]
              hover:border-[#7F9BB7]
              hover:bg-[#F7FAFD]
            "
          >
            Login
          </Link>

          <Link
            to="/register"
            className="
              flex
              h-[36px]
              items-center
              justify-center
              rounded-[7px]
              bg-[#0B3D6B]
              px-5
              text-[12px]
              font-semibold
              text-white
              shadow-[0_5px_14px_rgba(11,61,107,0.16)]
              transition-all
              duration-300
              hover:-translate-y-[1px]
              hover:bg-[#092F54]
              hover:shadow-[0_8px_20px_rgba(11,61,107,0.23)]
            "
          >
            Get Started
          </Link>
        </div>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={() =>
            setMenuOpen((current) => !current)
          }
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-[7px]
            border
            border-[#D2DDE8]
            bg-white
            transition-all
            duration-200
            hover:border-[#9DB4CA]
            md:hidden
          "
        >
          {menuOpen ? (
            <X
              size={19}
              strokeWidth={2}
              className="text-[#173B5C]"
            />
          ) : (
            <Menu
              size={19}
              strokeWidth={2}
              className="text-[#173B5C]"
            />
          )}
        </button>
      </div>

      {/* =================================================
          MOBILE MENU
      ================================================== */}

      {menuOpen && (
        <div
          className="
            border-b
            border-[#DCE5EF]
            bg-white/98
            px-5
            py-5
            shadow-[0_12px_30px_rgba(20,50,80,0.10)]
            backdrop-blur-xl
            md:hidden
          "
        >
          <div className="flex flex-col gap-1">

            {navItems.map((item) => {
              const isActive =
                activeSection === item.id;

              /* -------------------------------------------
                 MOBILE CONTACT
              ------------------------------------------- */

              if (item.id === "contact") {
                return (
                  <Link
                    key={item.id}
                    to="/contact"
                    onClick={closeMenu}
                    className={`
                      flex
                      w-full
                      items-center
                      rounded-[8px]
                      px-3.5
                      py-3
                      text-left
                      text-[13px]
                      font-medium
                      transition-all
                      duration-200

                      ${
                        isActive
                          ? "bg-[#E8F2FF] text-[#0B5A96]"
                          : "text-[#30465B] hover:bg-[#F5F8FB]"
                      }
                    `}
                  >
                    {item.label}

                    {isActive && (
                      <span
                        className="
                          ml-auto
                          h-2
                          w-2
                          rounded-full
                          bg-[#2879D7]
                        "
                      />
                    )}
                  </Link>
                );
              }

              /* -------------------------------------------
                 MOBILE HOME SECTIONS
              ------------------------------------------- */

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    handleSectionClick(item.id)
                  }
                  className={`
                    flex
                    w-full
                    items-center
                    rounded-[8px]
                    px-3.5
                    py-3
                    text-left
                    text-[13px]
                    font-medium
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? "bg-[#E8F2FF] text-[#0B5A96]"
                        : "text-[#30465B] hover:bg-[#F5F8FB]"
                    }
                  `}
                >
                  {item.label}

                  {isActive && (
                    <span
                      className="
                        ml-auto
                        h-2
                        w-2
                        rounded-full
                        bg-[#2879D7]
                      "
                    />
                  )}
                </button>
              );
            })}

            {/* =================================================
                MOBILE ACTIONS
            ================================================== */}

            <div
              className="
                mt-3
                flex
                gap-2
                border-t
                border-[#E5EBF1]
                pt-4
              "
            >
              <Link
                to="/login"
                onClick={closeMenu}
                className="
                  flex
                  h-[40px]
                  flex-1
                  items-center
                  justify-center
                  rounded-[7px]
                  border
                  border-[#B8C6D4]
                  text-[12px]
                  font-semibold
                  text-[#173B5C]
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                className="
                  flex
                  h-[40px]
                  flex-1
                  items-center
                  justify-center
                  rounded-[7px]
                  bg-[#0B3D6B]
                  text-[12px]
                  font-semibold
                  text-white
                "
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;