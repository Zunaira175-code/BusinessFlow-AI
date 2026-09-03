import { Menu, X, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const PublicNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  /* =====================================================
     ACTIVE SECTION DETECTION
  ====================================================== */

  useEffect(() => {
    const sections = [
      "home",
      "features",
      "solutions",
      "ai",
      "pricing",
      "contact",
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;

      let currentSection = "home";

      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);

        if (section && section.offsetTop <= scrollPosition) {
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
  }, []);


  /* =====================================================
     SMOOTH SCROLL
  ====================================================== */

  const handleSectionClick = (sectionId) => {
    setMenuOpen(false);

    if (sectionId === "home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const section = document.getElementById(sectionId);

    if (section) {
      const navbarHeight = 58;

      const top =
        section.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };


  /* =====================================================
     NAV ITEMS
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
      id: "pricing",
      label: "Pricing",
    },
    {
      id: "contact",
      label: "Contact",
    },
  ];


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
      ================================================= */}

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
        ================================================= */}

        <Link
          to="/"
          onClick={() => {
            setMenuOpen(false);
            setActiveSection("home");
          }}
          className="
            flex
            shrink-0
            items-center
            gap-2
          "
        >

          <div
            className="
              flex
              h-[28px]
              w-[28px]
              items-center
              justify-center
              rounded-[7px]
              bg-[#E8F2FF]
            "
          >
            <Zap
              size={18}
              strokeWidth={2.3}
              className="
                fill-[#0B3D6B]
                text-[#0B3D6B]
              "
            />
          </div>


          <span
            className="
              text-[17px]
              font-bold
              tracking-[-0.5px]
              text-[#0A2139]
            "
          >
            BusinessFlow AI
          </span>

        </Link>


        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

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

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  handleSectionClick(item.id)
                }
                className={`
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
                `}
              >

                {item.label}

                {/* Active indicator */}

                {isActive && (
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
                )}

              </button>
            );
          })}

        </nav>


        {/* =================================================
            DESKTOP ACTIONS
        ================================================= */}

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
        ================================================= */}

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
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
      ================================================= */}

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


            {/* Mobile Actions */}

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
                onClick={() =>
                  setMenuOpen(false)
                }
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
                onClick={() =>
                  setMenuOpen(false)
                }
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